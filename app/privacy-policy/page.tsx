import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Lock, Eye, FileText, CheckCircle2, Clock, Mail, AlertCircle, ExternalLink } from 'lucide-react';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Privacy Policy | FileCompress',
  description:
    'Read the FileCompress Privacy Policy to understand how information is handled, our on-device browser file processing architecture, and our commitment to user privacy.',
  alternates: {
    canonical: 'https://filecompress.app/privacy-policy',
  },
  openGraph: {
    title: 'Privacy Policy | FileCompress',
    description:
      'Read the FileCompress Privacy Policy to understand how information is handled, our on-device browser file processing architecture, and our commitment to user privacy.',
    url: 'https://filecompress.app/privacy-policy',
  },
};

export default function PrivacyPolicyPage() {
  const effectiveDate = 'October 17, 2026';

  return (
    <main className="flex-1 pb-16">
      {/* Header */}
      <header className="relative pt-12 pb-14 sm:pt-16 sm:pb-20 bg-gradient-to-b from-blue-50/60 via-sky-50/30 to-transparent border-b border-slate-200/60 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-72 bg-gradient-to-b from-blue-200/30 via-sky-100/20 to-transparent pointer-events-none -z-10 rounded-full blur-3xl" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Breadcrumbs items={[{ label: 'Privacy Policy' }]} />

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-2xs mb-5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Client-Side Data Protection &amp; Privacy Disclosures</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#14213D] tracking-tight leading-[1.15] mb-4">
            Privacy Policy
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 flex items-center justify-center gap-1.5 font-medium">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>Effective Date / Last Updated: {effectiveDate}</span>
          </p>
        </div>
      </header>

      {/* Policy Content */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 text-slate-700 text-xs sm:text-sm leading-relaxed space-y-12">
        {/* Core Architecture Highlight Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-emerald-50/90 border border-emerald-200/90 text-emerald-950 flex items-start gap-4 shadow-sm">
          <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h2 className="font-bold text-[#14213D] text-sm sm:text-base">
              Core Architecture Principle: On-Device Browser Processing
            </h2>
            <p className="leading-relaxed text-xs sm:text-sm text-slate-700">
              FileCompress is engineered from the ground up as a <strong>client-side web application</strong>. All image resizing, PDF stream optimization, video re-encoding, audio transcoding, and ZIP archiving algorithms execute directly within your local web browser sandbox. <strong>Your file contents, photos, documents, and media streams are never uploaded to, transmitted across, or stored upon our remote servers.</strong>
            </p>
          </div>
        </div>

        {/* 1. Introduction & Scope */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-[#14213D]">
            1. Introduction &amp; Purpose
          </h2>
          <p>
            This Privacy Policy explains how FileCompress (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;, or &ldquo;the Service&rdquo;), maintained by Muhammad Maaz, handles information when you visit <Link href="/" className="text-blue-600 underline font-semibold">https://filecompress.app</Link>, read our guides, and use our browser-based compression utilities.
          </p>
          <p>
            We believe that file utilities should operate transparently and minimize data collection to the absolute technical minimum necessary to provide the service securely and reliably.
          </p>
        </section>

        {/* 2. Information Users Provide */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-[#14213D]">
            2. Information Users Provide Directly
          </h2>
          <p>
            We do not require user account registration, passwords, profile creation, or payment information. Users can access and use all implemented tools completely anonymously.
          </p>
          <p>
            The only personal information we receive directly is information you voluntarily submit when contacting us for support or feedback via our <Link href="/contact" className="text-blue-600 underline font-semibold">Contact Page</Link> or by emailing <a href="mailto:mmaaz1104@gmail.com" className="text-blue-600 underline font-semibold">mmaaz1104@gmail.com</a>. This may include:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>Your name or alias (optional).</li>
            <li>Your email address (to allow us to respond to your inquiry).</li>
            <li>The subject, topic, and message content of your inquiry.</li>
          </ul>
        </section>

        {/* 3. Detailed File Processing Architecture */}
        <section className="space-y-4">
          <h2 className="text-lg sm:text-xl font-bold text-[#14213D]">
            3. File Processing &amp; Data Isolation
          </h2>
          <p>
            Understanding where your files go is vital for trust. Unlike traditional file conversion websites that upload your files to remote cloud queues, FileCompress relies on modern web browser APIs:
          </p>
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <h3 className="font-bold text-slate-900 text-xs sm:text-sm mb-1">
                Image Compression (JPEG, PNG, WebP)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Rendered and compressed in memory using HTML5 Canvas and OffscreenCanvas APIs. Pixel buffers never leave your machine.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <h3 className="font-bold text-slate-900 text-xs sm:text-sm mb-1">
                PDF Document Optimization
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Parsed and re-encoded locally using in-browser WebAssembly and pure client JavaScript routines that strip metadata and compress internal PDF streams.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <h3 className="font-bold text-slate-900 text-xs sm:text-sm mb-1">
                Video &amp; Audio Transcoding (MP4, WebM, MP3, WAV)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Encoded locally through the browser&apos;s native MediaRecorder API, Web Audio API, or WebAssembly codecs running within isolated Web Workers.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <h3 className="font-bold text-slate-900 text-xs sm:text-sm mb-1">
                ZIP Archive Generation
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Files are packaged and compressed into standard DEFLATE ZIP archives entirely inside client memory.
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-500">
            <strong>Memory Revocation:</strong> Local object references (such as `blob:http...` URLs created for before-and-after previews) reside strictly in volatile device memory and are immediately revoked when you remove a file, clear the queue, or close the browser tab.
          </p>
        </section>

        {/* 4. Technical Information and Server Logs */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-[#14213D]">
            4. Technical Information &amp; Server Logs
          </h2>
          <p>
            When you visit FileCompress, our production hosting infrastructure (such as Vercel or cloud delivery networks) automatically processes and logs standard HTTP request headers for operational reliability, DDoS mitigation, and network routing. These standard access logs may record:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>Your Internet Protocol (IP) address.</li>
            <li>Browser type and version (User Agent).</li>
            <li>Referring web page and URL requested.</li>
            <li>Date, time, and status code of the HTTP request.</li>
          </ul>
          <p>
            These logs are used exclusively for infrastructure security, network troubleshooting, and server performance monitoring. They are not joined with personal names or email addresses.
          </p>
        </section>

        {/* 5. Cookies and Local Storage */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-[#14213D]">
            5. Cookies &amp; Local Storage
          </h2>
          <p>
            FileCompress does not use tracking cookies, behavioral tracking beacons, or cross-site fingerprinting scripts to perform file compression.
          </p>
          <p>
            We may use modern browser web storage (`localStorage` or `sessionStorage`) strictly to save transient user interface preferences (such as your preferred compression preset or muted preview setting) across visits on your own device. These values remain entirely on your computer and are never transmitted to our servers.
          </p>
        </section>

        {/* 6. Advertising and Third-Party Services */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-[#14213D]">
            6. Advertising &amp; Third-Party Services
          </h2>
          <p>
            To keep FileCompress completely free for all users, we may incorporate third-party advertising services, such as Google AdSense, in designated banner positions.
          </p>
          <p>
            <strong>Current Status:</strong> While layout slots exist in preparation for compliant advertising, personalized commercial ad networks are not currently serving live campaigns. Before any advertising network is activated:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>Third-party ad vendors, including Google, will use cookies to serve ads based on prior visits to our website or other websites on the internet.</li>
            <li>Users will be able to opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Google Ads Settings</a> or <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">aboutads.info</a>.</li>
            <li>Ads will always be clearly designated and kept strictly separate from tool actions, download buttons, and file drop zones.</li>
          </ul>
        </section>

        {/* 7. Data Retention and Deletion */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-[#14213D]">
            7. Data Retention &amp; Deletion
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-slate-600">
            <li>
              <strong>Uploaded Files:</strong> Zero retention. Because files never touch our servers, there are no files to store, retain, or delete. When you close the browser tab, the session memory is purged by your browser.
            </li>
            <li>
              <strong>Support Communications:</strong> Inquiries submitted through our contact form or sent via email are retained only as long as necessary to address your feedback, provide technical assistance, or comply with legal record-keeping obligations.
            </li>
          </ul>
        </section>

        {/* 8. Data Security */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-[#14213D]">
            8. Data Security
          </h2>
          <p>
            We implement reasonable technical safeguards to protect the website and communications:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>All web traffic between your browser and our website is encrypted using industry-standard Transport Layer Security (TLS / HTTPS).</li>
            <li>Our on-device processing model fundamentally minimizes security risks by keeping file contents off external servers.</li>
          </ul>
          <p className="text-xs text-slate-500">
            Please note that no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute invulnerability.
          </p>
        </section>

        {/* 9. User Rights & Privacy Requests */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-[#14213D]">
            9. Your Privacy Rights
          </h2>
          <p>
            Depending on your geographic location and jurisdiction (such as the European Economic Area under the GDPR, the United Kingdom under the UK GDPR, or California under the CCPA/CPRA), you may hold statutory rights regarding your personal data, including the right to:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>Request access to any personal correspondence we hold about you.</li>
            <li>Request correction of inaccurate information.</li>
            <li>Request deletion of your contact communications.</li>
            <li>Object to or restrict specific processing of your information.</li>
          </ul>
          <p>
            To exercise any of these rights, please contact Muhammad Maaz at <a href="mailto:mmaaz1104@gmail.com" className="text-blue-600 underline font-semibold">mmaaz1104@gmail.com</a>. We respond to all verified requests without unreasonable delay.
          </p>
        </section>

        {/* 10. Children's Privacy */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-[#14213D]">
            10. Children&apos;s Privacy
          </h2>
          <p>
            FileCompress is a general audience file optimization utility. We do not direct our services to children under the age of 13 (or under 16 where applicable by regional law), nor do we knowingly collect personal information from children. If you believe a child has provided us with personal information via email or contact channels, please notify us so we can promptly delete it.
          </p>
        </section>

        {/* 11. International Data Transfers */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-[#14213D]">
            11. International Transfers
          </h2>
          <p>
            Because file processing occurs on your own device, your files do not travel across international borders to server centers. Support emails or technical access logs may be processed in countries where our cloud hosting or email service providers maintain data centers, subject to appropriate contractual and legal protections.
          </p>
        </section>

        {/* 12. Changes to this Policy */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-[#14213D]">
            12. Updates to this Privacy Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time to reflect improvements in our tools, browser capabilities, or legal requirements. Any modifications will be posted directly on this page with an updated &ldquo;Effective Date&rdquo; at the top. We encourage you to review this page periodically.
          </p>
        </section>

        {/* 13. Contact Information */}
        <section className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-[#14213D]">
            13. Contact &amp; Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            If you have questions, comments, or privacy requests regarding this policy, please contact:
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
