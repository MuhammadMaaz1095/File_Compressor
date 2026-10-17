import { CompressionResult, VideoSettings } from './types';
import { validateOutputBlob } from './output-validation';
import { compareFileSizes } from './file-size';
import { CompressionError } from './compression-errors';
import {
  computeVideoDimensions,
  calculateTargetVideoBitrateBps,
} from './video-bitrate';
import { testBrowserMediaSupport } from '../utils/media-support';

export { computeVideoDimensions, calculateTargetVideoBitrateBps };

/**
 * Compress and transcode video in-browser using HTML5 Video, Canvas, and MediaRecorder.
 */
export async function compressVideo(
  file: File,
  settings: VideoSettings,
  onProgress?: (progress: number) => void
): Promise<CompressionResult> {
  const startTime = performance.now();
  onProgress?.(5);

  const support = testBrowserMediaSupport(file, 'video');
  if (!support.canPlay) {
    throw new CompressionError(
      `Your browser does not support decoding this video format (${file.name}). In-browser compression requires a supported format such as MP4, WebM, or MOV.`,
      'UNSUPPORTED_MEDIA_SOURCE'
    );
  }

  const videoUrl = URL.createObjectURL(file);
  const video = document.createElement('video');
  video.muted = true; // Crucial: prevent autoplay restrictions and unhandled promise rejections
  video.playsInline = true;
  video.preload = 'auto';

  const cleanupVideo = () => {
    video.onloadedmetadata = null;
    video.onerror = null;
    video.onended = null;
    video.pause();
    video.removeAttribute('src');
    try {
      video.load();
    } catch {
      // Safe ignore
    }
    URL.revokeObjectURL(videoUrl);
  };

  // Wait for video metadata to read true dimensions and duration
  await new Promise<void>((resolve, reject) => {
    const timer = setTimeout(() => {
      cleanupVideo();
      reject(
        new CompressionError(
          'Timeout loading video metadata. File may be corrupted or too large.',
          'VIDEO_TIMEOUT'
        )
      );
    }, 15000);

    video.onloadedmetadata = () => {
      clearTimeout(timer);
      resolve();
    };

    video.onerror = () => {
      clearTimeout(timer);
      cleanupVideo();
      reject(
        new CompressionError(
          'Failed to read video metadata or unsupported container/codec.',
          'VIDEO_METADATA_FAILED'
        )
      );
    };

    try {
      video.src = videoUrl;
    } catch {
      clearTimeout(timer);
      cleanupVideo();
      reject(
        new CompressionError('Could not set video source.', 'VIDEO_SOURCE_FAILED')
      );
    }
  });

  const duration = video.duration || 1;
  const originalWidth = video.videoWidth || 1280;
  const originalHeight = video.videoHeight || 720;

  // Determine truthful output dimensions
  const { width: targetWidth, height: targetHeight } = computeVideoDimensions(
    originalWidth,
    originalHeight,
    settings.resolution,
    settings.preset
  );

  // Compute bounded target bitrate to prevent inflating smaller videos
  const { targetBitrateBps, originalBitrateBps } = calculateTargetVideoBitrateBps(
    file.size,
    duration,
    settings
  );

  // Find supported recorder MIME type
  const mimeTypes = [
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp8,opus',
    'video/webm',
    'video/mp4;codecs=avc1',
    'video/mp4',
  ];

  let selectedMime = 'video/webm';
  for (const mime of mimeTypes) {
    if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(mime)) {
      selectedMime = mime;
      break;
    }
  }

  // Create canvas for frame resizing
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) {
    cleanupVideo();
    throw new CompressionError(
      'Unable to create canvas 2D context for video transcoding.',
      'CANVAS_UNAVAILABLE'
    );
  }

  // Capture canvas video stream at 30 fps
  const canvasStream = canvas.captureStream(30);

  // Combine audio tracks if audio is not removed
  let combinedStream = canvasStream;
  let audioContext: AudioContext | null = null;
  let audioSource: MediaElementAudioSourceNode | null = null;

  if (!settings.removeAudio) {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioContext = new AudioCtx();
      const dest = audioContext.createMediaStreamDestination();
      audioSource = audioContext.createMediaElementSource(video);
      audioSource.connect(dest);

      // Connect to silent gain to keep audio clock running
      const gain = audioContext.createGain();
      gain.gain.value = 0;
      audioSource.connect(gain);
      gain.connect(audioContext.destination);

      dest.stream.getAudioTracks().forEach((track) => {
        canvasStream.addTrack(track);
      });
      combinedStream = canvasStream;
    } catch {
      // If browser security blocks Web Audio capturing from object URL, proceed with video stream
    }
  }

  let mediaRecorder: MediaRecorder;
  try {
    mediaRecorder = new MediaRecorder(combinedStream, {
      mimeType: selectedMime,
      videoBitsPerSecond: targetBitrateBps,
    });
  } catch (err) {
    cleanupVideo();
    combinedStream.getTracks().forEach((t) => t.stop());
    if (audioContext && audioContext.state !== 'closed') audioContext.close();
    throw new CompressionError(
      `MediaRecorder initialization failed with codec ${selectedMime}: ${err}`,
      'RECORDER_INIT_FAILED'
    );
  }

  const chunks: Blob[] = [];
  mediaRecorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) {
      chunks.push(e.data);
    }
  };

  onProgress?.(15);

  const compressedBlobPromise = new Promise<Blob>((resolve, reject) => {
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: selectedMime });
      resolve(blob);
    };
    mediaRecorder.onerror = (err) => reject(err);
  });

  // Start recording with 500ms chunk slices
  mediaRecorder.start(500);

  // Play video and draw frames to canvas
  let animationId = 0;
  let isCancelled = false;

  const drawFrame = () => {
    if (video.paused || video.ended || isCancelled) return;
    ctx.drawImage(video, 0, 0, targetWidth, targetHeight);

    if (video.duration) {
      const currentProgress = Math.min(
        95,
        15 + Math.round((video.currentTime / video.duration) * 80)
      );
      onProgress?.(currentProgress);
    }

    animationId = requestAnimationFrame(drawFrame);
  };

  try {
    await video.play();
    drawFrame();
  } catch (err) {
    isCancelled = true;
    cancelAnimationFrame(animationId);
    cleanupVideo();
    combinedStream.getTracks().forEach((t) => t.stop());
    if (audioContext && audioContext.state !== 'closed') audioContext.close();
    throw new CompressionError(
      'Could not start video playback for transcoding: ' + err,
      'PLAYBACK_FAILED'
    );
  }

  // Wait for video playback to finish
  await new Promise<void>((resolve) => {
    video.onended = () => resolve();
    // Safety timeout in case onended does not trigger
    setTimeout(() => resolve(), (duration + 4) * 1000);
  });

  cancelAnimationFrame(animationId);

  // Stop recorder
  if (mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
  }

  const outputBlob = await compressedBlobPromise;

  // Validate output Blob
  const validation = validateOutputBlob(outputBlob, 'video');
  if (!validation.isValid) {
    cleanupVideo();
    combinedStream.getTracks().forEach((t) => t.stop());
    if (audioContext && audioContext.state !== 'closed') audioContext.close();
    throw new CompressionError(
      validation.error || 'Invalid video output generated.',
      'INVALID_OUTPUT'
    );
  }

  onProgress?.(100);

  // Cleanup resources
  cleanupVideo();
  combinedStream.getTracks().forEach((t) => t.stop());
  if (audioContext && audioContext.state !== 'closed') {
    audioContext.close();
  }

  const endTime = performance.now();
  const comparison = compareFileSizes(file.size, outputBlob.size);

  const warnings: string[] = [];
  if (comparison.outcome === 'larger') {
    warnings.push(
      `Output is ${Math.round(comparison.increasePercent)}% larger than the original. This video already had high compression efficiency (${Math.round(originalBitrateBps / 1000)} kbps).`
    );
  }

  return {
    blob: outputBlob,
    compressedSize: outputBlob.size,
    durationMs: endTime - startTime,
    width: targetWidth,
    height: targetHeight,
    mimeType: selectedMime,
    durationSeconds: duration,
    bitrateKbps: Math.round(targetBitrateBps / 1000),
    originalBitrateKbps: Math.round(originalBitrateBps / 1000),
    outcome: comparison.outcome,
    warnings,
  };
}
