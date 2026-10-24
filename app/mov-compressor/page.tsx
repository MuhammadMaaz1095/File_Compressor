import React from 'react';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { RelatedTools } from '@/components/content/RelatedTools';
import { MovWorkspace } from '@/components/compression/MovWorkspace';
import { AdSlot } from '@/components/ads/AdSlot';
import { JsonLd, getSoftwareAppSchema, getFaqSchema } from '@/components/seo/JsonLd';
import { Film, ShieldCheck, Zap, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Free MOV Compressor Online – Reduce MOV Video Size | FileCompress',
  description:
    'Compress supported MOV videos with FileCompress. Reduce video size using available encoding settings and download the processed video.',
  alternates: {
    canonical: 'https://filecompress.app/mov-compressor',
  },
  openGraph: {
    title: 'Free MOV Compressor Online – Reduce MOV Video Size | FileCompress',
    description:
      'Compress supported MOV videos with FileCompress. Reduce video size using available encoding settings and download the processed video.',
    url: 'https://filecompress.app/mov-compressor',
    type: 'website',
  },
};

const MOV_FAQS = [
  {
    question: 'How do I compress an Apple MOV video online?',
    answer:
      'Upload your QuickTime (.mov) video into FileCompress. Choose your preferred target resolution (e.g. 720p HD) and encoding bitrate, or enter a target file size (e.g. 25MB for Discord/Email). Your browser recompresses the video locally and produces a compact, universally playable file.',
  },
  {
    question: 'Why are iPhone and Mac MOV files so large?',
    answer:
      'Apple QuickTime MOV files recorded on iPhones, iPads, and Mac cameras often use high intra-frame bitrates or Apple ProRes codecs designed for editing rather than web distribution. Transcoding to modern web video containers cuts file size by up to 85%.',
  },
  {
    question: 'What is the difference between MOV and MP4 containers?',
    answer:
      'QuickTime MOV and MP4 are both based on the ISO base media file format. However, MOV files frequently wrap high-bitrate codecs that fail to play on Windows PCs, Android phones, and certain web players. Compressing through FileCompress exports widely supported WebM or MP4 streams that play anywhere.',
  },
  {
    question: 'Why is my MOV video not previewing or processing?',
    answer:
      'Some high-end MOV files recorded in 10-bit HDR ProRes 422 require specialized desktop decoders that standard web browser sandboxes cannot decode. Standard H.264/AAC QuickTime videos recorded on iPhones and consumer cameras process smoothly.',
  },
  {
    question: 'Are my private videos uploaded to a cloud server?',
    answer:
      'No. FileCompress processes your video 100% on your local machine using hardware-accelerated Web Standards. No video frames or audio data are ever transmitted to an external server.',
  },
];

