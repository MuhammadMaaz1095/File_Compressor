import React from 'react';
import Link from 'next/link';
import { FileArchive, ArrowLeft, Image as ImageIcon, FileText, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="flex-1 flex items-center justify-center py-20 px-4 sm:px-6">
      <div className="max-w-md w-full glass-panel rounded-3xl p-8 sm:p-10 text-center border border-slate-200 shadow-lg">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-6">
          <FileArchive className="w-8 h-8" />
        </div>

        <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-1">
          404 Error
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
          Page Not Found
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mb-8 leading-relaxed">
          The compression tool or resource you are looking for doesn&apos;t exist or may have been moved.
        </p>

        <div className="space-y-2 mb-6">
          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-xs"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <Link
              href="/image-compressor"
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium transition-colors"
            >
              <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
              <span>Image Tool</span>
            </Link>
            <Link
              href="/pdf-compressor"
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-rose-600" />
              <span>PDF Tool</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
