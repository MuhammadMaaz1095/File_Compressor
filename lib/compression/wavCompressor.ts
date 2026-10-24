import { Mp3Encoder } from '@breezystack/lamejs';
import { validateOutputBlob } from './output-validation.ts';
import { compareFileSizes } from './file-size.ts';
import { CompressionError } from './compression-errors.ts';
import type { CompressionOutcome } from './types.ts';

export interface WavMetadata {
  isValidWav: boolean;
  sampleRate: number;
  channels: number;
  bitsPerSample: number;
  durationSeconds: number;
  dataSize: number;
}

export type WavCompressionMode = 'wav_pcm' | 'convert_mp3';

export interface WavSettings {
  mode: WavCompressionMode;
  targetSampleRate?: number; // e.g., 44100, 22050, 16000
  channels: 'keep' | 'mono';
  mp3BitrateKbps?: 64 | 96 | 128 | 192 | 256 | 320;
}

export interface WavCompressionResult {
  blob: Blob;
  compressedSize: number;
  durationMs: number;
  mimeType: 'audio/wav' | 'audio/mpeg';
  outputExtension: 'wav' | 'mp3';
  durationSeconds: number;
  mode: WavCompressionMode;
  sampleRate: number;
  channels: number;
  outcome: CompressionOutcome;
  savingsBytes: number;
  reductionPercent: number;
  increasePercent: number | null;
  warnings: string[];
}

/**
 * Inspect RIFF header and parse basic WAV chunk metadata.
 */
export function inspectWavHeader(buffer: ArrayBuffer): WavMetadata {
  if (buffer.byteLength < 44) {
    return {
      isValidWav: false,
      sampleRate: 0,
      channels: 0,
      bitsPerSample: 0,
      durationSeconds: 0,
      dataSize: 0,
    };
  }

  const view = new DataView(buffer);
  const riff = String.fromCharCode(
    view.getUint8(0),
    view.getUint8(1),
    view.getUint8(2),
    view.getUint8(3)
  );
  const wave = String.fromCharCode(
    view.getUint8(8),
    view.getUint8(9),
    view.getUint8(10),
    view.getUint8(11)
  );

  if (riff !== 'RIFF' || wave !== 'WAVE') {
    return {
      isValidWav: false,
      sampleRate: 0,
      channels: 0,
      bitsPerSample: 0,
      durationSeconds: 0,
      dataSize: 0,
    };
  }

  let offset = 12;
  let channels = 2;
  let sampleRate = 44100;
  let bitsPerSample = 16;
  let dataSize = 0;

  while (offset + 8 <= buffer.byteLength) {
    const chunkId = String.fromCharCode(
      view.getUint8(offset),
      view.getUint8(offset + 1),
      view.getUint8(offset + 2),
      view.getUint8(offset + 3)
    );
    const chunkSize = view.getUint32(offset + 4, true);

    if (chunkId === 'fmt ') {
      channels = view.getUint16(offset + 10, true);
      sampleRate = view.getUint32(offset + 12, true);
      bitsPerSample = view.getUint16(offset + 22, true);
    } else if (chunkId === 'data') {
      dataSize = chunkSize;
      break;
    }

    offset += 8 + chunkSize;
  }

  const bytesPerSample = (bitsPerSample / 8) * channels;
  const durationSeconds = bytesPerSample > 0 && sampleRate > 0 ? dataSize / (sampleRate * bytesPerSample) : 0;

  return {
    isValidWav: true,
    sampleRate,
    channels,
    bitsPerSample,
    durationSeconds: Math.max(0, durationSeconds),
    dataSize,
  };
}

/**
 * Encode Float32 channel data into standard 16-bit uncompressed PCM WAV.
 */