export default function MovCompressorPage() {
  return (
    <>
      <JsonLd data={getSoftwareAppSchema()} />
      <JsonLd data={getFaqSchema(MOV_FAQS)} />
      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full pb-16">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'MOV Compressor', href: '/mov-compressor' },
          ]}
        />

        {/* Hero Header */}
        <header className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 border border-violet-200 text-violet-700 text-xs font-bold uppercase tracking-wider mb-4">
            <Film className="w-3.5 h-3.5" />
            <span>Apple QuickTime Video Compression</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Free Online MOV Compressor – <span className="text-blue-600">Reduce MOV File Size</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Compress heavy QuickTime (.mov) video clips directly in your browser. Downscale iPhone and Mac videos, tune bitrates, and create fast-loading web-friendly files without cloud uploads.
          </p>
        </header>

        {/* Workspace */}
        <div className="mb-16">
          <MovWorkspace />
        </div>

        <div className="max-w-5xl mx-auto mb-16">
          <AdSlot format="horizontal" />
        </div>

        {/* Editorial SEO Content */}
        <article className="prose prose-slate max-w-4xl mx-auto space-y-12 text-slate-700">
          <section className="glass-panel p-8 sm:p-10 rounded-3xl space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Compress MOV Videos Online
            </h2>
            <p className="leading-relaxed">
              QuickTime Movie (.mov) is Apple&apos;s proprietary video container, commonly generated by iPhones, iPads, QuickTime Player screen recordings, and professional digital cinema cameras. While MOV offers exceptional video fidelity for post-production editing, individual clips frequently take up hundreds of megabytes or gigabytes of storage.
            </p>
            <p className="leading-relaxed">
              FileCompress MOV Compressor makes high-resolution Apple video files shareable. By analyzing container streams directly inside your browser, our transcoding pipeline resizes video frames, applies bandwidth-conscious bitrates, and exports universally compatible video files ready for messaging, email attachments, and web publishing.
            </p>
          </section>

          <section className="glass-panel p-8 sm:p-10 rounded-3xl space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              How to Reduce MOV File Size
            </h2>
            <ol className="list-decimal pl-6 space-y-2 text-slate-700 font-medium">
              <li>
                <strong>Upload your QuickTime MOV file:</strong> Drag and drop your `.mov` file into the upload zone or browse your local file system.
              </li>
              <li>
                <strong>Configure output resolution:</strong> Select 720p HD (recommended for crisp online playback) or 480p SD for instant mobile sharing.
              </li>
              <li>
                <strong>Select an encoding profile:</strong> Choose Balanced (1600 kbps) or Maximum Savings (800 kbps), or specify a maximum target size in megabytes.
              </li>
              <li>
                <strong>Transcode locally and download:</strong> The video encodes on your local hardware with live progress updates, yielding a lean, web-compatible video file.
              </li>
            </ol>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-3">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                MOV Compression Settings Explained
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Bitrate is the volume of data processed per second of video. High-definition iPhone MOV recordings often use bitrates above 20,000 kbps. Re-encoding with our Balanced profile (1600 kbps) shrinks file weight by over 80% while retaining high-definition clarity on computer screens and mobile displays.
              </p>
            </div>

            <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-3">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                MOV vs MP4: Container and Codec Differences
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Although QuickTime MOV and MP4 share similar underlying container architecture, MOV containers frequently store Apple-specific codec variants that cause playback failures on Windows PCs and Android devices. Transcoding into standard web containers guarantees universal cross-platform compatibility.
              </p>
            </div>
          </div>

          <section className="glass-panel p-8 sm:p-10 rounded-3xl space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Reduce MOV Size for Sharing and Uploads
            </h2>
            <p className="leading-relaxed">
              Raw iPhone clips routinely exceed the 25 MB email attachment limit on Gmail and Outlook, as well as the upload caps of messaging platforms. FileCompress lets you input an exact target size (e.g. 25 MB), automatically computing the optimal encoding bitrate for your video&apos;s duration.
            </p>
          </section>

          <section className="glass-panel p-8 sm:p-10 rounded-3xl space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Why Is My MOV Video Not Processing?
            </h2>
            <p className="leading-relaxed">
              If a MOV video fails to decode or preview in the browser workspace, common factors include:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600 text-sm">
              <li>
                <strong>Apple ProRes Codecs:</strong> Videos captured in Apple ProRes 422 HQ or ProRes RAW contain proprietary video streams that standard web browser engines cannot decode without desktop NLE software.
              </li>
              <li>
                <strong>Browser Codec Support:</strong> Certain Windows installations without HEVC video extensions may struggle with H.265 MOV files. H.264 QuickTime videos process seamlessly.
              </li>
              <li>
                <strong>Browser Memory Limits:</strong> Extremely long multi-gigabyte video files can exceed browser tab memory allocations. Processing clips under 500 MB is recommended for smooth performance.
              </li>
            </ul>
          </section>

          {/* FAQs */}
          <section className="glass-panel p-8 sm:p-10 rounded-3xl space-y-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <div className="divide-y divide-slate-200/80">
              {MOV_FAQS.map((faq, idx) => (
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
            currentPath="/mov-compressor"
            title="Related Media Optimization Tools"
            description="Explore our specialized tools for MP4 video, audio, image, and document compression."
          />
        </section>
      </main>
    </>
  );
}
