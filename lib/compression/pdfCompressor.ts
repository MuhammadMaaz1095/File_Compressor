import { PDFDocument, PDFName, PDFNumber, PDFRawStream } from 'pdf-lib';
import type { CompressionResult, PdfSettings } from './types.ts';
import { validateOutputBlob } from './output-validation.ts';
import { compareFileSizes } from './file-size.ts';
import { CompressionError } from './compression-errors.ts';

/**
 * Recompresses raw JPEG bytes using HTML5 Canvas or OffscreenCanvas.
 * If running in a non-browser environment (e.g. Node tests), safely falls back.
 */
export async function recompressJpegBytes(
  jpegBytes: Uint8Array,
  quality: number,
  maxDimension: number
): Promise<{ bytes: Uint8Array; width: number; height: number } | null> {
  // Check if browser image decoding / canvas is available
  if (typeof Blob === 'undefined') return null;

  try {
    const blob = new Blob([jpegBytes as unknown as BlobPart], { type: 'image/jpeg' });
    let imageWidth = 0;
    let imageHeight = 0;
    let sourceDrawable: ImageBitmap | HTMLImageElement | null = null;

    if (typeof createImageBitmap === 'function') {
      try {
        const bitmap = await createImageBitmap(blob);
        imageWidth = bitmap.width;
        imageHeight = bitmap.height;
        sourceDrawable = bitmap;
      } catch {
        // Fallback to Image element
      }
    }

    if (!sourceDrawable && typeof Image !== 'undefined') {
      sourceDrawable = await new Promise<HTMLImageElement>((resolve, reject) => {
        const url = URL.createObjectURL(blob);
        const img = new Image();
        img.onload = () => {
          URL.revokeObjectURL(url);
          resolve(img);
        };
        img.onerror = () => {
          URL.revokeObjectURL(url);
          reject(new Error('Failed to decode embedded JPEG'));
        };
        img.src = url;
      });
      imageWidth = sourceDrawable.naturalWidth || sourceDrawable.width;
      imageHeight = sourceDrawable.naturalHeight || sourceDrawable.height;
    }

    if (!sourceDrawable || imageWidth <= 0 || imageHeight <= 0) {
      return null;
    }

    // Determine target dimensions preserving aspect ratio
    let targetWidth = imageWidth;
    let targetHeight = imageHeight;

    if (maxDimension > 0 && (imageWidth > maxDimension || imageHeight > maxDimension)) {
      const scale = Math.min(maxDimension / imageWidth, maxDimension / imageHeight);
      targetWidth = Math.max(1, Math.round(imageWidth * scale));
      targetHeight = Math.max(1, Math.round(imageHeight * scale));
    }

    // Render to Canvas
    let recompressedBlob: Blob | null = null;

    if (typeof OffscreenCanvas !== 'undefined') {
      const canvas = new OffscreenCanvas(targetWidth, targetHeight);
      const ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx) return null;

      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, targetWidth, targetHeight);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(sourceDrawable, 0, 0, targetWidth, targetHeight);

      recompressedBlob = await canvas.convertToBlob({
        type: 'image/jpeg',
        quality: Math.max(0.15, Math.min(0.95, quality)),
      });
    } else if (typeof document !== 'undefined') {
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx) return null;

      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, targetWidth, targetHeight);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(sourceDrawable, 0, 0, targetWidth, targetHeight);

      recompressedBlob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(
          (b) => resolve(b),
          'image/jpeg',
          Math.max(0.15, Math.min(0.95, quality))
        );
      });
    }

    // Cleanup bitmap if needed
    if (sourceDrawable && 'close' in sourceDrawable && typeof sourceDrawable.close === 'function') {
      sourceDrawable.close();
    }

    if (!recompressedBlob || recompressedBlob.size === 0) {
      return null;
    }

    // Only accept if new size is smaller than original
    if (recompressedBlob.size < jpegBytes.length) {
      const arrayBuf = await recompressedBlob.arrayBuffer();
      return {
        bytes: new Uint8Array(arrayBuf),
        width: targetWidth,
        height: targetHeight,
      };
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Optimize and compress PDF documents browser-side using pdf-lib.
 * Compresses object streams, re-compresses embedded raster images,
 * removes redundant metadata, and compacts cross-reference tables.
 */
export async function compressPdf(
  file: File,
  settings: PdfSettings,
  onProgress?: (progress: number) => void
): Promise<CompressionResult> {
  const startTime = performance.now();
  onProgress?.(10);

  let arrayBuffer: ArrayBuffer;
  try {
    arrayBuffer = await file.arrayBuffer();
  } catch (err) {
    throw new CompressionError('Could not read PDF file buffer: ' + err, 'READ_ERROR');
  }

  onProgress?.(25);

  // Load PDF with error resilience
  let pdfDoc: PDFDocument;
  try {
    pdfDoc = await PDFDocument.load(arrayBuffer, {
      ignoreEncryption: false,
      updateMetadata: false,
    });
  } catch (err) {
    const msg = String(err);
    if (msg.includes('encrypted') || msg.includes('password')) {
      throw new CompressionError(
        'This PDF document is encrypted or password-protected and cannot be compressed without unlocking.',
        'PDF_ENCRYPTED'
      );
    }
    throw new CompressionError(
      'Could not parse PDF document. File may be malformed or corrupted: ' + err,
      'PDF_LOAD_FAILED'
    );
  }

  onProgress?.(40);

  // Strip non-essential metadata if requested or in balanced/smaller presets
  if (settings.stripMetadata || settings.preset !== 'quality') {
    try {
      pdfDoc.setTitle('');
      pdfDoc.setAuthor('');
      pdfDoc.setSubject('');
      pdfDoc.setKeywords([]);
      pdfDoc.setProducer('FileCompress');
      pdfDoc.setCreator('FileCompress');
    } catch {
      // Non-critical if metadata field is read-only
    }
  }

  onProgress?.(50);

  // Determine image recompression parameters based on preset and mode
  let shouldRecompressImages = settings.recompressImages !== false;
  if (settings.mode === 'basic') {
    shouldRecompressImages = false;
  }

  let targetQuality = 0.68;
  let maxDimension = 1920;

  if (settings.targetSizeKB && settings.targetSizeKB > 0) {
    const targetBytes = settings.targetSizeKB * 1024;
    const ratio = targetBytes / file.size;
    if (ratio < 0.4) {
      targetQuality = 0.42;
      maxDimension = 1080;
    } else if (ratio < 0.7) {
      targetQuality = 0.55;
      maxDimension = 1440;
    } else {
      targetQuality = 0.72;
      maxDimension = 1920;
    }
  } else if (settings.preset === 'smaller') {
    targetQuality = 0.48;
    maxDimension = 1280;
  } else if (settings.preset === 'quality') {
    targetQuality = 0.82;
    maxDimension = 2560;
  }

  if (settings.imageQuality) {
    targetQuality = settings.imageQuality > 1 ? settings.imageQuality / 100 : settings.imageQuality;
  }
  if (settings.maxImageDimension) {
    maxDimension = settings.maxImageDimension;
  }

  // Scan and recompress embedded raster image streams
  let recompressedImageCount = 0;
  let savedImageBytes = 0;

  if (shouldRecompressImages) {
    try {
      const objects = pdfDoc.context.enumerateIndirectObjects();
      for (const [, obj] of objects) {
        if (
          obj instanceof PDFRawStream &&
          obj.dict &&
          obj.dict.get(PDFName.of('Subtype'))?.toString() === '/Image'
        ) {
          const filter = obj.dict.get(PDFName.of('Filter'));
          const filterStr = filter ? filter.toString() : '';

          // Recompress JPEG DCTDecode streams
          if (filterStr === '/DCTDecode' && obj.contents && obj.contents.length > 2048) {
            const originalLength = obj.contents.length;
            const recompressed = await recompressJpegBytes(obj.contents, targetQuality, maxDimension);

            if (recompressed && recompressed.bytes.length < originalLength) {
              const diff = originalLength - recompressed.bytes.length;
              (obj as unknown as { contents: Uint8Array }).contents = recompressed.bytes;
              obj.dict.set(PDFName.of('Length'), PDFNumber.of(recompressed.bytes.length));
              if (recompressed.width > 0 && recompressed.height > 0) {
                obj.dict.set(PDFName.of('Width'), PDFNumber.of(recompressed.width));
                obj.dict.set(PDFName.of('Height'), PDFNumber.of(recompressed.height));
              }
              recompressedImageCount++;
              savedImageBytes += diff;
            }
          }
        }
      }
    } catch {
      // Non-fatal if specific image stream could not be decoded
    }
  }

  onProgress?.(75);

  // Save with compressed object streams (Flate/Deflate cross-reference optimization)
  let compressedBytes: Uint8Array;
  try {
    compressedBytes = await pdfDoc.save({
      useObjectStreams: settings.compressStreams !== false,
      addDefaultPage: false,
      objectsPerTick: 50,
    });
  } catch (err) {
    throw new CompressionError('Failed to serialize compressed PDF: ' + err, 'PDF_SAVE_FAILED');
  }

  // Verify document integrity by reopening with PDFDocument parser
  try {
    await PDFDocument.load(compressedBytes, { ignoreEncryption: true });
  } catch (err) {
    throw new CompressionError(
      'Integrity verification failed for generated PDF: ' + err,
      'PDF_INTEGRITY_FAILED'
    );
  }

  const blob = new Blob([compressedBytes as unknown as BlobPart], { type: 'application/pdf' });

  // Validate output Blob
  const validation = validateOutputBlob(blob, 'pdf');
  if (!validation.isValid) {
    throw new CompressionError(validation.error || 'Invalid PDF output generated.', 'INVALID_OUTPUT');
  }

  onProgress?.(100);
  const endTime = performance.now();

  const comparison = compareFileSizes(file.size, blob.size);
  const warnings: string[] = [];

  if (recompressedImageCount > 0) {
    warnings.push(
      `Optimized ${recompressedImageCount} embedded raster image(s), reducing image footprint by ${Math.round(savedImageBytes / 1024)} KB while preserving searchable vector text.`
    );
  }

  if (comparison.outcome === 'larger' || comparison.outcome === 'unchanged') {
    warnings.push(
      'This PDF is already stream-compressed with minimal metadata. Re-saving produced no size reduction.'
    );
  }

  return {
    blob,
    compressedSize: blob.size,
    durationMs: endTime - startTime,
    mimeType: 'application/pdf',
    outcome: comparison.outcome,
    warnings,
  };
}
