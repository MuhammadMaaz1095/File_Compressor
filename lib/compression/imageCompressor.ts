import { CompressionResult, ImageSettings } from './types';
import { validateOutputBlob } from './output-validation';
import { compareFileSizes } from './file-size';
import { CompressionError } from './compression-errors';

/**
 * Compress an image file using browser-native Canvas / OffscreenCanvas APIs.
 * Supports JPEG, PNG, and WebP with custom quality, resizing, and format conversion.
 */
export async function compressImage(
  file: File,
  settings: ImageSettings,
  onProgress?: (progress: number) => void
): Promise<CompressionResult> {
  const startTime = performance.now();
  onProgress?.(10);

  // Determine output MIME type
  let targetMime = file.type;
  if (settings.outputFormat && settings.outputFormat !== 'original') {
    targetMime = settings.outputFormat;
  }

  // Fallback for missing or generic mime
  if (!targetMime || targetMime === 'application/octet-stream') {
    const lowerName = file.name.toLowerCase();
    if (lowerName.endsWith('.png')) targetMime = 'image/png';
    else if (lowerName.endsWith('.webp')) targetMime = 'image/webp';
    else targetMime = 'image/jpeg';
  }

  // Load image
  let imageBitmap: ImageBitmap | HTMLImageElement;
  let originalWidth = 0;
  let originalHeight = 0;

  try {
    if (typeof createImageBitmap === 'function') {
      imageBitmap = await createImageBitmap(file);
      originalWidth = imageBitmap.width;
      originalHeight = imageBitmap.height;
    } else {
      imageBitmap = await loadImageElement(file);
      originalWidth = imageBitmap.naturalWidth || imageBitmap.width;
      originalHeight = imageBitmap.naturalHeight || imageBitmap.height;
    }
  } catch {
    // Fallback to Image element if createImageBitmap fails on certain color profiles
    try {
      imageBitmap = await loadImageElement(file);
      originalWidth = imageBitmap.naturalWidth || imageBitmap.width;
      originalHeight = imageBitmap.naturalHeight || imageBitmap.height;
    } catch (err) {
      throw new CompressionError(
        'Failed to decode image. File may be corrupted or in an unsupported format: ' + err,
        'IMAGE_DECODE_FAILED'
      );
    }
  }

  if (originalWidth === 0 || originalHeight === 0) {
    throw new CompressionError('Image dimensions are invalid (0x0).', 'INVALID_DIMENSIONS');
  }

  onProgress?.(35);

  // Compute dimensions preserving aspect ratio
  let targetWidth = originalWidth;
  let targetHeight = originalHeight;

  // Apply preset constraints if maxWidth/maxHeight are set
  let maxW = settings.maxWidth;
  let maxH = settings.maxHeight;

  if (settings.preset === 'smaller' && (!maxW || maxW > 1600)) {
    maxW = 1600;
  } else if (settings.preset === 'balanced' && (!maxW || maxW > 2560)) {
    maxW = 2560;
  }

  if (maxW && targetWidth > maxW) {
    const scale = maxW / targetWidth;
    targetWidth = Math.max(1, Math.round(targetWidth * scale));
    targetHeight = Math.max(1, Math.round(targetHeight * scale));
  }

  if (maxH && targetHeight > maxH) {
    const scale = maxH / targetHeight;
    targetWidth = Math.max(1, Math.round(targetWidth * scale));
    targetHeight = Math.max(1, Math.round(targetHeight * scale));
  }

  // Quality calculation: settings.quality is 10 to 100 or 0.1 to 1.0
  let qualityFraction: number;
  if (settings.preset === 'smaller') {
    qualityFraction = 0.55;
  } else if (settings.preset === 'quality') {
    qualityFraction = 0.88;
  } else {
    // Balanced preset
    qualityFraction = settings.quality > 1 ? settings.quality / 100 : settings.quality;
    qualityFraction = Math.max(0.2, Math.min(0.85, qualityFraction || 0.75));
  }

  onProgress?.(60);

  // Draw to canvas
  let compressedBlob: Blob;

  if (typeof OffscreenCanvas !== 'undefined') {
    const canvas = new OffscreenCanvas(targetWidth, targetHeight);
    const ctx = canvas.getContext('2d', { alpha: targetMime !== 'image/jpeg' });
    if (!ctx) throw new CompressionError('Unable to acquire 2D canvas context', 'CANVAS_FAILED');

    // If JPEG, fill white background to prevent black transparent areas
    if (targetMime === 'image/jpeg') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, targetWidth, targetHeight);
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(imageBitmap, 0, 0, targetWidth, targetHeight);

    onProgress?.(80);

    compressedBlob = await canvas.convertToBlob({
      type: targetMime,
      quality: qualityFraction,
    });
  } else {
    // Fallback for DOM environments without OffscreenCanvas
    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d', { alpha: targetMime !== 'image/jpeg' });
    if (!ctx) throw new CompressionError('Unable to acquire 2D canvas context', 'CANVAS_FAILED');

    if (targetMime === 'image/jpeg') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, targetWidth, targetHeight);
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(imageBitmap, 0, 0, targetWidth, targetHeight);

    onProgress?.(80);

    compressedBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new CompressionError('Canvas compression produced empty result', 'CANVAS_EMPTY'));
        },
        targetMime,
        qualityFraction
      );
    });
  }

  // Cleanup ImageBitmap if applicable
  if ('close' in imageBitmap && typeof imageBitmap.close === 'function') {
    imageBitmap.close();
  }

  // Validate output Blob
  const validation = validateOutputBlob(compressedBlob, 'image');
  if (!validation.isValid) {
    throw new CompressionError(validation.error || 'Invalid image output generated.', 'INVALID_OUTPUT');
  }

  onProgress?.(100);
  const endTime = performance.now();

  const comparison = compareFileSizes(file.size, compressedBlob.size);
  const warnings: string[] = [];

  if (targetMime === 'image/png' && comparison.outcome === 'larger') {
    warnings.push(
      'PNG uses lossless compression without quality adjustments in browser Canvas. Converting to WebP or JPEG usually yields major savings.'
    );
  }

  return {
    blob: compressedBlob,
    compressedSize: compressedBlob.size,
    durationMs: endTime - startTime,
    width: targetWidth,
    height: targetHeight,
    mimeType: targetMime,
    outcome: comparison.outcome,
    warnings,
  };
}

function loadImageElement(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image: ' + (err || 'unsupported file')));
    };
    img.src = url;
  });
}
