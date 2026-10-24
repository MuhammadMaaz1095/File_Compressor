import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { RelatedTools } from '@/components/content/RelatedTools';
import { SvgWorkspace } from '@/components/compression/SvgWorkspace';
import { AdSlot } from '@/components/ads/AdSlot';
import { JsonLd, getSoftwareAppSchema, getFaqSchema } from '@/components/seo/JsonLd';
import { CheckCircle2, ShieldCheck, Zap, Layers, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Free SVG Compressor Online – Optimise SVG Files | FileCompress',
  description:
    'Optimise SVG files online with FileCompress. Remove unnecessary SVG markup where safe, reduce file size, and download your optimised vector graphics.',
  alternates: {
    canonical: 'https://filecompress.app/svg-compressor',
  },
  openGraph: {
    title: 'Free SVG Compressor Online – Optimise SVG Files | FileCompress',
    description:
      'Optimise SVG files online with FileCompress. Remove unnecessary SVG markup where safe, reduce file size, and download your optimised vector graphics.',
    url: 'https://filecompress.app/svg-compressor',
    type: 'website',
  },
};

const SVG_FAQS = [
  {
    question: 'How do I compress an SVG online?',
    answer:
      'Drop your SVG files into the FileCompress SVG tool. The browser-native optimizer cleans up redundant XML tags, strips comments and metadata, and rounds coordinate numbers to create a lean, fast-loading vector graphic.',
  },
  {
    question: 'Will optimizing an SVG change its visual appearance?',
    answer:
      'No. The vector shapes, viewBox, paths, gradients, masks, and styling are strictly preserved. Only non-essential metadata, editor comments, empty tags, and excessive floating-point coordinate precision are simplified.',
  },
  {
    question: 'Is it safe to optimize SVG files online with FileCompress?',
    answer:
      'Yes. FileCompress operates 100% client-side inside your browser using Web Standards. Your vectors never touch an external server, and our built-in sanitizer strips dangerous executable scripts and malicious event handlers automatically.',
  },
  {
    question: 'Why is my SVG file still large?',
    answer:
      'SVGs often contain embedded base64 raster images (PNG or JPEG), intricate curves exported with hundreds of thousands of path anchor points, or complex CAD export artifacts. Compressing embedded images or simplifying paths in vector software before optimization is recommended for huge files.',
  },
  {
    question: 'How does SVG optimization improve website speed?',
    answer:
      'Smaller SVG files download quicker, reduce DOM parsing latency, and decrease Cumulative Layout Shift (CLS) and Largest Contentful Paint (LCP) times for web graphics and logos.',
  },
];

