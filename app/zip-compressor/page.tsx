import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { RelatedTools } from '@/components/content/RelatedTools';
import { ZipWorkspace } from '@/components/compression/ZipWorkspace';
import {
  Archive,
  Layers,
  Zap,
  ShieldCheck,
  FileCheck,
  HelpCircle,
  FolderArchive,
  Sliders,
  CheckCircle2,
  AlertCircle,
  FileText,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'ZIP Compressor Online – Create ZIP Files Free | FileCompress',
  description:
    'Combine multiple files into a ZIP archive online with FileCompress. Choose a supported compression level, download your archive, and check its actual file size.',
  alternates: {
    canonical: 'https://filecompress.com/zip-compressor/',
  },
  openGraph: {
    title: 'ZIP Compressor Online – Create ZIP Files Free | FileCompress',
    description:
      'Combine multiple files into a ZIP archive online with FileCompress. Choose a supported compression level, download your archive, and check its actual file size.',
    url: 'https://filecompress.com/zip-compressor/',
    type: 'website',
  },
};

const FAQ_ITEMS = [
  {
    q: 'What is a ZIP compressor?',
    a: 'A ZIP compressor is a utility that bundles one or more files into a single standardized .zip archive. Depending on the compression level chosen, it applies the DEFLATE algorithm to identify repeated patterns in file data and reduce overall storage space.',
  },
  {
    q: 'How do I combine multiple files into one ZIP file?',
    a: 'Simply drag and drop multiple files into the upload zone above or click to browse your device. Once all desired files appear in the queue, select your preferred compression level, customize the archive filename if desired, and click "Create ZIP Archive".',
  },
  {
    q: 'Does creating a ZIP file always reduce file size?',
    a: 'No. The amount of compression depends heavily on the input formats. Plain text, source code, uncompressed documents, and CSV files compress significantly (often 60% to 80%). However, files that are already compressed—such as JPEG pictures, MP4 videos, MP3 audio, and modern PDFs—will experience virtually no size reduction.',
  },
  {
    q: 'Why is my ZIP file larger than the original files?',
    a: 'Every ZIP archive includes file headers, central directory records, and checksum metadata to organize the bundled files. When you bundle files that are already tightly compressed (like JPEGs or MP4s), the compression algorithm cannot shrink them further, but the archive metadata adds a small amount of overhead, resulting in a slightly larger output.',
  },
  {
    q: 'Which compression level should I choose?',
    a: 'Use "Store" (No compression) if you are packaging already-compressed media files like photos and videos and want the fastest possible bundling without wasting CPU time. Use "Balanced" (Level 6) for everyday archiving of mixed files and documents. Use "Maximum" (Level 9) when archiving large batches of text, log files, or uncompressed spreadsheets where squeezing every byte matters.',
  },
  {
    q: 'Can I ZIP images, videos, PDFs, and audio files together?',
    a: 'Yes. You can bundle any combination of formats into a single ZIP archive. FileCompress automatically detects each file type, handles character encoding safely, and organizes them cleanly inside the archive root.',
  },
  {
    q: 'Are my files uploaded to a server?',
    a: 'No. FileCompress generates ZIP archives 100% locally in your browser memory using JavaScript. Your files never leave your device, ensuring maximum privacy and compliance with data protection policies.',
  },
  {
    q: 'Can I create ZIP files on a mobile phone?',
    a: 'Yes. FileCompress is fully responsive and supports mobile browsers on iOS and Android. You can select multiple documents or photos from your mobile file manager and download the generated .zip archive directly to your device.',
  },
  {
    q: 'Does creating a ZIP archive change the original files?',
    a: 'No. Creating a ZIP archive creates a new compressed package containing copies of your files. Your original files on your computer or phone remain completely untouched and unmodified.',
  },
  {
    q: 'What happens if two files have the same name?',
    a: 'FileCompress automatically resolves duplicate filenames to prevent collisions. If you upload two files named "document.pdf", the second file will automatically be named "document (2).pdf" inside the archive, ensuring neither file overwrites the other.',
  },
];

