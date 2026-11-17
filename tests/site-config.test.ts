import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeSiteUrl, getCanonicalUrl } from '../lib/seo/site-config.ts';

test('site-config: normalizeSiteUrl handles normal URLs and removes trailing slashes', () => {
  assert.equal(normalizeSiteUrl('https://filecompress.app/'), 'https://filecompress.app');
  assert.equal(normalizeSiteUrl('https://filecompress.app///'), 'https://filecompress.app');
  assert.equal(normalizeSiteUrl('https://example.com'), 'https://example.com');
});

test('site-config: normalizeSiteUrl falls back safely on empty or malformed inputs', () => {
  assert.equal(normalizeSiteUrl(''), 'https://filecompress.app');
  assert.equal(normalizeSiteUrl(undefined), 'https://filecompress.app');
  assert.equal(normalizeSiteUrl('not-a-valid-url'), 'https://filecompress.app');
});

test('site-config: getCanonicalUrl builds clean, absolute canonical routes', () => {
  const origin = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
  assert.equal(getCanonicalUrl('/'), origin);
  assert.equal(getCanonicalUrl('/image-compressor'), `${origin}/image-compressor`);
  assert.equal(getCanonicalUrl('pdf-compressor/'), `${origin}/pdf-compressor`);
  assert.equal(getCanonicalUrl('/zip-compressor'), `${origin}/zip-compressor`);
});
