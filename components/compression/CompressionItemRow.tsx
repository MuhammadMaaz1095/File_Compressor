'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Image as ImageIcon,
  Film,
  Music,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Download,
  Eye,
  Trash2,
  Loader2,
  Clock,
  Play,
  Pause,
  RefreshCw,
  MinusCircle,
  Info,
} from 'lucide-react';
import { QueueItem } from '@/lib/compression/types';
import {
  formatBytes,
  formatReduction,
  formatDuration,
  formatMediaDuration,
} from '@/lib/utils/formatters';
import { downloadSingleFile } from '@/lib/compression/zipExporter';

interface CompressionItemRowProps {
  item: QueueItem;
  onRemove: (id: string) => void;
  onCompare?: (item: QueueItem) => void;
  onRetrySmaller?: (id: string) => void;
}

export function CompressionItemRow({
  item,
  onRemove,
  onCompare,
  onRetrySmaller,
}: CompressionItemRowProps) {
  const isImage = item.category === 'image';
  const isPdf = item.category === 'pdf';
  const isVideo = item.category === 'video';
  const isAudio = item.category === 'audio';

  const isCompleted = item.status === 'completed';
  const isLarger = item.status === 'larger';
  const isUnchanged = item.status === 'unchanged';
  const isProcessing = item.status === 'processing';
  const isError = item.status === 'error';

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioEl, setAudioEl] = useState<HTMLAudioElement | null>(null);
  const [playbackWarning, setPlaybackWarning] = useState<string | null>(null);

  // Safely cleanup audio playback on unmount or when item id changes
  useEffect(() => {
    return () => {
      if (audioEl) {
        audioEl.pause();
        audioEl.onended = null;
        audioEl.onerror = null;
        audioEl.removeAttribute('src');
        try {
          audioEl.load();
        } catch {
          // Safe ignore
        }
      }
    };
  }, [audioEl]);

  const toggleAudioPlay = () => {
    setPlaybackWarning(null);

    const url = item.compressedPreviewUrl || item.previewUrl;
    if (!url) {
      setPlaybackWarning('Your browser cannot preview this format. You can still download the file.');
      return;
    }

    if (!audioEl) {
      const audio = new Audio();
      audio.preload = 'metadata';

      audio.onended = () => {
        setIsPlayingAudio(false);
      };

      audio.onerror = () => {
        setIsPlayingAudio(false);
        setPlaybackWarning('Your browser cannot preview this format. You can still download the file.');
        audio.removeAttribute('src');
        try {
          audio.load();
        } catch {
          // Safe ignore
        }
      };

      audio.src = url;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setAudioEl(audio);
            setIsPlayingAudio(true);
          })
          .catch(() => {
            setIsPlayingAudio(false);
            setPlaybackWarning('Your browser cannot preview this format. You can still download the file.');
            audio.removeAttribute('src');
            try {
              audio.load();
            } catch {
              // Safe ignore
            }
          });
      }
    } else {
      if (isPlayingAudio) {
        audioEl.pause();
        setIsPlayingAudio(false);
      } else {
        const playPromise = audioEl.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => setIsPlayingAudio(true))
            .catch(() => {
              setIsPlayingAudio(false);
              setPlaybackWarning('Your browser cannot preview this format. You can still download the file.');
            });
        }
      }
    }
  };

  return (
    <div
      className={`glass-card-3d rounded-2xl p-4 sm:p-5 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 border shadow-xs ${
        isLarger
          ? 'border-amber-200/90 bg-amber-50/40'
          : isError
          ? 'border-rose-200/90 bg-rose-50/40'
          : 'border-slate-200/80 hover:border-blue-300'
      }`}
    >
      {/* File info with thumbnail */}
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        {/* Preview Thumbnail / Icon */}
        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 overflow-hidden border border-slate-200/80 shadow-2xs">
          {isImage && item.previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.previewUrl}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          ) : isVideo ? (
            <div className="w-full h-full bg-purple-50 flex items-center justify-center text-purple-600">
              <Film className="w-6 h-6" />
            </div>
          ) : isAudio ? (
            <div className="w-full h-full bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Music className="w-6 h-6" />
            </div>
          ) : isPdf ? (
            <div className="w-full h-full bg-rose-50 flex items-center justify-center text-rose-600">
              <FileText className="w-6 h-6" />
            </div>
          ) : (
            <div className="w-full h-full bg-blue-50 flex items-center justify-center text-blue-600">
              <ImageIcon className="w-6 h-6" />
            </div>
          )}
        </div>

        {/* Text Details */}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-[#0F172A] truncate max-w-[200px] xs:max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg" title={item.name}>
            {item.name}
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-0.5 text-xs text-slate-500">
            <span>Original: {formatBytes(item.originalSize)}</span>
            {item.width && item.height && (
              <>
                <span>•</span>
                <span>
                  {item.width} &times; {item.height}px
                </span>
              </>
            )}
            {item.mediaDuration && (
              <>
                <span>•</span>
                <span>{formatMediaDuration(item.mediaDuration)}</span>
              </>
            )}
            {item.originalBitrateKbps && (
              <>
                <span>•</span>
                <span>Orig Bitrate: {item.originalBitrateKbps} kbps</span>
              </>
            )}
            {item.durationMs !== null && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {formatDuration(item.durationMs)}
                </span>
              </>
            )}
            {item.previewUnsupported && (
              <>
                <span>•</span>
                <span
                  className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full text-[10px] font-semibold border border-amber-200/90 shadow-2xs"
                  title="Your browser cannot preview this format. You can still download the file if the output has been validated."
                >
                  Preview unsupported
                </span>
              </>
            )}
          </div>
          {playbackWarning && (
            <p className="text-[11px] text-amber-700 mt-1 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 shrink-0" />
              <span>{playbackWarning}</span>
            </p>
          )}
        </div>
      </div>

      {/* Status & Stats Section */}
      <div className="flex flex-wrap items-center justify-between md:justify-end gap-3 sm:gap-4 shrink-0">
        {/* Processing State */}
        {isProcessing && (
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Processing... {Math.round(item.progress)}%</span>
            </div>
            <div className="w-24 sm:w-32 bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200 shadow-inner">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-200"
                style={{ width: `${item.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Completed State (Reduced) */}
        {isCompleted && item.compressedSize !== null && (
          <div className="flex flex-wrap items-center gap-3">
            <div className="text-right">
              <div className="text-xs font-medium text-slate-400 line-through">
                {formatBytes(item.originalSize)}
              </div>
              <div className="text-sm font-extrabold text-[#0F172A]">
                {formatBytes(item.compressedSize)}
              </div>
            </div>

            {/* Savings Badge */}
            <div className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/90 text-emerald-800 text-xs font-extrabold flex items-center gap-1 shadow-2xs">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>{formatReduction(item.reductionPercent)}</span>
            </div>
          </div>
        )}

        {/* Larger State (Honest Warning) */}
        {isLarger && item.compressedSize !== null && (
          <div className="flex flex-col sm:items-end gap-1">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200/90 text-amber-900 text-xs font-semibold shadow-2xs">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                Output is {Math.round(item.increasePercent || 0)}% larger (+{formatBytes((item.compressedSize || 0) - item.originalSize)})
              </span>
            </div>
            <span className="text-[11px] text-slate-500">
              {formatBytes(item.originalSize)} &rarr; {formatBytes(item.compressedSize)} (Already compressed)
            </span>
          </div>
        )}

        {/* Unchanged State */}
        {isUnchanged && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium">
            <MinusCircle className="w-4 h-4 text-slate-500 shrink-0" />
            <span>No size change (0% saved)</span>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold max-w-xs truncate shadow-2xs">
            <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span title={item.errorMessage}>{item.errorMessage || 'Failed to compress'}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Audio Preview Play/Pause button */}
          {isAudio && (item.previewUrl || item.compressedPreviewUrl) && !item.previewUnsupported && (
            <button
              type="button"
              onClick={toggleAudioPlay}
              title={isPlayingAudio ? 'Pause preview' : 'Play audio preview'}
              aria-label={isPlayingAudio ? 'Pause audio' : 'Play audio'}
              className="p-2.5 rounded-xl text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 shadow-2xs transition-colors"
            >
              {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
          )}

          {/* Compare Button (images only, when completed) */}
          {isCompleted && isImage && item.compressedBlob && onCompare && (
            <button
              type="button"
              onClick={() => onCompare(item)}
              title="Compare Before & After"
              aria-label={`Compare original and compressed versions of ${item.name}`}
              className="p-2.5 rounded-xl btn-3d-secondary transition-all"
            >
              <Eye className="w-4 h-4 text-blue-600" />
            </button>
          )}

          {/* If larger and retry is available, offer "Try Smaller File Preset" */}
          {isLarger && item.canRetrySmaller && onRetrySmaller && (
            <button
              type="button"
              onClick={() => onRetrySmaller(item.id)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl btn-3d-primary text-xs font-bold shadow-xs transition-all"
              title="Re-run with aggressive compression preset"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Try Smaller Preset</span>
            </button>
          )}

          {/* Download Button for Reduced (Completed) */}
          {isCompleted && item.compressedBlob && (
            <button
              type="button"
              onClick={() => downloadSingleFile(item)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl btn-3d-primary text-xs font-bold shadow-xs transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
          )}

          {/* Download Button for Larger Output (Clear secondary choice, not masked as savings) */}
          {isLarger && item.compressedBlob && (
            <button
              type="button"
              onClick={() => downloadSingleFile(item)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold shadow-2xs transition-colors"
              title="Download the re-encoded file even though it is larger than the original"
            >
              <Download className="w-3.5 h-3.5 text-amber-700" />
              <span>Keep & Download Larger</span>
            </button>
          )}

          {/* Download Button for Unchanged Output */}
          {isUnchanged && item.compressedBlob && (
            <button
              type="button"
              onClick={() => downloadSingleFile(item)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl btn-3d-secondary text-xs font-bold transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
          )}

          {/* Remove Button */}
          <button
            type="button"
            onClick={() => {
              if (audioEl) {
                audioEl.pause();
                audioEl.removeAttribute('src');
                try {
                  audioEl.load();
                } catch {
                  // Safe ignore
                }
              }
              onRemove(item.id);
            }}
            disabled={isProcessing}
            title="Remove from queue"
            aria-label={`Remove ${item.name} from queue`}
            className="p-2.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors disabled:opacity-40"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
