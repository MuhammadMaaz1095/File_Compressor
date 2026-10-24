import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { RelatedTools } from '@/components/content/RelatedTools';
import { PowerPointWorkspace } from '@/components/compression/PowerPointWorkspace';
import { AdSlot } from '@/components/ads/AdSlot';
import { JsonLd, getSoftwareAppSchema, getFaqSchema } from '@/components/seo/JsonLd';
import {
  HelpCircle,
  Sliders,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Presentation,
  FileText,
  Zap,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Free PowerPoint Compressor – Reduce PPTX Size | FileCompress',
  description:
    'Reduce PowerPoint presentation file size with FileCompress. Explore supported presentation optimisation and download a processed PPTX when available.',
  alternates: {
    canonical: 'https://filecompress.app/powerpoint-compressor',
  },
  openGraph: {
    title: 'Free PowerPoint Compressor – Reduce PPTX Size | FileCompress',
    description:
      'Reduce PowerPoint presentation file size with FileCompress. Explore supported presentation optimisation and download a processed PPTX when available.',
    url: 'https://filecompress.app/powerpoint-compressor',
    type: 'website',
  },
};

const POWERPOINT_FAQS = [
  {
    question: 'How do I compress a PowerPoint presentation online?',
    answer:
      'Upload your .pptx presentation to FileCompress using the dropzone above, select your desired image optimization preset (e.g. Balanced 75% quality), click Compress PPTX, and download your optimized presentation once processing completes.',
  },
  {
    question: 'Can you compress PowerPoint without losing animations or formatting?',
    answer:
      'Yes, 100%. FileCompress employs presentation-aware OpenXML optimization. We target heavy embedded graphics in ppt/media/ and apply maximum Deflate stream compression. Slide layouts, custom animations, transitions, font settings, master slides, and speaker notes are preserved with bit-for-bit fidelity.',
  },
  {
    question: 'Why is my PowerPoint file so large?',
    answer:
      'Over 90% of massive PowerPoint decks (20 MB to 200 MB) are inflated by uncompressed photos, high-resolution background graphics, and full-screen screen captures pasted directly into slides. PowerPoint embeds raw images without automatic downscaling.',
  },
  {
    question: 'Does FileCompress support legacy .ppt or macro-enabled .pptm files?',
    answer:
      'FileCompress supports modern standard PowerPoint presentations (.pptx). Legacy binary files (.ppt) from PowerPoint 97-2003 and macro-enabled files (.pptm) are excluded to ensure presentations remain secure and uncorrupted.',
  },
  {
    question: 'How does FileCompress reduce image sizes inside PowerPoint?',
    answer:
      'Presentations store graphic media in the internal ppt/media/ folder. FileCompress scans this folder, calculates whether images exceed standard HD or 2K display resolutions, re-quantizes the image data, and repackages the presentation with synchronized relationship IDs.',
  },
  {
    question: 'Is it safe to compress confidential business pitch decks on FileCompress?',
    answer:
      'Yes, completely private and secure. All processing occurs locally in your client web browser via JavaScript and WebAssembly. Your slide decks, confidential strategic plans, and proprietary diagrams never touch our servers.',
  },
  {
    question: 'Why did my PowerPoint deck size barely change after compression?',
    answer:
      'If your presentation consists almost entirely of text, standard shapes, and smart art with no embedded bitmap photography, it is already tightly compressed by PowerPoint. Without large embedded photos, additional byte savings are minimal.',
  },
  {
    question: 'Will the compressed presentation work in PowerPoint, Google Slides, and Keynote?',
    answer:
      'Yes. The output conforms strictly to ECMA-376 PresentationML standards, ensuring native playback in Microsoft PowerPoint (Windows, Mac, iOS, Android, Web), Google Slides, Apple Keynote, and LibreOffice Impress.',
  },
];

