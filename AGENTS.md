# AGENTS.md — FileCompress Project Instructions

## 1. Project Overview

Build a fast, reliable, SEO-friendly online file compression platform using Next.js.

### Main business objectives

1. Build useful file compression tools that solve real user problems.
2. Attract organic traffic through sustainable, long-tail SEO.
3. Prepare the website for Google AdSense approval and compliant monetization.
4. Build a maintainable, documented website that can eventually be sold to another owner.
5. Prioritize user experience, technical quality, privacy, performance, and long-term business value.

### Core product

A free online file compressor that helps users reduce file sizes quickly through a simple browser-based interface wherever technically feasible.

The website may support:

- PDF compression
- Image compression
- Video compression
- Audio compression
- ZIP and archive utilities
- Document compression
- File compression guides and tutorials

**Important:** Only publish a tool or advertise a capability when it has actually been implemented and tested. Do not create fake tools, simulated compression results, or nonfunctional download buttons.

---

## 2. Technology Stack

Use the following stack unless the existing project has a valid technical reason to differ.

- Framework: Next.js with App Router
- Language: TypeScript with strict type checking
- Styling: Tailwind CSS
- UI components: shadcn/ui where useful
- Icons: Lucide React
- Forms and validation: use lightweight, reliable libraries when necessary
- Testing: appropriate unit, component, and end-to-end tests
- Deployment: Vercel or another compatible production host
- Version control: Git

### Development rules

- Use the App Router and server components by default.
- Add `"use client"` only to components that require browser APIs, state, event handlers, or other client-side interactions.
- Avoid unnecessary dependencies.
- Reuse existing components and project conventions.
- Do not replace the framework, package manager, or architecture without a clear reason.
- Never overwrite working features merely to implement a preferred coding style.
- Keep dependencies maintained and compatible with the current project.

---

## 3. Design System and User Interface

Use a clean, modern, white-and-blue glassmorphism design.

### Visual direction

- Primary background: white and very light blue
- Primary accent: professional blue
- Cards: subtle translucent surfaces, restrained blur, soft borders
- Typography: clean, readable, and accessible
- Layout: generous spacing, clear hierarchy, responsive grids
- Buttons: obvious actions with accessible focus and hover states
- Icons: consistent Lucide icons
- Shadows and animations: subtle and purposeful

### Main homepage structure

1. Header with logo, navigation, and theme or utility controls only when useful.
2. Hero section with a clear headline, concise description, and primary upload area.
3. Supported file formats and compression tools.
4. How the compression process works.
5. Benefits, privacy information, and genuine product limitations.
6. Frequently asked questions.
7. Useful related tools and guides.
8. Footer with About, Contact, Privacy Policy, Terms, and relevant navigation.

### UX requirements

- Mobile-first and fully responsive.
- Make the main compression action visible without excessive scrolling.
- Support drag-and-drop and file selection where appropriate.
- Show selected files, processing status, progress where measurable, errors, and results.
- Provide an obvious download action after successful processing.
- Explain unsupported formats and file-size limits before users waste time.
- Include keyboard navigation and visible focus indicators.
- Respect reduced-motion preferences.
- Do not sacrifice readability or usability for decorative glass effects.

---

## 4. File Compression Functionality

Real functionality is more important than visual appearance.

### Required workflow

1. User selects or drops a supported file.
2. Validate the file type, size, and processing requirements.
3. Display the original file name and size.
4. Process the file using the selected compression engine.
5. Report success or a useful error.
6. Display the compressed file size and actual compression statistics.
7. Allow the user to download the resulting file.
8. Release temporary object URLs and browser resources when no longer needed.

### Compression accuracy

Calculate file-size reduction using actual file sizes.

Use:

`reductionPercent = ((originalSize - compressedSize) / originalSize) * 100`

If compression increases the file size, report that honestly. Do not display fabricated savings.

For zero-byte files, handle the calculation safely.

### Processing architecture

- Prefer browser-side processing when performance, compatibility, memory requirements, and format support allow it.
- Use suitable, maintained libraries for individual file formats.
- Use WebAssembly when it provides a practical advantage.
- Use server-side processing only when necessary and with appropriate security, resource limits, and cleanup.
- Never assume that every format can be compressed using the same algorithm.
- Do not load large processing libraries on pages that do not need them.
- Avoid blocking the main browser thread during expensive processing where feasible.

