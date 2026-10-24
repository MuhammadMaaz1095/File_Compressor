import test from 'node:test';
import assert from 'node:assert/strict';
import {
  inspectWavHeader,
  encodePcmWav,
  resamplePcm,
  compressWav,
  type WavSettings,
} from '../lib/compression/wavCompressor.ts';

test('WAV Compressor: inspectWavHeader correctly parses RIFF header', () => {
  // Synthesize minimal 44-byte WAV header
  const sampleRate = 44100;
  const numChannels = 2;
  const bitDepth = 16;
  const dataSize = 1000;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  function writeStr(offset: number, s: string) {
    for (let i = 0; i < s.length; i++) view.setUint8(offset + i, s.charCodeAt(i));
  }

  writeStr(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeStr(8, 'WAVE');
  writeStr(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * 2, true);
  view.setUint16(32, numChannels * 2, true);
  view.setUint16(34, bitDepth, true);
  writeStr(36, 'data');
  view.setUint32(40, dataSize, true);

  const meta = inspectWavHeader(buffer);
  assert.equal(meta.isValidWav, true);
  assert.equal(meta.sampleRate, 44100);
  assert.equal(meta.channels, 2);
  assert.equal(meta.bitsPerSample, 16);
  assert.equal(meta.dataSize, 1000);
  assert.ok(meta.durationSeconds > 0);

  // Test invalid header
  const badBuffer = new ArrayBuffer(20);
  const badMeta = inspectWavHeader(badBuffer);
  assert.equal(badMeta.isValidWav, false);
});

test('WAV Compressor: encodePcmWav produces valid RIFF WAV with correct size', async () => {
  const sampleRate = 22050;
  const numSamples = 2205; // 0.1s
  const ch0 = new Float32Array(numSamples);
  const ch1 = new Float32Array(numSamples);

  for (let i = 0; i < numSamples; i++) {
    ch0[i] = Math.sin((2 * Math.PI * 440 * i) / sampleRate);
    ch1[i] = Math.cos((2 * Math.PI * 440 * i) / sampleRate);
  }

  const blob = encodePcmWav([ch0, ch1], sampleRate);
  assert.equal(blob.type, 'audio/wav');

  const arrayBuffer = await blob.arrayBuffer();
  const meta = inspectWavHeader(arrayBuffer);
  assert.equal(meta.isValidWav, true);
  assert.equal(meta.sampleRate, 22050);
  assert.equal(meta.channels, 2);
  assert.equal(meta.bitsPerSample, 16);
  assert.equal(meta.dataSize, numSamples * 2 * 2);
});

test('WAV Compressor: resamplePcm correctly downsamples Float32Array', () => {
  const input = new Float32Array(100);
  for (let i = 0; i < 100; i++) input[i] = i;

  const output = resamplePcm(input, 44100, 22050);
  assert.equal(output.length, 50, 'Halving sample rate should halve array length');
  assert.equal(output[0], 0);
  assert.ok(Math.abs(output[25] - 50) < 1.0);
});

test('WAV Compressor: compressWav Mode A (WAV optimization) and Mode B (MP3 conversion)', async () => {
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
    const rawData = new Uint8Array(200000); // 200KB mock WAV
    const fakeFile = new File([rawData], 'recording.wav', { type: 'audio/wav' });

    // Mode A test (PCM downsampling to 22050 Hz mono)
    const modeASettings: WavSettings = {
      mode: 'wav_pcm',
      targetSampleRate: 22050,
      channels: 'mono',
    };
    const resA = await compressWav(fakeFile, modeASettings);
    assert.equal(resA.outputExtension, 'wav');
    assert.equal(resA.mimeType, 'audio/wav');
    assert.equal(resA.channels, 1);
    assert.equal(resA.sampleRate, 22050);
    assert.ok(resA.compressedSize > 0);

    // Mode B test (Convert to MP3 at 128 kbps)
    const modeBSettings: WavSettings = {
      mode: 'convert_mp3',
      mp3BitrateKbps: 128,
      channels: 'keep',
    };
    const resB = await compressWav(fakeFile, modeBSettings);
    assert.equal(resB.outputExtension, 'mp3');
    assert.equal(resB.mimeType, 'audio/mpeg');
    assert.ok(resB.compressedSize > 0);
  } finally {
    (globalThis as unknown as { AudioContext?: unknown }).AudioContext = originalAudioContext;
    (globalThis as unknown as { window?: unknown }).window = originalWindow;
  }
});
