import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { RelatedTools } from '@/components/content/RelatedTools';
import { Mp3Workspace } from '@/components/compression/Mp3Workspace';
import { AdSlot } from '@/components/ads/AdSlot';
import { JsonLd, getSoftwareAppSchema, getFaqSchema } from '@/components/seo/JsonLd';
import {
  HelpCircle,
  Sliders,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Music,
  Radio,
  Zap,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Free MP3 Compressor Online – Reduce MP3 Size | FileCompress',
  description:
    'Compress MP3 files online with FileCompress. Reduce audio file size with supported bitrate settings and download your processed audio.',
  alternates: {
    canonical: 'https://filecompress.app/mp3-compressor',
  },
  openGraph: {
    title: 'Free MP3 Compressor Online – Reduce MP3 Size | FileCompress',
    description:
      'Compress MP3 files online with FileCompress. Reduce audio file size with supported bitrate settings and download your processed audio.',
    url: 'https://filecompress.app/mp3-compressor',
    type: 'website',
  },
};

const MP3_FAQS = [
  {
    question: 'How do I compress an MP3 file online?',
    answer:
      'Upload your MP3 file to FileCompress using the dropzone above, select your desired target bitrate (e.g. 128 kbps or 96 kbps) or choose a preset, click Compress MP3, verify the audio using the built-in output player, and download your smaller MP3.',
  },
  {
    question: 'How does MP3 bitrate affect file size and audio quality?',
    answer:
      'Bitrate represents the number of kilobits processed per second of audio (kbps). A 320 kbps MP3 consumes approximately 2.4 MB per minute of audio, while a 128 kbps MP3 requires only 0.96 MB per minute (saving over 60% of disk space) while retaining clear stereo fidelity for casual listening.',
  },
  {
    question: 'Can you compress MP3 without losing quality?',
    answer:
      'MP3 is inherently a lossy psychoacoustic audio format. Re-encoding an MP3 file to a lower bitrate involves mathematical quantization that discards inaudible or imperceptible acoustic frequencies. While bit-for-bit lossless compression of an already-encoded MP3 is not possible, dropping from 320 kbps to 192 or 128 kbps yields massive file size savings with virtually transparent quality for human ears on standard headphones.',
  },
  {
    question: 'Why is my MP3 file still large?',
    answer:
      'The file size of an MP3 is strictly a function of duration and bitrate: File Size (bits) = Duration (seconds) × Bitrate (bps). An hour-long podcast recorded at 320 kbps will always be around 144 MB. To make it smaller, you must lower the bitrate (e.g., to 96 kbps or 64 kbps) or downmix multi-channel stereo into a single mono channel.',
  },
  {
    question: 'Why did my MP3 become larger after compression?',
    answer:
      'If your original MP3 was already encoded at a low bitrate (for instance, 64 kbps voice memo or 96 kbps stream) and you selected a 192 kbps or 256 kbps target bitrate, the encoder re-sampled the audio into larger frames, increasing overall byte count. FileCompress displays this increase honestly and highlights when source audio is already optimized.',
  },
  {
    question: 'Is it safe to compress MP3 files online on FileCompress?',
    answer:
      'Yes, 100% safe and private. FileCompress executes all audio decoding and MP3 encoding entirely inside your web browser using Web Audio API and WebAssembly/JavaScript. Your audio files are never uploaded to any remote server or third-party cloud.',
  },
  {
    question: 'What is the best bitrate for podcasts and speech recordings?',
    answer:
      'For spoken word, lectures, audiobooks, and interviews, 64 kbps mono or 96 kbps stereo provides exceptional intelligibility while minimizing bandwidth and storage overhead.',
  },
  {
    question: 'Does FileCompress support downmixing to mono?',
    answer:
      'Yes. Our MP3 compressor includes an optional mono downmixing switch that averages stereo channels together into a single track, cutting necessary audio data almost in half without degrading speech clarity.',
  },
];

