import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Image as ImageIcon,
  Sparkles,
  Sliders,
  Check,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Lock,
  Scale,
  FileText,
  Globe,
  HardDrive,
  Layers,
  Maximize2,
  Eye,
  Info,
  Film,
  Music,
  FolderArchive,
} from 'lucide-react';
import { ToolWorkspace } from '@/components/compression/ToolWorkspace';
import { AdSlot } from '@/components/ads/AdSlot';
import { JsonLd, getSoftwareAppSchema, getFaqSchema } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Free Online Image Compressor – Reduce Image Size | FileCompress',
  description:
    'Compress images online with FileCompress. Reduce image file size, learn about JPG, PNG and WebP compression, and make images smaller for websites, email and sharing.',
  alternates: {
    canonical: 'https://filecompress.app/image-compressor',
  },
  openGraph: {
    title: 'Free Online Image Compressor – Reduce Image Size Easily | FileCompress',
    description:
      'Compress images online with FileCompress. Reduce image file size, learn about JPG, PNG and WebP compression, and make images smaller for websites, email and sharing.',
    url: 'https://filecompress.app/image-compressor',
    type: 'website',
  },
};

const IMAGE_FAQS = [
  {
    question: 'What is the best free online image compressor?',
    answer:
      'The best image compressor depends on the formats you use, the amount of control you need, the output quality and the service\'s privacy practices. Choose a tool that supports your files, reports the result accurately and allows you to review the compressed image before using it. FileCompress provides zero-upload browser processing, interactive split-slider visual comparison, and granular quality and dimension controls.',
  },
  {
    question: 'How can I compress an image online for free?',
    answer:
      'Select a supported image using our upload area, choose your preferred preset (Balanced, Smaller File, or Custom Settings), click Compress, review the output size and visual appearance in the preview modal, and download the result. Check the tool\'s current limits and available settings before processing.',
  },
  {
    question: 'How do I reduce image file size without losing quality?',
    answer:
      'Try a suitable lossless method when preserving encoded image information is essential. For other images, carefully selected lossy compression may produce a smaller file with little noticeable visual change. Results vary depending on color depth and texture, so inspect the output with our interactive comparison slider rather than assuming quality will remain identical.',
  },
  {
    question: 'Can I compress JPG images online?',
    answer:
      'Yes, FileCompress natively supports JPG and JPEG files in the browser. Compression reduces photographic file size by optimizing discrete cosine transform (DCT) quantization tables, but stronger lossy settings may introduce compression artifacts. Always compare the output with the original.',
  },
  {
    question: 'How can I reduce PNG file size?',
    answer:
      'Use a compatible PNG optimization method and check whether the image dimensions are larger than necessary. PNG compression preserves exact alpha transparency and sharp text lines. Converting high-resolution PNG photos to modern WebP can achieve up to 70%+ file-size reduction while maintaining visual quality.',
  },
  {
    question: 'Can I compress WebP images?',
    answer:
      'You can compress WebP files directly with FileCompress. WebP delivers both advanced lossy predictive encoding and lossless compression. Review the output and confirm that the format is accepted by the website, CMS, or application where you intend to use it.',
  },
  {
    question: 'Can I compress an image to exactly 100 KB?',
    answer:
      'That depends on the original image dimensions and content. By opening our Custom Options panel and adjusting the quality slider alongside maximum pixel width or height, you can target specific file-size thresholds like 100 KB, 200 KB, or 500 KB while retaining acceptable visual clarity.',
  },
  {
    question: 'Does compressing an image reduce its dimensions?',
    answer:
      'Not necessarily. Compression primarily changes how pixel data is encoded and stored without altering its width and height. Resizing changes the pixel dimensions directly. FileCompress allows you to do pure compression, pure resizing, or both simultaneously.',
  },
  {
    question: 'Does image compression improve website SEO?',
    answer:
      'Image compression reduces total page weight and supports a faster, more responsive loading experience, which directly improves Core Web Vitals like Largest Contentful Paint (LCP). While it does not guarantee higher search rankings on its own, efficient media delivery is a fundamental technical SEO best practice.',
  },
  {
    question: 'Can I compress multiple images at once?',
    answer:
      'Yes! FileCompress allows you to drop multiple images simultaneously into the upload workspace. Each image is processed locally in parallel or sequentially according to your browser hardware, and you can download files individually or bundle all outputs into a single ZIP archive.',
  },
  {
    question: 'Does FileCompress support every image format?',
    answer:
      'No tool should claim universal support without testing. FileCompress directly processes JPEG, PNG, and WebP natively via HTML5 Canvas and OffscreenCanvas. Specialized vector formats like SVG or animated formats like GIF require dedicated workflows, which are explained in detail below.',
  },
  {
    question: 'Is an online image compressor suitable for private photos?',
    answer:
      'Suitability depends entirely on how the service processes files. FileCompress operates 100% locally on your device browser using client-side JavaScript and Canvas APIs. Your photos and metadata are never uploaded to any remote server or cloud database, making it safe for confidential and personal pictures.',
  },
];

