import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { RelatedTools } from '@/components/content/RelatedTools';
import { WavWorkspace } from '@/components/compression/WavWorkspace';
import { AdSlot } from '@/components/ads/AdSlot';
import { JsonLd, getSoftwareAppSchema, getFaqSchema } from '@/components/seo/JsonLd';
import {
  HelpCircle,
  Sliders,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  AudioWaveform,
  Zap,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Free WAV Compressor Online – Reduce WAV File Size | FileCompress',
  description:
    'Reduce WAV audio file size with FileCompress. Explore supported audio settings and download a smaller or converted audio file when processing succeeds.',
  alternates: {
    canonical: 'https://filecompress.app/wav-compressor',
  },
  openGraph: {
    title: 'Free WAV Compressor Online – Reduce WAV File Size | FileCompress',
    description:
      'Reduce WAV audio file size with FileCompress. Explore supported audio settings and download a smaller or converted audio file when processing succeeds.',
    url: 'https://filecompress.app/wav-compressor',
    type: 'website',
  },
};

const WAV_FAQS = [
  {
    question: 'How do I compress a WAV file online?',
    answer:
      'Upload your WAV file to FileCompress, choose between Mode A (downsampling sample rate and downmixing channels to maintain a smaller uncompressed .wav) or Mode B (converting to compressed MP3 for massive 90% byte savings), click Process, listen to the preview, and download your file.',
  },
  {
    question: 'Can you compress WAV without losing quality?',
    answer:
      'Standard WAV files store uncompressed linear PCM (Pulse Code Modulation) audio. There is no lossless method to shrink a standard uncompressed PCM WAV file without changing its sample rate, channel count, or converting it into an archival lossless container like FLAC. Downsampling or converting to MP3 trades a small amount of acoustic frequency bandwidth for massive storage savings.',
  },
  {
    question: 'What is the difference between WAV compression and WAV to MP3 conversion?',
    answer:
      'WAV optimization (Mode A) alters PCM properties (such as reducing sample rate from 44.1 kHz to 22.05 kHz or mixing stereo down to mono) while keeping the file as a valid, uncompressed standard .wav file. Mode B converts the audio into the MPEG Layer III (MP3) lossy format using psychoacoustic masking, cutting file size by 85% to 92% while remaining universally playable.',
  },
  {
    question: 'Why is my WAV file so large?',
    answer:
      'WAV stores every audio sample as raw digital amplitudes without data compression. A standard CD-quality stereo WAV (44,100 samples per second × 16 bits × 2 channels) consumes approximately 10.5 MB for every single minute of sound. A 5-minute song will naturally be around 53 MB.',
  },
  {
    question: 'How does downsampling reduce WAV size?',
    answer:
      'File size in PCM WAV is proportional to sample rate. Reducing sample rate from 44,100 Hz to 22,050 Hz cuts the number of stored samples in half, directly reducing file size by 50%. Combining this with a mono downmix achieves a 75% size reduction while preserving an uncompressed .wav format.',
  },
  {
    question: 'Is FileCompress WAV processing private and safe?',
    answer:
      'Yes. All audio decoding, resampling, and encoding happens entirely within your web browser using Web Audio API and local JavaScript. Your sound files are never uploaded to remote servers or stored in any database.',
  },
  {
    question: 'Will downmixing to mono damage my music?',
    answer:
      'Downmixing averages the left and right audio channels into a single centered audio stream. For speech recordings, voice memos, interviews, and podcasts, mono sounds clear and natural while eliminating 50% of the data. For musical tracks with stereo panning effects, keeping stereo or converting to MP3 is recommended.',
  },
  {
    question: 'Which mode should I choose for email attachments and web upload?',
    answer:
      'Mode B (Convert to MP3 at 128 or 192 kbps) is strongly recommended for email attachments, websites, and messaging apps because it shrinks 50 MB WAV files down to 3 to 5 MB with virtually imperceptible difference on everyday consumer headphones.',
  },
];

