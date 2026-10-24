import type { CompressionResult, CompressionPreset } from './types.ts';
import { validateOutputBlob } from './output-validation.ts';
import { compareFileSizes } from './file-size.ts';
import { CompressionError } from './compression-errors.ts';

export interface PngSettings {
  preset: CompressionPreset;
  /** 'indexed' for lossy PNG-8 palette quantization, 'lossless' for non-destructive optimization */
  mode: 'indexed' | 'lossless';
  /** Maximum palette colors when mode is 'indexed' */
  maxColors: 32 | 64 | 128 | 256;
  /** Scale factor between 0.2 and 1.0 (1.0 = original dimensions) */
  scale: number;
  maxWidth?: number;
}

/**
 * Standard CRC-32 table for PNG chunk validation.
 */
const CRC_TABLE = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) {
      c = 0xedb88320 ^ (c >>> 1);
    } else {
      c = c >>> 1;
    }
  }
  CRC_TABLE[n] = c;
}

export function crc32(buf: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

/**
 * Build a valid PNG chunk: [4 bytes length][4 bytes type][data][4 bytes CRC-32].
 */
export function buildPngChunk(type: string, data: Uint8Array): Uint8Array {
  const typeBytes = new TextEncoder().encode(type);
  const chunkLength = data.length;
  const chunk = new Uint8Array(4 + 4 + chunkLength + 4);

  // 4 bytes length (big endian)
  chunk[0] = (chunkLength >>> 24) & 0xff;
  chunk[1] = (chunkLength >>> 16) & 0xff;
  chunk[2] = (chunkLength >>> 8) & 0xff;
  chunk[3] = chunkLength & 0xff;

  // 4 bytes type
  chunk.set(typeBytes, 4);

  // data
  chunk.set(data, 8);

  // CRC-32 over type + data
  const crcPayload = new Uint8Array(4 + chunkLength);
  crcPayload.set(typeBytes, 0);
  crcPayload.set(data, 4);
  const crcVal = crc32(crcPayload);

  const crcOffset = 8 + chunkLength;
  chunk[crcOffset] = (crcVal >>> 24) & 0xff;
  chunk[crcOffset + 1] = (crcVal >>> 16) & 0xff;
  chunk[crcOffset + 2] = (crcVal >>> 8) & 0xff;
  chunk[crcOffset + 3] = crcVal & 0xff;

  return chunk;
}

/**
 * Deflate byte buffer using browser-native CompressionStream('deflate') or zlib fallback.
 */
export async function deflateData(data: Uint8Array): Promise<Uint8Array> {
  if (typeof CompressionStream !== 'undefined') {
    const cs = new CompressionStream('deflate');
    const writer = cs.writable.getWriter();
    writer.write(data as unknown as BufferSource);
    writer.close();

    const chunks: Uint8Array[] = [];
    const reader = cs.readable.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) chunks.push(value);
    }

    const totalLen = chunks.reduce((acc, c) => acc + c.length, 0);
    const result = new Uint8Array(totalLen);
    let offset = 0;
    for (const c of chunks) {
      result.set(c, offset);
      offset += c.length;
    }
    return result;
  }

  throw new CompressionError('CompressionStream API is not supported in this environment.', 'UNSUPPORTED_ENGINE');
}

/**
 * Validates PNG signature (89 50 4E 47 0D 0A 1A 0A).
 */
export function isPngSignature(bytes: Uint8Array): boolean {
  if (bytes.length < 8) return false;
  return (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  );
}

/**
 * Compresses PNG images using quantization (PNG-8) or lossless chunk optimization.
 */
