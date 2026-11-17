import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { RelatedTools } from '@/components/content/RelatedTools';
import { SvgWorkspace } from '@/components/compression/SvgWorkspace';
import { AdSlot } from '@/components/ads/AdSlot';
import { JsonLd, getSoftwareAppSchema, getFaqSchema } from '@/components/seo/JsonLd';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  FileCode,
  Layers,
  Zap,
  Info,
  AlertTriangle,
  ArrowUpRight,
  Maximize2,
  Sliders,
  HelpCircle,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Free Online SVG Compressor – Reduce SVG File Size',
  description:
    'Compress SVG files online and reduce unnecessary file size. Optimize SVG graphics for websites, logos, and icons, then check the result before downloading.',
  keywords: [
    'Free Online SVG Compressor',
    'SVG compressor',
    'compress SVG online',
    'SVG optimizer',
    'make SVG file smaller',
    'reduce SVG file size online',
    'SVG minifier',
    'compress SVG free',
  ],
  alternates: {
    canonical: '/svg-compressor',
  },
  openGraph: {
    title: 'Free Online SVG Compressor – Reduce SVG File Size | FileCompress',
    description:
      'Compress SVG files online and reduce unnecessary file size. Optimize SVG graphics for websites, logos, and icons, then check the result before downloading.',
    url: '/svg-compressor',
    type: 'website',
  },
};

const SVG_FAQS = [
  {
    question: 'Is the FileCompress SVG compressor free?',
    answer:
      'Check the current FileCompress tool interface for the features and usage conditions available to you. The page is intended to help users compress SVG files online, but any limits or paid features should be stated accurately on the live site.',
  },
  {
    question: 'How do I compress an SVG file online?',
    answer:
      'Open the SVG compressor, select your file, run the available optimization process, review the result, and download the output if it meets your requirements. Keep the original file so that you can restore it if needed.',
  },
  {
    question: 'Can I compress an SVG without converting it to PNG?',
    answer:
      'Yes. SVG optimization can reduce unnecessary markup while keeping the output in SVG format. This is different from converting a vector graphic to a raster format such as PNG or WebP.',
  },
  {
    question: 'Does compressing SVG reduce quality?',
    answer:
      'It depends on the optimization operations. Removing redundant comments or metadata may not change the rendered graphic, while changing path precision or removing important structures can affect appearance or behavior. Review the optimized result before using it.',
  },
  {
    question: 'Why is my SVG still large after compression?',
    answer:
      'The file may already be optimized or may contain complex paths, filters, gradients, or other information needed to render the graphic. If little redundant data can be removed, the reduction may be small.',
  },
  {
    question: 'Can SVG compression improve website speed?',
    answer:
      'Reducing an SVG\'s raw file size can reduce the number of bytes required to deliver that asset. The actual improvement depends on the size of the reduction, how the file is served, caching, and other performance factors.',
  },
  {
    question: 'Is SVG better than PNG?',
    answer:
      'Neither format is universally better. SVG is often appropriate for scalable vector graphics, logos, and icons. PNG is useful for raster graphics and images requiring pixel-based transparency. Select the format that best fits the content.',
  },
  {
    question: 'Can I use an optimized SVG commercially?',
    answer:
      'The right to use a graphic commercially depends on its source and license. Compression does not automatically change the copyright or licensing terms of the original artwork. Check the applicable license before commercial use.',
  },
  {
    question: 'Should I keep my original SVG file?',
    answer:
      'Yes. Keeping the original is recommended, particularly for important graphics. It gives you a source to restore or edit if the optimized file introduces a compatibility or visual issue.',
  },
  {
    question: 'Does SVG compression remove the background?',
    answer:
      'Not necessarily. An optimizer may preserve transparency or other graphic properties, but the result depends on the file and the operations performed. Check the output to confirm that the background and other visual details remain correct.',
  },
  {
    question: 'Can I compress SVG icons and logos?',
    answer:
      'Yes, SVG icons and logos are common candidates for optimization. However, check the result carefully for changes to paths, dimensions, colors, IDs, accessibility information, or other properties required by your project.',
  },
  {
    question: 'Is SVG compression the same as ZIP compression?',
    answer:
      'No. ZIP compression packages files in an archive. SVG optimization simplifies or removes redundant data within the SVG itself. The methods can be useful for different purposes.',
  },
];

