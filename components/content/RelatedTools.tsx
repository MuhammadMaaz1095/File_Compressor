import React from 'react';
import Link from 'next/link';
import {
  Image as ImageIcon,
  FileText,
  Film,
  Music,
  Archive,
  Sparkles,
  ArrowRight,
  FileCode,
  FileSpreadsheet,
  Presentation,
  Layers,
} from 'lucide-react';

interface RelatedToolsProps {
  currentPath?: string;
  title?: string;
  description?: string;
}

const TOOLS = [
  {
    href: '/svg-compressor',
    title: 'SVG Compressor',
    description: 'Optimize vector graphics, clean markup, and simplify coordinate precision.',
    icon: FileCode,
    badgeBg: 'bg-amber-50 text-amber-600 border-amber-200/70',
    linkText: 'Compress SVG',
  },
  {
    href: '/webp-compressor',
    title: 'WebP Compressor',
    description: 'Reduce next-gen WebP image sizes while preserving 8-bit alpha transparency.',
    icon: ImageIcon,
    badgeBg: 'bg-sky-50 text-sky-600 border-sky-200/70',
    linkText: 'Compress WebP',
  },
  {
    href: '/tiff-compressor',
    title: 'TIFF Compressor',
    description: 'Losslessly compress single and multi-page TIFF scans using Deflate stream encoding.',
    icon: Layers,
    badgeBg: 'bg-indigo-50 text-indigo-600 border-indigo-200/70',
    linkText: 'Compress TIFF',
  },
  {
    href: '/png-compressor',
    title: 'PNG Compressor',
    description: 'Quantize 8-bit palettes, preserve alpha transparency, and optimize Deflate scanlines.',
    icon: ImageIcon,
    badgeBg: 'bg-blue-50 text-blue-600 border-blue-200/70',
    linkText: 'Compress PNG',
  },
  {
    href: '/gif-compressor',
    title: 'GIF Compressor',
    description: 'Optimize animated frames, scale dimensions, and cluster color palettes.',
    icon: Sparkles,
    badgeBg: 'bg-amber-50 text-amber-500 border-amber-200/70',
    linkText: 'Compress GIF',
  },
  {
    href: '/image-compressor',
    title: 'Image Compressor',
    description: 'Compress JPG, PNG, and WebP pictures with side-by-side visual inspection.',
    icon: ImageIcon,
    badgeBg: 'bg-blue-50 text-blue-600 border-blue-200/70',
    linkText: 'Compress Images',
  },
  {
    href: '/mp4-compressor',
    title: 'MP4 Compressor',
    description: 'Downscale resolution, tune bitrates, and shrink MP4 clips for email and Discord.',
    icon: Film,
    badgeBg: 'bg-purple-50 text-purple-600 border-purple-200/70',
    linkText: 'Compress MP4',
  },
  {
    href: '/mov-compressor',
    title: 'MOV Compressor',
    description: 'Transcode heavy Apple QuickTime (.mov) clips into compact web video.',
    icon: Film,
    badgeBg: 'bg-violet-50 text-violet-600 border-violet-200/70',
    linkText: 'Compress MOV',
  },
  {
    href: '/video-compressor',
    title: 'All Video Formats',
    description: 'Transcode and downscale MP4, WebM, and MOV clips to fit upload limits.',
    icon: Film,
    badgeBg: 'bg-purple-50 text-purple-600 border-purple-200/70',
    linkText: 'Compress Video',
  },
  {
    href: '/pdf-compressor',
    title: 'PDF Compressor',
    description: 'Optimize documents and strip redundant object streams for easy email sharing.',
    icon: FileText,
    badgeBg: 'bg-rose-50 text-rose-600 border-rose-200/70',
    linkText: 'Compress PDF',
  },
  {
    href: '/word-compressor',
    title: 'Word Compressor',
    description: 'Reduce DOCX sizes by optimizing embedded images and repacking OpenXML.',
    icon: FileText,
    badgeBg: 'bg-blue-50 text-blue-600 border-blue-200/70',
    linkText: 'Compress Word',
  },
  {
    href: '/excel-compressor',
    title: 'Excel Compressor',
    description: 'Streamline oversized spreadsheets, remove cached data, and shrink XLSX files.',
    icon: FileSpreadsheet,
    badgeBg: 'bg-emerald-50 text-emerald-600 border-emerald-200/70',
    linkText: 'Compress Excel',
  },
  {
    href: '/powerpoint-compressor',
    title: 'PowerPoint Compressor',
    description: 'Downscale heavy presentation slide decks and compress embedded pictures.',
    icon: Presentation,
    badgeBg: 'bg-amber-50 text-amber-600 border-amber-200/70',
    linkText: 'Compress PPTX',
  },
  {
    href: '/mp3-compressor',
    title: 'MP3 Compressor',
    description: 'Modulate audio bitrates, downmix channels, and optimize MP3 audio tracks.',
    icon: Music,
    badgeBg: 'bg-emerald-50 text-emerald-600 border-emerald-200/70',
    linkText: 'Compress MP3',
  },
  {
    href: '/wav-compressor',
    title: 'WAV Compressor',
    description: 'Compress uncompressed WAV audio into high-fidelity web-friendly audio.',
    icon: Music,
    badgeBg: 'bg-teal-50 text-teal-600 border-teal-200/70',
    linkText: 'Compress WAV',
  },
  {
    href: '/audio-compressor',
    title: 'Audio Compressor',
    description: 'Universal in-browser audio optimizer supporting MP3, WAV, M4A, and OGG.',
    icon: Music,
    badgeBg: 'bg-emerald-50 text-emerald-600 border-emerald-200/70',
    linkText: 'Compress Audio',
  },
  {
    href: '/zip-compressor',
    title: 'ZIP Compressor',
    description: 'Bundle multiple files into an optimized ZIP archive with custom Deflate levels.',
    icon: Archive,
    badgeBg: 'bg-amber-50 text-amber-600 border-amber-200/70',
    linkText: 'Create ZIP Archive',
  },
];

export function RelatedTools({
  currentPath,
  title = 'Available Compression Tools',
  description = 'Explore our dedicated in-browser compression utilities for other media types.',
}: RelatedToolsProps) {
  const visibleTools = TOOLS.filter((tool) => tool.href !== currentPath);

  return (
    <section className="my-14 pt-10 border-t border-slate-200/80">
      <div className="text-left mb-6">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">{title}</h3>
        {description && (
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">{description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {visibleTools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.href}
              href={tool.href}
              className="glass-card-3d p-5 flex flex-col justify-between group focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none"
            >
              <div>
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3.5 border shadow-2xs transition-transform duration-200 group-hover:scale-105 ${tool.badgeBg}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1 tracking-tight group-hover:text-blue-600 transition-colors">
                  {tool.title}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  {tool.description}
                </p>
              </div>
              <div className="flex items-center text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
                <span>{tool.linkText}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
