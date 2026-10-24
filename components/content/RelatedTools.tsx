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
    description: 'Optimize vector graphics, sanitize scripts, and simplify path coordinates.',
    icon: FileCode,
    color: 'text-amber-600 bg-amber-50 group-hover:bg-amber-600 group-hover:text-white',
    linkText: 'Compress SVG',
  },
  {
    href: '/webp-compressor',
    title: 'WebP Compressor',
    description: 'Reduce WebP image file sizes while preserving 8-bit alpha transparency.',
    icon: ImageIcon,
    color: 'text-sky-600 bg-sky-50 group-hover:bg-sky-600 group-hover:text-white',
    linkText: 'Compress WebP',
  },
  {
    href: '/tiff-compressor',
    title: 'TIFF Compressor',
    description: 'Losslessly compress single and multi-page TIFF scans using Deflate level 9.',
    icon: Layers,
    color: 'text-indigo-600 bg-indigo-50 group-hover:bg-indigo-600 group-hover:text-white',
    linkText: 'Compress TIFF',
  },
  {
    href: '/word-compressor',
    title: 'Word Compressor',
    description: 'Reduce DOCX sizes by optimizing embedded images and repacking OpenXML.',
    icon: FileText,
    color: 'text-blue-600 bg-blue-50 group-hover:bg-blue-600 group-hover:text-white',
    linkText: 'Compress Word',
  },
  {
    href: '/mp4-compressor',
    title: 'MP4 Compressor',
    description: 'Downscale resolution, tune bitrates, and shrink MP4 clips for email and Discord.',
    icon: Film,
    color: 'text-purple-600 bg-purple-50 group-hover:bg-purple-600 group-hover:text-white',
    linkText: 'Compress MP4',
  },
  {
    href: '/mov-compressor',
    title: 'MOV Compressor',
    description: 'Transcode heavy Apple QuickTime (.mov) clips into compact web-compatible video.',
    icon: Film,
    color: 'text-violet-600 bg-violet-50 group-hover:bg-violet-600 group-hover:text-white',
    linkText: 'Compress MOV',
  },
  {
    href: '/png-compressor',
    title: 'PNG Compressor',
    description: 'Quantize PNG-8 palettes, preserve alpha transparency, and optimize Deflate streams.',
    icon: ImageIcon,
    color: 'text-indigo-600 bg-indigo-50 group-hover:bg-indigo-600 group-hover:text-white',
    linkText: 'Compress PNG',
  },
  {
    href: '/gif-compressor',
    title: 'GIF Compressor',
    description: 'Optimize animated GIFs, downscale dimensions, and quantize color palettes.',
    icon: Sparkles,
    color: 'text-amber-600 bg-amber-50 group-hover:bg-amber-600 group-hover:text-white',
    linkText: 'Compress GIF',
  },
  {
    href: '/image-compressor',
    title: 'Image Compressor',
    description: 'Compress JPG, PNG, and WebP pictures with side-by-side quality inspection.',
    icon: ImageIcon,
    color: 'text-blue-600 bg-blue-50 group-hover:bg-blue-600 group-hover:text-white',
    linkText: 'Compress Images',
  },
  {
    href: '/pdf-compressor',
    title: 'PDF Compressor',
    description: 'Optimize documents and strip redundant object streams for easy email sharing.',
    icon: FileText,
    color: 'text-rose-600 bg-rose-50 group-hover:bg-rose-600 group-hover:text-white',
    linkText: 'Compress PDF',
  },
  {
    href: '/video-compressor',
    title: 'Video Compressor',
    description: 'Transcode and downscale MP4, WebM, and MOV clips to fit upload limits.',
    icon: Film,
    color: 'text-purple-600 bg-purple-50 group-hover:bg-purple-600 group-hover:text-white',
    linkText: 'Compress Video',
  },
  {
    href: '/audio-compressor',
    title: 'Audio Compressor',
    description: 'Reduce audio file sizes with custom bitrates and stereo-to-mono downmixing.',
    icon: Music,
    color: 'text-emerald-600 bg-emerald-50 group-hover:bg-emerald-600 group-hover:text-white',
    linkText: 'Compress Audio',
  },
  {
    href: '/zip-compressor',
    title: 'ZIP Compressor',
    description: 'Combine multiple files into a compressed ZIP archive with custom compression levels.',
    icon: Archive,
    color: 'text-amber-600 bg-amber-50 group-hover:bg-amber-600 group-hover:text-white',
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
    <section className="my-12 pt-8 border-t border-slate-200/80">
      <div className="text-left mb-6">
        <h3 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h3>
        {description && (
          <p className="text-xs sm:text-sm text-slate-500 mt-1">{description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {visibleTools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.href}
              href={tool.href}
              className="glass-card-3d p-5 flex flex-col justify-between group"
            >
              <div>
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors ${tool.color}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">{tool.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed mb-3">
                  {tool.description}
                </p>
              </div>
              <div className="flex items-center text-xs font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
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
