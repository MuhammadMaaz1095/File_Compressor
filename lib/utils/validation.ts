export interface FileValidationResult {
  isValid: boolean;
  error?: string;
  category: 'image' | 'pdf' | 'video' | 'audio' | 'unknown';
}

export const MAX_IMAGE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB
export const MAX_PDF_SIZE_BYTES = 50 * 1024 * 1024; // 50MB
export const MAX_AUDIO_SIZE_BYTES = 50 * 1024 * 1024; // 50MB
export const MAX_VIDEO_SIZE_BYTES = 100 * 1024 * 1024; // 100MB

export const SUPPORTED_VIDEO_EXTS = ['.mp4', '.webm', '.mov', '.avi', '.mkv'];
export const SUPPORTED_AUDIO_EXTS = ['.mp3', '.wav', '.m4a', '.aac', '.ogg', '.flac'];

/**
 * Validate file against supported types and category-specific size limits.
 */
export function validateFile(
  file: File,
  allowedCategory: 'all' | 'image' | 'pdf' | 'video' | 'audio' = 'all'
): FileValidationResult {
  // Check empty file
  if (!file || file.size === 0) {
    return {
      isValid: false,
      error: 'File is empty (0 bytes). Please select a valid file.',
      category: 'unknown',
    };
  }

  const name = file.name.toLowerCase();
  const mime = file.type.toLowerCase();

  const isVideo =
    mime.startsWith('video/') ||
    SUPPORTED_VIDEO_EXTS.some((ext) => name.endsWith(ext));

  const isAudio =
    mime.startsWith('audio/') ||
    SUPPORTED_AUDIO_EXTS.some((ext) => name.endsWith(ext));

  const isImage =
    mime.startsWith('image/') ||
    ['.jpg', '.jpeg', '.png', '.webp'].some((ext) => name.endsWith(ext));

  const isPdf = mime === 'application/pdf' || name.endsWith('.pdf');

  // Check size limits
  if (isVideo && file.size > MAX_VIDEO_SIZE_BYTES) {
    return {
      isValid: false,
      error: `Video exceeds the 100 MB in-browser limit. (Current: ${(file.size / (1024 * 1024)).toFixed(1)} MB)`,
      category: 'video',
    };
  }

  if (isAudio && file.size > MAX_AUDIO_SIZE_BYTES) {
    return {
      isValid: false,
      error: `Audio file exceeds the 50 MB limit. (Current: ${(file.size / (1024 * 1024)).toFixed(1)} MB)`,
      category: 'audio',
    };
  }

  if ((isImage || isPdf) && file.size > MAX_IMAGE_SIZE_BYTES) {
    return {
      isValid: false,
      error: `File exceeds maximum allowed size of 50 MB. (Current: ${(file.size / (1024 * 1024)).toFixed(1)} MB)`,
      category: isImage ? 'image' : 'pdf',
    };
  }

  // Check category match
  if (allowedCategory === 'video' && !isVideo) {
    return {
      isValid: false,
      error: 'Unsupported file format. Please upload an MP4, WebM, or MOV video.',
      category: 'unknown',
    };
  }

  if (allowedCategory === 'audio' && !isAudio) {
    return {
      isValid: false,
      error: 'Unsupported file format. Please upload an MP3, WAV, M4A, AAC, or OGG audio file.',
      category: 'unknown',
    };
  }

  if (allowedCategory === 'image' && !isImage) {
    return {
      isValid: false,
      error: 'Unsupported format. Please upload a JPEG, PNG, or WebP image.',
      category: 'unknown',
    };
  }

  if (allowedCategory === 'pdf' && !isPdf) {
    return {
      isValid: false,
      error: 'Unsupported format. Please upload a valid PDF document.',
      category: 'unknown',
    };
  }

  if (!isImage && !isPdf && !isVideo && !isAudio) {
    return {
      isValid: false,
      error: `Unsupported file format (${file.type || 'unknown'}). Supported: Images, PDFs, MP4/WebM videos, and MP3/WAV audio.`,
      category: 'unknown',
    };
  }

  const category = isVideo ? 'video' : isAudio ? 'audio' : isImage ? 'image' : 'pdf';

  return {
    isValid: true,
    category,
  };
}
