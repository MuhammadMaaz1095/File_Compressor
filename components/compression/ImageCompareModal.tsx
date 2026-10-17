'use client';

import React, { useEffect, useState, useRef } from 'react';
import { X, Image as ImageIcon, Loader2, AlertCircle } from 'lucide-react';
import { QueueItem } from '@/lib/compression/types';
import { formatBytes, formatReduction } from '@/lib/utils/formatters';

interface ImageCompareModalProps {
  item: QueueItem | null;
  onClose: () => void;
}

export function ImageCompareModal({ item, onClose }: ImageCompareModalProps) {
  const [sliderPos, setSliderPos] = useState(50); // percentage 0 - 100
  const [originalSrc, setOriginalSrc] = useState<string>('');
  const [compressedSrc, setCompressedSrc] = useState<string>('');
  const [origLoaded, setOrigLoaded] = useState(false);
  const [compLoaded, setCompLoaded] = useState(false);
  const [origError, setOrigError] = useState(false);
  const [compError, setCompError] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const createdUrlsRef = useRef<string[]>([]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Resolve and validate image URLs
  useEffect(() => {
    if (!item) return;

    setOrigLoaded(false);
    setCompLoaded(false);
    setOrigError(false);
    setCompError(false);

    let oUrl = item.previewUrl;
    if (!oUrl && item.file) {
      try {
        oUrl = URL.createObjectURL(item.file);
        createdUrlsRef.current.push(oUrl);
      } catch {
        setOrigError(true);
      }
    }

    let cUrl = item.compressedPreviewUrl;
    if (!cUrl && item.compressedBlob) {
      try {
        cUrl = URL.createObjectURL(item.compressedBlob);
        createdUrlsRef.current.push(cUrl);
      } catch {
        setCompError(true);
      }
    }

    setOriginalSrc(oUrl || '');
    setCompressedSrc(cUrl || '');

    return () => {
      createdUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      createdUrlsRef.current = [];
    };
  }, [item]);

  // Pointer drag handling across comparison canvas
  const updateSliderFromClientX = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    if (rect.width <= 0) return;
    const offsetX = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (offsetX / rect.width) * 100));
    setSliderPos(Math.round(pct));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    updateSliderFromClientX(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    isDraggingRef.current = true;
    if (e.touches[0]) {
      updateSliderFromClientX(e.touches[0].clientX);
    }
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      updateSliderFromClientX(e.clientX);
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current) return;
      if (e.touches[0]) {
        updateSliderFromClientX(e.touches[0].clientX);
      }
    };

    const onTouchEnd = () => {
      isDraggingRef.current = false;
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  if (!item) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="compare-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-4xl max-h-[94vh] flex flex-col bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <ImageIcon className="w-4 h-4" />
            </div>
            <h3 id="compare-modal-title" className="text-base font-extrabold text-[#14213D] truncate">
              Image Comparison: {item.name}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close comparison modal"
            className="p-2 rounded-xl text-slate-400 hover:text-[#14213D] hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 gap-4 px-6 py-3 bg-blue-50/50 border-b border-blue-100/70 text-xs text-[#14213D] shrink-0">
          <div>
            <span className="font-bold text-[#61728F] uppercase tracking-wider block text-[10px]">
              Original
            </span>
            <span className="font-extrabold text-[#14213D] text-sm">
              {formatBytes(item.originalSize)}
            </span>
            {item.width && item.height && (
              <span className="text-[#61728F] ml-2 font-medium">
                ({item.width} &times; {item.height}px)
              </span>
            )}
          </div>

          <div className="text-right">
            <span className="font-bold text-blue-600 uppercase tracking-wider block text-[10px]">
              Compressed
            </span>
            <span className="font-extrabold text-[#14213D] text-sm">
              {formatBytes(item.compressedSize || 0)}
            </span>
            {item.reductionPercent !== null && item.reductionPercent > 0 ? (
              <span className="ml-2 font-extrabold text-emerald-600">
                {formatReduction(item.reductionPercent)}
              </span>
            ) : item.increasePercent ? (
              <span className="ml-2 font-extrabold text-amber-600">
                +{Math.round(item.increasePercent)}%
              </span>
            ) : null}
            {item.compressedWidth && item.compressedHeight && (
              <span className="text-[#61728F] ml-2 font-medium">
                ({item.compressedWidth} &times; {item.compressedHeight}px)
              </span>
            )}
          </div>
        </div>

        {/* Comparison Body - Split view canvas */}
        <div className="relative flex-1 w-full min-h-[360px] sm:min-h-[480px] max-h-[62vh] bg-slate-900/95 flex flex-col items-center justify-center overflow-hidden select-none p-4 sm:p-6">
          {/* Sized Inner Container - Crucial: explicit height guarantees non-collapsing layout */}
          <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            className="relative w-full h-[320px] sm:h-[440px] max-w-3xl flex items-center justify-center cursor-ew-resize select-none overflow-hidden rounded-xl border border-white/10 shadow-2xl bg-black/40"
          >
            {/* Loading Indicator */}
            {!origLoaded && !compLoaded && !origError && !compError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-xs z-30 pointer-events-none">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
                <span className="text-xs text-white/90 font-semibold tracking-wide">
                  Loading comparison images...
                </span>
              </div>
            )}

            {/* Error notifications */}
            {origError && (
              <div className="absolute top-4 left-4 flex items-center gap-2 p-2.5 rounded-lg bg-rose-600/90 text-white text-xs z-30 shadow-md">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Failed to load original image</span>
              </div>
            )}
            {compError && (
              <div className="absolute top-4 right-4 flex items-center gap-2 p-2.5 rounded-lg bg-amber-600/90 text-white text-xs z-30 shadow-md">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Failed to load compressed image</span>
              </div>
            )}

            {/* Layer 1: Original Image (Base Layer) */}
            <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none">
              {originalSrc && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={originalSrc}
                  alt="Original Preview"
                  onLoad={() => setOrigLoaded(true)}
                  onError={() => setOrigError(true)}
                  className="w-full h-full object-contain pointer-events-none select-none transition-opacity duration-200"
                  style={{ opacity: origLoaded ? 1 : 0 }}
                />
              )}
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md text-white text-[10px] font-extrabold tracking-wider uppercase border border-white/20 shadow-md pointer-events-none z-10">
                Original
              </span>
            </div>

            {/* Layer 2: Compressed Image (Overlay clipped by slider percentage) */}
            <div
              className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none overflow-hidden"
              style={{
                clipPath: `inset(0 0 0 ${sliderPos}%)`,
                WebkitClipPath: `inset(0 0 0 ${sliderPos}%)`,
              }}
            >
              {compressedSrc && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={compressedSrc}
                  alt="Compressed Preview"
                  onLoad={() => setCompLoaded(true)}
                  onError={() => setCompError(true)}
                  className="w-full h-full object-contain pointer-events-none select-none transition-opacity duration-200"
                  style={{ opacity: compLoaded ? 1 : 0 }}
                />
              )}
              <span className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-blue-600/90 backdrop-blur-md text-white text-[10px] font-extrabold tracking-wider uppercase border border-white/20 shadow-md pointer-events-none z-10">
                Compressed
              </span>
            </div>

            {/* Slider Divider Line */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white shadow-2xl pointer-events-none z-20"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white shadow-xl border border-slate-300 flex items-center justify-center text-slate-800 text-xs font-black cursor-ew-resize">
                &#8596;
              </div>
            </div>
          </div>

          <div className="mt-3 text-center text-[11px] text-slate-400 font-medium">
            Drag the handle or click anywhere on the image to compare fine details
          </div>
        </div>

        {/* Slider control bar */}
        <div className="px-6 py-4 bg-white border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 w-full sm:w-80">
            <span className="text-xs text-[#61728F] font-semibold shrink-0">Slide to compare:</span>
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPos}
              onChange={(e) => setSliderPos(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              aria-label="Image comparison split slider"
            />
            <span className="text-xs font-bold text-blue-600 min-w-[36px] text-right">
              {sliderPos}%
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#14213D] text-xs font-bold transition-colors self-end sm:self-auto"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}