export default function ImageCompressorPage() {
  return (
    <>
      <JsonLd data={getSoftwareAppSchema()} />
      <JsonLd data={getFaqSchema(IMAGE_FAQS)} />

      <main className="flex-1 pb-16">
        {/* ============================================================ */}
        {/* HERO SECTION WITH BREADCRUMB & TOOL WORKSPACE */}
        {/* ============================================================ */}
        <section className="relative pt-8 pb-12 sm:pt-12 sm:pb-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Breadcrumb Navigation */}
            <nav className="flex justify-center items-center gap-2 text-xs text-slate-500 mb-5" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
              <span>/</span>
              <span className="text-slate-800 font-semibold">Image Compressor</span>
            </nav>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold mb-4 shadow-2xs">
              <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
              <span>JPG, PNG &amp; WebP Optimizer &bull; 100% On-Device Privacy</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto">
              Free Online <span className="text-blue-600">Image Compressor</span> – Reduce Image Size Easily
            </h1>

            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Images are an essential part of modern websites, blogs, online shops, documents, and social media. 
              Reduce image file sizes with precision quality sliders, dimension resizing, and side-by-side visual comparison preview directly in your browser.
            </p>

            {/* Practical feature badges */}
            <div className="mt-5 flex flex-wrap justify-center items-center gap-3 sm:gap-6 text-xs text-slate-600">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Zero server uploads (100% private)</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-blue-600" />
                <span>Custom quality &amp; dimension controls</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-indigo-600" />
                <span>Interactive before &amp; after preview</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Instant on-device download</span>
              </span>
            </div>

            {/* Direct Tool Workspace */}
            <div className="mt-8 text-left">
              <ToolWorkspace category="image" />
            </div>
          </div>
        </section>

        {/* Ad Placement */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <AdSlot format="horizontal" />
        </div>

        {/* ============================================================ */}
        {/* COMPREHENSIVE 3,000+ WORD SEO ARTICLE CONTENT */}
        {/* ============================================================ */}
        <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 text-slate-700 leading-relaxed">

          {/* Section 1: Introduction & What Is an Online Image Compressor */}
          <section className="space-y-6">
            <div className="border-l-4 border-blue-600 pl-4 sm:pl-6 py-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                What Is a Free Online Image Compressor?
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Understanding how modern browser-based image reduction algorithms make pictures smaller, faster to share, and lighter to store.
              </p>
            </div>

            <p>
              Images are an essential part of modern websites, blogs, online shops, documents, and social media. 
              They help communicate complex information at a glance, make editorial content more engaging, and allow photographers, businesses, 
              and creators to share visual experiences with their audience. However, uncompressed image files straight from modern digital cameras, 
              smartphones, and graphic design software can be massive—often ranging from 3 MB to over 25 MB per photograph. These large files take significantly 
              longer to upload, consume valuable cloud and disk storage space, and dramatically increase the amount of network data visitors need to download 
              when opening a web page or viewing an email attachment.
            </p>

            <p>
              A <strong>free online image compressor</strong> solves this challenge by reducing the file size of supported image formats through a clean, 
              browser-accessible interface. Instead of requiring users to buy, install, and configure heavy desktop editing software like Adobe Photoshop, 
              GIMP, or command-line scripts for a routine task, an online image compressor allows you to select a photograph or graphic, adjust compression 
              parameters, and instantly receive a lightweight, optimized file.
            </p>

            <p>
              The fundamental purpose of an <strong>image compressor</strong> is to make an image file smaller while keeping it completely useful and visually 
              appealing for its intended application. A hero banner on an eCommerce homepage may need to load in under a second on mobile 4G networks; 
              a PDF report attachment might need to remain under strict 10 MB corporate email limits; an online job portal or passport visa submission may 
              demand images strictly under 200 KB; and a product photograph must preserve crisp edges and accurate color fidelity so prospective customers 
              can zoom in and inspect fine textures.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 not-prose my-6">
              <div className="glass-card-3d p-5 rounded-2xl border-slate-200/90">
                <div className="flex items-center gap-2 mb-2 text-blue-700 font-bold text-sm">
                  <Maximize2 className="w-4 h-4" />
                  <span>Pixel Dimensions vs. Encoded Byte Size</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Image compression does not always require changing an image&apos;s pixel dimensions (width and height). A photograph can retain its exact 
                  4000 &times; 3000 resolution while its byte size drops from 8 MB to 1.2 MB through smarter discrete cosine transform (DCT) quantization 
                  and metadata stripping. If the resolution itself is unnecessarily high for its display container, resizing the dimensions provides an 
                  additional tier of massive savings.
                </p>
              </div>

              <div className="glass-card-3d p-5 rounded-2xl border-slate-200/90">
                <div className="flex items-center gap-2 mb-2 text-indigo-700 font-bold text-sm">
                  <Globe className="w-4 h-4" />
                  <span>Solving Common Practical User Needs</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Whether users search for an <strong>image compressor</strong>, <strong>online image compressor</strong>, <strong>free image compressor</strong>, 
                  or <strong>image size reducer</strong>, they share the same practical goal: making pictures easier to publish, upload, share, or store. 
                  FileCompress provides a unified tool capable of handling everyday photographs, screenshots, transparent graphics, and web assets with truthful, 
                  accurate size reporting.
                </p>
              </div>
            </div>

            <p>
              The optimal compression approach always depends on the specific image. A high-contrast photograph of a sunset, a UI screenshot containing 
              small typography, a transparent company logo, and an architectural vector illustration store drastically different visual data. Choosing an 
              appropriate format and compression method allows you to produce the smallest possible file without sacrificing more perceptual quality than necessary.
            </p>
          </section>

          {/* Section 2: Compress Images Online with FileCompress */}
          <section className="space-y-6">
            <div className="border-l-4 border-blue-600 pl-4 sm:pl-6 py-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Compress Images Online with FileCompress
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                A streamlined, privacy-conscious workflow designed for everyday creators, web developers, and professional teams.
              </p>
            </div>

            <p>
              When you need to compress images online, a straightforward, reliable workflow saves valuable time and eliminates guesswork. 
              FileCompress is engineered to help users process supported image formats through an intuitive, four-stage journey: select your images, 
              choose preset or custom compression settings, inspect the result side-by-side with original media, and download your optimized files individually 
              or bundled in a ZIP archive.
            </p>

            <p>
              An online image compressor is invaluable for a wide range of daily workflows:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 not-prose my-6">
              <div className="glass-card-3d p-4 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs mb-2">
                  01
                </div>
                <h4 className="text-xs font-bold text-slate-900 mb-1">Websites &amp; Blogs</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Speed up page load times, improve Core Web Vitals, and reduce mobile bandwidth consumption across responsive layouts.
                </p>
              </div>

              <div className="glass-card-3d p-4 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs mb-2">
                  02
                </div>
                <h4 className="text-xs font-bold text-slate-900 mb-1">Email &amp; Messaging</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Fit multiple photos under strict 20 MB email attachment ceilings and share pictures swiftly over instant messaging apps.
                </p>
              </div>

              <div className="glass-card-3d p-4 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs mb-2">
                  03
                </div>
                <h4 className="text-xs font-bold text-slate-900 mb-1">Online Forms &amp; Visas</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Satisfy strict 100 KB, 200 KB, or 500 KB submission limits for university portals, government IDs, and job applications.
                </p>
              </div>

              <div className="glass-card-3d p-4 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs mb-2">
                  04
                </div>
                <h4 className="text-xs font-bold text-slate-900 mb-1">Storage Optimization</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Reclaim gigabytes of space on your local hard drive, cloud backup, or mobile gallery without losing memorable photos.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/90 text-xs text-amber-900 flex items-start gap-3">
              <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold">Golden Rule for Image Compression:</strong> Always keep an uncompressed master copy of your original photographs. 
                Applying lossy compression permanently discards fine high-frequency pixel data. By retaining your raw or high-res source files, you can 
                always re-export or re-compress images in the future should your display requirements or destination specifications change.
              </div>
            </div>
          </section>

          {/* Section 3: Step-by-Step Guide */}
          <section className="space-y-6">
            <div className="border-l-4 border-blue-600 pl-4 sm:pl-6 py-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                How to Compress an Image Online
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                A simple, transparent 4-step workflow designed to deliver predictable, high-quality results every single time.
              </p>
            </div>

            <p>
              Reducing image file sizes should never be intimidating or require complicated software menus. By following these four steps, 
              you can achieve optimal file-size savings while maintaining full control over perceptual image fidelity:
            </p>

            <div className="space-y-4 not-prose">
              {/* Step 1 */}
              <div className="glass-card-3d p-6 rounded-2xl flex flex-col md:flex-row gap-5 items-start">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-md shadow-blue-500/30">
                  1
                </div>
                <div className="space-y-2 flex-1">
                  <h3 className="text-base font-bold text-slate-900">Step 1: Select the Image You Want to Compress</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Choose one or more image files from your computer, tablet, or phone using the drag-and-drop workspace or by clicking <strong>Browse Files</strong>. 
                    Before selecting your files, confirm that they are in supported raster formats (JPEG/JPG, PNG, or WebP) and fall within the 100 MB per-file workspace limit. 
                    Consider the purpose of the image: a hero landscape photo can tolerate different settings than a technical screenshot containing tiny code or text.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="glass-card-3d p-6 rounded-2xl flex flex-col md:flex-row gap-5 items-start">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-md shadow-blue-500/30">
                  2
                </div>
                <div className="space-y-2 flex-1">
                  <h3 className="text-base font-bold text-slate-900">Step 2: Choose Presets or Customize Quality Settings</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Select your preferred compression profile from our quick presets—<strong>Balanced</strong> (recommended for everyday photos and web graphics), 
                    <strong>Smaller File</strong> (more aggressive reduction for tight email or upload quotas), or <strong>High Quality</strong> (gentle compression for portfolios). 
                    Alternatively, open the <strong>Custom Options</strong> panel to manually drag the quality slider from 10% to 100%, set maximum width or height pixel constraints, 
                    or convert between formats (e.g., converting a PNG to modern WebP).
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="glass-card-3d p-6 rounded-2xl flex flex-col md:flex-row gap-5 items-start">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-md shadow-blue-500/30">
                  3
                </div>
                <div className="space-y-2 flex-1">
                  <h3 className="text-base font-bold text-slate-900">Step 3: Review the Compressed Image Side-by-Side</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Click <strong>Compress</strong>. Once local processing finishes, inspect the exact file sizes and reduction percentages calculated by our engine. 
                    Click the <strong>Eye icon</strong> next to any processed image to open the interactive split-slider comparison modal. Slide back and forth to inspect fine text, 
                    edge sharpness, color gradients, skin tones, and transparent areas to verify that no objectionable artifacts were introduced.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="glass-card-3d p-6 rounded-2xl flex flex-col md:flex-row gap-5 items-start">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-md shadow-blue-500/30">
                  4
                </div>
                <div className="space-y-2 flex-1">
                  <h3 className="text-base font-bold text-slate-900">Step 4: Download the Result Instantly</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    When the output satisfies your visual and file-size requirements, click <strong>Download</strong> to save the optimized file directly to your device. 
                    If you processed a batch of multiple images, click <strong>Download All (.ZIP)</strong> to save every optimized file neatly packaged in a single archive. 
                    If an image remains too large or displays visible softening, simply adjust your settings and re-run compression from your untouched original file.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Reduce Image Size Without Unnecessary Quality Loss */}
          <section className="space-y-6">
            <div className="border-l-4 border-blue-600 pl-4 sm:pl-6 py-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Reduce Image Size Without Unnecessary Quality Loss
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Finding the sweet spot between low byte weight and stunning visual fidelity.
              </p>
            </div>

            <p>
              One of the most frequent objectives when searching for an image compressor is to <strong>compress an image without losing quality</strong>. 
              To achieve this balance, it helps to understand how compression engines evaluate visual data. Human eyes are exceptionally sensitive to changes 
              in luminance (brightness and fine edges), but far less sensitive to subtle shifts in chrominance (color nuance across smooth gradients). Modern lossy 
              compression formats exploit this biological trait to discard imperceptible color frequencies while preserving critical edge definition.
            </p>

            <h3 className="text-lg font-bold text-slate-900">Key Factors That Determine Compression Savings</h3>
            <p>
              No compression tool can guarantee an identical percentage savings across every single file. How much an image shrinks depends on six fundamental factors:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 not-prose my-6">
              <div className="glass-card-3d p-5 rounded-2xl">
                <div className="flex items-center gap-2 mb-2 text-blue-600 font-bold text-xs uppercase tracking-wider">
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>1. Image Dimensions</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  A 24-megapixel photo (6000 &times; 4000) contains 24 million pixels. If your blog displays images at a maximum width of 1200 pixels, 
                  resizing before or during compression eliminates over 90% of unnecessary pixel payload.
                </p>
              </div>

              <div className="glass-card-3d p-5 rounded-2xl">
                <div className="flex items-center gap-2 mb-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
                  <Layers className="w-3.5 h-3.5" />
                  <span>2. Image Content &amp; Noise</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Smooth blue skies, studio portraits, and simple vector logos compress exceptionally well. High-ISO camera grain, grass fields, 
                  and intricate textures contain chaotic entropy that requires more bytes to encode.
                </p>
              </div>

              <div className="glass-card-3d p-5 rounded-2xl">
                <div className="flex items-center gap-2 mb-2 text-emerald-600 font-bold text-xs uppercase tracking-wider">
                  <FileText className="w-3.5 h-3.5" />
                  <span>3. File Format Container</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  JPEG, PNG, and WebP use distinct mathematical transformations. Saving a continuous-tone photograph as a PNG leads to bloated files, 
                  whereas converting it to WebP yields dramatic size reductions.
                </p>
              </div>

              <div className="glass-card-3d p-5 rounded-2xl">
                <div className="flex items-center gap-2 mb-2 text-amber-600 font-bold text-xs uppercase tracking-wider">
                  <Sliders className="w-3.5 h-3.5" />
                  <span>4. Compression Settings</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Setting quality to 80%–85% often cuts file size by half with virtually zero discernible visual difference, while dropping below 50% 
                  may introduce blocking artifacts around sharp lines.
                </p>
              </div>

              <div className="glass-card-3d p-5 rounded-2xl">
                <div className="flex items-center gap-2 mb-2 text-purple-600 font-bold text-xs uppercase tracking-wider">
                  <Scale className="w-3.5 h-3.5" />
                  <span>5. Color Depth &amp; Alpha</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Images with 32-bit truecolor and transparent alpha channels require 4 bytes per pixel uncompressed. Stripping transparency when not needed 
                  or optimizing the palette yields significant gains.
                </p>
              </div>

              <div className="glass-card-3d p-5 rounded-2xl">
                <div className="flex items-center gap-2 mb-2 text-rose-600 font-bold text-xs uppercase tracking-wider">
                  <HardDrive className="w-3.5 h-3.5" />
                  <span>6. Pre-existing Optimization</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  An image already heavily compressed by social media or WordPress plugins has little redundant data left. Forcing further compression 
                  may reduce quality without meaningful byte savings.
                </p>
              </div>
            </div>
          </section>

          {/* Section 5: Format-Specific Guides */}
          <section className="space-y-10">
            <div className="border-l-4 border-blue-600 pl-4 sm:pl-6 py-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Format-Specific Image Compression Guides
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Deep dive into JPEG, PNG, WebP, GIF, SVG, TIFF, AVIF, and HEIC characteristics and optimization strategies.
              </p>
            </div>

            {/* JPEG */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-800 text-xs font-mono">JPG / JPEG</span>
                <span>Compress JPG and JPEG Images Online</span>
              </h3>
              <p>
                JPG and JPEG refer to the same standardized image specification created by the Joint Photographic Experts Group. 
                It remains the most ubiquitous format in digital photography, smartphones, stock libraries, and online publishing. 
                JPEG relies on lossy discrete cosine transform (DCT) compression, dividing the image into 8 &times; 8 pixel blocks and quantizing high-frequency color variations.
              </p>
              <p>
                If you need to <strong>compress JPG online</strong> or use a <strong>JPG size reducer</strong>, the key is choosing an appropriate quality factor. 
                Setting JPEG quality to 75%–85% provides a superb balance, reducing camera files by 60% to 80% while retaining sharp facial features, product textures, 
                and natural landscapes. However, avoid repeated editing and saving: each time a lossy JPEG is re-encoded, generational loss accumulates, 
                gradually introducing ringing artifacts and blockiness. Always work from your uncompressed source image.
              </p>
            </div>

            {/* PNG */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-indigo-100 text-indigo-800 text-xs font-mono">PNG</span>
                <span>Compress PNG Images and Reduce PNG File Size</span>
              </h3>
              <p>
                Portable Network Graphics (PNG) was created as an open-source, patent-free replacement for GIF. It is the premier raster format for user interface mockups, 
                software screenshots, charts, diagrams, logos, and graphics requiring transparent backgrounds. PNG uses lossless DEFLATE compression (a combination of LZ77 and Huffman coding), 
                ensuring that every single pixel is reconstructed with mathematical precision upon decoding.
              </p>
              <p>
                To <strong>reduce PNG file size</strong>, evaluate whether the image is genuinely a graphic or an incorrectly saved photograph. 
                Photographs saved as PNG are needlessly huge because lossless algorithms cannot efficiently represent continuous organic color variations. 
                For true graphics and screenshots, removing unnecessary ancillary chunks (EXIF metadata, color profiles) and resizing dimensions makes PNG files significantly lighter. 
                For photographs with transparency, converting to modern WebP often cuts file weight by over 70% while keeping alpha transparency perfectly intact.
              </p>
            </div>

            {/* WebP */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-xs font-mono">WebP</span>
                <span>Compress WebP Images for Modern Web Performance</span>
              </h3>
              <p>
                Developed by Google and now universally supported across Chrome, Safari, Firefox, Edge, and modern mobile browsers, WebP is the modern standard for web imagery. 
                It supports both lossy predictive coding (derived from the VP8 video codec) and lossless compression, alongside full 8-bit alpha transparency. 
                According to Google performance studies, WebP lossy images are 25% to 34% smaller than comparable JPEGs at equivalent structural similarity (SSIM) visual quality.
              </p>
              <p>
                A <strong>WebP compressor</strong> allows you to optimize existing WebP files or convert heavy PNGs and JPEGs into modern WebP format. 
                Delivering WebP images to your website visitors dramatically decreases total page byte weight, speeds up mobile rendering, and reduces CDN bandwidth expenses.
              </p>
            </div>

            {/* Educational: GIF, SVG, TIFF, AVIF, HEIC */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">
                Additional Image Formats &amp; Educational Considerations
              </h3>
              <p className="text-sm text-slate-600">
                While FileCompress specializes natively in JPEG, PNG, and WebP, understanding other formats helps you choose the best tool for every workflow:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
                <div className="glass-card-3d p-4 rounded-xl">
                  <h4 className="text-xs font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                    <Film className="w-3.5 h-3.5 text-blue-600" />
                    <span>GIF Images (Static &amp; Animated)</span>
                  </h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    GIF is restricted to a 256-color palette. For animated clips, compressing frames and reducing dimensions helps, but converting animation loops 
                    to modern MP4 or WebM video format yields up to 90% file-size savings with superior fluidity.
                  </p>
                </div>

                <div className="glass-card-3d p-4 rounded-xl">
                  <h4 className="text-xs font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-purple-600" />
                    <span>SVG &amp; Vector Graphics</span>
                  </h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    SVG is an XML-based vector specification, not a pixel raster. Optimizing SVG requires minifying XML tags, cleaning metadata, and rounding coordinate decimals 
                    using specialized tools like SVGO rather than canvas raster compressors.
                  </p>
                </div>

                <div className="glass-card-3d p-4 rounded-xl">
                  <h4 className="text-xs font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-amber-600" />
                    <span>TIFF (Print &amp; Archival)</span>
                  </h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Common in professional publishing and scanning workflows, TIFF stores uncompressed or LZW-compressed raster data with extensive metadata. 
                    Before sharing online or emailing, converting TIFF files to high-quality JPEG or WebP reduces file size by over 90%.
                  </p>
                </div>

                <div className="glass-card-3d p-4 rounded-xl">
                  <h4 className="text-xs font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>AVIF &amp; HEIC (Next-Gen Formats)</span>
                  </h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    AVIF (AV1-based) and HEIC (High Efficiency Image Coding used by Apple iOS) offer remarkable compression efficiency. 
                    However, cross-platform and older software compatibility varies; converting to universal WebP or JPEG ensures universal recipient accessibility.
                  </p>
                </div>
              </div>
            </div>

            {/* Summary Comparison Table */}
            <div className="overflow-x-auto not-prose my-6">
              <table className="w-full text-xs text-left border-collapse bg-white rounded-xl shadow-2xs overflow-hidden border border-slate-200">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Format</th>
                    <th className="py-3 px-4">Compression Type</th>
                    <th className="py-3 px-4">Transparency</th>
                    <th className="py-3 px-4">Primary Ideal Use Case</th>
                    <th className="py-3 px-4">FileCompress Support</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-bold text-slate-900">JPEG / JPG</td>
                    <td className="py-3 px-4">Lossy (DCT Quantization)</td>
                    <td className="py-3 px-4 text-slate-400">No (Opaque)</td>
                    <td className="py-3 px-4">Real-world photos, portraits, landscapes</td>
                    <td className="py-3 px-4 font-semibold text-emerald-700">Native Browser Canvas</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-bold text-slate-900">PNG</td>
                    <td className="py-3 px-4">Lossless (DEFLATE / LZ77)</td>
                    <td className="py-3 px-4 text-emerald-700 font-semibold">Yes (Full Alpha)</td>
                    <td className="py-3 px-4">Logos, UI graphics, text screenshots</td>
                    <td className="py-3 px-4 font-semibold text-emerald-700">Native Browser Canvas</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-bold text-slate-900">WebP</td>
                    <td className="py-3 px-4">Lossy &amp; Lossless (VP8)</td>
                    <td className="py-3 px-4 text-emerald-700 font-semibold">Yes (Full Alpha)</td>
                    <td className="py-3 px-4">Modern web delivery, eCommerce, blogs</td>
                    <td className="py-3 px-4 font-semibold text-emerald-700">Native Browser Canvas</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-bold text-slate-900">GIF</td>
                    <td className="py-3 px-4">Lossless (LZW, 256 colors)</td>
                    <td className="py-3 px-4 text-emerald-700">Index Transparency</td>
                    <td className="py-3 px-4">Simple animations, retro meme clips</td>
                    <td className="py-3 px-4 text-slate-500">Video tool suggested</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-bold text-slate-900">SVG</td>
                    <td className="py-3 px-4">Vector Code (XML Markup)</td>
                    <td className="py-3 px-4 text-emerald-700">Yes (Vector Paths)</td>
                    <td className="py-3 px-4">Icons, scalable logos, vector art</td>
                    <td className="py-3 px-4 text-slate-500">Vector minifier suggested</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 6: Compress to Exact Sizes */}
          <section className="space-y-6">
            <div className="border-l-4 border-blue-600 pl-4 sm:pl-6 py-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Compress an Image to 100 KB, 200 KB, or 500 KB
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Practical techniques to satisfy strict upload ceilings on government portals, job applications, and online exams.
              </p>
            </div>

            <p>
              Many official websites, civil service portals, passport agencies, university admission systems, and corporate job boards impose strict maximum file-size limits. 
              You may encounter prompts demanding that you <strong>compress an image to 100 KB</strong>, <strong>reduce photo to 200 KB</strong>, or bring an attachment 
              strictly under a 500 KB ceiling. Submitting an oversized file causes immediate form rejection, while over-compressing a photo until it becomes blurry may 
              disqualify your application.
            </p>

            <h3 className="text-lg font-bold text-slate-900">A 3-Step Strategy for Strict Size Limits</h3>
            <div className="space-y-3 not-prose">
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <span className="text-xs font-bold text-blue-600 block mb-1">Step 1: Check Exact Dimensions &amp; Format</span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Carefully read the submission guidelines. If the portal requires a 600 &times; 600 pixel square photo or maximum width of 1000 pixels, 
                  enter those constraints into the <strong>Custom Options</strong> panel. Resizing eliminates unnecessary pixels immediately before compression begins.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <span className="text-xs font-bold text-blue-600 block mb-1">Step 2: Dial in the Quality Slider Progressively</span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Start with a moderate quality setting (e.g., 70% to 75%). Run compression and review the resulting byte count. If the file is still 135 KB when you need 100 KB, 
                  adjust the slider to 55%–60% or reduce the pixel width by 15%. This gradual approach preserves maximum sharpness without dropping into pixelated distortion.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <span className="text-xs font-bold text-blue-600 block mb-1">Step 3: Verify Visual Legibility Before Upload</span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Open the split-slider preview modal to verify that facial features, passport stamp details, signatures, or printed text remain 100% crisp and readable. 
                  Never compress an already-compressed file multiple times; always adjust settings using the clean original source image.
                </p>
              </div>
            </div>
          </section>

          {/* Section 7: Make Images Smaller for Websites and Blogs */}
          <section className="space-y-6">
            <div className="border-l-4 border-blue-600 pl-4 sm:pl-6 py-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Make Images Smaller for Websites and Blogs
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Optimize media weight, improve mobile visitor engagement, and support modern Core Web Vitals performance.
              </p>
            </div>

            <p>
              According to web archive telemetry, images consistently account for over 50% of the total byte weight of average web pages. 
              Uploading raw, multi-megabyte photographs directly from cameras into WordPress, Shopify, or custom web applications creates severe performance bottlenecks:
            </p>

            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>
                <strong>Larger Contentful Paint (LCP) Delays:</strong> When hero banner images take 3 to 5 seconds to transfer over 4G connections, Google Search signals flag poor Core Web Vitals performance.
              </li>
              <li>
                <strong>Mobile Bounce Rates:</strong> Impatient mobile visitors frequently abandon sluggish pages that stutter during image decoding and layout recalculations.
              </li>
              <li>
                <strong>Server &amp; CDN Bandwidth Costs:</strong> Serving unoptimized images burns unnecessary data transfer allowances, directly increasing hosting infrastructure bills.
              </li>
            </ul>

            <p>
              By standardizing an image optimization workflow—resizing images to match the maximum rendered container dimensions, applying balanced lossy compression, 
              and adopting WebP delivery—you ensure snappy, responsive page rendering across every device.
            </p>
          </section>

          {/* Section 8: Image Compression vs Image Resizing */}
          <section className="space-y-6">
            <div className="border-l-4 border-blue-600 pl-4 sm:pl-6 py-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Image Compression vs. Image Resizing
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Understanding the critical difference between altering pixel density and altering visual dimensions.
              </p>
            </div>

            <p>
              While both techniques reduce file size, they operate through completely different mechanisms:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 not-prose my-6">
              <div className="glass-card-3d p-6 rounded-2xl border-slate-200/90">
                <div className="flex items-center gap-2 mb-3 text-blue-700 font-bold text-base">
                  <Sliders className="w-5 h-5" />
                  <span>Image Compression</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  Compression modifies how pixel data is mathematically stored and encoded. It strips unnecessary metadata, optimizes color tables, 
                  and quantizes high-frequency patterns while leaving the physical width and height (e.g., 1920 &times; 1080) completely intact.
                </p>
                <div className="text-[11px] font-mono text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  Example: 1920 &times; 1080 (3.2 MB) &rarr; 1920 &times; 1080 (480 KB)
                </div>
              </div>

              <div className="glass-card-3d p-6 rounded-2xl border-slate-200/90">
                <div className="flex items-center gap-2 mb-3 text-indigo-700 font-bold text-base">
                  <Maximize2 className="w-5 h-5" />
                  <span>Image Resizing</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  Resizing alters the physical pixel grid dimensions of the image. It uses interpolation algorithms (bicubic or bilinear) 
                  to downsample the total number of pixels, directly reducing data volume by discarding excess resolution.
                </p>
                <div className="text-[11px] font-mono text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  Example: 6000 &times; 4000 (12 MB) &rarr; 1500 &times; 1000 (1.1 MB)
                </div>
              </div>
            </div>

            <p>
              For maximum efficiency, modern web teams combine both methods: downsample oversized images to their target display dimensions, 
              then apply balanced compression to the resulting asset.
            </p>
          </section>

          {/* Section 9: Lossless vs Lossy Compression */}
          <section className="space-y-6">
            <div className="border-l-4 border-blue-600 pl-4 sm:pl-6 py-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Lossless vs. Lossy Image Compression
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                The technical trade-offs between exact mathematical reproduction and maximum byte reduction.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 not-prose my-6">
              <div className="glass-card-3d p-5 rounded-2xl">
                <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Lossless Compression</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  Lossless algorithms rewrite data more compactly without discarding any underlying pixel information. When decompressed, 
                  the rendered image matches the original bit-for-bit.
                </p>
                <ul className="text-xs text-slate-600 space-y-1">
                  <li>&bull; Formats: PNG, WebP (Lossless mode), TIFF</li>
                  <li>&bull; Best for: Logos, UI icons, sharp diagrams, text screenshots</li>
                  <li>&bull; Average savings: 10% &ndash; 30%</li>
                </ul>
              </div>

              <div className="glass-card-3d p-5 rounded-2xl">
                <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>Lossy Compression</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  Lossy algorithms permanently discard imperceptible high-frequency visual details that human eyes struggle to detect at normal viewing distances.
                </p>
                <ul className="text-xs text-slate-600 space-y-1">
                  <li>&bull; Formats: JPEG / JPG, WebP (Lossy mode), AVIF</li>
                  <li>&bull; Best for: Photographs, complex gradients, web banners</li>
                  <li>&bull; Average savings: 50% &ndash; 85%</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 10: Privacy and Security */}
          <section className="space-y-6">
            <div className="border-l-4 border-blue-600 pl-4 sm:pl-6 py-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Is an Online Image Compressor Safe?
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Why client-side processing represents the gold standard for confidentiality, compliance, and user security.
              </p>
            </div>

            <p>
              Before uploading personal photographs, family pictures, confidential company diagrams, or identity documents to any online tool, 
              it is essential to understand how your data is handled. Many traditional online compressors transmit your pictures over the public internet 
              to remote cloud servers, where they may be stored in temporary folders, analyzed, or retained indefinitely.
            </p>

            <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200/90 not-prose my-6">
              <div className="flex items-center gap-2.5 text-blue-900 font-bold text-sm mb-2">
                <Lock className="w-4 h-4 text-blue-600" />
                <span>The FileCompress On-Device Privacy Architecture</span>
              </div>
              <p className="text-xs text-blue-950 leading-relaxed">
                FileCompress operates completely inside your local web browser sandbox using modern HTML5 Canvas, OffscreenCanvas, and WebAssembly APIs. 
                When you drag and drop an image into FileCompress, <strong>your file never leaves your computer, phone, or tablet</strong>. 
                Zero bytes are uploaded to remote servers, no cloud databases store your pictures, and your original media and metadata remain 100% confidential. 
                For complete technical transparency, review our verified{' '}
                <Link href="/privacy-policy" className="text-blue-700 underline font-semibold hover:text-blue-900">
                  Privacy Policy
                </Link>.
              </p>
            </div>
          </section>

          {/* Section 11: 7 Pro Tips */}
          <section className="space-y-6">
            <div className="border-l-4 border-blue-600 pl-4 sm:pl-6 py-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                7 Pro Tips for Getting Better Image Compression Results
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Actionable best practices from professional web performance engineers and graphic designers.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose my-6">
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
                <div className="text-xs font-bold text-blue-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>1. Always Retain Original Master Files</span>
                </div>
                <p className="text-xs text-slate-600">
                  Keep raw, unedited originals in archival storage so you can re-export for higher-resolution future displays without generational degradation.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
                <div className="text-xs font-bold text-blue-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>2. Match Pixel Dimensions to Display Containers</span>
                </div>
                <p className="text-xs text-slate-600">
                  Do not display 4000px photographs inside 400px mobile cards. Downsample width and height to save up to 80% before adjusting quality.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
                <div className="text-xs font-bold text-blue-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>3. Choose Format by Content Type</span>
                </div>
                <p className="text-xs text-slate-600">
                  Use JPEG for photographs, PNG for sharp logos and transparency, and WebP as a modern universal standard for web delivery.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
                <div className="text-xs font-bold text-blue-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>4. Aim for the 75%–85% Quality Sweet Spot</span>
                </div>
                <p className="text-xs text-slate-600">
                  Setting JPEG or WebP quality between 75% and 85% delivers massive byte reduction while keeping image degradation virtually invisible.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
                <div className="text-xs font-bold text-blue-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>5. Inspect Critical High-Frequency Details</span>
                </div>
                <p className="text-xs text-slate-600">
                  Use our split-slider preview to check fine text, facial skin tones, sharp edges, and subtle gradients before downloading.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
                <div className="text-xs font-bold text-blue-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>6. Rely on Truthful Byte Measurements</span>
                </div>
                <p className="text-xs text-slate-600">
                  FileCompress calculates real before-and-after byte sizes. If a file is already optimized, our tool reports accurate data without false claims.
                </p>
              </div>
            </div>
          </section>

          {/* Section 12: Comprehensive FAQs */}
          <section className="space-y-6">
            <div className="border-l-4 border-blue-600 pl-4 sm:pl-6 py-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Clear, practical answers to common questions about online image compression, formats, and best practices.
              </p>
            </div>

            <div className="space-y-4 not-prose">
              {IMAGE_FAQS.map((faq, idx) => (
                <div key={idx} className="glass-card-3d p-6 rounded-2xl space-y-2">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2 tracking-tight">
                    <HelpCircle className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{faq.question}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-6">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 13: Related Tools and Guides Callout */}
          <section className="p-8 rounded-3xl bg-gradient-to-br from-blue-50/90 to-indigo-50/70 border border-blue-100 shadow-sm not-prose text-center space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Explore More Free Online Compression Tools
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
              FileCompress provides a complete suite of browser-native, zero-upload optimization utilities. 
              Shrink documents, video footage, audio files, and complete archives securely on your device:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
              <Link
                href="/pdf-compressor"
                className="p-3 rounded-xl bg-white border border-slate-200/80 hover:border-blue-400 hover:shadow-xs transition-all flex flex-col items-center gap-1.5 group text-center"
              >
                <FileText className="w-5 h-5 text-red-600 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-slate-800">PDF Compressor</span>
                <span className="text-[10px] text-slate-500">Shrink documents</span>
              </Link>

              <Link
                href="/video-compressor"
                className="p-3 rounded-xl bg-white border border-slate-200/80 hover:border-blue-400 hover:shadow-xs transition-all flex flex-col items-center gap-1.5 group text-center"
              >
                <Film className="w-5 h-5 text-purple-600 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-slate-800">Video Compressor</span>
                <span className="text-[10px] text-slate-500">MP4 &amp; WebM clips</span>
              </Link>

              <Link
                href="/audio-compressor"
                className="p-3 rounded-xl bg-white border border-slate-200/80 hover:border-blue-400 hover:shadow-xs transition-all flex flex-col items-center gap-1.5 group text-center"
              >
                <Music className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-slate-800">Audio Compressor</span>
                <span className="text-[10px] text-slate-500">MP3 &amp; WAV audio</span>
              </Link>

              <Link
                href="/zip-compressor"
                className="p-3 rounded-xl bg-white border border-slate-200/80 hover:border-blue-400 hover:shadow-xs transition-all flex flex-col items-center gap-1.5 group text-center"
              >
                <FolderArchive className="w-5 h-5 text-amber-600 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-slate-800">ZIP Utility</span>
                <span className="text-[10px] text-slate-500">Bundle &amp; archive</span>
              </Link>
            </div>

            <div className="pt-2">
              <Link
                href="/how-to-compress-files"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-900 transition-colors"
              >
                <span>Read our Comprehensive Step-by-Step File Compression Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </section>

        </article>
      </main>
    </>
  );
}