export async function compressPng(
  file: File,
  settings: PngSettings,
  onProgress?: (progress: number) => void
): Promise<CompressionResult> {
  const startTime = performance.now();
  onProgress?.(10);

  if (file.size === 0) {
    throw new CompressionError('Input PNG file is empty (0 bytes).', 'EMPTY_FILE');
  }

  const arrayBuffer = await file.arrayBuffer();
  const rawBytes = new Uint8Array(arrayBuffer);

  if (!isPngSignature(rawBytes)) {
    throw new CompressionError(
      'Invalid PNG image. File does not contain a valid PNG signature header.',
      'INVALID_PNG_HEADER'
    );
  }

  onProgress?.(25);

  // Decode image into RGBA pixels via ImageBitmap or HTMLImageElement
  let imageBitmap: ImageBitmap | HTMLImageElement;
  let originalWidth = 0;
  let originalHeight = 0;

  try {
    if (typeof createImageBitmap === 'function') {
      imageBitmap = await createImageBitmap(file);
      originalWidth = imageBitmap.width;
      originalHeight = imageBitmap.height;
    } else {
      imageBitmap = await loadPngImageElement(file);
      originalWidth = imageBitmap.naturalWidth || imageBitmap.width;
      originalHeight = imageBitmap.naturalHeight || imageBitmap.height;
    }
  } catch {
    try {
      imageBitmap = await loadPngImageElement(file);
      originalWidth = imageBitmap.naturalWidth || imageBitmap.width;
      originalHeight = imageBitmap.naturalHeight || imageBitmap.height;
    } catch (err) {
      throw new CompressionError('Failed to decode PNG image: ' + err, 'DECODE_FAILED');
    }
  }

  if (originalWidth === 0 || originalHeight === 0) {
    throw new CompressionError('PNG image dimensions are invalid (0x0).', 'INVALID_DIMENSIONS');
  }

  onProgress?.(45);

  // Compute target scaled dimensions
  let scale = settings.scale || 1.0;
  if (settings.preset === 'smaller' && scale > 0.75) {
    scale = 0.75;
  }

  if (settings.maxWidth && originalWidth > settings.maxWidth) {
    const maxScale = settings.maxWidth / originalWidth;
    scale = Math.min(scale, maxScale);
  }

  const targetWidth = Math.max(1, Math.round(originalWidth * scale));
  const targetHeight = Math.max(1, Math.round(originalHeight * scale));

  // Extract RGBA buffer
  let rgbaBuffer: Uint8ClampedArray;

  if (typeof OffscreenCanvas !== 'undefined') {
    const canvas = new OffscreenCanvas(targetWidth, targetHeight);
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) throw new CompressionError('Unable to acquire canvas context', 'CANVAS_FAILED');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(imageBitmap, 0, 0, targetWidth, targetHeight);
    rgbaBuffer = ctx.getImageData(0, 0, targetWidth, targetHeight).data;
  } else if (typeof document !== 'undefined') {
    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) throw new CompressionError('Unable to acquire canvas context', 'CANVAS_FAILED');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(imageBitmap, 0, 0, targetWidth, targetHeight);
    rgbaBuffer = ctx.getImageData(0, 0, targetWidth, targetHeight).data;
  } else {
    throw new CompressionError('No canvas environment available for decoding pixels', 'CANVAS_UNAVAILABLE');
  }

  if ('close' in imageBitmap && typeof imageBitmap.close === 'function') {
    imageBitmap.close();
  }

  onProgress?.(65);

  let outputBytes: Uint8Array;

  if (settings.mode === 'indexed') {
    // Mode: PNG-8 with Alpha Palette (Quantized)
    const maxColors = settings.maxColors || 128;
    outputBytes = await encodePng8(rgbaBuffer, targetWidth, targetHeight, maxColors);
  } else {
    // Mode: Lossless PNG-32 (RGBA optimized Deflate stream, stripped chunks)
    outputBytes = await encodePng32(rgbaBuffer, targetWidth, targetHeight);
  }

  onProgress?.(90);

  const outputBlob = new Blob([outputBytes as unknown as BlobPart], { type: 'image/png' });
  const validation = validateOutputBlob(outputBlob, 'image');
  if (!validation.isValid) {
    throw new CompressionError(validation.error || 'Invalid PNG output generated.', 'INVALID_OUTPUT');
  }

  onProgress?.(100);
  const endTime = performance.now();
  const comparison = compareFileSizes(file.size, outputBlob.size);

  const warnings: string[] = [];
  if (comparison.outcome === 'larger') {
    if (settings.mode === 'lossless') {
      warnings.push(
        'This image was already highly compressed. Try "Palette Quantization (PNG-8)" or reducing dimensions for substantial byte savings.'
      );
    } else {
      warnings.push(
        'Output size is slightly larger than the original. The original was already tightly indexed.'
      );
    }
  }

  return {
    blob: outputBlob,
    compressedSize: outputBlob.size,
    durationMs: endTime - startTime,
    width: targetWidth,
    height: targetHeight,
    mimeType: 'image/png',
    outcome: comparison.outcome,
    warnings,
  };
}

