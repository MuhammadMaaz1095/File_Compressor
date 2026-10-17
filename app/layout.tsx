import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const viewport: Viewport = {
  themeColor: '#2563eb',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://filecompress.app'
  ),
  title: {
    default: 'FileCompress — Free Online File Compressor (Images & PDF)',
    template: '%s | FileCompress',
  },
  description:
    'Free online file compressor. Reduce file sizes for JPEG, PNG, WebP images and PDF documents directly in your browser with 100% client-side privacy.',
  keywords: [
    'file compressor',
    'online file compressor',
    'compress image',
    'compress pdf',
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
    url: 'https://filecompress.app',
    siteName: 'FileCompress',
    title: 'FileCompress — Free Online File Compressor',
    description:
      'Compress JPEG, PNG, WebP and PDF files instantly in your browser with maximum privacy and zero server uploads.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FileCompress — Free Online File Compressor',
    description:
      'Fast, secure, browser-based file compression for images and PDFs.',
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
