import React from 'react';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { RelatedTools } from '@/components/content/RelatedTools';
import { WebpWorkspace } from '@/components/compression/WebpWorkspace';
import { AdSlot } from '@/components/ads/AdSlot';
import { JsonLd, getSoftwareAppSchema, getFaqSchema } from '@/components/seo/JsonLd';
import { Sparkles, ShieldCheck, Zap, Image as ImageIcon } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Free WebP Compressor Online – Reduce WebP Size | FileCompress',
  description:
    'Compress WebP images online with FileCompress. Reduce WebP file size, optimise supported images, and download the processed result.',
  alternates: {
    canonical: 'https://filecompress.app/webp-compressor',
  },
  openGraph: {
    title: 'Free WebP Compressor Online – Reduce WebP Size | FileCompress',
    description:
      'Compress WebP images online with FileCompress. Reduce WebP file size, optimise supported images, and download the processed result.',
    url: 'https://filecompress.app/webp-compressor',
    type: 'website',
  },
};

const WEBP_FAQS = [
  {
    question: 'How do I compress a WebP image online?',
    answer:
      'Drag and drop your WebP images into the FileCompress WebP workspace. Select your preferred compression quality (Balanced 75%, High Fidelity 90%, or Maximum Reduction 55%) or scale dimensions, and download your optimized image instantly.',
  },
  {
    question: 'Does compressing WebP preserve transparent backgrounds?',
    answer:
      'Yes. Our compressor preserves 8-bit alpha transparency channels without converting transparent backgrounds into solid black or white pixels.',
  },
  {
    question: 'What is the difference between lossy and lossless WebP?',
    answer:
      'Lossy WebP uses predictive coding to discard subtle high-frequency color variations invisible to the human eye, yielding 60–80% smaller files. Lossless WebP mathematically reconstructs identical pixel data without any generation loss.',
  },
  {
    question: 'Does this tool support animated WebP files?',
    answer:
      'Animated WebPs can be uploaded and compressed. Because browser canvas encoding produces static WebP frames, animated files will be exported as high-fidelity single images while preserving their alpha channels and dimensions.',
  },
  {
    question: 'Are my images uploaded to an external server?',
    answer:
      'No. FileCompress processes all WebP images locally inside your browser using hardware-accelerated Canvas APIs. Your photos and graphic assets remain strictly private on your device.',
  },
];

