import { CompressionResult, ImageSettings } from './types';
import { validateOutputBlob } from './output-validation';
import { compareFileSizes } from './file-size';
import { CompressionError } from './compression-errors';

/**
 * Render imageBitmap to a Blob at specified dimensions, mime type, and quality.
 */
async function renderCanvasBlob(
  imageBitmap: ImageBitmap | HTMLImageElement,
  width: number,
  height: number,
  mimeType: string,
  quality: number
): Promise<Blob> {
  if (typeof OffscreenCanvas !== 'undefined') {
    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext('2d', { alpha: mimeType !== 'image/jpeg' });
    if (!ctx) throw new CompressionError('Unable to acquire 2D canvas context', 'CANVAS_FAILED');

    if (mimeType === 'image/jpeg') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(imageBitmap, 0, 0, width, height);

    return await canvas.convertToBlob({
      type: mimeType,
      quality,
    });
  } else if (typeof document !== 'undefined') {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d', { alpha: mimeType !== 'image/jpeg' });
    if (!ctx) throw new CompressionError('Unable to acquire 2D canvas context', 'CANVAS_FAILED');

    if (mimeType === 'image/jpeg') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(imageBitmap, 0, 0, width, height);

    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new CompressionError('Canvas compression produced empty result', 'CANVAS_EMPTY'));
        },
        mimeType,
        quality
      );
    });
  }

  throw new CompressionError('Canvas API not available in current environment', 'CANVAS_UNAVAILABLE');
}

/**
 * Compress an image file using browser-native Canvas / OffscreenCanvas APIs.
 * Supports JPEG, PNG, and WebP with custom quality, resizing, target-size mode, and format conversion.
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

  const warnings: string[] = [];

  // Determine base quality fraction
  let qualityFraction: number;
  if (settings.preset === 'smaller') {
    qualityFraction = 0.55;
  } else if (settings.preset === 'quality') {
    qualityFraction = 0.88;
  } else {
    qualityFraction = settings.quality > 1 ? settings.quality / 100 : settings.quality;
    qualityFraction = Math.max(0.2, Math.min(0.85, qualityFraction || 0.75));
  }

  onProgress?.(60);

  let compressedBlob: Blob;

  // Exact target-size iterative convergence mode
  if (settings.targetSizeKB && settings.targetSizeKB > 0 && targetMime !== 'image/png') {
    const targetBytes = settings.targetSizeKB * 1024;
    let currentQuality = Math.max(0.18, Math.min(0.85, (targetBytes / file.size) * 0.9));
    let curW = targetWidth;
    let curH = targetHeight;
    let bestBlob: Blob | null = null;

    // Up to 3 refinement iterations
    for (let iter = 0; iter < 3; iter++) {
      const candidate = await renderCanvasBlob(imageBitmap, curW, curH, targetMime, currentQuality);
      bestBlob = candidate;

      if (candidate.size <= targetBytes) {
        break; // Target achieved
      }

      // If still larger than target, adjust quality or downscale if quality reached floor
      if (currentQuality > 0.3) {
        const adjustment = (targetBytes / candidate.size) * 0.95;
        currentQuality = Math.max(0.15, currentQuality * adjustment);
      } else if (curW > 800) {
        // Downscale dimensions by 20%
        curW = Math.max(400, Math.round(curW * 0.8));
        curH = Math.max(300, Math.round(curH * 0.8));
      } else {
        break; // Reached safe lower limit
      }
    }

    compressedBlob = bestBlob!;
    targetWidth = curW;
    targetHeight = curH;

    if (compressedBlob.size > targetBytes) {
      warnings.push(
        `Target size of ${settings.targetSizeKB} KB is below safe visual quality thresholds. Reached closest valid size of ${Math.round(compressedBlob.size / 1024)} KB.`
      );
    }
  } else {
    // Standard single-pass render
    compressedBlob = await renderCanvasBlob(
      imageBitmap,
      targetWidth,
      targetHeight,
      targetMime,
      qualityFraction
    );
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

  if (targetMime === 'image/png' && comparison.outcome === 'larger') {
    warnings.push(
      'PNG uses lossless compression without lossy quality reduction in browser Canvas. Converting to WebP or JPEG usually yields substantial size savings.'
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