export default function ZipCompressorPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'ZIP Compressor Online – Create ZIP Files Free',
    description:
      'Combine multiple files into a ZIP archive online with FileCompress. Choose a supported compression level, download your archive, and check its actual file size.',
    url: 'https://filecompress.com/zip-compressor/',
    inLanguage: 'en-US',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full pb-16">
        {/* Breadcrumb Navigation */}
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'ZIP Compressor', href: '/zip-compressor/' },
          ]}
        />

        {/* Hero Header */}
        <header className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200/80 text-amber-800 text-xs font-semibold uppercase tracking-wider mb-4 shadow-2xs">
            <FolderArchive className="w-4 h-4 text-amber-600" />
            <span>Archive &amp; Bundle Utility</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
            ZIP Compressor – Combine Files into a ZIP Archive
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Package multiple documents, images, and media files into a single, standard ZIP archive. Select your desired compression level, verify real file-size savings, and download instantly without cloud uploads.
          </p>
        </header>

        {/* Interactive ZIP Workspace */}
        <div className="mb-16">
          <ZipWorkspace />
        </div>

        {/* How It Works Section */}
        <section className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-2xl font-bold text-slate-900">How to Create and Compress a ZIP Archive</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Four simple steps to package and compress your files right in your web browser.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="glass-card-3d p-6">
              <div className="w-10 h-10 rounded-xl bg-blue-100/90 text-blue-700 font-bold flex items-center justify-center mb-4 shadow-2xs">
                1
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1.5">Add Your Files</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Drop multiple files or select them using the file picker. Images, PDFs, videos, and documents can be combined together.
              </p>
            </div>

            <div className="glass-card-3d p-6">
              <div className="w-10 h-10 rounded-xl bg-indigo-100/90 text-indigo-700 font-bold flex items-center justify-center mb-4 shadow-2xs">
                2
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1.5">Choose Settings</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Select your preferred compression level (Store, Fast, Balanced, or Maximum) and provide a custom output filename.
              </p>
            </div>

            <div className="glass-card-3d p-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-100/90 text-emerald-700 font-bold flex items-center justify-center mb-4 shadow-2xs">
                3
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1.5">Build Archive</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Click &ldquo;Create ZIP Archive&rdquo; to process all files in client-side memory with real-time progress indicators.
              </p>
            </div>

            <div className="glass-card-3d p-6">
              <div className="w-10 h-10 rounded-xl bg-amber-100/90 text-amber-700 font-bold flex items-center justify-center mb-4 shadow-2xs">
                4
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1.5">Check &amp; Download</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Review the actual resulting archive size and savings statistics, then download your ready-to-share .zip file.
              </p>
            </div>
          </div>
        </section>

        {/* Educational Content: Understanding ZIP Archiving */}
        <section className="glass-panel-elevated rounded-3xl p-6 sm:p-10 mb-16 space-y-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 tracking-tight">
              Understanding ZIP Archiving vs. File Compression
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
              While people frequently use the term &ldquo;zipping&rdquo; interchangeably with &ldquo;compressing,&rdquo; a ZIP tool actually performs two distinct functions: <strong>archiving</strong> and <strong>data compression</strong>.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              <strong>Archiving</strong> is the process of bundling multiple individual files and folders into a single portable container. This makes sharing dozens of files via email, messaging apps, or cloud storage dramatically easier. <strong>Compression</strong> is the mathematical process of encoding the data inside those files using fewer bytes, typically via the DEFLATE algorithm.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="glass-card-3d p-6 space-y-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Files That Compress Well in ZIP
              </h3>
              <ul className="text-xs text-slate-600 space-y-1.5 pt-1">
                <li>&bull; <strong>Text &amp; Documents:</strong> TXT, CSV, JSON, XML, HTML, and source code files often reduce by 60% to 85%.</li>
                <li>&bull; <strong>Raw Media:</strong> Uncompressed BMP images, WAV audio, and raw data dumps compress heavily.</li>
                <li>&bull; <strong>Legacy Office Files:</strong> Uncompressed DOC, XLS, and PPT files from older office suites.</li>
              </ul>
            </div>

            <div className="glass-card-3d p-6 space-y-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                Files That Will Barely Shrink in ZIP
              </h3>
              <ul className="text-xs text-slate-600 space-y-1.5 pt-1">
                <li>&bull; <strong>Modern Photos:</strong> JPEG, PNG, and WebP images are already compressed using specialized image codecs.</li>
                <li>&bull; <strong>Video &amp; Audio:</strong> MP4, WebM, MP3, and AAC files already use high-efficiency lossy compression.</li>
                <li>&bull; <strong>Modern Documents:</strong> DOCX, XLSX, and PDF files already use internal deflate streams.</li>
              </ul>
            </div>
          </div>

          {/* Compression Levels Explanation */}
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-600" />
              Which Compression Level Should You Choose?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-white/70 border border-blue-100/80 shadow-2xs">
                <span className="font-bold text-slate-900 block mb-1">Store (No compression)</span>
                <p className="text-slate-600 leading-relaxed">
                  Fastest option. Simply packs files into a container with zero compression math. Perfect for photos and videos.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/70 border border-blue-100/80 shadow-2xs">
                <span className="font-bold text-slate-900 block mb-1">Fast (Level 1)</span>
                <p className="text-slate-600 leading-relaxed">
                  Applies fast DEFLATE encoding. Good balance when bundling hundreds of mixed files quickly.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/70 border border-blue-100/80 shadow-2xs">
                <span className="font-bold text-slate-900 block mb-1">Balanced (Level 6)</span>
                <p className="text-slate-600 leading-relaxed">
                  The recommended industry default. Delivers high compression ratios without excessive CPU consumption.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/70 border border-blue-100/80 shadow-2xs">
                <span className="font-bold text-slate-900 block mb-1">Maximum (Level 9)</span>
                <p className="text-slate-600 leading-relaxed">
                  Uses the deepest search window for maximum byte reduction. Best for large archives of text and code.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Answers to Common Questions</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FAQ_ITEMS.map((item, idx) => (
              <div
                key={idx}
                className="glass-card-3d p-6 space-y-2"
              >
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">{item.q}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related Compression Tools */}
        <RelatedTools
          currentPath="/zip-compressor"
          title="Related Compression Utilities"
          description="Need format-specific lossy optimization? Try our specialized image, PDF, video, and audio tools."
        />
      </main>
    </>
  );
}
