'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Play,
  Download,
  AlertCircle,
  Sliders,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  Trash2,
  FileCode,
  Info,
} from 'lucide-react';
import { compressSvg, SvgSettings, SvgPreset } from '@/lib/compression/svgCompressor';
import { formatBytes, formatReduction } from '@/lib/utils/formatters';
import { compareFileSizes } from '@/lib/compression/file-size';
import { CompressionOutcome } from '@/lib/compression/types';

interface SvgQueueItem {
  id: string;
  file: File;
  name: string;
  originalSize: number;
  compressedSize: number | null;
  compressedBlob: Blob | null;
  status: 'idle' | 'processing' | 'completed' | 'larger' | 'error';
  progress: number;
  savingsBytes: number | null;
  reductionPercent: number | null;
  durationMs: number | null;
  previewUrl: string;
  compressedPreviewUrl: string | null;
  outcome?: CompressionOutcome;
  errorMessage?: string;
  warnings?: string[];
}

export function SvgWorkspace() {
  const [items, setItems] = useState<SvgQueueItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [settings, setSettings] = useState<SvgSettings>({
    preset: 'balanced',
    multipass: true,
    floatPrecision: 3,
    removeViewBox: false,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const objectUrlsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      objectUrlsRef.current.clear();
    };
  }, []);

  const handleAddFiles = (files: FileList | File[]) => {
    const validSvgs = Array.from(files).filter(
      (f) => f.type === 'image/svg+xml' || f.name.toLowerCase().endsWith('.svg')
    );

    if (validSvgs.length === 0) return;

    const newItems: SvgQueueItem[] = validSvgs.map((file) => {
      const url = URL.createObjectURL(file);
      objectUrlsRef.current.add(url);

      return {
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        file,
        name: file.name,
        originalSize: file.size,
        compressedSize: null,
        compressedBlob: null,
        status: 'idle',
        progress: 0,
        savingsBytes: null,
        reductionPercent: null,
        durationMs: null,
        previewUrl: url,
        compressedPreviewUrl: null,
      };
    });

    setItems((prev) => [...prev, ...newItems]);
  };

  const handleProcessItem = async (item: SvgQueueItem) => {
    setItems((prev) =>
      prev.map((it) =>
        it.id === item.id ? { ...it, status: 'processing', progress: 15, errorMessage: undefined } : it
      )
    );

    try {
      const result = await compressSvg(item.file, settings, (progress) => {
        setItems((prev) =>
          prev.map((it) => (it.id === item.id ? { ...it, progress } : it))
        );
      });

      const outUrl = URL.createObjectURL(result.blob);
      objectUrlsRef.current.add(outUrl);

      const comparison = compareFileSizes(item.originalSize, result.compressedSize);
      const outcome = comparison.outcome;

      setItems((prev) =>
        prev.map((it) =>
          it.id === item.id
            ? {
                ...it,
                status: outcome === 'larger' ? 'larger' : 'completed',
                progress: 100,
                compressedSize: result.compressedSize,
                compressedBlob: result.blob,
                compressedPreviewUrl: outUrl,
                savingsBytes: comparison.savedBytes,
                reductionPercent: comparison.reductionPercent,
                durationMs: result.durationMs,
                outcome,
                warnings: result.warnings,
              }
            : it
        )
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to optimize SVG markup.';
      setItems((prev) =>
        prev.map((it) =>
          it.id === item.id ? { ...it, status: 'error', progress: 0, errorMessage: msg } : it
        )
      );
    }
  };

  const handleProcessAll = async () => {
    const idleItems = items.filter((it) => it.status === 'idle' || it.status === 'error');
    for (const item of idleItems) {
      await handleProcessItem(item);
    }
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => {
      const toRemove = prev.find((it) => it.id === id);
      if (toRemove?.previewUrl) {
        URL.revokeObjectURL(toRemove.previewUrl);
        objectUrlsRef.current.delete(toRemove.previewUrl);
      }
      if (toRemove?.compressedPreviewUrl) {
        URL.revokeObjectURL(toRemove.compressedPreviewUrl);
        objectUrlsRef.current.delete(toRemove.compressedPreviewUrl);
      }
      return prev.filter((it) => it.id !== id);
    });
  };

  const handleClearAll = () => {
    objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    objectUrlsRef.current.clear();
    setItems([]);
  };

  const isAnyProcessing = items.some((it) => it.status === 'processing');

  return (
    <div className="space-y-8">
      {/* Upload Dropzone */}
      <div
        className={`relative rounded-3xl border-2 border-dashed p-8 sm:p-12 text-center transition-all ${
          isDragging
            ? 'border-blue-500 bg-blue-50/50 scale-[1.01]'
            : 'border-slate-300 hover:border-slate-400 bg-white/60 shadow-sm'
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files) handleAddFiles(e.dataTransfer.files);
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/svg+xml,.svg"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) handleAddFiles(e.target.files);
            e.target.value = '';
          }}
        />

        <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
          <FileCode className="w-7 h-7" />
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 tracking-tight">
          Drop SVG files here or browse your device
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6">
          Strip redundant XML attributes, comments, and empty tags while strictly preserving viewBox, gradients, and vector crispness. 100% in-browser processing.
        </p>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all"
        >
          Select SVG Files
        </button>
      </div>

      {/* Optimization Controls */}
      <div className="glass-panel-elevated p-6 rounded-2xl space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-200/70 pb-3">
          <Sliders className="w-4 h-4 text-amber-600" />
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">
            SVG Optimization Settings
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Optimization Preset */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Optimization Level
            </label>
            <select
              value={settings.preset}
              onChange={(e) => {
                const preset = e.target.value as SvgPreset;
                setSettings({
                  ...settings,
                  preset,
                  floatPrecision: preset === 'aggressive' ? 2 : 3,
                });
              }}
              className="w-full text-xs rounded-xl border border-slate-300 bg-white/90 p-2.5 font-medium text-slate-800 focus:outline-blue-500"
            >
              <option value="balanced">Balanced (Recommended – cleans XML, retains IDs)</option>
              <option value="aggressive">Aggressive (Shrinks path coordinates to 2 decimals)</option>
              <option value="lossless">Lossless (Comments &amp; metadata only, 100% exact)</option>
            </select>
            <span className="text-[11px] text-slate-500 mt-1 block">
              {settings.preset === 'balanced'
                ? 'Safe for web icons, logos, and illustrations with gradient fills.'
                : settings.preset === 'aggressive'
                ? 'Maximum byte reduction by rounding coordinate floating points.'
                : 'Zero path changes. Only strips comments and unnecessary XML tags.'}
            </span>
          </div>

          {/* Coordinate Precision */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Coordinate Float Precision
            </label>
            <select
              disabled={settings.preset === 'lossless'}
              value={settings.floatPrecision}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  floatPrecision: Number(e.target.value),
                })
              }
              className={`w-full text-xs rounded-xl border border-slate-300 bg-white/90 p-2.5 font-medium text-slate-800 focus:outline-blue-500 ${
                settings.preset === 'lossless' ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <option value={1}>1 Decimal (Extreme simplification)</option>
              <option value={2}>2 Decimals (Compact coordinates)</option>
              <option value={3}>3 Decimals (Sub-pixel high accuracy)</option>
              <option value={4}>4 Decimals (Maximum curve fidelity)</option>
            </select>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Lower precision drops superfluous decimal digits from curves.
            </span>
          </div>

          {/* Security & Multi-pass */}
          <div className="flex flex-col justify-between">
            <div>
              <span className="block text-xs font-bold text-slate-700 mb-1.5">
                Security &amp; Sanitization
              </span>
              <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200/80 px-3 py-2 rounded-xl">
                <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>Active XSS &amp; Script Stripping</span>
              </div>
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Removes malicious scripts and event handlers automatically.
            </span>
          </div>
        </div>
      </div>

      {/* Queue & Results */}
      {items.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              SVGs to Optimize ({items.length})
            </h3>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleClearAll}
                disabled={isAnyProcessing}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-lg border border-slate-200"
              >
                Clear All
              </button>
              <button
                type="button"
                onClick={handleProcessAll}
                disabled={isAnyProcessing}
                className="inline-flex items-center gap-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg shadow-sm"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Optimize All</span>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="glass-card-3d p-4 rounded-2xl flex flex-col sm:flex-row items-center gap-4 justify-between"
              >
                {/* Left: Thumbnail & Name */}
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div
                    className="w-14 h-14 rounded-xl overflow-hidden border border-slate-200 shrink-0 relative flex items-center justify-center bg-slate-50 p-1.5"
                    style={{
                      backgroundImage:
                        'linear-gradient(45deg, #f1f5f9 25%, transparent 25%), linear-gradient(-45deg, #f1f5f9 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f1f5f9 75%), linear-gradient(-45deg, transparent 75%, #f1f5f9 75%)',
                      backgroundSize: '8px 8px',
                      backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px',
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.compressedPreviewUrl || item.previewUrl}
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-900 truncate max-w-xs sm:max-w-sm">
                      {item.name}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span>{formatBytes(item.originalSize)}</span>
                      {item.compressedSize !== null && (
                        <>
                          <span>&rarr;</span>
                          <span className="font-semibold text-slate-900">
                            {formatBytes(item.compressedSize)}
                          </span>
                        </>
                      )}
                    </div>
                    {item.warnings && item.warnings.length > 0 && (
                      <p className="text-[11px] text-amber-700 font-medium mt-1">
                        {item.warnings[0]}
                      </p>
                    )}
                  </div>
                </div>

                {/* Center: Status & Metrics */}
                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  {item.status === 'processing' && (
                    <div className="flex items-center gap-2 text-xs font-semibold text-blue-600">
                      <div className="w-4 h-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
                      <span>{item.progress}%</span>
                    </div>
                  )}

                  {item.status === 'completed' && item.reductionPercent !== null && (
                    <div className="text-right">
                      <span className="inline-block px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {formatReduction(item.reductionPercent)} saved
                      </span>
                    </div>
                  )}

                  {item.status === 'larger' && (
                    <div className="text-right">
                      <span className="inline-block px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        Already minimal ({formatBytes(item.compressedSize || 0)})
                      </span>
                    </div>
                  )}

                  {item.status === 'error' && (
                    <div className="flex items-center gap-1.5 text-xs text-rose-600 font-medium">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span className="truncate max-w-xs">{item.errorMessage}</span>
                    </div>
                  )}

                  {/* Right Actions */}
                  <div className="flex items-center gap-2">
                    {item.status === 'idle' && (
                      <button
                        type="button"
                        onClick={() => handleProcessItem(item)}
                        disabled={isAnyProcessing}
                        className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs"
                      >
                        Optimize
                      </button>
                    )}

                    {(item.status === 'completed' || item.status === 'larger') &&
                      item.compressedBlob && (
                        <a
                          href={item.compressedPreviewUrl || '#'}
                          download={`optimized-${item.name}`}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download</span>
                        </a>
                      )}

                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={item.status === 'processing'}
                      className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                    >
                      &times;
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
