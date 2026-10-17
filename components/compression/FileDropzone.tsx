'use client';

import React, { useRef, useState, DragEvent, ChangeEvent } from 'react';
import { UploadCloud, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';
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
    acceptString = 'image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp';
  } else if (allowedCategory === 'pdf') {
    acceptString = 'application/pdf,.pdf';
  } else if (allowedCategory === 'video') {
    acceptString = 'video/mp4,video/webm,video/quicktime,video/x-msvideo,.mp4,.webm,.mov,.avi';
  } else if (allowedCategory === 'audio') {
    acceptString = 'audio/mpeg,audio/wav,audio/mp4,audio/aac,audio/ogg,audio/flac,.mp3,.wav,.m4a,.aac,.ogg,.flac';
  } else {
    acceptString =
      'image/jpeg,image/png,image/webp,application/pdf,video/mp4,video/webm,video/quicktime,audio/mpeg,audio/wav,audio/mp4,audio/ogg,.jpg,.jpeg,.png,.webp,.pdf,.mp4,.webm,.mov,.mp3,.wav,.m4a,.ogg';
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
        aria-label="Upload files area. Drag and drop or press enter to browse files."
        className={`relative cursor-pointer rounded-2xl sm:rounded-3xl border-2 border-dashed p-7 sm:p-11 text-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 ${
          isDragOver
            ? 'border-blue-500 bg-blue-50/70 scale-[1.01] shadow-xl shadow-blue-500/10'
            : 'border-slate-300/80 hover:border-blue-400 recessed-dropzone hover:shadow-md'
        } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptString}
          onChange={onInputChangeHandler}
          className="hidden"
          disabled={disabled}
          tabIndex={-1}
        />

        <div className="flex flex-col items-center justify-center max-w-lg mx-auto">
          {/* SaaS Upload Icon */}
          <div
            className={`relative w-16 h-16 sm:w-18 sm:h-18 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 ${
              isDragOver
                ? 'bg-gradient-to-tr from-blue-600 to-sky-400 text-white scale-105 shadow-lg shadow-blue-500/25'
                : 'bg-gradient-to-tr from-blue-600/10 via-blue-500/10 to-sky-400/20 text-blue-600 border border-blue-200/80 shadow-2xs'
            }`}
          >
            <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent rounded-t-2xl pointer-events-none" />
            <UploadCloud className="w-8 h-8 sm:w-9 sm:h-9 relative z-10" />
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight mb-1.5">
            Drag &amp; drop files here
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mb-5 font-medium">
            or click anywhere to browse from your device
          </p>

          {/* Raised Browse Button */}
          <button
            type="button"
            className="px-6 py-2.5 rounded-xl btn-3d-primary font-semibold text-xs sm:text-sm shadow-sm focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
          >
            Browse Files
          </button>

          {/* Formats & Limits Pills */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-1.5 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">Supported:</span>
            {allowedCategory === 'all' && (
              <>
                <span className="px-2 py-0.5 rounded-lg bg-white/90 border border-slate-200/90 text-slate-700 font-semibold text-[11px] shadow-2xs">Images</span>
                <span className="px-2 py-0.5 rounded-lg bg-white/90 border border-slate-200/90 text-slate-700 font-semibold text-[11px] shadow-2xs">PDF</span>
                <span className="px-2 py-0.5 rounded-lg bg-white/90 border border-slate-200/90 text-slate-700 font-semibold text-[11px] shadow-2xs">MP4 / WebM</span>
                <span className="px-2 py-0.5 rounded-lg bg-white/90 border border-slate-200/90 text-slate-700 font-semibold text-[11px] shadow-2xs">MP3 / WAV</span>
                <span className="text-slate-300">•</span>
                <span className="text-[11px] font-medium text-slate-500">Up to 100MB</span>
              </>
            )}
            {allowedCategory === 'image' && (
              <>
                <span className="px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 font-semibold text-[11px]">JPEG</span>
                <span className="px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 font-semibold text-[11px]">PNG</span>
                <span className="px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 font-semibold text-[11px]">WebP</span>
                <span className="text-slate-300">•</span>
                <span className="text-[11px] font-medium text-slate-500">Max 50MB</span>
              </>
            )}
            {allowedCategory === 'pdf' && (
              <>
                <span className="px-2 py-0.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 font-semibold text-[11px]">PDF Documents</span>
                <span className="text-slate-300">•</span>
                <span className="text-[11px] font-medium text-slate-500">Max 50MB</span>
              </>
            )}
            {allowedCategory === 'video' && (
              <>
                <span className="px-2 py-0.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 font-semibold text-[11px]">MP4</span>
                <span className="px-2 py-0.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 font-semibold text-[11px]">WebM</span>
                <span className="px-2 py-0.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 font-semibold text-[11px]">MOV</span>
                <span className="text-slate-300">•</span>
                <span className="text-[11px] font-medium text-slate-500">Max 100MB</span>
              </>
            )}
            {allowedCategory === 'audio' && (
              <>
                <span className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold text-[11px]">MP3</span>
                <span className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold text-[11px]">WAV</span>
                <span className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold text-[11px]">M4A</span>
                <span className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold text-[11px]">OGG</span>
                <span className="text-slate-300">•</span>
                <span className="text-[11px] font-medium text-slate-500">Max 50MB</span>
              </>
            )}
          </div>

          {/* Privacy statement */}
          <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-600 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Files are processed locally in your browser sandbox — zero server uploads</span>
          </div>
        </div>
      </div>

      {/* Validation Error Alert */}
      {errorMessage && (
        <div
          role="alert"
          className="mt-3 p-3.5 rounded-xl bg-amber-50/95 border border-amber-200 text-amber-900 text-xs flex items-center justify-between shadow-xs animate-in fade-in duration-200"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="font-medium">{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-amber-700 hover:text-amber-900 font-bold px-2 py-1 rounded hover:bg-amber-100/60 transition-colors"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}
