import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

import { getSiteOrigin } from '@/lib/seo/site-config';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const origin = getSiteOrigin();
  // Filter out any caller-passed 'Home' or '/' to avoid duplicate root breadcrumbs
  const cleanItems = items.filter(
    (item) => item.label.toLowerCase() !== 'home' && item.href !== '/'
  );

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: origin,
      },
      ...cleanItems.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 2,
        name: item.label,
        item: item.href
          ? `${origin}${item.href.startsWith('/') ? item.href : `/${item.href}`}`
          : undefined,
      })),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="inline-flex flex-wrap items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/75 backdrop-blur-md border border-slate-200/80 shadow-2xs text-xs font-medium text-slate-500">
          <li className="inline-flex items-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-slate-500 hover:text-blue-600 transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
          </li>
          {cleanItems.map((item, idx) => {
            const isLast = idx === cleanItems.length - 1;
            return (
              <li key={idx} className="inline-flex items-center gap-1.5">
                <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="text-slate-500 hover:text-blue-600 transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className="font-bold text-slate-900"
                    aria-current={isLast ? 'page' : undefined}
                  >
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
