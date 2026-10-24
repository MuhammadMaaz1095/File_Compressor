import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { RelatedTools } from '@/components/content/RelatedTools';
import { GifWorkspace } from '@/components/compression/GifWorkspace';
import { AdSlot } from '@/components/ads/AdSlot';
import { JsonLd, getSoftwareAppSchema, getFaqSchema } from '@/components/seo/JsonLd';
import {
  Sparkles,
  HelpCircle,
  Sliders,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Zap,
  Play,
  Layers,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Free GIF Compressor Online – Reduce GIF Size | FileCompress',
  description:
    'Compress animated GIFs online for free. Reduce GIF file size, optimise animation, and download smaller GIFs with FileCompress.',
  alternates: {
    canonical: 'https://filecompress.app/gif-compressor',
  },
  openGraph: {
    title: 'Free GIF Compressor Online – Reduce GIF Size | FileCompress',
    description:
      'Compress animated GIFs online for free. Reduce GIF file size, optimise animation, and download smaller GIFs with FileCompress.',
    url: 'https://filecompress.app/gif-compressor',
    type: 'website',
  },
};

const GIF_FAQS = [
  {
    question: 'How do I compress a GIF online?',
    answer:
      'Upload your GIF file to FileCompress, choose a compression preset or adjust color palette and dimension scaling, process the animation in your browser, and download the optimized GIF file.',
  },
  {
    question: 'Can I reduce the size of an animated GIF?',
    answer:
      'Yes. FileCompress decodes every frame of the animated GIF and reduces its data volume through intelligent color quantization (down to 128, 64, or 32 colors) and resolution scaling, shrinking file size by up to 50% to 75% while keeping the animation moving.',
  },
  {
    question: 'Will compression change the animation?',
    answer:
      'No. FileCompress preserves the original animation timing, frame delay intervals (in centiseconds), disposal instructions, and looping metadata so your GIF loops at the exact same speed as the original.',
  },
  {
    question: 'Can I preserve transparent backgrounds?',
    answer:
      'Yes. Our encoder preserves the GIF transparent color index and Graphic Control Extension transparency flags across all frames, ensuring transparent stickers and animations maintain see-through backgrounds.',
  },
  {
    question: 'Why did my GIF become larger after compression?',
    answer:
      'If the original GIF was already heavily compressed or used a very small color palette (e.g. 16 colors), re-encoding it with a larger 128-color palette or adding dithering can increase file size. When this happens, our tool clearly informs you and offers the original file.',
  },
  {
    question: 'Can I resize a GIF before compressing it?',
    answer:
      'Yes. Select 85%, 75%, or 50% dimension scaling in the settings panel. Resizing width and height to 50% removes 75% of raw pixels, providing the largest possible file-size reduction.',
  },
  {
    question: 'Is the GIF Compressor free?',
    answer:
      'Yes. FileCompress is completely free with no file limits, subscriptions, or watermarks.',
  },
  {
    question: 'Are uploaded GIFs processed locally or on a server?',
    answer:
      'Uploaded GIFs are processed 100% locally inside your web browser using client-side memory. Your personal animations and recordings are never uploaded to any remote server.',
  },
];

