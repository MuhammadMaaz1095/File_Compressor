'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FileArchive,
  Image as ImageIcon,
  FileText,
  Film,
  Music,
  Archive,
  BookOpen,
  Info,
  ShieldCheck,
  Menu,
  X,
  Sparkles,
  ChevronDown,
  FileCode,
  Layers,
} from 'lucide-react';

const ALL_TOOLS = [
  { href: '/svg-compressor', label: 'SVG Compressor', icon: FileCode, category: 'image' },
  { href: '/webp-compressor', label: 'WebP Compressor', icon: ImageIcon, category: 'image' },
  { href: '/tiff-compressor', label: 'TIFF Compressor', icon: Layers, category: 'image' },
  { href: '/png-compressor', label: 'PNG Compressor', icon: ImageIcon, category: 'image' },
  { href: '/gif-compressor', label: 'GIF Compressor', icon: Sparkles, category: 'image' },
  { href: '/image-compressor', label: 'All Images', icon: ImageIcon, category: 'image' },
  { href: '/mp4-compressor', label: 'MP4 Compressor', icon: Film, category: 'video' },
  { href: '/mov-compressor', label: 'MOV Compressor', icon: Film, category: 'video' },
  { href: '/video-compressor', label: 'All Video', icon: Film, category: 'video' },
  { href: '/word-compressor', label: 'Word Compressor', icon: FileText, category: 'document' },
  { href: '/pdf-compressor', label: 'PDF Compressor', icon: FileText, category: 'document' },
  { href: '/audio-compressor', label: 'Audio Compressor', icon: Music, category: 'audio' },
  { href: '/zip-compressor', label: 'ZIP Compressor', icon: Archive, category: 'archive' },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [imageDropdownOpen, setImageDropdownOpen] = useState(false);
  const [videoDropdownOpen, setVideoDropdownOpen] = useState(false);
  const pathname = usePathname();

  const imageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMobileMenuOpen(false);
    setImageDropdownOpen(false);
    setVideoDropdownOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setImageDropdownOpen(false);
        setVideoDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (imageRef.current && !imageRef.current.contains(e.target as Node)) {
        setImageDropdownOpen(false);
      }
      if (videoRef.current && !videoRef.current.contains(e.target as Node)) {
        setVideoDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isImageActive = [
    '/image-compressor',
    '/webp-compressor',
    '/svg-compressor',
    '/tiff-compressor',
    '/png-compressor',
    '/gif-compressor',
  ].includes(pathname);

  const isVideoActive = [
    '/video-compressor',
    '/mp4-compressor',
    '/mov-compressor',
  ].includes(pathname);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-xl shadow-xs shadow-slate-900/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus-visible:ring-2 focus-visible:ring-blue-600 rounded-xl p-1"
          >
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-500 to-sky-400 flex items-center justify-center text-white shadow-md shadow-blue-500/20 border border-white/40 group-hover:scale-105 group-hover:shadow-blue-500/30 transition-all">
              <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent rounded-t-xl pointer-events-none" />
              <FileArchive className="w-5 h-5 relative z-10" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-[#0F172A] group-hover:text-blue-600 transition-colors">
                  File<span className="text-blue-600">Compress</span>
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200/80">
                  Client-Side
                </span>
              </div>
              <span className="text-[10px] text-slate-500 -mt-0.5 font-medium">
                Fast &amp; Private Browser Optimizer
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1" aria-label="Main Navigation">
            <Link
              href="/"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                pathname === '/'
                  ? 'bg-blue-600 text-white shadow-xs border border-blue-400/30'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border border-transparent'
              }`}
            >
              <FileArchive className={`w-3.5 h-3.5 ${pathname === '/' ? 'text-white' : 'text-slate-400'}`} />
              <span>All Tools</span>
            </Link>

            {/* Images Dropdown */}
            <div className="relative" ref={imageRef}>
              <button
                type="button"
                onClick={() => {
                  setImageDropdownOpen(!imageDropdownOpen);
                  setVideoDropdownOpen(false);
                }}
                className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isImageActive
                    ? 'bg-blue-600 text-white shadow-xs border border-blue-400/30'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border border-transparent'
                }`}
              >
                <ImageIcon className={`w-3.5 h-3.5 ${isImageActive ? 'text-white' : 'text-slate-400'}`} />
                <span>Images</span>
                <ChevronDown className="w-3 h-3 ml-0.5 opacity-70" />
              </button>

              {imageDropdownOpen && (
                <div className="absolute left-0 mt-1.5 w-52 rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200/80 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95">
                  <Link
                    href="/svg-compressor"
                    className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                  >
                    <FileCode className="w-4 h-4 text-amber-600" />
                    <span>SVG Compressor</span>
                  </Link>
                  <Link
                    href="/webp-compressor"
                    className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                  >
                    <ImageIcon className="w-4 h-4 text-sky-600" />
                    <span>WebP Compressor</span>
                  </Link>
                  <Link
                    href="/tiff-compressor"
                    className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                  >
                    <Layers className="w-4 h-4 text-indigo-600" />
                    <span>TIFF Compressor</span>
                  </Link>
                  <Link
                    href="/png-compressor"
                    className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                  >
                    <ImageIcon className="w-4 h-4 text-blue-600" />
                    <span>PNG Compressor</span>
                  </Link>
                  <Link
                    href="/gif-compressor"
                    className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                  >
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>GIF Compressor</span>
                  </Link>
                  <div className="border-t border-slate-100 my-1" />
                  <Link
                    href="/image-compressor"
                    className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                  >
                    <ImageIcon className="w-4 h-4 text-slate-500" />
                    <span>All Images (JPG/PNG/WebP)</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Video Dropdown */}
            <div className="relative" ref={videoRef}>
              <button
                type="button"
                onClick={() => {
                  setVideoDropdownOpen(!videoDropdownOpen);
                  setImageDropdownOpen(false);
                }}
                className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isVideoActive
                    ? 'bg-blue-600 text-white shadow-xs border border-blue-400/30'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border border-transparent'
                }`}
              >
                <Film className={`w-3.5 h-3.5 ${isVideoActive ? 'text-white' : 'text-slate-400'}`} />
                <span>Video</span>
                <ChevronDown className="w-3 h-3 ml-0.5 opacity-70" />
              </button>

              {videoDropdownOpen && (
                <div className="absolute left-0 mt-1.5 w-48 rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200/80 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95">
                  <Link
                    href="/mp4-compressor"
                    className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                  >
                    <Film className="w-4 h-4 text-purple-600" />
                    <span>MP4 Compressor</span>
                  </Link>
                  <Link
                    href="/mov-compressor"
                    className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                  >
                    <Film className="w-4 h-4 text-violet-600" />
                    <span>MOV Compressor</span>
                  </Link>
                  <div className="border-t border-slate-100 my-1" />
                  <Link
                    href="/video-compressor"
                    className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                  >
                    <Film className="w-4 h-4 text-slate-500" />
                    <span>General Video</span>
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/word-compressor"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                pathname === '/word-compressor'
                  ? 'bg-blue-600 text-white shadow-xs border border-blue-400/30'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border border-transparent'
              }`}
            >
              <FileText className={`w-3.5 h-3.5 ${pathname === '/word-compressor' ? 'text-white' : 'text-slate-400'}`} />
              <span>Word</span>
            </Link>

            <Link
              href="/pdf-compressor"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                pathname === '/pdf-compressor'
                  ? 'bg-blue-600 text-white shadow-xs border border-blue-400/30'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border border-transparent'
              }`}
            >
              <FileText className={`w-3.5 h-3.5 ${pathname === '/pdf-compressor' ? 'text-white' : 'text-slate-400'}`} />
              <span>PDF</span>
            </Link>

            <Link
              href="/audio-compressor"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                pathname === '/audio-compressor'
                  ? 'bg-blue-600 text-white shadow-xs border border-blue-400/30'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border border-transparent'
              }`}
            >
              <Music className={`w-3.5 h-3.5 ${pathname === '/audio-compressor' ? 'text-white' : 'text-slate-400'}`} />
              <span>Audio</span>
            </Link>

            <Link
              href="/zip-compressor"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                pathname === '/zip-compressor'
                  ? 'bg-blue-600 text-white shadow-xs border border-blue-400/30'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border border-transparent'
              }`}
            >
              <Archive className={`w-3.5 h-3.5 ${pathname === '/zip-compressor' ? 'text-white' : 'text-slate-400'}`} />
              <span>ZIP</span>
            </Link>

            <Link
              href="/how-to-compress-files"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                pathname === '/how-to-compress-files'
                  ? 'bg-blue-600 text-white shadow-xs border border-blue-400/30'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border border-transparent'
              }`}
            >
              <BookOpen className={`w-3.5 h-3.5 ${pathname === '/how-to-compress-files' ? 'text-white' : 'text-slate-400'}`} />
              <span>Guide</span>
            </Link>

            <Link
              href="/about"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                pathname === '/about'
                  ? 'bg-blue-600 text-white shadow-xs border border-blue-400/30'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border border-transparent'
              }`}
            >
              <Info className={`w-3.5 h-3.5 ${pathname === '/about' ? 'text-white' : 'text-slate-400'}`} />
              <span>About</span>
            </Link>
          </nav>

          {/* Right Trust Badge & Mobile Toggle */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50/90 border border-emerald-200/80 text-emerald-800 text-xs font-semibold shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>On-Device Privacy</span>
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-800 hover:bg-slate-100 border border-slate-200/80 shadow-2xs focus-visible:ring-2 focus-visible:ring-blue-600 transition-colors"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown with clean SaaS glass style */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200/80 bg-white/95 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-3 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="py-2 flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50/90 px-3.5 rounded-xl border border-emerald-200/70 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Files are processed locally in your browser sandbox</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {ALL_TOOLS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100/80 bg-slate-50 border border-slate-200/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-blue-600'}`} />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="border-t border-slate-200/70 pt-2 flex justify-around text-xs font-semibold text-slate-600">
            <Link href="/how-to-compress-files" onClick={() => setMobileMenuOpen(false)} className="hover:text-blue-600">
              Guide
            </Link>
            <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="hover:text-blue-600">
              About
            </Link>
            <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="hover:text-blue-600">
              Contact
            </Link>
            <Link href="/privacy-policy" onClick={() => setMobileMenuOpen(false)} className="hover:text-blue-600">
              Privacy
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
