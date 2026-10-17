/**
 * Canonical File-Size and Compression Comparison Utilities.
 * All calculations use exact byte counts. Formatted strings are for display only.
 */

export type CompressionOutcome = 'reduced' | 'unchanged' | 'larger';

export interface SizeComparison {
  originalBytes: number;
  outputBytes: number;
  savedBytes: number;
  increaseBytes: number;
  reductionPercent: number; // Positive if reduced (e.g. +35.2%), negative if larger (e.g. -110.9%), 0 if unchanged
  increasePercent: number;  // Positive if larger (e.g. +110.9%), 0 otherwise
  outputIsLarger: boolean;
  outputIsUnchanged: boolean;
  sizeChanged: boolean;
  outcome: CompressionOutcome;
}

/**
 * Compare original and output byte sizes accurately.
 * Throws on non-finite or negative numbers.
 * Safely handles 0-byte edge cases.
 */
export function compareFileSizes(
  originalBytes: number,
  outputBytes: number
): SizeComparison {
  if (
    !Number.isFinite(originalBytes) ||
    !Number.isFinite(outputBytes) ||
    originalBytes < 0 ||
    outputBytes < 0
  ) {
    throw new Error('Invalid file size byte values provided for comparison.');
  }

  // Edge case: empty original file
  if (originalBytes === 0) {
    const isLarger = outputBytes > 0;
    return {
      originalBytes: 0,
      outputBytes,
      savedBytes: 0,
      increaseBytes: outputBytes,
      reductionPercent: 0,
      increasePercent: isLarger ? 100 : 0,
      outputIsLarger: isLarger,
      outputIsUnchanged: outputBytes === 0,
      sizeChanged: outputBytes !== 0,
      outcome: isLarger ? 'larger' : 'unchanged',
    };
  }

  const savedBytes = originalBytes - outputBytes;
  const outputIsLarger = outputBytes > originalBytes;
  const outputIsUnchanged = outputBytes === originalBytes;
  const sizeChanged = outputBytes !== originalBytes;

  // reductionPercent: positive when smaller, negative when larger
  const reductionPercent = ((originalBytes - outputBytes) / originalBytes) * 100;

  // increasePercent: positive percentage increase when output is larger
  const increaseBytes = outputIsLarger ? outputBytes - originalBytes : 0;
  const increasePercent = outputIsLarger
    ? ((outputBytes - originalBytes) / originalBytes) * 100
    : 0;

  let outcome: CompressionOutcome = 'reduced';
  if (outputIsLarger) {
    outcome = 'larger';
  } else if (outputIsUnchanged) {
    outcome = 'unchanged';
  }

  return {
    originalBytes,
    outputBytes,
    savedBytes,
    increaseBytes,
    reductionPercent,
    increasePercent,
    outputIsLarger,
    outputIsUnchanged,
    sizeChanged,
    outcome,
  };
}

/**
 * Format raw byte count into human-readable string (B, KB, MB, GB).
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (!Number.isFinite(bytes) || bytes < 0) return '0 B';
  if (bytes === 0) return '0 B';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const unitIndex = Math.min(i, sizes.length - 1);
  const value = bytes / Math.pow(k, unitIndex);

  return `${parseFloat(value.toFixed(dm))} ${sizes[unitIndex]}`;
}

/**
 * Format reduction percentage for UI display.
 * Honest: Displays positive reduction as e.g. "35.2%", unchanged as "0%", and larger as "-110.9%".
 */
export function formatReductionPercent(reductionPercent: number): string {
  if (!Number.isFinite(reductionPercent)) return '0%';
  if (Math.abs(reductionPercent) < 0.05) return '0%';

  const sign = reductionPercent > 0 ? '-' : '+';
  return `${sign}${Math.abs(reductionPercent).toFixed(1)}%`;
}

/**
 * Generate human-friendly descriptive comparison text.
 */
export function getComparisonSummary(comparison: SizeComparison): {
  headline: string;
  details: string;
  badgeType: 'success' | 'warning' | 'neutral';
} {
  if (comparison.outcome === 'reduced') {
    return {
      headline: `${formatBytes(comparison.savedBytes)} saved (${Math.abs(comparison.reductionPercent).toFixed(1)}% smaller)`,
      details: `Reduced from ${formatBytes(comparison.originalBytes)} to ${formatBytes(comparison.outputBytes)}`,
      badgeType: 'success',
    };
  }

  if (comparison.outcome === 'larger') {
    return {
      headline: `Output is ${Math.round(comparison.increasePercent)}% larger (+${formatBytes(comparison.increaseBytes)})`,
      details: `Original: ${formatBytes(comparison.originalBytes)} → Output: ${formatBytes(comparison.outputBytes)}`,
      badgeType: 'warning',
    };
  }

  return {
    headline: 'No size reduction (0% saved)',
    details: `Output size equals original size (${formatBytes(comparison.originalBytes)})`,
    badgeType: 'neutral',
  };
}