### Security and privacy

- Validate file types and sizes on the server whenever server-side processing is used.
- Treat file extensions and client-provided MIME types as insufficient proof of file contents.
- Never execute uploaded files.
- Avoid storing user files unless required for the feature.
- If server processing is used, define file retention and deletion behavior.
- Never log file contents, sensitive filenames, or unnecessary personal data.
- Do not claim that files never leave the device unless the implementation guarantees it.
- Document privacy-relevant processing behavior accurately.

---

## 5. SEO Strategy

SEO is a core product requirement, not a final cosmetic step.

Build for useful search intent, clear information architecture, crawlability, and a good user experience.

### Primary keyword

**file compressor**

The homepage should target this broad topic naturally.

Do not force the exact phrase into every heading, paragraph, or image description.

### Initial URL structure

Use clean, descriptive URLs:

- `/` — File compressor
- `/pdf-compressor/` — PDF compression, if implemented
- `/image-compressor/` — Image compression, if implemented
- `/video-compressor/` — Video compression, if implemented
- `/audio-compressor/` — Audio compression, if implemented
- `/zip-compressor/` — ZIP or archive utility, if implemented
- `/document-compressor/` — Supported document compression, if implemented
- `/how-to-compress-files/` — General educational guide

Add only pages that provide distinct value and accurately describe the available functionality.

Do not create all of these URLs automatically if the corresponding tools are incomplete.

### On-page SEO requirements

Every indexable page should have:

- A unique, descriptive title tag.
- A useful meta description.
- One clear primary H1.
- Logical H2 and H3 headings.
- Original, helpful explanatory content.
- Relevant internal links.
- Descriptive image alt text where appropriate.
- A clear primary user action.
- A self-referencing canonical URL when appropriate.
- Accurate Open Graph metadata.
- Breadcrumbs when useful for navigation.
- Structured data only when eligible and supported by visible page content.

Do not use keyword stuffing, hidden text, doorway pages, or repetitive AI-generated paragraphs.

### Content quality

Every tool page should explain:

1. What the tool does.
2. Who it is useful for.
3. How to use it.
4. Supported file formats and limits.
5. What affects the result.
6. Privacy and processing behavior.
7. Frequently asked questions based on genuine user needs.
8. Relevant alternatives or related tools.

Make the actual tool the main value of the page. Text should support the experience rather than exist solely to increase word count.

### Internal linking

- Link between genuinely related tools.
- Link guides to relevant functional tools.
- Use descriptive, natural anchor text.
- Avoid unnecessary links and repetitive exact-match anchors.
- Ensure important pages are reachable through normal navigation or contextual links.
- Avoid orphan pages.

### Technical SEO

Implement and verify:

- XML sitemap containing canonical, indexable URLs.
- Correct robots.txt behavior.
- Consistent HTTPS and preferred hostname.
- Redirects for alternate hostnames and URL variants where needed.
- Valid canonical tags.
- Appropriate HTTP status codes.
- Correct 404 handling.
- Useful page titles and metadata.
- Crawlable navigation and internal links.
- No accidental `noindex` on important pages.
- No accidental blocking of important resources.
- No duplicate pages caused by URL parameters or inconsistent trailing slashes.

Never canonicalize every page to the homepage. Distinct, valuable tool pages should normally have their own canonical URLs.

Use Google Search Console to monitor indexing, search performance, and technical issues.

---

## 6. Performance and Core Web Vitals

Performance directly affects usability and supports SEO.

### Requirements

- Keep initial JavaScript payloads as small as practical.
- Use server rendering and static generation when appropriate.
- Dynamically load heavy compression engines.
- Avoid unnecessary client-side rendering.
- Optimize fonts, images, and third-party scripts.
- Prevent layout shifts.
- Reserve space for advertisements when applicable.
- Avoid excessive animation and large background effects.
- Reduce unnecessary network requests.
- Keep the interface responsive during processing.
- Test on mobile devices and slower connections.

Use Lighthouse and real-user performance data when available.

Treat these Core Web Vitals as targets:

- Largest Contentful Paint (LCP): 2.5 seconds or less.
- Interaction to Next Paint (INP): 200 milliseconds or less.
- Cumulative Layout Shift (CLS): 0.1 or less.

Evaluate performance on real production pages rather than assuming that a successful local build guarantees good results.

---

## 7. Google AdSense Readiness