export default function WebpCompressorPage() {
  return (
    <>
      <JsonLd data={getSoftwareAppSchema()} />
      <JsonLd data={getFaqSchema(WEBP_FAQS)} />
      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full pb-16">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'WebP Compressor', href: '/webp-compressor' },
          ]}
        />

        {/* Hero Header */}
        <header className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-bold uppercase tracking-wider mb-4">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Modern Next-Gen Image Compression</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Free Online WebP Compressor – <span className="text-blue-600">Reduce WebP Image Size</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Compress your WebP pictures and graphic assets directly in your browser. Dial in custom quality settings, scale resolution, and reduce page weight without sacrificing visual clarity.
          </p>
        </header>

        {/* Workspace */}
        <div className="mb-16">
          <WebpWorkspace />
        </div>

        <div className="max-w-5xl mx-auto mb-16">
          <AdSlot format="horizontal" />
        </div>

        {/* Editorial SEO Content */}
        <article className="prose prose-slate max-w-4xl mx-auto space-y-12 text-slate-700">
          <section className="glass-panel p-8 sm:p-10 rounded-3xl space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Compress WebP Images Online
            </h2>
            <p className="leading-relaxed">
              Google developed the WebP image format to supersede legacy JPEG and PNG formats on the modern web, delivering superior compression efficiency for photos, graphics, and translucent UI elements. Even so, camera exports, high-resolution screenshots, and unoptimized graphic designs in WebP format frequently exceed several megabytes in size.
            </p>
            <p className="leading-relaxed">
              FileCompress WebP Compressor allows web developers, photographers, and content creators to quickly re-encode and optimize WebP files. By fine-tuning quantizer tables and applying proportional downscaling, you achieve substantial byte savings while keeping colors vibrant and lines sharp.
            </p>
          </section>

          <section className="glass-panel p-8 sm:p-10 rounded-3xl space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              How to Reduce WebP File Size
            </h2>
            <ol className="list-decimal pl-6 space-y-2 text-slate-700 font-medium">
              <li>
                <strong>Upload your WebP image:</strong> Drag and drop single or multiple `.webp` files into the upload zone or choose them from your file explorer.
              </li>
              <li>
                <strong>Configure quality and scale:</strong> Choose our Balanced preset (75% quality), Maximum Reduction (55% quality), or set your custom slider.
              </li>
              <li>
                <strong>Client-side optimization:</strong> Your browser decodes and re-compresses the image in real time, computing exact byte savings.
              </li>
              <li>
                <strong>Download optimized WebP:</strong> Inspect the resulting dimensions and file size, then download your optimized picture.
              </li>
            </ol>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-3">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Lossless vs Lossy WebP Compression
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Lossy WebP uses macroblock predictive coding and discrete cosine transform algorithms to eliminate redundant pixel variations, achieving the smallest conceivable payload for photography. Lossless WebP transforms color spaces using entropy coding and spatial prediction, ensuring 100% pixel-for-pixel accuracy.
              </p>
            </div>

            <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-3">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Preserve WebP Transparency
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Unlike older JPEG compressors that lack transparency support, our WebP pipeline handles 8-bit alpha channels seamlessly. Cutout product photos, icons with drop shadows, and interface badges keep transparent backgrounds intact.
              </p>
            </div>
          </div>

          <section className="glass-panel p-8 sm:p-10 rounded-3xl space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Optimise WebP Images for Websites
            </h2>
            <p className="leading-relaxed">
              Serving compressed WebP assets directly correlates with passing Google Core Web Vitals assessments. Reducing hero image weights directly drops Largest Contentful Paint (LCP) times, lowers mobile data consumption, and reduces server egress bandwidth costs.
            </p>
          </section>

          <section className="glass-panel p-8 sm:p-10 rounded-3xl space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Does WebP Support Animation?
            </h2>
            <p className="leading-relaxed">
              Yes, the WebP specification includes an animated container format (utilizing <code>ANIM</code> and <code>ANMF</code> chunks) that provides superior compression compared to legacy GIF files.
            </p>
            <p className="leading-relaxed">
              When processing files in browser canvas environments, re-encoding produces a static WebP image of the initial frame. If you require full multi-frame animated optimization, we clearly notify you in the file queue to ensure you make the right choice for your project.
            </p>
          </section>

          <section className="glass-panel p-8 sm:p-10 rounded-3xl space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Why Is My WebP Image Still Large?
            </h2>
            <p className="leading-relaxed">
              If an image does not compress as much as expected, common reasons include:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600 text-sm">
              <li>
                <strong>Ultra-High Native Resolution:</strong> A 4000x3000px photo requires significant byte allocations even with strong compression. Using our 75% or 50% dimension scaling resolves this immediately.
              </li>
              <li>
                <strong>Already Maximally Compressed:</strong> If the input WebP was already compressed at 50% quality, re-encoding at 80% quality will actually increase file size. FileCompress detects this scenario and flags it honestly.
              </li>
              <li>
                <strong>High Entropy Noise:</strong> Grainy film textures, confetti, and grass foliage contain high entropy that resists simple DCT compression.
              </li>
            </ul>
          </section>

          {/* FAQs */}
          <section className="glass-panel p-8 sm:p-10 rounded-3xl space-y-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <div className="divide-y divide-slate-200/80">
              {WEBP_FAQS.map((faq, idx) => (
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
            currentPath="/webp-compressor"
            title="Related Media Optimization Tools"
            description="Optimize other raster images, vector files, documents, and media formats with our dedicated tools."
          />
        </section>
      </main>
    </>
  );
}
