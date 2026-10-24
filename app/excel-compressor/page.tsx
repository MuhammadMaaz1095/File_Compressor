import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { RelatedTools } from '@/components/content/RelatedTools';
import { ExcelWorkspace } from '@/components/compression/ExcelWorkspace';
import { AdSlot } from '@/components/ads/AdSlot';
import { JsonLd, getSoftwareAppSchema, getFaqSchema } from '@/components/seo/JsonLd';
import {
  HelpCircle,
  Sliders,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  FileSpreadsheet,
  Table,
  Zap,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Free Excel File Compressor – Reduce XLSX Size | FileCompress',
  description:
    'Reduce Excel workbook file size with FileCompress. Learn how to optimise large XLSX files and download processed workbooks when supported.',
  alternates: {
    canonical: 'https://filecompress.app/excel-compressor',
  },
  openGraph: {
    title: 'Free Excel File Compressor – Reduce XLSX Size | FileCompress',
    description:
      'Reduce Excel workbook file size with FileCompress. Learn how to optimise large XLSX files and download processed workbooks when supported.',
    url: 'https://filecompress.app/excel-compressor',
    type: 'website',
  },
};

const EXCEL_FAQS = [
  {
    question: 'How do I compress an Excel file online?',
    answer:
      'Upload your .xlsx workbook to FileCompress using the dropzone above, select your desired image optimization preset, click Compress XLSX, and download your optimized workbook once processing finishes.',
  },
  {
    question: 'Can you compress an Excel file without losing formulas or data?',
    answer:
      'Yes, absolutely. FileCompress uses document-aware OpenXML optimization that specifically targets embedded high-resolution imagery in xl/media/ and applies maximum Deflate stream compression. Cell values, formulas, sheet relationships, styles, and pivot tables are preserved with 100% bit-for-bit integrity.',
  },
  {
    question: 'Why is my Excel file so large?',
    answer:
      'The vast majority of oversized Excel spreadsheets (over 10 MB) are inflated by high-resolution embedded images, company logos, full-page screenshots pasted into sheets, or orphaned formatted cells extending far beyond active data ranges.',
  },
  {
    question: 'Does FileCompress support old .xls or macro-enabled .xlsm files?',
    answer:
      'FileCompress supports modern standard Excel Workbooks (.xlsx). Legacy binary formats (.xls) from Excel 97-2003 and macro-enabled workbooks (.xlsm) are not processed to guarantee that macros and legacy binary structures are never compromised.',
  },
  {
    question: 'How do I reduce the size of images inside Excel workbooks?',
    answer:
      'When users paste uncompressed smartphone photos or 4K screen captures into Excel, the raw PNG or JPEG files are stored inside the xl/media/ directory. FileCompress scans this folder, downscales oversized dimensions, recompresses imagery, and repacks the workbook without altering cell bindings.',
  },
  {
    question: 'Is it safe to compress confidential financial spreadsheets on FileCompress?',
    answer:
      'Yes, 100% safe. All workbook unpacking, media recompression, and archive generation occurs locally within your web browser using JavaScript and WebAssembly. Your financial data, company numbers, and proprietary worksheets are never uploaded to any remote server.',
  },
  {
    question: 'Why did my Excel file size barely change after compression?',
    answer:
      'If your workbook consists exclusively of raw numerical rows and text with no embedded images, it is already compressed using ZIP Deflate by Microsoft Excel. Without embedded media, standard XML text data has little remaining headroom for compression.',
  },
  {
    question: 'Can I open the compressed file in Microsoft Excel and Google Sheets?',
    answer:
      'Yes. The processed file strictly conforms to the ECMA-376 OpenXML standard, ensuring full compatibility with Microsoft Excel (desktop, web, mobile), Google Sheets, LibreOffice Calc, and Apple Numbers.',
  },
];

