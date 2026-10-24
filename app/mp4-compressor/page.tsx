import React from 'react';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { RelatedTools } from '@/components/content/RelatedTools';
import { Mp4Workspace } from '@/components/compression/Mp4Workspace';
import { AdSlot } from '@/components/ads/AdSlot';
import { JsonLd, getSoftwareAppSchema, getFaqSchema } from '@/components/seo/JsonLd';
import { Film, ShieldCheck, Zap, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Free MP4 Compressor Online – Reduce MP4 Video Size | FileCompress',
  description:
    'Compress MP4 videos online with FileCompress. Reduce video file size using supported quality and resolution settings, then download your processed video.',
  alternates: {
    canonical: 'https://filecompress.app/mp4-compressor',
  },
  openGraph: {
    title: 'Free MP4 Compressor Online – Reduce MP4 Video Size | FileCompress',
    description:
      'Compress MP4 videos online with FileCompress. Reduce video file size using supported quality and resolution settings, then download your processed video.',
    url: 'https://filecompress.app/mp4-compressor',
    type: 'website',
  },
};

const MP4_FAQS = [
  {
    question: 'How do I compress an MP4 video online?',
    answer:
      'Upload your MP4 video file to FileCompress. Select your desired resolution (e.g. 720p HD or 480p SD) and encoding bitrate, or enter a target file size (e.g. 25MB for Discord/Email), and click Compress to start in-browser hardware-accelerated processing.',
  },
  {
    question: 'Is it possible to compress MP4 videos without losing visible quality?',
    answer:
      'Yes. By preserving the original resolution and removing excessive bitrates or downscaling ultra-high 4K/1080p footage to 720p HD, you can cut video file sizes by 50% to 70% while keeping playback crisp on laptop and smartphone screens.',
  },
  {
    question: 'How can I compress an MP4 video to fit email or Discord limits?',
    answer:
      'Under Compression Controls, enter "25" in the Target Size (MB) field. Our video engine calculates the exact maximum bitrate needed for your video duration so the output fits neatly within email and Discord upload thresholds.',
  },
  {
    question: 'Can I remove the audio track to make the MP4 smaller?',
    answer:
      'Yes. Toggling the Audio Handling option to Mute discards the audio stream, reducing file size by an extra 10% to 20%—ideal for video loops, silent social clips, or screen recordings.',
  },
  {
    question: 'Are my private videos uploaded to an external server?',
    answer:
      'No. FileCompress uses browser-native Canvas and MediaRecorder APIs to process video on your own device. Your video files never leave your computer or phone.',
  },
];

