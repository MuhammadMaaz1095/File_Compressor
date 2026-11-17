/**
 * Centralized Site and Domain Configuration for FileCompress.
 *
 * Ensures all canonical URLs, Open Graph tags, sitemaps, robots.txt,
 * breadcrumbs, and JSON-LD schemas use a single verified, normalized origin.
 *
 * Configurable via `NEXT_PUBLIC_SITE_URL` environment variable.
 */

const DEFAULT_ORIGIN = 'https://filecompress.app';

/**
 * Normalizes a URL string:
 * - Trims whitespace
 * - Strips trailing slashes
 * - Enforces HTTPS in production
 * - Validates URL format
 */
export function normalizeSiteUrl(rawUrl?: string): string {
  const urlCandidate = (rawUrl || '').trim();
  if (!urlCandidate) {
    return DEFAULT_ORIGIN;
  }

  try {
    const parsed = new URL(urlCandidate);
    // Remove trailing slash from pathname
    let origin = `${parsed.protocol}//${parsed.host}`;

    // Enforce HTTPS in production environments
    if (process.env.NODE_ENV === 'production' && origin.startsWith('http://') && !origin.includes('localhost')) {
      origin = origin.replace('http://', 'https://');
    }

    return origin;
  } catch {
    // If malformed, fallback safely to default origin
    return DEFAULT_ORIGIN;
  }
}

/**
 * Single source of truth for the site's base origin URL.
 */
export function getSiteOrigin(): string {
  return normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
}

/**
 * Get an absolute canonical URL for a given pathname.
 * Handles leading/trailing slashes reliably.
 */
export function getCanonicalUrl(pathname: string = '/'): string {
  const origin = getSiteOrigin();
  const cleanPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  if (cleanPath === '/') {
    return origin;
  }
  return `${origin}${cleanPath.replace(/\/+$/, '')}`;
}

export const siteConfig = {
  name: 'FileCompress',
  shortName: 'FileCompress',
  brandName: 'FileCompress',
  description:
    'Free online file compressor. Reduce file sizes for images, PDFs, videos, audio, and ZIP archives directly in your browser with 100% on-device privacy.',
  get origin() {
    return getSiteOrigin();
  },
};
