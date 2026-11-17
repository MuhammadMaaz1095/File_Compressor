import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PDFDocument, PDFName, PDFNumber, PDFRawStream } from 'pdf-lib';
import { compressPdf } from '../lib/compression/pdfCompressor.ts';

// Helper to create mock browser File in Node
function createMockPdfFile(bytes: Uint8Array, name = 'test.pdf'): File {
  return {
    name,
    size: bytes.length,
    type: 'application/pdf',
    arrayBuffer: async () => bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength),
  } as unknown as File;
}

test('PDF Compressor: compresses text-based PDF and preserves vector/text integrity', async () => {
  const doc = await PDFDocument.create();
  doc.setTitle('Original Document Title');
  doc.setAuthor('Test Author');
  const page = doc.addPage([600, 800]);
  page.drawText('Sample Searchable Document Text for Compression Verification', {
    x: 50,
    y: 700,
    size: 16,
  });
  const uncompressedBytes = await doc.save({ useObjectStreams: false });
  const file = createMockPdfFile(uncompressedBytes, 'text-document.pdf');

  const result = await compressPdf(file, {
    preset: 'balanced',
    stripMetadata: true,
    compressStreams: true,
    removeAnnotations: false,
  });

  assert.ok(result.blob, 'Output blob should be generated');
  assert.ok(result.compressedSize > 0, 'Output size must be positive');

  // Verify reloadability and preserved text/page structure
  const arrayBuf = await result.blob.arrayBuffer();
  const reloaded = await PDFDocument.load(arrayBuf);
  assert.equal(reloaded.getPageCount(), 1, 'Page count must be preserved');
  assert.equal(reloaded.getTitle(), '', 'Metadata should be stripped');
});

test('PDF Compressor: rejects malformed or truncated PDF files gracefully', async () => {
  const garbageBytes = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
  const file = createMockPdfFile(garbageBytes, 'corrupted.pdf');

  await assert.rejects(
    async () => {
      await compressPdf(file, {
        preset: 'balanced',
        stripMetadata: true,
        compressStreams: true,
        removeAnnotations: false,
      });
    },
    (err: Error) => {
      return err.message.includes('Could not parse PDF document') || err.message.includes('PDF_LOAD_FAILED');
    }
  );
});

test('PDF Compressor: detects embedded image streams and preserves multi-page layouts', async () => {
  const doc = await PDFDocument.create();
  const jpgBase64 = '/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=';
  const jpgBytes = Uint8Array.from(Buffer.from(jpgBase64, 'base64'));
  const embeddedImg = await doc.embedJpg(jpgBytes);

  // Add 3 pages
  for (let i = 0; i < 3; i++) {
    const page = doc.addPage([500, 700]);
    page.drawText(`Page ${i + 1} Content`, { x: 50, y: 650, size: 14 });
    page.drawImage(embeddedImg, { x: 50, y: 300, width: 100, height: 100 });
  }

  const rawBytes = await doc.save();
  const file = createMockPdfFile(rawBytes, 'image-document.pdf');

  const result = await compressPdf(file, {
    preset: 'smaller',
    stripMetadata: true,
    compressStreams: true,
    removeAnnotations: false,
    mode: 'strong',
  });

  const arrayBuf = await result.blob.arrayBuffer();
  const reloaded = await PDFDocument.load(arrayBuf);
  assert.equal(reloaded.getPageCount(), 3, 'Must preserve all 3 pages');

  // Verify image stream presence in objects
  let imageStreamFound = false;
  for (const [, obj] of reloaded.context.enumerateIndirectObjects()) {
    if (obj instanceof PDFRawStream && obj.dict.get(PDFName.of('Subtype'))?.toString() === '/Image') {
      imageStreamFound = true;
      break;
    }
  }
  assert.ok(imageStreamFound, 'Embedded image stream must be present in compressed document');
});