/**
 * Encode RGBA pixels as an indexed PNG-8 image with alpha transparency (PLTE + tRNS).
 */
export async function encodePng8(
  rgba: Uint8ClampedArray,
  width: number,
  height: number,
  maxColors: number
): Promise<Uint8Array> {
  const pixelCount = width * height;
  const colorMap = new Map<number, number>();

  // Collect color frequency (quantized to 5-bit color precision for clustering)
  for (let i = 0; i < pixelCount; i++) {
    const a = rgba[i * 4 + 3];
    if (a < 16) continue; // transparent pixel
    const r = rgba[i * 4] & 0xf8;
    const g = rgba[i * 4 + 1] & 0xf8;
    const b = rgba[i * 4 + 2] & 0xf8;
    const key = (r << 16) | (g << 8) | b;
    colorMap.set(key, (colorMap.get(key) || 0) + 1);
  }

  const sortedColors = Array.from(colorMap.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([key]) => [(key >> 16) & 0xff, (key >> 8) & 0xff, key & 0xff]);

  // Check if image uses any transparency
  let hasTransparent = false;
  for (let i = 0; i < pixelCount; i++) {
    if (rgba[i * 4 + 3] < 250) {
      hasTransparent = true;
      break;
    }
  }

  const paletteSize = Math.min(maxColors - (hasTransparent ? 1 : 0), Math.max(1, sortedColors.length));
  const palette: number[][] = [];
  const alphaTable: number[] = [];

  let transparentIndex: number | null = null;
  if (hasTransparent) {
    transparentIndex = 0;
    palette.push([0, 0, 0]);
    alphaTable.push(0); // completely transparent
  }

  for (let i = 0; i < paletteSize; i++) {
    const c = sortedColors[i] || [0, 0, 0];
    palette.push(c);
    alphaTable.push(255);
  }

  // Create scanlines: each scanline has 1 filter byte (0 = None) + width index bytes
  const scanlineLength = 1 + width;
  const rawScanlines = new Uint8Array(scanlineLength * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * scanlineLength;
    rawScanlines[rowOffset] = 0; // Filter: None

    for (let x = 0; x < width; x++) {
      const pIdx = (y * width + x) * 4;
      const r = rgba[pIdx];
      const g = rgba[pIdx + 1];
      const b = rgba[pIdx + 2];
      const a = rgba[pIdx + 3];

      if (a < 64 && transparentIndex !== null) {
        rawScanlines[rowOffset + 1 + x] = transparentIndex;
        continue;
      }

      // Nearest palette match
      let bestDist = Infinity;
      let bestIdx = hasTransparent ? 1 : 0;
      const startIdx = hasTransparent ? 1 : 0;

      for (let c = startIdx; c < palette.length; c++) {
        const pr = palette[c][0];
        const pg = palette[c][1];
        const pb = palette[c][2];
        const dist = (r - pr) * (r - pr) + (g - pg) * (g - pg) + (b - pb) * (b - pb);
        if (dist < bestDist) {
          bestDist = dist;
          bestIdx = c;
          if (dist === 0) break;
        }
      }

      rawScanlines[rowOffset + 1 + x] = bestIdx;
    }
  }

  // Deflate scanlines
  const deflatedData = await deflateData(rawScanlines);

  // Build PNG chunks
  const signature = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR: color type 3 (Indexed)
  const ihdrData = new Uint8Array([
    (width >>> 24) & 0xff,
    (width >>> 16) & 0xff,
    (width >>> 8) & 0xff,
    width & 0xff,
    (height >>> 24) & 0xff,
    (height >>> 16) & 0xff,
    (height >>> 8) & 0xff,
    height & 0xff,
    8, // bit depth
    3, // color type 3: indexed
    0, // compression: deflate
    0, // filter: standard
    0, // interlace: none
  ]);
  const ihdrChunk = buildPngChunk('IHDR', ihdrData);

  // PLTE chunk
  const plteData = new Uint8Array(palette.length * 3);
  for (let i = 0; i < palette.length; i++) {
    plteData[i * 3] = palette[i][0];
    plteData[i * 3 + 1] = palette[i][1];
    plteData[i * 3 + 2] = palette[i][2];
  }
  const plteChunk = buildPngChunk('PLTE', plteData);

  // tRNS chunk (if transparent)
  let trnsChunk: Uint8Array | null = null;
  if (hasTransparent) {
    const trnsData = new Uint8Array(alphaTable);
    trnsChunk = buildPngChunk('tRNS', trnsData);
  }

  // IDAT chunk
  const idatChunk = buildPngChunk('IDAT', deflatedData);

  // IEND chunk
  const iendChunk = buildPngChunk('IEND', new Uint8Array(0));

  // Combine chunks
  const chunks = [signature, ihdrChunk, plteChunk];
  if (trnsChunk) chunks.push(trnsChunk);
  chunks.push(idatChunk, iendChunk);

  const totalLength = chunks.reduce((sum, c) => sum + c.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const c of chunks) {
    result.set(c, offset);
    offset += c.length;
  }

  return result;
}

