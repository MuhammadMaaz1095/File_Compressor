'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Play,
  RotateCcw,
  Download,
  AlertCircle,
  Sliders,
  CheckCircle2,
  FileCheck,
  Zap,
  Layers,
  Sparkles,
} from 'lucide-react';
import { compressGif, GifSettings } from '@/lib/compression/gifCompressor';
import { formatBytes, formatReduction, formatDuration } from '@/lib/utils/formatters';
import { compareFileSizes } from '@/lib/compression/file-size';
import { CompressionOutcome } from '@/lib/compression/types';

interface GifQueueItem {
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
  width?: number;
  height?: number;
  outcome?: CompressionOutcome;
  errorMessage?: string;
  warnings?: string[];
}

export function GifWorkspace() {
  const [items, setItems] = useState<GifQueueItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [settings, setSettings] = useState<GifSettings>({
    preset: 'balanced',
    scale: 0.85,
    maxColors: 128,
    frameSkip: 1,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const objectUrlsRef = useRef<Set<string>>(new Set());

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      objectUrlsRef.current.clear();
    };
  }, []);

  const handleAddFiles = (files: FileList | File[]) => {
    const validGifs = Array.from(files).filter(
      (f) => f.type === 'image/gif' || f.name.toLowerCase().endsWith('.gif')
    );

    if (validGifs.length === 0) return;

    const newItems: GifQueueItem[] = validGifs.map((file) => {
      const url = URL.createObjectURL(file);
      objectUrlsRef.current.add(url);

      return {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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

  const handleProcessItem = async (item: GifQueueItem) => {
    setItems((prev) =>
      prev.map((it) =>
        it.id === item.id ? { ...it, status: 'processing', progress: 10, errorMessage: undefined } : it
      )
    );

    try {
      const result = await compressGif(item.file, settings, (progress) => {
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
                width: result.width,
                height: result.height,
                outcome,
                warnings: result.warnings,
              }
            : it
        )
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to compress GIF.';
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
      {/* Upload Zone */}
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
          accept="image/gif,.gif"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) handleAddFiles(e.target.files);
            e.target.value = '';
          }}
        />

        <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
          <Upload className="w-7 h-7" />
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 tracking-tight">
          Drop animated GIFs here or browse your device
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6">
          Optimize GIF animations, adjust color palettes, downscale dimensions, and preserve frame
          delays with 100% on-device processing.
        </p>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all"
        >
          Select GIF Files
        </button>
      </div>

      {/* Compression Controls */}
      <div className="glass-panel-elevated p-6 rounded-2xl space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-200/70 pb-3">
          <Sliders className="w-4 h-4 text-blue-600" />
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">
            GIF Optimization Settings
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Preset */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Compression Preset
            </label>
            <select
              value={settings.preset}
              onChange={(e) => {
                const val = e.target.value as 'balanced' | 'smaller' | 'quality';
                if (val === 'smaller') {
                  setSettings({
                    preset: 'smaller',
                    scale: 0.65,
                    maxColors: 64,
                    frameSkip: 1,
                  });
                } else if (val === 'quality') {
                  setSettings({
                    preset: 'quality',
                    scale: 1.0,
                    maxColors: 256,
                    frameSkip: 1,
                  });
                } else {
                  setSettings({
                    preset: 'balanced',
                    scale: 0.85,
                    maxColors: 128,
                    frameSkip: 1,
                  });
                }
              }}
              className="w-full text-xs rounded-xl border border-slate-300 bg-white/90 p-2.5 font-medium text-slate-800 focus:outline-blue-500"
            >
              <option value="balanced">Balanced (85% size, 128 colors)</option>
              <option value="smaller">Maximum Reduction (65% size, 64 colors)</option>
              <option value="quality">High Quality (100% size, 256 colors)</option>
            </select>
          </div>

          {/* Palette Size */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Color Palette (Quantization)
            </label>
            <select
              value={settings.maxColors}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  maxColors: Number(e.target.value) as 32 | 64 | 128 | 256,
                })
              }
              className="w-full text-xs rounded-xl border border-slate-300 bg-white/90 p-2.5 font-medium text-slate-800 focus:outline-blue-500"
            >
              <option value={256}>256 Colors (Maximum Fidelity)</option>
              <option value={128}>128 Colors (Recommended)</option>
              <option value={64}>64 Colors (High Compression)</option>
              <option value={32}>32 Colors (Extreme Byte Savings)</option>
            </select>
          </div>

          {/* Scale Resolution */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Dimension Scaling
            </label>
            <select
              value={settings.scale}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  scale: parseFloat(e.target.value),
                })
              }
              className="w-full text-xs rounded-xl border border-slate-300 bg-white/90 p-2.5 font-medium text-slate-800 focus:outline-blue-500"
            >
              <option value={1.0}>100% (Original Dimensions)</option>
              <option value={0.85}>85% (Subtle Scale)</option>
              <option value={0.75}>75% (3/4 Scale)</option>
              <option value={0.5}>50% (Half Dimensions, -75% Pixels)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Queue & Results */}
      {items.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Files to Compress ({items.length})
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
                <span>Compress All</span>
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
                  <div className="w-14 h-14 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0 relative flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.compressedPreviewUrl || item.previewUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
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
                        File grew ({formatBytes(item.compressedSize || 0)})
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
                        Compress
                      </button>
                    )}

                    {(item.status === 'completed' || item.status === 'larger') &&
                      item.compressedBlob && (
                        <a
                          href={item.compressedPreviewUrl || '#'}
                          download={`compressed-${item.name}`}
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
