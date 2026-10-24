import test from 'node:test';
import assert from 'node:assert/strict';
import { Mp3Encoder } from '@breezystack/lamejs';
import { compressAudio } from '../lib/compression/audioCompressor.ts';
import type { AudioSettings } from '../lib/compression/types.ts';

test('MP3 Compressor: respects explicit bitrate option in mode="bitrate"', async () => {
  const originalAudioContext = (globalThis as unknown as { AudioContext?: unknown }).AudioContext;
  const originalWindow = (globalThis as unknown as { window?: unknown }).window;

  class MockAudioBuffer {
    numberOfChannels = 2;
    sampleRate = 44100;
    duration = 2.0;
    private ch0 = new Float32Array(44100 * 2);
    private ch1 = new Float32Array(44100 * 2);

    getChannelData(c: number): Float32Array {
      return c === 0 ? this.ch0 : this.ch1;
    }
  }

  class MockAudioContext {
    async decodeAudioData(): Promise<MockAudioBuffer> {
      return new MockAudioBuffer();
    }
    async close() {}
  }

  (globalThis as unknown as { AudioContext: typeof MockAudioContext }).AudioContext = MockAudioContext;
  (globalThis as unknown as { window: { AudioContext: typeof MockAudioContext } }).window = {
    AudioContext: MockAudioContext,
  };

  try {
    const rawData = new Uint8Array(200000); // Simulated 200KB original MP3
    const fakeFile = new File([rawData], 'audio.mp3', { type: 'audio/mpeg' });

    // Test with 64 kbps explicit bitrate
    const settings64: AudioSettings = {
      preset: 'balanced',
      bitrateKbps: 64,
      outputFormat: 'audio/mpeg',
      channels: 'keep',
      mode: 'bitrate',
    };

    const res64 = await compressAudio(fakeFile, settings64);
    assert.equal(res64.bitrateKbps, 64, 'Bitrate should be exactly 64 kbps');
    assert.equal(res64.mimeType, 'audio/mpeg');
    assert.ok(res64.compressedSize > 0);

    // Test with 256 kbps explicit bitrate
    const settings256: AudioSettings = {
      preset: 'balanced',
      bitrateKbps: 256,
      outputFormat: 'audio/mpeg',
      channels: 'keep',
      mode: 'bitrate',
    };

    const res256 = await compressAudio(fakeFile, settings256);
    assert.equal(res256.bitrateKbps, 256, 'Bitrate should be exactly 256 kbps');
    assert.ok(
      res256.compressedSize > res64.compressedSize,
      'Higher bitrate output should yield larger byte size'
    );
  } finally {
    (globalThis as unknown as { AudioContext?: unknown }).AudioContext = originalAudioContext;
    (globalThis as unknown as { window?: unknown }).window = originalWindow;
  }
});

test('MP3 Compressor: handles mono downmixing', async () => {
  const originalAudioContext = (globalThis as unknown as { AudioContext?: unknown }).AudioContext;
  const originalWindow = (globalThis as unknown as { window?: unknown }).window;

  class MockAudioBuffer {
    numberOfChannels = 2;
    sampleRate = 44100;
    duration = 1.0;
    private ch0 = new Float32Array(44100);
    private ch1 = new Float32Array(44100);

    getChannelData(c: number): Float32Array {
      return c === 0 ? this.ch0 : this.ch1;
    }
  }

  class MockAudioContext {
    async decodeAudioData(): Promise<MockAudioBuffer> {
      return new MockAudioBuffer();
    }
    async close() {}
  }

  (globalThis as unknown as { AudioContext: typeof MockAudioContext }).AudioContext = MockAudioContext;
  (globalThis as unknown as { window: { AudioContext: typeof MockAudioContext } }).window = {
    AudioContext: MockAudioContext,
  };

  try {
    const rawData = new Uint8Array(100000);
    const fakeFile = new File([rawData], 'speech.mp3', { type: 'audio/mpeg' });

    const monoSettings: AudioSettings = {
      preset: 'balanced',
      bitrateKbps: 96,
      outputFormat: 'audio/mpeg',
      channels: 'mono',
      mode: 'bitrate',
    };

    const result = await compressAudio(fakeFile, monoSettings);
    assert.equal(result.mimeType, 'audio/mpeg');
    assert.ok(result.compressedSize > 0);
  } finally {
    (globalThis as unknown as { AudioContext?: unknown }).AudioContext = originalAudioContext;
    (globalThis as unknown as { window?: unknown }).window = originalWindow;
  }
});
