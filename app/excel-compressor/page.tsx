import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { RelatedTools } from '@/components/content/RelatedTools';
import { ExcelWorkspace } from '@/components/compression/ExcelWorkspace';
import { AdSlot } from '@/components/ads/AdSlot';
import {
  JsonLd,
  getSoftwareAppSchema,
  getFaqSchema,
} from '@/components/seo/JsonLd';
import {
  HelpCircle,
  FileSpreadsheet,
  ShieldCheck,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Scale,
  HardDrive,
  Share2,
  Mail,
  FileText,
  Table,
  Sliders,
  Info,
  Maximize2,
  Lock,
  Sparkles,
  ArrowRight,
  Archive,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Free Online Excel Compressor – Reduce XLSX File Size',
  description:
    'Compress supported Excel files online with FileCompress. Compare file sizes and check formulas, formatting, charts, and workbook compatibility.',
  keywords: [
    'compress excel file',
    'excel compressor',
    'reduce excel file size',
    'how to compress excel file',
    'compress xlsx file',
    'free online excel compressor',
    'compress excel online',
    'make excel file smaller',
    'reduce xlsx size',
    'compress large excel file',
    'shrink excel file',
    'excel file size reducer',
  ],
  alternates: {
    canonical: '/excel-compressor',
  },
  openGraph: {
    title: 'Free Online Excel Compressor – Reduce XLSX File Size | FileCompress',
    description:
      'Compress supported Excel files online with FileCompress. Compare file sizes and check formulas, formatting, charts, and workbook compatibility.',
    url: '/excel-compressor',
    type: 'website',
  },
};

const EXCEL_FAQS = [
  {
    question: 'What is a free online Excel compressor?',
    answer:
      'A free online Excel compressor is a browser-based tool designed to help reduce the size of supported Excel files. Its actual capabilities depend on its implementation, supported formats, and the content of the workbook, such as recompressing embedded high-resolution graphics and applying high-ratio Deflate stream compression to the internal OpenXML package.',
  },
  {
    question: 'How do I compress an Excel file?',
    answer:
      'Select a supported workbook (.xlsx) in the Excel Compressor, choose your preferred optimization settings, and download the result when processing finishes. Compare the original and output sizes, then open the output to verify formulas, formatting, charts, and other important features.',
  },
  {
    question: 'How can I reduce Excel file size without deleting data?',
    answer:
      'Start by investigating whether the workbook contains oversized images in xl/media/, redundant cell formatting extending far beyond used ranges, or inefficient stream packaging. Recompressing embedded graphics and repacking package streams with level 9 Deflate reduces file size without deleting a single row, formula, or cell value.',
  },
  {
    question: 'Can I compress an XLSX file online?',
    answer:
      'Yes. FileCompress explicitly supports modern standard Excel Workbooks (.xlsx). All parsing, media recompression, and packaging execute directly in your browser with zero remote uploads.',
  },
  {
    question: 'Can I compress XLS and XLSM files?',
    answer:
      'FileCompress is specifically optimized for modern standard .xlsx workbooks. Legacy binary files (.xls) from Excel 97-2003 and macro-enabled workbooks (.xlsm) use different internal structures and are not processed to guarantee that macros and binary layouts are never corrupted.',
  },
  {
    question: 'Will compressing an Excel file remove formulas?',
    answer:
      'No. FileCompress uses document-aware OpenXML optimization. Worksheet XML files containing formula calculation trees (<f>) and cached values (<v>) are preserved bit-for-bit. We only optimize embedded media files and repack the archive using maximum Deflate compression.',
  },
  {
    question: 'Will compression affect charts and images?',
    answer:
      'Charts and vector drawing relationships are preserved exactly as authored. For embedded bitmap images (such as screenshots or photos), our optimizer downscales excessive resolutions and reapplies efficient JPEG/PNG compression. Inspect any critical visual dashboards after compression to ensure clarity.',
  },
  {
    question: 'Can I compress an Excel file for email?',
    answer:
      'Yes. Compressing high-resolution embedded imagery can frequently shrink a 30 MB workbook down to under 5 MB, allowing it to easily fit standard 20 MB or 25 MB email attachment limits. Always confirm that the final output opens cleanly before sending.',
  },
  {
    question: 'Why did my Excel file not get smaller?',
    answer:
      'The workbook may already be efficiently compressed, contain mostly essential numerical data with no embedded images, or contain dense text that Excel has already packed with ZIP Deflate. If a workbook has no embedded media, repacking will yield minimal or modest savings.',
  },
  {
    question: 'Is an online Excel compressor safe for confidential spreadsheets?',
    answer:
      'With FileCompress, yes. All workbook reading, image recompression, and archive generation run 100% locally in your client-side browser memory. Your financial models, customer lists, and proprietary company numbers are never uploaded to any remote server.',
  },
  {
    question: 'Does compressing an Excel file change its format?',
    answer:
      'No. The output remains a fully compliant ECMA-376 OpenXML (.xlsx) workbook. It opens seamlessly in Microsoft Excel (desktop, mobile, and web), Google Sheets, LibreOffice Calc, and Apple Numbers.',
  },
  {
    question: 'Can every Excel file be compressed?',
    answer:
      'No. Compression results depend on the workbook\'s structure and contents. Workbooks with raw pasted photos compress dramatically, while workbooks composed purely of formulas and numbers may see little change or occasionally slight packaging variation.',
  },
];

