'use client';

import React, { useState } from 'react';
import {
  Sliders,
  CheckCircle,
  Zap,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Settings,
  Film,
  Music,
  VolumeX,
} from 'lucide-react';
import {
  CompressionPreset,
  CompressionSettings,
  OutputImageFormat,
  VideoResolutionOption,
  AudioBitrateOption,
  AudioOutputFormatOption,
} from '@/lib/compression/types';

interface CompressionControlsProps {
  settings: CompressionSettings;
  onChange: (newSettings: CompressionSettings) => void;
  hasImages: boolean;
  hasPdfs: boolean;
  hasVideos?: boolean;
  hasAudios?: boolean;
  disabled?: boolean;
}

export function CompressionControls({
  settings,
  onChange,
  hasImages,
  hasPdfs,
  hasVideos = false,
  hasAudios = false,
  disabled = false,
}: CompressionControlsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handlePresetSelect = (preset: CompressionPreset) => {
    let imgQuality = 75;
    let maxWidth: number | undefined = undefined;
    let maxHeight: number | undefined = undefined;

    let videoRes: VideoResolutionOption = '720p';
    let videoBitrate = 1600;

    let audioBitrate: AudioBitrateOption = 128;

    if (preset === 'smaller') {
      imgQuality = 55;
      maxWidth = 1600;
      maxHeight = 1600;
      videoRes = '480p';
      videoBitrate = 750;
      audioBitrate = 96;
    } else if (preset === 'quality') {
      imgQuality = 90;
      maxWidth = undefined;
      maxHeight = undefined;
      videoRes = 'original';
      videoBitrate = 3200;
      audioBitrate = 256;
    }

    onChange({
      ...settings,
      image: {
        ...settings.image,
        preset,
        quality: imgQuality,
        maxWidth,
        maxHeight,
      },
      pdf: {
        ...settings.pdf,
        preset,
        stripMetadata: preset !== 'quality',
        compressStreams: true,
      },
      video: {
        ...settings.video,
        preset,
        resolution: videoRes,
        bitrateKbps: videoBitrate,
      },
      audio: {
        ...settings.audio,
        preset,
        bitrateKbps: audioBitrate,
      },
    });
  };

  const currentPreset = settings.image.preset;

  return (
    <div className="w-full glass-panel rounded-2xl p-5 mb-6 transition-all shadow-xs border border-slate-200/80">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Preset Selector */}
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <Sliders className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-extrabold text-[#0F172A] tracking-wider uppercase">
              Compression Preset
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2" role="radiogroup" aria-label="Compression Presets">
            {/* Balanced */}
            <button
              type="button"
              role="radio"
              aria-checked={currentPreset === 'balanced'}
              disabled={disabled}
              onClick={() => handlePresetSelect('balanced')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                currentPreset === 'balanced'
                  ? 'btn-3d-primary'
                  : 'btn-3d-secondary'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Balanced (Recommended)</span>
            </button>

            {/* Smaller File */}
            <button
              type="button"
              role="radio"
              aria-checked={currentPreset === 'smaller'}
              disabled={disabled}
              onClick={() => handlePresetSelect('smaller')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                currentPreset === 'smaller'
                  ? 'btn-3d-primary'
                  : 'btn-3d-secondary'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Smaller File</span>
            </button>

            {/* High Quality */}
            <button
              type="button"
              role="radio"
              aria-checked={currentPreset === 'quality'}
              disabled={disabled}
              onClick={() => handlePresetSelect('quality')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                currentPreset === 'quality'
                  ? 'btn-3d-primary'
                  : 'btn-3d-secondary'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>High Quality</span>
            </button>
          </div>
        </div>

        {/* Toggle Custom Settings */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 self-start sm:self-center px-3.5 py-2 text-xs font-semibold btn-3d-secondary rounded-xl transition-all"
          aria-expanded={isOpen}
        >
          <Settings className="w-3.5 h-3.5 text-blue-600" />
          <span>{isOpen ? 'Hide Options' : 'Custom Options'}</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Expanded Custom Settings */}
      {isOpen && (
        <div className="mt-5 pt-5 border-t border-slate-200/80 grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-top-2 duration-150">
          {/* Video Custom Controls */}
          {hasVideos && (
            <div className="space-y-4 p-4 rounded-xl bg-white/70 border border-slate-200/80 shadow-2xs">
              <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5 text-purple-600" />
                <span>Video Settings</span>
              </h4>

              {/* Resolution */}
              <div>
                <label htmlFor="video-resolution" className="block text-xs font-semibold text-[#0F172A] mb-1.5">
                  Output Resolution:
                </label>
                <select
                  id="video-resolution"
                  value={settings.video.resolution}
                  disabled={disabled}
                  onChange={(e) =>
                    onChange({
                      ...settings,
                      video: {
                        ...settings.video,
                        resolution: e.target.value as VideoResolutionOption,
                      },
                    })
                  }
                  className="w-full text-xs bg-white border border-slate-300/80 rounded-xl px-3 py-2 text-slate-800 shadow-2xs focus:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-600"
                >
                  <option value="original">Keep Original Resolution</option>
                  <option value="1080p">1080p Full HD (Max 1920&times;1080)</option>
                  <option value="720p">720p HD (Max 1280&times;720, Recommended)</option>
                  <option value="480p">480p SD (Max 854&times;480, For Email/Discord)</option>
                  <option value="360p">360p Low (Max 640&times;360, Smallest size)</option>
                </select>
              </div>

              {/* Bitrate & Target Size */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="video-bitrate" className="block text-xs font-semibold text-[#0F172A] mb-1">
                    Bitrate (kbps):
                  </label>
                  <input
                    id="video-bitrate"
                    type="number"
                    step="100"
                    min="300"
                    max="8000"
                    value={settings.video.bitrateKbps || 1600}
                    disabled={disabled}
                    onChange={(e) =>
                      onChange({
                        ...settings,
                        video: {
                          ...settings.video,
                          bitrateKbps: parseInt(e.target.value, 10) || 1600,
                        },
                      })
                    }
                    className="w-full text-xs bg-white border border-slate-300/80 rounded-xl px-3 py-1.5 text-slate-800 shadow-2xs focus:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-600"
                  />
                </div>

                <div>
                  <label htmlFor="video-target-size" className="block text-xs font-semibold text-[#0F172A] mb-1">
                    Target Size (MB):
                  </label>
                  <input
                    id="video-target-size"
                    type="number"
                    placeholder="e.g. 25"
                    value={settings.video.targetSizeMB || ''}
                    disabled={disabled}
                    onChange={(e) =>
                      onChange({
                        ...settings,
                        video: {
                          ...settings.video,
                          targetSizeMB: e.target.value ? parseFloat(e.target.value) : undefined,
                        },
                      })
                    }
                    className="w-full text-xs bg-white border border-slate-300/80 rounded-xl px-3 py-1.5 text-slate-800 shadow-2xs focus:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-600"
                  />
                </div>
              </div>

              {/* Remove Audio Toggle */}
              <label className="flex items-center gap-2 cursor-pointer text-xs text-[#0F172A] pt-1">
                <input
                  type="checkbox"
                  checked={settings.video.removeAudio}
                  disabled={disabled}
                  onChange={(e) =>
                    onChange({
                      ...settings,
                      video: { ...settings.video, removeAudio: e.target.checked },
                    })
                  }
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="flex items-center gap-1 font-medium">
                  <VolumeX className="w-3.5 h-3.5 text-slate-500" />
                  Mute / Remove audio track to save space
                </span>
              </label>
            </div>
          )}

          {/* Audio Custom Controls */}
          {hasAudios && (
            <div className="space-y-4 p-4 rounded-xl bg-white/70 border border-slate-200/80 shadow-2xs">
              <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5 text-emerald-600" />
                <span>Audio Settings</span>
              </h4>

              {/* Bitrate */}
              <div>
                <label htmlFor="audio-bitrate" className="block text-xs font-semibold text-[#0F172A] mb-1.5">
                  Audio Bitrate:
                </label>
                <select
                  id="audio-bitrate"
                  value={settings.audio.bitrateKbps}
                  disabled={disabled}
                  onChange={(e) =>
                    onChange({
                      ...settings,
                      audio: {
                        ...settings.audio,
                        bitrateKbps: parseInt(e.target.value, 10) as AudioBitrateOption,
                      },
                    })
                  }
                  className="w-full text-xs bg-white border border-slate-300/80 rounded-xl px-3 py-2 text-slate-800 shadow-2xs focus:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-600"
                >
                  <option value="64">64 kbps (Voice / Smallest size)</option>
                  <option value="96">96 kbps (Podcasts / High efficiency)</option>
                  <option value="128">128 kbps (Standard quality, Recommended)</option>
                  <option value="192">192 kbps (High fidelity music)</option>
                  <option value="256">256 kbps (Near CD quality)</option>
                  <option value="320">320 kbps (Maximum MP3 bitrate)</option>
                </select>
              </div>

              {/* Format & Channels */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="audio-format" className="block text-xs font-semibold text-[#0F172A] mb-1">
                    Format:
                  </label>
                  <select
                    id="audio-format"
                    value={settings.audio.outputFormat}
                    disabled={disabled}
                    onChange={(e) =>
                      onChange({
                        ...settings,
                        audio: {
                          ...settings.audio,
                          outputFormat: e.target.value as AudioOutputFormatOption,
                        },
                      })
                    }
                    className="w-full text-xs bg-white border border-slate-300/80 rounded-xl px-3 py-1.5 text-slate-800 shadow-2xs focus:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-600"
                  >
                    <option value="audio/mpeg">MP3 (Universal)</option>
                    <option value="audio/wav">WAV (Lossless PCM)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="audio-channels" className="block text-xs font-semibold text-[#0F172A] mb-1">
                    Channels:
                  </label>
                  <select
                    id="audio-channels"
                    value={settings.audio.channels}
                    disabled={disabled}
                    onChange={(e) =>
                      onChange({
                        ...settings,
                        audio: {
                          ...settings.audio,
                          channels: e.target.value as 'keep' | 'mono',
                        },
                      })
                    }
                    className="w-full text-xs bg-white border border-slate-300/80 rounded-xl px-3 py-1.5 text-slate-800 shadow-2xs focus:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-600"
                  >
                    <option value="keep">Keep Original</option>
                    <option value="mono">Convert to Mono (-50% size)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Image Custom Controls */}
          {hasImages && (
            <div className="space-y-4 p-4 rounded-xl bg-white/70 border border-slate-200/80 shadow-2xs">
              <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
                <span>Image Settings</span>
              </h4>

              {/* Quality Slider */}
              <div>
                <div className="flex justify-between items-center mb-1.5 text-xs">
                  <label htmlFor="quality-slider" className="font-semibold text-[#0F172A]">
                    Quality Level:
                  </label>
                  <span className="font-extrabold text-blue-600">{settings.image.quality}%</span>
                </div>
                <input
                  id="quality-slider"
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={settings.image.quality}
                  disabled={disabled}
                  onChange={(e) =>
                    onChange({
                      ...settings,
                      image: { ...settings.image, quality: parseInt(e.target.value, 10) },
                    })
                  }
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              {/* Output Format */}
              <div>
                <label htmlFor="output-format" className="block text-xs font-semibold text-[#0F172A] mb-1.5">
                  Output Format:
                </label>
                <select
                  id="output-format"
                  value={settings.image.outputFormat}
                  disabled={disabled}
                  onChange={(e) =>
                    onChange({
                      ...settings,
                      image: {
                        ...settings.image,
                        outputFormat: e.target.value as OutputImageFormat,
                      },
                    })
                  }
                  className="w-full text-xs bg-white border border-slate-300/80 rounded-xl px-3 py-2 text-slate-800 shadow-2xs focus:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-600"
                >
                  <option value="original">Keep original format</option>
                  <option value="image/webp">Convert to WebP (Recommended)</option>
                  <option value="image/jpeg">Convert to JPEG</option>
                  <option value="image/png">Convert to PNG</option>
                </select>
              </div>

              {/* Resize Options */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="max-width" className="block text-xs font-semibold text-[#0F172A] mb-1">
                    Max Width (px):
                  </label>
                  <input
                    id="max-width"
                    type="number"
                    placeholder="Auto"
                    value={settings.image.maxWidth || ''}
                    disabled={disabled}
                    onChange={(e) =>
                      onChange({
                        ...settings,
                        image: {
                          ...settings.image,
                          maxWidth: e.target.value ? parseInt(e.target.value, 10) : undefined,
                        },
                      })
                    }
                    className="w-full text-xs bg-white border border-slate-300/80 rounded-xl px-3 py-1.5 text-slate-800 shadow-2xs focus:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-600"
                  />
                </div>
                <div>
                  <label htmlFor="max-height" className="block text-xs font-semibold text-[#0F172A] mb-1">
                    Max Height (px):
                  </label>
                  <input
                    id="max-height"
                    type="number"
                    placeholder="Auto"
                    value={settings.image.maxHeight || ''}
                    disabled={disabled}
                    onChange={(e) =>
                      onChange({
                        ...settings,
                        image: {
                          ...settings.image,
                          maxHeight: e.target.value ? parseInt(e.target.value, 10) : undefined,
                        },
                      })
                    }
                    className="w-full text-xs bg-white border border-slate-300/80 rounded-xl px-3 py-1.5 text-slate-800 shadow-2xs focus:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-600"
                  />
                </div>
              </div>
            </div>
          )}

          {/* PDF Custom Controls */}
          {hasPdfs && (
            <div className="space-y-4 p-4 rounded-xl bg-white/70 border border-slate-200/80 shadow-2xs">
              <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
                <span>PDF Settings</span>
              </h4>

              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#0F172A]">
                <input
                  type="checkbox"
                  checked={settings.pdf.compressStreams}
                  disabled={disabled}
                  onChange={(e) =>
                    onChange({
                      ...settings,
                      pdf: { ...settings.pdf, compressStreams: e.target.checked },
                    })
                  }
                  className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="font-semibold block">Compress Object Streams</span>
                  <span className="text-[11px] text-slate-500">
                    Packs indirect objects into compressed flate streams for smaller PDFs.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#0F172A]">
                <input
                  type="checkbox"
                  checked={settings.pdf.stripMetadata}
                  disabled={disabled}
                  onChange={(e) =>
                    onChange({
                      ...settings,
                      pdf: { ...settings.pdf, stripMetadata: e.target.checked },
                    })
                  }
                  className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="font-semibold block">Strip Non-Essential Metadata</span>
                  <span className="text-[11px] text-slate-500">
                    Removes author, creator tool info, and internal tags to conserve space.
                  </span>
                </div>
              </label>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
