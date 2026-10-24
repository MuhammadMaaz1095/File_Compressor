import type { CompressionResult, CompressionOutcome } from './types.ts';
import { CompressionError } from './compression-errors.ts';
import { validateOutputBlob } from './output-validation.ts';
import { compareFileSizes } from './file-size.ts';

export interface WebpSettings {
  preset: 'balanced' | 'smaller' | 'quality' | 'custom';
  quality: number; // 10 to 100
  scale?: number; // 0.25 to 1.0
  maxWidth?: number;
  maxHeight?: number;
  lossless?: boolean;
}

/**
 * Inspect WebP header for RIFF/WEBP magic bytes and animation chunk (ANIM).
 */
export async function inspectWebpFile(file: File): Promise<{
  isValid: boolean;
  isAnimated: boolean;
  hasAlpha: boolean;
}> {
  try {
    const slice = await file.slice(0, 1024).arrayBuffer();
    if (slice.byteLength < 16) {
      return { isValid: false, isAnimated: false, hasAlpha: false };
    }

    const view = new DataView(slice);
    // RIFF magic 'RIFF' (0x52494646)
    const riff = view.getUint32(0, false);
    // WEBP magic 'WEBP' (0x57454250)
    const webp = view.getUint32(8, false);

    if (riff !== 0x52494646 || webp !== 0x57454250) {
      return { isValid: false, isAnimated: false, hasAlpha: false };
    }

    const text = new TextDecoder('latin1').decode(new Uint8Array(slice));
    const isAnimated = text.includes('ANIM') || text.includes('ANMF');
    const hasAlpha = text.includes('VP8X') || text.includes('ALPH') || text.includes('VP8L');

    return { isValid: true, isAnimated, hasAlpha };
  } catch {
    return { isValid: false, isAnimated: false, hasAlpha: false };
  }
}

/**
 * Compress an image to WebP format with alpha channel preservation,
 * dimension scaling, and explicit quality trade-offs.
 */
export async function compressWebp(
  file: File,
  settings: WebpSettings = { preset: 'balanced', quality: 75, scale: 1.0 },
  onProgress?: (progress: number) => void
): Promise<CompressionResult> {
  const startTime = performance.now();
  onProgress?.(10);

  const { isValid, isAnimated } = await inspectWebpFile(file);
  if (!isValid && !file.name.toLowerCase().endsWith('.webp') && file.type !== 'image/webp') {
    throw new CompressionError('File is not a valid WebP image container.', 'INVALID_FORMAT');
  }

  const warnings: string[] = [];
  if (isAnimated) {
    warnings.push(
      'This image contains WebP animation frames. In-browser canvas encoding preserves dimensions and transparency but will export as a high-fidelity static image.'
    );
  }

  onProgress?.(25);

  // Load image into HTMLImageElement or ImageBitmap
  let originalWidth = 0;
  let originalHeight = 0;
  let imgBitmap: ImageBitmap | HTMLImageElement;

  try {
    if (typeof createImageBitmap === 'function') {
      imgBitmap = await createImageBitmap(file);
      originalWidth = imgBitmap.width;
      originalHeight = imgBitmap.height;
    } else {
      imgBitmap = await new Promise<HTMLImageElement>((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
          URL.revokeObjectURL(url);
          resolve(img);
        };
        img.onerror = () => {
          URL.revokeObjectURL(url);
          reject(new Error('Failed to decode WebP image'));
        };
        img.src = url;
      });
      originalWidth = imgBitmap.naturalWidth || imgBitmap.width;
      originalHeight = imgBitmap.naturalHeight || imgBitmap.height;
    }
  } catch (err) {
    throw new CompressionError('Could not decode WebP image data: ' + err, 'IMAGE_DECODE_FAILED');
  }

  if (originalWidth === 0 || originalHeight === 0) {
    throw new CompressionError('Invalid WebP dimensions (0x0).', 'INVALID_DIMENSIONS');
  }

  onProgress?.(45);

  // Calculate target dimensions
  let targetWidth = originalWidth;
  let targetHeight = originalHeight;

  if (settings.scale && settings.scale > 0 && settings.scale < 1.0) {
    targetWidth = Math.max(1, Math.round(originalWidth * settings.scale));
    targetHeight = Math.max(1, Math.round(originalHeight * settings.scale));
  }

  if (settings.maxWidth && targetWidth > settings.maxWidth) {
    const ratio = settings.maxWidth / targetWidth;
    targetWidth = Math.max(1, Math.round(targetWidth * ratio));
    targetHeight = Math.max(1, Math.round(targetHeight * ratio));
  }

  if (settings.maxHeight && targetHeight > settings.maxHeight) {
    const ratio = settings.maxHeight / targetHeight;
    targetWidth = Math.max(1, Math.round(targetWidth * ratio));
    targetHeight = Math.max(1, Math.round(targetHeight * ratio));
  }

  // Determine quality fraction
  let qualityFraction: number;
  if (settings.lossless) {
    qualityFraction = 1.0;
  } else if (settings.preset === 'smaller') {
    qualityFraction = 0.55;
  } else if (settings.preset === 'quality') {
    qualityFraction = 0.90;
  } else if (settings.preset === 'balanced') {
    qualityFraction = 0.75;
  } else {
    qualityFraction = Math.max(0.05, Math.min(1.0, (settings.quality || 75) / 100));
  }

  onProgress?.(65);

  let outputBlob: Blob;

  if (typeof OffscreenCanvas !== 'undefined') {
    const canvas = new OffscreenCanvas(targetWidth, targetHeight);
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) throw new CompressionError('Unable to acquire 2D canvas context', 'CANVAS_FAILED');

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(imgBitmap, 0, 0, targetWidth, targetHeight);

    outputBlob = await canvas.convertToBlob({
      type: 'image/webp',
      quality: qualityFraction,
    });
  } else {
    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) throw new CompressionError('Unable to acquire 2D canvas context', 'CANVAS_FAILED');

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(imgBitmap, 0, 0, targetWidth, targetHeight);

    outputBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new CompressionError('Canvas produced empty WebP blob', 'CANVAS_EMPTY'));
        },
        'image/webp',
        qualityFraction
      );
    });
  }

  if ('close' in imgBitmap && typeof imgBitmap.close === 'function') {
    imgBitmap.close();
  }

  onProgress?.(85);

  const validation = validateOutputBlob(outputBlob, 'image');
  if (!validation.isValid) {
    throw new CompressionError(validation.error || 'Invalid WebP output generated.', 'INVALID_OUTPUT');
  }

  onProgress?.(100);
  const endTime = performance.now();
  const comparison = compareFileSizes(file.size, outputBlob.size);

  if (comparison.outcome === 'larger') {
    warnings.push(
      `The compressed WebP is ${Math.round(comparison.increasePercent)}% larger than original. The source image is already heavily compressed. Try a lower quality or scaling setting.`
    );
  }

  return {
    blob: outputBlob,
    compressedSize: outputBlob.size,
    durationMs: endTime - startTime,
    width: targetWidth,
    height: targetHeight,
    mimeType: 'image/webp',
    outcome: comparison.outcome,
    warnings,
  };
}
