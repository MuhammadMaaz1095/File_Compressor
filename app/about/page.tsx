import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ShieldCheck,
  Zap,
  Info,
  Sliders,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  Image as ImageIcon,
  FileText,
  Film,
  Music,
  Archive,
  ExternalLink,
  Mail,
  User,
  Sparkles,
} from 'lucide-react';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

export const metadata: Metadata = {
  title: 'About FileCompress | Online File Compression Platform',
  description:
    'Learn about FileCompress, our mission to make online file compression simpler and more transparent, our on-device processing architecture, and the creator behind the platform.',
  alternates: {
    canonical: 'https://filecompress.app/about',
  },
  openGraph: {
    title: 'About FileCompress | Online File Compression Platform',
    description:
      'Learn about FileCompress, our mission to make online file compression simpler and more transparent, our on-device processing architecture, and the creator behind the platform.',
    url: 'https://filecompress.app/about',
  },
};

export default function AboutPage() {
  return (
    <main className="flex-1 pb-16">
      {/* Hero Section */}
      <header className="relative pt-12 pb-14 sm:pt-16 sm:pb-20 bg-gradient-to-b from-blue-50/60 via-sky-50/30 to-transparent border-b border-slate-200/60 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-72 bg-gradient-to-b from-blue-200/30 via-sky-100/20 to-transparent pointer-events-none -z-10 rounded-full blur-3xl" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Breadcrumbs items={[{ label: 'About' }]} />

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-blue-200/80 text-blue-700 text-xs font-bold shadow-2xs mb-5">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Platform Overview &amp; Engineering Mission</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#14213D] tracking-tight leading-[1.15] mb-5">
            About FileCompress
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium mb-8">
            FileCompress is a modern, browser-based file optimization platform designed to make reducing file sizes straightforward, fast, and accessible—without forced cloud uploads, opaque algorithms, or intrusive paywalls.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3 rounded-xl btn-3d-primary font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all text-center flex items-center justify-center gap-2"
            >
              <span>Explore Our Tools</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/90 hover:bg-white text-slate-700 hover:text-blue-600 font-semibold text-xs sm:text-sm border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all text-center"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-14 text-slate-700 text-sm sm:text-base leading-relaxed">
        {/* Section 1: Our Mission */}
        <section className="space-y-4">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
            Our Purpose
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#14213D] tracking-tight">
            Our Mission: Everyday File Optimization Without Friction
          </h2>
          <p className="text-slate-600 leading-relaxed">
            Every day, millions of people encounter arbitrary file size barriers. An email server rejects an attachment that exceeds 25 MB; a university submission portal rejects a thesis PDF over 10 MB; a Discord server caps upload files; or a website slows down because hero images are uncompressed.
          </p>
          <p className="text-slate-600 leading-relaxed">
            Our mission with FileCompress is to remove this friction by giving everyone direct, instant access to reliable file-compression utilities right within their browser. We believe file processing should be transparent, accessible on any modern device, and respectful of privacy by default.
          </p>
        </section>

        {/* Section 2: What You Can Do with FileCompress */}
        <section className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Working Capabilities
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#14213D] tracking-tight">
              What You Can Do with FileCompress
            </h2>
            <p className="text-slate-600 text-sm">
              We only publish and advertise tools that are fully built, tested, and actively functioning in our platform. Each category runs tailored optimization engines for its specific format:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Image Compressor */}
            <Link
              href="/image-compressor"
              className="glass-card-3d p-5 rounded-2xl group flex flex-col justify-between hover:border-blue-300 transition-all"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-2xs">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-[#14213D] text-base mb-1.5 flex items-center justify-between">
                  <span>Image Compression</span>
                  <ArrowRight className="w-4 h-4 text-blue-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Compress JPG, JPEG, PNG, and WebP images. Features quality tuning sliders, optional dimension downscaling, and a side-by-side visual comparison preview.
                </p>
              </div>
              <span className="text-xs font-semibold text-blue-600 mt-4 inline-flex items-center gap-1">
                Open Image Compressor &rarr;
              </span>
            </Link>

            {/* PDF Compressor */}
            <Link
              href="/pdf-compressor"
              className="glass-card-3d p-5 rounded-2xl group flex flex-col justify-between hover:border-rose-300 transition-all"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3 group-hover:scale-105 group-hover:bg-rose-600 group-hover:text-white transition-all shadow-2xs">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-[#14213D] text-base mb-1.5 flex items-center justify-between">
                  <span>PDF Compression</span>
                  <ArrowRight className="w-4 h-4 text-rose-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Optimize document structure, remove redundant metadata, and compress internal object data streams to shrink PDF documents for email attachments and web publishing.
                </p>
              </div>
              <span className="text-xs font-semibold text-rose-600 mt-4 inline-flex items-center gap-1">
                Open PDF Compressor &rarr;
              </span>
            </Link>

            {/* Video Compressor */}
            <Link
              href="/video-compressor"
              className="glass-card-3d p-5 rounded-2xl group flex flex-col justify-between hover:border-purple-300 transition-all"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-105 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-2xs">
                  <Film className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-[#14213D] text-base mb-1.5 flex items-center justify-between">
                  <span>Video Compression</span>
                  <ArrowRight className="w-4 h-4 text-purple-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Re-encode MP4, WebM, and MOV video clips with hardware-accelerated MediaRecorder transcoding, custom bitrate targets, and resolution downscaling (720p, 480p).
                </p>
              </div>
              <span className="text-xs font-semibold text-purple-600 mt-4 inline-flex items-center gap-1">
                Open Video Compressor &rarr;
              </span>
            </Link>

            {/* Audio Compressor */}
            <Link
              href="/audio-compressor"
              className="glass-card-3d p-5 rounded-2xl group flex flex-col justify-between hover:border-emerald-300 transition-all"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-105 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-2xs">
                  <Music className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-[#14213D] text-base mb-1.5 flex items-center justify-between">
                  <span>Audio Compression</span>
                  <ArrowRight className="w-4 h-4 text-emerald-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Reduce the byte weight of MP3, WAV, and M4A audio files using configurable bitrates (64, 128, 192 kbps) and optional mono channel downmixing.
                </p>
              </div>
              <span className="text-xs font-semibold text-emerald-600 mt-4 inline-flex items-center gap-1">
                Open Audio Compressor &rarr;
              </span>
            </Link>

            {/* ZIP Archive Creation */}
            <Link
              href="/zip-compressor"
              className="glass-card-3d p-5 rounded-2xl group flex flex-col justify-between hover:border-amber-300 transition-all md:col-span-2"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3 group-hover:scale-105 group-hover:bg-amber-600 group-hover:text-white transition-all shadow-2xs">
                  <Archive className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-[#14213D] text-base mb-1.5 flex items-center justify-between">
                  <span>ZIP Archive Creation</span>
                  <ArrowRight className="w-4 h-4 text-amber-700 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Bundle multiple mixed files—documents, pictures, audio, and clips—into a single standardized ZIP archive with customizable DEFLATE compression levels.
                </p>
              </div>
              <span className="text-xs font-semibold text-amber-700 mt-4 inline-flex items-center gap-1">
                Open ZIP Compressor &rarr;
              </span>
            </Link>
          </div>
        </section>

        {/* Section 3: Our Approach & Core Principles */}
        <section className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Product Philosophy
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#14213D] tracking-tight">
              Our Technical Approach
            </h2>
            <p className="text-slate-600 text-sm">
              We design every feature around five core engineering principles:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="glass-card rounded-2xl p-5 border border-slate-200/80">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-3 font-bold text-xs">
                01
              </div>
              <h3 className="font-bold text-[#14213D] text-sm mb-1.5">
                Simple, Understandable Workflows
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                No account registrations, no software installations, no multi-step ad captchas, and no deceptive download buttons. Drag, configure, and download.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-5 border border-slate-200/80">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 font-bold text-xs">
                02
              </div>
              <h3 className="font-bold text-[#14213D] text-sm mb-1.5">
                Truthful &amp; Transparent Results
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We calculate savings directly from actual before-and-after byte counts. If a file cannot be made smaller, we alert you honestly rather than fabricating savings.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-5 border border-slate-200/80">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 font-bold text-xs">
                03
              </div>
              <h3 className="font-bold text-[#14213D] text-sm mb-1.5">
                On-Device Privacy by Design
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                By leveraging HTML5 Canvas, Web Workers, the Web Audio API, and client-side transcoders, your files are processed locally inside your web browser sandbox.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-5 border border-slate-200/80">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center mb-3 font-bold text-xs">
                04
              </div>
              <h3 className="font-bold text-[#14213D] text-sm mb-1.5">
                Responsive Across All Devices
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Engineered mobile-first with visible keyboard focus indicators, accessible contrast ratios, and responsive touch controls on phones, tablets, and desktops.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: Transparency & Technical Limitations */}
        <section className="space-y-4 p-6 sm:p-8 rounded-3xl bg-slate-100/70 border border-slate-200">
          <h2 className="text-xl sm:text-2xl font-bold text-[#14213D] tracking-tight flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            <span>Transparency &amp; Practical Limitations</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Real file compression is governed by information theory and mathematics, not marketing promises. We believe in setting clear expectations:
          </p>
          <ul className="text-xs sm:text-sm text-slate-600 space-y-2.5 list-disc pl-5">
            <li>
              <strong>Outcome depends on the source file:</strong> An uncompressed RAW photo or high-bitrate screen recording can frequently be reduced by 70% or more. Conversely, an already aggressively compressed JPEG or high-efficiency MP4 clip may yield little to no savings without noticeably sacrificing fidelity.
            </li>
            <li>
              <strong>Possibility of size increases:</strong> In rare cases—such as re-encoding a low-quality file with higher color sub-sampling or adding container headers—the output file can turn out larger. FileCompress checks for this condition and flags it clearly before you replace your original.
            </li>
            <li>
              <strong>Browser memory limits:</strong> Because processing occurs inside your device&apos;s volatile RAM, compressing very large files (such as 4K videos exceeding 100 MB) depends on your device&apos;s available memory and CPU capabilities.
            </li>
          </ul>
        </section>

        {/* Section 5: About the Creator */}
        <section className="space-y-6 pt-4">
          <div className="space-y-2">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Behind the Project
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#14213D] tracking-tight">
              About the Creator
            </h2>
          </div>

          <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-white/90 shadow-xl flex flex-col sm:flex-row items-start gap-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 flex items-center justify-center text-white shrink-0 shadow-md shadow-blue-500/25">
              <User className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>

            <div className="space-y-3 flex-1">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-[#14213D]">
                  Muhammad Maaz
                </h3>
                <p className="text-xs text-blue-600 font-semibold mt-0.5">
                  Creator &amp; Maintainer of FileCompress
                </p>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                FileCompress was built by Muhammad Maaz to solve the common frustration of intrusive, ad-riddled, and insecure file converters on the web. The goal is to provide a clean, modern, privacy-respecting alternative built with modern web technologies that people can rely on for everyday file management.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
                <a
                  href="mailto:mmaaz1104@gmail.com"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold transition-colors border border-blue-200/80"
                >
                  <Mail className="w-3.5 h-3.5 text-blue-600" />
                  <span>mmaaz1104@gmail.com</span>
                </a>

                <a
                  href="https://www.linkedin.com/in/muhammad-maaz-6962b4369"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold transition-colors border border-slate-300/80"
                >
                  <span>LinkedIn Profile</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: Closing CTA Banner */}
        <section className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white shadow-xl shadow-blue-500/20 border border-blue-400/30 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
              Ready to Optimize Your Files?
            </h3>
            <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
              Explore our free, browser-native compression tools or get in touch with questions, bug reports, and suggestions.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/"
              className="px-5 py-2.5 rounded-xl bg-white text-blue-700 font-bold text-xs sm:text-sm hover:bg-blue-50 transition-all shadow-md hover:scale-[1.02] active:scale-[0.98]"
            >
              Start Compressing &rarr;
            </Link>
            <Link
              href="/contact"
              className="px-5 py-2.5 rounded-xl bg-blue-500/30 hover:bg-blue-500/50 text-white font-bold text-xs sm:text-sm border border-white/20 transition-all"
            >
              Contact Us
            </Link>
          </div>
        </section>
      </article>
    </main>
  );
}