export default function Mp4CompressorPage() {
  return (
    <>
      <JsonLd data={getSoftwareAppSchema()} />
      <JsonLd data={getFaqSchema(MP4_FAQS)} />
      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full pb-16">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'MP4 Compressor', href: '/mp4-compressor' },
          ]}
        />

        {/* Hero Header */}
        <header className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold uppercase tracking-wider mb-4">
            <Film className="w-3.5 h-3.5" />
            <span>Fast In-Browser Video Compression</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Free Online MP4 Compressor – <span className="text-blue-600">Reduce MP4 Video Size</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Compress MP4 video clips directly in your browser. Downscale resolution, tune video bitrates, and shrink files for email, Discord, and messaging without cloud uploads.
          </p>
        </header>

        {/* Workspace */}
        <div className="mb-16">
          <Mp4Workspace />
        </div>

        <div className="max-w-5xl mx-auto mb-16">
          <AdSlot format="horizontal" />
        </div>

        {/* Editorial SEO Content */}
        <article className="prose prose-slate max-w-4xl mx-auto space-y-12 text-slate-700">
          <section className="glass-panel p-8 sm:p-10 rounded-3xl space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Compress MP4 Videos Online
            </h2>
            <p className="leading-relaxed">
              MP4 (MPEG-4 Part 14) is the world&apos;s most universal video container, playable across every smartphone, web browser, television, and operating system. However, 1080p and 4K video clips recorded on modern smartphones easily consume 100 MB to 500 MB per minute of footage, making them impossible to send over email or share across messaging platforms.
            </p>
            <p className="leading-relaxed">
              FileCompress MP4 Compressor gives you total control over video file size. By transcoding frames through native browser APIs, you can adjust output resolution, set bitrate constraints, or target a precise megabyte limit with zero software installations and complete personal privacy.
            </p>
          </section>

          <section className="glass-panel p-8 sm:p-10 rounded-3xl space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              How to Compress an MP4 Video
            </h2>
            <ol className="list-decimal pl-6 space-y-2 text-slate-700 font-medium">
              <li>
                <strong>Select your MP4 video:</strong> Drop your `.mp4` file into the upload zone or choose it from your local storage.
              </li>
              <li>
                <strong>Configure resolution and bitrate:</strong> Choose your target resolution (720p HD is ideal for web sharing) and encoding profile (Balanced 1600 kbps or Maximum Savings 800 kbps).
              </li>
              <li>
                <strong>Optional Target Size:</strong> Enter your exact target size in MB (e.g. 25 MB for Discord or Gmail attachments).
              </li>
              <li>
                <strong>Transcode and download:</strong> Watch live progress as your device re-encodes the video stream, then download your optimized file.
              </li>
            </ol>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-3">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Reduce MP4 File Size While Balancing Quality
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Video file size is mathematically determined by bitrate multiplied by duration: <code>Size = Bitrate &times; Time</code>. By setting an intelligent target bitrate and scaling oversized 4K resolutions down to crisp 720p or 1080p, you eliminate massive amounts of redundant data without visible artifacting.
              </p>
            </div>

            <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-3">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Choose Video Resolution and Quality Settings
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Choose 720p HD for the best combination of sharp visual detail and small file size. For short social media sharing or mobile messaging, 480p SD produces tiny file footprints that send instantly even over slow mobile networks.
              </p>
            </div>
          </div>

          <section className="glass-panel p-8 sm:p-10 rounded-3xl space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Compress MP4 Videos for Email and Sharing
            </h2>
            <p className="leading-relaxed">
              Email services like Gmail, Yahoo Mail, and Outlook enforce strict 25 MB attachment caps. Discord enforces a 25 MB file limit for free accounts. FileCompress includes a dedicated Target Size calculator that automatically calculates the maximum safe bitrate for your video duration so it never exceeds your required limit.
            </p>
          </section>

          <section className="glass-panel p-8 sm:p-10 rounded-3xl space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Why Is My MP4 File Still Large?
            </h2>
            <p className="leading-relaxed">
              If an MP4 video remains larger than desired after compression, consider these elements:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600 text-sm">
              <li>
                <strong>Video Duration:</strong> A 10-minute video encoded at 1600 kbps will always be around 120 MB. For long videos, select 480p resolution and 800 kbps encoding.
              </li>
              <li>
                <strong>High Framerates (60 FPS):</strong> 60 FPS videos contain double the frame count of standard 30 FPS videos.
              </li>
              <li>
                <strong>Already Maximally Compressed:</strong> If the original video was already encoded at a low bitrate (e.g. 500 kbps), re-encoding at 1600 kbps will increase file size. Our engine prevents bitrate inflation and notifies you.
              </li>
            </ul>
          </section>

          <section className="glass-panel p-8 sm:p-10 rounded-3xl space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Is It Possible to Compress MP4 Without Losing Quality?
            </h2>
            <p className="leading-relaxed">
              All video compression involves lossy psycho-visual optimization. However, human visual perception cannot distinguish individual pixels on mobile and laptop screens when resolution and bitrate are balanced correctly. You get a virtually imperceptible difference in viewing quality while saving over 70% of storage space.
            </p>
          </section>

          {/* FAQs */}
          <section className="glass-panel p-8 sm:p-10 rounded-3xl space-y-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <div className="divide-y divide-slate-200/80">
              {MP4_FAQS.map((faq, idx) => (
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
            currentPath="/mp4-compressor"
            title="Related Media Optimization Tools"
            description="Explore our specialized tools for MOV video, audio, image, and document compression."
          />
        </section>
      </main>
    </>
  );
}
