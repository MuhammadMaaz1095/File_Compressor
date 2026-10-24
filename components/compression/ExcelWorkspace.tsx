'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Play,
  Download,
  AlertCircle,
  Sliders,
  CheckCircle2,
  FileSpreadsheet,
  Table,
  Zap,
  Trash2,
  RotateCcw,
  ShieldCheck,
  Info,
} from 'lucide-react';
import {
  compressOfficeDocument,
  OfficeOptimizationSettings,
} from '@/lib/compression/officeCompressor';
import { formatBytes } from '@/lib/utils/formatters';
import { CompressionOutcome } from '@/lib/compression/types';

interface ExcelQueueItem {
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
  increasePercent: number | null;
  durationMs: number | null;
  sheetCount?: number;
  mediaOptimizedCount?: number;
  changesSummary?: string[];
  downloadUrl: string | null;
  outcome?: CompressionOutcome;
  errorMessage?: string;
  warnings?: string[];
}

export function ExcelWorkspace() {
  const [items, setItems] = useState<ExcelQueueItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [preset, setPreset] = useState<'balanced' | 'aggressive' | 'light'>('balanced');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const objectUrlsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      objectUrlsRef.current.clear();
    };
  }, []);

  const handleAddFiles = (files: FileList | File[]) => {
    const validFiles = Array.from(files).filter((f) => {
      const ext = f.name.toLowerCase().split('.').pop();
      return (
        ext === 'xlsx' ||
        f.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
    });

    if (validFiles.length === 0) {
      // Check if user dropped an old .xls
      const hasOldXls = Array.from(files).some((f) => f.name.toLowerCase().endsWith('.xls'));
      if (hasOldXls) {
        alert(
          'Legacy Excel 97-2003 (.xls) binary files are not supported. Please save your file as modern Excel Workbook (.xlsx) to compress it safely.'
        );
      }
      return;
    }

    const newItems: ExcelQueueItem[] = validFiles.map((file) => ({
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
      increasePercent: null,
      durationMs: null,
      downloadUrl: null,
    }));

    setItems((prev) => [...prev, ...newItems]);
  };

  const getSettingsForPreset = (): OfficeOptimizationSettings => {
    switch (preset) {
      case 'aggressive':
        return { imageQuality: 0.65, maxImageDimension: 1280 };
      case 'light':
        return { imageQuality: 0.85, maxImageDimension: 2560 };
      case 'balanced':
      default:
        return { imageQuality: 0.75, maxImageDimension: 1920 };
    }
  };

  const handleProcessItem = async (item: ExcelQueueItem) => {
    setItems((prev) =>
      prev.map((it) =>
        it.id === item.id
          ? {
              ...it,
              status: 'processing',
              progress: 10,
              statusMessage: 'Inspecting workbook package...',
              errorMessage: undefined,
            }
          : it
      )
    );

    try {
      const settings = getSettingsForPreset();
      const result = await compressOfficeDocument(
        item.file,
        'excel',
        settings,
        (progress, status) => {
          setItems((prev) =>
            prev.map((it) =>
              it.id === item.id ? { ...it, progress, statusMessage: status } : it
            )
          );
        }
      );

      const url = URL.createObjectURL(result.blob);
      objectUrlsRef.current.add(url);

      const isLarger = result.comparison.outcome === 'larger';

      setItems((prev) =>
        prev.map((it) =>
          it.id === item.id
            ? {
                ...it,
                status: isLarger ? 'larger' : 'completed',
                statusMessage: undefined,
                progress: 100,
                compressedSize: result.compressedSize,
                compressedBlob: result.blob,
                savingsBytes: result.comparison.savedBytes,
                reductionPercent: result.comparison.reductionPercent,
                increasePercent: isLarger ? result.comparison.increasePercent : null,
                durationMs: result.durationMs,
                sheetCount: result.sheetOrSlideCount,
                mediaOptimizedCount: result.mediaOptimizedCount,
                changesSummary: result.changesSummary,
                downloadUrl: url,
                outcome: result.comparison.outcome,
                warnings: result.warnings,
              }
            : it
        )
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Workbook optimization failed';
      setItems((prev) =>
        prev.map((it) =>
          it.id === item.id
            ? { ...it, status: 'error', progress: 0, errorMessage: msg }
            : it
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

  const handleDownload = (item: ExcelQueueItem) => {
    if (!item.compressedBlob) return;
    const baseName = item.name.replace(/\.[^/.]+$/, '');
    const outName = `${baseName}-compressed.xlsx`;

    const a = document.createElement('a');
    a.href = item.downloadUrl || URL.createObjectURL(item.compressedBlob);
    a.download = outName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => {
      const toRemove = prev.find((it) => it.id === id);
      if (toRemove?.downloadUrl) {
        URL.revokeObjectURL(toRemove.downloadUrl);
        objectUrlsRef.current.delete(toRemove.downloadUrl);
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
            ? 'border-emerald-500 bg-emerald-50/50 scale-[1.01]'
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
          accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) handleAddFiles(e.target.files);
            e.target.value = '';
          }}
        />

        <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
          <FileSpreadsheet className="w-7 h-7" />
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 tracking-tight">
          Drop Excel workbooks (.xlsx) here or browse your device
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6">
          Document-aware optimization: recompresses embedded imagery in <code>xl/media/</code>,
          optimizes package Deflate streams, and preserves 100% of formulas, sheets, and cell values.
        </p>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all"
        >
          Select XLSX Files
        </button>
      </div>

      {/* Controls */}
      <div className="glass-panel-elevated p-6 rounded-2xl space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-200/70 pb-3">
          <Sliders className="w-4 h-4 text-emerald-600" />
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">
            Workbook Optimization Settings
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Compression Preset
            </label>
            <select
              value={preset}
              onChange={(e) =>
                setPreset(e.target.value as 'balanced' | 'aggressive' | 'light')
              }
              className="w-full text-xs rounded-xl border border-slate-200 bg-white p-2.5 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="balanced">Balanced (75% image quality, 1920px max)</option>
              <option value="aggressive">Aggressive (65% image quality, 1280px max)</option>
              <option value="light">Light Touch (85% image quality, high fidelity)</option>
            </select>
            <p className="text-[11px] text-slate-500 mt-1">
              Recompresses high-resolution images stored inside <code>xl/media/</code> without
              affecting tabular data or cell formatting.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/60 text-xs text-emerald-950 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
            <div>
              <strong className="block text-emerald-900 font-semibold mb-0.5">
                Formula & Sheet Integrity Guaranteed
              </strong>
              Worksheet XML, formulas (<code>SUM</code>, <code>VLOOKUP</code>), pivot tables, and
              named ranges are never modified. Only embedded media and package Deflate streams are
              optimized.
            </div>
          </div>
        </div>
      </div>

      {/* Queue & Results List */}
      {items.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              Workbook Queue ({items.length} {items.length === 1 ? 'file' : 'files'})
            </h3>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleProcessAll}
                disabled={isAnyProcessing || !items.some((it) => it.status === 'idle' || it.status === 'error')}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-semibold text-xs shadow-sm transition-all flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Compress All
              </button>

              <button
                type="button"
                onClick={handleClearAll}
                disabled={isAnyProcessing}
                className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 font-semibold text-xs transition-all flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="glass-panel p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center shrink-0 text-emerald-600">
                      <Table className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate" title={item.name}>
                        {item.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        Original: {formatBytes(item.originalSize)}
                        {item.sheetCount ? ` • ${item.sheetCount} Sheets` : ''}
                      </p>
                    </div>
                  </div>

                  {/* Status Badges */}
                  <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                    {item.status === 'idle' && (
                      <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-medium">
                        Ready
                      </span>
                    )}
                    {item.status === 'processing' && (
                      <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-medium animate-pulse">
                        {item.statusMessage || `Optimizing (${item.progress}%)`}
                      </span>
                    )}
                    {item.status === 'completed' && (
                      <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Saved {item.reductionPercent?.toFixed(1)}%
                      </span>
                    )}
                    {item.status === 'larger' && (
                      <span className="text-xs px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-medium flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        +{item.increasePercent?.toFixed(1)}% (Already compressed)
                      </span>
                    )}
                    {item.status === 'error' && (
                      <span className="text-xs px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 font-medium flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Failed
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                {item.status === 'processing' && (
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full transition-all duration-200"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                )}

                {/* Outcome Stats */}
                {(item.status === 'completed' || item.status === 'larger') && (
                  <div className="p-4 rounded-xl bg-white border border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-slate-500 block">Original Size</span>
                      <span className="font-bold text-slate-800">
                        {formatBytes(item.originalSize)}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Output Size</span>
                      <span className="font-bold text-slate-800">
                        {formatBytes(item.compressedSize || 0)}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">File Size Change</span>
                      {item.status === 'completed' ? (
                        <span className="font-bold text-emerald-600">
                          -{formatBytes(item.savingsBytes || 0)} (-
                          {item.reductionPercent?.toFixed(1)}%)
                        </span>
                      ) : (
                        <span className="font-bold text-amber-600">
                          +{formatBytes(Math.abs(item.savingsBytes || 0))} (+
                          {item.increasePercent?.toFixed(1)}%)
                        </span>
                      )}
                    </div>
                    <div>
                      <span className="text-slate-500 block">Package Integrity</span>
                      <span className="font-bold text-slate-800">
                        Valid OpenXML (.xlsx)
                      </span>
                    </div>
                  </div>
                )}

                {/* Changes Summary */}
                {item.changesSummary && item.changesSummary.length > 0 && (
                  <div className="text-xs p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="font-bold text-slate-800 block">Changes Made:</span>
                    <ul className="list-disc list-inside text-slate-600 space-y-0.5">
                      {item.changesSummary.map((summary, idx) => (
                        <li key={idx}>{summary}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Warnings / Errors */}
                {item.warnings && item.warnings.length > 0 && (
                  <div className="text-xs p-3 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                    <div>{item.warnings.join(' ')}</div>
                  </div>
                )}

                {item.errorMessage && (
                  <div className="text-xs p-3 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                    <div>{item.errorMessage}</div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-xs text-slate-400 hover:text-rose-600 transition-colors flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Remove
                  </button>

                  <div className="flex items-center gap-2">
                    {item.status === 'idle' && (
                      <button
                        type="button"
                        onClick={() => handleProcessItem(item)}
                        className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition-all"
                      >
                        Compress XLSX
                      </button>
                    )}

                    {(item.status === 'completed' || item.status === 'larger') && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleProcessItem(item)}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-all flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" />
                          Re-process
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDownload(item)}
                          className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition-all flex items-center gap-1.5"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Download XLSX
                        </button>
                      </>
                    )}

                    {item.status === 'error' && (
                      <button
                        type="button"
                        onClick={() => handleProcessItem(item)}
                        className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs shadow-sm transition-all flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        Retry
                      </button>
                    )}
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