export default function Mp3CompressorPage() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Audio Compressor', href: '/audio-compressor' },
    { label: 'MP3 Compressor', href: '/mp3-compressor' },
  ];

  const appSchema = getSoftwareAppSchema();

  const faqSchema = getFaqSchema(MP3_FAQS);

  return (
    <div className="min-h-screen py-8 sm:py-12 bg-pattern">
      <JsonLd data={appSchema} />
      <JsonLd data={faqSchema} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <Breadcrumbs items={breadcrumbItems} />

        {/* Hero Section */}
        <section className="text-center space-y-4 max-w-3xl mx-auto pt-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold shadow-xs">
            <Music className="w-3.5 h-3.5" />
            <span>Browser-Side LAME MP3 Engine</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Free Online MP3 Compressor – Reduce MP3 File Size
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Compress MP3 audio files online without sending your tracks to external servers.
            Adjust bitrates from 64 to 320 kbps, downmix stereo to mono, and preview original
            vs. compressed playback before downloading.
          </p>
        </section>

        {/* Interactive Workspace */}
        <section aria-label="MP3 Compression Tool">
          <Mp3Workspace />
        </section>

        {/* Ad Placement */}
        <AdSlot slotId="mp3-compressor-mid" format="horizontal" />

        {/* Comprehensive SEO Content Section */}
        <article className="glass-panel-elevated p-8 sm:p-12 rounded-3xl space-y-12 text-slate-700 leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Compress MP3 Files Online
            </h2>
            <p>
              The MP3 (MPEG-1 Audio Layer III) format revolutionized digital music distribution
              by stripping away frequencies beyond human hearing. However, high-bitrate MP3 recordings
              (such as 320 kbps constant bitrate rips) still take up substantial space—exceeding
              email attachment thresholds, consuming mobile storage quotas, and slowing website page loads.
            </p>
            <p>
              FileCompress gives you complete control over your MP3 encoding parameters directly
              inside your browser. Unlike generic cloud converters that upload your personal voice
              memos and proprietary musical compositions to remote servers, our client-side MP3 engine
              decodes and recompresses audio frames in memory, ensuring absolute data privacy.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              How to Compress an MP3 File
            </h2>
            <p>
              Reducing the file size of your MP3 audio takes only a few seconds with our step-by-step
              workflow:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="p-5 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs space-y-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm">
                  1
                </div>
                <h3 className="font-bold text-slate-900 text-base">Select Your MP3</h3>
                <p className="text-xs text-slate-600">
                  Drop your audio file into the workspace or browse your device. FileCompress inspects
                  the audio container and verifies duration and channels.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs space-y-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm">
                  2
                </div>
                <h3 className="font-bold text-slate-900 text-base">Choose Bitrate Settings</h3>
                <p className="text-xs text-slate-600">
                  Pick a target bitrate (e.g. 128 kbps for music or 64–96 kbps for voice) and decide
                  whether to downmix stereo into a compact mono channel.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs space-y-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm">
                  3
                </div>
                <h3 className="font-bold text-slate-900 text-base">Listen & Download</h3>
                <p className="text-xs text-slate-600">
                  Click Compress MP3. Use the built-in media player to audition the output sound quality
                  and review truthful byte savings before downloading.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              How MP3 Bitrate Affects File Size and Audio Quality
            </h2>
            <p>
              Digital audio bitrate determines how many binary bits are dedicated to representing one
              second of sound. In constant bitrate (CBR) MP3 files, the calculation of total file size
              is strictly mathematical:
            </p>
            <div className="p-4 rounded-xl bg-slate-900 text-blue-300 font-mono text-xs overflow-x-auto">
              File Size in Megabytes (MB) = [Duration (seconds) × Bitrate (kbps) ÷ 8] ÷ 1024
            </div>
            <p>
              Here is how common MP3 bitrates compare in storage footprint and acoustic transparency:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-100 text-slate-800 font-bold">
                  <tr>
                    <th className="p-3">Bitrate</th>
                    <th className="p-3">Est. Size / Minute</th>
                    <th className="p-3">Perceived Audio Quality</th>
                    <th className="p-3">Recommended Use Case</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">320 kbps</td>
                    <td className="p-3">~2.40 MB</td>
                    <td className="p-3 text-emerald-700 font-medium">Near-Lossless / Studio Master</td>
                    <td className="p-3">Archival, high-end Hi-Fi sound systems</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">256 kbps</td>
                    <td className="p-3">~1.92 MB</td>
                    <td className="p-3 text-emerald-700 font-medium">Very High Quality</td>
                    <td className="p-3">Commercial digital music downloads</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">192 kbps</td>
                    <td className="p-3">~1.44 MB</td>
                    <td className="p-3 text-blue-700 font-medium">Excellent / Transparent</td>
                    <td className="p-3">Complex music with rich acoustic dynamics</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">128 kbps</td>
                    <td className="p-3">~0.96 MB</td>
                    <td className="p-3 text-blue-700 font-medium">Standard MP3 Benchmark</td>
                    <td className="p-3">Streaming, casual listening, mobile storage</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">96 kbps</td>
                    <td className="p-3">~0.72 MB</td>
                    <td className="p-3 text-amber-700 font-medium">Clear Intelligibility</td>
                    <td className="p-3">Podcasts, radio shows, language courses</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">64 kbps</td>
                    <td className="p-3">~0.48 MB</td>
                    <td className="p-3 text-amber-700 font-medium">Speech Focused (Mono)</td>
                    <td className="p-3">Lectures, voice notes, WhatsApp audio notes</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Choose the Right MP3 Bitrate
            </h2>
            <p>
              Selecting the ideal bitrate depends directly on the complexity of your audio material:
            </p>
            <ul className="space-y-2 list-disc list-inside text-sm">
              <li>
                <strong>Spoken Word & Interviews:</strong> Speech contains limited harmonic frequencies
                above 8 kHz compared to a symphony orchestra. Setting your bitrate to <strong>64 kbps or 96 kbps</strong> with
                mono downmix delivers clear voice reproduction while reducing file size by up to 75%.
              </li>
              <li>
                <strong>Podcasts with Intro Music:</strong> A setting of <strong>96 to 128 kbps</strong> preserves
                the punch of musical bumpers while keeping episode downloads lightweight for listeners on mobile networks.
              </li>
              <li>
                <strong>Music & Band Demos:</strong> For multi-instrument tracks with cymbals, bass guitars, and reverbs,
                <strong>128 to 192 kbps</strong> ensures stereo separation and preserves subtle acoustic nuances.
              </li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Why Is My MP3 File Still Large?
            </h2>
            <p>
              If your MP3 file did not decrease in size as much as anticipated, consider these technical factors:
            </p>
            <ul className="space-y-2 list-disc list-inside text-sm">
              <li>
                <strong>The Original Was Already Compressed:</strong> If your input file was already encoded at 96 kbps or 128 kbps,
                re-encoding it at 128 kbps will not reduce file size. In fact, re-encoding can slightly inflate the file due to LAME header framing.
              </li>
              <li>
                <strong>Length of the Track:</strong> A 90-minute lecture at 128 kbps will inevitably occupy ~85 MB because length scales linearly with byte count.
              </li>
              <li>
                <strong>Embedded Album Artwork:</strong> Some MP3 files bundle high-resolution 4K album art inside ID3v2 tags. Stripping tags or downmixing to mono can unlock additional savings.
              </li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Can You Compress MP3 Without Losing Quality?
            </h2>
            <p>
              No compression tool can perform lossy re-encoding without discarding some high-frequency
              waveform data. However, the human auditory system possesses psychoacoustic masking
              properties: loud frequencies mask adjacent softer frequencies, and hearing acuity drops
              steeply above 16 kHz.
            </p>
            <p>
              Our encoder applies perceptual psychoacoustic models that selectively eliminate imperceptible
              sound components. Therefore, while mathematical changes occur, the audible listening experience
              remains clear, balanced, and indistinguishable from uncompressed audio on consumer playback devices.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Is It Safe to Compress MP3 Files Online?
            </h2>
            <p>
              On most websites, uploading audio files exposes your sensitive voice recordings, unreleased
              musical recordings, and company meetings to unknown remote cloud servers.
            </p>
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-950 text-sm space-y-2">
              <div className="flex items-center gap-2 font-bold text-emerald-900">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
                <span>100% Client-Side Privacy Guarantee</span>
              </div>
              <p>
                FileCompress works entirely inside your client browser. Your audio data is read into
                local memory, processed via standard Web Audio API and JavaScript, and output directly
                into your browser download cache. No audio frames ever touch our servers.
              </p>
            </div>
          </section>

          {/* FAQs Section */}
          <section className="space-y-6 pt-4 border-t border-slate-200/80">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-4">
              {MP3_FAQS.map((faq, index) => (
                <details
                  key={index}
                  className="group rounded-2xl border border-slate-200 bg-white/70 p-5 transition-all open:bg-white open:shadow-xs"
                >
                  <summary className="flex cursor-pointer items-center justify-between font-bold text-slate-900 text-sm sm:text-base">
                    <span>{faq.question}</span>
                    <span className="ml-4 text-blue-600 transition-transform group-open:rotate-180">
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
        <RelatedTools currentPath="/mp3-compressor" />
      </div>
    </div>
  );
}
