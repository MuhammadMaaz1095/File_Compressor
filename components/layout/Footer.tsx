import React from 'react';
import Link from 'next/link';
import { FileArchive, ShieldCheck, Sparkles } from 'lucide-react';

export function Footer() {
  const currentYear = 2026;

  return (
    <footer className="mt-auto border-t border-slate-800 bg-[#090e1a] text-slate-300 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand info */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 flex items-center justify-center text-white shadow-md shadow-blue-500/25 group-hover:scale-105 transition-all">
                <FileArchive className="w-4 h-4 drop-shadow" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                File<span className="text-blue-400">Compress</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Fast, high-fidelity online compression for images, documents, video, and audio. Engineered for real performance, on-device privacy, and simplicity.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-emerald-300 bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-800/60 w-fit">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Zero server file uploads</span>
            </div>
          </div>

          {/* Tools */}
          <div>
            <h3 className="font-semibold text-white text-sm tracking-wider uppercase mb-3.5">
              Compression Tools
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/" className="hover:text-blue-400 transition-colors">
                  Universal File Compressor
                </Link>
              </li>
              <li>
                <Link href="/image-compressor" className="hover:text-blue-400 transition-colors">
                  Image Compressor (JPG, PNG, WebP)
                </Link>
              </li>
              <li>
                <Link href="/pdf-compressor" className="hover:text-blue-400 transition-colors">
                  PDF Compressor &amp; Optimizer
                </Link>
              </li>
              <li>
                <Link href="/gif-compressor" className="hover:text-blue-400 transition-colors">
                  GIF Compressor (Animated &amp; Static)
                </Link>
              </li>
              <li>
                <Link href="/png-compressor" className="hover:text-blue-400 transition-colors">
                  PNG Compressor (PNG-8 &amp; Alpha Transparency)
                </Link>
              </li>
              <li>
                <Link href="/video-compressor" className="hover:text-blue-400 transition-colors">
                  Video Compressor (MP4, WebM)
                </Link>
              </li>
              <li>
                <Link href="/audio-compressor" className="hover:text-blue-400 transition-colors">
                  Audio Compressor (MP3, WAV)
                </Link>
              </li>
              <li>
                <Link href="/zip-compressor" className="hover:text-blue-400 transition-colors">
                  ZIP Compressor (Archive &amp; Deflate)
                </Link>
              </li>
            </ul>
          </div>

          {/* Guides & Resources */}
          <div>
            <h3 className="font-semibold text-white text-sm tracking-wider uppercase mb-3.5">
              Guides &amp; Resources
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/how-to-compress-files" className="hover:text-blue-400 transition-colors">
                  How to Compress Files Online
                </Link>
              </li>
              <li>
                <Link href="/how-to-compress-files#image-compression" className="hover:text-blue-400 transition-colors">
                  Lossy vs. Lossless Guide
                </Link>
              </li>
              <li>
                <Link href="/how-to-compress-files#pdf-compression" className="hover:text-blue-400 transition-colors">
                  Optimizing Documents &amp; PDFs
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-blue-400 transition-colors">
                  Why On-Device Compression Matters
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Company */}
          <div>
            <h3 className="font-semibold text-white text-sm tracking-wider uppercase mb-3.5">
              Trust &amp; Legal
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/about" className="hover:text-blue-400 transition-colors">
                  About FileCompress
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-400 transition-colors">
                  Contact &amp; Support
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-blue-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-blue-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            &copy; {currentYear} FileCompress. Built for maximum speed, security, and simplicity.
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Free &amp; Open Web Standards
            </span>
            <Link href="/privacy-policy" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
