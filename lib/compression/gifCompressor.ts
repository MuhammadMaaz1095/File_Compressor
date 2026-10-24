import type { CompressionResult, CompressionPreset } from './types.ts';
import { validateOutputBlob } from './output-validation.ts';
import { compareFileSizes } from './file-size.ts';
import { CompressionError } from './compression-errors.ts';

export interface GifSettings {
  preset: CompressionPreset;
  /** Scale factor between 0.2 and 1.0 (e.g. 0.5 for 50% dimensions) */
  scale: number;
  /** Maximum color count in palette: 32, 64, 128, or 256 */
  maxColors: 32 | 64 | 128 | 256;
  /** Frame skip factor: 1 = keep all frames, 2 = drop every second frame (doubling delay) */
  frameSkip: 1 | 2;
  maxWidth?: number;
}

export interface DecodedGifFrame {
  width: number;
  height: number;
  delayMs: number;
  disposal: number;
  transparentIndex: number | null;
  rgba: Uint8ClampedArray;
}

export interface DecodedGif {
  width: number;
  height: number;
  loopCount: number;
  frames: DecodedGifFrame[];
}

/**
 * Robust, client-side GIF parser, frame-scaler, color quantizer, and LZW encoder.
 * Works entirely in memory with 0 network calls or external binary dependencies.
 */
export async function compressGif(
  file: File,
  settings: GifSettings,
  onProgress?: (progress: number) => void
): Promise<CompressionResult> {
  const startTime = performance.now();
  onProgress?.(5);

  if (file.size === 0) {
    throw new CompressionError('Input GIF file is empty (0 bytes).', 'EMPTY_FILE');
  }

  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  onProgress?.(15);

  // Decode GIF structure
  const decoded = decodeGif(bytes);
  if (!decoded || decoded.frames.length === 0) {
    throw new CompressionError(
      'Failed to decode GIF. File may be corrupted or not a valid GIF87a/GIF89a image.',
      'GIF_DECODE_FAILED'
    );
  }

  onProgress?.(35);

  // Determine scaling
  let targetWidth = decoded.width;
  let targetHeight = decoded.height;

  let scale = settings.scale || 1.0;
  if (settings.preset === 'smaller') {
    scale = Math.min(scale, 0.65);
  } else if (settings.preset === 'balanced') {
    scale = Math.min(scale, 0.85);
  }

  if (settings.maxWidth && decoded.width > settings.maxWidth) {
    const maxScale = settings.maxWidth / decoded.width;
    scale = Math.min(scale, maxScale);
  }

  targetWidth = Math.max(1, Math.round(decoded.width * scale));
  targetHeight = Math.max(1, Math.round(decoded.height * scale));

  // Determine frame skip
  let framesToProcess = decoded.frames;
  if (settings.frameSkip === 2 && decoded.frames.length > 3) {
    const skipped: DecodedGifFrame[] = [];
    for (let i = 0; i < decoded.frames.length; i += 2) {
      const frame = decoded.frames[i];
      const nextFrame = decoded.frames[i + 1];
      const combinedDelay = frame.delayMs + (nextFrame ? nextFrame.delayMs : 0);
      skipped.push({
        ...frame,
        delayMs: combinedDelay,
      });
    }
    framesToProcess = skipped;
  }

  onProgress?.(50);

  // Scale frames and quantize colors
  const scaledFrames: {
    width: number;
    height: number;
    delayMs: number;
    pixels: Uint8Array;
    palette: number[][]; // [r, g, b]
    transparentIndex: number | null;
  }[] = [];

  const maxColors = settings.maxColors || (settings.preset === 'smaller' ? 64 : 128);

  for (let i = 0; i < framesToProcess.length; i++) {
    const frame = framesToProcess[i];
    const resizedRgba = resizeRgba(
      frame.rgba,
      frame.width,
      frame.height,
      targetWidth,
      targetHeight
    );

    const { palette, indexedPixels, transparentIndex } = quantizeRgba(
      resizedRgba,
      targetWidth,
      targetHeight,
      maxColors
    );

    scaledFrames.push({
      width: targetWidth,
      height: targetHeight,
      delayMs: frame.delayMs,
      pixels: indexedPixels,
      palette,
      transparentIndex,
    });

    const frameProgress = 50 + Math.round(((i + 1) / framesToProcess.length) * 35);
    onProgress?.(Math.min(85, frameProgress));
  }

  // Encode output GIF
  const encodedBytes = encodeGif({
    width: targetWidth,
    height: targetHeight,
    loopCount: decoded.loopCount,
    frames: scaledFrames,
  });

  onProgress?.(95);

  const outputBlob = new Blob([encodedBytes as unknown as BlobPart], { type: 'image/gif' });
  const validation = validateOutputBlob(outputBlob, 'image');
  if (!validation.isValid) {
    throw new CompressionError(validation.error || 'Invalid GIF output generated.', 'INVALID_OUTPUT');
  }

  onProgress?.(100);
  const endTime = performance.now();
  const comparison = compareFileSizes(file.size, outputBlob.size);

  const warnings: string[] = [];
  if (comparison.outcome === 'larger') {
    warnings.push(
      'Output GIF is larger than the original. Try selecting a lower resolution or fewer colors (64 or 32).'
    );
  }

  return {
    blob: outputBlob,
    compressedSize: outputBlob.size,
    durationMs: endTime - startTime,
    width: targetWidth,
    height: targetHeight,
    mimeType: 'image/gif',
    outcome: comparison.outcome,
    warnings,
  };
}