export default function GifCompressorPage() {
  return (
    <>
      <JsonLd data={getSoftwareAppSchema()} />
      <JsonLd data={getFaqSchema(GIF_FAQS)} />

      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full pb-16">
        {/* Breadcrumb Navigation */}
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'GIF Compressor', href: '/gif-compressor' },
          ]}
        />

        {/* Hero Header */}
        <header className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200/80 text-amber-800 text-xs font-semibold uppercase tracking-wider mb-4 shadow-2xs">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Animated GIF Optimizer</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
            Free Online <span className="text-amber-600">GIF Compressor</span> – Reduce Animated GIF Size
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Use FileCompress to reduce the size of animated GIF files for websites, messaging,
            presentations, and sharing. Upload a GIF, choose the available optimisation settings,
            compare the original and processed file sizes, and download the result. Compression
            results depend on the animation, colours, dimensions, and settings you choose.
          </p>
        </header>

        {/* Interactive GIF Workspace */}
        <div className="mb-16">
          <GifWorkspace />
        </div>

        {/* Ad Placeholder */}
        <div className="max-w-5xl mx-auto mb-16">
          <AdSlot format="horizontal" />
        </div>

        {/* Features Grid */}
        <section className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Why Compress GIFs with FileCompress?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Engineered specifically for animated images without losing motion or transparency.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="glass-card-3d p-6">
              <div className="w-10 h-10 rounded-xl bg-amber-100/90 text-amber-700 font-bold flex items-center justify-center mb-4 shadow-2xs">
                <Play className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1.5">Animation Preserved</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Retains exact frame delay timings, disposal instructions, and infinite looping
                metadata without dropping motion.
              </p>
            </div>

            <div className="glass-card-3d p-6">
              <div className="w-10 h-10 rounded-xl bg-blue-100/90 text-blue-700 font-bold flex items-center justify-center mb-4 shadow-2xs">
                <Sliders className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1.5">Palette Quantization</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Smart color reduction (256, 128, 64, or 32 colors) cuts redundant color indexes,
                saving 40% to 70% in byte volume.
              </p>
            </div>

            <div className="glass-card-3d p-6">
              <div className="w-10 h-10 rounded-xl bg-indigo-100/90 text-indigo-700 font-bold flex items-center justify-center mb-4 shadow-2xs">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1.5">Dimension Downscaling</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Scale resolution to 85%, 75%, or 50% while maintaining aspect ratio and transparent
                background pixels.
              </p>
            </div>

            <div className="glass-card-3d p-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-100/90 text-emerald-700 font-bold flex items-center justify-center mb-4 shadow-2xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1.5">100% Private &amp; Offline</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Encoding happens locally in your browser memory. Your GIFs never transmit over the
                internet to third-party servers.
              </p>
            </div>
          </div>
        </section>

        {/* Structured SEO Content with Exact H2 Headings from Prompt */}
        <article className="max-w-5xl mx-auto py-8 space-y-4 text-slate-700 leading-relaxed">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Compress Animated GIFs Online for Free
          </h2>
          <p className="text-sm text-slate-600">
            Animated GIFs are a beloved medium for reaction memes, product demonstrations, and
            social media posts. However, because the GIF89a standard was invented decades before
            modern video codecs, animated GIFs store complete raster frames without inter-frame
            motion compensation. This causes even short 5-second animations to reach 10MB to 30MB,
            exceeding upload thresholds on Discord, Slack, and email attachments.
          </p>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight pt-4">
            How to Compress a GIF
          </h2>
          <ol className="list-decimal pl-6 space-y-1.5 text-sm text-slate-600">
            <li>
              <strong>Select or Drop Your GIF:</strong> Drag your GIF file into the upload box above.
            </li>
            <li>
              <strong>Choose Optimization Settings:</strong> Select a preset (Balanced, Maximum
              Reduction, or High Quality), choose a target color palette size (such as 128 or 64
              colors), and set dimension scaling if needed.
            </li>
            <li>
              <strong>Process:</strong> FileCompress decodes every frame, calculates optimized
              palettes, and re-encodes the LZW stream in local browser memory.
            </li>
            <li>
              <strong>Review and Download:</strong> Preview the resulting animation, verify byte
              savings, and download your smaller GIF file.
            </li>
          </ol>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight pt-4">
            How to Reduce GIF File Size Without Unnecessary Quality Loss
          </h2>
          <p className="text-sm text-slate-600">
            The secret to high-quality GIF compression is starting with conservative palette
            reduction. Reducing the global palette from 256 colors down to 128 colors saves up to 40%
            with virtually zero perceptible difference for screencasts, UI recordings, and vector
            animations. Avoid aggressive dithering when fine gradients are not strictly necessary.
          </p>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight pt-4">
            GIF Compression Settings Explained
          </h2>
          <ul className="list-disc pl-6 space-y-1.5 text-sm text-slate-600">
            <li>
              <strong>Balanced Preset:</strong> Scales dimensions slightly (85%) and applies a 128-color
              palette. Recommended for everyday sharing.
            </li>
            <li>
              <strong>Maximum Reduction:</strong> Scales dimensions to 65% and reduces colors to 64.
              Ideal when squeezing 25MB GIFs under the 8MB Discord upload ceiling.
            </li>
            <li>
              <strong>High Quality:</strong> Preserves 100% of original dimensions and 256 colors,
              optimizing LZW dictionary patterns.
            </li>
          </ul>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight pt-4">
            How to Optimise GIFs for Websites and Sharing
          </h2>
          <p className="text-sm text-slate-600">
            For website embedding, heavy GIFs degrade Google Core Web Vitals and increase mobile data
            costs. Scale your GIF to match the actual rendered container width on your page, and keep
            frame rates between 15fps and 20fps for optimal playback speed.
          </p>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight pt-4">
            Why Is My GIF Still Too Large?
          </h2>
          <p className="text-sm text-slate-600">
            If your output file is still large, the animation may have a very high frame count (e.g.
            hundreds of frames) or rapid video scene transitions. In these cases, reducing dimension
            scaling to 50% cuts 75% of pixel volume, achieving dramatic reduction.
          </p>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight pt-4">
            Does GIF Compression Affect Animation or Transparency?
          </h2>
          <p className="text-sm text-slate-600">
            FileCompress explicitly parses and preserves Graphic Control Extension blocks, frame
            delay intervals, disposal methods, and transparent color index mappings. Your animation
            will loop smoothly at its original speed without broken transparency or flickering.
          </p>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight pt-4">
            Is It Safe to Compress GIFs Online?
          </h2>
          <p className="text-sm text-slate-600">
            Yes. FileCompress operates entirely client-side using JavaScript Web Streams in your local
            browser memory. Your private captures, screen recordings, and animations are never
            uploaded or stored on remote servers.
          </p>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight pt-4">
            Frequently Asked Questions
          </h2>
        </article>

        {/* FAQs */}
        <section className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold mb-2">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Common Questions</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Frequently Asked Questions About GIF Compression
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {GIF_FAQS.map((item, idx) => (
              <div key={idx} className="glass-card-3d p-6 space-y-2">
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">{item.question}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related Compression Tools */}
        <RelatedTools
          currentPath="/gif-compressor"
          title="Related Media Optimization Tools"
          description="Need to optimize other image, video, audio, or document formats? Try our specialized tools."
        />
      </main>
    </>
  );
}