Design the website to support compliant monetization without harming the product.

### Before requesting approval

- The website must provide genuine, working functionality.
- Publish clear About, Contact, Privacy Policy, and Terms pages appropriate to the service.
- Make ownership and site purpose understandable.
- Provide original, useful content where it adds value.
- Ensure navigation works and there are no broken pages.
- Explain file-processing and privacy practices accurately.
- Avoid copied, thin, misleading, or mass-produced content.
- Review current Google Publisher Policies and AdSense Program Policies.

Policy compliance and approval are not guaranteed by any particular page count or content length.

### Advertisement placement

- Never encourage users to click advertisements.
- Never disguise advertisements as download or compression buttons.
- Keep ads visually distinct from tool controls.
- Do not place ads where users may mistake them for file upload, processing, or download actions.
- Do not let ads obstruct the main tool.
- Avoid excessive ad density.
- Do not show ads on empty, broken, or otherwise ineligible pages.
- Follow current consent and privacy requirements applicable to the website's audience and ad setup.

Keep advertisement integration modular so placements can be adjusted without redesigning the entire application.

Do not insert placeholder ad code that looks like a real advertisement or fabricate revenue metrics.

---

## 8. Accessibility

Target WCAG 2.2 AA where practical.

- Use semantic HTML.
- Associate labels with form controls.
- Provide meaningful accessible names for buttons.
- Ensure sufficient color contrast.
- Support keyboard-only operation.
- Make focus states visible.
- Announce important processing states to assistive technologies.
- Provide accessible error messages.
- Do not communicate status through color alone.
- Use suitable alt text for meaningful images.
- Avoid unnecessary ARIA attributes when native HTML provides the required semantics.

---

## 9. Project Architecture

Follow the existing repository structure when it is already established.

A reasonable starting structure is:

```text
app/
  layout.tsx
  page.tsx
  globals.css
  about/
    page.tsx
  contact/
    page.tsx
  privacy-policy/
    page.tsx
  terms/
    page.tsx
  pdf-compressor/
    page.tsx
  image-compressor/
    page.tsx
  how-to-compress-files/
    page.tsx

components/
  layout/
  navigation/
  compression/
  seo/
  ads/
  ui/

lib/
  compression/
  validation/
  seo/
  utils/

public/
  images/
  icons/

tests/
```

This is a suggested organization, not a requirement to create empty directories or unused pages.

### Code organization

- Keep reusable UI components separate from page-specific logic.
- Keep format-specific compression logic in dedicated modules.
- Separate validation, file processing, metadata, and presentation.
- Avoid massive components that mix every responsibility.
- Use clear TypeScript types.
- Handle asynchronous errors explicitly.
- Use configuration rather than duplicating repeated values.
- Avoid unnecessary abstractions for features that only exist once.

---

## 10. Maintainability and Website Resale Value

Build the project so another developer or buyer can understand and operate it.

### Required practices

- Use meaningful file and variable names.
- Keep code readable and reasonably modular.
- Maintain a clean Git history.
- Provide a README with setup and deployment instructions.
- Document environment variables without committing secrets.
- Document compression engines, licensing, limitations, and server dependencies.
- Maintain dependency and license records.
- Keep a list of supported formats and known limitations.
- Document analytics, Search Console, and advertising integrations.
- Maintain a record of hosting costs and other business expenses.
- Avoid unnecessary paid services and hard-to-transfer dependencies.
- Ensure production secrets and personal account credentials are not embedded in source code.

Never claim traffic, profit, user counts, or SEO performance without reliable supporting data.

Keep business assets and access arrangements organized for a potential transfer. Verify the transferability and applicable terms of domains, hosting, third-party services, analytics properties, and advertising accounts separately.

---

## 11. Analytics and Measurement

Prepare for measurement using appropriate privacy-conscious analytics.

Track useful events such as:

- Tool page visits.
- File selection.
- Compression started.
- Compression succeeded.
- Compression failed.
- Download completed.
- Supported-format usage.
- Processing duration and file-size reduction, where appropriate.

Do not collect file contents or sensitive file metadata for analytics.

Do not treat a click on a download button as proof that the file was successfully downloaded.

Use Google Search Console for organic search performance and an appropriate analytics solution for user behavior.

Use real measurements to identify product and SEO improvements. Do not invent performance data.

---

## 12. Testing and Quality Assurance

