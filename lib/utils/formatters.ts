/**
 * Format bytes into human-readable string (KB, MB, GB).
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 B';
  if (!Number.isFinite(bytes) || isNaN(bytes)) return '0 B';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(Math.abs(bytes)) / Math.log(k));
  const index = Math.min(i, sizes.length - 1);
  const formatted = parseFloat((bytes / Math.pow(k, index)).toFixed(dm));

  return `${formatted} ${sizes[index]}`;
}

/**
 * Format reduction percentage.
 * Handles negative percentages honestly (if file size increased).
 */
export function formatReduction(percent: number | null): string {
  if (percent === null || isNaN(percent)) return '0%';
  const rounded = Math.round(percent * 10) / 10;
  if (rounded > 0) {
    return `-${rounded}%`;
  } else if (rounded < 0) {
    return `+${Math.abs(rounded)}%`;
  }
  return '0%';
}

/**
 * Format processing duration in milliseconds to seconds or ms.
 */
export function formatDuration(ms: number | null): string {
  if (ms === null) return '-';
  if (ms < 1000) {
    return `${Math.round(ms)}ms`;
  }
  return `${(ms / 1000).toFixed(2)}s`;
}

/**
 * Format media playback duration in seconds to mm:ss or hh:mm:ss.
 */
export function formatMediaDuration(seconds?: number): string {
  if (!seconds || isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  if (mins >= 60) {
    const hours = Math.floor(mins / 60);
    const remMins = mins % 60;
    return `${hours}:${remMins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Detect file category based on MIME type and file extension.
 */
export function getCategoryFromFile(
  file: File
): 'image' | 'pdf' | 'video' | 'audio' | 'unknown' {
  const mime = file.type.toLowerCase();
  const name = file.name.toLowerCase();

  // Video detection
  if (
    mime.startsWith('video/') ||
    name.endsWith('.mp4') ||
    name.endsWith('.webm') ||
    name.endsWith('.mov') ||
    name.endsWith('.avi') ||
    name.endsWith('.mkv')
  ) {
    return 'video';
  }

  // Audio detection
  if (
    mime.startsWith('audio/') ||
    name.endsWith('.mp3') ||
    name.endsWith('.wav') ||
    name.endsWith('.m4a') ||
    name.endsWith('.aac') ||
    name.endsWith('.ogg') ||
    name.endsWith('.flac')
  ) {
    return 'audio';
  }

  // Image detection
  if (
    mime.startsWith('image/') ||
    name.endsWith('.jpg') ||
    name.endsWith('.jpeg') ||
    name.endsWith('.png') ||
    name.endsWith('.webp') ||
    name.endsWith('.gif')
  ) {
    return 'image';
  }

  // PDF detection
  if (mime === 'application/pdf' || name.endsWith('.pdf')) {
    return 'pdf';
  }

  return 'unknown';
}

/**
 * Generate a clean output filename preserving base name and adding compressed marker or extension.
 */
export function getCompressedFilename(
  originalName: string,
  targetMime?: string
): string {
  const lastDot = originalName.lastIndexOf('.');
  const baseName = lastDot > 0 ? originalName.slice(0, lastDot) : originalName;
  const originalExt = lastDot > 0 ? originalName.slice(lastDot + 1).toLowerCase() : '';

  if (!targetMime || targetMime === 'original') {
    return `${baseName}-compressed.${originalExt || 'bin'}`;
  }

  let newExt = originalExt;
  if (targetMime === 'image/jpeg') newExt = 'jpg';
  else if (targetMime === 'image/png') newExt = 'png';
  else if (targetMime === 'image/webp') newExt = 'webp';
  else if (targetMime === 'image/gif') newExt = 'gif';
  else if (targetMime === 'application/pdf') newExt = 'pdf';
  else if (targetMime === 'video/mp4') newExt = 'mp4';
  else if (targetMime.startsWith('video/webm')) newExt = 'webm';
  else if (targetMime === 'audio/mpeg' || targetMime === 'audio/mp3') newExt = 'mp3';
  else if (targetMime === 'audio/wav') newExt = 'wav';
  else if (targetMime.startsWith('audio/webm')) newExt = 'webm';
  else if (targetMime === 'audio/aac' || targetMime === 'audio/m4a') newExt = 'm4a';

  return `${baseName}-compressed.${newExt}`;
}