export default function SvgCompressorPage() {
  return (
    <>
      <JsonLd data={getSoftwareAppSchema()} />
      <JsonLd data={getFaqSchema(SVG_FAQS)} />
      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full pb-16">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'SVG Compressor', href: '/svg-compressor' },
          ]}
        />

        {/* Hero Header */}
        <header className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Browser-Based Vector Optimization</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Free Online SVG Compressor – <span className="text-blue-600">Reduce SVG File Size</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Optimise your SVG vector graphics instantly in the browser. Remove redundant XML markup, simplify coordinate paths, and shrink file size without altering visual fidelity.
          </p>
        </header>

        {/* Interactive Workspace */}
        <div className="mb-16">
          <SvgWorkspace />
        </div>

        <div className="max-w-5xl mx-auto mb-16">
          <AdSlot format="horizontal" />
        </div>

        {/* Editorial & SEO Content */}
        <article className="prose prose-slate max-w-4xl mx-auto space-y-12 text-slate-700">
          <section className="glass-panel p-8 sm:p-10 rounded-3xl space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Compress SVG Files Online for Free
            </h2>
            <p className="leading-relaxed">
              Scalable Vector Graphics (SVG) are the gold standard for responsive web logos, iconography, and digital UI design. However, vector illustration software like Adobe Illustrator, Inkscape, Sketch, and Figma often export extensive proprietary metadata, editor comments, unnecessary grouping hierarchies, and redundant attributes that increase file weight by up to 70%.
            </p>
            <p className="leading-relaxed">
              FileCompress provides a dedicated online SVG compressor that cleans, minifies, and restructures vector code directly on your device. By applying battle-tested SVGO optimization rules, you get the cleanest possible markup without sacrificing rendering accuracy or quality.
            </p>
          </section>

          <section className="glass-panel p-8 sm:p-10 rounded-3xl space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              How to Optimise an SVG File
            </h2>
            <ol className="list-decimal pl-6 space-y-2 text-slate-700 font-medium">
              <li>
                <strong>Select your SVG:</strong> Drag and drop your `.svg` vector files or click the upload area to choose files from your computer or mobile device.
              </li>
              <li>
                <strong>Choose your optimization level:</strong> Choose between Balanced (ideal for logos with gradient fills), Aggressive (compacts curve coordinates to 2 decimals), or Lossless (removes comments and whitespace only).
              </li>
              <li>
                <strong>Instant in-browser processing:</strong> The optimizer immediately sanitizes the XML, cleans redundant structures, and calculates actual byte savings.
              </li>
              <li>
                <strong>Preview and download:</strong> Inspect the resulting vector preview and download your clean, production-ready SVG file.
              </li>
            </ol>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-3">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                How SVG Optimisation Reduces File Size
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Unlike raster formats like JPEG or PNG that drop pixel information, SVG optimization works through syntactic minification and mathematical curve approximation. Superfluous XML namespaces, hidden elements, empty containers, and redundant path command repetitions are collapsed, dramatically shrinking byte count while retaining perfect geometry.
              </p>
            </div>

            <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-3">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                SVG Compression Without Changing Visual Appearance
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Our engine ensures that essential rendering anchors such as <code>viewBox</code>, stroke attributes, fill definitions, linear and radial gradients, clipping paths, and masking hierarchies remain completely intact. You get a smaller file that looks identical to the original across all modern web browsers.
              </p>
            </div>
          </div>

          <section className="glass-panel p-8 sm:p-10 rounded-3xl space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Optimise SVG Logos and Icons for Websites
            </h2>
            <p className="leading-relaxed">
              When embedding inline SVGs into modern frameworks like Next.js, React, or standard HTML, bloated vector markup increases the overall DOM weight and slows down JavaScript hydration. Optimizing icons and logos cuts initial page weight, accelerates Core Web Vitals (including Largest Contentful Paint and Interaction to Next Paint), and delivers crisp graphics on high-DPI displays.
            </p>
          </section>

          <section className="glass-panel p-8 sm:p-10 rounded-3xl space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Why Is My SVG File Still Large?
            </h2>
            <p className="leading-relaxed">
              If your SVG file remains several hundred kilobytes or megabytes after compression, it almost always stems from one of three causes:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600 text-sm">
              <li>
                <strong>Embedded Base64 Raster Images:</strong> Export tools sometimes embed large PNG or JPEG screenshots inside <code>&lt;image xlink:href=&quot;data:image/png;base64...&quot;&gt;</code> tags instead of using real vectors.
              </li>
              <li>
                <strong>Excessive Anchor Points:</strong> Architectural drawings, CAD exports, or hand-traced scans can generate hundreds of thousands of path coordinates that need path simplification in design software.
              </li>
              <li>
                <strong>Complex Filter Effects:</strong> Heavy Gaussian blur and feTurbulence filters generate immense calculation overhead.
              </li>
            </ul>
          </section>

          <section className="glass-panel p-8 sm:p-10 rounded-3xl space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Is It Safe to Optimise SVG Files Online?
            </h2>
            <p className="leading-relaxed">
              Many online converters upload your files to remote cloud servers, which introduces privacy concerns for proprietary design assets and brand guidelines. Furthermore, raw SVGs can carry malicious scripts (XSS attacks).
            </p>
            <p className="leading-relaxed">
              FileCompress solves both issues: all processing executes 100% locally on your machine via client-side Web Standards, and our parser systematically scrubs any embedded <code>&lt;script&gt;</code> tags, inline event listeners, or untrusted external references.
            </p>
          </section>

          {/* FAQs */}
          <section className="glass-panel p-8 sm:p-10 rounded-3xl space-y-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <div className="divide-y divide-slate-200/80">
              {SVG_FAQS.map((faq, idx) => (
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
            currentPath="/svg-compressor"
            title="Related Media Optimization Tools"
            description="Need to optimise other image, vector, video, audio, or document formats? Explore our specialized tools."
          />
        </section>
      </main>
    </>
  );
}
