import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Scale, Clock, ShieldCheck, AlertCircle, FileText, CheckCircle2, HelpCircle } from 'lucide-react';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Terms of Service | FileCompress',
  description:
    'Read the FileCompress Terms of Service covering access to our website, acceptable use of online file compression tools, service limitations, and user responsibilities.',
  alternates: {
    canonical: 'https://filecompress.app/terms',
  },
  openGraph: {
    title: 'Terms of Service | FileCompress',
    description:
      'Read the FileCompress Terms of Service covering access to our website, acceptable use of online file compression tools, service limitations, and user responsibilities.',
    url: 'https://filecompress.app/terms',
  },
};

export default function TermsPage() {
  const effectiveDate = 'October 17, 2026';

  return (
    <main className="flex-1 pb-16">
      {/* Header */}
      <header className="relative pt-12 pb-14 sm:pt-16 sm:pb-20 bg-gradient-to-b from-blue-50/60 via-sky-50/30 to-transparent border-b border-slate-200/60 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-72 bg-gradient-to-b from-blue-200/30 via-sky-100/20 to-transparent pointer-events-none -z-10 rounded-full blur-3xl" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Breadcrumbs items={[{ label: 'Terms of Service' }]} />

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold shadow-2xs mb-5">
            <Scale className="w-4 h-4 text-blue-600" />
            <span>Acceptable Use &amp; Service Terms</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#14213D] tracking-tight leading-[1.15] mb-4">
            Terms of Service
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 flex items-center justify-center gap-1.5 font-medium">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>Effective Date / Last Updated: {effectiveDate}</span>
          </p>
        </div>
      </header>

      {/* Terms Content */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 text-slate-700 text-xs sm:text-sm leading-relaxed space-y-12">
        {/* 1. Acceptance of Terms */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-[#14213D]">
            1. Acceptance of Terms
          </h2>
          <p>
            Welcome to FileCompress (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;, or &ldquo;the Service&rdquo;), operated by Muhammad Maaz. By accessing or using the website at <Link href="/" className="text-blue-600 underline font-semibold">https://filecompress.app</Link>, any subdomains, or any tools available through the platform, you agree to be bound by these Terms of Service (&ldquo;Terms&rdquo;).
          </p>
          <p>
            If you do not agree to these Terms, you should not access or use FileCompress. Nothing in these Terms is intended to limit or exclude any non-excludable statutory rights or mandatory consumer protections available to you under the laws of your home jurisdiction.
          </p>
        </section>

        {/* 2. Description of the Service */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-[#14213D]">
            2. Description of the Service
          </h2>
          <p>
            FileCompress provides free, browser-based online tools designed to optimize, shrink, transcode, and archive supported digital files. Currently implemented and functional utilities include:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>
              <strong>Image Compression:</strong> Local compression and resizing for JPEG, PNG, and WebP images (<Link href="/image-compressor" className="text-blue-600 underline">/image-compressor</Link>).
            </li>
            <li>
              <strong>PDF Compression:</strong> In-browser stream optimization and metadata removal for PDF documents (<Link href="/pdf-compressor" className="text-blue-600 underline">/pdf-compressor</Link>).
            </li>
            <li>
              <strong>Video Compression:</strong> Transcoding, resolution downscaling, and bitrate controls for MP4, WebM, and MOV clips (<Link href="/video-compressor" className="text-blue-600 underline">/video-compressor</Link>).
            </li>
            <li>
              <strong>Audio Compression:</strong> Bitrate optimization and mono downmixing for MP3, WAV, and M4A audio tracks (<Link href="/audio-compressor" className="text-blue-600 underline">/audio-compressor</Link>).
            </li>
            <li>
              <strong>ZIP Compression:</strong> Packaging multiple files into standardized ZIP archives with custom DEFLATE levels (<Link href="/zip-compressor" className="text-blue-600 underline">/zip-compressor</Link>).
            </li>
            <li>
              <strong>Educational Guides:</strong> Informational resources regarding compression algorithms and file management (<Link href="/how-to-compress-files" className="text-blue-600 underline">/how-to-compress-files</Link>).
            </li>
          </ul>
          <p className="text-xs text-slate-500">
            We reserve the right to modify, enhance, suspend, or discontinue any feature, tool, or aspect of the Service at any time without prior liability.
          </p>
        </section>

        {/* 3. Permitted Use & Conduct */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-[#14213D]">
            3. Permitted Use &amp; Code of Conduct
          </h2>
          <p>
            You may use FileCompress for personal, educational, or lawful commercial purposes. In using the Service, you agree that you will NOT:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>Process any files for which you do not possess the necessary copyrights, licenses, or authorized permissions.</li>
            <li>Use the Service to distribute malware, viruses, trojans, ransomware, or other harmful computer code.</li>
            <li>Attempt to probe, scan, or compromise our hosting infrastructure, web servers, or security firewalls.</li>
            <li>Deploy automated scrapers, bots, or excessive load generators that degrade service availability for other users.</li>
            <li>Misrepresent your identity or use the Service for deceptive, fraudulent, or unlawful purposes.</li>
          </ul>
        </section>

        {/* 4. User Responsibility & Backups */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-[#14213D]">
            4. User Responsibility &amp; Mandatory Backups
          </h2>
          <p>
            You are solely responsible for the files you choose to process and your legal right to possess and modify them.
          </p>
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-950 text-xs sm:text-sm">
            <strong>Important Backup Notice:</strong> FileCompress is a temporary client-side processing tool, not a permanent file storage or cloud backup service. <strong>You must always maintain independent original copies and backups of your important files, photos, videos, and documents.</strong> We are not liable for any local device file corruption, accidental overwrites, or data loss occurring on your computer or mobile device.
          </div>
        </section>

        {/* 5. Compression Results & Quality Disclaimers */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-[#14213D]">
            5. Compression Results, Quality &amp; Fidelity
          </h2>
          <p>
            Compression is a complex technical process governed by mathematical constraints and file structures:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>
              <strong>Variable Results:</strong> The percentage of file size reduction achieved varies substantially depending on the original file format, existing compression level, color complexity, and resolution.
            </li>
            <li>
              <strong>Quality Trade-Offs:</strong> Lossy compression techniques (such as lowering video bitrates or image quality) inherently discard certain data to reduce file sizes, which can alter visual or auditory fidelity.
            </li>
            <li>
              <strong>No Guarantee of Size Reduction:</strong> If an input file is already efficiently compressed (such as an optimized JPEG or HEVC video), re-encoding it may result in minimal savings or, in rare cases, a larger file. We do not guarantee that any specific file will become smaller.
            </li>
          </ul>
        </section>

        {/* 6. Technical Limitations & Availability */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-[#14213D]">
            6. Technical Limitations &amp; Service Availability
          </h2>
          <p>
            Because FileCompress executes locally on your hardware:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>Processing speed, memory limits, and format compatibility depend on your device CPU, available RAM, and browser version.</li>
            <li>Certain older web browsers or mobile operating systems may lack support for newer WebAssembly modules or MediaRecorder codecs.</li>
            <li>The Service is provided on an <strong>&ldquo;as is&rdquo;</strong> and <strong>&ldquo;as available&rdquo;</strong> basis without guarantees of uninterrupted or error-free operation.</li>
          </ul>
        </section>

        {/* 7. Intellectual Property */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-[#14213D]">
            7. Intellectual Property &amp; File Ownership
          </h2>
          <p>
            <strong>Your Files:</strong> You retain 100% full, unrestricted ownership and all copyright, title, and intellectual property rights in the files you process. FileCompress does not claim any license, ownership, or rights in your files, content, or media.
          </p>
          <p>
            <strong>Our Materials:</strong> The FileCompress website name, logo, 3D glassmorphism user interface design, custom styling, original documentation, and guides are the intellectual property of Muhammad Maaz / FileCompress and are protected by applicable intellectual property laws.
          </p>
        </section>

        {/* 8. Third-Party Services & Dependencies */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-[#14213D]">
            8. Third-Party Libraries &amp; External Links
          </h2>
          <p>
            FileCompress leverages open-source browser libraries (such as Lucide icons, pdf-lib, lamejs, and JSZip) under their respective open-source licenses. Our website may also contain links to external third-party sites (such as LinkedIn, GitHub, or informative references). We do not control and are not responsible for the content, terms, or privacy policies of any third-party websites.
          </p>
        </section>

        {/* 9. Disclaimer of Warranties */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-[#14213D]">
            9. Disclaimer of Warranties
          </h2>
          <p className="uppercase text-[11px] text-slate-600 font-semibold tracking-wider">
            To the maximum extent permitted by applicable law:
          </p>
          <p className="text-slate-600 leading-relaxed">
            The Service and all tools, documentation, and materials are provided without warranties of any kind, whether express, implied, statutory, or otherwise, including but not limited to the implied warranties of merchantability, fitness for a particular purpose, non-infringement, or title. We make no warranty that the tools will meet your specific technical requirements, produce a particular compression ratio, or run without technical interruptions.
          </p>
        </section>

        {/* 10. Limitation of Liability */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-[#14213D]">
            10. Limitation of Liability
          </h2>
          <p className="text-slate-600 leading-relaxed">
            To the fullest extent permitted by applicable law, neither Muhammad Maaz nor FileCompress shall be liable for any indirect, incidental, special, consequential, or punitive damages, or for any loss of profits, data, goodwill, or other intangible losses resulting from: (a) your access to or inability to use the Service; (b) any file corruption or data loss on your local device; (c) any bugs, viruses, or technical errors encountered during use; or (d) any third-party content or conduct.
          </p>
          <p className="text-xs text-slate-500">
            Some jurisdictions do not allow the exclusion or limitation of certain warranties or liabilities. In such jurisdictions, our liability shall be limited to the minimum extent permitted by law.
          </p>
        </section>

        {/* 11. Suspension or Termination */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-[#14213D]">
            11. Suspension &amp; Abuse Prevention
          </h2>
          <p>
            We reserve the right to restrict, rate-limit, or block access to the website or its APIs for any user, IP address, or automated system that engages in abusive behavior, malicious traffic generation, denial-of-service attempts, or any violation of these Terms.
          </p>
        </section>

        {/* 12. Updates to the Terms */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-[#14213D]">
            12. Modifications to these Terms
          </h2>
          <p>
            We may revise these Terms of Service periodically. Any updates will be posted on this page with an updated &ldquo;Effective Date.&rdquo; Your continued use of FileCompress after the publication of revised terms constitutes your acceptance of the updated conditions.
          </p>
        </section>

        {/* 13. Governing Law Notice */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-[#14213D]">
            13. Governing Law &amp; Dispute Resolution
          </h2>
          <p>
            These Terms shall be interpreted and governed in accordance with applicable general commercial standards and consumer protection laws. Any legal proceedings or claims arising from or relating to the Service shall be subject to confirmation and clarification by the site owner (Muhammad Maaz) and qualified legal counsel based on the primary operational jurisdiction of the website operator.
          </p>
        </section>

        {/* 14. Contact Information */}
        <section className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-[#14213D]">
            14. Contact &amp; Legal Notices
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            If you have questions, notices, or concerns regarding these Terms of Service, please reach out directly:
          </p>
          <div className="pt-2 text-xs space-y-1">
            <p><strong>Site Operator:</strong> Muhammad Maaz</p>
            <p><strong>Email:</strong> <a href="mailto:mmaaz1104@gmail.com" className="text-blue-600 underline font-semibold">mmaaz1104@gmail.com</a></p>
            <p><strong>Contact Page:</strong> <Link href="/contact" className="text-blue-600 underline font-semibold">https://filecompress.app/contact</Link></p>
          </div>
        </section>
      </article>
    </main>
  );
}
