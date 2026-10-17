import test from 'node:test';
import assert from 'node:assert/strict';
import { validateOutputBlob, validateInputFile } from '../lib/compression/output-validation.ts';

test('validateOutputBlob: rejects null and empty blobs', () => {
  const nullRes = validateOutputBlob(null, 'image');
  assert.equal(nullRes.isValid, false);

  const zeroBlob = new Blob([], { type: 'image/jpeg' });
  const zeroRes = validateOutputBlob(zeroBlob, 'image');
  assert.equal(zeroRes.isValid, false);
});

test('validateOutputBlob: accepts valid non-empty blobs', () => {
  const validBlob = new Blob(['sample-compressed-data-content'], { type: 'image/jpeg' });
  const res = validateOutputBlob(validBlob, 'image');
  assert.equal(res.isValid, true);
  assert.ok(res.sizeBytes > 0);
});

test('validateOutputBlob: enforces category MIME type agreement', () => {
  const mismatchedBlob = new Blob(['some data'], { type: 'audio/mpeg' });
  const res = validateOutputBlob(mismatchedBlob, 'video');
  assert.equal(res.isValid, false);
  assert.match(res.error || '', /Expected video output/);
});

test('validateInputFile: rejects 0-byte input files', () => {
  // Mock File in Node
  const fakeEmptyFile = new File([], 'empty.pdf', { type: 'application/pdf' });
  const res = validateInputFile(fakeEmptyFile);
  assert.equal(res.isValid, false);
  assert.match(res.error || '', /empty 0-byte file/);
});