export default function SvgCompressorPage() {
  return (
    <>
      <JsonLd
        data={getSoftwareAppSchema({
          name: 'FileCompress Free Online SVG Compressor',
          urlPath: '/svg-compressor',
          description:
            'Free online SVG compressor and optimizer. Reduce SVG file size, clean redundant XML markup, and optimize vector graphics for websites, logos, and icons directly in your browser.',
          applicationCategory: 'DesignApplication',
          featureList: [
            'Client-side SVG optimization with XML minification and metadata stripping',
            'Configurable numeric precision and path coordinate simplification',
            'Built-in security sanitization to remove unsafe scripts and handlers',
            'Instant before and after visual comparison with on-device privacy',
            'Keep original vector scalability without rasterizing to PNG or WebP',
          ],
        })}
      />
      <JsonLd data={getFaqSchema(SVG_FAQS)} />

      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full pb-16">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'SVG Compressor', href: '/svg-compressor' },
          ]}
        />

        {/* Hero Header */}
        <header className="text-center max-w-4xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Free Online Vector Optimization</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Free Online SVG Compressor – <span className="text-blue-600">Reduce SVG File Size Online</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto">
            SVG files are widely used for website logos, icons, illustrations, diagrams, and scalable graphics. They can look sharp at different screen sizes without losing the clarity associated with vector graphics. However, an SVG file can still contain unnecessary markup, metadata, comments, and other data that increases its size. Optimizing these files can help make website assets more efficient and easier to manage.
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
          {/* Introductory Overview */}
          <section className="glass-panel p-8 sm:p-10 rounded-3xl space-y-4">
            <p className="leading-relaxed">
              With the <strong>Free Online SVG Compressor from FileCompress</strong>, you can work toward reducing unnecessary SVG file data while keeping the graphic in its original format. An SVG compressor is particularly useful when preparing logos, interface icons, and vector illustrations for websites, applications, and digital projects.
            </p>
            <p className="leading-relaxed">
              The best way to compress an SVG file is to balance file size, visual quality, compatibility, and functionality. A smaller file is useful only when the optimized graphic still works as intended.
            </p>
            <p className="leading-relaxed">
              Use the SVG compressor above to get started, review the output carefully, and download the optimized file when it meets your requirements.
            </p>
          </section>

          {/* What Is a Free Online SVG Compressor */}
          <section className="glass-panel p-8 sm:p-10 rounded-3xl space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              What Is a Free Online SVG Compressor?
            </h2>
            <p className="leading-relaxed">
              A free online SVG compressor is a web-based tool designed to reduce the size of Scalable Vector Graphics files. Unlike a conventional image compressor that primarily works with pixels, an SVG optimizer can work with the text-based markup that describes vector shapes and their properties.
            </p>
            <p className="leading-relaxed">
              SVG stands for Scalable Vector Graphics. It is a vector image format based on XML markup. Instead of storing an image as a grid of colored pixels, SVG describes elements such as paths, shapes, fills, strokes, gradients, and transformations.
            </p>
            <p className="leading-relaxed">
              This structure allows SVG graphics to scale to different dimensions while retaining their vector characteristics. It also means that unnecessary markup can sometimes be removed or simplified to reduce the file size.
            </p>
            <p className="leading-relaxed">
              Depending on the optimization engine and settings, an SVG compressor may remove comments, clean up metadata, simplify attributes, shorten numeric values, or eliminate redundant structures. The available operations differ between tools, and not every transformation is suitable for every SVG file.
            </p>
            <p className="leading-relaxed">
              A good SVG optimization workflow focuses on reducing unnecessary data without damaging the appearance or behavior of the graphic.
            </p>
          </section>

          {/* Why Should You Compress SVG Files */}
          <section className="glass-panel p-8 sm:p-10 rounded-3xl space-y-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Why Should You Compress SVG Files?
            </h2>
            <p className="leading-relaxed">
              SVG files are often smaller than equivalent high-resolution raster images, but this is not guaranteed. Complex illustrations, detailed path data, embedded resources, and unnecessary markup can all contribute to a large SVG file.
            </p>
            <p className="leading-relaxed">
              Compressing suitable SVG files can offer several key benefits:
            </p>

            <div className="space-y-6 pt-2">
              <div className="border-l-4 border-blue-500 pl-4 py-1">
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  1. Reduce unnecessary file size
                </h3>
                <p className="leading-relaxed text-slate-600">
                  An SVG exported from a design application may include metadata, comments, editor-specific information, or formatting that is not required to display the final graphic. Removing suitable unnecessary data can reduce the number of bytes in the file.
                </p>
                <p className="leading-relaxed text-slate-600 mt-2">
                  The amount saved depends on the original file. A file containing lots of redundant markup may shrink considerably, while an SVG that has already been optimized may show little or no improvement.
                </p>
              </div>

              <div className="border-l-4 border-blue-500 pl-4 py-1">
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  2. Improve website asset efficiency
                </h3>
                <p className="leading-relaxed text-slate-600">
                  Website performance depends on many factors, including HTML, CSS, JavaScript, images, network conditions, caching, and server configuration. Optimizing SVG assets is one way to reduce unnecessary data in the resources a website delivers.
                </p>
                <p className="leading-relaxed text-slate-600 mt-2">
                  Smaller SVG files may require fewer bytes to transfer, particularly when a page uses multiple icons, logos, and illustrations. The actual performance benefit depends on the size of the reduction and how the assets are delivered.
                </p>
              </div>

              <div className="border-l-4 border-blue-500 pl-4 py-1">
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  3. Optimize website logos and icons
                </h3>
                <p className="leading-relaxed text-slate-600">
                  Logos and icons are common SVG use cases because vector graphics can remain sharp at different display sizes. Before adding these assets to a website, developers may want to remove unnecessary metadata and simplify the markup.
                </p>
                <p className="leading-relaxed text-slate-600 mt-2">
                  An SVG compressor can help prepare appropriate files for production, provided that the optimization preserves the details and references required by the website.
                </p>
              </div>

              <div className="border-l-4 border-blue-500 pl-4 py-1">
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  4. Keep the original vector format
                </h3>
                <p className="leading-relaxed text-slate-600">
                  SVG optimization does not necessarily require converting the graphic into PNG, JPEG, or WebP. An optimizer can reduce the content of an SVG while keeping the output in SVG format.
                </p>
                <p className="leading-relaxed text-slate-600 mt-2">
                  This is useful when the graphic needs to remain scalable or when a project relies on vector-based assets.
                </p>
              </div>

              <div className="border-l-4 border-blue-500 pl-4 py-1">
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  5. Make files easier to manage
                </h3>
                <p className="leading-relaxed text-slate-600">
                  Cleaning up SVG files can make them easier to organize, distribute, and maintain. Some optimizers also produce more compact markup that is easier to process in automated workflows.
                </p>
                <p className="leading-relaxed text-slate-600 mt-2">
                  However, removing unnecessary formatting can make the raw code less readable to humans. If you regularly edit SVG markup manually, keep a readable source copy.
                </p>
              </div>
            </div>
          </section>

          {/* How to Compress SVG Files Online */}
          <section className="glass-panel p-8 sm:p-10 rounded-3xl space-y-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              How to Compress SVG Files Online
            </h2>
            <p className="leading-relaxed">
              You can follow these general steps to optimize an SVG graphic using an online SVG compressor:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="bg-white/80 border border-slate-200/80 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-extrabold text-sm">
                    1
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">
                    Select your SVG file
                  </h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Open the FileCompress SVG Compressor and choose the SVG file you want to optimize using the upload control. If the graphic is important to your website, brand, or application, keep an untouched copy before starting. This gives you a reliable backup if the optimized file changes the appearance or behavior of the original.
                </p>
              </div>

              <div className="bg-white/80 border border-slate-200/80 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-extrabold text-sm">
                    2
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">
                    Run the SVG optimization process
                  </h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Start the compression process using the available tool controls. The exact transformations depend on how the FileCompress tool is implemented. An SVG optimizer may simplify redundant markup, remove selected comments or metadata, or reduce unnecessary formatting.
                </p>
              </div>

              <div className="bg-white/80 border border-slate-200/80 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-extrabold text-sm">
                    3
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">
                    Review the optimized file
                  </h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Once processing finishes, check the output size and inspect the graphic. Look for unexpected changes to shapes, colors, gradients, clipping, transparency, text, or dimensions. If your SVG is used in a website, test it in the browser or application where it will appear.
                </p>
              </div>

              <div className="bg-white/80 border border-slate-200/80 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-extrabold text-sm">
                    4
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">
                    Download the result
                  </h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  If the optimized SVG meets your requirements, download it using the tool&apos;s available download control. Keep the original source file, especially when working with brand assets or production websites. If the optimized version causes an issue later, you can restore the original.
                </p>
              </div>
            </div>
          </section>

          {/* How Does an SVG Compressor Work */}
          <section className="glass-panel p-8 sm:p-10 rounded-3xl space-y-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              How Does an SVG Compressor Work?
            </h2>
            <p className="leading-relaxed">
              SVG optimization works differently from many traditional raster-image compression methods because SVG is a markup-based vector format.
            </p>
            <p className="leading-relaxed">
              The file may contain XML elements that define shapes, paths, styles, gradients, filters, dimensions, references, and other graphic properties. An optimizer examines supported structures and applies transformations intended to reduce redundant data.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="bg-white/70 border border-slate-200/80 rounded-2xl p-6 space-y-2">
                <h3 className="text-lg font-bold text-slate-900">
                  Removing unnecessary metadata
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  SVG files exported from design tools may include information about the authoring application, document history, or editing environment. When metadata is not needed for the intended use, removing it may reduce file size. Preserve information that matters to your project.
                </p>
              </div>

              <div className="bg-white/70 border border-slate-200/80 rounded-2xl p-6 space-y-2">
                <h3 className="text-lg font-bold text-slate-900">
                  Removing comments and redundant whitespace
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Comments and formatting whitespace may increase the raw size of an SVG file. A minifier can remove comments and compact the markup to reduce unnecessary characters without altering visual presentation when applied appropriately.
                </p>
              </div>

              <div className="bg-white/70 border border-slate-200/80 rounded-2xl p-6 space-y-2">
                <h3 className="text-lg font-bold text-slate-900">
                  Simplifying numeric precision
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  SVG path coordinates, transformations, and other values can contain many decimal places. In some graphics, this precision exceeds what is necessary for the intended display size. Shortening numeric values reduces character count, but aggressive rounding can alter complex curves.
                </p>
              </div>

              <div className="bg-white/70 border border-slate-200/80 rounded-2xl p-6 space-y-2">
                <h3 className="text-lg font-bold text-slate-900">
                  Cleaning up attributes and structures
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Some optimization engines can simplify attributes, remove redundant declarations, clean up groups, or simplify supported path structures. They may also affect IDs, CSS selectors, references, or animations if used without care. Test files with interactive effects.
                </p>
              </div>
            </div>
          </section>

          {/* SVG Compressor vs. SVG Optimizer vs. SVG Minifier */}
          <section className="glass-panel p-8 sm:p-10 rounded-3xl space-y-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              SVG Compressor vs. SVG Optimizer vs. SVG Minifier
            </h2>
            <p className="leading-relaxed">
              The phrases SVG compressor, SVG optimizer, and SVG minifier are often used interchangeably, but they can refer to different levels of processing:
            </p>

            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-white/70 border border-slate-200/80">
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  What is an SVG compressor?
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  An SVG compressor is a broad term for a tool that reduces the size of SVG files. It may use one or more methods to simplify the file or reduce unnecessary data. The exact process depends on the product.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/70 border border-slate-200/80">
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  What is an SVG optimizer?
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  An SVG optimizer may apply more extensive transformations to the SVG structure. Depending on its capabilities, it may remove redundant attributes, simplify paths, clean up definitions, or modify other supported structures. The aim is to make the file more efficient while preserving required rendering and behavior.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/70 border border-slate-200/80">
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  What is an SVG minifier?
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  An SVG minifier generally focuses on reducing markup size. It may remove comments, unnecessary whitespace, and redundant formatting. Some minifiers perform only relatively simple text transformations, while others include more advanced structural optimization.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/70 border border-slate-200/80">
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  Which tool should you use?
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Choose a tool based on the operations it actually supports. If you only need to remove extra whitespace, a minifier may be sufficient. If you need more extensive markup optimization, an SVG optimizer with appropriate controls may be more useful. For important graphics, always compare the output and test compatibility before replacing the source file.
                </p>
              </div>
            </div>
          </section>

          {/* How to Reduce SVG File Size Without Damaging the Graphic */}
          <section className="glass-panel p-8 sm:p-10 rounded-3xl space-y-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              How to Reduce SVG File Size Without Damaging the Graphic
            </h2>
            <p className="leading-relaxed">
              Many users want to compress SVG files without losing visual quality. This is often possible when the optimizer removes redundant information that does not affect rendering, but no single optimization setting is guaranteed to be safe for every SVG.
            </p>
            <p className="leading-relaxed">
              Use these best practices to reduce risk:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  Keep an original copy
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Before optimizing a logo, illustration, or icon, save the original SVG. The original gives you a way to restore the file if the optimized version does not work as expected.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  Compare the original and optimized appearance
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Check both files at their intended display sizes. Pay attention to thin lines, small details, gradients, transparency, clipping paths, and curves.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  Preserve important IDs and references
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  SVG files may use IDs referenced by CSS, JavaScript, gradients, filters, masks, or other elements. Removing or changing an ID can affect the graphic even if its standalone preview looks correct.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  Be careful with accessibility information
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  SVGs can include title and description elements that provide useful information to assistive technologies. If the graphic communicates meaning, make sure the surrounding interface or SVG itself still provides accessible labels.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  Avoid aggressive precision changes
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Reducing decimal precision may shrink some files, but excessive rounding can affect path geometry. For logos, diagrams, and detailed illustrations, prioritize correct rendering over the smallest possible file.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  Test the output in context
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  An SVG can look correct in a standalone preview but behave differently when embedded in a website. CSS inheritance, external references, scripting, and other dependencies can influence the result.
                </p>
              </div>
            </div>
          </section>

          {/* Why Didn't My SVG File Get Smaller */}
          <section className="glass-panel p-8 sm:p-10 rounded-3xl space-y-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Why Didn&apos;t My SVG File Get Smaller?
            </h2>
            <p className="leading-relaxed">
              Not every SVG file becomes smaller after optimization. The result depends on how the file was created and how much redundant information it contains:
            </p>

            <div className="space-y-4 pt-2">
              <div className="p-5 rounded-2xl bg-white/70 border border-slate-200/80">
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  The SVG is already optimized
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  If your file has already been processed by an SVG optimizer or clean icon system, there may be little unnecessary data left to remove.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/70 border border-slate-200/80">
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  The graphic contains complex paths
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Detailed illustrations can contain substantial path data that is necessary to preserve their appearance. Removing this information could change the graphic.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/70 border border-slate-200/80">
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  The file contains essential information
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Some SVG files include complex gradients, filters, masks, embedded resources, or other structures that contribute to their size. These elements may be important to the visual outcome.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/70 border border-slate-200/80">
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  The optimizer uses conservative settings
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  An optimizer that prioritizes compatibility or visual fidelity may avoid transformations that could reduce the file further but introduce unwanted visual shifts.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/70 border border-slate-200/80">
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  The optimized output is larger
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  In some cases, the output can be the same size as or larger than the original. If this happens, compare the two files and retain the original when it is the better option. A reliable SVG compressor should report actual file sizes honestly.
                </p>
              </div>
            </div>
          </section>

          {/* SVG vs. PNG vs. WebP: Which Format Is Better */}
          <section className="glass-panel p-8 sm:p-10 rounded-3xl space-y-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              SVG vs. PNG vs. WebP: Which Format Is Better?
            </h2>
            <p className="leading-relaxed">
              SVG, PNG, and WebP serve different purposes. The best choice depends on the content, visual requirements, and intended use.
            </p>

            <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white/80 shadow-sm">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="bg-slate-50/80 text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200/80">
                  <tr>
                    <th scope="col" className="px-6 py-4">Format</th>
                    <th scope="col" className="px-6 py-4">Typical use</th>
                    <th scope="col" className="px-6 py-4">Main consideration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/80">
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">SVG</td>
                    <td className="px-6 py-4">Logos, icons, diagrams, vector illustrations</td>
                    <td className="px-6 py-4 text-slate-600">Scalable vector structure; file size depends on markup and graphic complexity</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">PNG</td>
                    <td className="px-6 py-4">Screenshots, raster graphics, transparent images</td>
                    <td className="px-6 py-4 text-slate-600">Pixel-based format; size depends on image dimensions and content</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">WebP</td>
                    <td className="px-6 py-4">Web images, photographs, and raster graphics</td>
                    <td className="px-6 py-4 text-slate-600">Supports lossy and lossless encoding options with high efficiency</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="leading-relaxed text-sm text-slate-600">
              SVG is often a good choice for graphics that need to scale cleanly or remain vector-based. PNG may be more suitable for pixel-based graphics that require lossless raster output or transparency. WebP can be useful for web delivery of raster images.
            </p>
            <p className="leading-relaxed text-sm text-slate-600">
              Converting SVG to a raster format changes how the graphic is represented. The resulting file may not retain the same vector-editing capabilities or scale indefinitely without pixelation. For this reason, optimizing an SVG in its original format can be preferable when vector properties are important.
            </p>
          </section>

          {/* Tips for Optimizing SVG Files for Websites */}
          <section className="glass-panel p-8 sm:p-10 rounded-3xl space-y-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Tips for Optimizing SVG Files for Websites
            </h2>
            <p className="leading-relaxed">
              Reducing SVG file size is one part of creating an efficient website. Use the following practices when preparing graphics for production:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-900">Export clean SVG files</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Start with appropriate export settings in your design application. Remove unnecessary objects or hidden layers when they are not required for the final graphic. A clean source file needs less cleanup later.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-900">Check the viewBox and dimensions</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  The SVG <code>viewBox</code> defines the coordinate system used by the graphic. Width and height attributes can also influence how the file is displayed. Do not remove or change these values without understanding how the graphic scales.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-900">Check inline SVG behavior</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  An SVG embedded directly into HTML may inherit CSS styles or be manipulated by JavaScript. Optimizations that alter IDs, classes, or structure may affect this behavior. Test inline SVGs in their actual context.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-900">Understand gzip and Brotli</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  SVG is text-based XML, so web servers can often compress it during transfer using gzip or Brotli. Raw file size and compressed transfer size are different measurements.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-900">Keep a consistent asset workflow</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Use a consistent process for preparing, optimizing, reviewing, and deploying SVG assets. Keep source files separate from production outputs so that future edits do not depend on an aggressively optimized file.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-900">Check performance in context</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  A smaller SVG does not automatically guarantee a measurable improvement in overall page speed. Performance also depends on network requests, caching, rendering, scripts, and other resources.
                </p>
              </div>
            </div>
          </section>

          {/* Common SVG Compression Mistakes to Avoid */}
          <section className="glass-panel p-8 sm:p-10 rounded-3xl space-y-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Common SVG Compression Mistakes to Avoid
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-5 rounded-2xl bg-white/70 border border-slate-200/80 space-y-2">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                  Choosing file size over correctness
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  The smallest file is not always the best file. If optimization changes the appearance, breaks references, or removes important information, the output may not be suitable.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/70 border border-slate-200/80 space-y-2">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                  Assuming all SVGs can be compressed equally
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  A simple logo with redundant metadata may shrink differently from a detailed illustration with many paths. Results vary by file.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/70 border border-slate-200/80 space-y-2">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                  Removing IDs without checking dependencies
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  IDs can be referenced by CSS, scripts, gradients, filters, or other SVG elements. Check dependencies before using an optimization that removes or changes them.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/70 border border-slate-200/80 space-y-2">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                  Ignoring accessibility
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Removing a title or description may remove meaningful accessibility information. Make sure your optimized SVG still communicates necessary information.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/70 border border-slate-200/80 space-y-2">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                  Forgetting to test in destination environment
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  A graphic that looks correct in one viewer may behave differently in a website or application. Always test important assets in context.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/70 border border-slate-200/80 space-y-2">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                  Trusting percentage claims blindly
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Compression percentages should come from actual measurements of original and output files. Do not assume every file will shrink by a fixed percentage.
                </p>
              </div>
            </div>
          </section>

          {/* Frequently Asked Questions */}
          <section className="glass-panel p-8 sm:p-10 rounded-3xl space-y-6">
            <div className="flex items-center gap-3">
              <HelpCircle className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Frequently Asked Questions About SVG Compression
              </h2>
            </div>
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

          {/* Concluding CTA */}
          <section className="glass-panel p-8 sm:p-10 rounded-3xl space-y-4 text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Start Compressing SVG Files with FileCompress
            </h2>
            <p className="leading-relaxed max-w-2xl mx-auto text-slate-600">
              SVG files are useful for logos, icons, illustrations, and other graphics that need to scale across different screen sizes. Optimizing them can help reduce unnecessary markup and make assets more efficient to manage.
            </p>
            <p className="leading-relaxed max-w-2xl mx-auto text-slate-600">
              The best results come from using appropriate optimization settings, checking the output, and keeping the original file available. Not every SVG will shrink, and no single compression percentage is guaranteed for every graphic.
            </p>
            <div className="pt-2">
              <a
                href="#top"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors shadow-sm"
              >
                <span>Compress SVG Now</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
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
