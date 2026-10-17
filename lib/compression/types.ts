export type CompressionOutcome = 'reduced' | 'unchanged' | 'larger';

export type SupportedCategory = 'all' | 'image' | 'pdf' | 'video' | 'audio';

export type CompressionPreset = 'balanced' | 'smaller' | 'quality';

export type OutputImageFormat = 'original' | 'image/jpeg' | 'image/png' | 'image/webp';

export interface ImageSettings {
  preset: CompressionPreset;
  quality: number; // 0.1 to 1.0 (or 10 to 100)
  maxWidth?: number;
  maxHeight?: number;
  outputFormat: OutputImageFormat;
}

export interface PdfSettings {
  preset: CompressionPreset;
  stripMetadata: boolean;
  compressStreams: boolean;
  removeAnnotations: boolean;
}

export type VideoResolutionOption = 'original' | '1080p' | '720p' | '480p' | '360p';

export interface VideoSettings {
  preset: CompressionPreset;
  resolution: VideoResolutionOption;
  bitrateKbps: number; // e.g. 500 to 5000
  targetSizeMB?: number;
  removeAudio: boolean;
  outputFormat: 'auto' | 'video/mp4' | 'video/webm';
}

export type AudioBitrateOption = 64 | 96 | 128 | 192 | 256 | 320;

export type AudioOutputFormatOption = 'audio/mpeg' | 'audio/wav' | 'audio/webm' | 'audio/aac';

export interface AudioSettings {
  preset: CompressionPreset;
  bitrateKbps: AudioBitrateOption;
  outputFormat: AudioOutputFormatOption;
  channels: 'keep' | 'mono';
  targetSizeMB?: number;
}

export interface CompressionSettings {
  image: ImageSettings;
  pdf: PdfSettings;
  video: VideoSettings;
  audio: AudioSettings;
}

export type FileStatus = 'idle' | 'processing' | 'completed' | 'error' | 'larger' | 'unchanged';

export interface QueueItem {
  id: string;
  file: File;
  name: string;
  type: string;
  category: 'image' | 'pdf' | 'video' | 'audio' | 'unknown';
  originalSize: number;
  compressedSize: number | null;
  compressedBlob: Blob | null;
  status: FileStatus;
  progress: number; // 0 to 100
  reductionPercent: number | null;
  savingsBytes: number | null;
  increasePercent?: number | null;
  durationMs: number | null;
  outcome?: CompressionOutcome;
  canRetrySmaller?: boolean;
  errorMessage?: string;
  previewUrl?: string;
  compressedPreviewUrl?: string;
  width?: number;
  height?: number;
  compressedWidth?: number;
  compressedHeight?: number;
  mediaDuration?: number; // audio or video duration in seconds
  bitrateKbps?: number;
  originalBitrateKbps?: number;
  compressedBitrateKbps?: number;
  previewUnsupported?: boolean;
  previewWarning?: string;
}

export interface CompressionResult {
  blob: Blob;
  compressedSize: number;
  durationMs: number;
  width?: number;
  height?: number;
  mimeType: string;
  durationSeconds?: number;
  bitrateKbps?: number;
  originalBitrateKbps?: number;
  outcome?: CompressionOutcome;
  warnings?: string[];
}

