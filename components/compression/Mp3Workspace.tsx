'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Play,
  Download,
  AlertCircle,
  Sliders,
  CheckCircle2,
  Music,
  Volume2,
  ShieldCheck,
  Zap,
  Trash2,
  RotateCcw,
} from 'lucide-react';
import { compressAudio } from '@/lib/compression/audioCompressor';
import { formatBytes, formatDuration } from '@/lib/utils/formatters';
import { AudioBitrateOption, CompressionOutcome } from '@/lib/compression/types';

interface Mp3QueueItem {
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
  increasePercent?: number | null;
  durationMs: number | null;
  previewUrl: string;
  compressedPreviewUrl: string | null;
  durationSeconds?: number;
  originalBitrateKbps?: number;
  outputBitrateKbps?: number;
  outcome?: CompressionOutcome;
  errorMessage?: string;
  warnings?: string[];
}

export function Mp3Workspace() {
  const [items, setItems] = useState<Mp3QueueItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedBitrate, setSelectedBitrate] = useState<AudioBitrateOption>(128);
  const [selectedChannels, setSelectedChannels] = useState<'keep' | 'mono'>('keep');
  const [mode, setMode] = useState<'preset' | 'bitrate'>('bitrate');
  const [preset, setPreset] = useState<'balanced' | 'smaller' | 'quality'>('balanced');

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
    const validMp3s = Array.from(files).filter((f) => {
      const ext = f.name.toLowerCase().split('.').pop();
      return ext === 'mp3' || f.type === 'audio/mpeg' || f.type === 'audio/mp3';
    });

    if (validMp3s.length === 0) return;

    const newItems: Mp3QueueItem[] = validMp3s.map((file) => {
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

  const handleProcessItem = async (item: Mp3QueueItem) => {
    setItems((prev) =>
      prev.map((it) =>
        it.id === item.id ? { ...it, status: 'processing', progress: 10, errorMessage: undefined } : it
      )
    );

    try {
      const result = await compressAudio(
        item.file,
        {
          preset,
          bitrateKbps: selectedBitrate,
          channels: selectedChannels,
          outputFormat: 'audio/mpeg',
          mode,
        },
        (progress) => {
          setItems((prev) =>
            prev.map((it) => (it.id === item.id ? { ...it, progress } : it))
          );
        }
      );

      const outUrl = URL.createObjectURL(result.blob);
      objectUrlsRef.current.add(outUrl);

      const savings = item.originalSize - result.compressedSize;
      const reduction = item.originalSize > 0 ? (savings / item.originalSize) * 100 : 0;
      const isLarger = result.compressedSize > item.originalSize;
      const increase =
        isLarger && item.originalSize > 0
          ? ((result.compressedSize - item.originalSize) / item.originalSize) * 100
          : null;

      setItems((prev) =>
        prev.map((it) =>
          it.id === item.id
            ? {
                ...it,
                status: isLarger ? 'larger' : 'completed',
                progress: 100,
                compressedSize: result.compressedSize,
                compressedBlob: result.blob,
                savingsBytes: savings,
                reductionPercent: reduction,
                increasePercent: increase,
                durationMs: result.durationMs,
                compressedPreviewUrl: outUrl,
                durationSeconds: result.durationSeconds,
                originalBitrateKbps: result.originalBitrateKbps,
                outputBitrateKbps: result.bitrateKbps,
                outcome: result.outcome,
                warnings: result.warnings,
              }
            : it
        )
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Compression failed';
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

  const handleDownload = (item: Mp3QueueItem) => {
    if (!item.compressedBlob) return;
    const baseName = item.name.replace(/\.[^/.]+$/, '');
    const outName = `${baseName}-compressed.mp3`;

    const a = document.createElement('a');
    a.href = item.compressedPreviewUrl || URL.createObjectURL(item.compressedBlob);
    a.download = outName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
          accept="audio/mpeg,audio/mp3,.mp3"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) handleAddFiles(e.target.files);
            e.target.value = '';
          }}
        />

        <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200/80 text-blue-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
          <Music className="w-7 h-7" />
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 tracking-tight">
          Drop MP3 audio files here or browse your device
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6">
          Re-encode MP3 files with customizable bitrates (64 to 320 kbps), mono downmixing, and
          100% private in-browser Web Audio processing.
        </p>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all"
        >
          Select MP3 Files
        </button>
      </div>

      {/* MP3 Compression Controls */}
      <div className="glass-panel-elevated p-6 rounded-2xl space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-200/70 pb-3">
          <Sliders className="w-4 h-4 text-blue-600" />
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">
            MP3 Bitrate & Audio Controls
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Strategy Mode */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Compression Mode
            </label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as 'preset' | 'bitrate')}
              className="w-full text-xs rounded-xl border border-slate-200 bg-white p-2.5 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="bitrate">Target Exact Bitrate (Recommended)</option>
              <option value="preset">Smart Adaptive Preset</option>
            </select>
            <p className="text-[11px] text-slate-500 mt-1">
              {mode === 'bitrate'
                ? 'Directly sets the LAME encoder bitrate'
                : 'Intelligently scales based on original audio bitrate'}
            </p>
          </div>

          {/* Bitrate Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {mode === 'bitrate' ? 'Target Bitrate' : 'Compression Preset'}
            </label>
            {mode === 'bitrate' ? (
              <select
                value={selectedBitrate}
                onChange={(e) =>
                  setSelectedBitrate(Number(e.target.value) as AudioBitrateOption)
                }
                className="w-full text-xs rounded-xl border border-slate-200 bg-white p-2.5 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={320}>320 kbps (Maximum Quality, Minimal Savings)</option>
                <option value={256}>256 kbps (Very High Quality)</option>
                <option value={192}>192 kbps (Near CD Quality, Balanced)</option>
                <option value={128}>128 kbps (Standard MP3, Good Savings)</option>
                <option value={96}>96 kbps (High Compression, Great for Podcasts)</option>
                <option value={64}>64 kbps (Extreme Compression, Voice/Speech)</option>
              </select>
            ) : (
              <select
                value={preset}
                onChange={(e) =>
                  setPreset(e.target.value as 'balanced' | 'smaller' | 'quality')
                }
                className="w-full text-xs rounded-xl border border-slate-200 bg-white p-2.5 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="smaller">Maximum Savings (64-96 kbps, mono-optimized)</option>
                <option value="balanced">Balanced (128 kbps standard)</option>
                <option value="quality">High Fidelity (192-256 kbps)</option>
              </select>
            )}
            <p className="text-[11px] text-slate-500 mt-1">
              Lower bitrates substantially reduce file size but reduce high-frequency fidelity.
            </p>
          </div>

          {/* Channels */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Audio Channels
            </label>
            <select
              value={selectedChannels}
              onChange={(e) => setSelectedChannels(e.target.value as 'keep' | 'mono')}
              className="w-full text-xs rounded-xl border border-slate-200 bg-white p-2.5 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="keep">Keep Original Channels (Stereo)</option>
              <option value="mono">Downmix to Mono (~40-50% extra size reduction)</option>
            </select>
            <p className="text-[11px] text-slate-500 mt-1">
              Mono downmixing averages stereo channels, ideal for lectures and voice memos.
            </p>
          </div>
        </div>
      </div>

      {/* Queue & Results List */}
      {items.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Music className="w-4 h-4 text-blue-600" />
              MP3 Queue ({items.length} {items.length === 1 ? 'file' : 'files'})
            </h3>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleProcessAll}
                disabled={isAnyProcessing || !items.some((it) => it.status === 'idle' || it.status === 'error')}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold text-xs shadow-sm transition-all flex items-center gap-1.5"
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
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200/60 flex items-center justify-center shrink-0 text-blue-600">
                      <Music className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate" title={item.name}>
                        {item.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        Original: {formatBytes(item.originalSize)}
                        {item.durationSeconds ? ` • ${formatDuration(item.durationSeconds)}` : ''}
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
                      <span className="text-xs px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 font-medium animate-pulse">
                        Encoding MP3 ({item.progress}%)
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
                      className="bg-blue-600 h-full transition-all duration-200"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                )}

                {/* Audio Players & Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {/* Original Audio Player */}
                  <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/60 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                        <Volume2 className="w-3.5 h-3.5 text-slate-500" />
                        Original Audio Preview
                      </span>
                      <span className="text-slate-500">{formatBytes(item.originalSize)}</span>
                    </div>
                    <audio
                      controls
                      src={item.previewUrl}
                      className="w-full h-8 rounded-lg"
                      preload="metadata"
                    />
                  </div>

                  {/* Compressed Audio Player */}
                  <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-200/60 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-blue-900 flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-blue-600" />
                        Compressed MP3 Output
                      </span>
                      {item.compressedSize ? (
                        <span className="font-bold text-blue-700">
                          {formatBytes(item.compressedSize)}
                        </span>
                      ) : (
                        <span className="text-slate-400">Pending compression</span>
                      )}
                    </div>
                    {item.compressedPreviewUrl ? (
                      <audio
                        controls
                        src={item.compressedPreviewUrl}
                        className="w-full h-8 rounded-lg"
                        preload="metadata"
                      />
                    ) : (
                      <div className="h-8 flex items-center justify-center text-xs text-slate-400 bg-white/50 rounded-lg border border-dashed border-slate-200">
                        {item.status === 'processing'
                          ? 'Encoding audio frames...'
                          : 'Click compress to generate preview'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Outcome Statistics & Honest Reporting */}
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
                      <span className="text-slate-500 block">Encoding Rate</span>
                      <span className="font-bold text-slate-800">
                        {item.outputBitrateKbps || selectedBitrate} kbps MP3
                      </span>
                    </div>
                  </div>
                )}

                {/* Warnings / Error details */}
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

                {/* Item Actions */}
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
                        className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-all"
                      >
                        Compress MP3
                      </button>
                    )}

                    {(item.status === 'completed' || item.status === 'larger') && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleProcessItem(item)}
                          title="Re-compress with new settings"
                          className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-all flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" />
                          Re-encode
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDownload(item)}
                          className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition-all flex items-center gap-1.5"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Download MP3
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
