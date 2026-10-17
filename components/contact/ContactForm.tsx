'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2, Info } from 'lucide-react';

export function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('general');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<{
    message: string;
    referenceId?: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Client-side quick checks
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage('Please enter a valid email address so we can reply.');
      return;
    }

    if (!subject.trim() || subject.trim().length < 3) {
      setErrorMessage('Please enter a descriptive subject (at least 3 characters).');
      return;
    }

    if (!message.trim() || message.trim().length < 10) {
      setErrorMessage('Please provide a message with at least 10 characters.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          topic,
          subject,
          message,
          honeypot,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit form. Please try again.');
      }

      setSuccessInfo({
        message: data.message,
        referenceId: data.referenceId,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  if (successInfo) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center border border-emerald-200 bg-emerald-50/40">
        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Message Delivered</h3>
        <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed mb-4">
          {successInfo.message}
        </p>
        {successInfo.referenceId && (
          <div className="inline-block bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-[11px] font-mono text-slate-700 mb-6">
            Reference ID: <strong>{successInfo.referenceId}</strong>
          </div>
        )}
        <div>
          <button
            type="button"
            onClick={() => {
              setSuccessInfo(null);
              setName('');
              setEmail('');
              setSubject('');
              setMessage('');
              setTopic('general');
            }}
            className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors shadow-2xs"
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-panel rounded-2xl p-6 sm:p-8 space-y-5 border border-slate-200/90 shadow-sm"
      noValidate
    >
      {/* Honeypot field for bot suppression */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="hp_field">Do not fill this</label>
        <input
          id="hp_field"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      {errorMessage && (
        <div
          role="alert"
          className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5 animate-in fade-in duration-150"
        >
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Name */}
        <div>
          <label htmlFor="contact-name" className="block text-xs font-semibold text-slate-700 mb-1.5">
            Your Name <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <input
            id="contact-name"
            type="text"
            value={name}
            disabled={isLoading}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Doe"
            className="w-full text-xs sm:text-sm bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus-visible:ring-2 focus-visible:ring-blue-600 disabled:opacity-60"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="contact-email" className="block text-xs font-semibold text-slate-700 mb-1.5">
            Your Email Address <span className="text-rose-500">*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            required
            disabled={isLoading}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jane@example.com"
            className="w-full text-xs sm:text-sm bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus-visible:ring-2 focus-visible:ring-blue-600 disabled:opacity-60"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Topic dropdown */}
        <div>
          <label htmlFor="contact-topic" className="block text-xs font-semibold text-slate-700 mb-1.5">
            Feedback Topic <span className="text-rose-500">*</span>
          </label>
          <select
            id="contact-topic"
            value={topic}
            disabled={isLoading}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full text-xs sm:text-sm bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus-visible:ring-2 focus-visible:ring-blue-600 disabled:opacity-60"
          >
            <option value="general">General Inquiry or Feedback</option>
            <option value="bug_report">Report a Technical Bug</option>
            <option value="feature_request">Suggest a Feature or Tool</option>
            <option value="format_support">Request File Format Support</option>
            <option value="accessibility">Accessibility Feedback</option>
            <option value="privacy">Privacy &amp; Data Question</option>
          </select>
        </div>

        {/* Subject */}
        <div>
          <label htmlFor="contact-subject" className="block text-xs font-semibold text-slate-700 mb-1.5">
            Subject <span className="text-rose-500">*</span>
          </label>
          <input
            id="contact-subject"
            type="text"
            required
            disabled={isLoading}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Short summary of your inquiry"
            className="w-full text-xs sm:text-sm bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus-visible:ring-2 focus-visible:ring-blue-600 disabled:opacity-60"
          />
        </div>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="contact-message" className="block text-xs font-semibold text-slate-700 mb-1.5">
          Message <span className="text-rose-500">*</span>
        </label>
        <textarea
          id="contact-message"
          required
          rows={5}
          disabled={isLoading}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Please describe the issue or suggestion. Include tool name, file format, and browser if reporting a bug."
          className="w-full text-xs sm:text-sm bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus-visible:ring-2 focus-visible:ring-blue-600 disabled:opacity-60"
        />
        <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1">
          <span>Minimum 10 characters</span>
          <span>{message.length} / 5000</span>
        </div>
      </div>

      {/* Security notice */}
      <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 flex items-start gap-2 text-xs text-slate-600">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <span>
          <strong>Privacy reminder:</strong> Please do not attach or share sensitive personal documents, passwords, or confidential records in support tickets.
        </span>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full sm:w-auto px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-2xs shadow-blue-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Verifying &amp; Sending...</span>
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            <span>Send Feedback</span>
          </>
        )}
      </button>
    </form>
  );
}
