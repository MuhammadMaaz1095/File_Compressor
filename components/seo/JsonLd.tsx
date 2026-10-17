import React from 'react';

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

export function getSoftwareAppSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'FileCompress',
    operatingSystem: 'Any (Web Browser)',
    applicationCategory: 'MultimediaApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description:
      'Free, secure, browser-based online file compressor for Images (JPEG, PNG, WebP) and PDF documents with zero server uploads.',
    featureList: [
      'Client-side image compression for JPEG, PNG, and WebP',
      'PDF stream and metadata optimization',
      'Custom quality and resize controls',
      'Instant batch download as ZIP',
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
