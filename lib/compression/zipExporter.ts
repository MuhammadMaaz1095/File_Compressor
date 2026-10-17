import JSZip from 'jszip';
import { QueueItem } from './types';
import { getCompressedFilename } from '../utils/formatters';

/**
 * Bundle multiple compressed files into a single ZIP archive for batch download.
 * By default includes all items with valid output Blobs (reduced, unchanged, or larger).
 */
export async function downloadAllAsZip(
  items: QueueItem[],
  zipFilename = 'filecompress-archive.zip'
): Promise<void> {
  const readyItems = items.filter(
    (item) => (item.status === 'completed' || item.status === 'larger' || item.status === 'unchanged') && item.compressedBlob && item.compressedBlob.size > 0
  );

  if (readyItems.length === 0) {
    throw new Error('No valid processed files available to download');
  }

  const zip = new JSZip();
  const usedNames = new Set<string>();

  for (const item of readyItems) {
    if (!item.compressedBlob) continue;

    let filename = getCompressedFilename(item.name, item.compressedBlob.type);

    // Prevent name collisions in zip archive
    if (usedNames.has(filename)) {
      const dotIndex = filename.lastIndexOf('.');
      const name = dotIndex > 0 ? filename.slice(0, dotIndex) : filename;
      const ext = dotIndex > 0 ? filename.slice(dotIndex) : '';
      let counter = 1;
      while (usedNames.has(`${name}-${counter}${ext}`)) {
        counter++;
      }
      filename = `${name}-${counter}${ext}`;
    }

    usedNames.add(filename);
    zip.file(filename, item.compressedBlob);
  }

  const content = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });

  // Trigger download
  const url = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = url;
  a.download = zipFilename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // Retain object URL for 60 seconds to ensure the browser download finishes
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}

/**
 * Download a single compressed file.
 */
export function downloadSingleFile(item: QueueItem): void {
  if (!item.compressedBlob || item.compressedBlob.size === 0) return;

  const filename = getCompressedFilename(
    item.name,
    item.compressedBlob.type
  );

  const url = URL.createObjectURL(item.compressedBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // Retain object URL for 60 seconds to ensure download starts cleanly
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}
