'use client';

import React from 'react';
import {
  Archive,
  Play,
  RotateCcw,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { QueueItem } from '@/lib/compression/types';
import { formatBytes, formatReduction } from '@/lib/utils/formatters';

interface StatsOverviewProps {
  items: QueueItem[];
  isProcessing: boolean;
  onCompressAll: () => void;
  onDownloadZip: () => void;
  onClearAll: () => void;
}

export function StatsOverview({
  items,
  isProcessing,
  onCompressAll,
  onDownloadZip,
  onClearAll,
}: StatsOverviewProps) {
  if (items.length === 0) return null;

  const completedItems = items.filter((item) => item.status === 'completed');
  const largerItems = items.filter((item) => item.status === 'larger');
  const unchangedItems = items.filter((item) => item.status === 'unchanged');
  const pendingItems = items.filter((item) => item.status === 'idle');
  const processedItems = items.filter((item) => item.compressedBlob && item.compressedSize !== null);

  const totalOriginalBytes = items.reduce((acc, item) => acc + item.originalSize, 0);

  // Total saved bytes: calculated from items that actually achieved reduction
  const totalSavedBytes = completedItems.reduce(
    (acc, item) => acc + (item.savingsBytes && item.savingsBytes > 0 ? item.savingsBytes : 0),
    0
  );

  const completedOriginalBytes = completedItems.reduce(
    (acc, item) => acc + item.originalSize,
    0
  );

  const totalSavingsPercent =
    completedOriginalBytes > 0
      ? (totalSavedBytes / completedOriginalBytes) * 100
      : 0;

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-6 mb-6 shadow-xs border border-slate-200/80">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        {/* Statistics info */}
        <div className="flex flex-wrap items-center gap-5 sm:gap-8">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Files in Queue
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-2xl font-extrabold text-[#0F172A]">{items.length}</span>
              <span className="text-xs text-slate-500 font-medium">
                ({completedItems.length} reduced{largerItems.length > 0 ? `, ${largerItems.length} larger` : ''}{unchangedItems.length > 0 ? `, ${unchangedItems.length} unchanged` : ''})
              </span>
            </div>
          </div>

          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Original Size
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-2xl font-extrabold text-[#0F172A]">
                {formatBytes(totalOriginalBytes)}
              </span>
            </div>
          </div>

          {completedItems.length > 0 && (
            <div>
              <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">
                Total Saved
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl font-extrabold text-emerald-700">
                  {formatBytes(totalSavedBytes)}
                </span>
                <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 shadow-2xs">
                  {formatReduction(totalSavingsPercent)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Compress All */}
          {pendingItems.length > 0 && (
            <button
              type="button"
              disabled={isProcessing}
              onClick={onCompressAll}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl btn-3d-primary text-xs font-bold shadow-xs disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Compress All ({pendingItems.length})</span>
                </>
              )}
            </button>
          )}

          {/* Download All as ZIP */}
          {processedItems.length > 0 && (
            <button
              type="button"
              onClick={onDownloadZip}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs border border-slate-700/60 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              <Archive className="w-4 h-4 text-sky-400" />
              <span>Download All (.ZIP)</span>
            </button>
          )}

          {/* Clear All */}
          <button
            type="button"
            disabled={isProcessing}
            onClick={onClearAll}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl btn-3d-secondary text-slate-600 hover:text-rose-600 hover:border-rose-200 text-xs font-bold transition-all disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Queue</span>
          </button>
        </div>
      </div>
    </div>
  );
}
