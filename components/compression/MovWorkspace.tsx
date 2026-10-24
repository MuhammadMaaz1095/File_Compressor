'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Play,
  Download,
  AlertCircle,
  Sliders,
  CheckCircle2,
  Film,
  Zap,
  Volume2,
  VolumeX,
  ShieldCheck,
  RotateCcw,
  Trash2,
  Info,
} from 'lucide-react';
import {
  compressVideo,
  computeVideoDimensions,
  calculateTargetVideoBitrateBps,
} from '@/lib/compression/videoCompressor';
import { formatBytes, formatReduction } from '@/lib/utils/formatters';
import { compareFileSizes } from '@/lib/compression/file-size';
import { CompressionOutcome, VideoSettings, VideoResolutionOption } from '@/lib/compression/types';
import { extractMediaMetadataSafely } from '@/lib/utils/media-support';

interface MovQueueItem {
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
  duration?: number;
  width?: number;
  height?: number;
  canPreview: boolean;
  previewWarning?: string;
  outcome?: CompressionOutcome;
  errorMessage?: string;
  warnings?: string[];
}

export function MovWorkspace() {
  const [items, setItems] = useState<MovQueueItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [settings, setSettings] = useState<VideoSettings>({
    preset: 'balanced',
    resolution: '720p',
    bitrateKbps: 1600,
    removeAudio: false,
    outputFormat: 'auto',
  });
  const [targetMb, setTargetMb] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const objectUrlsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      objectUrlsRef.current.clear();
    };
  }, []);

  const handleAddFiles = async (files: FileList | File[]) => {
    const validMovs = Array.from(files).filter((f) => {
      const lower = f.name.toLowerCase();
      return f.type === 'video/quicktime' || lower.endsWith('.mov');
    });

    if (validMovs.length === 0) return;

    const newItems: MovQueueItem[] = [];

    for (const file of validMovs) {
      const url = URL.createObjectURL(file);
      objectUrlsRef.current.add(url);

      const metadata = await extractMediaMetadataSafely(file, 'video');

      newItems.push({
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
        duration: metadata.duration,
        width: metadata.width,
        height: metadata.height,
        canPreview: metadata.canPreview,
        previewWarning: metadata.warning,
      });
    }

    setItems((prev) => [...prev, ...newItems]);
  };

  const handleProcessItem = async (item: MovQueueItem) => {
    setItems((prev) =>
      prev.map((it) =>
        it.id === item.id ? { ...it, status: 'processing', progress: 5, errorMessage: undefined } : it
      )
    );

    const activeSettings: VideoSettings = {
      ...settings,
      targetSizeMB: targetMb ? parseFloat(targetMb) : undefined,
    };

    try {
      const result = await compressVideo(item.file, activeSettings, (progress) => {
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
      const msg = err instanceof Error ? err.message : 'Failed to compress MOV video.';
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
          accept="video/quicktime,.mov"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) handleAddFiles(e.target.files);
            e.target.value = '';
          }}
        />

        <div className="w-14 h-14 rounded-2xl bg-violet-50 border border-violet-200/80 text-violet-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
          <Film className="w-7 h-7" />
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 tracking-tight">
          Drop MOV video files here or browse your device
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6">
          Transcode heavy Apple QuickTime (.mov) clips into compact, web-ready video with 100% private in-browser compression.
        </p>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all"
        >
          Select MOV Videos
        </button>
      </div>

      {/* Compression Controls */}
      <div className="glass-panel-elevated p-6 rounded-2xl space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-200/70 pb-3">
          <Sliders className="w-4 h-4 text-violet-600" />
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">
            MOV Compression Controls
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          {/* Resolution */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Output Resolution
            </label>
            <select
              value={settings.resolution}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  resolution: e.target.value as VideoResolutionOption,
                })
              }
              className="w-full text-xs rounded-xl border border-slate-300 bg-white/90 p-2.5 font-medium text-slate-800 focus:outline-blue-500"
            >
              <option value="original">Original Resolution</option>
              <option value="1080p">1080p Full HD</option>
              <option value="720p">720p HD (Recommended)</option>
              <option value="480p">480p SD (Mobile / Email)</option>
              <option value="360p">360p Low (Smallest Size)</option>
            </select>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Proportionally scales width &amp; height.
            </span>
          </div>

          {/* Quality Preset */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Encoding Profile
            </label>
            <select
              value={settings.preset}
              onChange={(e) => {
                const preset = e.target.value as 'balanced' | 'smaller' | 'quality';
                setSettings({
                  ...settings,
                  preset,
                  bitrateKbps: preset === 'smaller' ? 800 : preset === 'quality' ? 2800 : 1600,
                });
              }}
              className="w-full text-xs rounded-xl border border-slate-300 bg-white/90 p-2.5 font-medium text-slate-800 focus:outline-blue-500"
            >
              <option value="balanced">Balanced (1600 kbps – Recommended)</option>
              <option value="smaller">Maximum Savings (800 kbps – Fast Email)</option>
              <option value="quality">High Fidelity (2800 kbps – Crisp Detail)</option>
            </select>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Balances encoding bitrate with quality.
            </span>
          </div>

          {/* Target File Size (Optional) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Target Size (MB, Optional)
            </label>
            <input
              type="number"
              placeholder="e.g. 25 for Discord / Email"
              value={targetMb}
              onChange={(e) => setTargetMb(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-300 bg-white/90 p-2.5 font-medium text-slate-800 focus:outline-blue-500"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">
              Calculates bitrate to stay under limit.
            </span>
          </div>

          {/* Audio Track */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Audio Handling
            </label>
            <button
              type="button"
              onClick={() =>
                setSettings({
                  ...settings,
                  removeAudio: !settings.removeAudio,
                })
              }
              className={`w-full flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                settings.removeAudio
                  ? 'bg-amber-50 border-amber-200 text-amber-800'
                  : 'bg-white/90 border-slate-300 text-slate-700'
              }`}
            >
              {settings.removeAudio ? (
                <>
                  <VolumeX className="w-4 h-4 text-amber-600" />
                  <span>Audio Muted (Save ~15%)</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-emerald-600" />
                  <span>Preserve Audio Track</span>
                </>
              )}
            </button>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Muting removes sound to cut file size.
            </span>
          </div>
        </div>
      </div>

      {/* Queue & Results */}
      {items.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              MOV Videos to Compress ({items.length})
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
                  <div className="w-20 h-14 rounded-xl overflow-hidden border border-slate-200 shrink-0 relative bg-black flex items-center justify-center">
                    {item.canPreview ? (
                      <video
                        src={item.compressedPreviewUrl || item.previewUrl}
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Film className="w-6 h-6 text-slate-400" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-900 truncate max-w-xs sm:max-w-sm">
                      {item.name}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span>{formatBytes(item.originalSize)}</span>
                      {item.duration && (
                        <span>&bull; {Math.round(item.duration)}s</span>
                      )}
                      {item.width && item.height && (
                        <span>&bull; {item.width}&times;{item.height}</span>
                      )}
                      {item.compressedSize !== null && (
                        <>
                          <span>&rarr;</span>
                          <span className="font-semibold text-slate-900">
                            {formatBytes(item.compressedSize)}
                          </span>
                        </>
                      )}
                    </div>
                    {item.previewWarning && (
                      <p className="text-[11px] text-amber-700 font-medium mt-0.5">
                        {item.previewWarning}
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
                        Already optimal ({formatBytes(item.compressedSize || 0)})
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
                          download={`compressed-${item.name.replace(/\.[^/.]+$/, '')}.${
                            item.compressedBlob.type.includes('mp4') ? 'mp4' : 'webm'
                          }`}
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