// ==========================================
// GIF Decoder Implementation
// ==========================================

export function decodeGif(bytes: Uint8Array): DecodedGif | null {
  if (bytes.length < 14) return null;

  // Header check: GIF87a or GIF89a
  const header = String.fromCharCode(...bytes.subarray(0, 6));
  if (header !== 'GIF87a' && header !== 'GIF89a') {
    return null;
  }

  let pos = 6;
  const width = bytes[pos] | (bytes[pos + 1] << 8);
  const height = bytes[pos + 2] | (bytes[pos + 3] << 8);
  const packed = bytes[pos + 4];
  pos += 7;

  const hasGlobalColorTable = (packed & 0x80) !== 0;
  const globalColorTableSize = 2 << (packed & 0x07);

  let globalColorTable: number[][] | null = null;
  if (hasGlobalColorTable) {
    globalColorTable = [];
    for (let i = 0; i < globalColorTableSize; i++) {
      globalColorTable.push([bytes[pos], bytes[pos + 1], bytes[pos + 2]]);
      pos += 3;
    }
  }

  const frames: DecodedGifFrame[] = [];
  let loopCount = 0;

  // Frame control states
  let currentDelay = 100; // ms
  let currentDisposal = 0;
  let currentTransparentIndex: number | null = null;

  // Full composite canvas for handling GIF frame disposal
  const composite = new Uint8ClampedArray(width * height * 4);

  while (pos < bytes.length) {
    const block = bytes[pos++];
    if (block === 0x3b) {
      // Trailer (end of GIF)
      break;
    }

    if (block === 0x21) {
      // Extension block
      const extType = bytes[pos++];
      if (extType === 0xf9) {
        // Graphic Control Extension
        const blockSize = bytes[pos++];
        const gcPacked = bytes[pos];
        const delayHundredths = bytes[pos + 1] | (bytes[pos + 2] << 8);
        currentDelay = Math.max(20, delayHundredths * 10);
        currentDisposal = (gcPacked >> 2) & 0x07;
        const hasTransparent = (gcPacked & 0x01) !== 0;
        currentTransparentIndex = hasTransparent ? bytes[pos + 3] : null;
        pos += blockSize;
        while (bytes[pos] !== 0) pos += bytes[pos] + 1;
        pos++; // skip terminating 0
      } else if (extType === 0xff) {
        // Application extension (e.g. NETSCAPE2.0 loop count)
        const blockSize = bytes[pos++];
        const appName = String.fromCharCode(...bytes.subarray(pos, pos + blockSize));
        pos += blockSize;
        while (bytes[pos] !== 0) {
          const subBlockSize = bytes[pos++];
          if (appName.startsWith('NETSCAPE') && subBlockSize >= 3 && bytes[pos] === 1) {
            loopCount = bytes[pos + 1] | (bytes[pos + 2] << 8);
          }
          pos += subBlockSize;
        }
        pos++;
      } else {
        // Skip any other extension sub-blocks
        while (pos < bytes.length && bytes[pos] !== 0) {
          pos += bytes[pos] + 1;
        }
        pos++;
      }
    } else if (block === 0x2c) {
      // Image Descriptor
      const left = bytes[pos] | (bytes[pos + 1] << 8);
      const top = bytes[pos + 2] | (bytes[pos + 3] << 8);
      const frameWidth = bytes[pos + 4] | (bytes[pos + 5] << 8);
      const frameHeight = bytes[pos + 6] | (bytes[pos + 7] << 8);
      const imagePacked = bytes[pos + 8];
      pos += 9;

      const hasLocalColorTable = (imagePacked & 0x80) !== 0;
      let activePalette = globalColorTable;

      if (hasLocalColorTable) {
        const localTableSize = 2 << (imagePacked & 0x07);
        activePalette = [];
        for (let i = 0; i < localTableSize; i++) {
          activePalette.push([bytes[pos], bytes[pos + 1], bytes[pos + 2]]);
          pos += 3;
        }
      }

      if (!activePalette) {
        // Fallback default grayscale palette if none provided
        activePalette = [];
        for (let i = 0; i < 256; i++) activePalette.push([i, i, i]);
      }

      // Read LZW pixel stream
      const minCodeSize = bytes[pos++];
      const pixelIndices = decompressLzw(bytes, pos, minCodeSize, frameWidth * frameHeight);

      // Advance pos over image sub-blocks
      while (pos < bytes.length && bytes[pos] !== 0) {
        pos += bytes[pos] + 1;
      }
      pos++; // skip terminating 0

      // Render this frame over composite
      const frameRgba = new Uint8ClampedArray(width * height * 4);
      // Copy current composite first
      frameRgba.set(composite);

      for (let y = 0; y < frameHeight; y++) {
        for (let x = 0; x < frameWidth; x++) {
          const compX = left + x;
          const compY = top + y;
          if (compX >= width || compY >= height) continue;

          const colorIdx = pixelIndices[y * frameWidth + x];
          if (colorIdx === currentTransparentIndex) {
            // Transparent: keep background / composite
            continue;
          }

          const color = activePalette[colorIdx] || [0, 0, 0];
          const offset = (compY * width + compX) * 4;
          frameRgba[offset] = color[0];
          frameRgba[offset + 1] = color[1];
          frameRgba[offset + 2] = color[2];
          frameRgba[offset + 3] = 255;
        }
      }

      frames.push({
        width,
        height,
        delayMs: currentDelay,
        disposal: currentDisposal,
        transparentIndex: currentTransparentIndex,
        rgba: frameRgba,
      });

      // Update composite based on disposal method
      if (currentDisposal === 2) {
        // Restore to background (clear frame area)
        for (let y = 0; y < frameHeight; y++) {
          for (let x = 0; x < frameWidth; x++) {
            const compX = left + x;
            const compY = top + y;
            if (compX < width && compY < height) {
              const offset = (compY * width + compX) * 4;
              composite[offset] = 0;
              composite[offset + 1] = 0;
              composite[offset + 2] = 0;
              composite[offset + 3] = 0;
            }
          }
        }
      } else if (currentDisposal !== 3) {
        // Do not dispose: keep frame on composite
        composite.set(frameRgba);
      }
    }
  }

  return {
    width,
    height,
    loopCount,
    frames,
  };
}