export default function ExcelCompressorPage() {
  return (
    <>
      <JsonLd
        data={getSoftwareAppSchema({
          name: 'FileCompress Free Online Excel Compressor',
          urlPath: '/excel-compressor',
          description:
            'Free online Excel compressor. Reduce XLSX workbook file sizes by optimizing embedded media and package streams with 100% client-side privacy.',
        })}
      />
      <JsonLd data={getFaqSchema(EXCEL_FAQS)} />

      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full pb-16">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Excel Compressor', href: '/excel-compressor' },
          ]}
        />

        {/* Hero Section */}
        <header className="text-center max-w-4xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-4 shadow-2xs">
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Document-Aware OpenXML Optimizer</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Free Online Excel Compressor –{' '}
            <span className="text-blue-600">Reduce XLSX File Size</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto">
            Excel spreadsheets can become surprisingly large as you add data, formulas, images, charts, and formatting. Optimize your XLSX workbooks online without risking data loss. Recompress embedded sheet media, optimize package streams, and preserve 100% of formulas and cell values with private in-browser processing.
          </p>
        </header>

        {/* Interactive Workspace */}
        <div className="mb-16">
          <ExcelWorkspace />
        </div>

        {/* Ad Placeholder */}
        <div className="max-w-5xl mx-auto mb-16">
          <AdSlot format="horizontal" />
        </div>

        {/* Editorial SEO Content Section */}
        <article className="prose prose-slate max-w-4xl mx-auto space-y-12 text-slate-700">

          {/* Section: Overview & Purpose */}
          <section className="glass-panel p-8 sm:p-10 rounded-3xl space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Compress Excel Files Online
            </h2>
            <p className="leading-relaxed">
              A free online Excel compressor is useful when you need a practical way to reduce spreadsheet size without adding another program to your computer. It can be particularly helpful when you regularly exchange workbooks, manage financial reports, or work with spreadsheets containing substantial amounts of embedded imagery and data.
            </p>
            <p className="leading-relaxed">
              Use the <strong>FileCompress Excel Compressor</strong> to begin the compression process. Select your file, choose the desired optimization parameters, and download the result when processing is complete.
            </p>
            <p className="leading-relaxed">
              Before using any online Excel compression tool, check the file formats it supports and understand how it processes uploaded files. Spreadsheet compatibility matters because an Excel workbook may contain far more than ordinary cell values: it can include formulas, charts, pivot tables, external connections, images, and formatting rules that must remain completely usable.
            </p>

            <div className="pt-2">
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Why Use an Excel File Compressor?
              </h3>
              <p className="leading-relaxed text-sm text-slate-600 mb-3">
                An Excel compressor helps you investigate whether a workbook can be reduced in size without manually rebuilding the spreadsheet from scratch. Common reasons to compress Excel files include:
              </p>
              <ul className="list-disc pl-6 space-y-1.5 text-slate-700 font-medium text-sm">
                <li><strong>Email attachments:</strong> Reduce workbook size to fit standard 20 MB or 25 MB email limits.</li>
                <li><strong>Online portals:</strong> Prepare spreadsheets for corporate portals or document management systems with upload ceilings.</li>
                <li><strong>File sharing:</strong> Make large monthly reports faster to distribute to team members or external clients.</li>
                <li><strong>Storage management:</strong> Reclaim valuable cloud drive and local disk space across archive folders.</li>
                <li><strong>Oversized workbooks:</strong> Optimize files that have ballooned due to embedded 4K screenshots, logos, or uncompressed photos.</li>
                <li><strong>Workflow efficiency:</strong> Reduce spreadsheet load and save times across shared network folders.</li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-xs sm:text-sm text-emerald-950 mt-4 space-y-1">
              <strong>Can You Compress Excel Files for Free?</strong> Yes. FileCompress provides completely free browser-based XLSX compression with zero signups or watermarks. For sensitive financial records, customer lists, and business forecasts, our engine executes 100% client-side so your numbers never leave your device.
            </div>
          </section>

          {/* Section: How to Compress an Excel File (5 Steps) */}
          <section className="glass-panel p-8 sm:p-10 rounded-3xl space-y-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              How to Compress an Excel File
            </h2>
            <p className="leading-relaxed">
              Follow this step-by-step workflow to safely compress your spreadsheet while preserving all essential workbook features.
            </p>

            <div className="space-y-6 pt-2">
              <div className="border-l-4 border-emerald-500 pl-4 py-1">
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Step 1: Choose Your Excel File
                </h3>
                <p className="leading-relaxed text-slate-600 text-sm">
                  Open the Excel Compressor page and select or drop your <code>.xlsx</code> workbook. Confirm that the tool explicitly supports your file type before proceeding. Always keep an untouched backup copy of your original workbook as a reliable fallback.
                </p>
              </div>

              <div className="border-l-4 border-blue-500 pl-4 py-1">
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Step 2: Start the Compression Process
                </h3>
                <p className="leading-relaxed text-slate-600 text-sm">
                  Review the available optimization settings. FileCompress allows you to choose target image quality presets (such as Balanced or High Compression) for pictures embedded in <code>xl/media/</code>. Click Compress XLSX to begin processing.
                </p>
              </div>

              <div className="border-l-4 border-indigo-500 pl-4 py-1">
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Step 3: Wait for Processing to Finish
                </h3>
                <p className="leading-relaxed text-slate-600 text-sm">
                  Allow the tool to complete processing. Large workbooks with dozens of sheets, complex charts, or embedded photos require brief processing time while the browser unzips, recompresses media, and repacks the package streams.
                </p>
              </div>

              <div className="border-l-4 border-purple-500 pl-4 py-1">
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Step 4: Download the Result
                </h3>
                <p className="leading-relaxed text-slate-600 text-sm">
                  Download the compressed output once ready. FileCompress calculates the exact byte savings and percentage reduction truthfully. If the output is the same size, compression may not have been effective because the workbook contained no compressible media.
                </p>
              </div>

              <div className="border-l-4 border-amber-500 pl-4 py-1">
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Step 5: Open and Check the Workbook
                </h3>
                <p className="leading-relaxed text-slate-600 text-sm">
                  Open the resulting file in Microsoft Excel, Google Sheets, or LibreOffice Calc. Check cell values, formulas, worksheet order, number formats, charts, images, and pivot tables to confirm everything works as expected before replacing your original.
                </p>
              </div>
            </div>
          </section>

          {/* Section: How Does Excel File Compression Work */}
          <section className="glass-panel p-8 sm:p-10 rounded-3xl space-y-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              How Does Excel File Compression Work?
            </h2>
            <p className="leading-relaxed">
              Understanding how Excel files are stored explains why some workbooks compress dramatically while others barely change. An <code>.xlsx</code> workbook is based on the Office Open XML (ECMA-376) standard. Technically, an XLSX file is an Open Packaging Conventions (OPC) package containing multiple XML files, drawings, styles, and resources compressed with ZIP.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Archive className="w-4 h-4 text-emerald-600" />
                  <span>1. Repacking the Workbook</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Excel exports use moderate Deflate compression for saving speed. A dedicated compressor can re-encode internal XML streams using maximum Deflate level 9. While helpful, repacking alone yields limited savings if the XML is already well-compressed.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>2. Optimising Embedded Images</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Spreadsheets often contain pasted screenshots, company logos, product photos, or diagram graphics in <code>xl/media/</code>. Re-quantizing and downscaling 4K photos often cuts workbook weight by 70% to 90% without touching cell data.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-purple-600" />
                  <span>3. Cleaning Unnecessary Package Content</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Redundant editor cache entries and temporary metadata can bloat packages. Careful cleanup preserves core relationship maps (<code>.rels</code>) and drawing identifiers (<code>rId</code>) so Excel never shows content recovery warnings.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Table className="w-4 h-4 text-amber-600" />
                  <span>4. Changing Workbook Content</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Deleting unused rows, resetting bloated used ranges, or trimming pivot caches can also reduce size. However, these are manual authoring edits rather than lossless compression and require careful verification.
                </p>
              </div>
            </div>
          </section>

          {/* Section: How to Reduce Excel File Size (Practical Manual Tips) */}
          <section className="glass-panel p-8 sm:p-10 rounded-3xl space-y-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              How to Reduce Excel File Size: Practical Techniques
            </h2>
            <p className="leading-relaxed">
              If your workbook remains large after online compression, examine what internal elements are inflating its size:
            </p>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs space-y-1.5">
                <h3 className="text-sm font-bold text-slate-900">Remove or Compress Unnecessary Images</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  High-resolution pictures are often the single largest component of an Excel file. In Microsoft Excel, select an image and use <em>Picture Format &gt; Compress Pictures</em> to discard cropped areas and set target DPI.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs space-y-1.5">
                <h3 className="text-sm font-bold text-slate-900">Clear Excessive Cell Formatting</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Applying background fills or borders to entire columns down to row 1,048,576 forces Excel to generate XML nodes for millions of empty cells. Press <code>Ctrl + End</code> to check your active range, select truly empty rows, and clear all formatting.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs space-y-1.5">
                <h3 className="text-sm font-bold text-slate-900">Review Unused Rows and Columns</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Worksheets often retain a used range that extends far beyond your active table after pasting or deleting data. Delete empty rows and columns beyond your dataset, then save and reopen the workbook to reset the range.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs space-y-1.5">
                <h3 className="text-sm font-bold text-slate-900">Review Pivot Tables and Pivot Caches</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Pivot tables store duplicate cached data in the background. In PivotTable Options, review the <em>Data</em> tab. Unchecking &quot;Save source data with file&quot; can reduce size significantly if you are able to refresh from the source when opening.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs space-y-1.5">
                <h3 className="text-sm font-bold text-slate-900">Save in an Appropriate Workbook Format</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  For enormous datasets with hundreds of thousands of rows, saving as an Excel Binary Workbook (<code>.xlsb</code>) can cut file size in half and accelerate calculations compared to standard XML.
                </p>
              </div>
            </div>
          </section>

          {/* Section: Email and Uploads */}
          <section className="glass-panel p-8 sm:p-10 rounded-3xl space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Compress Excel Files for Email and Uploads
            </h2>
            <p className="leading-relaxed">
              Large spreadsheets create friction when attaching files to emails or uploading to client portals. Email gateways also encode attachments using MIME Base64, which adds roughly 33% overhead to the message size (a 18 MB file can exceed a 20 MB email limit).
            </p>
            <p className="leading-relaxed">
              Before emailing, run your workbook through FileCompress to shrink embedded imagery. If the file remains too large because of necessary raw data rows, consider sharing a view-only link via OneDrive, Google Drive, or SharePoint rather than forcing an oversized attachment.
            </p>
          </section>

          {/* Section: Will Compression Affect Formulas, Formatting, Charts or Pivot Tables */}
          <section className="glass-panel p-8 sm:p-10 rounded-3xl space-y-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Will Compression Affect Formulas, Formatting, Charts or Pivot Tables?
            </h2>
            <p className="leading-relaxed">
              This is the most critical question for financial analysts and corporate users. FileCompress is specifically engineered to preserve spreadsheet functionality:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Formulas and Cell Values</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  All formula definitions (<code>SUM</code>, <code>XLOOKUP</code>, <code>INDEX/MATCH</code>), cached calculation results, and cell data types remain completely untouched.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Formatting &amp; Conditional Rules</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Custom number formats, currency symbols, date styles, borders, and conditional formatting rules in <code>xl/styles.xml</code> are fully preserved.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Charts and Dashboard Graphics</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Drawing relationships and chart definitions in <code>xl/charts/</code> remain linked with exact internal identifiers, ensuring dashboards display accurately.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Pivot Tables &amp; Sheet Tabs</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Worksheet tab ordering, color tags, hidden sheets, and pivot table structures remain fully intact and operational when opened in Excel.
                </p>
              </div>
            </div>
          </section>

          {/* Section: Supported Excel Formats */}
          <section className="glass-panel p-8 sm:p-10 rounded-3xl space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Supported Excel Formats: XLS, XLSX, XLSM and CSV
            </h2>
            <p className="leading-relaxed">
              Spreadsheets use several file formats, each with distinct structural characteristics:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700 font-medium text-sm">
              <li>
                <strong>XLSX Files:</strong> The standard XML-based format for modern Excel. Fully supported by FileCompress for media optimization and Deflate level 9 stream repacking.
              </li>
              <li>
                <strong>XLS Files:</strong> Legacy binary format from Excel 97–2003. Not directly processed because it does not use OpenXML packages. Save as XLSX in Excel before compressing.
              </li>
              <li>
                <strong>XLSM Files:</strong> Macro-enabled workbooks containing VBA code. FileCompress intentionally avoids altering XLSM files to protect automation scripts and digital signatures.
              </li>
              <li>
                <strong>CSV Files:</strong> Plain-text comma-separated files with no formatting, formulas, charts, or images. CSV files can be compressed using a <Link href="/zip-compressor" className="text-blue-600 font-semibold underline hover:text-blue-800">ZIP Compressor</Link>.
              </li>
            </ul>
          </section>

          {/* Section: Privacy and In-Browser Processing */}
          <section className="glass-panel p-8 sm:p-10 rounded-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% In-Browser Privacy Guarantee</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Privacy, File Limits and Confidential Spreadsheets
            </h2>
            <p className="leading-relaxed">
              Corporate workbooks regularly contain sensitive financial metrics, payroll data, customer lists, and proprietary algorithms. Uploading these documents to remote cloud servers can violate corporate data compliance and GDPR rules.
            </p>
            <p className="leading-relaxed">
              FileCompress operates with a strict <strong>zero-server architecture</strong>: all package reading, image recompression, and archive generation occur strictly in your local browser memory using JavaScript and WebAssembly. Your spreadsheet files never travel across the internet.
            </p>
          </section>

          {/* Section: Troubleshooting */}
          <section className="glass-panel p-8 sm:p-10 rounded-3xl space-y-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Troubleshooting Excel Compression
            </h2>
            <p className="leading-relaxed">
              Here is how to resolve common spreadsheet compression issues:
            </p>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs space-y-1.5">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-600" />
                  <span>The compressed file is not smaller</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  If your workbook contains mostly numbers and formulas without embedded media, it is already compressed by Excel. Consider removing redundant formatted empty rows or saving as <code>.xlsb</code>.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs space-y-1.5">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>The output file is slightly larger</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  If media was already heavily compressed and the workbook contained many small XML fragments, ZIP archive headers can occasionally add slight overhead. FileCompress reports this truthfully so you can keep your original file.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs space-y-1.5">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Info className="w-4 h-4 text-purple-600" />
                  <span>The tool does not accept my file</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Ensure your file has a <code>.xlsx</code> extension and is not password-encrypted. Password-protected workbooks use encrypted OLE envelopes that cannot be parsed without the password.
                </p>
              </div>
            </div>
          </section>

          {/* Section: Frequently Asked Questions */}
          <section className="glass-panel p-8 sm:p-10 rounded-3xl space-y-6">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Common Questions
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                Frequently Asked Questions About Excel Compression
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2">
                Clear answers regarding formula preservation, image recompression, privacy, and workbook performance.
              </p>
            </div>

            <div className="space-y-4 pt-4">
              {EXCEL_FAQS.map((faq, idx) => (
                <div key={idx} className="glass-card-3d p-6 space-y-2">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-start gap-2.5 tracking-tight">
                    <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{faq.question}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-6.5">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Explore More Tools */}
          <section className="glass-panel p-8 sm:p-10 rounded-3xl space-y-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Explore More FileCompress Tools
            </h2>
            <p className="leading-relaxed">
              Different file types require dedicated optimization engines. Explore our full suite of document, vector, and media tools:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Link
                href="/word-compressor"
                className="p-3.5 rounded-xl bg-white border border-slate-200/80 hover:border-blue-300 hover:bg-blue-50/50 transition-all text-center shadow-2xs group"
              >
                <div className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-blue-600">Word Compressor</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Optimize DOCX documents</div>
              </Link>

              <Link
                href="/powerpoint-compressor"
                className="p-3.5 rounded-xl bg-white border border-slate-200/80 hover:border-blue-300 hover:bg-blue-50/50 transition-all text-center shadow-2xs group"
              >
                <div className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-blue-600">PowerPoint Compressor</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Shrink PPTX slide decks</div>
              </Link>

              <Link
                href="/pdf-compressor"
                className="p-3.5 rounded-xl bg-white border border-slate-200/80 hover:border-blue-300 hover:bg-blue-50/50 transition-all text-center shadow-2xs group"
              >
                <div className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-blue-600">PDF Compressor</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Shrink PDF files for email</div>
              </Link>

              <Link
                href="/image-compressor"
                className="p-3.5 rounded-xl bg-white border border-slate-200/80 hover:border-blue-300 hover:bg-blue-50/50 transition-all text-center shadow-2xs group"
              >
                <div className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-blue-600">Image Compressor</div>
                <div className="text-[10px] text-slate-500 mt-0.5">JPG, PNG &amp; WebP</div>
              </Link>
            </div>
          </section>

          {/* Section: Concluding Advice */}
          <section className="glass-panel p-8 sm:p-10 rounded-3xl space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Make Your Excel Files Easier to Manage
            </h2>
            <p className="leading-relaxed">
              Reducing Excel file size starts with understanding what makes a workbook large. Embedded images, excessive formatting, pivot caches, and unused worksheet ranges can all contribute, but every workbook is unique.
            </p>
            <p className="leading-relaxed">
              Use the FileCompress Excel Compressor to reduce the size of your XLSX workbooks safely, then compare the result with the original. Check important formulas, formatting, charts, and pivot tables before replacing your master file. A smaller file is useful only when it remains accurate, compatible, and ready for your critical business tasks.
            </p>
          </section>

        </article>

        {/* Related Tools Bottom Grid */}
        <section className="mt-16">
          <RelatedTools
            currentPath="/excel-compressor"
            title="Related Document &amp; Media Optimization Tools"
            description="Explore our complete suite of browser-native spreadsheet, document, presentation, and image compression tools."
          />
        </section>
      </main>
    </>
  );
}
