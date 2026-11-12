import React, { useEffect, useRef } from 'react';
import { useMathApp } from '../context/MathContext';

export interface AdsByGoogleQueue extends Array<Record<string, unknown>> {
  pauseAdRequests?: number;
}

declare global {
  interface Window {
    adsbygoogle?: AdsByGoogleQueue;
  }
}

interface AdSenseBannerProps {
  placement?: 'home' | 'result';
  slotId?: string;
  className?: string;
}

const ADSENSE_CLIENT_ID = 'ca-pub-4256744845246337';

export const AdSenseBanner: React.FC<AdSenseBannerProps> = ({
  placement = 'home',
  slotId,
  className = '',
}) => {
  const { profile, activeGame, settings } = useMathApp();
  const insRef = useRef<HTMLModElement | null>(null);

  const envSlot =
    placement === 'home'
      ? import.meta.env.VITE_ADSENSE_SLOT_HOME
      : import.meta.env.VITE_ADSENSE_SLOT_RESULT;

  const rawSlot = slotId ?? envSlot;
  const resolvedSlot = typeof rawSlot === 'string' ? rawSlot.trim() : '';
  const hasValidSlot = /^\d+$/.test(resolvedSlot);

  // Strictly disable ads for VIP users, during active gameplay, or when no manual slot is configured
  // (When no manual slot ID is set, Google AdSense Auto Ads from index.html manages placements without TagError.)
  const shouldRenderManualUnit = !profile.isPremium && !activeGame && hasValidSlot;

  useEffect(() => {
    if (!shouldRenderManualUnit || !insRef.current) return;

    const insElement = insRef.current;
    // Prevent duplicate push() on the same <ins> element (React StrictMode / re-renders)
    if (insElement.getAttribute('data-adsbygoogle-status')) return;
    if (insElement.offsetWidth === 0) return;

    try {
      const queue = (window.adsbygoogle = window.adsbygoogle || []);
      queue.push({});
    } catch {
      // Ignore gracefully if offline or blocked by ad blocker
    }
  }, [shouldRenderManualUnit, resolvedSlot]);

  if (!shouldRenderManualUnit) return null;

  return (
    <aside
      className={`w-full my-3 pt-2 border-t border-slate-200/70 dark:border-slate-800/70 text-center ${className}`}
      aria-label={settings.language === 'fr' ? 'Publicité' : 'Advertisement'}
    >
      <span className="block text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5 select-none">
        {settings.language === 'fr' ? 'Publicité' : 'Advertisement'}
      </span>
      <div className="w-full min-w-[250px] min-h-[50px] overflow-hidden rounded-xl bg-slate-100/60 dark:bg-slate-800/40">
        <ins
          ref={insRef}
          className="adsbygoogle block w-full"
          style={{ display: 'block' }}
          data-ad-client={ADSENSE_CLIENT_ID}
          data-ad-slot={resolvedSlot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </aside>
  );
};