// ==========================================
// LZW Decompressor
// ==========================================

function decompressLzw(
  bytes: Uint8Array,
  startPos: number,
  minCodeSize: number,
  expectedPixelCount: number
): Uint8Array {
  const clearCode = 1 << minCodeSize;
  const eoiCode = clearCode + 1;

  let codeSize = minCodeSize + 1;
  let codeMask = (1 << codeSize) - 1;

  // Initialize prefix & suffix tables
  const prefix = new Int32Array(4096);
  const suffix = new Uint8Array(4096);
  const stack = new Uint8Array(4096);

  for (let i = 0; i < clearCode; i++) {
    prefix[i] = -1;
    suffix[i] = i;
  }

  let nextAvailableCode = clearCode + 2;
  let oldCode = -1;

  const output = new Uint8Array(expectedPixelCount);
  let outPos = 0;

  let bitBuffer = 0;
  let bitCount = 0;
  let pos = startPos;
  let stackPtr = 0;

  while (outPos < expectedPixelCount && pos < bytes.length) {
    const subBlockSize = bytes[pos++];
    if (subBlockSize === 0) break;

    for (let b = 0; b < subBlockSize && outPos < expectedPixelCount; b++) {
      bitBuffer |= bytes[pos++] << bitCount;
      bitCount += 8;

      while (bitCount >= codeSize && outPos < expectedPixelCount) {
        const code = bitBuffer & codeMask;
        bitBuffer >>= codeSize;
        bitCount -= codeSize;

        if (code === eoiCode) {
          return output;
        }

        if (code === clearCode) {
          codeSize = minCodeSize + 1;
          codeMask = (1 << codeSize) - 1;
          nextAvailableCode = clearCode + 2;
          oldCode = -1;
          continue;
        }

        let inCode = code;
        if (code >= nextAvailableCode) {
          // Special code-not-in-table case
          stack[stackPtr++] = suffix[oldCode];
          inCode = oldCode;
        }

        while (inCode >= clearCode) {
          stack[stackPtr++] = suffix[inCode];
          inCode = prefix[inCode];
        }

        const firstPixel = suffix[inCode];
        stack[stackPtr++] = firstPixel;

        // Drain stack into output
        while (stackPtr > 0 && outPos < expectedPixelCount) {
          output[outPos++] = stack[--stackPtr];
        }

        // Add new code to table
        if (oldCode !== -1 && nextAvailableCode < 4096) {
          prefix[nextAvailableCode] = oldCode;
          suffix[nextAvailableCode] = firstPixel;
          nextAvailableCode++;

          if (nextAvailableCode > codeMask && nextAvailableCode < 4096) {
            codeSize++;
            codeMask = (1 << codeSize) - 1;
          }
        }

        oldCode = code;
      }
    }
  }

  return output;
}

