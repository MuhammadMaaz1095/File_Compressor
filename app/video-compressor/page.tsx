import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Film,
  Sparkles,
  Zap,
  Sliders,
  Check,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  VolumeX,
} from 'lucide-react';
import { ToolWorkspace } from '@/components/compression/ToolWorkspace';
import { AdSlot } from '@/components/ads/AdSlot';
import { JsonLd, getSoftwareAppSchema, getFaqSchema } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Video Compressor Online – Reduce Video File Size | FileCompress',
  description:
    'Compress video files online with supported quality and resolution settings. Compare file sizes and download your compressed video with FileCompress.',
  alternates: {
    canonical: 'https://filecompress.app/video-compressor',
  },
  openGraph: {
    title: 'Video Compressor Online – Reduce MP4 & WebM File Size | FileCompress',
    description:
      'Reduce MP4, WebM, and MOV video file sizes directly in your browser. 100% on-device transcoding with zero cloud uploads.',
    url: 'https://filecompress.app/video-compressor',
  },
};

const VIDEO_FAQS = [
  {
    question: 'How does in-browser video compression work?',
    answer:
      'FileCompress uses native browser hardware video decoding and canvas rendering to resize video frames and re-encode the stream using modern WebM or MP4 codecs at your chosen bitrate. Everything processes directly on your local device with no remote file uploads.',
  },
  {
    question: 'Can I compress videos to fit email or Discord upload limits (25MB)?',
    answer:
      'Yes! Under Custom Options, enter your target size in megabytes (e.g., 25 for Discord/Gmail). Our engine dynamically computes the optimal video bitrate required to approach your target size without exceeding it.',
  },
  {
    question: 'Which video formats can I upload and compress?',
    answer:
      'We support MP4 (H.264 / AV1), WebM (VP8 / VP9), and MOV files supported by your browser. Output files are encoded in high-efficiency WebM or MP4 video containers.',
  },
  {
    question: 'Will reducing video resolution make the file much smaller?',
    answer:
      'Downscaling from 1080p to 720p or 480p drastically reduces pixel volume per frame, cutting file size by 50% to 75% while maintaining excellent readability on phone and laptop screens.',
  },
];

export default function VideoCompressorPage() {
  return (
    <>
      <JsonLd data={getSoftwareAppSchema()} />
      <JsonLd data={getFaqSchema(VIDEO_FAQS)} />

      <main className="flex-1 pb-16">
        {/* Header Hero */}
        <section className="relative pt-10 pb-12 sm:pt-14 sm:pb-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Breadcrumb */}
            <nav className="flex justify-center items-center gap-2 text-xs text-slate-500 mb-6" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-blue-600">Home</Link>
              <span>/</span>
              <span className="text-slate-800 font-semibold">Video Compressor</span>
            </nav>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-semibold mb-4">
              <Film className="w-3.5 h-3.5" />
              <span>MP4, WebM &amp; MOV Transcoder</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight max-w-3xl mx-auto">
              Free Online <span className="text-purple-600">Video Compressor</span>
            </h1>

            <p className="mt-3 sm:mt-4 text-base text-slate-600 max-w-xl mx-auto">
              Reduce video file sizes with custom resolution presets (1080p, 720p, 480p), target size calculations, and fast browser transcoding.
            </p>

            <div className="mt-8 text-left">
              <ToolWorkspace category="video" />
            </div>
          </div>
        </section>

        {/* Ad Placeholder */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AdSlot format="horizontal" />
        </div>

        {/* Technical Features Grid */}
        <section className="py-12 bg-white/70 border-y border-slate-200/70">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 text-center mb-8">
              How Video Compression Works in FileCompress
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-card-3d p-6">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 shadow-2xs">
                  <Sliders className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2 tracking-tight">
                  Resolution Downscaling
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Easily reduce dimensions from 1080p to 720p, 480p, or 360p. Our engine preserves your video aspect ratio and never upscales small videos.
                </p>
              </div>

              <div className="glass-card-3d p-6">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 shadow-2xs">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2 tracking-tight">
                  Target Size Matching
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Need to send a clip via Discord, WhatsApp, or Outlook? Enter your target size in MB, and we calculate the bitrate to hit your limit.
                </p>
              </div>

              <div className="glass-card-3d p-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 shadow-2xs">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2 tracking-tight">
                  Private &amp; Offline-Ready
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Large video files never upload over your internet connection. Video encoding runs entirely inside your browser memory using device hardware.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-8 tracking-tight">
            Video Compression FAQs
          </h2>
          <div className="space-y-4">
            {VIDEO_FAQS.map((faq, idx) => (
              <div key={idx} className="glass-card-3d p-6 space-y-2">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-2 tracking-tight">
                  <HelpCircle className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>{faq.question}</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed pl-6">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center flex flex-wrap justify-center gap-4">
            <Link
              href="/audio-compressor"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-800"
            >
              <span>Need to compress audio tracks? Try Audio Compressor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/image-compressor"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              <span>Compress photos with Image Compressor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
