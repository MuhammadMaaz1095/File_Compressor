import type { VideoResolutionOption, VideoSettings } from './types';

/**
 * Get target dimensions preserving aspect ratio without upscaling.
 */
export function computeVideoDimensions(
  origW: number,
  origH: number,
  resolution: VideoResolutionOption,
  preset?: string
): { width: number; height: number } {
  let maxW = origW;
  let maxH = origH;

  // If user left resolution as original or auto, but preset is 'smaller',
  // downscale 1080p+ to 720p or 480p to achieve genuine file size savings.
  let effectiveRes = resolution;
  if (preset === 'smaller' && (resolution === 'original' || resolution === '1080p')) {
    effectiveRes = origW > 1280 ? '720p' : '480p';
  } else if (preset === 'balanced' && origW > 1920) {
    effectiveRes = '1080p';
  }

  if (effectiveRes === '1080p') {
    maxW = 1920;
    maxH = 1080;
  } else if (effectiveRes === '720p') {
    maxW = 1280;
    maxH = 720;
  } else if (effectiveRes === '480p') {
    maxW = 854;
    maxH = 480;
  } else if (effectiveRes === '360p') {
    maxW = 640;
    maxH = 360;
  }

  // Never upscale
  if (origW <= maxW && origH <= maxH) {
    // Ensure even dimensions for video codecs (divisible by 2)
    return {
      width: Math.floor(origW / 2) * 2,
      height: Math.floor(origH / 2) * 2,
    };
  }

  const ratio = Math.min(maxW / origW, maxH / origH);
  let targetW = Math.round((origW * ratio) / 2) * 2;
  let targetH = Math.round((origH * ratio) / 2) * 2;

  // Guarantee minimum bounds (divisible by 2)
  targetW = Math.max(160, targetW);
  targetH = Math.max(120, targetH);

  return { width: targetW, height: targetH };
}

/**
 * Determine a truthful, bounded target video bitrate in bits per second (bps).
 * Prevents inflating already-compressed videos (like the 4.51 MB -> 9.51 MB issue).
 */
export function calculateTargetVideoBitrateBps(
  originalSizeBytes: number,
  durationSeconds: number,
  settings: VideoSettings
): { targetBitrateBps: number; originalBitrateBps: number } {
  const safeDuration = Math.max(0.5, durationSeconds);
  const originalBitrateBps = Math.max(
    100000,
    Math.round((originalSizeBytes * 8) / safeDuration)
  );

  let targetBitrateBps: number;

  if (settings.targetSizeMB && settings.targetSizeMB > 0) {
    // Explicit target size requested: Bitrate = (TargetMB * 8 * 1024 * 1024) / duration
    const targetTotalBps = (settings.targetSizeMB * 8 * 1024 * 1024) / safeDuration;
    // Reserve ~96 kbps for audio if not removed
    const audioAllowance = settings.removeAudio ? 0 : 96000;
    targetBitrateBps = Math.max(150000, Math.round(targetTotalBps - audioAllowance));
    // Clamp to realistic bounds
    targetBitrateBps = Math.min(8000000, targetBitrateBps);
  } else if (settings.preset === 'smaller') {
    // Aggressive size reduction: aim for 45-50% of original bitrate, capped at 650 kbps
    const aggressiveTarget = Math.round(originalBitrateBps * 0.48);
    targetBitrateBps = Math.min(650000, aggressiveTarget);
    // Safe floor so video doesn't turn into unrecognizable artifacts
    targetBitrateBps = Math.max(180000, targetBitrateBps);
  } else if (settings.preset === 'quality') {
    // High quality: keep close to original bitrate, but do not exceed original by more than 5%
    const qualityTarget = Math.round(originalBitrateBps * 0.90);
    targetBitrateBps = Math.min(3200000, qualityTarget);
    targetBitrateBps = Math.max(350000, targetBitrateBps);
  } else {
    // Balanced preset (Default):
    // Target 65-70% of original bitrate to reliably produce a reduction.
    // Crucial fix: Never blindly use 1.6 Mbps if original video was only 800 kbps!
    const balancedTarget = Math.round(originalBitrateBps * 0.68);
    targetBitrateBps = Math.min(1300000, balancedTarget);
    targetBitrateBps = Math.max(240000, targetBitrateBps);
  }

  return { targetBitrateBps, originalBitrateBps };
}