// ==========================================
// RGBA Resizer & Quantizer
// ==========================================

export function resizeRgba(
  srcRgba: Uint8ClampedArray,
  srcW: number,
  srcH: number,
  dstW: number,
  dstH: number
): Uint8ClampedArray {
  if (srcW === dstW && srcH === dstH) {
    return new Uint8ClampedArray(srcRgba);
  }

  const dst = new Uint8ClampedArray(dstW * dstH * 4);
  const xRatio = srcW / dstW;
  const yRatio = srcH / dstH;

  for (let dy = 0; dy < dstH; dy++) {
    const sy = Math.min(srcH - 1, Math.floor(dy * yRatio));
    const srcRow = sy * srcW;
    const dstRow = dy * dstW;

    for (let dx = 0; dx < dstW; dx++) {
      const sx = Math.min(srcW - 1, Math.floor(dx * xRatio));
      const srcIdx = (srcRow + sx) * 4;
      const dstIdx = (dstRow + dx) * 4;

      dst[dstIdx] = srcRgba[srcIdx];
      dst[dstIdx + 1] = srcRgba[srcIdx + 1];
      dst[dstIdx + 2] = srcRgba[srcIdx + 2];
      dst[dstIdx + 3] = srcRgba[srcIdx + 3];
    }
  }

  return dst;
}

/**
 * Fast color quantization producing an optimized color palette and indexed pixel buffer.
 */
