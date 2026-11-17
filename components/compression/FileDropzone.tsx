'use client';

import React, { useRef, useState, DragEvent, ChangeEvent } from 'react';
import { UploadCloud, ShieldCheck, AlertCircle, Sparkles, FolderUp } from 'lucide-react';
import { validateFile } from '@/lib/utils/validation';

interface FileDropzoneProps {
  onFilesSelected: (files: File[]) => void;
  allowedCategory?: 'all' | 'image' | 'pdf' | 'video' | 'audio';
  disabled?: boolean;
}

export function FileDropzone({
  onFilesSelected,
  allowedCategory = 'all',
  disabled = false,
}: FileDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  let acceptString = '';
  if (allowedCategory === 'image') {
    acceptString = 'image/jpeg,image/png,image/webp,image/svg+xml,image/tiff,image/gif,.jpg,.jpeg,.png,.webp,.svg,.tiff,.tif,.gif';
  } else if (allowedCategory === 'pdf') {
    acceptString = 'application/pdf,.pdf';
  } else if (allowedCategory === 'video') {
    acceptString = 'video/mp4,video/webm,video/quicktime,video/x-msvideo,.mp4,.webm,.mov,.avi';
  } else if (allowedCategory === 'audio') {
    acceptString = 'audio/mpeg,audio/wav,audio/mp4,audio/aac,audio/ogg,audio/flac,.mp3,.wav,.m4a,.aac,.ogg,.flac';
  } else {
    acceptString =
      'image/jpeg,image/png,image/webp,image/svg+xml,image/tiff,image/gif,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.openxmlformats-officedocument.presentationml.presentation,video/mp4,video/webm,video/quicktime,audio/mpeg,audio/wav,audio/mp4,audio/ogg,.jpg,.jpeg,.png,.webp,.svg,.tiff,.tif,.gif,.pdf,.docx,.xlsx,.pptx,.mp4,.webm,.mov,.mp3,.wav,.m4a,.ogg';
  }

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setErrorMessage(null);

    const validFiles: File[] = [];
    const errors: string[] = [];

    Array.from(fileList).forEach((file) => {
      const validation = validateFile(file, allowedCategory);
      if (validation.isValid) {
        validFiles.push(file);
      } else if (validation.error) {
        errors.push(`${file.name}: ${validation.error}`);
      }
    });

    if (errors.length > 0) {
      setErrorMessage(errors[0]);
    }

    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onDragOverHandler = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragOver(true);
  };

  const onDragLeaveHandler = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const onDropHandler = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (!disabled && e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const onInputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  return (
    <div className="w-full">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        id="file-dropzone-input"
        type="file"
        multiple
        accept={acceptString}
        onChange={onInputChangeHandler}
        className="hidden"
        disabled={disabled}
        tabIndex={-1}
        aria-hidden="true"
      />

      {/* Main Interactive Glass Dropzone Surface */}
      <div
        onDragOver={onDragOverHandler}
        onDragLeave={onDragLeaveHandler}
        onDrop={onDropHandler}
        onClick={() => !disabled && fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        aria-label="Drag & drop files here, or click to browse files from your device"
        className={`relative cursor-pointer rounded-3xl p-8 sm:p-12 text-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 ${
          isDragOver
            ? 'border-2 border-blue-500 bg-blue-50/80 scale-[1.01] shadow-xl shadow-blue-500/15'
            : 'recessed-dropzone hover:scale-[1.005]'
        } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
      >
        <div className="flex flex-col items-center justify-center max-w-lg mx-auto">
          {/* 3D SaaS Upload Icon Container */}
          <div
            className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 ${
              isDragOver
                ? 'bg-gradient-to-tr from-blue-600 to-sky-400 text-white scale-110 shadow-lg shadow-blue-500/30'
                : 'bg-gradient-to-tr from-blue-600/15 via-blue-500/10 to-sky-400/25 text-blue-600 border border-blue-200/80 shadow-2xs hover:scale-105'
            }`}
          >
            <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/50 to-transparent rounded-t-2xl pointer-events-none" />
            <UploadCloud className="w-8 h-8 sm:w-10 sm:h-10 relative z-10 drop-shadow-xs" />
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight mb-2">
            Drag &amp; drop your files here
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mb-6 font-medium">
            or click anywhere to browse from your device
          </p>

          {/* Primary Action Button (Blue 3D Styled) */}
          <span
            aria-hidden="true"
            className="px-6 py-2.5 rounded-xl btn-3d-primary text-xs sm:text-sm inline-flex items-center gap-2 pointer-events-none"
          >
            <FolderUp className="w-4 h-4" />
            <span>Choose Files</span>
          </span>

          {/* Format Guidance & Privacy Pill */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500 font-medium">
            <span className="font-bold text-slate-700">Supported:</span>
            {allowedCategory === 'all' && (
              <>
                <span className="px-2.5 py-0.5 rounded-lg bg-white/95 border border-slate-200 text-slate-700 font-bold text-[11px] shadow-2xs">
                  Images (JPG, PNG, WebP, SVG, TIFF, GIF)
                </span>
                <span className="px-2.5 py-0.5 rounded-lg bg-white/95 border border-slate-200 text-slate-700 font-bold text-[11px] shadow-2xs">
                  PDF &amp; Office
                </span>
                <span className="px-2.5 py-0.5 rounded-lg bg-white/95 border border-slate-200 text-slate-700 font-bold text-[11px] shadow-2xs">
                  Video &amp; Audio
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                  On-Device Privacy
                </span>
              </>
            )}
            {allowedCategory === 'image' && (
              <>
                <span className="px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 font-bold text-[11px]">JPG</span>
                <span className="px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 font-bold text-[11px]">PNG</span>
                <span className="px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 font-bold text-[11px]">WebP</span>
                <span className="px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 font-bold text-[11px]">SVG</span>
                <span className="px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 font-bold text-[11px]">TIFF</span>
                <span className="px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 font-bold text-[11px]">GIF</span>
              </>
            )}
            {allowedCategory === 'pdf' && (
              <span className="px-2.5 py-0.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 font-bold text-[11px]">
                PDF Documents
              </span>
            )}
            {allowedCategory === 'video' && (
              <>
                <span className="px-2.5 py-0.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 font-bold text-[11px]">MP4</span>
                <span className="px-2.5 py-0.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 font-bold text-[11px]">WebM</span>
                <span className="px-2.5 py-0.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 font-bold text-[11px]">MOV</span>
              </>
            )}
            {allowedCategory === 'audio' && (
              <>
                <span className="px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[11px]">MP3</span>
                <span className="px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[11px]">WAV</span>
                <span className="px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[11px]">M4A</span>
                <span className="px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[11px]">OGG</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Validation Error Message */}
      {errorMessage && (
        <div
          role="alert"
          className="mt-4 p-3.5 rounded-2xl bg-rose-50/90 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2 shadow-2xs animate-in fade-in"
        >
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
