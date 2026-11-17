import { MetadataRoute } from 'next';
import { getSiteOrigin } from '@/lib/seo/site-config';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getSiteOrigin();

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
