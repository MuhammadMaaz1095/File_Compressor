import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  BookOpen,
  ArrowRight,
  CheckCircle,
  HelpCircle,
  Clock,
  ShieldCheck,
  FileText,
  Image as ImageIcon,
  Film,
  Music,
  Sliders,
  AlertTriangle,
} from 'lucide-react';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { RelatedTools } from '@/components/content/RelatedTools';
import { AdSlot } from '@/components/ads/AdSlot';
import { JsonLd, getHowToSchema, getFaqSchema } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'How to Compress Files: Images, PDFs, Videos & Audio | FileCompress',
  description:
    'Learn how to compress images, PDFs, videos and audio files, reduce file sizes, choose the right settings and share files more easily with FileCompress.',
  alternates: {
    canonical: 'https://filecompress.app/how-to-compress-files',
  },
  openGraph: {
    title: 'How to Compress Files: Images, PDFs, Videos & Audio | FileCompress',
    description:
      'Learn how to compress images, PDFs, videos and audio files, reduce file sizes, choose the right settings and share files more easily with FileCompress.',
    url: 'https://filecompress.app/how-to-compress-files',
  },
};

const HOWTO_FAQS = [
  {
    question: 'How do I compress a file?',
    answer:
      'To compress a file, choose the appropriate tool for your file type (such as Image, PDF, Video, or Audio Compressor), drag and drop your file into the upload zone, select a compression preset or customize quality settings, click Compress, and download your optimized file once processing completes.',
  },
  {
    question: 'Does compressing a file reduce its quality?',
    answer:
      'It depends on the compression method used. Lossless compression removes redundant internal data and metadata without altering pixels or acoustic samples, preserving 100% of the original quality. Lossy compression discards subtle visual or auditory details imperceptible to human senses, allowing for much greater size reductions with minimal visible quality degradation.',
  },
  {
    question: 'What is the difference between lossy and lossless compression?',
    answer:
      'Lossless compression packs data into mathematical shortcuts so the decompressed file is bit-for-bit identical to the original (best for text, PNG logos, and code). Lossy compression selectively approximates high-frequency image chroma or audio harmonics to achieve 50% to 80% file size reductions.',
  },
  {
    question: 'Can I compress files for free?',
    answer:
      'Yes. FileCompress provides completely free online compression for supported images, documents, videos, and audio files with no registration, no subscriptions, and no watermarks.',
  },
  {
    question: 'Why did my file barely get smaller?',
    answer:
      'Files that are already aggressively compressed (such as low-quality JPEGs, optimized MP3s, or pre-compressed ZIP archives) contain very little redundant data. Re-compressing an already compressed file often yields minimal or zero additional savings, and may occasionally increase file size.',
  },
  {
    question: 'How do I compress a file for email?',
    answer:
      'Most email providers enforce attachment caps between 20 MB and 25 MB. For images, reduce pixel dimensions to under 1920px wide. For PDFs, strip unused metadata and compress object streams. For video, select a 720p or 480p resolution preset or set a target size under 20 MB.',
  },
  {
    question: 'Is it possible to compress a file without changing its format?',
    answer:
      'Yes. You can compress JPEG files while keeping them as JPEGs, PNGs as PNGs, and MP4s as MP4s by adjusting internal quantization tables, bitrates, or resolution without converting container formats.',
  },
  {
    question: 'Is online file compression safe?',
    answer:
      'On FileCompress, yes. All compression operations run locally inside your web browser sandbox using JavaScript and Web APIs. Your files are never uploaded to any remote server or stored in the cloud.',
  },
  {
    question: 'Can I compress files on a mobile phone?',
    answer:
      'Yes. Modern mobile browsers on iOS and Android support HTML5 Canvas and Web Audio APIs, allowing you to compress photos, PDFs, and sound clips directly on your mobile smartphone without installing extra apps.',
  },
  {
    question: 'How do I check the amount of space saved?',
    answer:
      'After processing completes, FileCompress displays the exact original byte count alongside the compressed byte count, the total megabytes saved, and the calculated reduction percentage: ((originalSize - compressedSize) / originalSize) * 100.',
  },
];

