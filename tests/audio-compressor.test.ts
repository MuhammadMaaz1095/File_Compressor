import test from 'node:test';
import assert from 'node:assert/strict';
import { Mp3Encoder } from '@breezystack/lamejs';
import { compressAudio } from '../lib/compression/audioCompressor.ts';
import type { AudioSettings } from '../lib/compression/types.ts';

test('MP3 Encoder Regression: Mp3Encoder initializes without "MPEGMode is not defined"', () => {
  // Test presets: Balanced (128 kbps), Smaller (96 kbps), Quality (256 kbps)
  const bitrates = [64, 96, 128, 192, 256, 320];
  const channelModes = [1, 2];

  for (const channels of channelModes) {
    for (const kbps of bitrates) {
      assert.doesNotThrow(() => {
        const encoder = new Mp3Encoder(channels, 44100, kbps);
        assert.equal(typeof encoder.encodeBuffer, 'function');
        assert.equal(typeof encoder.flush, 'function');
      }, `Mp3Encoder failed to initialize with ${channels} channels at ${kbps} kbps`);
    }
  }
});

test('MP3 Encoder: encodes PCM audio samples and produces valid MPEG Layer III stream', () => {
  const sampleRate = 44100;
  const numChannels = 2;
  const kbps = 128;
  const encoder = new Mp3Encoder(numChannels, sampleRate, kbps);

  // 1 second of 440Hz stereo sine wave
  const numSamples = sampleRate;
  const leftPCM = new Int16Array(numSamples);
  const rightPCM = new Int16Array(numSamples);

  for (let i = 0; i < numSamples; i++) {
    const val = Math.round(Math.sin((2 * Math.PI * 440 * i) / sampleRate) * 28000);
    leftPCM[i] = val;
    rightPCM[i] = val;
  }

  const blockSize = 1152;
  const chunks: Uint8Array[] = [];

  for (let i = 0; i < numSamples; i += blockSize) {
    const leftChunk = leftPCM.subarray(i, i + blockSize);
    const rightChunk = rightPCM.subarray(i, i + blockSize);
    const buf = encoder.encodeBuffer(leftChunk, rightChunk);
    if (buf.length > 0) {
      chunks.push(new Uint8Array(buf));
    }
  }

  const flushBuf = encoder.flush();
  if (flushBuf.length > 0) {
    chunks.push(new Uint8Array(flushBuf));
  }

  const totalBytes = chunks.reduce((acc, c) => acc + c.length, 0);
  assert.ok(totalBytes > 10000, `Output MP3 byte size (${totalBytes}) should be substantial`);

  // Verify first chunk has MP3 frame sync word 0xFF 0xFB (MPEG 1 Layer III)
  const firstChunk = chunks[0];
  assert.ok(firstChunk.length >= 4, 'First chunk must contain at least 4 bytes');
  assert.equal(firstChunk[0], 0xff, 'First byte of MP3 sync word must be 0xFF');
  assert.equal(firstChunk[1] & 0xfe, 0xfa, 'Second byte must indicate MPEG-1 Layer 3');
});

test('compressAudio end-to-end: processes audio in simulated browser environment', async () => {
  const originalAudioContext = (globalThis as unknown as { AudioContext?: unknown }).AudioContext;
  const originalWindow = (globalThis as unknown as { window?: unknown }).window;

  // Mock minimal Web Audio API for Node test environment
  class MockAudioBuffer {
    numberOfChannels = 2;
    sampleRate = 44100;
    duration = 1.0;
    private channel0: Float32Array;
    private channel1: Float32Array;

    constructor() {
      const len = 44100;
      this.channel0 = new Float32Array(len);
      this.channel1 = new Float32Array(len);
      for (let i = 0; i < len; i++) {
        const val = Math.sin((2 * Math.PI * 440 * i) / 44100) * 0.8;
        this.channel0[i] = val;
        this.channel1[i] = val;
      }
    }

    getChannelData(channel: number): Float32Array {
      return channel === 0 ? this.channel0 : this.channel1;
    }
  }

  class MockAudioContext {
    async decodeAudioData(): Promise<MockAudioBuffer> {
      return new MockAudioBuffer();
    }
    async close() {}
  }

  (globalThis as unknown as { window: unknown }).window = {
    AudioContext: MockAudioContext,
  };
  (globalThis as unknown as { AudioContext: unknown }).AudioContext = MockAudioContext;

  try {
    // Create simulated input audio file (64 KB)
    const mockFile = new File([new Uint8Array(65536)], 'song.mp3', { type: 'audio/mpeg' });

    // 1. Test Balanced preset
    const balancedSettings: AudioSettings = {
      preset: 'balanced',
      bitrateKbps: 128,
      outputFormat: 'audio/mpeg',
      channels: 'keep',
    };

    let progressCalls = 0;
    const balancedResult = await compressAudio(mockFile, balancedSettings, (p) => {
      progressCalls++;
      assert.ok(p >= 0 && p <= 100);
    });

    assert.ok(progressCalls > 0, 'Progress callback should be called during compression');
    assert.equal(balancedResult.mimeType, 'audio/mpeg');
    assert.ok(balancedResult.compressedSize > 0, 'Compressed size must be greater than 0');
    assert.equal(balancedResult.blob.type, 'audio/mpeg');
    assert.ok(balancedResult.durationMs >= 0);

    // 2. Test Smaller File preset (aggressive, downmix mono)
    const smallerSettings: AudioSettings = {
      preset: 'smaller',
      bitrateKbps: 96,
      outputFormat: 'audio/mpeg',
      channels: 'mono',
    };

    const smallerResult = await compressAudio(mockFile, smallerSettings);
    assert.equal(smallerResult.mimeType, 'audio/mpeg');
    assert.ok(smallerResult.compressedSize > 0);
    assert.ok(smallerResult.bitrateKbps <= 96);

    // 3. Test High Quality preset
    const qualitySettings: AudioSettings = {
      preset: 'quality',
      bitrateKbps: 256,
      outputFormat: 'audio/mpeg',
      channels: 'keep',
    };

    const qualityResult = await compressAudio(mockFile, qualitySettings);
    assert.equal(qualityResult.mimeType, 'audio/mpeg');
    assert.ok(qualityResult.compressedSize > 0);

    // 4. Test WAV output format
    const wavSettings: AudioSettings = {
      preset: 'balanced',
      bitrateKbps: 128,
      outputFormat: 'audio/wav',
      channels: 'keep',
    };

    const wavResult = await compressAudio(mockFile, wavSettings);
    assert.equal(wavResult.mimeType, 'audio/wav');
    assert.equal(wavResult.blob.type, 'audio/wav');

    // Verify WAV RIFF header
    const wavArrayBuffer = await wavResult.blob.arrayBuffer();
    const wavView = new DataView(wavArrayBuffer);
    const riff = String.fromCharCode(
      wavView.getUint8(0),
      wavView.getUint8(1),
      wavView.getUint8(2),
      wavView.getUint8(3)
    );
    const wave = String.fromCharCode(
      wavView.getUint8(8),
      wavView.getUint8(9),
      wavView.getUint8(10),
      wavView.getUint8(11)
    );
    assert.equal(riff, 'RIFF');
    assert.equal(wave, 'WAVE');
  } finally {
    // Restore environment
    (globalThis as unknown as { AudioContext?: unknown }).AudioContext = originalAudioContext;
    (globalThis as unknown as { window?: unknown }).window = originalWindow;
  }
});