export default function ExcelCompressorPage() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Document Compressor', href: '/how-to-compress-files' },
    { label: 'Excel Compressor', href: '/excel-compressor' },
  ];

  const appSchema = getSoftwareAppSchema();
  const faqSchema = getFaqSchema(EXCEL_FAQS);

  return (
    <div className="min-h-screen py-8 sm:py-12 bg-pattern">
      <JsonLd data={appSchema} />
      <JsonLd data={faqSchema} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <Breadcrumbs items={breadcrumbItems} />

        {/* Hero Section */}
        <section className="text-center space-y-4 max-w-3xl mx-auto pt-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold shadow-xs">
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Document-Aware OpenXML Engine</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Free Online Excel Compressor – Reduce Excel File Size
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Optimize large Microsoft Excel (.xlsx) workbooks online without risking data loss.
            Recompress embedded sheet media, optimize package streams, and preserve 100% of formulas
            and cell values with private in-browser processing.
          </p>
        </section>

        {/* Interactive Workspace */}
        <section aria-label="Excel Compression Tool">
          <ExcelWorkspace />
        </section>

        {/* Ad Placement */}
        <AdSlot slotId="excel-compressor-mid" format="horizontal" />

        {/* Comprehensive SEO Content Section */}
        <article className="glass-panel-elevated p-8 sm:p-12 rounded-3xl space-y-12 text-slate-700 leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              How to Reduce Excel Workbook Size
            </h2>
            <p>
              Oversized Excel spreadsheets can cause severe headaches in professional workflows: they
              crash email attachments, take several minutes to open on laptops, trigger &quot;Out of
              Memory&quot; errors in Microsoft 365, and slow down financial reporting.
            </p>
            <p>
              Reducing an Excel workbook safely requires understanding its internal structure. An
              <code>.xlsx</code> file is not a single binary blob; it is an Open Packaging Conventions
              (OPC) ZIP archive containing XML sheets, shared strings, and embedded media assets.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="p-5 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
                  1
                </div>
                <h3 className="font-bold text-slate-900 text-base">Select Your XLSX</h3>
                <p className="text-xs text-slate-600">
                  Upload your workbook. FileCompress inspects the internal package schema and verifies
                  worksheet structure and media folders.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
                  2
                </div>
                <h3 className="font-bold text-slate-900 text-base">Optimize Embedded Media</h3>
                <p className="text-xs text-slate-600">
                  High-resolution photos, screenshots, and logos stored in <code>xl/media/</code> are
                  quantized and downscaled while keeping layout references intact.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
                  3
                </div>
                <h3 className="font-bold text-slate-900 text-base">Repack & Download</h3>
                <p className="text-xs text-slate-600">
                  The archive is repacked with maximum Deflate level 9 stream compression and verified
                  for valid spreadsheet schema before download.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              How Excel File Compression Works
            </h2>
            <p>
              Many generic online file compressors treat an Excel workbook as a raw ZIP archive, simply
              unzipping and re-zipping files. This often yields disappointing results—or worse, corrupts
              relationship IDs (<code>rId</code>) in drawing XML files, causing Excel to display the dreaded
              warning: <em>&quot;We found a problem with some content in workbook.xlsx. Do you want us to try to recover as much as we can?&quot;</em>
            </p>
            <p>
              FileCompress uses <strong>document-aware optimization</strong>. We respect the ECMA-376
              standard:
            </p>
            <ul className="space-y-2 list-disc list-inside text-sm">
              <li>
                <strong>Preserving Relationship Maps:</strong> All drawing relationships
                (<code>xl/drawings/_rels/drawing1.xml.rels</code>) remain synchronized with exact filenames.
              </li>
              <li>
                <strong>Formula Protection:</strong> Formula computation trees (<code>&lt;f&gt;</code>) and
                cached calculation results (<code>&lt;v&gt;</code>) in worksheet XML are untouched.
              </li>
              <li>
                <strong>Maximal Deflate Level 9:</strong> Standard Excel exports use moderate Deflate
                levels for speed. Our optimizer reapplies level 9 Deflate compression across internal streams.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Reduce the Size of Images Inside Excel Workbooks
            </h2>
            <p>
              In practical business use cases, 90% of workbooks larger than 15 MB contain high-resolution
              imagery. When users take a screenshot on a Retina display or insert product photography,
              Excel embeds the raw uncompressed 4K image directly into the workbook package.
            </p>
            <p>
              FileCompress automatically scans the internal <code>xl/media/</code> catalog. If oversized
              JPEGs or 24-bit PNGs are detected, our browser engine re-quantizes the image data and
              downscales excessive pixel resolutions, often transforming a 40 MB spreadsheet into an agile
              4 MB file.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              How to Optimise a Large XLSX File
            </h2>
            <p>
              To complement our online compression tool, consider these native best practices when working
              with Microsoft Excel:
            </p>
            <ul className="space-y-2 list-disc list-inside text-sm">
              <li>
                <strong>Clear Blank Formatted Rows:</strong> If someone formatted an entire column down to
                row 1,048,576, Excel creates XML nodes for millions of empty cells. Press{' '}
                <code>Ctrl + End</code> to check your active cell range, and delete unused rows.
              </li>
              <li>
                <strong>Save as Binary Workbook (.xlsb):</strong> For massive data tables with hundreds of
                thousands of numeric rows, Excel&apos;s proprietary binary format (<code>.xlsb</code>) can cut
                size in half and speed up calculation.
              </li>
              <li>
                <strong>Compress Pictures inside Excel:</strong> Use Excel&apos;s built-in{' '}
                <em>Picture Format &gt; Compress Pictures</em> menu to discard cropped image areas.
              </li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Why Is My Excel File Still Large?
            </h2>
            <p>
              If an Excel workbook did not shrink substantially, it is usually because the workbook
              contains pure numerical data and text with no embedded media. Since text and numbers in
              <code>.xlsx</code> are already compressed with ZIP Deflate when saved, raw tabular data cannot
              be compressed further without deleting rows or converting to binary formats.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Can You Compress Excel Without Losing Data?
            </h2>
            <p>
              Yes. Our optimizer guarantees zero data loss:
            </p>
            <ul className="space-y-2 list-disc list-inside text-sm">
              <li>Every cell number, text string, and timestamp remains exact.</li>
              <li>Every mathematical formula (<code>SUM</code>, <code>INDEX/MATCH</code>, <code>XLOOKUP</code>) is preserved.</li>
              <li>Worksheet tab names, color coding, and sheet ordering are completely preserved.</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Safe Handling of Excel Workbooks
            </h2>
            <p>
              Corporate spreadsheets often contain confidential payroll numbers, sales figures, and
              customer records.
            </p>
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-950 text-sm space-y-2">
              <div className="flex items-center gap-2 font-bold text-emerald-900">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
                <span>100% In-Browser Privacy & Zero Server Uploads</span>
              </div>
              <p>
                FileCompress operates strictly inside your browser. No spreadsheet files, formulas,
                or company records are ever sent across the network or stored in external databases.
              </p>
            </div>
          </section>

          {/* FAQs Section */}
          <section className="space-y-6 pt-4 border-t border-slate-200/80">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-emerald-600" />
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-4">
              {EXCEL_FAQS.map((faq, index) => (
                <details
                  key={index}
                  className="group rounded-2xl border border-slate-200 bg-white/70 p-5 transition-all open:bg-white open:shadow-xs"
                >
                  <summary className="flex cursor-pointer items-center justify-between font-bold text-slate-900 text-sm sm:text-base">
                    <span>{faq.question}</span>
                    <span className="ml-4 text-emerald-600 transition-transform group-open:rotate-180">
                      ↓
                    </span>
                  </summary>
                  <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>
        </article>

        {/* Related Compression Tools */}
        <RelatedTools currentPath="/excel-compressor" />
      </div>
    </div>
  );
}