export default function HowToCompressFilesPage() {
  const lastUpdated = 'October 17, 2026';

  return (
    <>
      <JsonLd data={getHowToSchema()} />
      <JsonLd data={getFaqSchema(HOWTO_FAQS)} />

      <main className="flex-1 pb-16">
        {/* Page Hero */}
        <header className="pt-10 pb-12 sm:pt-14 sm:pb-14 bg-white/70 border-b border-slate-200/70">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Breadcrumbs items={[{ label: 'How to Compress Files' }]} />

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-4 shadow-2xs">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Comprehensive Optimization Guide</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              How to Compress Files Without Losing More Quality Than Necessary
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              A comprehensive technical guide to reducing file sizes for images, PDF documents, videos, and audio tracks while preserving visual and acoustic fidelity.
            </p>

            <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              <span>Last updated: {lastUpdated}</span>
            </div>
          </div>
        </header>

        {/* Guide Content */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 text-slate-700 text-sm sm:text-base leading-relaxed space-y-12">
          {/* Section A: Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-4">
              A. Introduction to File Compression
            </h2>
            <p className="mb-4">
              Digital files grow larger every year. High-resolution smartphone cameras capture photos exceeding 15 megabytes each, 4K video clips rapidly consume gigabytes of storage, and multi-page scanned PDF documents frequently exceed corporate email attachment thresholds.
            </p>
            <p className="mb-4">
              <strong>File compression</strong> is the process of reducing the physical size of a file (the number of bytes required to represent it) so it consumes less disk space, uploads more quickly, and transfers smoothly over internet connections. It is important to distinguish between <em>compressing</em> a file and simply <em>changing its container format</em>. Converting a file without adjusting its bitrate or resolution may change how software interacts with it, but compression deliberately restructures or simplifies underlying data to shrink its footprint.
            </p>
            <p>
              The degree of compression achievable depends entirely on the source file: its original format, internal complexity, whether it has already undergone compression, and the quality thresholds you specify.
            </p>
          </section>

          {/* Section B: What is file compression? */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-4">
              B. What is File Compression? Lossy vs. Lossless Explained
            </h2>
            <p className="mb-4">
              Every compression algorithm belongs to one of two fundamental philosophies: <strong>lossless</strong> compression or <strong>lossy</strong> compression.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
              <div className="glass-card rounded-2xl p-6 border-l-4 border-l-blue-500">
                <h3 className="text-base font-bold text-slate-900 mb-2">Lossless Compression</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                  Lossless algorithms find repetitive sequences or mathematical patterns in the data and substitute them with shorter markers. When decompressed, the file reconstructs bit-for-bit identical to the original with zero data loss.
                </p>
                <div className="text-xs text-slate-500">
                  <strong>Typical uses:</strong> Text files, code repositories, PNG logos with crisp edges, ZIP archives, medical images, legal contracts.
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6 border-l-4 border-l-indigo-500">
                <h3 className="text-base font-bold text-slate-900 mb-2">Lossy Compression</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                  Lossy algorithms take advantage of psycho-perceptual limits in human vision and hearing. They discard subtle color nuances, high-frequency harmonics, or microscopic texture variations that the human brain does not easily notice.
                </p>
                <div className="text-xs text-slate-500">
                  <strong>Typical uses:</strong> Everyday photography (JPEG/WebP), streaming video (MP4/WebM), podcast audio (MP3/AAC).
                </div>
              </div>
            </div>

            <h3 className="text-lg font-bold text-slate-900 mt-6 mb-2">
              Why do some files shrink dramatically while others barely change?
            </h3>
            <p className="mb-4">
              Uncompressed or raw files (like BMP bitmaps, uncompressed WAV audio, or high-DPI scanned PDFs) contain enormous amounts of repetitive, unoptimized data. Compressing them frequently yields <strong>70% to 90% size reductions</strong>.
            </p>
            <p>
              Conversely, modern media formats like JPEG, MP3, and MP4 are <em>already</em> heavily compressed using lossy algorithms. Attempting to compress an existing 128 kbps MP3 or a web-optimized JPEG will yield very little additional savings—and re-encoding an already compressed file with a high quality setting can sometimes even cause the resulting output to become slightly larger.
            </p>
          </section>

          {/* Ad Slot */}
          <AdSlot format="horizontal" />

          {/* Section C: Workflow */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-4">
              C. How to Compress Files Online: Standard 7-Step Workflow
            </h2>
            <p className="mb-6">
              When using FileCompress, follow this reliable workflow for any supported document or media file:
            </p>

            <ol className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">1</span>
                <div>
                  <strong>Choose the appropriate tool:</strong> Navigate to the dedicated tool matched to your file type (such as the Image Compressor, PDF Compressor, Video Compressor, or Audio Compressor) or use the Universal File Compressor on our homepage.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">2</span>
                <div>
                  <strong>Select or drop your file:</strong> Drag your file directly into the upload area or click &ldquo;Browse Files&rdquo; to pick it from your local storage.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">3</span>
                <div>
                  <strong>Review compression settings:</strong> Select a preset (Balanced, Smaller File, or High Quality) or open Custom Options to fine-tune quality percentages, resolutions, or bitrates.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">4</span>
                <div>
                  <strong>Start compression:</strong> Click the &ldquo;Compress&rdquo; button. The browser-side engine initializes the appropriate codec.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">5</span>
                <div>
                  <strong>Monitor progress:</strong> Observe the real-time progress bar. Processing times vary from fractions of a second for images to a few seconds for video clips.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">6</span>
                <div>
                  <strong>Compare original and compressed sizes:</strong> Review the exact before-and-after byte counts and actual percentage reduction reported by the engine.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">7</span>
                <div>
                  <strong>Inspect and download:</strong> Use the comparison preview or audio player to verify quality before clicking &ldquo;Download&rdquo;.
                </div>
              </li>
            </ol>
          </section>

          {/* Section D: How to compress different file types */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-6">
              D. How to Compress Different File Types
            </h2>

            {/* Images */}
            <div className="glass-card rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-2 mb-3 text-blue-600 font-bold">
                <ImageIcon className="w-5 h-5" />
                <h3 className="text-lg text-slate-900">1. Image Compression (JPEG, PNG, WebP)</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                Images represent over half of typical web page weights. The primary levers for reducing image size are <strong>quality quantization</strong>, <strong>pixel dimensions</strong>, and <strong>file format</strong>.
              </p>
              <ul className="text-xs sm:text-sm text-slate-600 space-y-2 mb-4">
                <li>&bull; <strong>JPEG / JPG:</strong> Best for real-world photos. Reducing quality from 100% to 75% typically slashes file size by 65% with virtually zero perceptible artifacting.</li>
                <li>&bull; <strong>PNG:</strong> Essential for graphics requiring transparent backgrounds. PNG files are lossless, making them heavier. Converting PNGs to modern WebP often achieves 70%+ savings.</li>
                <li>&bull; <strong>WebP:</strong> Google&apos;s modern web format offering 25% to 34% smaller file sizes than comparable JPEGs at equivalent SSIM quality index.</li>
                <li>&bull; <strong>Dimension Resizing:</strong> A 4000&times;3000 photo contains 12 million pixels. Resizing it down to 1920&times;1440 reduces pixel count by over 75% before compression even begins.</li>
              </ul>
              <Link
                href="/image-compressor"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800"
              >
                <span>Open our Image Compressor tool</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* PDF */}
            <div className="glass-card rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-2 mb-3 text-rose-600 font-bold">
                <FileText className="w-5 h-5" />
                <h3 className="text-lg text-slate-900">2. PDF Document Compression</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                PDF documents get bloated primarily because of uncompressed embedded raster scans, duplicate embedded font subsets, and extensive historical metadata.
              </p>
              <ul className="text-xs sm:text-sm text-slate-600 space-y-2 mb-4">
                <li>&bull; <strong>Stream Packing:</strong> Older PDF specifications store objects individually. Packing objects into compressed Flate streams condenses cross-reference tables.</li>
                <li>&bull; <strong>Metadata Stripping:</strong> Removing print calibration profiles, author revisions, and XML logs frees substantial bytes without touching text.</li>
                <li>&bull; <strong>Vector Sharpness:</strong> Unlike images, vector text and diagrams remain sharp at any zoom level because they are rendered mathematically.</li>
              </ul>
              <Link
                href="/pdf-compressor"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-800"
              >
                <span>Open our PDF Compressor tool</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Video */}
            <div className="glass-card rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-2 mb-3 text-purple-600 font-bold">
                <Film className="w-5 h-5" />
                <h3 className="text-lg text-slate-900">3. Video Compression (MP4, WebM, MOV)</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                Video files are combinations of 24 to 60 image frames per second combined with multi-channel audio tracks. Video file size is governed by the formula:
                <code className="block my-2 p-2 bg-slate-100 rounded text-xs font-mono text-slate-800">
                  File Size = (Video Bitrate + Audio Bitrate) &times; Duration
                </code>
              </p>
              <ul className="text-xs sm:text-sm text-slate-600 space-y-2 mb-4">
                <li>&bull; <strong>Resolution:</strong> Downscaling from 1080p (1920&times;1080) to 720p (1280&times;720) cuts pixel density by over 55%.</li>
                <li>&bull; <strong>Bitrate Allocation:</strong> Dropping bitrate from 6 Mbps to 1.5 Mbps produces dramatic file savings suitable for web sharing.</li>
                <li>&bull; <strong>Audio Muting:</strong> Muting non-essential background noise saves 128 to 192 kbps throughout the clip.</li>
              </ul>
              <Link
                href="/video-compressor"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-600 hover:text-purple-800"
              >
                <span>Open our Video Compressor tool</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Audio */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3 text-emerald-600 font-bold">
                <Music className="w-5 h-5" />
                <h3 className="text-lg text-slate-900">4. Audio Compression (MP3, WAV, M4A)</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                Raw audio (like 16-bit 44.1 kHz WAV) records 44,100 amplitude measurements per channel every second, generating ~10 MB per minute of stereo sound.
              </p>
              <ul className="text-xs sm:text-sm text-slate-600 space-y-2 mb-4">
                <li>&bull; <strong>Bitrate Selection:</strong> Encoding to 128 kbps MP3 drops file size by 90% while retaining near-CD transparency for human ears.</li>
                <li>&bull; <strong>Mono Downmixing:</strong> For speech, interviews, and voice memos, downmixing stereo into a single mono channel cuts data volume in half.</li>
              </ul>
              <Link
                href="/audio-compressor"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-800"
              >
                <span>Open our Audio Compressor tool</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </section>

          {/* Section E: Reducing file size without sacrificing quality */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-4">
              E. How to Reduce File Size Without Sacrificing Too Much Quality
            </h2>
            <div className="space-y-3">
              <p>
                To achieve the sweet spot between lightweight file size and crisp visual or auditory clarity, adhere to these best practices:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Match dimensions to target display:</strong> Do not post a 4000px wide image if it will display in an 800px column. Resize images to actual container widths.
                </li>
                <li>
                  <strong>Avoid repeated lossy passes:</strong> Compressing a lossy file (like saving a JPEG multiple times or re-encoding an MP3) produces cumulative generation loss and blocky artifacts. Always compress directly from the highest-quality original master file.
                </li>
                <li>
                  <strong>Always keep original backups:</strong> Keep an uncompressed copy of your original photo, video, or audio file in cold storage before applying lossy compression.
                </li>
                <li>
                  <strong>Review before publishing:</strong> Always preview the compressed file on both desktop and mobile displays to confirm text readability and sharpness.
                </li>
              </ul>
            </div>
          </section>

          {/* Section F: Compressing files for email */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-4">
              F. How to Compress Files for Email Attachments
            </h2>
            <p className="mb-4">
              Email systems were originally designed for plain text, not multi-megabyte media transfers. Most email service providers (including Gmail, Outlook, and Yahoo) enforce strict attachment caps—typically <strong>20 MB to 25 MB</strong> per message.
            </p>
            <div className="p-4 bg-blue-50/70 border border-blue-100 rounded-xl space-y-2 text-xs sm:text-sm">
              <p>
                <strong>When preparing email attachments:</strong>
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Check your recipient&apos;s organization limits; some corporate or governmental email servers restrict attachments to 10 MB.</li>
                <li>Compress photos to WebP or JPEG with max dimensions under 1600px.</li>
                <li>Run multi-page PDF documents through the PDF Compressor to strip metadata and compress object streams.</li>
                <li>If a video clip remains above 25 MB, use our Video Compressor to downscale to 480p or enter a 20 MB target size.</li>
                <li>For massive files exceeding 50 MB, use secure cloud-storage links (Google Drive, OneDrive) rather than raw email attachments.</li>
              </ul>
            </div>
          </section>

          {/* Section G: Is online file compression safe? */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-4">
              G. Is Online File Compression Safe?
            </h2>
            <p className="mb-4">
              Data privacy in online tools depends fundamentally on whether your files are uploaded to remote servers or processed locally on your machine.
            </p>
            <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-emerald-950 flex items-start gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm space-y-1.5">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">FileCompress On-Device Processing Model</h3>
                <p>
                  Unlike traditional converter websites that upload your personal documents to third-party cloud servers, <strong>FileCompress executes compression routines directly inside your web browser</strong> using modern HTML5 Canvas, Web Workers, and WebAssembly APIs.
                </p>
                <p>
                  Your files remain entirely on your computer or mobile device. Zero file contents or pixels are sent over the internet or saved to our servers. Review our <Link href="/privacy-policy" className="text-emerald-700 underline font-semibold">Privacy Policy</Link> for full technical details.
                </p>
              </div>
            </div>
          </section>

          {/* Section H: 10 FAQs */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-6">
              H. Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {HOWTO_FAQS.map((faq, idx) => (
                <div key={idx} className="glass-card rounded-xl p-5 border border-slate-200/80">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2 mb-2">
                    <HelpCircle className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{faq.question}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-6">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Section I: Related Tools */}
          <RelatedTools
            title="Explore FileCompress Tools"
            description="Start compressing your files now using our dedicated browser-side tools."
          />
        </article>
      </main>
    </>
  );
}
