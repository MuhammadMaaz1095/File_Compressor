import React from 'react';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { RelatedTools } from '@/components/content/RelatedTools';
import { WordWorkspace } from '@/components/compression/WordWorkspace';
import { AdSlot } from '@/components/ads/AdSlot';
import { JsonLd, getSoftwareAppSchema, getFaqSchema } from '@/components/seo/JsonLd';
import { FileText, ShieldCheck, Zap, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Free Word Document Compressor – Reduce DOCX Size | FileCompress',
  description:
    'Reduce Word document file size with FileCompress. Explore supported DOCX optimisation, embedded image reduction, and practical ways to make documents smaller.',
  alternates: {
    canonical: 'https://filecompress.app/word-compressor',
  },
  openGraph: {
    title: 'Free Word Document Compressor – Reduce DOCX Size | FileCompress',
    description:
      'Reduce Word document file size with FileCompress. Explore supported DOCX optimisation, embedded image reduction, and practical ways to make documents smaller.',
    url: 'https://filecompress.app/word-compressor',
    type: 'website',
  },
};

const WORD_FAQS = [
  {
    question: 'How do I compress a Word document online?',
    answer:
      'Drop your modern Microsoft Word document (.docx) into the FileCompress Word workspace. Our engine inspects the OpenXML container, optimizes high-resolution embedded pictures in word/media/, and recompresses all internal XML parts with maximum Deflate level 9.',
  },
  {
    question: 'Will compressing my DOCX document change my text, tables, or formatting?',
    answer:
      'No. The document structure, paragraph and character formatting, styles, tables, headers, footers, hyperlinks, footnotes, and tracked changes are preserved byte-for-byte. Only oversized embedded images are optimized.',
  },
  {
    question: 'Are legacy .doc binary files supported?',
    answer:
      'Legacy Word 97-2003 binary (.doc) files are not supported because modifying binary OLE streams carries a high risk of corruption. You can easily save your file as modern Word Document (.docx) in Microsoft Word, LibreOffice, or Google Docs to compress it safely.',
  },
  {
    question: 'Why are Word documents often so large?',
    answer:
      'In over 90% of cases, bloated Word documents are caused by large uncompressed camera photographs, smartphone screenshots, and high-DPI scans pasted into the document. Word stores original full-resolution images inside the file package even if they appear small on the page.',
  },
  {
    question: 'Is my document private and secure?',
    answer:
      'Yes. FileCompress operates 100% locally in your web browser. Your document is never uploaded to an external server or cloud service, protecting confidential business contracts, academic research, and personal files.',
  },
];

