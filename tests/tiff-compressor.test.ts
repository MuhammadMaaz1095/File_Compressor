import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isTiffSignature,
  resampleRgba,
  compressTiff,
} from '../lib/compression/tiffCompressor.ts';
import UTIF from 'utif';

test('isTiffSignature: accepts valid Little Endian and Big Endian signatures', () => {
  const leBuf = new Uint8Array([0x49, 0x49, 0x2a, 0x00, 0x08, 0x00, 0x00, 0x00]).buffer;
  assert.equal(isTiffSignature(leBuf), true);

  const beBuf = new Uint8Array([0x4d, 0x4d, 0x00, 0x2a, 0x00, 0x00, 0x00, 0x08]).buffer;
  assert.equal(isTiffSignature(beBuf), true);

  const badBuf = new Uint8Array([0x89, 0x50, 0x4e, 0x47]).buffer;
  assert.equal(isTiffSignature(badBuf), false);

  const shortBuf = new Uint8Array([0x49, 0x49]).buffer;
  assert.equal(isTiffSignature(shortBuf), false);
});

test('resampleRgba: correctly downscales pixel grid while retaining color values', () => {
  // 4x4 RGBA image filled with red pixels
  const sw = 4, sh = 4;
  const src = new Uint8Array(sw * sh * 4);
  for (let i = 0; i < src.length; i += 4) {
    src[i] = 255;   // R
    src[i + 1] = 0; // G
    src[i + 2] = 0; // B
    src[i + 3] = 255; // A
  }

  const dw = 2, dh = 2;
  const dst = resampleRgba(src, sw, sh, dw, dh);

  assert.equal(dst.length, dw * dh * 4);
  assert.equal(dst[0], 255);
  assert.equal(dst[1], 0);
  assert.equal(dst[2], 0);
  assert.equal(dst[3], 255);
});

test('compressTiff: compresses raw uncompressed TIFF with Deflate level 9', async () => {
  // Create an uncompressed 20x20 TIFF
  const w = 20, h = 20;
  const rgba = new Uint8Array(w * h * 4).fill(200);
  const rawTiffBuf = UTIF.encodeImage(rgba, w, h);

  const file = new File([rawTiffBuf], 'test.tiff', { type: 'image/tiff' });
  const result = await compressTiff(file, { compression: 'deflate', scale: 1.0 });

  assert.ok(result.compressedSize < file.size, 'Deflate compressed TIFF should be smaller than raw');
  assert.equal(result.pageCount, 1);
  assert.equal(isTiffSignature(await result.blob.arrayBuffer()), true);
});

test('compressTiff: preserves multi-page structure', async () => {
  // Create 2-page uncompressed TIFF
  const w = 15, h = 15;
  const p1 = new Uint8Array(w * h * 4).fill(255);
  const p2 = new Uint8Array(w * h * 4).fill(128);

  const ifd1 = {
    t256: [w], t257: [h], t258: [8, 8, 8, 8], t259: [1], t262: [2],
    t273: [2000], t277: [4], t278: [h], t279: [p1.length], t284: [1]
  };
  const ifd2 = {
    t256: [w], t257: [h], t258: [8, 8, 8, 8], t259: [1], t262: [2],
    t273: [2000 + p1.length], t277: [4], t278: [h], t279: [p2.length], t284: [1]
  };

  const prfx = new Uint8Array(UTIF.encode([ifd1, ifd2]));
  const combined = new Uint8Array(2000 + p1.length + p2.length);
  combined.set(prfx, 0);
  combined.set(p1, 2000);
  combined.set(p2, 2000 + p1.length);

  const file = new File([combined], 'multipage.tiff', { type: 'image/tiff' });
  const result = await compressTiff(file, { compression: 'deflate', scale: 1.0 });

  assert.equal(result.pageCount, 2, 'Should preserve both pages');
  assert.ok(result.compressedSize < file.size);
});
