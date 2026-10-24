import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  decodeGif,
  encodeGif,
  compressGif,
  resizeRgba,
  quantizeRgba,
} from '../lib/compression/gifCompressor.ts';
import type { GifSettings } from '../lib/compression/gifCompressor.ts';

// Helper to construct a minimal valid 2-frame 2x2 animated GIF
function createSampleAnimatedGif(): Uint8Array {
  const width = 2;
  const height = 2;

  // Frame 1: 4 pixels of red
  const f1Pixels = new Uint8Array([0, 0, 0, 0]);
  const f1Palette = [[255, 0, 0], [0, 255, 0]];

  // Frame 2: 4 pixels of green
  const f2Pixels = new Uint8Array([1, 1, 1, 1]);
  const f2Palette = [[255, 0, 0], [0, 255, 0]];

  return encodeGif({
    width,
    height,
    loopCount: 0,
    frames: [
      {
        width,
        height,
        delayMs: 100,
        pixels: f1Pixels,
        palette: f1Palette,
        transparentIndex: null,
      },
      {
        width,
        height,
        delayMs: 200,
        pixels: f2Pixels,
        palette: f2Palette,
        transparentIndex: null,
      },
    ],
  });
}

test('decodeGif: correctly parses animated GIF header, dimensions, and frame delays', () => {
  const gifBytes = createSampleAnimatedGif();
  const decoded = decodeGif(gifBytes);

  assert.ok(decoded !== null, 'GIF should decode successfully');
  assert.equal(decoded.width, 2);
  assert.equal(decoded.height, 2);
  assert.equal(decoded.frames.length, 2);
  assert.equal(decoded.frames[0].delayMs, 100);
  assert.equal(decoded.frames[1].delayMs, 200);
});

test('decodeGif: rejects non-GIF or corrupted buffer', () => {
  const badBytes = new Uint8Array([0x00, 0x01, 0x02, 0x03]);
  const decoded = decodeGif(badBytes);
  assert.equal(decoded, null);
});

test('resizeRgba: correctly downscales pixel grid', () => {
  // 4x4 red block
  const src = new Uint8ClampedArray(4 * 4 * 4);
  for (let i = 0; i < 16; i++) {
    src[i * 4] = 255;
    src[i * 4 + 1] = 0;
    src[i * 4 + 2] = 0;
    src[i * 4 + 3] = 255;
  }

  const resized = resizeRgba(src, 4, 4, 2, 2);
  assert.equal(resized.length, 2 * 2 * 4);
  assert.equal(resized[0], 255);
  assert.equal(resized[1], 0);
  assert.equal(resized[2], 0);
  assert.equal(resized[3], 255);
});

test('quantizeRgba: extracts color palette and maps indices', () => {
  const rgba = new Uint8ClampedArray([
    255, 0, 0, 255,   // red
    0, 255, 0, 255,   // green
    0, 0, 255, 255,   // blue
    0, 0, 0, 0,       // transparent
  ]);

  const result = quantizeRgba(rgba, 2, 2, 64);
  assert.ok(result.palette.length > 0);
  assert.equal(result.indexedPixels.length, 4);
  assert.equal(result.transparentIndex, 0);
  assert.equal(result.indexedPixels[3], 0); // Transparent pixel mapped to transparentIndex
});

test('compressGif: compresses animated GIF end-to-end', async () => {
  const gifBytes = createSampleAnimatedGif();
  const file = new File([gifBytes], 'sample.gif', { type: 'image/gif' });

  const settings: GifSettings = {
    preset: 'balanced',
    scale: 1.0,
    maxColors: 64,
    frameSkip: 1,
  };

  const result = await compressGif(file, settings);

  assert.ok(result.blob.size > 0);
  assert.equal(result.mimeType, 'image/gif');
  assert.equal(result.width, 2);
  assert.equal(result.height, 2);
  assert.ok(result.durationMs >= 0);
});

test('compressGif: rejects 0-byte input file', async () => {
  const emptyFile = new File([], 'empty.gif', { type: 'image/gif' });
  const settings: GifSettings = {
    preset: 'balanced',
    scale: 1.0,
    maxColors: 128,
    frameSkip: 1,
  };

  await assert.rejects(
    async () => {
      await compressGif(emptyFile, settings);
    },
    /empty \(0 bytes\)/
  );
});
