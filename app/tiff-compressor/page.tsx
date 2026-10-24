import React from 'react';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { RelatedTools } from '@/components/content/RelatedTools';
import { TiffWorkspace } from '@/components/compression/TiffWorkspace';
import { AdSlot } from '@/components/ads/AdSlot';
import { JsonLd, getSoftwareAppSchema, getFaqSchema } from '@/components/seo/JsonLd';
import { Layers, ShieldCheck, Zap, FileImage } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Free TIFF Compressor Online – Reduce TIFF File Size | FileCompress',
  description:
    'Compress supported TIFF images online with FileCompress. Explore image compression options and download the processed TIFF when supported.',
  alternates: {
    canonical: 'https://filecompress.app/tiff-compressor',
  },
  openGraph: {
    title: 'Free TIFF Compressor Online – Reduce TIFF File Size | FileCompress',
    description:
      'Compress supported TIFF images online with FileCompress. Explore image compression options and download the processed TIFF when supported.',
    url: 'https://filecompress.app/tiff-compressor',
    type: 'website',
  },
};

const TIFF_FAQS = [
  {
    question: 'How do I compress a TIFF file online?',
    answer:
      'Upload your TIFF or TIF files to FileCompress. Our client-side engine inspects the Image File Directories (IFDs), decodes single and multi-page rasters, applies lossless Deflate (ZIP level 9) stream compression, and outputs a smaller valid TIFF container.',
  },
  {
    question: 'Are multi-page TIFF files preserved during compression?',
    answer:
      'Yes. Our TIFF processor iterates across every individual page directory, maintains page sequence, downscales if requested, and re-encodes all pages into a unified multi-page TIFF file.',
  },
  {
    question: 'Is TIFF compression lossless?',
    answer:
      'When using Deflate compression without dimension scaling, TIFF compression is 100% mathematically lossless. The original pixel data, color channels, and bit depth remain identical.',
  },
  {
    question: 'Why are TIFF files typically so huge?',
    answer:
      'TIFF (Tagged Image File Format) files produced by scanners, DSLR cameras, and medical imaging devices often store raw, uncompressed 24-bit or 32-bit bitmap rasters without compression. Applying modern Deflate stream compression often cuts file size by 60% to 85%.',
  },
  {
    question: 'Are my confidential scans uploaded to a server?',
    answer:
      'No. All TIFF parsing, decoding, and Deflate packaging executes strictly within your web browser on your own computer. No files or images leave your machine.',
  },
];