export function quantizeRgba(
  rgba: Uint8ClampedArray,
  width: number,
  height: number,
  maxColors: number
): {
  palette: number[][];
  indexedPixels: Uint8Array;
  transparentIndex: number | null;
} {
  const pixelCount = width * height;
  const indexedPixels = new Uint8Array(pixelCount);

  // Check transparency
  let hasTransparent = false;
  for (let i = 0; i < pixelCount; i++) {
    if (rgba[i * 4 + 3] < 128) {
      hasTransparent = true;
      break;
    }
  }

  // Count unique color frequencies (reduced bit precision for clustering)
  const colorMap = new Map<number, number>();
  for (let i = 0; i < pixelCount; i++) {
    if (rgba[i * 4 + 3] < 128) continue;
    const r = rgba[i * 4] & 0xf8;
    const g = rgba[i * 4 + 1] & 0xf8;
    const b = rgba[i * 4 + 2] & 0xf8;
    const key = (r << 16) | (g << 8) | b;
    colorMap.set(key, (colorMap.get(key) || 0) + 1);
  }

  // Sort colors by frequency
  const sortedColors = Array.from(colorMap.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([key]) => [(key >> 16) & 0xff, (key >> 8) & 0xff, key & 0xff]);

  const paletteSize = Math.min(maxColors - (hasTransparent ? 1 : 0), sortedColors.length);
  const palette: number[][] = [];

  let transparentIndex: number | null = null;
  if (hasTransparent) {
    transparentIndex = 0;
    palette.push([0, 0, 0]); // transparent placeholder
  }

  for (let i = 0; i < paletteSize; i++) {
    palette.push(sortedColors[i]);
  }

  // If no opaque colors found
  if (palette.length === (hasTransparent ? 1 : 0)) {
    palette.push([0, 0, 0]);
  }

  // Map each pixel to nearest palette color using Euclidean distance
  for (let i = 0; i < pixelCount; i++) {
    if (rgba[i * 4 + 3] < 128 && transparentIndex !== null) {
      indexedPixels[i] = transparentIndex;
      continue;
    }

    const r = rgba[i * 4];
    const g = rgba[i * 4 + 1];
    const b = rgba[i * 4 + 2];

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

    indexedPixels[i] = bestIdx;
  }

  return {
    palette,
    indexedPixels,
    transparentIndex,
  };
}

// ==========================================
// GIF Encoder Implementation
// ==========================================

export interface GifEncodeFrame {
  width: number;
  height: number;
  delayMs: number;
  pixels: Uint8Array;
  palette: number[][];
  transparentIndex: number | null;
}

export function encodeGif(options: {
  width: number;
  height: number;
  loopCount: number;
  frames: GifEncodeFrame[];
}): Uint8Array {
  const chunks: Uint8Array[] = [];

  // Header: GIF89a
  chunks.push(new Uint8Array([0x47, 0x49, 0x46, 0x38, 0x39, 0x61]));

  // Logical Screen Descriptor
  const w = options.width;
  const h = options.height;

  // Use palette from first frame as global palette
  const firstPalette = options.frames[0]?.palette || [[0, 0, 0], [255, 255, 255]];
  const tableExp = Math.max(1, Math.ceil(Math.log2(firstPalette.length)));
  const globalTableSize = 1 << tableExp;

  const lsd = new Uint8Array([
    w & 0xff,
    (w >> 8) & 0xff,
    h & 0xff,
    (h >> 8) & 0xff,
    0x80 | 0x70 | (tableExp - 1), // has global color table
    0, // background color index
    0, // pixel aspect ratio
  ]);
  chunks.push(lsd);

  // Global Color Table
  const gct = new Uint8Array(globalTableSize * 3);
  for (let i = 0; i < globalTableSize; i++) {
    const c = firstPalette[i] || [0, 0, 0];
    gct[i * 3] = c[0];
    gct[i * 3 + 1] = c[1];
    gct[i * 3 + 2] = c[2];
  }
  chunks.push(gct);

  // NETSCAPE2.0 Application Extension for looping
  const netscape = new Uint8Array([
    0x21, 0xff, 0x0b, // Extension intro, app block, 11 bytes
    0x4e, 0x45, 0x54, 0x53, 0x43, 0x41, 0x50, 0x45, 0x32, 0x2e, 0x30, // NETSCAPE2.0
    0x03, 0x01, // 3 bytes sub-block, index 1
    options.loopCount & 0xff,
    (options.loopCount >> 8) & 0xff,
    0x00, // terminator
  ]);
  chunks.push(netscape);

  // Encode each frame
  for (const frame of options.frames) {
    const delayHundredths = Math.max(2, Math.round(frame.delayMs / 10));
    const hasTransparent = frame.transparentIndex !== null;

    // Graphic Control Extension
    const gce = new Uint8Array([
      0x21, 0xf9, 0x04,
      (hasTransparent ? 0x01 : 0x00) | (2 << 2), // disposal: restore to background
      delayHundredths & 0xff,
      (delayHundredths >> 8) & 0xff,
      hasTransparent ? (frame.transparentIndex ?? 0) : 0,
      0x00,
    ]);
    chunks.push(gce);

    // Image Descriptor
    const id = new Uint8Array([
      0x2c,
      0, 0, // left
      0, 0, // top
      frame.width & 0xff,
      (frame.width >> 8) & 0xff,
      frame.height & 0xff,
      (frame.height >> 8) & 0xff,
      0x00, // no local color table (uses global)
    ]);
    chunks.push(id);

    // LZW encode pixel data
    const minCodeSize = Math.max(2, tableExp);
    chunks.push(new Uint8Array([minCodeSize]));

    const lzwBlocks = compressLzw(frame.pixels, minCodeSize);
    chunks.push(lzwBlocks);
  }

  // Trailer
  chunks.push(new Uint8Array([0x3b]));

  // Concatenate all chunks into final byte array
  const totalLength = chunks.reduce((sum, c) => sum + c.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const c of chunks) {
    result.set(c, offset);
    offset += c.length;
  }

  return result;
}

