'use client';

import React, { useState, useRef, ChangeEvent, DragEvent } from 'react';
import {
  Archive,
  UploadCloud,
  FileText,
  Image as ImageIcon,
  Film,
  Music,
  File,
  Trash2,
  Download,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Clock,
  Sparkles,
  RotateCcw,
  Sliders,
  ShieldCheck,
  FileCheck,
  Zap,
  Info,
} from 'lucide-react';
import {
  createZipArchive,
  ZipCompressionLevel,
  ZipCompressorResult,
  sanitizeArchiveFilename,
} from '@/lib/compression/zipCompressor';
import { formatBytes, formatDuration } from '@/lib/utils/formatters';

export function ZipWorkspace() {
  const [files, setFiles] = useState<File[]>([]);
  const [level, setLevel] = useState<ZipCompressionLevel>('balanced');
  const [archiveName, setArchiveName] = useState('compressed-files.zip');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressAction, setProgressAction] = useState('');
  const [result, setResult] = useState<ZipCompressorResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const downloadUrlRef = useRef<string | null>(null);

  const totalOriginalBytes = files.reduce((acc, f) => acc + f.size, 0);

  const handleAddFiles = (incoming: FileList | null) => {
    if (!incoming || incoming.length === 0) return;
    setErrorMessage(null);

    const newFiles = Array.from(incoming);
    setFiles((prev) => [...prev, ...newFiles]);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    if (result) {
      setResult(null); // Invalidate result if files change
    }
  };

  const handleClearQueue = () => {
    if (downloadUrlRef.current) {
      URL.revokeObjectURL(downloadUrlRef.current);
      downloadUrlRef.current = null;
    }
    setFiles([]);
    setResult(null);
    setErrorMessage(null);
    setProgress(0);
  };

  const handleCreateZip = async () => {
    if (files.length === 0 || isProcessing) return;

    setIsProcessing(true);
    setErrorMessage(null);
    setProgress(5);
    setProgressAction('Initializing...');

    try {
      const sanitizedName = sanitizeArchiveFilename(archiveName);
      const res = await createZipArchive(files, {
        level,
        archiveName: sanitizedName,
        onProgress: (p, action) => {
          setProgress(p);
          if (action) setProgressAction(action);
        },
      });

      if (downloadUrlRef.current) {
        URL.revokeObjectURL(downloadUrlRef.current);
      }
      downloadUrlRef.current = URL.createObjectURL(res.blob);
      setResult(res);
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Failed to create ZIP archive. Please try again.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadZip = () => {
    if (!result || !downloadUrlRef.current) return;

    const a = document.createElement('a');
    a.href = downloadUrlRef.current;
    a.download = result.archiveName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Drag and drop handlers
  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isProcessing) setIsDragOver(true);
  };

  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (!isProcessing && e.dataTransfer.files) {
      handleAddFiles(e.dataTransfer.files);
    }
  };

  const getFileIcon = (file: File) => {
    const type = file.type.toLowerCase();
    const name = file.name.toLowerCase();

    if (type.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif|svg)$/.test(name)) {
      return <ImageIcon className="w-5 h-5 text-blue-500" />;
    }
    if (type.startsWith('video/') || /\.(mp4|webm|mov|avi|mkv)$/.test(name)) {
      return <Film className="w-5 h-5 text-purple-500" />;
    }
    if (type.startsWith('audio/') || /\.(mp3|wav|ogg|m4a|flac)$/.test(name)) {
      return <Music className="w-5 h-5 text-emerald-500" />;
    }
    if (type.includes('pdf') || name.endsWith('.pdf')) {
      return <FileText className="w-5 h-5 text-rose-500" />;
    }
    return <File className="w-5 h-5 text-slate-500" />;
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Upload Zone */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => !isProcessing && fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label="Upload files to compress into ZIP archive"
        className={`recessed-dropzone rounded-2xl sm:rounded-3xl border-2 border-dashed p-7 sm:p-11 text-center cursor-pointer transition-all ${
          isDragOver
            ? 'border-blue-500 bg-blue-50/70 scale-[1.01] shadow-xl shadow-blue-500/10'
            : 'border-slate-300/80 hover:border-blue-400 hover:shadow-md'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleAddFiles(e.target.files)}
          className="hidden"
          disabled={isProcessing}
        />

        <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 text-white flex items-center justify-center mx-auto mb-4 shadow-md shadow-blue-500/20">
          <Archive className="w-8 h-8 sm:w-9 sm:h-9" />
        </div>

        <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight mb-1.5">
          {files.length === 0
            ? 'Drop files here or click to browse'
            : 'Click or drop more files to add to archive'}
        </h2>

        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-5">
          Select images, PDFs, videos, audio tracks, or documents. Creates a standard, portable .zip file in your browser.
        </p>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-slate-700 text-xs font-semibold border border-slate-200/80 shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Files processed locally &bull; Never uploaded to servers</span>
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div
          role="alert"
          className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center gap-3 animate-in fade-in duration-150"
        >
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Selected Files Queue and Settings */}
      {files.length > 0 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Controls Bar */}
          <div className="glass-panel-elevated rounded-2xl p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-blue-100/70 pb-4">
              <div>
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  ZIP Archive Settings
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {files.length} {files.length === 1 ? 'file' : 'files'} selected &bull; Total Size: {formatBytes(totalOriginalBytes)}
                </span>
              </div>

              <button
                type="button"
                onClick={handleClearQueue}
                disabled={isProcessing}
                className="btn-3d-secondary inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-600 hover:text-rose-600 disabled:opacity-50 self-start sm:self-auto"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Filename input */}
              <div>
                <label htmlFor="zip-filename" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Output Filename
                </label>
                <div className="relative">
                  <input
                    id="zip-filename"
                    type="text"
                    value={archiveName}
                    disabled={isProcessing}
                    onChange={(e) => setArchiveName(e.target.value)}
                    placeholder="my-archive.zip"
                    className="w-full text-xs sm:text-sm bg-white border border-slate-300/80 rounded-xl px-3.5 py-2.5 text-slate-800 shadow-2xs focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:border-transparent transition-all disabled:opacity-60"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 pointer-events-none">
                    .zip
                  </span>
                </div>
              </div>

              {/* Compression Level Selector */}
              <div>
                <label htmlFor="zip-level" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Compression Level
                </label>
                <select
                  id="zip-level"
                  value={level}
                  disabled={isProcessing}
                  onChange={(e) => setLevel(e.target.value as ZipCompressionLevel)}
                  className="w-full text-xs sm:text-sm bg-white border border-slate-300/80 rounded-xl px-3.5 py-2.5 text-slate-800 shadow-2xs focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:border-transparent transition-all disabled:opacity-60"
                >
                  <option value="store">Store (No compression — Fastest, ideal for already-compressed media)</option>
                  <option value="fast">Fast (DEFLATE Level 1 — Quick packaging)</option>
                  <option value="balanced">Balanced (DEFLATE Level 6 — Recommended for documents/text)</option>
                  <option value="maximum">Maximum (DEFLATE Level 9 — Highest compression ratio)</option>
                </select>
              </div>
            </div>

            {/* Action Row */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Info className="w-4 h-4 text-blue-500 shrink-0" />
                <span>
                  Already compressed files (like JPG, MP4, and PDF) will not shrink significantly in ZIP archives.
                </span>
              </div>

              <button
                type="button"
                onClick={handleCreateZip}
                disabled={isProcessing || files.length === 0}
                className="btn-3d-primary w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs sm:text-sm disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating ZIP ({progress}%)...</span>
                  </>
                ) : (
                  <>
                    <Archive className="w-4 h-4" />
                    <span>Create ZIP Archive ({files.length} files)</span>
                  </>
                )}
              </button>
            </div>

            {/* Progress Bar */}
            {isProcessing && (
              <div className="pt-2 space-y-1.5 animate-in fade-in duration-150">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span className="font-medium truncate max-w-xs">{progressAction || 'Compressing...'}</span>
                  <span className="font-bold text-blue-600">{progress}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-150"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Result Card */}
          {result && (
            <div
              className={`glass-card-3d p-6 transition-all animate-in fade-in duration-300 ${
                result.comparison.outcome === 'reduced'
                  ? 'border-emerald-200/90'
                  : result.comparison.outcome === 'larger'
                  ? 'border-amber-200/90'
                  : 'border-slate-200/90'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    {result.comparison.outcome === 'reduced' ? (
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white flex items-center justify-center shadow-md shadow-emerald-500/25">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                    ) : result.comparison.outcome === 'larger' ? (
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-400 text-white flex items-center justify-center shadow-md shadow-amber-500/25">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-600 to-slate-400 text-white flex items-center justify-center shadow-md">
                        <FileCheck className="w-5 h-5" />
                      </div>
                    )}

                    <div>
                      <h3 className="text-base font-bold text-slate-900 tracking-tight">
                        {result.comparison.outcome === 'reduced'
                          ? `ZIP Created & Compressed (${Math.abs(result.comparison.reductionPercent).toFixed(1)}% smaller)`
                          : result.comparison.outcome === 'larger'
                          ? `ZIP Archive Created (${Math.round(result.comparison.increasePercent)}% larger than input)`
                          : 'ZIP Archive Created (Identical Size)'}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        {result.archiveName} &bull; {result.fileCount} {result.fileCount === 1 ? 'file' : 'files'} archived in {formatDuration(result.durationMs)}
                      </p>
                    </div>
                  </div>

                  {/* Size breakdown comparison */}
                  <div className="flex flex-wrap items-center gap-4 text-xs font-semibold pt-1">
                    <span className="text-slate-500">
                      Original: <span className="text-slate-800">{formatBytes(result.originalTotalBytes)}</span>
                    </span>
                    <span>&rarr;</span>
                    <span className="text-slate-500">
                      ZIP Size: <span className="text-slate-900 font-bold">{formatBytes(result.sizeBytes)}</span>
                    </span>
                    {result.comparison.outcome === 'reduced' && (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                        {formatBytes(result.comparison.savedBytes)} saved
                      </span>
                    )}
                  </div>

                  {/* Warnings or explanations */}
                  {result.warnings.length > 0 && (
                    <p className="text-xs text-amber-800 bg-amber-50/80 p-2.5 rounded-xl border border-amber-200/80 font-medium">
                      {result.warnings[0]}
                    </p>
                  )}
                </div>

                {/* Download CTA */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
                  <button
                    type="button"
                    onClick={handleDownloadZip}
                    className="btn-3d-primary flex items-center justify-center gap-2 px-6 py-3 text-xs sm:text-sm"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download ZIP Archive ({formatBytes(result.sizeBytes)})</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Files List Table */}
          <div className="glass-card-3d p-6">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
              Included Files ({files.length})
            </h3>

            <div className="divide-y divide-blue-50/70 max-h-80 overflow-y-auto pr-1">
              {files.map((file, idx) => (
                <div
                  key={`${file.name}-${idx}`}
                  className="py-3 flex items-center justify-between gap-3 text-xs text-slate-700 hover:bg-blue-50/40 rounded-xl px-2 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-white shadow-2xs flex items-center justify-center shrink-0 border border-slate-200/60">
                      {getFileIcon(file)}
                    </div>
                    <span className="font-semibold text-slate-800 truncate" title={file.name}>
                      {file.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-slate-500 font-medium">
                      {formatBytes(file.size)}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(idx)}
                      disabled={isProcessing}
                      title={`Remove ${file.name}`}
                      aria-label={`Remove ${file.name}`}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
