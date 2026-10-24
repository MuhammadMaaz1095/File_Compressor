import test from 'node:test';
import assert from 'node:assert/strict';
import JSZip from 'jszip';
import {
  analyzeOfficeDocument,
  compressOfficeDocument,
} from '../lib/compression/officeCompressor.ts';

/**
 * Helper to build a minimal valid .xlsx package for automated testing.
 */
async function createMockXlsx(options: { withMedia?: boolean } = {}): Promise<Uint8Array> {
  const zip = new JSZip();

  // Standard OpenXML Content Types
  zip.file(
    '[Content_Types].xml',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
      <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
      <Default Extension="xml" ContentType="application/xml"/>
      <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
      <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
      <Override PartName="/xl/worksheets/sheet2.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
    </Types>`
  );

  // Root Relationships
  zip.file(
    '_rels/.rels',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
      <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
    </Relationships>`
  );

  // Workbook XML with sheets
  zip.file(
    'xl/workbook.xml',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
      <sheets>
        <sheet name="Sales2026" sheetId="1" r:id="rId1"/>
        <sheet name="Summary" sheetId="2" r:id="rId2"/>
      </sheets>
    </workbook>`
  );

  // Sheet 1 with formula SUM(A1:A10)
  zip.file(
    'xl/worksheets/sheet1.xml',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
      <sheetData>
        <row r="1"><c r="A1"><v>100</v></c></row>
        <row r="2"><c r="A2"><v>200</v></c></row>
        <row r="3"><c r="A3"><f>SUM(A1:A2)</f><v>300</v></c></row>
      </sheetData>
    </worksheet>`
  );

  // Sheet 2
  zip.file(
    'xl/worksheets/sheet2.xml',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
      <sheetData><row r="1"><c r="A1"><v>Summary Data</v></c></row></sheetData>
    </worksheet>`
  );

  if (options.withMedia) {
    // Add dummy image in xl/media/
    const dummyImageBytes = new Uint8Array(5000);
    dummyImageBytes.fill(123);
    zip.file('xl/media/image1.png', dummyImageBytes);
  }

  return await zip.generateAsync({ type: 'uint8array', compression: 'DEFLATE' });
}

test('Excel Compressor: analyzeOfficeDocument identifies sheets and media', async () => {
  const xlsxBytes = await createMockXlsx({ withMedia: true });
  const report = await analyzeOfficeDocument(xlsxBytes.buffer as ArrayBuffer, 'excel');

  assert.equal(report.documentType, 'excel');
  assert.equal(report.sheetOrSlideCount, 2, 'Should detect 2 worksheets');
  assert.equal(report.mediaFileCount, 1, 'Should detect 1 embedded media file');
  assert.equal(report.hasMacros, false);
  assert.equal(report.isEncrypted, false);
});

test('Excel Compressor: compressOfficeDocument preserves worksheet XML, formulas, and produces valid package', async () => {
  const xlsxBytes = await createMockXlsx({ withMedia: true });
  const fakeFile = new File([xlsxBytes], 'financial_report.xlsx', {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  const result = await compressOfficeDocument(fakeFile, 'excel', {
    imageQuality: 0.75,
    maxImageDimension: 1920,
  });

  assert.equal(result.documentType, 'excel');
  assert.equal(result.outputExtension, 'xlsx');
  assert.equal(result.sheetOrSlideCount, 2);
  assert.ok(result.compressedSize > 0);

  // Verify resulting Blob by reloading with JSZip and checking XML contents
  const resBuf = await result.blob.arrayBuffer();
  const resZip = await JSZip.loadAsync(resBuf);

  // Assert Sheet 1 still contains the exact formula SUM(A1:A2)
  const sheet1Xml = await resZip.file('xl/worksheets/sheet1.xml')?.async('text');
  assert.ok(sheet1Xml, 'Sheet 1 XML must exist in output package');
  assert.ok(sheet1Xml.includes('<f>SUM(A1:A2)</f>'), 'Formula must be preserved intact');

  // Assert Sheet 2 still exists
  const sheet2Xml = await resZip.file('xl/worksheets/sheet2.xml')?.async('text');
  assert.ok(sheet2Xml, 'Sheet 2 XML must exist in output package');

  // Assert [Content_Types].xml exists
  assert.ok(resZip.file('[Content_Types].xml') !== null);
});

test('Excel Compressor: rejects invalid non-ZIP files', async () => {
  const badBytes = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
  const fakeFile = new File([badBytes], 'corrupt.xlsx', {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  await assert.rejects(async () => {
    await compressOfficeDocument(fakeFile, 'excel');
  });
});
