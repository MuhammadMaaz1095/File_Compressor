import type { CompressionResult } from './types.ts';
import { CompressionError } from './compression-errors.ts';
import { validateOutputBlob } from './output-validation.ts';
import { compareFileSizes } from './file-size.ts';
import { optimize } from 'svgo/browser';
import type { Config } from 'svgo';

export type SvgPreset = 'balanced' | 'aggressive' | 'lossless';

export interface SvgSettings {
  preset: SvgPreset;
  multipass?: boolean;
  floatPrecision?: number;
  removeViewBox?: boolean;
}

/**
 * Sanitizes raw SVG markup to eliminate script injection, event handlers,
 * and dangerous elements while strictly preserving gradients, masks, clipPaths,
 * viewBox, and visual geometry. Works in both browser (DOMParser) and Node.js environments.
 */
export function sanitizeSvgMarkup(svgText: string): { sanitized: string; hasRemovedThreats: boolean } {
  if (!svgText || !svgText.includes('<svg')) {
    throw new CompressionError('Invalid SVG: missing <svg> root element.', 'INVALID_FORMAT');
  }

  let cleaned = svgText;
  let hasRemovedThreats = false;

  // 1. Check for scripts <script>...</script>
  if (/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(cleaned) || /<script\b/gi.test(cleaned)) {
    cleaned = cleaned.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    cleaned = cleaned.replace(/<script\b[^>]*\/>/gi, '');
    hasRemovedThreats = true;
  }

  // 2. Check for dangerous tags: foreignObject, iframe, embed, object
  const dangerousTags = ['foreignObject', 'iframe', 'embed', 'object'];
  for (const tag of dangerousTags) {
    const tagRegex = new RegExp(`<${tag}\\b[^<]*(?:(?!<\\/${tag}>)<[^<]*)*<\\/${tag}>`, 'gi');
    if (tagRegex.test(cleaned)) {
      cleaned = cleaned.replace(tagRegex, '');
      hasRemovedThreats = true;
    }
    const selfClosingRegex = new RegExp(`<${tag}\\b[^>]*\\/>`, 'gi');
    if (selfClosingRegex.test(cleaned)) {
      cleaned = cleaned.replace(selfClosingRegex, '');
      hasRemovedThreats = true;
    }
  }

  // 3. Check for inline on* attributes (e.g. onload, onclick, onerror)
  const onAttrRegex = /\s+on[a-zA-Z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi;
  if (onAttrRegex.test(cleaned)) {
    cleaned = cleaned.replace(onAttrRegex, '');
    hasRemovedThreats = true;
  }

  // 4. Check for javascript: or vbscript: in href or xlink:href
  const jsHrefRegex = /\s+(?:xlink:)?href\s*=\s*["']\s*(?:javascript|vbscript):[^"']*["']/gi;
  if (jsHrefRegex.test(cleaned)) {
    cleaned = cleaned.replace(jsHrefRegex, '');
    hasRemovedThreats = true;
  }

  // If DOMParser is available in browser, perform an extra structural pass
  if (typeof DOMParser !== 'undefined') {
    const parser = new DOMParser();
    const doc = parser.parseFromString(cleaned, 'image/svg+xml');
    const parserError = doc.querySelector('parsererror');
    if (parserError) {
      throw new CompressionError('Invalid or malformed SVG document.', 'INVALID_FORMAT');
    }
    const serializer = new XMLSerializer();
    cleaned = serializer.serializeToString(doc);
  }

  return {
    sanitized: cleaned,
    hasRemovedThreats,
  };
}

/**
 * Compress an SVG file using browser SVGO.
 * Validates, sanitizes, and returns an optimized Blob with MIME type 'image/svg+xml'.
 */
export async function compressSvg(
  file: File,
  settings: SvgSettings = { preset: 'balanced', multipass: true, floatPrecision: 3, removeViewBox: false },
  onProgress?: (progress: number) => void
): Promise<CompressionResult> {
  const startTime = performance.now();
  onProgress?.(10);

  if (file.type !== 'image/svg+xml' && !file.name.toLowerCase().endsWith('.svg')) {
    throw new CompressionError('File is not an SVG vector image.', 'INVALID_FORMAT');
  }

  let text: string;
  try {
    text = await file.text();
  } catch (err) {
    throw new CompressionError('Failed to read SVG file content: ' + err, 'READ_FAILED');
  }

  if (!text || text.trim().length === 0) {
    throw new CompressionError('SVG file is empty (0 bytes).', 'EMPTY_FILE');
  }

  onProgress?.(25);

  // Sanitization step
  const { sanitized, hasRemovedThreats } = sanitizeSvgMarkup(text);
  const warnings: string[] = [];
  if (hasRemovedThreats) {
    warnings.push('Unsafe executable scripts or event handlers were safely removed during sanitization.');
  }

  onProgress?.(45);

  const precision = settings.floatPrecision ?? (settings.preset === 'aggressive' ? 2 : 3);
  const multipass = settings.multipass ?? (settings.preset !== 'lossless');

  let svgoConfig: Config;

  if (settings.preset === 'lossless') {
    svgoConfig = {
      multipass: false,
      plugins: [
        {
          name: 'preset-default',
          params: {
            overrides: {
              cleanupIds: false,
              removeTitle: false,
              convertPathData: false,
            },
          },
        },
      ],
    };
  } else if (settings.preset === 'aggressive') {
    svgoConfig = {
      multipass: true,
      floatPrecision: precision,
      plugins: [
        {
          name: 'preset-default',
          params: {
            overrides: {
              cleanupIds: {
                preservePrefixes: ['*'],
              },
              convertPathData: {
                floatPrecision: precision,
              },
            },
          },
        },
      ],
    };
  } else {
    // Balanced preset
    svgoConfig = {
      multipass: multipass,
      floatPrecision: precision,
      plugins: [
        {
          name: 'preset-default',
          params: {
            overrides: {
              cleanupIds: {
                preservePrefixes: ['*'],
              },
              convertPathData: {
                floatPrecision: precision,
              },
            },
          },
        },
      ],
    };
  }

  let result;
  try {
    result = optimize(sanitized, svgoConfig);
  } catch (err) {
    throw new CompressionError('SVGO optimization error: ' + (err as Error).message, 'COMPRESSION_FAILED');
  }

  onProgress?.(80);

  const outputSvgData = result.data;
  const blob = new Blob([outputSvgData], { type: 'image/svg+xml;charset=utf-8' });

  const validation = validateOutputBlob(blob, 'image');
  if (!validation.isValid) {
    throw new CompressionError(validation.error || 'Invalid SVG output generated.', 'INVALID_OUTPUT');
  }

  onProgress?.(100);
  const endTime = performance.now();
  const comparison = compareFileSizes(file.size, blob.size);

  if (comparison.outcome === 'larger') {
    warnings.push(
      'The SVG markup was already maximally compact. Adding XML serialization overhead made it slightly larger.'
    );
  }

  return {
    blob,
    compressedSize: blob.size,
    durationMs: endTime - startTime,
    width: undefined,
    height: undefined,
    mimeType: 'image/svg+xml',
    outcome: comparison.outcome,
    warnings,
  };
}