export default function WavCompressorPage() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Audio Compressor', href: '/audio-compressor' },
    { label: 'WAV Compressor', href: '/wav-compressor' },
  ];

  const appSchema = getSoftwareAppSchema();
  const faqSchema = getFaqSchema(WAV_FAQS);

  return (
    <div className="min-h-screen py-8 sm:py-12 bg-pattern">
      <JsonLd data={appSchema} />
      <JsonLd data={faqSchema} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <Breadcrumbs items={breadcrumbItems} />

        {/* Hero Section */}
        <section className="text-center space-y-4 max-w-3xl mx-auto pt-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold shadow-xs">
            <AudioWaveform className="w-3.5 h-3.5" />
            <span>Dual-Mode PCM & MP3 Engine</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Free Online WAV Compressor – Reduce WAV File Size
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Reduce uncompressed WAV audio sizes through intelligent PCM sample-rate optimization
            or convert to high-efficiency MP3. Preview before and after audio with 100% private
            client-side Web Audio processing.
          </p>
        </section>

        {/* Interactive Workspace */}
        <section aria-label="WAV Compression Tool">
          <WavWorkspace />
        </section>

        {/* Ad Placement */}
        <AdSlot slotId="wav-compressor-mid" format="horizontal" />

        {/* Comprehensive SEO Content Section */}
        <article className="glass-panel-elevated p-8 sm:p-12 rounded-3xl space-y-12 text-slate-700 leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Compress WAV Audio Online
            </h2>
            <p>
              The Waveform Audio File Format (WAV) is the standard audio container format for raw,
              uncompressed PCM audio on Windows and professional studio workstations. Because WAV files
              do not discard any frequency data, they preserve pristine fidelity. However, this fidelity
              comes at a tremendous cost in disk space and network bandwidth—a typical studio recording
              easily reaches 50 to 100 megabytes per song.
            </p>
            <p>
              FileCompress offers transparent, mathematically grounded audio optimization. We never
              make misleading claims about lossless compression of standard WAV files. Instead, we
              provide two genuine, production-tested pathways: optimize your uncompressed PCM WAV
              parameters directly, or convert to compressed audio formats using psychoacoustic encoding.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              How to Reduce WAV File Size
            </h2>
            <p>
              Depending on your technical requirements, reducing WAV file size can be achieved in three
              clear steps:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="p-5 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs space-y-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm">
                  1
                </div>
                <h3 className="font-bold text-slate-900 text-base">Select Your WAV</h3>
                <p className="text-xs text-slate-600">
                  Drop your file into the workspace. FileCompress parses the RIFF chunk headers and
                  identifies the source sample rate, channel count, and bit depth.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs space-y-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm">
                  2
                </div>
                <h3 className="font-bold text-slate-900 text-base">Choose Processing Mode</h3>
                <p className="text-xs text-slate-600">
                  Select <strong>Mode A</strong> to downsample or mix down while keeping an uncompressed
                  .wav file, or <strong>Mode B</strong> to convert to lightweight MP3 (~90% size reduction).
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs space-y-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm">
                  3
                </div>
                <h3 className="font-bold text-slate-900 text-base">Verify & Download</h3>
                <p className="text-xs text-slate-600">
                  Preview both the original and processed audio streams with our dual media player
                  controls and download your verified output file.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              WAV Compression, Bit Depth, and Sample Rate Explained
            </h2>
            <p>
              Understanding uncompressed audio file size requires examining the three core variables
              governing linear PCM encoding:
            </p>
            <ul className="space-y-2 list-disc list-inside text-sm">
              <li>
                <strong>Sample Rate (Hz):</strong> The number of times per second that acoustic sound
                waves are measured. CD audio captures 44,100 samples every second (44.1 kHz). Halving
                the rate to 22,050 Hz reduces byte size by exactly 50%.
              </li>
              <li>
                <strong>Bit Depth (bits):</strong> The resolution of dynamic amplitude for each sample.
                16-bit audio provides 65,536 discrete amplitude steps (96 dB dynamic range), while
                24-bit audio is used in recording studios.
              </li>
              <li>
                <strong>Channel Count:</strong> Mono audio contains 1 audio channel, whereas stereo
                contains 2 independent waveforms (left and right), doubling storage requirements.
              </li>
            </ul>
            <div className="p-4 rounded-xl bg-slate-900 text-blue-300 font-mono text-xs overflow-x-auto">
              PCM WAV Byte Rate = Sample Rate (Hz) × Channels × [Bit Depth ÷ 8]
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              WAV to MP3 Conversion vs WAV Compression
            </h2>
            <p>
              When people search for &quot;WAV compressor&quot;, their primary objective is almost always
              making the file small enough to share via email, upload to a web application, or store
              on mobile devices.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-100 text-slate-800 font-bold">
                  <tr>
                    <th className="p-3">Method</th>
                    <th className="p-3">Output Format</th>
                    <th className="p-3">Typical Size Savings</th>
                    <th className="p-3">Best Application</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">PCM Optimization (Mode A)</td>
                    <td className="p-3">Uncompressed WAV (.wav)</td>
                    <td className="p-3 text-blue-700 font-medium">50% to 75%</td>
                    <td className="p-3">Game development assets, embedded hardware requiring uncompressed PCM</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">MP3 Conversion (Mode B)</td>
                    <td className="p-3">Perceptual MP3 (.mp3)</td>
                    <td className="p-3 text-emerald-700 font-medium">85% to 92%</td>
                    <td className="p-3">Email attachments, streaming, podcasts, general sharing</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 5 */}
          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Lossless Audio Compression vs Lossy Conversion
            </h2>
            <p>
              In digital audio engineering, there is a fundamental distinction between lossless
              compression and lossy conversion:
            </p>
            <p>
              <strong>Lossless Audio Compression</strong> (such as FLAC or ALAC) operates similarly
              to ZIP algorithms for audio: it mathematically compresses repetitive waveforms and restores
              100% of original bits upon playback. However, an uncompressed WAV file cannot be made
              losslessly smaller without converting into one of these specialized codecs.
            </p>
            <p>
              <strong>Lossy Audio Conversion</strong> (such as MP3 or AAC) leverages psychoacoustics
              to discard frequencies human ears cannot hear, achieving dramatic reductions of 10:1
              or 12:1. For non-studio playback, this is the most effective approach.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Why Is My WAV File Still Large?
            </h2>
            <p>
              If your WAV file remains large after processing, consider the following technical reasons:
            </p>
            <ul className="space-y-2 list-disc list-inside text-sm">
              <li>
                <strong>You Kept 44.1 kHz Stereo PCM:</strong> Selecting Mode A without downsampling or
                mono downmixing preserves the exact uncompressed byte rate, resulting in no size reduction.
              </li>
              <li>
                <strong>Duration of the Recording:</strong> Because linear PCM does not compress, a 60-minute
                WAV file requires roughly 630 megabytes. Converting to MP3 (Mode B) is essential for long recordings.
              </li>
            </ul>
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
              {WAV_FAQS.map((faq, index) => (
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
        <RelatedTools currentPath="/wav-compressor" />
      </div>
    </div>
  );
}
