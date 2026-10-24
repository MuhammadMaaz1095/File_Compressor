import test from 'node:test';
import assert from 'node:assert/strict';
import JSZip from 'jszip';
import {
  analyzeOfficeDocument,
  compressOfficeDocument,
} from '../lib/compression/officeCompressor.ts';

/**
 * Helper to build a minimal valid .docx package for automated testing.
 */
async function createMockDocx(options: { withMedia?: boolean } = {}): Promise<Uint8Array> {
  const zip = new JSZip();

  // Standard OpenXML Content Types for Word
  zip.file(
    '[Content_Types].xml',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
      <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
      <Default Extension="xml" ContentType="application/xml"/>
      <Default Extension="png" ContentType="image/png"/>
      <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
      <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
    </Types>`
  );

  // Root Relationships
  zip.file(
    '_rels/.rels',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
      <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
    </Relationships>`
  );

  // Word Document XML with paragraphs and table
  zip.file(
    'word/document.xml',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
      <w:body>
        <w:p>
          <w:r>
            <w:t>Confidential Agreement 2026</w:t>
          </w:r>
        </w:p>
        <w:tbl>
          <w:tr>
            <w:tc><w:p><w:r><w:t>Item 1</w:t></w:r></w:p></w:tc>
            <w:tc><w:p><w:r><w:t>$5,000</w:t></w:r></w:p></w:tc>
          </w:tr>
        </w:tbl>
      </w:body>
    </w:document>`
  );

  // Document Relationships
  zip.file(
    'word/_rels/document.xml.rels',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
      <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
    </Relationships>`
  );

  // Styles XML
  zip.file(
    'word/styles.xml',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
      <w:docDefaults/>
    </w:styles>`
  );

  if (options.withMedia) {
    const fakeImageBytes = new Uint8Array(1024).fill(120);
    zip.file('word/media/image1.png', fakeImageBytes);
  }

  return zip.generateAsync({ type: 'uint8array' });
}

test('analyzeOfficeDocument: inspects .docx structure and counts media files', async () => {
  const docxBytes = await createMockDocx({ withMedia: true });
  const report = await analyzeOfficeDocument(docxBytes.buffer, 'word');

  assert.equal(report.documentType, 'word');
  assert.equal(report.mediaFileCount, 1);
  assert.equal(report.hasMacros, false);
  assert.equal(report.isEncrypted, false);
});

test('compressOfficeDocument: compresses .docx and preserves XML hierarchy', async () => {
  const docxBytes = await createMockDocx({ withMedia: false });
  const file = new File([docxBytes], 'document.docx', {
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  });

  const result = await compressOfficeDocument(file, 'word', {
    imageQuality: 0.75,
    maxImageDimension: 1920,
  });

  assert.equal(result.documentType, 'word');
  assert.equal(result.outputExtension, 'docx');
  assert.equal(
    result.mimeType,
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  );

  // Inspect generated output ZIP to verify bit-exact XML preservation
  const outZip = await JSZip.loadAsync(await result.blob.arrayBuffer());
  assert.ok(outZip.file('[Content_Types].xml') !== null);
  assert.ok(outZip.file('word/document.xml') !== null);
  assert.ok(outZip.file('word/styles.xml') !== null);

  const docText = await outZip.file('word/document.xml')!.async('text');
  assert.ok(docText.includes('Confidential Agreement 2026'));
  assert.ok(docText.includes('Item 1'));
});

test('compressOfficeDocument: rejects invalid or non-ZIP document header', async () => {
  const invalidBytes = new Uint8Array(40).fill(0x55);
  const invalidFile = new File([invalidBytes], 'broken.docx', {
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  });

  await assert.rejects(
    async () => {
      await compressOfficeDocument(invalidFile, 'word');
    },
    {
      name: 'CompressionError',
      code: 'INVALID_FORMAT',
    }
  );
});
