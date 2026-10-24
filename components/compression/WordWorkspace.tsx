'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Play,
  Download,
  AlertCircle,
  Sliders,
  CheckCircle2,
  FileText,
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

interface WordQueueItem {
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
  mediaOptimizedCount?: number;
  changesSummary?: string[];
  downloadUrl: string | null;
  outcome?: CompressionOutcome;
  errorMessage?: string;
  warnings?: string[];
}

export function WordWorkspace() {
  const [items, setItems] = useState<WordQueueItem[]>([]);
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
        ext === 'docx' ||
        f.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      );
    });

    if (validFiles.length === 0) {
      const hasOldDoc = Array.from(files).some((f) => f.name.toLowerCase().endsWith('.doc'));
      if (hasOldDoc) {
        alert(
          'Legacy Word 97-2003 (.doc) binary files are not supported. Please save your file as modern Word Document (.docx) in Microsoft Word or Google Docs before compressing.'
        );
      }
      return;
    }

    const newItems: WordQueueItem[] = validFiles.map((file) => ({
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

  const handleProcessItem = async (item: WordQueueItem) => {
    setItems((prev) =>
      prev.map((it) =>
        it.id === item.id
          ? { ...it, status: 'processing', progress: 10, statusMessage: 'Reading document...', errorMessage: undefined }
          : it
      )
    );

    const settings: OfficeOptimizationSettings =
      preset === 'aggressive'
        ? { imageQuality: 0.60, maxImageDimension: 1440 }
        : preset === 'light'
        ? { imageQuality: 0.85, maxImageDimension: 2560 }
        : { imageQuality: 0.75, maxImageDimension: 1920 };

    try {
      const result = await compressOfficeDocument(
        item.file,
        'word',
        settings,
        (progress, status) => {
          setItems((prev) =>
            prev.map((it) =>
              it.id === item.id ? { ...it, progress, statusMessage: status } : it
            )
          );
        }
      );

      const outUrl = URL.createObjectURL(result.blob);
      objectUrlsRef.current.add(outUrl);

      setItems((prev) =>
        prev.map((it) =>
          it.id === item.id
            ? {
                ...it,
                status: result.comparison.outcome === 'larger' ? 'larger' : 'completed',
                statusMessage: undefined,
                progress: 100,
                compressedSize: result.compressedSize,
                compressedBlob: result.blob,
                downloadUrl: outUrl,
                savingsBytes: result.comparison.savedBytes,
                reductionPercent: result.comparison.reductionPercent,
                increasePercent: result.comparison.increasePercent,
                durationMs: result.durationMs,
                mediaOptimizedCount: result.mediaOptimizedCount,
                changesSummary: result.changesSummary,
                outcome: result.comparison.outcome,
                warnings: result.warnings,
              }
            : it
        )
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to compress Word document.';
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
          accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) handleAddFiles(e.target.files);
            e.target.value = '';
          }}
        />

        <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200/80 text-blue-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
          <FileText className="w-7 h-7" />
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 tracking-tight">
          Drop Word documents (.docx) here or browse your device
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6">
          Recompresses oversized embedded images in word/media/ and repacks XML streams with maximum Deflate level 9. 100% private in-browser compression.
        </p>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all"
        >
          Select Word Documents
        </button>
      </div>

      {/* Compression Controls */}
      <div className="glass-panel-elevated p-6 rounded-2xl space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-200/70 pb-3">
          <Sliders className="w-4 h-4 text-blue-600" />
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">
            Word Document Optimization Settings
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Optimization Profile
            </label>
            <select
              value={preset}
              onChange={(e) => setPreset(e.target.value as 'balanced' | 'aggressive' | 'light')}
              className="w-full text-xs rounded-xl border border-slate-300 bg-white/90 p-2.5 font-medium text-slate-800 focus:outline-blue-500"
            >
              <option value="balanced">Balanced (75% image quality, max 1920px)</option>
              <option value="aggressive">Aggressive (60% image quality, max 1440px)</option>
              <option value="light">Light (85% image quality, max 2560px)</option>
            </select>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Controls embedded picture downscaling in word/media/.
            </span>
          </div>

          <div>
            <span className="block text-xs font-bold text-slate-700 mb-1.5">
              Document Integrity
            </span>
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200/80 px-3 py-2 rounded-xl">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>Full XML &amp; Styling Preservation</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              All styles, tables, headers, footers, and track changes remain intact.
            </span>
          </div>

          <div>
            <span className="block text-xs font-bold text-slate-700 mb-1.5">
              Archive Packaging
            </span>
            <div className="flex items-center gap-1.5 text-xs text-blue-700 font-semibold bg-blue-50 border border-blue-200/80 px-3 py-2 rounded-xl">
              <Zap className="w-4 h-4 shrink-0 text-blue-600" />
              <span>DEFLATE Level 9 Repacking</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Repacks all XML document parts with maximum compression.
            </span>
          </div>
        </div>
      </div>

      {/* Queue & Results */}
      {items.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Documents to Compress ({items.length})
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
                {/* Left: Icon & Name */}
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
                    <FileText className="w-6 h-6" />
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
                    {item.changesSummary && item.changesSummary.length > 0 && (
                      <p className="text-[11px] text-slate-600 font-medium mt-1">
                        {item.changesSummary[0]}
                      </p>
                    )}
                    {item.warnings && item.warnings.length > 0 && (
                      <p className="text-[11px] text-amber-700 font-medium mt-0.5">
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
                        {Math.round(item.reductionPercent)}% saved ({formatBytes(item.savingsBytes || 0)})
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
                        Compress
                      </button>
                    )}

                    {(item.status === 'completed' || item.status === 'larger') &&
                      item.downloadUrl && (
                        <a
                          href={item.downloadUrl}
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
