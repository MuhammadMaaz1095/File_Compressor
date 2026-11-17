import React from 'react';
import { getSiteOrigin } from '@/lib/seo/site-config';

interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export interface SoftwareAppOptions {
  name?: string;
  urlPath?: string;
  description?: string;
  applicationCategory?: string;
  featureList?: string[];
}

export function getSoftwareAppSchema(options: SoftwareAppOptions = {}) {
  const origin = getSiteOrigin();
  const url = options.urlPath
    ? `${origin}${options.urlPath.startsWith('/') ? options.urlPath : `/${options.urlPath}`}`
    : origin;

  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: options.name || 'FileCompress',
    url,
    operatingSystem: 'Any (Web Browser)',
    applicationCategory: options.applicationCategory || 'MultimediaApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description:
      options.description ||
      'Free, secure, browser-based online file compressor for images, PDFs, videos, audio, and ZIP archives with zero server uploads.',
    featureList: options.featureList || [
      'Client-side image compression for JPEG, PNG, and WebP',
      'PDF stream and embedded image optimization',
      'In-browser video transcoding for MP4 and WebM',
      'Audio bitrate reduction and mono downmixing',
      'Instant batch download and ZIP archive bundling',
      'Privacy guaranteed with local device processing',
    ],
  };
}

export function getFaqSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function getHowToSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Compress Files Online for Free',
    description:
      'Step-by-step instructions for reducing file sizes directly in your web browser with FileCompress.',
    step: [
      {
        '@type': 'HowToStep',
        name: 'Select or Drop Files',
        text: 'Drag and drop your images or PDF files into the upload box, or click Browse Files to select them from your device.',
      },
      {
        '@type': 'HowToStep',
        name: 'Adjust Settings or Choose Preset',
        text: 'Pick Balanced, Smaller File, or High Quality, or customize image dimensions and quality percentage.',
      },
      {
        '@type': 'HowToStep',
        name: 'Compress and Download',
        text: 'Click Compress to process the files locally and download your compressed files individually or as a complete ZIP bundle.',
      },
    ],
  };
}

export function getWebSiteSchema() {
  const origin = getSiteOrigin();
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'FileCompress',
    url: origin,
    description:
      'Free, fast, privacy-first online file compression tools for images, PDFs, videos, audio, and ZIP archives.',
  };
}

export function getOrganizationSchema() {
  const origin = getSiteOrigin();
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'FileCompress',
    url: origin,
    logo: `${origin}/images/logo.png`,
  };
}
