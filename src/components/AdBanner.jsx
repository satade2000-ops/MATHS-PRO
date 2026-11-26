import React, { useEffect, useRef } from 'react';
import { useMathApp } from '../context/MathContext';
import { SITE_CONFIG } from '../config/siteConfig';
import {
  ADMOB_IDS,
  getNativeAdMobPlugin,
  getWebAdSenseBannerSlot,
  hasValidWebAdSenseBannerSlot,
  isLocalhostEnvironment,
  shouldDisplayBottomAdBanner,
} from '../config/adConfig';

export const AdBanner = () => {
  const { profile, activeGame, cookieConsent } = useMathApp();
  const insRef = useRef(null);

  const isLocalhost = isLocalhostEnvironment();
  const nativeAdMob = getNativeAdMobPlugin();
  const webSlot = getWebAdSenseBannerSlot();
  const hasWebSlot = hasValidWebAdSenseBannerSlot();

  const isVisible = shouldDisplayBottomAdBanner({
    isPremium: profile.isPremium,
    hasActiveGame: Boolean(activeGame),
    consentDecided: cookieConsent.decided,
    consentAds: cookieConsent.ads,
  });

  const activeBannerUnitId = isLocalhost ? ADMOB_IDS.bannerTest : ADMOB_IDS.bannerReal;

  // Native AdMob bridge (when packaged with Capacitor/Android AdMob SDK)
  useEffect(() => {
    if (!isVisible || !nativeAdMob || isLocalhost) return;

    let mounted = true;
    const initNativeBanner = async () => {
      try {
        if (typeof nativeAdMob.initialize === 'function') {
          await nativeAdMob.initialize({});
        }
        if (mounted && typeof nativeAdMob.showBanner === 'function') {
          await nativeAdMob.showBanner({
            adId: activeBannerUnitId,
            position: 'BOTTOM_CENTER',
            isTesting: isLocalhost,
          });
        }
      } catch {
        // Ignore if native bridge fails
      }
    };

    initNativeBanner();

    return () => {
      mounted = false;
      if (typeof nativeAdMob.hideBanner === 'function') {
        nativeAdMob.hideBanner().catch(() => {});
      }
    };
  }, [isVisible, nativeAdMob, isLocalhost, activeBannerUnitId]);

  // Web AdSense push (only when approved, consented, and configured with a valid numeric Web AdSense slot)
  useEffect(() => {
    if (!isVisible || isLocalhost || nativeAdMob || !hasWebSlot || !insRef.current) return;

    const insElement = insRef.current;
    if (insElement.getAttribute('data-adsbygoogle-status')) return;
    if (insElement.offsetWidth === 0) return;

    try {
      const queue = (window.adsbygoogle = window.adsbygoogle || []);
      queue.push({});
    } catch {
      // Ignore gracefully if offline or blocked by ad blocker
    }
  }, [isVisible, isLocalhost, nativeAdMob, hasWebSlot, webSlot]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 w-full h-[50px] z-50 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-center overflow-hidden shadow-sm"
      data-ad-app-id={ADMOB_IDS.appId}
      data-ad-unit={activeBannerUnitId}
    >
      {isLocalhost ? (
        <div className="w-full h-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2 px-3 text-xs font-bold select-none">
          <span>Pub test - MATHS PRO</span>
          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 hidden sm:inline">
            ({ADMOB_IDS.bannerTest})
          </span>
        </div>
      ) : nativeAdMob ? (
        <div className="w-full h-full flex items-center justify-center text-[11px] text-slate-500 dark:text-slate-400">
          Publicité AdMob
        </div>
      ) : (
        <ins
          ref={insRef}
          className="adsbygoogle block w-full h-[50px]"
          style={{ display: 'block', width: '100%', height: '50px' }}
          data-ad-client={SITE_CONFIG.adsensePublisherId}
          data-ad-slot={webSlot}
          data-ad-format="horizontal"
          data-full-width-responsive="false"
        />
      )}
    </div>
  );
};
