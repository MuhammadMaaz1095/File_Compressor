import type { CompressionResult, AudioSettings } from './types.ts';
import { Mp3Encoder } from '@breezystack/lamejs';
import { validateOutputBlob } from './output-validation.ts';
import { compareFileSizes } from './file-size.ts';
import { CompressionError } from './compression-errors.ts';

/**
 * Convert float32 array (-1.0 to 1.0) to 16-bit signed integer PCM (-32768 to 32767).
 */
function floatTo16BitPCM(input: Float32Array): Int16Array {
  const output = new Int16Array(input.length);
  for (let i = 0; i < input.length; i++) {
    const s = Math.max(-1, Math.min(1, input[i]));
    output[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return output;
}

/**
 * Encode AudioBuffer to standard MP3 file using lamejs.
 */
async function encodeToMp3(
  audioBuffer: AudioBuffer,
  bitrateKbps: number,
  forceMono: boolean,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  const numChannels = forceMono ? 1 : Math.min(audioBuffer.numberOfChannels, 2);
  const sampleRate = audioBuffer.sampleRate;
  const mp3encoder = new Mp3Encoder(numChannels, sampleRate, bitrateKbps);

  const leftChannel = audioBuffer.getChannelData(0);
  let rightChannel: Float32Array | null = null;

  if (numChannels === 2 && audioBuffer.numberOfChannels >= 2) {
    rightChannel = audioBuffer.getChannelData(1);
  } else if (numChannels === 1 && audioBuffer.numberOfChannels >= 2 && forceMono) {
    // Downmix to mono: average of both channels
    const right = audioBuffer.getChannelData(1);
    for (let i = 0; i < leftChannel.length; i++) {
      leftChannel[i] = (leftChannel[i] + right[i]) / 2;
    }
  }

  const leftPCM = floatTo16BitPCM(leftChannel);
  const rightPCM = rightChannel ? floatTo16BitPCM(rightChannel) : undefined;

  const mp3Data: Uint8Array[] = [];
  const sampleBlockSize = 1152; // LAME standard block size
  const totalSamples = leftPCM.length;

  for (let i = 0; i < totalSamples; i += sampleBlockSize) {
    const leftChunk = leftPCM.subarray(i, i + sampleBlockSize);
    const rightChunk = rightPCM ? rightPCM.subarray(i, i + sampleBlockSize) : undefined;

    const mp3buf = mp3encoder.encodeBuffer(leftChunk, rightChunk);
    if (mp3buf.length > 0) {
      mp3Data.push(new Uint8Array(mp3buf));
    }

    if (i % (sampleBlockSize * 20) === 0) {
      const progress = 25 + Math.round((i / totalSamples) * 70);
      onProgress?.(progress);
      // Yield to event loop to keep UI responsive
      await new Promise((r) => setTimeout(r, 0));
    }
  }

  const flushBuf = mp3encoder.flush();
  if (flushBuf.length > 0) {
    mp3Data.push(new Uint8Array(flushBuf));
  }

  onProgress?.(100);

  return new Blob(mp3Data as unknown as BlobPart[], { type: 'audio/mpeg' });
}

/**
 * Encode AudioBuffer into standard 16-bit uncompressed PCM WAV.
 */
function encodeToWav(audioBuffer: AudioBuffer): Blob {
  const numChannels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;

  let result: Float32Array;
  if (numChannels === 2) {
    const left = audioBuffer.getChannelData(0);
    const right = audioBuffer.getChannelData(1);
    result = new Float32Array(left.length + right.length);
    for (let i = 0; i < left.length; i++) {
      result[i * 2] = left[i];
      result[i * 2 + 1] = right[i];
    }
  } else {
    result = audioBuffer.getChannelData(0);
  }

  const dataLength = result.length * (bitDepth / 8);
  const buffer = new ArrayBuffer(44 + dataLength);
  const view = new DataView(buffer);

  // RIFF identifier
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataLength, true);
  writeString(view, 8, 'WAVE');
  // format chunk identifier
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, format, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * (bitDepth / 8), true);
  view.setUint16(32, numChannels * (bitDepth / 8), true);
  view.setUint16(34, bitDepth, true);
  // data chunk identifier
  writeString(view, 36, 'data');
  view.setUint32(40, dataLength, true);

  // Write PCM samples
  let offset = 44;
  for (let i = 0; i < result.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, result[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }

  return new Blob([buffer], { type: 'audio/wav' });
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

/**
 * Real client-side audio compressor.
 * Decodes audio via AudioContext and encodes to standard MP3 or WAV with adaptive bitrate bounding.
 */
export async function compressAudio(
  file: File,
  settings: AudioSettings,
  onProgress?: (progress: number) => void
): Promise<CompressionResult> {
  const startTime = performance.now();
  onProgress?.(10);

  // Read array buffer
  let arrayBuffer: ArrayBuffer;
  try {
    arrayBuffer = await file.arrayBuffer();
  } catch (err) {
    throw new CompressionError('Could not read audio file: ' + err, 'READ_FAILED');
  }

  onProgress?.(25);

  // Decode audio using browser Web Audio API
  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  const audioContext = new AudioCtx();

  let audioBuffer: AudioBuffer;
  try {
    audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  } catch (err) {
    await audioContext.close();
    throw new CompressionError(
      'Could not decode audio. The audio format or codec is not supported by your browser: ' + err,
      'AUDIO_DECODE_FAILED'
    );
  }

  await audioContext.close();

  const duration = Math.max(0.5, audioBuffer.duration);
  const originalBitrateKbps = Math.round((file.size * 8) / (duration * 1000));

  let targetBitrate = settings.bitrateKbps;

  // Calculate target bitrate if targetSizeMB is provided
  if (settings.targetSizeMB && settings.targetSizeMB > 0) {
    const calculatedKbps = Math.round((settings.targetSizeMB * 8 * 1024) / duration);
    const available = [64, 96, 128, 192, 256, 320];
    targetBitrate = (available.reduce((prev, curr) =>
      Math.abs(curr - calculatedKbps) < Math.abs(prev - calculatedKbps) ? curr : prev
    ) as typeof settings.bitrateKbps) || 128;
  } else if (settings.preset === 'smaller') {
    // Aggressive: bound against original bitrate to ensure reduction
    targetBitrate = Math.min(96, Math.max(64, Math.floor(originalBitrateKbps * 0.65))) as typeof settings.bitrateKbps;
  } else if (settings.preset === 'quality') {
    targetBitrate = Math.min(256, Math.max(128, originalBitrateKbps)) as typeof settings.bitrateKbps;
  } else {
    // Balanced preset:
    // Bound against original bitrate so a 96 kbps audio doesn't become 128 kbps
    targetBitrate = Math.min(128, Math.max(64, Math.floor(originalBitrateKbps * 0.80))) as typeof settings.bitrateKbps;
  }

  // Mono downmix if requested or in 'smaller' preset for high channel counts
  const forceMono = settings.channels === 'mono' || (settings.preset === 'smaller' && audioBuffer.numberOfChannels > 1);

  // Encode
  let compressedBlob: Blob;
  let outputMime = settings.outputFormat || 'audio/mpeg';

  if (outputMime === 'audio/wav') {
    compressedBlob = encodeToWav(audioBuffer);
    onProgress?.(100);
  } else {
    // Default to MP3 encoder (lamejs) for maximum compatibility and true compression
    compressedBlob = await encodeToMp3(
      audioBuffer,
      targetBitrate,
      forceMono,
      onProgress
    );
    outputMime = 'audio/mpeg';
  }

  // Validate output Blob
  const validation = validateOutputBlob(compressedBlob, 'audio');
  if (!validation.isValid) {
    throw new CompressionError(validation.error || 'Invalid audio output generated.', 'INVALID_OUTPUT');
  }

  const endTime = performance.now();
  const comparison = compareFileSizes(file.size, compressedBlob.size);
  const warnings: string[] = [];

  if (comparison.outcome === 'larger') {
    warnings.push(
      `Output is ${Math.round(comparison.increasePercent)}% larger than the original. The source audio was already encoded at a low bitrate (${originalBitrateKbps} kbps).`
    );
  }

  return {
    blob: compressedBlob,
    compressedSize: compressedBlob.size,
    durationMs: endTime - startTime,
    mimeType: outputMime,
    durationSeconds: duration,
    bitrateKbps: targetBitrate,
    originalBitrateKbps,
    outcome: comparison.outcome,
    warnings,
  };
}