export function encodePcmWav(
  channelsData: ArrayLike<number>[],
  sampleRate: number
): Blob {
  const numChannels = channelsData.length;
  const numSamples = channelsData[0].length;
  const bitDepth = 16;
  const dataLength = numSamples * numChannels * (bitDepth / 8);
  const buffer = new ArrayBuffer(44 + dataLength);
  const view = new DataView(buffer);

  function writeString(offset: number, str: string) {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  }

  // RIFF Chunk
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataLength, true);
  writeString(8, 'WAVE');

  // fmt Subchunk
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true); // Subchunk1Size for PCM
  view.setUint16(20, 1, true); // AudioFormat 1 = PCM
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * (bitDepth / 8), true); // ByteRate
  view.setUint16(32, numChannels * (bitDepth / 8), true); // BlockAlign
  view.setUint16(34, bitDepth, true); // BitsPerSample

  // data Subchunk
  writeString(36, 'data');
  view.setUint32(40, dataLength, true);

  // Interleave and quantize to signed 16-bit PCM
  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    for (let c = 0; c < numChannels; c++) {
      const sample = Math.max(-1, Math.min(1, channelsData[c][i]));
      const int16 = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
      view.setInt16(offset, int16, true);
      offset += 2;
    }
  }

  return new Blob([buffer], { type: 'audio/wav' });
}

/**
 * Linear resample fallback if OfflineAudioContext is not present.
 */
export function resamplePcm(
  input: Float32Array,
  sourceRate: number,
  targetRate: number
): Float32Array {
  if (sourceRate === targetRate) return input;
  const ratio = sourceRate / targetRate;
  const newLength = Math.round(input.length / ratio);
  const output = new Float32Array(newLength);

  for (let i = 0; i < newLength; i++) {
    const srcIndex = i * ratio;
    const lower = Math.floor(srcIndex);
    const upper = Math.min(lower + 1, input.length - 1);
    const weight = srcIndex - lower;
    output[i] = input[lower] * (1 - weight) + input[upper] * weight;
  }
  return output;
}

/**
 * Convert Float32 to Int16 PCM array for LAME.
 */
