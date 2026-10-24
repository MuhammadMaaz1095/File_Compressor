import test from 'node:test';
import assert from 'node:assert/strict';
import { inspectWebpFile } from '../lib/compression/webpCompressor.ts';

test('inspectWebpFile: accepts valid WebP RIFF container', async () => {
  // Construct 32-byte dummy WebP RIFF buffer:
  // Offset 0: 'RIFF' (0x52, 0x49, 0x46, 0x46)
  // Offset 4: length 24 (uint32 LE)
  // Offset 8: 'WEBP' (0x57, 0x45, 0x42, 0x50)
  // Offset 12: 'VP8 ' chunk
  const buf = new Uint8Array(32);
  buf.set([0x52, 0x49, 0x46, 0x46], 0); // RIFF
  new DataView(buf.buffer).setUint32(4, 24, true);
  buf.set([0x57, 0x45, 0x42, 0x50], 8); // WEBP
  buf.set([0x56, 0x50, 0x38, 0x20], 12); // VP8

  const file = new File([buf], 'test.webp', { type: 'image/webp' });
  const result = await inspectWebpFile(file);

  assert.equal(result.isValid, true);
  assert.equal(result.isAnimated, false);
});

test('inspectWebpFile: detects animated WebP chunk ANIM', async () => {
  const buf = new Uint8Array(64);
  buf.set([0x52, 0x49, 0x46, 0x46], 0);
  buf.set([0x57, 0x45, 0x42, 0x50], 8);
  // Insert ANIM chunk identifier
  buf.set([0x41, 0x4e, 0x49, 0x4d], 16);

  const file = new File([buf], 'animated.webp', { type: 'image/webp' });
  const result = await inspectWebpFile(file);

  assert.equal(result.isValid, true);
  assert.equal(result.isAnimated, true);
});

test('inspectWebpFile: rejects non-WebP and truncated files', async () => {
  const badBuf = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x00]); // PNG header
  const file = new File([badBuf], 'fake.webp', { type: 'image/webp' });
  const result = await inspectWebpFile(file);

  assert.equal(result.isValid, false);
});
