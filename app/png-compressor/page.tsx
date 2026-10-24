import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { RelatedTools } from '@/components/content/RelatedTools';
import { PngWorkspace } from '@/components/compression/PngWorkspace';
import { AdSlot } from '@/components/ads/AdSlot';
import { JsonLd, getSoftwareAppSchema, getFaqSchema } from '@/components/seo/JsonLd';
import {
  HelpCircle,
  Sliders,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Layers,
  Sparkles,
  Image as ImageIcon,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Free PNG Compressor Online – Reduce PNG Size | FileCompress',
  description:
    'Compress PNG images online for free. Reduce PNG file size, optimise transparent images, and download smaller PNG files with FileCompress.',
  alternates: {
    canonical: 'https://filecompress.app/png-compressor',
  },
  openGraph: {
    title: 'Free PNG Compressor Online – Reduce PNG Size | FileCompress',
    description:
      'Compress PNG images online for free. Reduce PNG file size, optimise transparent images, and download smaller PNG files with FileCompress.',
    url: 'https://filecompress.app/png-compressor',
    type: 'website',
  },
};

const PNG_FAQS = [
  {
    question: 'How do I compress a PNG online?',
    answer:
      'Upload your PNG to FileCompress, choose between Palette Quantization (PNG-8) for maximum byte savings or Lossless Optimization (PNG-32) for bit-for-bit fidelity, review the processed result, and download your smaller file.',
  },
  {
    question: 'How can I reduce PNG file size?',
    answer:
      'You can reduce PNG file size by quantizing 24-bit/32-bit colors down to an indexed palette of 256, 128, or 64 colors with an alpha transparency table (saving 50% to 75%), stripping unnecessary metadata chunks, or scaling down excessive image dimensions.',
  },
  {
    question: 'Does PNG compression preserve transparency?',
    answer:
      'Yes! FileCompress explicitly constructs PNG alpha transparency tables (tRNS chunks for PNG-8 and 32-bit RGBA channels for PNG-32), guaranteeing that transparent logos, icons, and UI elements maintain crisp, see-through backgrounds without unwanted white or black halos.',
  },
  {
    question: 'What is the difference between lossless and lossy PNG compression?',
    answer:
      'Lossless PNG optimization preserves every pixel exactly while stripping metadata chunks (tEXt, iTXt) and applying optimal Deflate filtering. Lossy PNG quantization (PNG-8) clusters similar colors into an indexed 256-color palette, delivering substantially greater byte savings with minimal visible difference for graphics, logos, and screenshots.',
  },
  {
    question: 'Why is my PNG still large?',
    answer:
      'Complex photographic images contain thousands of subtle gradients and noise patterns that do not compress well with PNG Deflate algorithms. For photographs without transparency, converting to WebP or JPEG achieves much smaller files. For graphics, selecting PNG-8 palette quantization provides the best reduction.',
  },
  {
    question: 'Can I compress a PNG without changing its dimensions?',
    answer:
      'Yes. Keep Dimension Scaling set to 100% (Original Dimensions). FileCompress will optimize the internal Deflate scanline encoding and color palette while preserving exact pixel dimensions.',
  },
  {
    question: 'Is the PNG Compressor free?',
    answer:
      'Yes. FileCompress is completely free to use with no hidden fees, watermarks, or account registration required.',
  },
  {
    question: 'Are PNG files uploaded to a server?',
    answer:
      'No. FileCompress processes PNG images 100% locally on your computer or mobile device using client-side JavaScript memory and Web Streams. Your private images and screenshots never leave your browser.',
  },
];

