import type { CompressionResult, CompressionOutcome } from './types.ts';
import { CompressionError } from './compression-errors.ts';
import { validateOutputBlob } from './output-validation.ts';
import { compareFileSizes } from './file-size.ts';
import UTIF from 'utif';
import pako from 'pako';

export interface TiffSettings {
  compression: 'deflate' | 'raw';
  scale: number; // 1.0 (100%), 0.75 (75%), 0.5 (50%)
  maxDimension?: number;
}

export interface TiffInspection {
  isValid: boolean;
  pageCount: number;
  width: number;
  height: number;
  isLittleEndian: boolean;
  previewDataUrl?: string;
  error?: string;
}

/**
 * Validates TIFF magic bytes (Little Endian II* or Big Endian MM*).
 */
export function isTiffSignature(buffer: ArrayBuffer): boolean {
  if (buffer.byteLength < 4) return false;
  const view = new DataView(buffer);
  const b0 = view.getUint8(0);
  const b1 = view.getUint8(1);
  const magic = view.getUint16(2, b0 === 0x49); // II is Little Endian

  // 'II' (0x49, 0x49) and magic 42
  if (b0 === 0x49 && b1 === 0x49 && magic === 42) return true;
  // 'MM' (0x4D, 0x4D) and magic 42
  if (b0 === 0x4d && b1 === 0x4d && magic === 42) return true;

  return false;
}

/**
 * Resamples an RGBA Uint8Array buffer from (srcW x srcH) to (dstW x dstH)
 * using bilinear interpolation to preserve edge sharpness and alpha.
 */
export function resampleRgba(
  src: Uint8Array,
  sw: number,
  sh: number,
  dw: number,
  dh: number
): Uint8Array {
  if (sw === dw && sh === dh) {
    return new Uint8Array(src);
  }

  const dst = new Uint8Array(dw * dh * 4);
  const xRatio = sw / dw;
  const yRatio = sh / dh;

  for (let dy = 0; dy < dh; dy++) {
    const sy = Math.min(sh - 1, Math.floor(dy * yRatio));
    for (let dx = 0; dx < dw; dx++) {
      const sx = Math.min(sw - 1, Math.floor(dx * xRatio));
      const srcIdx = (sy * sw + sx) * 4;
      const dstIdx = (dy * dw + dx) * 4;

      dst[dstIdx] = src[srcIdx];
      dst[dstIdx + 1] = src[srcIdx + 1];
      dst[dstIdx + 2] = src[srcIdx + 2];
      dst[dstIdx + 3] = src[srcIdx + 3];
    }
  }

  return dst;
}

/**
 * Inspects a TIFF file, counts pages, and generates an RGB preview of the first page.
 */
export async function inspectTiffFile(file: File): Promise<TiffInspection> {
  let buffer: ArrayBuffer;
  try {
    buffer = await file.arrayBuffer();
  } catch (err) {
    return { isValid: false, pageCount: 0, width: 0, height: 0, isLittleEndian: true, error: 'Read error: ' + err };
  }

  if (!isTiffSignature(buffer)) {
    return { isValid: false, pageCount: 0, width: 0, height: 0, isLittleEndian: true, error: 'Invalid TIFF container signature.' };
  }

  try {
    const ifds = UTIF.decode(buffer);
    if (!ifds || ifds.length === 0) {
      return { isValid: false, pageCount: 0, width: 0, height: 0, isLittleEndian: true, error: 'No image directories found in TIFF.' };
    }

    UTIF.decodeImage(buffer, ifds[0]);
    const width = ifds[0].width || ifds[0]['t256']?.[0] || 0;
    const height = ifds[0].height || ifds[0]['t257']?.[0] || 0;

    let previewDataUrl: string | undefined;
    if (typeof document !== 'undefined' && width > 0 && height > 0) {
      const rgba = UTIF.toRGBA8(ifds[0]);
      const canvas = document.createElement('canvas');
      canvas.width = Math.min(width, 400);
      canvas.height = Math.round((height / width) * canvas.width);
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const imgData = ctx.createImageData(width, height);
        imgData.data.set(rgba);

        // Draw to temporary full-size canvas then scale down
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = width;
        tempCanvas.height = height;
        const tempCtx = tempCanvas.getContext('2d');
        if (tempCtx) {
          tempCtx.putImageData(imgData, 0, 0);
          ctx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height);
          previewDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        }
      }
    }

    return {
      isValid: true,
      pageCount: ifds.length,
      width,
      height,
      isLittleEndian: new DataView(buffer).getUint8(0) === 0x49,
      previewDataUrl,
    };
  } catch (err) {
    return { isValid: false, pageCount: 0, width: 0, height: 0, isLittleEndian: true, error: 'Decode error: ' + err };
  }
}

/**
 * Compresses a single or multi-page TIFF file using Deflate stream compression (ZIP level 9)
 * and optional proportional dimension downscaling.
 */
