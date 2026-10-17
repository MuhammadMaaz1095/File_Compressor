import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Mail,
  MessageSquare,
  HelpCircle,
  FileQuestion,
  AlertTriangle,
  Clock,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Send,
} from 'lucide-react';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ContactForm } from '@/components/contact/ContactForm';

export const metadata: Metadata = {
  title: 'Contact & Support | FileCompress',
  description:
    'Get in touch with FileCompress support. Reach out to Muhammad Maaz for technical inquiries, bug reports, format support requests, or general feedback.',
  alternates: {
    canonical: 'https://filecompress.app/contact',
  },
  openGraph: {
    title: 'Contact & Support | FileCompress',
    description:
      'Get in touch with FileCompress support. Reach out to Muhammad Maaz for technical inquiries, bug reports, format support requests, or general feedback.',
    url: 'https://filecompress.app/contact',
  },
};

export default function ContactPage() {
  return (
    <main className="flex-1 pb-16">
      {/* Header Hero */}
      <header className="relative pt-12 pb-14 sm:pt-16 sm:pb-20 bg-gradient-to-b from-blue-50/60 via-sky-50/30 to-transparent border-b border-slate-200/60 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-72 bg-gradient-to-b from-blue-200/30 via-sky-100/20 to-transparent pointer-events-none -z-10 rounded-full blur-3xl" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Breadcrumbs items={[{ label: 'Contact' }]} />

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-blue-200/80 text-blue-700 text-xs font-bold shadow-2xs mb-5">
            <MessageSquare className="w-4 h-4 text-blue-600" />
            <span>Support, Feedback &amp; Inquiries</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#14213D] tracking-tight leading-[1.15] mb-5">
            Contact FileCompress
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
            Have a question about our compression tools, encountered a bug, or want to suggest support for a new file format? We welcome technical inquiries, user feedback, and accessibility requests.
          </p>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-12">
        {/* Contact Cards Grid */}
        <section>
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Direct Channels
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#14213D] tracking-tight mt-1">
              How to Reach Us
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Choose the method that works best for your inquiry. Email is our primary channel.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* 1. Email (Primary) */}
            <div className="glass-card-3d p-6 rounded-2xl flex flex-col justify-between border border-blue-200/80 relative">
              <div className="absolute top-4 right-4">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700">
                  Primary
                </span>
              </div>
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 shadow-2xs">
                  <Mail className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-[#14213D] mb-1">
                  Email Support
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  Primary channel for technical support, error reports, privacy requests, and general enquiries.
                </p>
              </div>
              <a
                href="mailto:mmaaz1104@gmail.com"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-2xs"
              >
                <span>mmaaz1104@gmail.com</span>
              </a>
            </div>

            {/* 2. WhatsApp */}
            <div className="glass-card-3d p-6 rounded-2xl flex flex-col justify-between border border-emerald-200/80">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 shadow-2xs">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-[#14213D] mb-1">
                  WhatsApp Messaging
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  For quick direct communication regarding website bugs, urgent feedback, or quick questions.
                </p>
              </div>
              <a
                href="https://wa.me/923709254552"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-2xs"
              >
                <span>Message on WhatsApp (+92 370 925 4552)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* 3. LinkedIn */}
            <div className="glass-card-3d p-6 rounded-2xl flex flex-col justify-between border border-slate-200/90">
              <div>
                <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mb-4 shadow-2xs">
                  <ExternalLink className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-[#14213D] mb-1">
                  Creator Profile
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  Connect professionally with Muhammad Maaz on LinkedIn for project collaboration or inquiries.
                </p>
              </div>
              <a
                href="https://www.linkedin.com/in/muhammad-maaz-6962b4369"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs transition-colors shadow-2xs"
              >
                <span>LinkedIn Profile</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </section>

        {/* Two-Column Form & Guidelines Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-6">
          {/* Left Column: Real Interactive Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="space-y-2 mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-[#14213D] tracking-tight">
                Send Us a Message
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Fill out the form below. Messages are verified and received directly by our team.
              </p>
            </div>

            <div className="glass-panel-elevated p-6 sm:p-8 rounded-3xl border border-white/90 shadow-xl">
              <ContactForm />
            </div>
          </div>

          {/* Right Column: Support Guidelines & Policies (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Guidelines: What to include */}
            <div className="glass-card rounded-2xl p-6 border border-slate-200/80 space-y-3">
              <h3 className="text-sm font-bold text-[#14213D] flex items-center gap-2">
                <FileQuestion className="w-4 h-4 text-blue-600 shrink-0" />
                <span>What to Include in a Support Request</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                To help us diagnose and fix technical issues swiftly, please include as much context as possible:
              </p>
              <ul className="text-xs text-slate-600 space-y-2 list-disc pl-4 leading-relaxed">
                <li>
                  <strong>Which tool you were using:</strong> (e.g. Image, PDF, Video, Audio, or ZIP Compressor).
                </li>
                <li>
                  <strong>Browser &amp; Operating System:</strong> (e.g. Chrome on Windows, Safari on macOS or iOS, Firefox on Android).
                </li>
                <li>
                  <strong>Input file details:</strong> Approximate file size, resolution, and extension (e.g. 15 MB 4K `.mp4` or 8 MB `.pdf`).
                </li>
                <li>
                  <strong>Settings selected:</strong> Presets (Balanced, Smaller File) or custom bitrates/resolutions.
                </li>
                <li>
                  <strong>Exact error message:</strong> Any message or notification that appeared on screen.
                </li>
              </ul>
            </div>

            {/* Caution Notice: Confidentiality */}
            <div className="glass-card rounded-2xl p-6 border border-amber-200/80 bg-amber-50/50 text-amber-950 space-y-2">
              <h3 className="text-sm font-bold text-amber-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Privacy &amp; Confidentiality Notice</span>
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                <strong>Please do not send passwords, confidential personal documents, banking records, or sensitive private files</strong> in your message. FileCompress is designed for on-device processing and will never ask you for private credentials.
              </p>
            </div>

            {/* Response Time Policy */}
            <div className="glass-card rounded-2xl p-6 border border-slate-200/80 space-y-2 text-xs text-slate-600">
              <h3 className="text-sm font-bold text-[#14213D] flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Response Time &amp; Availability</span>
              </h3>
              <p className="leading-relaxed">
                We do not claim 24/7 call center support. Messages are reviewed and addressed as personal and operational availability allows. We prioritize verified bug reports, security disclosures, and platform functionality regressions.
              </p>
              <div className="pt-3 border-t border-slate-200 text-[11px] text-slate-500 flex flex-wrap gap-2">
                <span>Related:</span>
                <Link href="/about" className="text-blue-600 hover:underline">About Us</Link>
                <span>&bull;</span>
                <Link href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</Link>
                <span>&bull;</span>
                <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
