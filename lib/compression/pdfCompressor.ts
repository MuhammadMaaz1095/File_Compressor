import { PDFDocument } from 'pdf-lib';
import { CompressionResult, PdfSettings } from './types';
import { validateOutputBlob } from './output-validation';
import { compareFileSizes } from './file-size';
import { CompressionError } from './compression-errors';

/**
 * Optimize and compress PDF documents browser-side using pdf-lib.
 * Compresses object streams, removes redundant metadata, and compacts cross-reference tables.
 */
export async function compressPdf(
  file: File,
  settings: PdfSettings,
  onProgress?: (progress: number) => void
): Promise<CompressionResult> {
  const startTime = performance.now();
  onProgress?.(15);

  let arrayBuffer: ArrayBuffer;
  try {
    arrayBuffer = await file.arrayBuffer();
  } catch (err) {
    throw new CompressionError('Could not read PDF file buffer: ' + err, 'READ_ERROR');
  }

  onProgress?.(35);

  // Load PDF with error resilience
  let pdfDoc: PDFDocument;
  try {
    pdfDoc = await PDFDocument.load(arrayBuffer, {
      ignoreEncryption: false,
      updateMetadata: false,
    });
  } catch (err) {
    const msg = String(err);
    if (msg.includes('encrypted') || msg.includes('password')) {
      throw new CompressionError(
        'This PDF document is encrypted or password-protected and cannot be compressed.',
        'PDF_ENCRYPTED'
      );
    }
    throw new CompressionError(
      'Could not parse PDF document. File may be malformed or corrupted: ' + err,
      'PDF_LOAD_FAILED'
    );
  }

  onProgress?.(60);

  // Strip non-essential metadata if requested or in balanced/smaller presets
  if (settings.stripMetadata || settings.preset !== 'quality') {
    try {
      pdfDoc.setTitle('');
      pdfDoc.setAuthor('');
      pdfDoc.setSubject('');
      pdfDoc.setKeywords([]);
      pdfDoc.setProducer('FileCompress');
      pdfDoc.setCreator('FileCompress');
    } catch {
      // Non-critical if metadata field is read-only
    }
  }

  onProgress?.(80);

  // Save with compressed object streams (Flate/Deflate cross-reference optimization)
  let compressedBytes: Uint8Array;
  try {
    compressedBytes = await pdfDoc.save({
      useObjectStreams: settings.compressStreams !== false,
      addDefaultPage: false,
      objectsPerTick: 50,
    });
  } catch (err) {
    throw new CompressionError('Failed to serialize compressed PDF: ' + err, 'PDF_SAVE_FAILED');
  }

  const blob = new Blob([compressedBytes as unknown as BlobPart], { type: 'application/pdf' });

  // Validate output Blob
  const validation = validateOutputBlob(blob, 'pdf');
  if (!validation.isValid) {
    throw new CompressionError(validation.error || 'Invalid PDF output generated.', 'INVALID_OUTPUT');
  }

  onProgress?.(100);
  const endTime = performance.now();

  const comparison = compareFileSizes(file.size, blob.size);
  const warnings: string[] = [];

  if (comparison.outcome === 'larger' || comparison.outcome === 'unchanged') {
    warnings.push(
      'This PDF is already stream-compressed with minimal metadata. Re-saving produced no size reduction.'
    );
  }

  return {
    blob,
    compressedSize: blob.size,
    durationMs: endTime - startTime,
    mimeType: 'application/pdf',
    outcome: comparison.outcome,
    warnings,
  };
}