// ==========================================
// LZW Compressor Implementation
// ==========================================

function compressLzw(pixels: Uint8Array, minCodeSize: number): Uint8Array {
  const clearCode = 1 << minCodeSize;
  const eoiCode = clearCode + 1;

  let codeSize = minCodeSize + 1;
  let nextCode = clearCode + 2;

  const dictionary = new Map<number, number>();
  for (let i = 0; i < clearCode; i++) {
    dictionary.set(i, i);
  }

  const subBlocks: Uint8Array[] = [];
  const currentBlock = new Uint8Array(255);
  let blockLength = 0;

  let bitBuffer = 0;
  let bitCount = 0;

  function writeBits(code: number) {
    bitBuffer |= code << bitCount;
    bitCount += codeSize;

    while (bitCount >= 8) {
      currentBlock[blockLength++] = bitBuffer & 0xff;
      bitBuffer >>= 8;
      bitCount -= 8;

      if (blockLength === 255) {
        subBlocks.push(new Uint8Array([255, ...currentBlock]));
        blockLength = 0;
      }
    }
  }

  // Initial Clear code
  writeBits(clearCode);

  let curPrefix = pixels[0];

  for (let i = 1; i < pixels.length; i++) {
    const k = pixels[i];
    const key = (curPrefix << 8) | k;

    if (dictionary.has(key)) {
      curPrefix = dictionary.get(key)!;
    } else {
      writeBits(curPrefix);

      if (nextCode < 4096) {
        dictionary.set(key, nextCode++);
        if (nextCode > (1 << codeSize) && codeSize < 12) {
          codeSize++;
        }
      } else {
        // Clear table when full
        writeBits(clearCode);
        dictionary.clear();
        for (let j = 0; j < clearCode; j++) dictionary.set(j, j);
        codeSize = minCodeSize + 1;
        nextCode = clearCode + 2;
      }

      curPrefix = k;
    }
  }

  writeBits(curPrefix);
  writeBits(eoiCode);

  // Flush remaining bits
  if (bitCount > 0) {
    currentBlock[blockLength++] = bitBuffer & 0xff;
    if (blockLength === 255) {
      subBlocks.push(new Uint8Array([255, ...currentBlock]));
      blockLength = 0;
    }
  }

  if (blockLength > 0) {
    subBlocks.push(new Uint8Array([blockLength, ...currentBlock.subarray(0, blockLength)]));
  }

  // Terminating block
  subBlocks.push(new Uint8Array([0x00]));

  const totalLength = subBlocks.reduce((sum, b) => sum + b.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const b of subBlocks) {
    result.set(b, offset);
    offset += b.length;
  }

  return result;
}
