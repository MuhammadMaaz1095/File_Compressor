# FileCompress — Owner Verification & Deployment Checklists

> **Important Developer Notice**: This document is intended solely for internal documentation, operational handoff, and compliance verification by the site owner or prospective buyer. **Do not paste or publish these checklists into the public user-facing Privacy Policy, Terms of Use, or SEO pages.**

---

## 1. Privacy Policy Owner Checklist

Before promoting the website to production or submitting for formal legal/compliance reviews, the site owner must verify and configure the following parameters:

- [ ] **Hosting & Infrastructure**:
  - Document the actual hosting provider (e.g., Vercel, AWS, Cloudflare Pages, Netlify).
  - Verify edge server log retention policies (IP addresses, request headers, timestamps).
- [ ] **Client-Side File Processing Verification**:
  - Confirm that all compression engines (Image Canvas, `pdf-lib`, HTML5 Canvas/MediaRecorder for Video, Web Audio API/`lamejs` for Audio) continue running 100% in client-side memory without background file uploads.
  - If any server-side fallback or conversion API is introduced in the future, update the Privacy Policy immediately to disclose server upload, storage duration, and automatic deletion schedules.
- [ ] **Analytics Configuration**:
  - If Google Analytics (GA4), Plausible, Fathom, or Umami is deployed, disclose the specific vendor, whether IP anonymization is active, and whether cookies/local storage identifiers are stored.
  - Currently, no external analytics trackers are loaded in the codebase by default.
- [ ] **Advertising & Google AdSense Setup**:
  - Add your AdSense Publisher ID (`ca-pub-XXXXXXXXXXXXXXXX`) to `app/layout.tsx` or Google Tag Manager only when ready for review.
  - Implement a Google-certified Consent Management Platform (CMP) supporting IAB TCF v2.2 if serving visitors in the European Economic Area (EEA), UK, or Switzerland.
  - Do not claim that personalized ads are disabled or enabled without verifying your AdSense account settings.
- [ ] **Contact Form Storage & Webhook Delivery**:
  - By default, `app/api/contact/route.ts` logs sanitized contact inquiries with reference IDs.
  - Configure the `CONTACT_EMAIL_WEBHOOK` environment variable (e.g., Slack webhook, Discord webhook, SendGrid, Resend, or Zapier endpoint) to receive live notifications.
  - Confirm that message logs do not accumulate indefinitely and define a routine deletion schedule (e.g., 30–90 days).
- [ ] **Children's Privacy & Age Restrictions**:
  - Confirm that the service does not deliberately solicit information from children under 13 (or under 16 where required by local law).
- [ ] **Jurisdiction-Specific Privacy Regulations**:
  - Conduct an independent legal review if targeting users in jurisdictions with specific data protection laws (e.g., GDPR in the EU, UK GDPR / Data Protection Act 2018, California CCPA/CPRA, Virginia VCDPA).

---

## 2. Terms of Use Owner Checklist

Before launching commercially or completing a website transfer/sale, verify and supply the following legal details:

- [ ] **Legal Entity / Website Operator Identity**:
  - Replace generic brand references with the formal business entity name (e.g., "FileCompress LLC", sole proprietorship, or registered corporate entity).
  - If required by local jurisdiction (e.g., German Impressum, EU regulations), provide registered office address, company registration number, and VAT/tax number.
- [ ] **Governing Law & Dispute Resolution Venue**:
  - Define the applicable state, province, or country governing law (e.g., "the laws of the State of Delaware, United States", "the laws of England and Wales").
  - Define the exclusive jurisdiction or arbitration forum for dispute resolution.
- [ ] **Contact & Notice Channel**:
  - Establish a dedicated operational contact email address (e.g., `legal@filecompress.com` or `support@filecompress.com`) or route all inquiries through `/contact/`.
- [ ] **Limitation of Liability & Statutory Consumer Rights**:
  - Have local legal counsel review the limitation of liability clauses to ensure compliance with mandatory statutory consumer guarantees in your target markets.
- [ ] **Intellectual Property Rights**:
  - Verify trademark availability for "FileCompress" or register the appropriate brand protection in primary operating territories.
- [ ] **Effective Date**:
  - Keep the effective date updated whenever material operational changes or terms revisions occur.

---

## 3. SEO, AdSense & Website Resale Technical Checklist

- [ ] **Canonical Domain Configuration**:
  - Set `NEXT_PUBLIC_SITE_URL` in `.env.production` (e.g., `https://filecompress.com`).
  - Verify that `sitemap.xml` and `robots.txt` dynamically read this variable.
- [ ] **Google Search Console**:
  - Submit the XML sitemap (`/sitemap.xml`) to Google Search Console upon domain DNS cutover.
  - Verify indexing status for all 5 core content pages and 5 compression tool pages.
- [ ] **AdSense Approval Audit**:
  - Ensure all 5 content pages (`/how-to-compress-files`, `/about`, `/contact`, `/privacy-policy`, `/terms`) are live and linked in the footer.
  - Ensure zero placeholder text, fake testimonials, or broken routes exist.
  - Avoid placing ad units adjacent to file upload or download buttons to avoid accidental click violations.
- [ ] **Handoff Documentation for Website Buyer**:
  - Provide domain registrar access and DNS credentials.
  - Provide repository access (GitHub/GitLab) with clean Git commit history.
  - Hand over hosting accounts (Vercel/Cloudflare) and webhook endpoints.
  - Document zero recurring monthly API costs for file compression since all compression engines run purely in the user's browser.
