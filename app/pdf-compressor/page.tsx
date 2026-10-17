import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  FileText,
  ShieldCheck,
  Zap,
  HelpCircle,
  ArrowRight,
  Check,
  Lock,
} from 'lucide-react';
import { ToolWorkspace } from '@/components/compression/ToolWorkspace';
import { AdSlot } from '@/components/ads/AdSlot';
import { JsonLd, getSoftwareAppSchema, getFaqSchema } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'PDF Compressor — Compress & Optimize PDF Files Online for Free',
  description:
    'Free online PDF compressor. Reduce PDF file sizes for email attachments and web publishing without losing text crispness. 100% private, on-device processing.',
  alternates: {
    canonical: 'https://filecompress.app/pdf-compressor',
  },
  openGraph: {
    title: 'PDF Compressor — Reduce PDF File Size Online',
    description:
      'Compress PDF documents quickly and securely directly in your browser. Zero server uploads guarantee 100% document privacy.',
    url: 'https://filecompress.app/pdf-compressor',
  },
};

const PDF_FAQS = [
  {
    question: 'How does FileCompress compress PDF documents without uploading them?',
    answer:
      'FileCompress executes WebAssembly and JavaScript PDF engine logic (pdf-lib) directly inside your web browser. It parses the document cross-reference table, packs loose objects into compressed Flate streams, and removes redundant metadata. Your document never leaves your machine.',
  },
  {
    question: 'Will text or vector graphics become blurry after compression?',
    answer:
      'No. Text content, font subsets, and vector drawings are compressed losslessly using Flate/Deflate algorithms. They remain perfectly sharp and readable at any zoom level or in print.',
  },
  {
    question: 'Is there a limit on how many PDF pages or files I can compress?',
    answer:
      'You can compress multiple PDFs at once. Each individual document can be up to 50MB, which accommodates the vast majority of standard office and educational PDF files.',
  },
  {
    question: 'Can I compress password-protected PDF files?',
    answer:
      'Files that require an opening password must have password security removed prior to processing, as the compression engine cannot modify encrypted streams without authorization.',
  },
];

export default function PdfCompressorPage() {
  return (
    <>
      <JsonLd data={getSoftwareAppSchema()} />
      <JsonLd data={getFaqSchema(PDF_FAQS)} />

      <main className="flex-1 pb-16">
        {/* Header Hero */}
        <section className="relative pt-10 pb-12 sm:pt-14 sm:pb-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Breadcrumb */}
            <nav className="flex justify-center items-center gap-2 text-xs text-slate-500 mb-6" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-blue-600">Home</Link>
              <span>/</span>
              <span className="text-slate-800 font-semibold">PDF Compressor</span>
            </nav>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold mb-4">
              <FileText className="w-3.5 h-3.5" />
              <span>PDF Document Optimizer</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight max-w-3xl mx-auto">
              Free Online <span className="text-rose-600">PDF Compressor</span>
            </h1>

            <p className="mt-3 sm:mt-4 text-base text-slate-600 max-w-xl mx-auto">
              Reduce PDF file sizes for email sharing and web uploads while preserving crystal-clear typography and document structure.
            </p>

            <div className="mt-8 text-left">
              <ToolWorkspace category="pdf" />
            </div>
          </div>
        </section>

        {/* Ad Placeholder */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AdSlot format="horizontal" />
        </div>

        {/* Explanation Section */}
        <section className="py-12 bg-white/70 border-y border-slate-200/70">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 text-center mb-8">
              Why PDFs Get Bloated &amp; How FileCompress Fixes It
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-card-3d p-6">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 shadow-2xs">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2 tracking-tight">
                  Object Stream Packing
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Older PDF versions store each font, dictionary, and text block as separate uncompressed objects. We consolidate these objects into compact, compressed streams.
                </p>
              </div>

              <div className="glass-card-3d p-6">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4 shadow-2xs">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2 tracking-tight">
                  Metadata Stripping
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Hidden printer calibration data, software creator tags, and XML metadata bloat PDFs. Removing them saves space while protecting sensitive document metadata.
                </p>
              </div>

              <div className="glass-card-3d p-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 shadow-2xs">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2 tracking-tight">
                  100% Confidential
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Contracts, financial statements, and medical forms should never be sent to third-party cloud servers. Our browser sandbox keeps your data strictly private.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-8 tracking-tight">
            PDF Compression FAQs
          </h2>
          <div className="space-y-4">
            {PDF_FAQS.map((faq, idx) => (
              <div key={idx} className="glass-card-3d p-6 space-y-2">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-2 tracking-tight">
                  <HelpCircle className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{faq.question}</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed pl-6">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/how-to-compress-files#pdf-compression"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              <span>Read our Guide on Optimizing PDFs for Email Attachments</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
