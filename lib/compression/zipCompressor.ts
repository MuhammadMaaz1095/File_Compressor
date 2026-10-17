import JSZip from 'jszip';
import { compareFileSizes, type SizeComparison } from './file-size.ts';
import { CompressionError } from './compression-errors.ts';

export type ZipCompressionLevel = 'store' | 'fast' | 'balanced' | 'maximum';

export interface ZipCompressorOptions {
  level: ZipCompressionLevel;
  archiveName?: string;
  onProgress?: (percent: number, currentAction?: string) => void;
}

export interface ZipFileEntry {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
}

export interface ZipCompressorResult {
  blob: Blob;
  sizeBytes: number;
  originalTotalBytes: number;
  fileCount: number;
  archiveName: string;
  durationMs: number;
  comparison: SizeComparison;
  warnings: string[];
}

/**
 * Sanitize an archive entry name.
 * Prevents directory traversal attacks (e.g., ../secret.txt, C:\windows).
 */
export function sanitizeZipEntryName(name: string): string {
  if (!name || typeof name !== 'string') return 'unnamed-file';

  // Normalize backslashes to forward slashes
  let sanitized = name.replace(/\\/g, '/');

  // Strip leading slashes and drive letters (e.g. C:/)
  sanitized = sanitized.replace(/^[a-zA-Z]:[\\/]/, '').replace(/^\/+/, '');

  // Strip directory traversal sequences (../, ./) using a path stack
  const stack: string[] = [];
  for (const part of sanitized.split('/')) {
    if (part === '..') {
      stack.pop();
    } else if (part !== '.' && part.trim().length > 0) {
      stack.push(part);
    }
  }

  const cleaned = stack.join('/');
  // Filter illegal filesystem characters in file basenames
  const finalName = cleaned.replace(/[<>:"|?*\x00-\x1F]/g, '_').trim();

  return finalName || 'file';
}

/**
 * Sanitize the output ZIP filename.
 * Enforces .zip extension, removes illegal characters, and defaults safely.
 */
export function sanitizeArchiveFilename(name?: string): string {
  if (!name || name.trim().length === 0) {
    return 'filecompress-archive.zip';
  }

  // Remove path components
  let base = name.replace(/^.*[\\/]/, '').trim();

  // Strip invalid characters
  base = base.replace(/[<>:"/\\|?*\x00-\x1F]/g, '_').trim();

  // Strip duplicate .zip extensions and re-append
  if (base.toLowerCase().endsWith('.zip')) {
    base = base.slice(0, -4);
  }

  base = base.trim() || 'filecompress-archive';
  return `${base}.zip`;
}

/**
 * Map duplicate file names to predictable non-colliding names:
 * e.g., "report.pdf", "report (2).pdf", "report (3).pdf".
 */
export function resolveFilenameCollisions(files: File[]): { file: File; archiveEntryName: string }[] {
  const usedNames = new Map<string, number>();
  const resolved: { file: File; archiveEntryName: string }[] = [];

  for (const file of files) {
    const rawName = sanitizeZipEntryName(file.name);
    const lastDot = rawName.lastIndexOf('.');
    const baseName = lastDot > 0 ? rawName.slice(0, lastDot) : rawName;
    const ext = lastDot > 0 ? rawName.slice(lastDot) : '';

    let uniqueName = rawName;
    const currentCount = usedNames.get(rawName) || 0;

    if (currentCount > 0) {
      uniqueName = `${baseName} (${currentCount + 1})${ext}`;
    }

    usedNames.set(rawName, currentCount + 1);
    resolved.push({ file, archiveEntryName: uniqueName });
  }

  return resolved;
}

/**
 * Verify ZIP file header magic number:
 * Valid PKZIP files start with byte signature 0x50, 0x4B, 0x03, 0x04 ('PK\x03\x04').
 */
export async function verifyZipSignature(blob: Blob): Promise<boolean> {
  if (!blob || blob.size < 4) return false;

  const headerSlice = blob.slice(0, 4);
  const buffer = await headerSlice.arrayBuffer();
  const bytes = new Uint8Array(buffer);

  return (
    bytes[0] === 0x50 && // 'P'
    bytes[1] === 0x4b && // 'K'
    bytes[2] === 0x03 &&
    bytes[3] === 0x04
  );
}

/**
 * Create a real ZIP archive in-browser from a list of files using JSZip.
 */
export async function createZipArchive(
  files: File[],
  options: ZipCompressorOptions
): Promise<ZipCompressorResult> {
  const startTime = performance.now();

  if (!files || files.length === 0) {
    throw new CompressionError('No files selected for ZIP archiving.', 'NO_FILES');
  }

  // Safety checks
  const MAX_FILE_COUNT = 500;
  const MAX_TOTAL_SIZE_BYTES = 1024 * 1024 * 1024; // 1 GB safety cap for browser memory

  if (files.length > MAX_FILE_COUNT) {
    throw new CompressionError(
      `File count exceeds the maximum limit of ${MAX_FILE_COUNT} files.`,
      'TOO_MANY_FILES'
    );
  }

  const originalTotalBytes = files.reduce((acc, f) => acc + f.size, 0);
  if (originalTotalBytes > MAX_TOTAL_SIZE_BYTES) {
    throw new CompressionError(
      `Total size (${(originalTotalBytes / (1024 * 1024)).toFixed(1)} MB) exceeds browser in-memory limit of 1 GB.`,
      'SIZE_LIMIT_EXCEEDED'
    );
  }

  options.onProgress?.(5, 'Preparing files...');

  const zip = new JSZip();
  const mappedFiles = resolveFilenameCollisions(files);

  // Add files to archive
  let addedCount = 0;
  for (const item of mappedFiles) {
    zip.file(item.archiveEntryName, item.file);
    addedCount++;
    const prepPercent = 5 + Math.round((addedCount / mappedFiles.length) * 20);
    options.onProgress?.(prepPercent, `Staging ${addedCount} of ${mappedFiles.length} files...`);
  }

  // Map compression level to JSZip configuration
  let compressionType: 'STORE' | 'DEFLATE' = 'DEFLATE';
  let compressionLevel = 6; // Balanced default

  if (options.level === 'store') {
    compressionType = 'STORE';
    compressionLevel = 1;
  } else if (options.level === 'fast') {
    compressionType = 'DEFLATE';
    compressionLevel = 1;
  } else if (options.level === 'maximum') {
    compressionType = 'DEFLATE';
    compressionLevel = 9;
  } else {
    // Balanced
    compressionType = 'DEFLATE';
    compressionLevel = 6;
  }

  options.onProgress?.(25, 'Compressing archive...');

  let zipBlob: Blob;
  try {
    zipBlob = await zip.generateAsync(
      {
        type: 'blob',
        compression: compressionType,
        compressionOptions:
          compressionType === 'DEFLATE' ? { level: compressionLevel } : undefined,
        mimeType: 'application/zip',
      },
      (metadata) => {
        // JSZip provides genuine progress metadata (0 to 100%)
        const currentProgress = 25 + Math.round((metadata.percent / 100) * 70);
        options.onProgress?.(
          Math.min(95, currentProgress),
          metadata.currentFile ? `Compressing: ${metadata.currentFile}` : 'Building ZIP...'
        );
      }
    );
  } catch (err) {
    throw new CompressionError(
      'Failed to generate ZIP archive: ' + (err instanceof Error ? err.message : String(err)),
      'ZIP_GENERATION_FAILED'
    );
  }

  options.onProgress?.(96, 'Validating archive signature...');

  // Verify signature
  const isValidSignature = await verifyZipSignature(zipBlob);
  if (!isValidSignature && zipBlob.size > 0) {
    throw new CompressionError(
      'Generated ZIP failed signature verification.',
      'INVALID_ZIP_SIGNATURE'
    );
  }

  options.onProgress?.(100, 'Archive ready');

  const endTime = performance.now();
  const comparison = compareFileSizes(originalTotalBytes, zipBlob.size);
  const archiveName = sanitizeArchiveFilename(options.archiveName);

  const warnings: string[] = [];
  if (comparison.outcome === 'larger') {
    warnings.push(
      `Your ZIP archive is ${Math.round(comparison.increasePercent)}% larger than the original files. The selected files (e.g. JPEG, MP4, PDF) are already compressed, and ZIP headers add slight metadata overhead.`
    );
  } else if (comparison.outcome === 'unchanged') {
    warnings.push(
      'The generated ZIP file is identical in size to the original files (0% space saved).'
    );
  }

  return {
    blob: zipBlob,
    sizeBytes: zipBlob.size,
    originalTotalBytes,
    fileCount: files.length,
    archiveName,
    durationMs: endTime - startTime,
    comparison,
    warnings,
  };
}