export default function TiffCompressorPage() {
  return (
    <>
      <JsonLd data={getSoftwareAppSchema()} />
      <JsonLd data={getFaqSchema(TIFF_FAQS)} />
      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full pb-16">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'TIFF Compressor', href: '/tiff-compressor' },
          ]}
        />

        {/* Hero Header */}
        <header className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-4">
            <Layers className="w-3.5 h-3.5" />
            <span>Multi-Page &amp; Archive TIFF Optimizer</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Free Online TIFF Compressor – <span className="text-blue-600">Reduce TIFF File Size</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Compress single and multi-page TIFF scans directly in your browser. Apply lossless Deflate compression or scale oversized resolutions with complete privacy.
          </p>
        </header>

        {/* Workspace */}
        <div className="mb-16">
          <TiffWorkspace />
        </div>

        <div className="max-w-5xl mx-auto mb-16">
          <AdSlot format="horizontal" />
        </div>

        {/* Editorial SEO Content */}
        <article className="prose prose-slate max-w-4xl mx-auto space-y-12 text-slate-700">
          <section className="glass-panel p-8 sm:p-10 rounded-3xl space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Compress TIFF Images Online
            </h2>
            <p className="leading-relaxed">
              Tagged Image File Format (TIFF) is the standard format for high-resolution document scanning, professional publishing, desktop publishing, and medical records. Because baseline TIFF files are commonly stored with uncompressed raw rasters (compression tag 1), individual scans frequently consume 20 MB to 100 MB each, making email distribution and cloud backups challenging.
            </p>
            <p className="leading-relaxed">
              FileCompress TIFF Compressor solves this by analyzing the internal IFD tags of your `.tiff` and `.tif` files directly in your web browser. By applying standardized Deflate stream compression (Adobe ZIP level 9), file weights are reduced dramatically while maintaining pristine pixel fidelity.
            </p>
          </section>

          <section className="glass-panel p-8 sm:p-10 rounded-3xl space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              How TIFF Compression Works
            </h2>
            <p className="leading-relaxed">
              A TIFF file is organized into sequential Image File Directories (IFDs) referencing pixel strips. In uncompressed TIFFs, every single pixel allocates full 24-bit or 32-bit uncompressed bytes. When FileCompress processes a TIFF:
            </p>
            <ol className="list-decimal pl-6 space-y-2 text-slate-700 font-medium">
              <li>
                <strong>Container Verification:</strong> The engine verifies binary headers (Little Endian <code>II</code> or Big Endian <code>MM</code> with magic integer 42).
              </li>
              <li>
                <strong>Multi-Page Parsing:</strong> Every IFD directory is parsed to determine dimensions, color spaces, and sample bit depths.
              </li>
              <li>
                <strong>Deflate Encoding:</strong> Each page strip is compressed using high-compression Deflate algorithms, and the TIFF compression tag is configured to 8 (Adobe ZIP).
              </li>
              <li>
                <strong>Strip Offset Assembly:</strong> Output directories are re-linked with precise byte offsets to produce a universally compatible TIFF container.
              </li>
            </ol>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-3">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Lossless vs Lossy TIFF Compression
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                By default, our Deflate compressor operates in pure lossless mode. No pixel data is discarded, ensuring medical scans, legal contracts, and historical documents retain exact archival fidelity. Downscaling dimensions (75% or 50%) is available as an optional setting when dealing with 600 DPI scans that exceed upload limits.
              </p>
            </div>

            <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-3">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Reduce Large TIFF Image Size
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Office photocopiers and desktop scanners often default to raw color mode without internal compression. Packaging raw strips into Deflate containers reduces typical 50 MB files down to 6 MB to 10 MB, cutting storage footprint by up to 80%.
              </p>
            </div>
          </div>

          <section className="glass-panel p-8 sm:p-10 rounded-3xl space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              How to Handle Multi-Page TIFF Files
            </h2>
            <p className="leading-relaxed">
              Unlike consumer image formats like JPEG or PNG that can only hold a single image, TIFF supports multi-page collections inside a single file. Multi-page legal filings, multi-sheet blueprints, and fax records require preserving every page in its original sequence.
            </p>
            <p className="leading-relaxed">
              FileCompress inspects the linked list of IFDs and processes each page individually. The output retains the exact page order, individual page dimensions, and alpha transparency channels.
            </p>
          </section>

          <section className="glass-panel p-8 sm:p-10 rounded-3xl space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Why Is My TIFF File Still Large?
            </h2>
            <p className="leading-relaxed">
              If a TIFF file does not exhibit significant file size reduction, check for the following scenarios:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600 text-sm">
              <li>
                <strong>Already Compressed with LZW or JPEG:</strong> If the original scanner already applied LZW or embedded JPEG compression, re-compressing with Deflate will not yield additional savings.
              </li>
              <li>
                <strong>Ultra-High DPI Resolution:</strong> A 1200 DPI scan of an architectural diagram contains hundreds of millions of pixels. Selecting our 75% or 50% dimension scaling will drastically reduce size.
              </li>
              <li>
                <strong>Large Number of Pages:</strong> A 50-page document scanned at 300 DPI will naturally require significant space even when compressed.
              </li>
            </ul>
          </section>

          {/* FAQs */}
          <section className="glass-panel p-8 sm:p-10 rounded-3xl space-y-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <div className="divide-y divide-slate-200/80">
              {TIFF_FAQS.map((faq, idx) => (
                <div key={idx} className="py-4 first:pt-0 last:pb-0">
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </article>

        {/* Related Tools */}
        <section className="mt-16">
          <RelatedTools
            currentPath="/tiff-compressor"
            title="Related Media Optimization Tools"
            description="Explore our complete suite of browser-native image, vector, document, and media compression utilities."
          />
        </section>
      </main>
    </>
  );
}