Before declaring a feature complete, run the applicable checks.

### Code quality

- TypeScript type checking.
- ESLint or the project's configured lint command.
- Production build.
- Relevant automated tests.

### Functional testing

- Valid supported files.
- Unsupported formats.
- Empty files and zero-byte edge cases.
- Files above the configured size limit.
- Corrupted or malformed files.
- Processing errors and cancellation, if supported.
- Accurate before-and-after file sizes.
- Download integrity.
- Multiple files, if supported.
- Mobile layout.
- Keyboard accessibility.
- Browser compatibility for required APIs.

### SEO testing

- Correct title and description.
- One clear H1.
- Correct canonical URL.
- Indexability.
- Sitemap inclusion where appropriate.
- Internal links.
- Valid HTTP status.
- Structured data, if present.
- No broken routes or accidental duplicate pages.

Do not mark a test as passed unless it has actually been run or otherwise verified.

---

## 13. AI Agent Operating Rules

When working on this repository, follow this sequence.

### Before making changes

1. Inspect the existing project structure.
2. Read the package manifest and existing project instructions.
3. Identify the relevant components, routes, and dependencies.
4. Understand the current implementation before modifying it.
5. Identify potential effects on SEO, accessibility, performance, and existing features.

### While making changes

1. Implement the smallest complete solution that satisfies the request.
2. Follow existing conventions.
3. Reuse components when appropriate.
4. Preserve unrelated functionality.
5. Avoid unnecessary dependencies.
6. Do not invent APIs, package capabilities, or configuration options.
7. Do not replace functional behavior with placeholders.
8. Do not create fake testimonials, ratings, usage statistics, or compression results.
9. Never expose secrets or commit `.env` files.
10. Explain any important trade-offs or limitations.

### After making changes

1. Run relevant lint, type-check, test, and build commands when available.
2. Resolve regressions introduced by the changes.
3. Review mobile and desktop layouts when UI changes are made.
4. Verify SEO metadata and canonical behavior for affected pages.
5. Summarize what changed.
6. Report the checks that actually passed.
7. Disclose anything not tested or still incomplete.

If a command cannot be run, explain why rather than claiming it succeeded.

---

## 14. Implementation Priorities

Use this order unless a specific task requires a different sequence.

### Phase 1 — Functional foundation

- Establish the Next.js project.
- Implement the responsive design system.
- Build the homepage and upload interface.
- Deliver at least one genuinely working compression tool.
- Add robust validation, error handling, and download behavior.
- Create essential policy and contact pages with accurate content.

### Phase 2 — SEO foundation

- Establish the URL and internal-link structure.
- Add unique metadata and canonical URLs.
- Implement the sitemap and robots.txt.
- Publish useful, original tool documentation.
- Connect Google Search Console.
- Verify indexing and mobile usability.

### Phase 3 — Expand useful tools

- Add additional formats based on technical feasibility and user demand.
- Test every compression engine.
- Create distinct landing pages for working tools.
- Add relevant educational guides and internal links.
- Monitor search impressions, clicks, engagement, and tool success rates.

### Phase 4 — Monetization

- Review current AdSense eligibility and policy requirements.
- Integrate advertisements only when appropriate.
- Protect the main compression workflow from ad interference.
- Measure actual revenue, costs, and user experience.

### Phase 5 — Prepare for sale

- Document the technical architecture and deployment process.
- Organize domain, code, analytics, and business records.
- Measure real traffic, revenue, expenses, and maintenance requirements.
- Resolve major technical debt and security issues.
- Prepare an accurate asset inventory and operating guide.
- Verify which assets and third-party accounts can be transferred.

Do not assume that a particular launch date, traffic target, AdSense approval, or sale price is guaranteed.

---

## 15. Definition of Done

A task is complete only when:

- The requested feature works as described.
- The implementation follows the project's architecture.
- Relevant validation and error states are handled.
- The UI is responsive and accessible.
- SEO metadata and URL behavior are correct where relevant.
- No fake functionality or unsupported claims have been introduced.
- Applicable checks have been run, with results reported accurately.
- Documentation is updated when necessary.
- Remaining limitations are clearly communicated.

**Final principle:** Build a genuinely useful, technically sound file compression product first. SEO, AdSense revenue, and resale value should grow from product quality, user trust, sustainable organic visibility, and documented business performance—not shortcuts or inflated claims.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
