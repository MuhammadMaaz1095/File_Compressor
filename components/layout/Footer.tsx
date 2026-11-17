import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Sparkles, ArrowUpRight, Lock, Zap } from 'lucide-react';
import { BrandLogo } from '@/components/ui/BrandLogo';

export function Footer() {
  const currentYear = 2026;

  return (
    <footer className="mt-auto glass-footer-light text-slate-600 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="space-y-4 md:col-span-1">
            <Link
              href="/"
              className="flex items-center group focus-visible:ring-2 focus-visible:ring-blue-600 rounded-xl p-1 transition-transform hover:-translate-y-0.5 active:translate-y-0 w-fit"
              aria-label="FileCompress Homepage"
            >
              <BrandLogo size={38} showWordmark={true} inverted={false} />
            </Link>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Fast, high-fidelity online compression for images, documents, videos, and audio. Engineered for real performance, on-device privacy, and simplicity.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50/90 px-3 py-1.5 rounded-full border border-emerald-200/80 shadow-2xs w-fit font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>100% On-Device Processing</span>
            </div>
          </div>

          {/* Image & Video Tools */}
          <div>
            <h3 className="font-bold text-slate-900 text-xs tracking-wider uppercase mb-3.5 flex items-center gap-1.5">
              <span>Image &amp; Video Tools</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-600 font-medium">
              <li>
                <Link href="/" className="hover:text-blue-600 transition-colors">
                  Universal File Compressor
                </Link>
              </li>
              <li>
                <Link href="/image-compressor" className="hover:text-blue-600 transition-colors">
                  All Images (JPG, PNG, WebP)
                </Link>
              </li>
              <li>
                <Link href="/webp-compressor" className="hover:text-blue-600 transition-colors">
                  WebP Compressor
                </Link>
              </li>
              <li>
                <Link href="/png-compressor" className="hover:text-blue-600 transition-colors">
                  PNG Compressor (Transparency)
                </Link>
              </li>
              <li>
                <Link href="/svg-compressor" className="hover:text-blue-600 transition-colors">
                  SVG Optimizer (Lossless Vector)
                </Link>
              </li>
              <li>
                <Link href="/tiff-compressor" className="hover:text-blue-600 transition-colors">
                  TIFF Compressor (Multi-page)
                </Link>
              </li>
              <li>
                <Link href="/gif-compressor" className="hover:text-blue-600 transition-colors">
                  GIF Compressor (Animated)
                </Link>
              </li>
              <li>
                <Link href="/video-compressor" className="hover:text-blue-600 transition-colors">
                  All Video (MP4, WebM, MOV)
                </Link>
              </li>
              <li>
                <Link href="/mp4-compressor" className="hover:text-blue-600 transition-colors">
                  MP4 Compressor
                </Link>
              </li>
              <li>
                <Link href="/mov-compressor" className="hover:text-blue-600 transition-colors">
                  MOV Compressor
                </Link>
              </li>
            </ul>
          </div>

          {/* Document, Audio & Archive Tools */}
          <div>
            <h3 className="font-bold text-slate-900 text-xs tracking-wider uppercase mb-3.5">
              Documents &amp; Audio
            </h3>
            <ul className="space-y-2 text-xs text-slate-600 font-medium">
              <li>
                <Link href="/pdf-compressor" className="hover:text-blue-600 transition-colors">
                  PDF Compressor &amp; Optimizer
                </Link>
              </li>
              <li>
                <Link href="/word-compressor" className="hover:text-blue-600 transition-colors">
                  Word Document (DOCX)
                </Link>
              </li>
              <li>
                <Link href="/excel-compressor" className="hover:text-blue-600 transition-colors">
                  Excel Workbook (XLSX)
                </Link>
              </li>
              <li>
                <Link href="/powerpoint-compressor" className="hover:text-blue-600 transition-colors">
                  PowerPoint Slides (PPTX)
                </Link>
              </li>
              <li>
                <Link href="/audio-compressor" className="hover:text-blue-600 transition-colors">
                  Audio Compressor (Universal)
                </Link>
              </li>
              <li>
                <Link href="/mp3-compressor" className="hover:text-blue-600 transition-colors">
                  MP3 Audio Compressor
                </Link>
              </li>
              <li>
                <Link href="/wav-compressor" className="hover:text-blue-600 transition-colors">
                  WAV Audio Optimizer
                </Link>
              </li>
              <li>
                <Link href="/zip-compressor" className="hover:text-blue-600 transition-colors">
                  ZIP Compressor &amp; Archive
                </Link>
              </li>
            </ul>
          </div>

          {/* Guides, Trust & Legal */}
          <div>
            <h3 className="font-bold text-slate-900 text-xs tracking-wider uppercase mb-3.5">
              Resources &amp; Company
            </h3>
            <ul className="space-y-2 text-xs text-slate-600 font-medium">
              <li>
                <Link href="/how-to-compress-files" className="hover:text-blue-600 transition-colors">
                  How to Compress Files Online
                </Link>
              </li>
              <li>
                <Link href="/how-to-compress-files#image-compression" className="hover:text-blue-600 transition-colors">
                  Lossy vs. Lossless Guide
                </Link>
              </li>
              <li>
                <Link href="/how-to-compress-files#pdf-compression" className="hover:text-blue-600 transition-colors">
                  Optimizing Documents &amp; PDFs
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-blue-600 transition-colors">
                  About FileCompress &amp; Mission
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-600 transition-colors">
                  Contact &amp; Support
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-blue-600 transition-colors">
                  Privacy Policy (Zero Server Storage)
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-blue-600 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <p>
            &copy; {currentYear} FileCompress. Built for maximum speed, privacy, and simplicity.
          </p>
          <div className="flex items-center gap-4 text-slate-500">
            <span className="flex items-center gap-1.5 text-blue-600">
              <Sparkles className="w-3.5 h-3.5" /> Free &amp; Open Web Standards
            </span>
            <Link href="/privacy-policy" className="hover:text-blue-600 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-blue-600 transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
