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
  Layers,
  ShieldCheck,
  RotateCcw,
  Trash2,
  FileImage,
  Info,
} from 'lucide-react';
import {
  compressTiff,
  inspectTiffFile,
  TiffSettings,
} from '@/lib/compression/tiffCompressor';
import { formatBytes, formatReduction } from '@/lib/utils/formatters';
import { compareFileSizes } from '@/lib/compression/file-size';
import { CompressionOutcome } from '@/lib/compression/types';

interface TiffQueueItem {
  id: string;
  file: File;
  name: string;
  originalSize: number;
  compressedSize: number | null;
  compressedBlob: Blob | null;
  status: 'idle' | 'processing' | 'completed' | 'larger' | 'error';
  statusMessage?: string;
  progress: number;
  savingsBytes: number | null;
  reductionPercent: number | null;
  durationMs: number | null;
  previewUrl: string | null;
  pageCount?: number;
  width?: number;
  height?: number;
  outcome?: CompressionOutcome;
  errorMessage?: string;
  warnings?: string[];
}

export function TiffWorkspace() {
  const [items, setItems] = useState<TiffQueueItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [settings, setSettings] = useState<TiffSettings>({
    compression: 'deflate',
    scale: 1.0,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const objectUrlsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      objectUrlsRef.current.clear();
    };
  }, []);

  const handleAddFiles = async (files: FileList | File[]) => {
    const validTiffs = Array.from(files).filter((f) => {
      const lower = f.name.toLowerCase();
      return (
        f.type === 'image/tiff' ||
        lower.endsWith('.tiff') ||
        lower.endsWith('.tif')
      );
    });

    if (validTiffs.length === 0) return;

    const newItems: TiffQueueItem[] = [];

    for (const file of validTiffs) {
      const inspection = await inspectTiffFile(file);
      newItems.push({
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        file,
        name: file.name,
        originalSize: file.size,
        compressedSize: null,
        compressedBlob: null,
        status: inspection.isValid ? 'idle' : 'error',
        progress: 0,
        savingsBytes: null,
        reductionPercent: null,
        durationMs: null,
        previewUrl: inspection.previewDataUrl || null,
        pageCount: inspection.pageCount || 1,
        width: inspection.width,
        height: inspection.height,
        errorMessage: inspection.isValid ? undefined : (inspection.error || 'Invalid TIFF file'),
      });
    }

    setItems((prev) => [...prev, ...newItems]);
  };

  const handleProcessItem = async (item: TiffQueueItem) => {
    setItems((prev) =>
      prev.map((it) =>
        it.id === item.id
          ? { ...it, status: 'processing', progress: 10, statusMessage: 'Reading TIFF...', errorMessage: undefined }
          : it
      )
    );

    try {
      const result = await compressTiff(item.file, settings, (progress, status) => {
        setItems((prev) =>
          prev.map((it) =>
            it.id === item.id ? { ...it, progress, statusMessage: status } : it
          )
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
                statusMessage: undefined,
                progress: 100,
                compressedSize: result.compressedSize,
                compressedBlob: result.blob,
                previewUrl: it.previewUrl,
                savingsBytes: comparison.savedBytes,
                reductionPercent: comparison.reductionPercent,
                durationMs: result.durationMs,
                width: result.width,
                height: result.height,
                pageCount: result.pageCount,
                outcome,
                warnings: result.warnings,
              }
            : it
        )
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to compress TIFF image.';
      setItems((prev) =>
        prev.map((it) =>
          it.id === item.id ? { ...it, status: 'error', progress: 0, errorMessage: msg } : it
        )
      );
    }
  };

  const handleProcessAll = async () => {
    const idleItems = items.filter((it) => it.status === 'idle');
    for (const item of idleItems) {
      await handleProcessItem(item);
    }
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
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
          accept="image/tiff,.tiff,.tif"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) handleAddFiles(e.target.files);
            e.target.value = '';
          }}
        />

        <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-200/80 text-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
          <FileImage className="w-7 h-7" />
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 tracking-tight">
          Drop TIFF images here or browse your device
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6">
          Losslessly compress single and multi-page TIFF files using Deflate stream compression. 100% private in-browser execution.
        </p>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all"
        >
          Select TIFF Files
        </button>
      </div>

      {/* Compression Controls */}
      <div className="glass-panel-elevated p-6 rounded-2xl space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-200/70 pb-3">
          <Sliders className="w-4 h-4 text-indigo-600" />
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">
            TIFF Compression Settings
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Compression Mode */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Compression Algorithm
            </label>
            <select
              value={settings.compression}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  compression: e.target.value as 'deflate' | 'raw',
                })
              }
              className="w-full text-xs rounded-xl border border-slate-300 bg-white/90 p-2.5 font-medium text-slate-800 focus:outline-blue-500"
            >
              <option value="deflate">Deflate / Adobe ZIP (Lossless, up to 80% reduction)</option>
              <option value="raw">Uncompressed Raw (Standard baseline TIFF)</option>
            </select>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Deflate compresses pixel strips losslessly without altering image data.
            </span>
          </div>

          {/* Dimension Scaling */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Dimensions &amp; Scaling
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
              <option value={1.0}>100% (Original Resolution)</option>
              <option value={0.75}>75% (3/4 Scale – Downscale oversized scans)</option>
              <option value={0.5}>50% (Half Dimensions – 75% fewer pixels)</option>
            </select>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Applied proportionally across all pages in multi-page TIFFs.
            </span>
          </div>
        </div>
      </div>

      {/* Queue & Results */}
      {items.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              TIFF Images to Compress ({items.length})
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
                  <div className="w-14 h-14 rounded-xl overflow-hidden border border-slate-200 shrink-0 relative flex items-center justify-center bg-slate-100 p-1">
                    {item.previewUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.previewUrl}
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <FileImage className="w-6 h-6 text-slate-400" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-900 truncate max-w-xs sm:max-w-sm">
                      {item.name}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span>{formatBytes(item.originalSize)}</span>
                      {item.pageCount && item.pageCount > 1 && (
                        <span className="inline-block px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 font-semibold text-[10px]">
                          {item.pageCount} pages
                        </span>
                      )}
                      {item.width && item.height ? (
                        <span>({item.width} &times; {item.height})</span>
                      ) : null}
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
                      <p className="text-[11px] text-amber-700 font-medium mt-1 max-w-sm sm:max-w-md">
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
                      <span>{item.statusMessage || `${item.progress}%`}</span>
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
                        Already compressed ({formatBytes(item.compressedSize || 0)})
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
                          href={URL.createObjectURL(item.compressedBlob)}
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
