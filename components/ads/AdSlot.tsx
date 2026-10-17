import React from 'react';

interface AdSlotProps {
  slotId?: string;
  format?: 'horizontal' | 'rectangle' | 'responsive';
  className?: string;
}

/**
 * Modular AdSense ad slot component.
 * Reserves layout space to prevent Cumulative Layout Shift (CLS).
 * Complies with Google AdSense Policies: clearly labeled, non-deceptive,
 * never mistaken for download or upload controls.
 */
export function AdSlot({
  slotId,
  format = 'horizontal',
  className = '',
}: AdSlotProps) {
  // If no AdSense publisher ID is configured, render a clean, policy-compliant placeholder
  // that reserves exact dimensions without disrupting user experience.
  const heightClasses = {
    horizontal: 'min-h-[90px] max-w-4xl',
    rectangle: 'min-h-[250px] w-full max-w-[300px]',
    responsive: 'min-h-[100px] w-full',
  }[format];

  return (
    <aside
      aria-label="Advertisement"
      className={`my-8 mx-auto flex flex-col items-center justify-center p-3 rounded-xl border border-dashed border-slate-200 bg-slate-50/60 transition-all ${heightClasses} ${className}`}
    >
      <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-1">
        Advertisement
      </span>

      {slotId ? (
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || ''}
          data-ad-slot={slotId}
          data-ad-format={format === 'rectangle' ? 'rectangle' : 'auto'}
          data-full-width-responsive="true"
        />
      ) : (
        <div className="flex items-center justify-center text-xs text-slate-400/80 py-4 text-center">
          <span>Ad space reserved for verified partner content</span>
        </div>
      )}
    </aside>
  );
}
