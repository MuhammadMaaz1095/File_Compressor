import test from 'node:test';
import assert from 'node:assert/strict';
import {
  sanitizeZipEntryName,
  sanitizeArchiveFilename,
  resolveFilenameCollisions,
  verifyZipSignature,
  createZipArchive,
} from '../lib/compression/zipCompressor.ts';

test('sanitizeZipEntryName: prevents directory traversal and cleans invalid characters', () => {
  assert.equal(sanitizeZipEntryName('../../secret.txt'), 'secret.txt');
  assert.equal(sanitizeZipEntryName('/etc/passwd'), 'etc/passwd');
  assert.equal(sanitizeZipEntryName('C:\\Windows\\system32\\calc.exe'), 'Windows/system32/calc.exe');
  assert.equal(sanitizeZipEntryName('folder/../sub/file.pdf'), 'sub/file.pdf');
  assert.equal(sanitizeZipEntryName('normal-file.png'), 'normal-file.png');
  assert.equal(sanitizeZipEntryName('bad*name?.txt'), 'bad_name_.txt');
  assert.equal(sanitizeZipEntryName(''), 'unnamed-file');
});

test('sanitizeArchiveFilename: ensures .zip extension and safe name', () => {
  assert.equal(sanitizeArchiveFilename('my-archive'), 'my-archive.zip');
  assert.equal(sanitizeArchiveFilename('my-archive.zip'), 'my-archive.zip');
  assert.equal(sanitizeArchiveFilename('folder/my-archive.zip'), 'my-archive.zip');
  assert.equal(sanitizeArchiveFilename(''), 'filecompress-archive.zip');
  assert.equal(sanitizeArchiveFilename('   '), 'filecompress-archive.zip');
});

test('resolveFilenameCollisions: resolves duplicate names predictably', () => {
  const file1 = new File(['hello'], 'document.pdf', { type: 'application/pdf' });
  const file2 = new File(['world'], 'document.pdf', { type: 'application/pdf' });
  const file3 = new File(['again'], 'document.pdf', { type: 'application/pdf' });
  const file4 = new File(['photo'], 'image.jpg', { type: 'image/jpeg' });

  const resolved = resolveFilenameCollisions([file1, file2, file3, file4]);

  assert.equal(resolved.length, 4);
  assert.equal(resolved[0].archiveEntryName, 'document.pdf');
  assert.equal(resolved[1].archiveEntryName, 'document (2).pdf');
  assert.equal(resolved[2].archiveEntryName, 'document (3).pdf');
  assert.equal(resolved[3].archiveEntryName, 'image.jpg');
});

test('verifyZipSignature: validates PK 0x03 0x04 header on real ZIP blob', async () => {
  // PK\x03\x04 signature
  const validHeader = new Uint8Array([0x50, 0x4b, 0x03, 0x04, 0x00, 0x00]);
  const validBlob = new Blob([validHeader]);
  const isValid = await verifyZipSignature(validBlob);
  assert.equal(isValid, true);

  // Invalid header
  const invalidHeader = new Uint8Array([0x00, 0x00, 0x00, 0x00]);
  const invalidBlob = new Blob([invalidHeader]);
  const isInvalid = await verifyZipSignature(invalidBlob);
  assert.equal(isInvalid, false);
});

test('createZipArchive: creates valid archive with single file', async () => {
  const textContent = 'This is a test file for ZIP compression verification in Node.js.'.repeat(20);
  const file = new File([textContent], 'sample.txt', { type: 'text/plain' });

  let reportedProgress = 0;
  const res = await createZipArchive([file], {
    level: 'balanced',
    archiveName: 'test-single.zip',
    onProgress: (p) => {
      reportedProgress = p;
    },
  });

  assert.ok(res.blob.size > 0);
  assert.equal(res.fileCount, 1);
  assert.equal(res.archiveName, 'test-single.zip');
  assert.equal(reportedProgress, 100);

  // Plain repeated text compresses significantly
  assert.equal(res.comparison.outcome, 'reduced');
  assert.ok(res.comparison.savedBytes > 0);
  assert.ok(res.comparison.reductionPercent > 40);

  // Verify header signature
  const signatureOk = await verifyZipSignature(res.blob);
  assert.equal(signatureOk, true);
});

test('createZipArchive: creates valid archive with multiple mixed files', async () => {
  const file1 = new File(['alpha beta gamma delta '.repeat(50)], 'alpha.txt', { type: 'text/plain' });
  const file2 = new File(['1,2,3,4,5,6,7,8,9,10\n'.repeat(50)], 'numbers.csv', { type: 'text/csv' });
  const file3 = new File(['dummy-binary-content'], 'binary.bin', { type: 'application/octet-stream' });

  const res = await createZipArchive([file1, file2, file3], {
    level: 'maximum',
    archiveName: 'multi-archive.zip',
  });

  assert.equal(res.fileCount, 3);
  assert.ok(res.blob.size > 0);
  assert.ok(res.originalTotalBytes === file1.size + file2.size + file3.size);
  assert.equal(res.comparison.outcome, 'reduced');

  const signatureOk = await verifyZipSignature(res.blob);
  assert.equal(signatureOk, true);
});

test('createZipArchive: supports "store" (no compression) mode', async () => {
  const file = new File(['uncompressed store test content'], 'store.txt', { type: 'text/plain' });

  const res = await createZipArchive([file], {
    level: 'store',
    archiveName: 'store.zip',
  });

  assert.ok(res.blob.size > 0);
  const signatureOk = await verifyZipSignature(res.blob);
  assert.equal(signatureOk, true);
});

test('createZipArchive: correctly handles already-compressed files that become larger in ZIP', async () => {
  // A tiny 10-byte file will be larger in ZIP due to central directory and local headers (~120+ bytes)
  const tinyFile = new File(['1234567890'], 'tiny.dat', { type: 'application/octet-stream' });

  const res = await createZipArchive([tinyFile], {
    level: 'balanced',
    archiveName: 'tiny.zip',
  });

  assert.equal(res.comparison.outcome, 'larger');
  assert.ok(res.comparison.outputIsLarger);
  assert.ok(res.comparison.increasePercent > 0);
  assert.ok(res.warnings.length > 0);
  assert.match(res.warnings[0], /larger than the original files/i);
});
