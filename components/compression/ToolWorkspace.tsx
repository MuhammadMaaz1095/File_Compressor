'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  QueueItem,
  CompressionSettings,
  SupportedCategory,
} from '@/lib/compression/types';
import { getCategoryFromFile } from '@/lib/utils/formatters';
import { compareFileSizes } from '@/lib/compression/file-size';
import { formatCompressionErrorMessage } from '@/lib/compression/compression-errors';
import { extractMediaMetadataSafely, testBrowserMediaSupport } from '@/lib/utils/media-support';
import { FileDropzone } from './FileDropzone';
import { CompressionControls } from './CompressionControls';
import { CompressionItemRow } from './CompressionItemRow';
import { StatsOverview } from './StatsOverview';
import { ImageCompareModal } from './ImageCompareModal';
import {
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

interface ToolWorkspaceProps {
  category?: SupportedCategory;
  isHeroSplit?: boolean;
}

const DEFAULT_SETTINGS: CompressionSettings = {
  image: {
    preset: 'balanced',
    quality: 75,
    outputFormat: 'original',
    maxWidth: undefined,
    maxHeight: undefined,
  },
  pdf: {
    preset: 'balanced',
    stripMetadata: true,
    compressStreams: true,
    removeAnnotations: false,
  },
  video: {
    preset: 'balanced',
    resolution: '720p',
    bitrateKbps: 1600,
    removeAudio: false,
    outputFormat: 'auto',
  },
  audio: {
    preset: 'balanced',
    bitrateKbps: 128,
    outputFormat: 'audio/mpeg',
    channels: 'keep',
  },
};

export function ToolWorkspace({
  category = 'all',
  isHeroSplit = false,
}: ToolWorkspaceProps) {
  const [items, setItems] = useState<QueueItem[]>([]);
  const [settings, setSettings] = useState<CompressionSettings>(DEFAULT_SETTINGS);
  const [isProcessing, setIsProcessing] = useState(false);
  const [compareItem, setCompareItem] = useState<QueueItem | null>(null);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const previewUrlsRef = useRef<Set<string>>(new Set());

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      previewUrlsRef.current.clear();
    };
  }, []);

  // Handle adding new files
  const handleFilesSelected = (newFiles: File[]) => {
    setNotification(null);

    setItems((prevItems) => {
      const updated = [...prevItems];

      newFiles.forEach((file) => {
        const isDuplicate = updated.some(
          (item) => item.name === file.name && item.originalSize === file.size
        );
        if (isDuplicate) return;

        const cat = getCategoryFromFile(file);
        let previewUrl: string | undefined = undefined;

        if (cat === 'image') {
          previewUrl = URL.createObjectURL(file);
          previewUrlsRef.current.add(previewUrl);
        } else if (cat === 'video' || cat === 'audio') {
          // Verify browser can natively decode format before setting object URL preview
          const support = testBrowserMediaSupport(file, cat);
          if (support.canPlay) {
            previewUrl = URL.createObjectURL(file);
            previewUrlsRef.current.add(previewUrl);
          }
        }

        const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        const newItem: QueueItem = {
          id,
          file,
          name: file.name,
          type: file.type,
          category: cat,
          originalSize: file.size,
          compressedSize: null,
          compressedBlob: null,
          status: 'idle',
          progress: 0,
          reductionPercent: null,
          savingsBytes: null,
          durationMs: null,
          previewUrl,
        };

        // Extract media metadata safely without creating uncaught NotSupportedError
        if (cat === 'video' || cat === 'audio') {
          extractMediaMetadataSafely(file, cat).then((meta) => {
            setItems((currentList) =>
              currentList.map((it) =>
                it.id === id
                  ? {
                      ...it,
                      width: meta.width ?? it.width,
                      height: meta.height ?? it.height,
                      mediaDuration: meta.duration ?? it.mediaDuration,
                      previewUnsupported: !meta.canPreview,
                      previewWarning: meta.warning,
                    }
                  : it
              )
            );
          });
        }

        updated.push(newItem);
      });

      return updated;
    });
  };

  // Remove single item
  const handleRemoveItem = (id: string) => {
    setItems((prev) => {
      const itemToRemove = prev.find((item) => item.id === id);
      if (itemToRemove?.previewUrl) {
        URL.revokeObjectURL(itemToRemove.previewUrl);
        previewUrlsRef.current.delete(itemToRemove.previewUrl);
      }
      if (itemToRemove?.compressedPreviewUrl) {
        URL.revokeObjectURL(itemToRemove.compressedPreviewUrl);
        previewUrlsRef.current.delete(itemToRemove.compressedPreviewUrl);
      }
      return prev.filter((item) => item.id !== id);
    });
  };

  // Clear all items
  const handleClearAll = () => {
    items.forEach((item) => {
      if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
      if (item.compressedPreviewUrl) URL.revokeObjectURL(item.compressedPreviewUrl);
    });
    previewUrlsRef.current.clear();
    setItems([]);
  };

  // Process a single item
  const processItem = async (
    item: QueueItem,
    currentSettings: CompressionSettings
  ): Promise<QueueItem> => {
    try {
      let result;
      let compressedPreviewUrl: string | undefined = undefined;

      if (item.category === 'image') {
        const { compressImage } = await import('@/lib/compression/imageCompressor');
        result = await compressImage(
          item.file,
          currentSettings.image,
          (progress) => {
            setItems((curr) =>
              curr.map((it) => (it.id === item.id ? { ...it, progress } : it))
            );
          }
        );

        if (result.blob.type.startsWith('image/')) {
          compressedPreviewUrl = URL.createObjectURL(result.blob);
          previewUrlsRef.current.add(compressedPreviewUrl);
        }
      } else if (item.category === 'pdf') {
        const { compressPdf } = await import('@/lib/compression/pdfCompressor');
        result = await compressPdf(
          item.file,
          currentSettings.pdf,
          (progress) => {
            setItems((curr) =>
              curr.map((it) => (it.id === item.id ? { ...it, progress } : it))
            );
          }
        );
      } else if (item.category === 'video') {
        const { compressVideo } = await import('@/lib/compression/videoCompressor');
        result = await compressVideo(
          item.file,
          currentSettings.video,
          (progress) => {
            setItems((curr) =>
              curr.map((it) => (it.id === item.id ? { ...it, progress } : it))
            );
          }
        );

        const videoOutExt = result.blob.type.includes('mp4') ? 'mp4' : 'webm';
        const videoOutSupport = testBrowserMediaSupport(result.blob, 'video', `output.${videoOutExt}`);
        if (videoOutSupport.canPlay) {
          compressedPreviewUrl = URL.createObjectURL(result.blob);
          previewUrlsRef.current.add(compressedPreviewUrl);
        }
      } else if (item.category === 'audio') {
        const { compressAudio } = await import('@/lib/compression/audioCompressor');
        result = await compressAudio(
          item.file,
          currentSettings.audio,
          (progress) => {
            setItems((curr) =>
              curr.map((it) => (it.id === item.id ? { ...it, progress } : it))
            );
          }
        );

        const audioOutExt = result.blob.type.includes('wav') ? 'wav' : 'mp3';
        const audioOutSupport = testBrowserMediaSupport(result.blob, 'audio', `output.${audioOutExt}`);
        if (audioOutSupport.canPlay) {
          compressedPreviewUrl = URL.createObjectURL(result.blob);
          previewUrlsRef.current.add(compressedPreviewUrl);
        }
      } else {
        throw new Error('Unsupported file format for compression.');
      }

      // Canonical size comparison
      const comparison = compareFileSizes(item.originalSize, result.compressedSize);

      let itemStatus: 'completed' | 'larger' | 'unchanged' = 'completed';
      if (comparison.outcome === 'larger') {
        itemStatus = 'larger';
      } else if (comparison.outcome === 'unchanged') {
        itemStatus = 'unchanged';
      }

      // Can retry with 'smaller' preset if output is larger and preset isn't already 'smaller'
      const activePreset =
        item.category === 'video'
          ? currentSettings.video.preset
          : item.category === 'audio'
          ? currentSettings.audio.preset
          : item.category === 'image'
          ? currentSettings.image.preset
          : 'balanced';

      const canRetrySmaller = comparison.outcome === 'larger' && activePreset !== 'smaller';

      return {
        ...item,
        status: itemStatus,
        progress: 100,
        compressedSize: result.compressedSize,
        compressedBlob: result.blob,
        savingsBytes: comparison.savedBytes,
        reductionPercent: comparison.reductionPercent,
        increasePercent: comparison.increasePercent,
        outcome: comparison.outcome,
        canRetrySmaller,
        durationMs: result.durationMs,
        compressedPreviewUrl,
        compressedWidth: result.width,
        compressedHeight: result.height,
        bitrateKbps: result.bitrateKbps,
        originalBitrateKbps: result.originalBitrateKbps || item.originalBitrateKbps,
        mediaDuration: result.durationSeconds || item.mediaDuration,
      };
    } catch (err: unknown) {
      const message = formatCompressionErrorMessage(err);
      return {
        ...item,
        status: 'error',
        progress: 0,
        errorMessage: message,
      };
    }
  };

  // Retry an item with aggressive 'smaller' preset
  const handleRetrySmaller = async (id: string) => {
    const item = items.find((it) => it.id === id);
    if (!item) return;

    // Build specific smaller settings for this item
    const smallerSettings: CompressionSettings = {
      ...settings,
      image: {
        ...settings.image,
        preset: 'smaller',
        quality: 50,
        maxWidth: 1280,
      },
      video: {
        ...settings.video,
        preset: 'smaller',
        resolution: '480p',
      },
      audio: {
        ...settings.audio,
        preset: 'smaller',
        bitrateKbps: 64,
        channels: 'mono',
      },
    };

    setItems((curr) =>
      curr.map((it) =>
        it.id === id
          ? {
              ...it,
              status: 'processing',
              progress: 10,
              errorMessage: undefined,
            }
          : it
      )
    );

    const updated = await processItem(item, smallerSettings);

    setItems((curr) =>
      curr.map((it) => (it.id === id ? updated : it))
    );
  };

  // Compress All
  const handleCompressAll = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setNotification(null);

    const pending = items.filter((item) => item.status === 'idle');

    for (const pendingItem of pending) {
      setItems((curr) =>
        curr.map((it) =>
          it.id === pendingItem.id ? { ...it, status: 'processing', progress: 5 } : it
        )
      );

      const updated = await processItem(pendingItem, settings);

      setItems((curr) =>
        curr.map((it) => (it.id === pendingItem.id ? updated : it))
      );
    }

    setIsProcessing(false);
  };

  // Download all as ZIP
  const handleDownloadZip = async () => {
    try {
      const { downloadAllAsZip } = await import('@/lib/compression/zipExporter');
      await downloadAllAsZip(items, `filecompress-bundle-${Date.now()}.zip`);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to create zip bundle';
      setNotification({ type: 'error', text: message });
    }
  };

  const hasImages =
    items.some((it) => it.category === 'image') || category === 'image' || category === 'all';
  const hasPdfs =
    items.some((it) => it.category === 'pdf') || category === 'pdf' || category === 'all';
  const hasVideos =
    items.some((it) => it.category === 'video') || category === 'video' || category === 'all';
  const hasAudios =
    items.some((it) => it.category === 'audio') || category === 'audio' || category === 'all';

  return (
    <div className="w-full mx-auto">
      {/* Upload Dropzone */}
      <div className="mb-6">
        <FileDropzone
          onFilesSelected={handleFilesSelected}
          allowedCategory={category}
          disabled={isProcessing}
        />
      </div>

      {/* Notifications */}
      {notification && (
        <div
          role="alert"
          className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm border animate-in fade-in duration-200 ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span>{notification.text}</span>
        </div>
      )}

      {/* Active Workspace */}
      {items.length > 0 && (
        <div className="animate-in fade-in duration-300">
          {/* Controls & Presets */}
          <CompressionControls
            settings={settings}
            onChange={setSettings}
            hasImages={hasImages}
            hasPdfs={hasPdfs}
            hasVideos={hasVideos}
            hasAudios={hasAudios}
            disabled={isProcessing}
          />

          {/* Statistics & Batch Actions */}
          <StatsOverview
            items={items}
            isProcessing={isProcessing}
            onCompressAll={handleCompressAll}
            onDownloadZip={handleDownloadZip}
            onClearAll={handleClearAll}
          />

          {/* Queue List */}
          <div className="space-y-3 mb-8" aria-label="Selected files compression list">
            {items.map((item) => (
              <CompressionItemRow
                key={item.id}
                item={item}
                onRemove={handleRemoveItem}
                onCompare={setCompareItem}
                onRetrySmaller={handleRetrySmaller}
              />
            ))}
          </div>
        </div>
      )}

      {/* Image Comparison Modal */}
      {compareItem && (
        <ImageCompareModal
          item={compareItem}
          onClose={() => setCompareItem(null)}
        />
      )}
    </div>
  );
}
