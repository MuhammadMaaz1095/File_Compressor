/**
 * User-friendly, diagnostic error classifications for browser-side compression.
 */

export class CompressionError extends Error {
  public readonly code: string;
  public readonly isRecoverable: boolean;

  constructor(message: string, code = 'COMPRESSION_FAILED', isRecoverable = false) {
    super(message);
    this.name = 'CompressionError';
    this.code = code;
    this.isRecoverable = isRecoverable;
  }
}

export function formatCompressionErrorMessage(err: unknown): string {
  if (err instanceof CompressionError) {
    return err.message;
  }

  const msg = err instanceof Error ? err.message : String(err || 'Unknown processing error');

  if (msg.includes('decode') || msg.includes('demux') || msg.includes('unsupported codec')) {
    return 'The browser could not decode this media format. The codec may not be supported natively by your browser.';
  }

  if (msg.includes('memory') || msg.includes('allocation') || msg.includes('RangeError')) {
    return 'Browser ran out of memory while processing this file. Try a smaller file or close other browser tabs.';
  }

  if (msg.includes('encrypted') || msg.includes('password')) {
    return 'This document is encrypted or password-protected and cannot be compressed without unlocking.';
  }

  if (msg.includes('Timeout')) {
    return 'Processing timed out. The file may be corrupt or too complex for browser memory.';
  }

  return msg;
}
