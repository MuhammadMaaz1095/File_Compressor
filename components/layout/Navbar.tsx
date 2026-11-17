'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BrandLogo } from '@/components/ui/BrandLogo';
import {
  FileArchive,
  Image as ImageIcon,
  FileText,
  Film,
  Music,
  Archive,
  BookOpen,
  ShieldCheck,
  Menu,
  X,
  Sparkles,
  ChevronDown,
  FileCode,
  Layers,
  FileSpreadsheet,
  Presentation,
  ArrowRight,
} from 'lucide-react';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<'images' | 'documents' | 'video' | 'audio' | 'other' | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  const navRef = useRef<HTMLElement>(null);
  const imagesRef = useRef<HTMLDivElement>(null);
  const documentsRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLDivElement>(null);
  const otherRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Desktop hover intent: open menu immediately, close with a grace delay
  const handleMouseEnter = (menu: 'images' | 'documents' | 'video' | 'audio' | 'other') => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setActiveDropdown(menu);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  // Cleanup hover timer on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  // Scroll listener for floating elevation change
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 16);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  // Keyboard accessibility: Escape closes dropdowns and mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveDropdown(null);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside to close open dropdown
  useEffect(() => {
    if (!activeDropdown) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        (activeDropdown === 'images' && imagesRef.current && !imagesRef.current.contains(target)) ||
        (activeDropdown === 'documents' && documentsRef.current && !documentsRef.current.contains(target)) ||
        (activeDropdown === 'video' && videoRef.current && !videoRef.current.contains(target)) ||
        (activeDropdown === 'audio' && audioRef.current && !audioRef.current.contains(target)) ||
        (activeDropdown === 'other' && otherRef.current && !otherRef.current.contains(target))
      ) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeDropdown]);

  // Active category detection
  const isImageActive = [
    '/image-compressor',
    '/svg-compressor',
    '/webp-compressor',
    '/tiff-compressor',
    '/png-compressor',
    '/gif-compressor',
  ].includes(pathname);

  const isDocActive = [
    '/pdf-compressor',
    '/word-compressor',
    '/excel-compressor',
    '/powerpoint-compressor',
  ].includes(pathname);

  const isVideoActive = [
    '/video-compressor',
    '/mp4-compressor',
    '/mov-compressor',
  ].includes(pathname);

  const isAudioActive = [
    '/audio-compressor',
    '/mp3-compressor',
    '/wav-compressor',
  ].includes(pathname);

  const isOtherActive = ['/zip-compressor'].includes(pathname);

  // Helper for consistent navigation link styling & height
  const getNavLinkClass = (isActive: boolean, isOpen: boolean = false) => {
    const base =
      'h-9 px-2.5 xl:px-3.5 inline-flex items-center justify-center gap-1.5 rounded-full text-xs font-semibold leading-none select-none transition-all duration-150 group';
    if (isActive) {
      return `${base} bg-blue-600 text-white shadow-[0_2px_6px_rgba(37,99,235,0.2)] border border-blue-500/40 hover:bg-blue-600/90`;
    }
    if (isOpen) {
      return `${base} bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs`;
    }
    return `${base} text-slate-700 hover:text-blue-700 hover:bg-blue-50/70 border border-transparent`;
  };

  return (
    <header
      ref={navRef}
      className="sticky top-3 sm:top-5 z-50 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full transition-all duration-300 pointer-events-auto"
    >
      {/* ============================================================ */}
      {/* MODERN FLOATING PILL NAVBAR CONTAINER */}
      {/* ============================================================ */}
      <div
        className={`transition-all duration-300 rounded-[26px] px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between border ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-[24px] border-white shadow-[0_12px_32px_-4px_rgba(37,99,235,0.09),0_4px_14px_-2px_rgba(15,23,42,0.04),inset_0_1px_1px_rgba(255,255,255,1)]'
            : 'bg-white/85 backdrop-blur-[20px] border-white/90 shadow-[0_8px_24px_-4px_rgba(37,99,235,0.06),0_2px_8px_-2px_rgba(15,23,42,0.02),inset_0_1px_1px_rgba(255,255,255,1)]'
        }`}
      >
        {/* Left Section: Brand Logo & Wordmark */}
        <div className="flex items-center shrink-0">
          <Link
            href="/"
            className="flex items-center group focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none rounded-2xl p-1 transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0"
            aria-label="FileCompress Homepage"
          >
            <BrandLogo size={36} showWordmark={true} />
          </Link>
        </div>

        {/* Center Section: Desktop Pill Navigation with Hover Intent & Instant Switching */}
        <nav
          className="hidden lg:flex items-center justify-center gap-1 xl:gap-1.5 flex-1 mx-2"
          aria-label="Main Navigation"
        >
          {/* 1. Home */}
          <Link
            href="/"
            className={getNavLinkClass(pathname === '/')}
            onMouseEnter={() => {
              if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
              setActiveDropdown(null);
            }}
          >
            <span>Home</span>
          </Link>

          {/* 2. Image Tools Dropdown */}
          <div
            className="relative"
            ref={imagesRef}
            onMouseEnter={() => handleMouseEnter('images')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              onClick={() => setActiveDropdown(activeDropdown === 'images' ? null : 'images')}
              aria-expanded={activeDropdown === 'images'}
              aria-haspopup="true"
              className={getNavLinkClass(isImageActive, activeDropdown === 'images')}
            >
              <span>Image<span className="hidden xl:inline">&nbsp;Tools</span></span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 shrink-0 ${
                  activeDropdown === 'images' ? 'rotate-180' : ''
                } ${isImageActive ? 'text-white/90' : 'text-slate-400 group-hover:text-blue-600'}`}
              />
            </button>

            {activeDropdown === 'images' && (
              <div
                className="absolute left-0 mt-2.5 w-64 rounded-2xl glass-dropdown-3d p-2 z-50 animate-in fade-in zoom-in-95 duration-150 shadow-xl border border-white before:content-[''] before:absolute before:-top-3 before:left-0 before:right-0 before:h-3"
                onMouseEnter={() => {
                  if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
                }}
                onMouseLeave={handleMouseLeave}
              >
                <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Raster &amp; Vector Image Tools
                </div>
                <div className="space-y-0.5">
                  <Link
                    href="/svg-compressor"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-blue-50/90 hover:text-blue-700 transition-colors"
                  >
                    <div className="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200/60 shadow-2xs">
                      <FileCode className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 leading-tight">SVG Compressor</div>
                      <div className="text-[10px] text-slate-500 font-normal">Clean XML paths &amp; markup</div>
                    </div>
                  </Link>

                  <Link
                    href="/webp-compressor"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-blue-50/90 hover:text-blue-700 transition-colors"
                  >
                    <div className="w-6 h-6 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-200/60 shadow-2xs">
                      <ImageIcon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 leading-tight">WebP Compressor</div>
                      <div className="text-[10px] text-slate-500 font-normal">Next-gen web graphics</div>
                    </div>
                  </Link>

                  <Link
                    href="/png-compressor"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-blue-50/90 hover:text-blue-700 transition-colors"
                  >
                    <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200/60 shadow-2xs">
                      <ImageIcon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 leading-tight">PNG Compressor</div>
                      <div className="text-[10px] text-slate-500 font-normal">Retain crisp alpha transparency</div>
                    </div>
                  </Link>

                  <Link
                    href="/tiff-compressor"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-blue-50/90 hover:text-blue-700 transition-colors"
                  >
                    <div className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-200/60 shadow-2xs">
                      <Layers className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 leading-tight">TIFF Compressor</div>
                      <div className="text-[10px] text-slate-500 font-normal">Lossless multi-page scans</div>
                    </div>
                  </Link>

                  <Link
                    href="/gif-compressor"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-blue-50/90 hover:text-blue-700 transition-colors"
                  >
                    <div className="w-6 h-6 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center border border-amber-200/60 shadow-2xs">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 leading-tight">GIF Compressor</div>
                      <div className="text-[10px] text-slate-500 font-normal">Optimize animated frames</div>
                    </div>
                  </Link>
                </div>

                <div className="border-t border-slate-100 my-1.5" />
                <Link
                  href="/image-compressor"
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-blue-700 hover:bg-blue-50 transition-colors"
                >
                  <span>All Images (JPG/PNG/WebP)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>

          {/* 3. Document Tools Dropdown */}
          <div
            className="relative"
            ref={documentsRef}
            onMouseEnter={() => handleMouseEnter('documents')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              onClick={() => setActiveDropdown(activeDropdown === 'documents' ? null : 'documents')}
              aria-expanded={activeDropdown === 'documents'}
              aria-haspopup="true"
              className={getNavLinkClass(isDocActive, activeDropdown === 'documents')}
            >
              <span>Document<span className="hidden xl:inline">&nbsp;Tools</span></span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 shrink-0 ${
                  activeDropdown === 'documents' ? 'rotate-180' : ''
                } ${isDocActive ? 'text-white/90' : 'text-slate-400 group-hover:text-blue-600'}`}
              />
            </button>

            {activeDropdown === 'documents' && (
              <div
                className="absolute left-0 mt-2.5 w-64 rounded-2xl glass-dropdown-3d p-2 z-50 animate-in fade-in zoom-in-95 duration-150 shadow-xl border border-white before:content-[''] before:absolute before:-top-3 before:left-0 before:right-0 before:h-3"
                onMouseEnter={() => {
                  if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
                }}
                onMouseLeave={handleMouseLeave}
              >
                <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  PDF &amp; Office Documents
                </div>
                <div className="space-y-0.5">
                  <Link
                    href="/pdf-compressor"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-blue-50/90 hover:text-blue-700 transition-colors"
                  >
                    <div className="w-6 h-6 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200/60 shadow-2xs">
                      <FileText className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 leading-tight">PDF Compressor</div>
                      <div className="text-[10px] text-slate-500 font-normal">Shrink reports &amp; contracts</div>
                    </div>
                  </Link>

                  <Link
                    href="/word-compressor"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-blue-50/90 hover:text-blue-700 transition-colors"
                  >
                    <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200/60 shadow-2xs">
                      <FileText className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 leading-tight">Word (DOCX)</div>
                      <div className="text-[10px] text-slate-500 font-normal">Microsoft Word documents</div>
                    </div>
                  </Link>

                  <Link
                    href="/excel-compressor"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-blue-50/90 hover:text-blue-700 transition-colors"
                  >
                    <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200/60 shadow-2xs">
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 leading-tight">Excel (XLSX)</div>
                      <div className="text-[10px] text-slate-500 font-normal">Spreadsheets &amp; workbooks</div>
                    </div>
                  </Link>

                  <Link
                    href="/powerpoint-compressor"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-blue-50/90 hover:text-blue-700 transition-colors"
                  >
                    <div className="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200/60 shadow-2xs">
                      <Presentation className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 leading-tight">PowerPoint (PPTX)</div>
                      <div className="text-[10px] text-slate-500 font-normal">Presentations &amp; slide decks</div>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* 4. Video Tools Dropdown */}
          <div
            className="relative"
            ref={videoRef}
            onMouseEnter={() => handleMouseEnter('video')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              onClick={() => setActiveDropdown(activeDropdown === 'video' ? null : 'video')}
              aria-expanded={activeDropdown === 'video'}
              aria-haspopup="true"
              className={getNavLinkClass(isVideoActive, activeDropdown === 'video')}
            >
              <span>Video<span className="hidden xl:inline">&nbsp;Tools</span></span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 shrink-0 ${
                  activeDropdown === 'video' ? 'rotate-180' : ''
                } ${isVideoActive ? 'text-white/90' : 'text-slate-400 group-hover:text-blue-600'}`}
              />
            </button>

            {activeDropdown === 'video' && (
              <div
                className="absolute left-0 mt-2.5 w-60 rounded-2xl glass-dropdown-3d p-2 z-50 animate-in fade-in zoom-in-95 duration-150 shadow-xl border border-white before:content-[''] before:absolute before:-top-3 before:left-0 before:right-0 before:h-3"
                onMouseEnter={() => {
                  if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
                }}
                onMouseLeave={handleMouseLeave}
              >
                <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Video Compression Tools
                </div>
                <div className="space-y-0.5">
                  <Link
                    href="/mp4-compressor"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-blue-50/90 hover:text-blue-700 transition-colors"
                  >
                    <div className="w-6 h-6 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-200/60 shadow-2xs">
                      <Film className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 leading-tight">MP4 Compressor</div>
                      <div className="text-[10px] text-slate-500 font-normal">Web, Discord &amp; email video</div>
                    </div>
                  </Link>

                  <Link
                    href="/mov-compressor"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-blue-50/90 hover:text-blue-700 transition-colors"
                  >
                    <div className="w-6 h-6 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center border border-violet-200/60 shadow-2xs">
                      <Film className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 leading-tight">MOV Compressor</div>
                      <div className="text-[10px] text-slate-500 font-normal">Apple QuickTime footage</div>
                    </div>
                  </Link>
                </div>

                <div className="border-t border-slate-100 my-1.5" />
                <Link
                  href="/video-compressor"
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-purple-700 hover:bg-purple-50 transition-colors"
                >
                  <span>All Video Formats</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>

          {/* 5. Audio Tools Dropdown */}
          <div
            className="relative"
            ref={audioRef}
            onMouseEnter={() => handleMouseEnter('audio')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              onClick={() => setActiveDropdown(activeDropdown === 'audio' ? null : 'audio')}
              aria-expanded={activeDropdown === 'audio'}
              aria-haspopup="true"
              className={getNavLinkClass(isAudioActive, activeDropdown === 'audio')}
            >
              <span>Audio<span className="hidden xl:inline">&nbsp;Tools</span></span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 shrink-0 ${
                  activeDropdown === 'audio' ? 'rotate-180' : ''
                } ${isAudioActive ? 'text-white/90' : 'text-slate-400 group-hover:text-blue-600'}`}
              />
            </button>

            {activeDropdown === 'audio' && (
              <div
                className="absolute left-0 mt-2.5 w-60 rounded-2xl glass-dropdown-3d p-2 z-50 animate-in fade-in zoom-in-95 duration-150 shadow-xl border border-white before:content-[''] before:absolute before:-top-3 before:left-0 before:right-0 before:h-3"
                onMouseEnter={() => {
                  if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
                }}
                onMouseLeave={handleMouseLeave}
              >
                <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Audio Compression Tools
                </div>
                <div className="space-y-0.5">
                  <Link
                    href="/mp3-compressor"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-blue-50/90 hover:text-blue-700 transition-colors"
                  >
                    <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200/60 shadow-2xs">
                      <Music className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 leading-tight">MP3 Compressor</div>
                      <div className="text-[10px] text-slate-500 font-normal">MPEG Layer III audio</div>
                    </div>
                  </Link>

                  <Link
                    href="/wav-compressor"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-blue-50/90 hover:text-blue-700 transition-colors"
                  >
                    <div className="w-6 h-6 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-200/60 shadow-2xs">
                      <Music className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 leading-tight">WAV Compressor</div>
                      <div className="text-[10px] text-slate-500 font-normal">Uncompressed PCM tracks</div>
                    </div>
                  </Link>
                </div>

                <div className="border-t border-slate-100 my-1.5" />
                <Link
                  href="/audio-compressor"
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-emerald-700 hover:bg-emerald-50 transition-colors"
                >
                  <span>All Audio Formats</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>

          {/* 6. Other Tools Dropdown */}
          <div
            className="relative"
            ref={otherRef}
            onMouseEnter={() => handleMouseEnter('other')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              onClick={() => setActiveDropdown(activeDropdown === 'other' ? null : 'other')}
              aria-expanded={activeDropdown === 'other'}
              aria-haspopup="true"
              className={getNavLinkClass(isOtherActive, activeDropdown === 'other')}
            >
              <span>Other<span className="hidden xl:inline">&nbsp;Tools</span></span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 shrink-0 ${
                  activeDropdown === 'other' ? 'rotate-180' : ''
                } ${isOtherActive ? 'text-white/90' : 'text-slate-400 group-hover:text-blue-600'}`}
              />
            </button>

            {activeDropdown === 'other' && (
              <div
                className="absolute right-0 mt-2.5 w-56 rounded-2xl glass-dropdown-3d p-2 z-50 animate-in fade-in zoom-in-95 duration-150 shadow-xl border border-white before:content-[''] before:absolute before:-top-3 before:left-0 before:right-0 before:h-3"
                onMouseEnter={() => {
                  if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
                }}
                onMouseLeave={handleMouseLeave}
              >
                <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Archives &amp; Utilities
                </div>
                <div className="space-y-0.5">
                  <Link
                    href="/zip-compressor"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-blue-50/90 hover:text-blue-700 transition-colors"
                  >
                    <div className="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200/60 shadow-2xs">
                      <Archive className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 leading-tight">ZIP Compressor</div>
                      <div className="text-[10px] text-slate-500 font-normal">Pack files with DEFLATE</div>
                    </div>
                  </Link>

                  <Link
                    href="/"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-blue-50/90 hover:text-blue-700 transition-colors"
                  >
                    <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200/60 shadow-2xs">
                      <FileArchive className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 leading-tight">Universal Compressor</div>
                      <div className="text-[10px] text-slate-500 font-normal">Multi-format workspace</div>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Right Section: Desktop Guide Action Button (Balances Logo on Left) */}
        <div className="hidden lg:flex items-center shrink-0">
          <Link
            href="/how-to-compress-files"
            className={`h-9 px-3 xl:px-4 inline-flex items-center gap-1.5 rounded-full text-xs font-semibold select-none transition-all duration-150 ${
              pathname === '/how-to-compress-files'
                ? 'bg-blue-600 text-white shadow-[0_2px_6px_rgba(37,99,235,0.2)] border border-blue-500/40'
                : 'text-slate-700 hover:text-blue-700 hover:bg-blue-50/80 border border-slate-200/80 bg-white/70 shadow-2xs hover:shadow-xs'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-600" />
            <span>Guide</span>
          </Link>
        </div>

        {/* Mobile Menu Toggle Button (Visible only on mobile/tablet) */}
        <div className="flex lg:hidden items-center shrink-0">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="h-9 w-9 inline-flex items-center justify-center rounded-full text-slate-800 hover:bg-blue-50/80 border border-slate-200/80 shadow-2xs focus-visible:ring-2 focus-visible:ring-blue-600 transition-colors"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* MOBILE RESPONSIVE FLOATING GLASS PANEL */}
      {/* ============================================================ */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 rounded-3xl glass-dropdown-3d p-4 sm:p-5 space-y-4 max-h-[82vh] overflow-y-auto shadow-2xl animate-in slide-in-from-top-2 duration-200 border border-white">
          {/* Quick Primary Links (Home & Guide) */}
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl text-xs font-bold transition-all ${
                pathname === '/'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white/80 text-slate-800 border border-slate-200/80 hover:bg-blue-50'
              }`}
            >
              <span>Home</span>
            </Link>
            <Link
              href="/how-to-compress-files"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl text-xs font-bold transition-all ${
                pathname === '/how-to-compress-files'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white/80 text-slate-800 border border-slate-200/80 hover:bg-blue-50'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              <span>Guide</span>
            </Link>
          </div>

          {/* Privacy Statement Banner */}
          <div className="py-2.5 flex items-center gap-2.5 text-xs font-semibold text-emerald-800 bg-emerald-50/90 px-3.5 rounded-2xl border border-emerald-200/80 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Files are processed locally in your browser with 100% privacy</span>
          </div>

          {/* Tool Categories */}
          <div className="space-y-4">
            {/* Image Tools */}
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-1 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                <span>Image Tools</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { href: '/svg-compressor', label: 'SVG', icon: FileCode },
                  { href: '/webp-compressor', label: 'WebP', icon: ImageIcon },
                  { href: '/png-compressor', label: 'PNG', icon: ImageIcon },
                  { href: '/tiff-compressor', label: 'TIFF', icon: Layers },
                  { href: '/gif-compressor', label: 'GIF', icon: Sparkles },
                  { href: '/image-compressor', label: 'All Images', icon: ImageIcon },
                ].map((item) => {
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
                          : 'text-slate-700 bg-white/70 hover:bg-blue-50 border border-slate-200/70'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-blue-600'}`} />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Document Tools */}
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-1 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-rose-600" />
                <span>Document Tools</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { href: '/pdf-compressor', label: 'PDF', icon: FileText },
                  { href: '/word-compressor', label: 'Word (DOCX)', icon: FileText },
                  { href: '/excel-compressor', label: 'Excel (XLSX)', icon: FileSpreadsheet },
                  { href: '/powerpoint-compressor', label: 'PowerPoint', icon: Presentation },
                ].map((item) => {
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
                          : 'text-slate-700 bg-white/70 hover:bg-blue-50 border border-slate-200/70'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-blue-600'}`} />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Video Tools */}
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-1 flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5 text-purple-600" />
                <span>Video Tools</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { href: '/mp4-compressor', label: 'MP4', icon: Film },
                  { href: '/mov-compressor', label: 'MOV', icon: Film },
                  { href: '/video-compressor', label: 'All Video', icon: Film },
                ].map((item) => {
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
                          : 'text-slate-700 bg-white/70 hover:bg-blue-50 border border-slate-200/70'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-purple-600'}`} />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Audio Tools */}
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-1 flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5 text-emerald-600" />
                <span>Audio Tools</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { href: '/mp3-compressor', label: 'MP3', icon: Music },
                  { href: '/wav-compressor', label: 'WAV', icon: Music },
                  { href: '/audio-compressor', label: 'All Audio', icon: Music },
                ].map((item) => {
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
                          : 'text-slate-700 bg-white/70 hover:bg-blue-50 border border-slate-200/70'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-emerald-600'}`} />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Other Tools */}
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-1 flex items-center gap-1.5">
                <Archive className="w-3.5 h-3.5 text-indigo-600" />
                <span>Other Tools</span>
              </div>
              <Link
                href="/zip-compressor"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold transition-all ${
                  pathname === '/zip-compressor'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-700 bg-white/70 hover:bg-blue-50 border border-slate-200/70'
                }`}
              >
                <Archive className={`w-3.5 h-3.5 shrink-0 ${pathname === '/zip-compressor' ? 'text-white' : 'text-blue-600'}`} />
                <span>ZIP Compressor (Archive)</span>
              </Link>
            </div>
          </div>

          {/* Footer Navigation Links */}
          <div className="border-t border-slate-200/80 pt-3 flex flex-wrap justify-between text-xs font-semibold text-slate-600 px-1">
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
            <Link href="/terms" onClick={() => setMobileMenuOpen(false)} className="hover:text-blue-600">
              Terms
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