export default function PngCompressorPage() {
  return (
    <>
      <JsonLd data={getSoftwareAppSchema()} />
      <JsonLd data={getFaqSchema(PNG_FAQS)} />

      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full pb-16">
        {/* Breadcrumb Navigation */}
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'PNG Compressor', href: '/png-compressor' },
          ]}
        />

        {/* Hero Header */}
        <header className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-800 text-xs font-semibold uppercase tracking-wider mb-4 shadow-2xs">
            <ImageIcon className="w-4 h-4 text-blue-600" />
            <span>Alpha Transparency Optimizer</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
            Free Online <span className="text-blue-600">PNG Compressor</span> – Reduce PNG Image Size
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            FileCompress helps you optimise PNG images for websites, documents, presentations, and
            sharing. Upload a PNG, select the supported optimisation settings, compare the original
            and processed image sizes, and download the result. Lossless optimisation preserves image
            data, while optional lossy colour reduction may reduce size further with a visual
            trade-off.
          </p>
        </header>

        {/* Interactive PNG Workspace */}
        <div className="mb-16">
          <PngWorkspace />
        </div>

        {/* Ad Placeholder */}
        <div className="max-w-5xl mx-auto mb-16">
          <AdSlot format="horizontal" />
        </div>

        {/* Features Grid */}
        <section className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Engineered for PNG Transparency &amp; Crisp Graphics
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Choose between pixel-perfect lossless Deflate or high-reduction PNG-8 palette quantization.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="glass-card-3d p-6">
              <div className="w-10 h-10 rounded-xl bg-blue-100/90 text-blue-700 font-bold flex items-center justify-center mb-4 shadow-2xs">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1.5">Alpha Preserved</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Retains transparent backgrounds via dedicated tRNS alpha tables without introducing
                dirty matte backgrounds.
              </p>
            </div>

            <div className="glass-card-3d p-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-100/90 text-emerald-700 font-bold flex items-center justify-center mb-4 shadow-2xs">
                <Sliders className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1.5">PNG-8 Quantization</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Smart 256, 128, or 64 indexed color clustering cuts image payload by 50% to 75% for
                logos, icons, and UI screenshots.
              </p>
            </div>

            <div className="glass-card-3d p-6">
              <div className="w-10 h-10 rounded-xl bg-purple-100/90 text-purple-700 font-bold flex items-center justify-center mb-4 shadow-2xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1.5">Lossless Stream Clean</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Strips redundant ancillary chunks and optimizes Deflate scanlines with zero visual
                alteration.
              </p>
            </div>

            <div className="glass-card-3d p-6">
              <div className="w-10 h-10 rounded-xl bg-indigo-100/90 text-indigo-700 font-bold flex items-center justify-center mb-4 shadow-2xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1.5">100% In-Browser Privacy</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                No uploads to remote servers. All image decoding, quantizing, and re-encoding executes
                locally in browser memory.
              </p>
            </div>
          </div>
        </section>

        {/* Structured SEO Article with Exact H2s Requested */}
        <article className="max-w-5xl mx-auto py-8 space-y-4 text-slate-700 leading-relaxed">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Compress PNG Images Online for Free
          </h2>
          <p className="text-sm text-slate-600">
            Portable Network Graphics (PNG) is the standard image format for graphics, user
            interfaces, screenshots, transparent logos, and illustrations on the web. Unlike JPEG,
            PNG supports 8-bit alpha channel transparency, enabling smooth anti-aliased edges over
            any background color. However, because PNG files use lossless compression, they can be
            substantially larger than lossy formats, slowing down page loads and consuming excess
            bandwidth.
          </p>
          <p className="text-sm text-slate-600">
            FileCompress provides a fast, free, and secure online PNG compressor that lets you choose
            the ideal balance between byte reduction and visual fidelity.
          </p>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight pt-4">
            How to Compress a PNG Image
          </h2>
          <ol className="list-decimal pl-6 space-y-1.5 text-sm text-slate-600">
            <li>
              <strong>Select or Drop Your PNG:</strong> Add your PNG file to the upload area above.
            </li>
            <li>
              <strong>Choose Compression Mode:</strong> Select &ldquo;Palette Quantization
              (PNG-8)&rdquo; for dramatic byte savings (recommended for graphics and screenshots) or
              &ldquo;Lossless Optimization&rdquo; to preserve 100% of original pixel data.
            </li>
            <li>
              <strong>Configure Settings:</strong> Adjust maximum palette colors (256, 128, 64) and
              optional dimension scaling.
            </li>
            <li>
              <strong>Click Compress:</strong> Processing executes in milliseconds inside your
              browser memory.
            </li>
            <li>
              <strong>Review and Download:</strong> Inspect the resulting file size, byte savings, and
              download your optimized PNG image.
            </li>
          </ol>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight pt-4">
            Reduce PNG File Size While Preserving Transparency
          </h2>
          <p className="text-sm text-slate-600">
            Many basic image compression tools damage transparent PNGs by converting alpha pixels
            into an opaque white or black background. FileCompress handles transparency natively:
          </p>
          <p className="text-sm text-slate-600">
            When using Palette Quantization (PNG-8), our engine preserves transparent pixels by
            generating an indexed transparency chunk (<code>tRNS</code>) mapped directly to your
            palette. When using Lossless mode, all 32-bit RGBA channels are preserved exactly as
            authored.
          </p>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight pt-4">
            Lossless PNG Optimisation vs Lossy Compression
          </h2>
          <p className="text-sm text-slate-600">
            Understanding the distinction between lossless and lossy PNG optimization helps you
            choose the right setting:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-sm text-slate-600">
            <li>
              <strong>Lossless PNG Optimization:</strong> Strips non-essential metadata (such as
              camera EXIF data, color profiles, and software markers) and applies advanced Deflate
              filtering. The visual pixels remain bit-for-bit identical to the original image.
              Typical savings range from 5% to 20%.
            </li>
            <li>
              <strong>Lossy Palette Quantization (PNG-8):</strong> Reduces a 24-bit or 32-bit image
              down to an indexed 256-color palette. For vector art, logos, text screenshots, and UI
              assets, the human eye cannot discern the difference, yet the file size shrinks by 50% to
              75%.
            </li>
          </ul>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight pt-4">
            How to Make PNG Images Smaller for Websites
          </h2>
          <p className="text-sm text-slate-600">
            For website performance and Core Web Vitals (Largest Contentful Paint), large PNG images
            can create noticeable render delays. To achieve optimal website speeds:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-sm text-slate-600">
            <li>Quantize transparent logos and website badges to PNG-8 with 128 colors.</li>
            <li>Scale high-DPI screenshots down to actual display dimensions before publishing.</li>
            <li>
              For continuous-tone photographs without transparent areas, consider using our{' '}
              <Link href="/image-compressor" className="text-blue-600 font-semibold hover:underline">
                Image Compressor
              </Link>{' '}
              to convert them to modern WebP or optimized JPEG.
            </li>
          </ul>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight pt-4">
            Can You Resize a PNG Before Compressing It?
          </h2>
          <p className="text-sm text-slate-600">
            Yes! In the settings panel above, use Dimension Scaling (100%, 85%, 75%, 50%) to downscale
            oversized images. Because pixel volume decreases with the square of the dimensions,
            scaling width and height to 50% eliminates 75% of the raw data, allowing you to compress
            massive 5MB+ camera captures or retina screenshots into compact, web-ready graphics.
          </p>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight pt-4">
            Why Is My PNG File Still Large?
          </h2>
          <p className="text-sm text-slate-600">
            If your output file does not become much smaller, several factors may explain the result:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-sm text-slate-600">
            <li>
              <strong>The Image Is Already Optimized:</strong> If the file was previously processed
              by tools like optipng or pngquant, additional lossless passes cannot squeeze out more
              redundancy.
            </li>
            <li>
              <strong>Photographic Content with Noise:</strong> Photographs containing grain, grass,
              water, or skin textures contain few repeating patterns, making Deflate less effective.
              Converting to WebP is recommended for photographic content.
            </li>
            <li>
              <strong>Selected Lossless Mode on Truecolor Images:</strong> Lossless mode cannot reduce
              a 32-bit truecolor image by 60% without color quantization. Switch to &ldquo;Palette
              Quantization (PNG-8)&rdquo; for significant reduction.
            </li>
          </ul>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight pt-4">
            Does PNG Compression Reduce Image Quality?
          </h2>
          <p className="text-sm text-slate-600">
            Under <strong>Lossless Optimization</strong>, image quality is 100% preserved with zero
            data loss. Under <strong>Palette Quantization</strong>, subtle color clustering occurs;
            for images with fewer than 256 unique colors (such as diagrams, logos, and UI
            recordings), the result is visually indistinguishable from the original.
          </p>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight pt-4">
            Is It Safe to Compress PNG Images Online?
          </h2>
          <p className="text-sm text-slate-600">
            FileCompress executes all PNG parsing, quantization, and Deflate stream creation entirely
            within your local web browser memory. Your confidential financial spreadsheets, product
            mockups, and personal photos are never transmitted over the internet to remote servers.
          </p>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight pt-4">
            Frequently Asked Questions
          </h2>
        </article>

        {/* FAQs */}
        <section className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Common Questions</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Frequently Asked Questions About PNG Compression
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PNG_FAQS.map((item, idx) => (
              <div key={idx} className="glass-card-3d p-6 space-y-2">
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">{item.question}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related Compression Tools */}
        <RelatedTools
          currentPath="/png-compressor"
          title="Related Image &amp; Media Tools"
          description="Looking to compress other file types? Try our specialized image, GIF, video, and audio tools."
        />
      </main>
    </>
  );
}
