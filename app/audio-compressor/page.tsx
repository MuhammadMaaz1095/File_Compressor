import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Music,
  Sparkles,
  Zap,
  Sliders,
  Check,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Volume2,
} from 'lucide-react';
import { ToolWorkspace } from '@/components/compression/ToolWorkspace';
import { AdSlot } from '@/components/ads/AdSlot';
import { JsonLd, getSoftwareAppSchema, getFaqSchema } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Audio Compressor Online – Reduce Audio File Size | FileCompress',
  description:
    'Compress supported audio files online with bitrate and format options. Compare file sizes and download your compressed audio with FileCompress.',
  alternates: {
    canonical: 'https://filecompress.app/audio-compressor',
  },
  openGraph: {
    title: 'Audio Compressor Online – Compress MP3 & WAV Files | FileCompress',
    description:
      'Reduce audio file size for MP3, WAV, M4A, and OGG sound files. High-speed client-side audio encoding with custom bitrates.',
    url: 'https://filecompress.app/audio-compressor',
  },
};

const AUDIO_FAQS = [
  {
    question: 'How does in-browser audio compression work?',
    answer:
      'FileCompress decodes your audio file using the browser Web Audio API into raw PCM waveforms. Our client-side MP3 encoder (LAME engine) compresses the audio into an optimized MP3 stream at your requested bitrate without sending any data over the internet.',
  },
  {
    question: 'What bitrate should I choose for my audio file?',
    answer:
      '128 kbps is the universal standard for music and voice podcasts, delivering a great balance of clarity and small file size. For spoken voice recordings, 64 or 96 kbps cuts file size dramatically. For studio fidelity, select 192 or 256 kbps.',
  },
  {
    question: 'Will converting stereo audio to mono save space?',
    answer:
      'Yes! By selecting "Convert to Mono", left and right audio channels are combined into a single unified track. This halves the audio sample count and typically saves an extra 40% to 50% in file size without noticeable loss for speech, voice notes, or single-speaker podcasts.',
  },
  {
    question: 'Can I compress lossless WAV or FLAC files to MP3?',
    answer:
      'Absolutely. Uploading large 40MB+ WAV files and compressing them to 128 kbps MP3 routinely yields over 85% to 90% in file size reduction while preserving crisp listening quality.',
  },
];

export default function AudioCompressorPage() {
  return (
    <>
      <JsonLd data={getSoftwareAppSchema()} />
      <JsonLd data={getFaqSchema(AUDIO_FAQS)} />

      <main className="flex-1 pb-16">
        {/* Header Hero */}
        <section className="relative pt-10 pb-12 sm:pt-14 sm:pb-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Breadcrumb */}
            <nav className="flex justify-center items-center gap-2 text-xs text-slate-500 mb-6" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-blue-600">Home</Link>
              <span>/</span>
              <span className="text-slate-800 font-semibold">Audio Compressor</span>
            </nav>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-4">
              <Music className="w-3.5 h-3.5" />
              <span>MP3, WAV, M4A &amp; OGG Optimizer</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight max-w-3xl mx-auto">
              Free Online <span className="text-emerald-600">Audio Compressor</span>
            </h1>

            <p className="mt-3 sm:mt-4 text-base text-slate-600 max-w-xl mx-auto">
              Reduce audio file sizes with custom bitrates (64kbps &ndash; 320kbps), stereo-to-mono downmixing, and instant audio playback preview.
            </p>

            <div className="mt-8 text-left">
              <ToolWorkspace category="audio" />
            </div>
          </div>
        </section>

        {/* Ad Placeholder */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AdSlot format="horizontal" />
        </div>

        {/* Audio Optimization Features */}
        <section className="py-12 bg-white/70 border-y border-slate-200/70">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 text-center mb-8">
              Audio Bitrates &amp; Optimization Strategies
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-card-3d p-6">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block mb-1">
                  Speech &amp; Podcasts
                </span>
                <h3 className="text-lg font-bold text-slate-900 mb-2 tracking-tight">64 &ndash; 96 kbps</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Ultra-compact audio profiles tailored for audiobooks, phone recordings, and lecture notes where file size is paramount.
                </p>
                <div className="text-xs font-semibold text-emerald-700 bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-200/60">
                  Average savings: 70% &ndash; 90%
                </div>
              </div>

              <div className="glass-card-3d p-6 border-blue-200/90">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-1">
                  Balanced Music Standard
                </span>
                <h3 className="text-lg font-bold text-slate-900 mb-2 tracking-tight">128 kbps (Default)</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  The recommended sweet spot for music and sound clips, providing near-transparent acoustic quality with significant size reduction.
                </p>
                <div className="text-xs font-semibold text-blue-700 bg-blue-50/80 p-2.5 rounded-xl border border-blue-200/60">
                  Average savings: 50% &ndash; 75%
                </div>
              </div>

              <div className="glass-card-3d p-6">
                <span className="text-xs font-bold text-purple-600 uppercase tracking-wider block mb-1">
                  Studio Fidelity
                </span>
                <h3 className="text-lg font-bold text-slate-900 mb-2 tracking-tight">192 &ndash; 320 kbps</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Full dynamic frequency preservation up to 20kHz, ideal for musical tracks, master stems, and professional audio productions.
                </p>
                <div className="text-xs font-semibold text-purple-700 bg-purple-50/80 p-2.5 rounded-xl border border-purple-200/60">
                  Lossless structure reduction
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-8 tracking-tight">
            Audio Compression FAQs
          </h2>
          <div className="space-y-4">
            {AUDIO_FAQS.map((faq, idx) => (
              <div key={idx} className="glass-card-3d p-6 space-y-2">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-2 tracking-tight">
                  <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0" />
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
              href="/video-compressor"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-600 hover:text-purple-800"
            >
              <span>Need to compress video clips? Try Video Compressor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/pdf-compressor"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-800"
            >
              <span>Compress PDF documents</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
