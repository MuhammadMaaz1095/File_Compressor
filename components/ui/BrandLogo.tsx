'use client';

import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: number;
  showWordmark?: boolean;
  inverted?: boolean; // For dark footer or dark backgrounds
}

export function BrandLogo({
  className = '',
  size = 38,
  showWordmark = true,
  inverted = false,
}: BrandLogoProps) {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Transparent Scalable Vector Brand Icon */}
      <div
        className="relative shrink-0 flex items-center justify-center transition-transform duration-200 group-hover:scale-105"
        style={{ width: size, height: (size * 48) / 52 }}
      >
        <svg
          viewBox="0 0 52 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_4px_12px_rgba(37,99,235,0.28)]"
          aria-hidden="true"
        >
          <defs>
            {/* Main File Gradient: Vibrant Cyan to Royal Blue */}
            <linearGradient id="fc-doc-grad" x1="6" y1="3" x2="34" y2="45" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="40%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#1D4ED8" />
            </linearGradient>

            {/* Fold Corner Gradient */}
            <linearGradient id="fc-fold-grad" x1="24.5" y1="3" x2="34.5" y2="13" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#BAE6FD" />
              <stop offset="100%" stopColor="#60A5FA" />
            </linearGradient>

            {/* Dynamic Arrow Gradient */}
            <linearGradient id="fc-arrow-grad" x1="32" y1="19.5" x2="48" y2="34.5" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="55%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#1E40AF" />
            </linearGradient>

            {/* Soft Ambient Inner Glow */}
            <filter id="fc-inner-glow" x="-20%" y="-20%" width="140%" height="140%" filterUnits="userSpaceOnUse">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#1D4ED8" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* Document Sheet Base */}
          <path
            d="M7 8.5C7 5.46243 9.46243 3 12.5 3H24.5L34.5 13V39.5C34.5 42.5376 32.0376 45 29 45H12.5C9.46243 45 7 42.5376 7 39.5V8.5Z"
            fill="url(#fc-doc-grad)"
            filter="url(#fc-inner-glow)"
          />

          {/* Top-Right Page Fold */}
          <path
            d="M24.5 3V11C24.5 12.1046 25.3954 13 26.5 13H34.5L24.5 3Z"
            fill="url(#fc-fold-grad)"
          />

          {/* File Text Skeleton Lines */}
          <rect x="11.5" y="9.5" width="8.5" height="2.2" rx="1.1" fill="#FFFFFF" fillOpacity="0.9" />
          <rect x="11.5" y="14" width="6.5" height="2.2" rx="1.1" fill="#FFFFFF" fillOpacity="0.9" />

          {/* Compression Zipper Mechanism */}
          <rect x="19.75" y="19" width="2.5" height="19" rx="1.25" fill="#FFFFFF" fillOpacity="0.95" />
          <rect x="16.5" y="21" width="9" height="2" rx="1" fill="#FFFFFF" />
          <rect x="17.5" y="24.5" width="7" height="2" rx="1" fill="#FFFFFF" />
          <rect x="16.5" y="28" width="9" height="2" rx="1" fill="#FFFFFF" />
          <rect x="17.5" y="31.5" width="7" height="2" rx="1" fill="#FFFFFF" />
          {/* Zipper Pull Tab */}
          <rect x="19" y="35" width="4" height="6.5" rx="2" fill="#FFFFFF" />
          <circle cx="21" cy="39" r="1.1" fill="#1D4ED8" />

          {/* Motion Flow Streaks */}
          <rect x="29" y="22" width="6" height="2" rx="1" fill="#38BDF8" fillOpacity="0.8" />
          <rect x="27" y="26" width="9" height="2.2" rx="1.1" fill="#60A5FA" fillOpacity="0.9" />
          <rect x="29" y="30" width="7" height="2" rx="1" fill="#38BDF8" fillOpacity="0.8" />

          {/* Modern Fast-Compression Arrow */}
          <path
            d="M36 19.5L48 27L36 34.5V29.5H32V24.5H36V19.5Z"
            fill="url(#fc-arrow-grad)"
            filter="url(#fc-inner-glow)"
          />
        </svg>
      </div>

      {/* Typography Wordmark */}
      {showWordmark && (
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-1.5 leading-none">
            <span
              className={`text-xl font-extrabold tracking-tight transition-colors ${
                inverted
                  ? 'text-white group-hover:text-blue-300'
                  : 'text-[#0F172A] group-hover:text-blue-600'
              }`}
            >
              File<span className="text-blue-500">Compress</span>
            </span>
            {!inverted && (
              <span
                aria-hidden="true"
                className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200/80 shrink-0 leading-none"
              >
                Client-Side
              </span>
            )}
          </div>
          <span
            aria-hidden="true"
            className={`text-[10px] mt-0.5 font-medium tracking-normal leading-tight ${
              inverted ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            Fast &amp; Private Browser Optimizer
          </span>
        </div>
      )}
    </div>
  );
}
