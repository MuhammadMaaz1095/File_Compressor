import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculateTargetVideoBitrateBps } from '../lib/compression/video-bitrate.ts';
import { calculateOptimalAudioBitrate } from '../lib/compression/audioCompressor.ts';

test('Target Size: video engine accurately calculates target bitrate from targetSizeMB', () => {
  const durationSeconds = 60; // 1 minute video
  const originalBytes = 50 * 1024 * 1024; // 50 MB
  const targetSizeMB = 10; // Target 10 MB

  const { targetBitrateBps, originalBitrateBps } = calculateTargetVideoBitrateBps(
    originalBytes,
    durationSeconds,
    {
      preset: 'balanced',
      resolution: '720p',
      bitrateKbps: 1600,
      targetSizeMB,
      removeAudio: false,
      outputFormat: 'auto',
    }
  );

  assert.ok(originalBitrateBps > 6000000, 'Original bitrate should reflect 50MB in 60s');
  // (10 MB * 8 * 1024 * 1024) / 60 ~ 1,398,101 bps - 96,000 ~ 1,302,101 bps
  assert.ok(
    targetBitrateBps > 1200000 && targetBitrateBps < 1400000,
    `Target bitrate should be ~1.3 Mbps for 10MB in 60s, got ${targetBitrateBps}`
  );
});

test('Target Size: audio engine calculates optimal bitrate from targetSizeMB', () => {
  const durationSeconds = 120; // 2 minutes
  const targetSizeMB = 1.5; // Target 1.5 MB

  const optimalBitrate = calculateOptimalAudioBitrate(durationSeconds, targetSizeMB);
  // (1.5 * 8 * 1024 * 1024) / 120 ~ 104,857 bps ~ 104 kbps -> closest standard bitrate is 96 kbps
  assert.equal(optimalBitrate, 96, 'Should select 96 kbps to stay safely under 1.5 MB');
});
