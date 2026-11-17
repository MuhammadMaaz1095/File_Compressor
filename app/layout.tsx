import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { getSiteOrigin } from '@/lib/seo/site-config';

// CSS variables for system & web font stacks (robust across offline, sandboxed, and CI builds)
const geistSans = { variable: 'font-sans' };
const geistMono = { variable: 'font-mono' };

export const viewport: Viewport = {
  themeColor: '#2563eb',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(getSiteOrigin()),
  title: {
    default: 'FileCompress – Free Online File Compression Tools',
    template: '%s | FileCompress',
  },
  description:
    'Free online file compressor. Reduce file sizes for JPEG, PNG, WebP images, PDF documents, videos, audio, and ZIP archives directly in your browser with 100% client-side privacy.',
  keywords: [
    'file compressor',
    'online file compressor',
    'compress image',
    'compress pdf',
    'compress video',
    'compress audio',
    'compress zip',
    'reduce file size',
    'jpg compressor',
    'png compressor',
    'webp compressor',
  ],
  authors: [{ name: 'FileCompress' }],
  creator: 'FileCompress',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: getSiteOrigin(),
    siteName: 'FileCompress',
    title: 'FileCompress – Free Online File Compression Tools',
    description:
      'Compress images, PDFs, videos, audio, and ZIP archives instantly in your browser with maximum privacy and zero server uploads.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FileCompress – Free Online File Compression Tools',
    description:
      'Fast, secure, browser-based file compression for images, PDFs, videos, and audio.',
  },
  icons: {
    icon: '/images/logo.png',
    apple: '/images/logo.png',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-blue-100 selection:text-blue-900">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