export default function WordCompressorPage() {
  return (
    <>
      <JsonLd data={getSoftwareAppSchema()} />
      <JsonLd data={getFaqSchema(WORD_FAQS)} />
      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full pb-16">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Word Compressor', href: '/word-compressor' },
          ]}
        />

        {/* Hero Header */}
        <header className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4">
            <FileText className="w-3.5 h-3.5" />
            <span>Document-Aware OpenXML Optimizer</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Free Online Word Compressor – <span className="text-blue-600">Reduce DOCX File Size</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Reduce Microsoft Word document sizes without losing formatting or content. Optimize high-resolution embedded pictures and repack DOCX archives directly in your browser.
          </p>
        </header>

        {/* Workspace */}
        <div className="mb-16">
          <WordWorkspace />
        </div>

        <div className="max-w-5xl mx-auto mb-16">
          <AdSlot format="horizontal" />
        </div>

        {/* Editorial SEO Content */}
        <article className="prose prose-slate max-w-4xl mx-auto space-y-12 text-slate-700">
          <section className="glass-panel p-8 sm:p-10 rounded-3xl space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Reduce Word Document Size
            </h2>
            <p className="leading-relaxed">
              Microsoft Word documents (.docx) are widely used for reports, resumes, legal briefs, manuscripts, and corporate proposals. However, when high-resolution photographs, chart screenshots, and graphic assets are inserted into pages, a document can balloon from a few kilobytes to 50 MB or more, exceeding email attachment limits on Gmail and Outlook.
            </p>
            <p className="leading-relaxed">
              FileCompress Word Compressor provides an intelligent, client-side document optimization engine designed specifically for modern DOCX OpenXML packages. By identifying and compressing oversized embedded media while applying maximum Deflate stream compression, documents shrink by up to 75% without compromising typography or design integrity.
            </p>
          </section>

          <section className="glass-panel p-8 sm:p-10 rounded-3xl space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              How Word Document Compression Works
            </h2>
            <p className="leading-relaxed">
              A modern `.docx` file is technically a ZIP-compressed OpenXML package containing XML text markup, style definitions, and an internal <code>word/media/</code> repository for graphics. Generic ZIP compressors cannot inspect what is inside the document package. Our tool works from the inside out:
            </p>
            <ol className="list-decimal pl-6 space-y-2 text-slate-700 font-medium">
              <li>
                <strong>Package Inspection:</strong> The compressor opens the ZIP package in browser memory and scans <code>word/media/</code> for large JPEG, PNG, and TIFF images.
              </li>
              <li>
                <strong>Smart Media Optimization:</strong> Embedded images with multi-megapixel dimensions are scaled to screen-ready dimensions (e.g. max 1920px) and recompressed with balanced JPEG/PNG encoding.
              </li>
              <li>
                <strong>Structural XML Preservation:</strong> Text elements in <code>word/document.xml</code>, headers, footers, relationships (<code>_rels</code>), and custom themes are preserved bit-for-bit.
              </li>
              <li>
                <strong>Deflate Level 9 Repacking:</strong> The entire archive is regenerated with maximum Deflate compression to minimize container overhead.
              </li>
            </ol>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-3">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Reduce Image Size Inside Word Documents
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                When you drag a 12-megapixel smartphone photo into Word, the application stores the full 8 MB uncompressed image file in the internal media folder even if the image is displayed as a small 2-inch thumbnail. Our compressor identifies these oversized images and recompresses them to match display requirements.
              </p>
            </div>

            <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-3">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Optimise Large DOCX Files
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Large DOCX files slow down opening times, consume excessive RAM in word processors, and trigger upload failures on job application portals and academic submission systems. Compressing your DOCX file ensures fast loading and seamless sharing.
              </p>
            </div>
          </div>

          <section className="glass-panel p-8 sm:p-10 rounded-3xl space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Can You Compress Word Documents Without Losing Content?
            </h2>
            <p className="leading-relaxed">
              Yes. Unlike destructive tools that convert Word documents into flattened PDFs or static images, FileCompress maintains your genuine `.docx` format. When you open the optimized document in Microsoft Word, Google Docs, Apple Pages, or LibreOffice, your text remains fully editable, comments and tracked changes remain accessible, and formatting is 100% intact.
            </p>
          </section>

          <section className="glass-panel p-8 sm:p-10 rounded-3xl space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Why Is My Word File Still Large?
            </h2>
            <p className="leading-relaxed">
              If your Word document does not shrink substantially after compression, consider these factors:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600 text-sm">
              <li>
                <strong>No Embedded Media:</strong> A text-only Word document is already heavily compressed by standard ZIP archiving. If there are no images in <code>word/media/</code>, file reduction will typically be under 5%.
              </li>
              <li>
                <strong>Embedded Fonts:</strong> Documents configured to &quot;Embed fonts in the file&quot; can contain several megabytes of TrueType or OpenType font binaries. You can disable font embedding in Word Options &rarr; Save.
              </li>
              <li>
                <strong>Embedded OLE Objects:</strong> Embedded Excel worksheets or PowerPoint slide decks store secondary binary packages that require manual removal or optimization.
              </li>
            </ul>
          </section>

          {/* FAQs */}
          <section className="glass-panel p-8 sm:p-10 rounded-3xl space-y-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <div className="divide-y divide-slate-200/80">
              {WORD_FAQS.map((faq, idx) => (
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
            currentPath="/word-compressor"
            title="Related Media Optimization Tools"
            description="Explore our specialized compression utilities for PDF documents, spreadsheets, presentations, and images."
          />
        </section>
      </main>
    </>
  );
}
