import test from 'node:test';
import assert from 'node:assert/strict';
import { compareFileSizes, formatBytes } from '../lib/compression/file-size.ts';
import {
  calculateTargetVideoBitrateBps,
  computeVideoDimensions,
} from '../lib/compression/video-bitrate.ts';
import type { VideoSettings } from '../lib/compression/types.ts';

test('Regression Test: 4.51 MB to 9.51 MB screenshot scenario', () => {
  // Original video: DPT educational Instagram carousel.mp4 (4.51 MB)
  const originalBytes = Math.round(4.51 * 1024 * 1024); // 4,729,078 bytes
  // Output video produced by old static 1600 kbps encoder: 9.51 MB
  const outputBytes = Math.round(9.51 * 1024 * 1024);   // 9,971,958 bytes

  const comparison = compareFileSizes(originalBytes, outputBytes);

  // 1. Must be classified as 'larger'
  assert.equal(comparison.outcome, 'larger');
  assert.equal(comparison.outputIsLarger, true);

  // 2. Percentage reduction must be negative (approx -110.86%)
  assert.ok(
    comparison.reductionPercent < 0,
    `Reduction percent should be negative but was ${comparison.reductionPercent}`
  );
  assert.equal(Math.round(comparison.reductionPercent), -111);

  // 3. Size increase must be positive and correctly computed (approx +110.86% increase)
  assert.ok(comparison.increasePercent > 0);
  assert.equal(Math.round(comparison.increasePercent), 111);
  assert.equal(comparison.increaseBytes, outputBytes - originalBytes);

  // 4. Formatted byte values match screenshot
  assert.equal(formatBytes(originalBytes), '4.51 MB');
  assert.equal(formatBytes(outputBytes), '9.51 MB');
});

test('Video Bitrate Engine: prevents 1600 kbps inflation on an 800 kbps video', () => {
  const originalBytes = Math.round(4.51 * 1024 * 1024); // 4.51 MB
  const durationSeconds = 45; // ~45s Instagram carousel video

  // The original average bitrate of this video is: (4.51 * 1024 * 1024 * 8) / 45 ≈ 840,724 bps (~840 kbps)
  const balancedSettings: VideoSettings = {
    preset: 'balanced',
    resolution: '720p',
    bitrateKbps: 1600, // even if UI defaulted to 1600
    removeAudio: false,
    outputFormat: 'auto',
  };

  const { targetBitrateBps, originalBitrateBps } = calculateTargetVideoBitrateBps(
    originalBytes,
    durationSeconds,
    balancedSettings
  );

  assert.ok(
    originalBitrateBps < 900000 && originalBitrateBps > 800000,
    `Original bitrate should be ~840 kbps, got ${originalBitrateBps}`
  );

  // In balanced preset, the target bitrate must be constrained to ~68% of original bitrate (~570 kbps),
  // NEVER blindly setting 1,600,000 bps!
  assert.ok(
    targetBitrateBps < originalBitrateBps,
    `Target bitrate (${targetBitrateBps}) must be less than original (${originalBitrateBps}) to ensure compression`
  );
  assert.ok(
    targetBitrateBps <= 650000,
    `Target bitrate should be capped around 650 kbps for this video, got ${targetBitrateBps}`
  );

  // Test 'smaller' preset: should aggressively reduce bitrate (~48% of original)
  const smallerSettings: VideoSettings = {
    ...balancedSettings,
    preset: 'smaller',
  };
  const smallerRes = calculateTargetVideoBitrateBps(
    originalBytes,
    durationSeconds,
    smallerSettings
  );
  assert.ok(
    smallerRes.targetBitrateBps < targetBitrateBps,
    'Smaller preset must yield a lower bitrate than balanced preset'
  );
  assert.ok(smallerRes.targetBitrateBps <= 450000);
});

test('computeVideoDimensions: downscales when smaller preset is chosen', () => {
  const origW = 1920;
  const origH = 1080;

  // With 'smaller' preset, 1080p should automatically downscale to 720p
  const dimsSmaller = computeVideoDimensions(origW, origH, 'original', 'smaller');
  assert.ok(dimsSmaller.width <= 1280);
  assert.ok(dimsSmaller.height <= 720);
  // Must be divisible by 2 for video codecs
  assert.equal(dimsSmaller.width % 2, 0);
  assert.equal(dimsSmaller.height % 2, 0);

  // With 'quality' preset, resolution should remain original
  const dimsQuality = computeVideoDimensions(origW, origH, 'original', 'quality');
  assert.equal(dimsQuality.width, 1920);
  assert.equal(dimsQuality.height, 1080);
});