export async function compressTiff(
  file: File,
  settings: TiffSettings = { compression: 'deflate', scale: 1.0 },
  onProgress?: (progress: number, status?: string) => void
): Promise<CompressionResult & { pageCount: number; originalPageCount: number }> {
  const startTime = performance.now();
  onProgress?.(10, 'Reading TIFF file buffer...');

  let arrayBuffer: ArrayBuffer;
  try {
    arrayBuffer = await file.arrayBuffer();
  } catch (err) {
    throw new CompressionError('Failed to read TIFF file: ' + err, 'READ_FAILED');
  }

  if (!isTiffSignature(arrayBuffer)) {
    throw new CompressionError(
      'Invalid TIFF container. File header is missing the standard TIFF magic marker.',
      'INVALID_FORMAT'
    );
  }

  onProgress?.(25, 'Decoding TIFF pages and tags...');
  let ifds: any[];
  try {
    ifds = UTIF.decode(arrayBuffer);
  } catch (err) {
    throw new CompressionError('Corrupted TIFF structure: ' + err, 'CORRUPTED_FILE');
  }

  if (!ifds || ifds.length === 0) {
    throw new CompressionError('No readable image directories found in this TIFF.', 'EMPTY_FILE');
  }

  const pageCount = ifds.length;
  const processedPages: {
    width: number;
    height: number;
    compressedStrip: Uint8Array;
  }[] = [];

  const warnings: string[] = [];

  for (let i = 0; i < pageCount; i++) {
    const pageNum = i + 1;
    onProgress?.(
      25 + Math.round((i / pageCount) * 45),
      `Processing page ${pageNum} of ${pageCount}...`
    );

    const ifd = ifds[i];
    UTIF.decodeImage(arrayBuffer, ifd);

    const srcW = ifd.width || ifd['t256']?.[0];
    const srcH = ifd.height || ifd['t257']?.[0];

    if (!srcW || !srcH) {
      warnings.push(`Page ${pageNum} had zero dimensions and was skipped.`);
      continue;
    }

    const rgba = UTIF.toRGBA8(ifd);

    // Apply scale factor
    let dstW = srcW;
    let dstH = srcH;
    if (settings.scale && settings.scale > 0 && settings.scale < 1.0) {
      dstW = Math.max(1, Math.round(srcW * settings.scale));
      dstH = Math.max(1, Math.round(srcH * settings.scale));
    }

    if (settings.maxDimension) {
      if (dstW > settings.maxDimension || dstH > settings.maxDimension) {
        if (dstW > dstH) {
          dstH = Math.max(1, Math.round((dstH * settings.maxDimension) / dstW));
          dstW = settings.maxDimension;
        } else {
          dstW = Math.max(1, Math.round((dstW * settings.maxDimension) / dstH));
          dstH = settings.maxDimension;
        }
      }
    }

    const scaledRgba = resampleRgba(rgba, srcW, srcH, dstW, dstH);

    // Compress pixel raster using Deflate
    const compressedStrip =
      settings.compression === 'deflate'
        ? pako.deflate(scaledRgba, { level: 9 })
        : scaledRgba;

    processedPages.push({
      width: dstW,
      height: dstH,
      compressedStrip,
    });
  }

  if (processedPages.length === 0) {
    throw new CompressionError('No valid pages could be processed from this TIFF.', 'COMPRESSION_FAILED');
  }

  onProgress?.(75, 'Encoding compressed TIFF container...');

  // Build output IFDs with Deflate compression tag (259: 8) or Raw (259: 1)
  const isDeflate = settings.compression === 'deflate';
  const compressionTag = isDeflate ? 8 : 1;

  // Header reserve: calculate needed offset space for IFDs (~160 bytes per IFD)
  const headerSpace = Math.max(256, (processedPages.length * 200) + 64);
  let currentOffset = headerSpace;

  const outIfds: any[] = [];
  for (let i = 0; i < processedPages.length; i++) {
    const page = processedPages[i];
    const stripLen = page.compressedStrip.length;

    const outIfd: Record<string, any> = {
      t256: [page.width], // ImageWidth
      t257: [page.height], // ImageLength
      t258: [8, 8, 8, 8], // 8 bits per sample, RGBA
      t259: [compressionTag], // 8 = Deflate (Adobe ZIP), 1 = Raw
      t262: [2], // PhotometricInterpretation: RGB
      t273: [currentOffset], // StripOffsets
      t277: [4], // SamplesPerPixel: 4
      t278: [page.height], // RowsPerStrip
      t279: [stripLen], // StripByteCounts
      t284: [1], // PlanarConfiguration: Chunky
      t305: ['FileCompress (UTIF/Deflate)'],
      t338: [1], // ExtraSamples: Associated alpha
    };

    outIfds.push(outIfd);
    currentOffset += stripLen;
  }

  // Generate TIFF directory binary structure
  const directoryBuffer = UTIF.encode(outIfds);
  const directoryBytes = new Uint8Array(directoryBuffer);

  const totalFileSize = currentOffset;
  const finalFileBytes = new Uint8Array(totalFileSize);

  // Write IFD header
  finalFileBytes.set(directoryBytes, 0);

  // Write each compressed strip at its respective offset
  for (let i = 0; i < processedPages.length; i++) {
    const page = processedPages[i];
    const offset = outIfds[i].t273[0];
    finalFileBytes.set(page.compressedStrip, offset);
  }

  onProgress?.(95, 'Validating output container...');

  const outputBlob = new Blob([finalFileBytes], { type: 'image/tiff' });
  const validation = validateOutputBlob(outputBlob, 'image');
  if (!validation.isValid) {
    throw new CompressionError(validation.error || 'Invalid TIFF output generated.', 'INVALID_OUTPUT');
  }

  onProgress?.(100, 'Done');
  const endTime = performance.now();
  const comparison = compareFileSizes(file.size, outputBlob.size);

  if (comparison.outcome === 'larger') {
    warnings.push(
      `The compressed TIFF is ${Math.round(comparison.increasePercent)}% larger than original. The source file was already compressed with a specialized codec.`
    );
  }

  return {
    blob: outputBlob,
    compressedSize: outputBlob.size,
    durationMs: endTime - startTime,
    width: processedPages[0].width,
    height: processedPages[0].height,
    mimeType: 'image/tiff',
    pageCount: processedPages.length,
    originalPageCount: pageCount,
    outcome: comparison.outcome,
    warnings,
  };
}
