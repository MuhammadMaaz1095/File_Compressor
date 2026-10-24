import test from 'node:test';
import assert from 'node:assert/strict';
import { sanitizeSvgMarkup, compressSvg } from '../lib/compression/svgCompressor.ts';

test('sanitizeSvgMarkup: removes malicious scripts and event handlers while preserving shapes', () => {
  const dirtySvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" onload="alert('xss')">
      <defs>
        <linearGradient id="grad1">
          <stop offset="0%" stop-color="#f00" />
          <stop offset="100%" stop-color="#00f" />
        </linearGradient>
      </defs>
      <script>alert('pwned')</script>
      <circle cx="50" cy="50" r="40" fill="url(#grad1)" onclick="evil()" />
      <a href="javascript:doSomething()"><rect width="10" height="10" /></a>
    </svg>
  `;

  const { sanitized, hasRemovedThreats } = sanitizeSvgMarkup(dirtySvg);

  assert.equal(hasRemovedThreats, true, 'Should detect and flag threats');
  assert.equal(sanitized.includes('<script>'), false, 'Should strip script tag');
  assert.equal(sanitized.includes('onload='), false, 'Should strip onload handler');
  assert.equal(sanitized.includes('onclick='), false, 'Should strip onclick handler');
  assert.equal(sanitized.includes('javascript:'), false, 'Should strip javascript: URI');
  assert.ok(sanitized.includes('linearGradient'), 'Should preserve linearGradient definition');
  assert.ok(sanitized.includes('circle'), 'Should preserve circle geometry');
  assert.ok(sanitized.toLowerCase().includes('viewbox'), 'Should preserve viewBox');
});

test('sanitizeSvgMarkup: throws error on missing svg root element', () => {
  const brokenSvg = '<html><body>Not an svg</body></html>';
  assert.throws(() => {
    sanitizeSvgMarkup(brokenSvg);
  });
});

test('compressSvg: optimizes SVG markup and reduces size', async () => {
  const rawSvg = `
    <!-- Generator: Adobe Illustrator, SVG Export Plug-In -->
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 200 200" width="200" height="200">
      <metadata>
        <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
          <rdf:Description rdf:about="" />
        </rdf:RDF>
      </metadata>
      <g id="Layer_1">
        <path d="M 10.0000 10.0000 L 100.0000 10.0000 L 100.0000 100.0000 Z" fill="#FF0000" />
      </g>
    </svg>
  `;

  const file = new File([rawSvg], 'sample.svg', { type: 'image/svg+xml' });
  const result = await compressSvg(file, { preset: 'balanced', multipass: true });

  assert.ok(result.compressedSize < file.size, 'Compressed size should be smaller than raw size');
  assert.equal(result.mimeType, 'image/svg+xml');
  const text = await result.blob.text();
  assert.equal(text.includes('Adobe Illustrator'), false, 'Comments should be stripped');
  assert.equal(text.includes('<metadata>'), false, 'Metadata should be stripped');
  assert.ok(text.toLowerCase().includes('viewbox'), 'viewBox should be preserved');
});