/**
 * Encode RGBA pixels as a 32-bit truecolor PNG with optimized Deflate compression.
 */
export async function encodePng32(
  rgba: Uint8ClampedArray,
  width: number,
  height: number
): Promise<Uint8Array> {
  const scanlineLength = 1 + width * 4;
  const rawScanlines = new Uint8Array(scanlineLength * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * scanlineLength;
    rawScanlines[rowOffset] = 0; // Filter: None
    const srcOffset = y * width * 4;
    rawScanlines.set(rgba.subarray(srcOffset, srcOffset + width * 4), rowOffset + 1);
  }

  const deflatedData = await deflateData(rawScanlines);

  const signature = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR: color type 6 (RGBA)
  const ihdrData = new Uint8Array([
    (width >>> 24) & 0xff,
    (width >>> 16) & 0xff,
    (width >>> 8) & 0xff,
    width & 0xff,
    (height >>> 24) & 0xff,
    (height >>> 16) & 0xff,
    (height >>> 8) & 0xff,
    height & 0xff,
    8, // bit depth
    6, // color type 6: RGBA
    0, // compression
    0, // filter
    0, // interlace
  ]);
  const ihdrChunk = buildPngChunk('IHDR', ihdrData);
  const idatChunk = buildPngChunk('IDAT', deflatedData);
  const iendChunk = buildPngChunk('IEND', new Uint8Array(0));

  const chunks = [signature, ihdrChunk, idatChunk, iendChunk];
  const totalLength = chunks.reduce((sum, c) => sum + c.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const c of chunks) {
    result.set(c, offset);
    offset += c.length;
  }

  return result;
}

function loadPngImageElement(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load PNG: ' + (err || 'unsupported file')));
    };
    img.src = url;
  });
}
