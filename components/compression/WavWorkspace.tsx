'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Play,
  Download,
  AlertCircle,
  Sliders,
  CheckCircle2,
  Volume2,
  Zap,
  Trash2,
  RotateCcw,
  AudioWaveform,
  Info,
} from 'lucide-react';
import {
  compressWav,
  WavSettings,
  WavCompressionMode,
  inspectWavHeader,
} from '@/lib/compression/wavCompressor';
import { formatBytes, formatDuration } from '@/lib/utils/formatters';
import { CompressionOutcome, AudioBitrateOption } from '@/lib/compression/types';

interface WavQueueItem {
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
  increasePercent: number | null;
  durationMs: number | null;
  previewUrl: string;
  compressedPreviewUrl: string | null;
  durationSeconds?: number;
  originalSampleRate?: number;
  originalChannels?: number;
  outputSampleRate?: number;
  outputChannels?: number;
  outputExtension?: 'wav' | 'mp3';
  outcome?: CompressionOutcome;
  errorMessage?: string;
  warnings?: string[];
}

export function WavWorkspace() {
  const [items, setItems] = useState<WavQueueItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [mode, setMode] = useState<WavCompressionMode>('convert_mp3');
  const [targetSampleRate, setTargetSampleRate] = useState<number>(22050);
  const [channels, setChannels] = useState<'keep' | 'mono'>('keep');
  const [mp3Bitrate, setMp3Bitrate] = useState<AudioBitrateOption>(128);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const objectUrlsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      objectUrlsRef.current.clear();
    };
  }, []);

  const handleAddFiles = async (files: FileList | File[]) => {
    const validWavs = Array.from(files).filter((f) => {
      const ext = f.name.toLowerCase().split('.').pop();
      return ext === 'wav' || f.type.includes('wav');
    });

    if (validWavs.length === 0) return;

    const newItems: WavQueueItem[] = [];

    for (const file of validWavs) {
      const url = URL.createObjectURL(file);
      objectUrlsRef.current.add(url);

      let sampleRate: number | undefined;
      let chan: number | undefined;

      try {
        const slice = await file.slice(0, 1024).arrayBuffer();
        const header = inspectWavHeader(slice);
        if (header.isValidWav) {
          sampleRate = header.sampleRate;
          chan = header.channels;
        }
      } catch {
        // Silently fallback if header inspection fails
      }

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
        increasePercent: null,
        durationMs: null,
        previewUrl: url,
        compressedPreviewUrl: null,
        originalSampleRate: sampleRate,
        originalChannels: chan,
      });
    }

    setItems((prev) => [...prev, ...newItems]);
  };

  const handleProcessItem = async (item: WavQueueItem) => {
    setItems((prev) =>
      prev.map((it) =>
        it.id === item.id ? { ...it, status: 'processing', progress: 10, errorMessage: undefined } : it
      )
    );

    try {
      const settings: WavSettings = {
        mode,
        targetSampleRate: mode === 'wav_pcm' ? targetSampleRate : undefined,
        channels,
        mp3BitrateKbps: mode === 'convert_mp3' ? mp3Bitrate : undefined,
      };

      const result = await compressWav(item.file, settings, (progress) => {
        setItems((prev) =>
          prev.map((it) => (it.id === item.id ? { ...it, progress } : it))
        );
      });

      const outUrl = URL.createObjectURL(result.blob);
      objectUrlsRef.current.add(outUrl);

      const isLarger = result.outcome === 'larger';

      setItems((prev) =>
        prev.map((it) =>
          it.id === item.id
            ? {
                ...it,
                status: isLarger ? 'larger' : 'completed',
                progress: 100,
                compressedSize: result.compressedSize,
                compressedBlob: result.blob,
                savingsBytes: result.savingsBytes,
                reductionPercent: result.reductionPercent,
                increasePercent: result.increasePercent,
                durationMs: result.durationMs,
                compressedPreviewUrl: outUrl,
                durationSeconds: result.durationSeconds,
                outputSampleRate: result.sampleRate,
                outputChannels: result.channels,
                outputExtension: result.outputExtension,
                outcome: result.outcome,
                warnings: result.warnings,
              }
            : it
        )
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'WAV processing failed';
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

  const handleDownload = (item: WavQueueItem) => {
    if (!item.compressedBlob) return;
    const baseName = item.name.replace(/\.[^/.]+$/, '');
    const ext = item.outputExtension || (mode === 'convert_mp3' ? 'mp3' : 'wav');
    const outName = `${baseName}-compressed.${ext}`;

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
          accept="audio/wav,audio/x-wav,.wav"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) handleAddFiles(e.target.files);
            e.target.value = '';
          }}
        />

        <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200/80 text-blue-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
          <AudioWaveform className="w-7 h-7" />
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 tracking-tight">
          Drop WAV audio files here or browse your device
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6">
          Optimize uncompressed PCM WAV files (downsample sample rate / mono mix) or convert to
          high-efficiency MP3 with 100% private in-browser Web Audio processing.
        </p>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all"
        >
          Select WAV Files
        </button>
      </div>

      {/* WAV Compression Controls */}
      <div className="glass-panel-elevated p-6 rounded-2xl space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-200/70 pb-3">
          <Sliders className="w-4 h-4 text-blue-600" />
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">
            WAV Processing Strategy & Controls
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Mode Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Compression Strategy
            </label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as WavCompressionMode)}
              className="w-full text-xs rounded-xl border border-slate-200 bg-white p-2.5 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="convert_mp3">Convert to MP3 (Recommended, ~90% Savings)</option>
              <option value="wav_pcm">Optimize PCM WAV (Keep as .wav)</option>
            </select>
            <p className="text-[11px] text-slate-500 mt-1">
              {mode === 'convert_mp3'
                ? 'Converts uncompressed audio into highly compressed MP3 format.'
                : 'Maintains uncompressed PCM format while downsampling or mixing down.'}
            </p>
          </div>

          {/* Mode-specific settings */}
          {mode === 'convert_mp3' ? (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Output MP3 Bitrate
              </label>
              <select
                value={mp3Bitrate}
                onChange={(e) =>
                  setMp3Bitrate(Number(e.target.value) as AudioBitrateOption)
                }
                className="w-full text-xs rounded-xl border border-slate-200 bg-white p-2.5 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={320}>320 kbps (Audiophile / Highest Quality)</option>
                <option value={256}>256 kbps (Very High Quality)</option>
                <option value={192}>192 kbps (Transparent Stereo)</option>
                <option value={128}>128 kbps (Standard Balance ~90% smaller)</option>
                <option value={96}>96 kbps (High Compression, Speech/Podcasts)</option>
                <option value={64}>64 kbps (Extreme Compression)</option>
              </select>
              <p className="text-[11px] text-slate-500 mt-1">
                Converts large 50 MB uncompressed WAV files into lightweight 3–5 MB MP3s.
              </p>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Target Sample Rate
              </label>
              <select
                value={targetSampleRate}
                onChange={(e) => setTargetSampleRate(Number(e.target.value))}
                className="w-full text-xs rounded-xl border border-slate-200 bg-white p-2.5 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={44100}>44,100 Hz (CD Standard)</option>
                <option value={32000}>32,000 Hz (Moderate Savings)</option>
                <option value={22050}>22,050 Hz (50% Size Reduction, Clear Voice)</option>
                <option value={16000}>16,000 Hz (63% Size Reduction, Telephony)</option>
              </select>
              <p className="text-[11px] text-slate-500 mt-1">
                Halving sample rate reduces raw PCM file size by 50% without lossy artifacting.
              </p>
            </div>
          )}

          {/* Channels Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Audio Channels
            </label>
            <select
              value={channels}
              onChange={(e) => setChannels(e.target.value as 'keep' | 'mono')}
              className="w-full text-xs rounded-xl border border-slate-200 bg-white p-2.5 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="keep">Keep Original Channels (Stereo)</option>
              <option value="mono">Downmix to Mono (50% Additional Size Reduction)</option>
            </select>
            <p className="text-[11px] text-slate-500 mt-1">
              Downmixing stereo into a single mono track halves uncompressed PCM sample data.
            </p>
          </div>
        </div>

        {/* Informative banner about WAV characteristics */}
        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/60 text-xs text-blue-900">
          <Info className="w-4 h-4 shrink-0 text-blue-600 mt-0.5" />
          <p>
            <strong>Note on WAV architecture:</strong> WAV files are uncompressed raw audio containers.
            Unlike lossy MP3s, a standard 44.1 kHz 16-bit WAV always requires ~10 MB per minute. To
            drastically cut file size, <strong>Mode B (Convert to MP3)</strong> is recommended unless
            your workflow strictly requires an uncompressed PCM <code>.wav</code> output.
          </p>
        </div>
      </div>

      {/* Queue & Results List */}
      {items.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <AudioWaveform className="w-4 h-4 text-blue-600" />
              WAV Queue ({items.length} {items.length === 1 ? 'file' : 'files'})
            </h3>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleProcessAll}
                disabled={isAnyProcessing || !items.some((it) => it.status === 'idle' || it.status === 'error')}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold text-xs shadow-sm transition-all flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Process All
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
                      <AudioWaveform className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate" title={item.name}>
                        {item.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        Original: {formatBytes(item.originalSize)}
                        {item.originalSampleRate ? ` • ${item.originalSampleRate} Hz` : ''}
                        {item.originalChannels ? ` • ${item.originalChannels === 1 ? 'Mono' : 'Stereo'}` : ''}
                        {item.durationSeconds ? ` • ${formatDuration(item.durationSeconds)}` : ''}
                      </p>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                    {item.status === 'idle' && (
                      <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-medium">
                        Ready
                      </span>
                    )}
                    {item.status === 'processing' && (
                      <span className="text-xs px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 font-medium animate-pulse">
                        Processing WAV ({item.progress}%)
                      </span>
                    )}
                    {item.status === 'completed' && (
                      <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Saved {item.reductionPercent?.toFixed(1)}% ({item.outputExtension?.toUpperCase()})
                      </span>
                    )}
                    {item.status === 'larger' && (
                      <span className="text-xs px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-medium flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        +{item.increasePercent?.toFixed(1)}% (Target format exceeded input)
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

                {/* Dual Audio Players */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/60 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                        <Volume2 className="w-3.5 h-3.5 text-slate-500" />
                        Original WAV Audio Preview
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

                  <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-200/60 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-blue-900 flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-blue-600" />
                        Processed Audio Output ({item.outputExtension?.toUpperCase() || (mode === 'convert_mp3' ? 'MP3' : 'WAV')})
                      </span>
                      {item.compressedSize ? (
                        <span className="font-bold text-blue-700">
                          {formatBytes(item.compressedSize)}
                        </span>
                      ) : (
                        <span className="text-slate-400">Pending processing</span>
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
                          ? 'Rendering audio...'
                          : 'Click process to generate output'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Outcome Statistics */}
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
                      <span className="text-slate-500 block">Output Format</span>
                      <span className="font-bold text-slate-800">
                        {item.outputExtension === 'mp3'
                          ? `MP3 (${mp3Bitrate} kbps)`
                          : `PCM WAV (${item.outputSampleRate} Hz)`}
                      </span>
                    </div>
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
                        className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-all"
                      >
                        {mode === 'convert_mp3' ? 'Convert to MP3' : 'Optimize WAV'}
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
                          Download {item.outputExtension?.toUpperCase()}
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