export default function PowerPointCompressorPage() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Document Compressor', href: '/how-to-compress-files' },
    { label: 'PowerPoint Compressor', href: '/powerpoint-compressor' },
  ];

  const appSchema = getSoftwareAppSchema();
  const faqSchema = getFaqSchema(POWERPOINT_FAQS);

  return (
    <div className="min-h-screen py-8 sm:py-12 bg-pattern">
      <JsonLd data={appSchema} />
      <JsonLd data={faqSchema} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <Breadcrumbs items={breadcrumbItems} />

        {/* Hero Section */}
        <section className="text-center space-y-4 max-w-3xl mx-auto pt-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-200/80 text-orange-800 text-xs font-semibold shadow-xs">
            <Presentation className="w-3.5 h-3.5 text-orange-600" />
            <span>Presentation-Aware OpenXML Engine</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Free Online PowerPoint Compressor – Reduce PPTX File Size
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Reduce oversized Microsoft PowerPoint (.pptx) presentation decks online without losing
            slide formatting. Recompress embedded slide imagery, optimize package streams, and preserve
            100% of animations, transitions, and speaker notes with private client-side processing.
          </p>
        </section>

        {/* Interactive Workspace */}
        <section aria-label="PowerPoint Compression Tool">
          <PowerPointWorkspace />
        </section>

        {/* Ad Placement */}
        <AdSlot slotId="powerpoint-compressor-mid" format="horizontal" />

        {/* Comprehensive SEO Content Section */}
        <article className="glass-panel-elevated p-8 sm:p-12 rounded-3xl space-y-12 text-slate-700 leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              How to Compress a PowerPoint Presentation
            </h2>
            <p>
              Sales pitch decks, conference slide presentations, and academic lecture slides frequently
              balloon into massive 50 MB to 100 MB files. These colossal presentation files fail email
              attachment size limits (typically 20 MB or 25 MB on Gmail and Outlook), choke conference
              Wi-Fi networks during uploads, and cause projector lag during critical meetings.
            </p>
            <p>
              Compressing a PowerPoint file safely requires presentation-aware optimization. A modern
              <code>.pptx</code> file is an Open Packaging Conventions (OPC) package containing slide XML,
              layout masters, embedded audio/video, and bitmap graphics.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="p-5 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs space-y-2">
                <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-800 font-bold flex items-center justify-center text-sm">
                  1
                </div>
                <h3 className="font-bold text-slate-900 text-base">Select Your PPTX</h3>
                <p className="text-xs text-slate-600">
                  Upload your presentation. FileCompress inspects the internal slide relationships and
                  identifies oversized media in <code>ppt/media/</code>.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs space-y-2">
                <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-800 font-bold flex items-center justify-center text-sm">
                  2
                </div>
                <h3 className="font-bold text-slate-900 text-base">Recompress Slide Graphics</h3>
                <p className="text-xs text-slate-600">
                  High-resolution photos and background textures are downscaled to presentation display
                  resolutions and recompressed while preserving exact drawing bounds.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs space-y-2">
                <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-800 font-bold flex items-center justify-center text-sm">
                  3
                </div>
                <h3 className="font-bold text-slate-900 text-base">Download Verified Deck</h3>
                <p className="text-xs text-slate-600">
                  The package is generated with maximum Deflate level 9 compression and verified for
                  PresentationML schema integrity before download.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              How PPTX Compression Works
            </h2>
            <p>
              Generic file compression utilities often attempt to compress PPTX files by applying
              destructive generic ZIP routines. This frequently corrupts the critical relationship maps
              in <code>ppt/slides/_rels/slide1.xml.rels</code>, breaking image references and causing
              PowerPoint to display a blank white box with a red &quot;X&quot; in place of your pictures.
            </p>
            <p>
              FileCompress uses <strong>presentation-aware optimization</strong> based on the ECMA-376
              standard:
            </p>
            <ul className="space-y-2 list-disc list-inside text-sm">
              <li>
                <strong>Synchronized Media Replacement:</strong> Recompressed image files replace the
                original assets in <code>ppt/media/</code> under identical filenames, maintaining
                100% relationship integrity.
              </li>
              <li>
                <strong>Slide Hierarchy Preservation:</strong> Slide order, slide masters
                (<code>ppt/slideMasters/</code>), and theme XML definitions remain completely untouched.
              </li>
              <li>
                <strong>Animation & Transition Safety:</strong> Timeline animations (<code>&lt;p:cTn&gt;</code>)
                and slide transitions remain fully functional.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Reduce Image Size in PowerPoint Presentations
            </h2>
            <p>
              Modern smartphone cameras capture photographs at 48 megapixels, and desktop screenshots on
              high-DPI 4K monitors consume 15 to 25 megabytes per image. When these pictures are dragged
              onto a PowerPoint slide and resized with your mouse, PowerPoint does not alter the underlying
              image; it displays the image in a smaller bounding box while storing the massive 48 MP file
              inside the presentation archive.
            </p>
            <p>
              FileCompress scans the <code>ppt/media/</code> library and downscales images that exceed
              1080p or 2K projector capabilities, easily reducing an unwieldy 85 MB deck down to a nimble
              8 MB file that sends instantly via email.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Optimise Large PowerPoint Presentations
            </h2>
            <p>
              In addition to using FileCompress, consider these practical presentation-building habits:
            </p>
            <ul className="space-y-2 list-disc list-inside text-sm">
              <li>
                <strong>Compress Media Inside PowerPoint:</strong> On Windows, go to{' '}
                <em>File &gt; Info &gt; Compress Media</em> to transcode embedded video clips into 1080p
                or 720p MP4 format.
              </li>
              <li>
                <strong>Discard Cropped Areas of Pictures:</strong> When you crop a photo in PowerPoint,
                the cropped-out area is retained by default. Select an image, navigate to{' '}
                <em>Picture Format &gt; Compress Pictures</em>, and check &quot;Delete cropped areas of
                pictures&quot;.
              </li>
              <li>
                <strong>Link Large Video Files:</strong> For massive 4K demonstration videos, consider
                streaming them from YouTube or Vimeo rather than embedding the raw video file directly.
              </li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Why Is My PowerPoint File Still Large?
            </h2>
            <p>
              If your presentation remains large after image optimization, check for these common causes:
            </p>
            <ul className="space-y-2 list-disc list-inside text-sm">
              <li>
                <strong>Embedded Video & Audio:</strong> Embedded <code>.mp4</code> or <code>.wav</code> files
                stored in <code>ppt/media/</code> can easily take 100+ megabytes. Image optimization
                does not re-encode video tracks.
              </li>
              <li>
                <strong>Embedded Excel Spreadsheets:</strong> Double-clicking an embedded table can embed
                an entire 30 MB Excel workbook inside the presentation package.
              </li>
              <li>
                <strong>Embedded Fonts:</strong> Presentations that embed full TrueType/OpenType font
                families carry several megabytes of font binary data.
              </li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Can You Compress PowerPoint Without Losing Quality?
            </h2>
            <p>
              Yes. Slide presentations are displayed on computer screens or conference room projectors,
              which typically resolve 1920×1080 (Full HD) or 3840×2160 (4K). A photograph with 8000×6000
              resolution provides zero visible benefit on a 1080p display while consuming 10× more memory.
            </p>
            <p>
              By optimizing image pixel density to match actual presentation display hardware, you achieve
              massive byte reduction with 100% visual fidelity for your audience.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Safe Handling of PowerPoint Files
            </h2>
            <p>
              Slide decks frequently contain proprietary corporate strategy, unannounced product designs,
              and confidential financial forecasts.
            </p>
            <div className="p-5 rounded-2xl bg-orange-50 border border-orange-200/80 text-orange-950 text-sm space-y-2">
              <div className="flex items-center gap-2 font-bold text-orange-900">
                <ShieldCheck className="w-5 h-5 text-orange-700" />
                <span>100% In-Browser Privacy & Zero Server Uploads</span>
              </div>
              <p>
                FileCompress performs all presentation unpacking, image optimization, and repacking
                entirely in local client memory. Your presentation slides never leave your machine.
              </p>
            </div>
          </section>

          {/* FAQs Section */}
          <section className="space-y-6 pt-4 border-t border-slate-200/80">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-orange-600" />
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-4">
              {POWERPOINT_FAQS.map((faq, index) => (
                <details
                  key={index}
                  className="group rounded-2xl border border-slate-200 bg-white/70 p-5 transition-all open:bg-white open:shadow-xs"
                >
                  <summary className="flex cursor-pointer items-center justify-between font-bold text-slate-900 text-sm sm:text-base">
                    <span>{faq.question}</span>
                    <span className="ml-4 text-orange-600 transition-transform group-open:rotate-180">
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
        <RelatedTools currentPath="/powerpoint-compressor" />
      </div>
    </div>
  );
}
