import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isPngSignature,
  crc32,
  buildPngChunk,
  encodePng8,
  encodePng32,
} from '../lib/compression/pngCompressor.ts';

test('isPngSignature: accepts valid PNG magic bytes and rejects bad header', () => {
  const validHeader = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00]);
  assert.equal(isPngSignature(validHeader), true);

  const invalidHeader = new Uint8Array([0x89, 0x50, 0x4e, 0x48, 0x0d, 0x0a, 0x1a, 0x0a]);
  assert.equal(isPngSignature(invalidHeader), false);

  const shortHeader = new Uint8Array([0x89, 0x50]);
  assert.equal(isPngSignature(shortHeader), false);
});

test('crc32: computes correct CRC-32 for standard test vectors', () => {
  // Test IEND chunk data (type 'IEND' without data)
  const iendType = new TextEncoder().encode('IEND');
  const crcVal = crc32(iendType);
  // Standard PNG IEND CRC is 0xAE426082
  assert.equal(crcVal, 0xae426082);
});

test('buildPngChunk: structures [length][type][data][crc] correctly', () => {
  const data = new Uint8Array([1, 2, 3, 4]);
  const chunk = buildPngChunk('TEST', data);

  // Length = 4 bytes length + 4 bytes type + 4 bytes data + 4 bytes crc = 16 bytes
  assert.equal(chunk.length, 16);

  // Length field (big endian 4)
  assert.equal(chunk[0], 0);
  assert.equal(chunk[1], 0);
  assert.equal(chunk[2], 0);
  assert.equal(chunk[3], 4);

  // Type field 'TEST'
  const typeStr = String.fromCharCode(chunk[4], chunk[5], chunk[6], chunk[7]);
  assert.equal(typeStr, 'TEST');
});

test('encodePng8: generates valid indexed PNG with PLTE and tRNS chunks', async () => {
  // 2x2 image with red, green, blue, and transparent pixels
  const rgba = new Uint8ClampedArray([
    255, 0, 0, 255,   // red
    0, 255, 0, 255,   // green
    0, 0, 255, 255,   // blue
    0, 0, 0, 0,       // transparent
  ]);

  const pngBytes = await encodePng8(rgba, 2, 2, 64);

  assert.ok(pngBytes.length > 30);
  assert.equal(isPngSignature(pngBytes), true);

  // Check presence of IHDR, PLTE, and tRNS in byte stream
  const pngText = new TextDecoder('latin1').decode(pngBytes);
  assert.ok(pngText.includes('IHDR'), 'Must contain IHDR chunk');
  assert.ok(pngText.includes('PLTE'), 'Must contain PLTE chunk for PNG-8');
  assert.ok(pngText.includes('tRNS'), 'Must contain tRNS chunk for alpha transparency');
  assert.ok(pngText.includes('IDAT'), 'Must contain IDAT chunk');
  assert.ok(pngText.includes('IEND'), 'Must contain IEND chunk');
});

test('encodePng32: generates valid 32-bit truecolor RGBA PNG', async () => {
  const rgba = new Uint8ClampedArray([
    255, 255, 255, 255,
    0, 0, 0, 255,
  ]);

  const pngBytes = await encodePng32(rgba, 2, 1);

  assert.ok(pngBytes.length > 20);
  assert.equal(isPngSignature(pngBytes), true);

  const pngText = new TextDecoder('latin1').decode(pngBytes);
  assert.ok(pngText.includes('IHDR'), 'Must contain IHDR chunk');
  assert.ok(pngText.includes('IDAT'), 'Must contain IDAT chunk');
  assert.ok(pngText.includes('IEND'), 'Must contain IEND chunk');
});