function floatTo16Bit(input: Float32Array): Int16Array {
  const output = new Int16Array(input.length);
  for (let i = 0; i < input.length; i++) {
    const s = Math.max(-1, Math.min(1, input[i]));
    output[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return output;
}

/**
 * Main WAV compression pipeline supporting:
 * Mode A: WAV PCM Optimization (Resampling + Mono Downmixing)
 * Mode B: Conversion to High-Efficiency MP3 (LAME)
 */
export async function compressWav(
  file: File,
  settings: WavSettings,
  onProgress?: (progress: number) => void
): Promise<WavCompressionResult> {
  const startTime = performance.now();
  onProgress?.(10);

  let arrayBuffer: ArrayBuffer;
  try {
    arrayBuffer = await file.arrayBuffer();
  } catch (err) {
    throw new CompressionError('Could not read WAV file: ' + err, 'READ_FAILED');
  }

  // Inspect header
  const headerMeta = inspectWavHeader(arrayBuffer);
  onProgress?.(25);

  // Decode audio via Web Audio API
  const AudioCtx =
    typeof window !== 'undefined'
      ? window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      : null;

  let audioBuffer: AudioBuffer | null = null;
  if (AudioCtx) {
    const ctx = new AudioCtx();
    try {
      audioBuffer = await ctx.decodeAudioData(arrayBuffer);
    } catch (err) {
      await ctx.close();
      throw new CompressionError(
        'Browser failed to decode WAV audio. File may be corrupted or use unsupported codec: ' + err,
        'AUDIO_DECODE_FAILED'
      );
    }
    await ctx.close();
  }

  if (!audioBuffer) {
    throw new CompressionError('Web Audio Context is unavailable', 'AUDIO_DECODE_FAILED');
  }

  const duration = Math.max(0.1, audioBuffer.duration);
  const originalChannels = audioBuffer.numberOfChannels;
  const originalSampleRate = audioBuffer.sampleRate;
  const isMono = settings.channels === 'mono' || originalChannels === 1;

  let outBlob: Blob;
  let outMime: 'audio/wav' | 'audio/mpeg';
  let outExt: 'wav' | 'mp3';
  let finalSampleRate = originalSampleRate;
  let finalChannels = isMono ? 1 : 2;

  if (settings.mode === 'convert_mp3') {
    // Mode B: Convert to MP3 using LAME encoder
    outMime = 'audio/mpeg';
    outExt = 'mp3';
    const bitrate = settings.mp3BitrateKbps || 128;
    const numOutChannels = isMono ? 1 : Math.min(2, originalChannels);
    finalChannels = numOutChannels;

    const mp3encoder = new Mp3Encoder(numOutChannels, originalSampleRate, bitrate);
    let left = audioBuffer.getChannelData(0);
    let right: Float32Array | null = null;

    if (numOutChannels === 2 && originalChannels >= 2) {
      right = audioBuffer.getChannelData(1);
    } else if (numOutChannels === 1 && originalChannels >= 2 && isMono) {
      const r = audioBuffer.getChannelData(1);
      const monoData = new Float32Array(left.length);
      for (let i = 0; i < left.length; i++) {
        monoData[i] = (left[i] + r[i]) / 2;
      }
      left = monoData;
    }

    const leftInt = floatTo16Bit(left);
    const rightInt = right ? floatTo16Bit(right) : undefined;

    const mp3Chunks: Uint8Array[] = [];
    const blockSize = 1152;
    const totalSamples = leftInt.length;

    for (let i = 0; i < totalSamples; i += blockSize) {
      const leftChunk = leftInt.subarray(i, i + blockSize);
      const rightChunk = rightInt ? rightInt.subarray(i, i + blockSize) : undefined;
      const buf = mp3encoder.encodeBuffer(leftChunk, rightChunk);
      if (buf.length > 0) {
        mp3Chunks.push(new Uint8Array(buf));
      }

      if (i % (blockSize * 20) === 0) {
        const prog = 30 + Math.round((i / totalSamples) * 65);
        onProgress?.(prog);
        await new Promise((r) => setTimeout(r, 0));
      }
    }

    const flush = mp3encoder.flush();
    if (flush.length > 0) {
      mp3Chunks.push(new Uint8Array(flush));
    }

    outBlob = new Blob(mp3Chunks as unknown as BlobPart[], { type: 'audio/mpeg' });
  } else {
    // Mode A: WAV PCM Optimization (Resample + Channels)
    outMime = 'audio/wav';
    outExt = 'wav';
    const targetRate = settings.targetSampleRate || originalSampleRate;
    finalSampleRate = targetRate;

    let ch0: Float32Array<ArrayBufferLike> = audioBuffer.getChannelData(0);
    let ch1: Float32Array<ArrayBufferLike> | null =
      originalChannels >= 2 ? audioBuffer.getChannelData(1) : null;

    // Resample if needed
    if (targetRate !== originalSampleRate) {
      ch0 = resamplePcm(ch0 as Float32Array, originalSampleRate, targetRate);
      if (ch1) {
        ch1 = resamplePcm(ch1 as Float32Array, originalSampleRate, targetRate);
      }
    }

    onProgress?.(60);

    const channelsArray: ArrayLike<number>[] = [];
    if (isMono) {
      if (ch1) {
        const mono = new Float32Array(ch0.length);
        for (let i = 0; i < ch0.length; i++) {
          mono[i] = (ch0[i] + ch1[i]) / 2;
        }
        channelsArray.push(mono);
      } else {
        channelsArray.push(ch0);
      }
      finalChannels = 1;
    } else {
      channelsArray.push(ch0);
      if (ch1) {
        channelsArray.push(ch1);
      }
      finalChannels = channelsArray.length;
    }

    onProgress?.(85);
    outBlob = encodePcmWav(channelsArray, targetRate);
  }

  // Validate output Blob
  const validation = validateOutputBlob(outBlob, 'audio');
  if (!validation.isValid) {
    throw new CompressionError(validation.error || 'Invalid audio generated', 'INVALID_OUTPUT');
  }

  const endTime = performance.now();
  const comparison = compareFileSizes(file.size, outBlob.size);
  const warnings: string[] = [];

  if (comparison.outcome === 'larger') {
    warnings.push(
      `Output size is ${Math.round(comparison.increasePercent)}% larger than input. The source WAV was already in a lower sample rate or format.`
    );
  }

  onProgress?.(100);

  return {
    blob: outBlob,
    compressedSize: outBlob.size,
    durationMs: endTime - startTime,
    mimeType: outMime,
    outputExtension: outExt,
    durationSeconds: duration,
    mode: settings.mode,
    sampleRate: finalSampleRate,
    channels: finalChannels,
    outcome: comparison.outcome,
    savingsBytes: comparison.savedBytes,
    reductionPercent: comparison.reductionPercent,
    increasePercent: comparison.outcome === 'larger' ? comparison.increasePercent : null,
    warnings,
  };
}
