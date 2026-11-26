import { useCallback, useEffect, useRef, useState } from 'react';
import { useMathApp } from '../context/MathContext';
import {
  ADMOB_IDS,
  getNativeAdMobPlugin,
  isLocalhostEnvironment,
} from '../config/adConfig';

export const useInterstitial = () => {
  const { profile } = useMathApp();
  const [isInterstitialVisible, setIsInterstitialVisible] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const onCloseCallbackRef = useRef(null);

  const isLocalhost = isLocalhostEnvironment();
  const interstitialUnitId = isLocalhost
    ? ADMOB_IDS.interstitialTest
    : ADMOB_IDS.interstitialReal;

  useEffect(() => {
    if (!isInterstitialVisible) {
      setCountdown(3);
      return;
    }

    const timer = window.setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isInterstitialVisible]);

  const dismissInterstitial = useCallback(() => {
    setIsInterstitialVisible(false);
    const cb = onCloseCallbackRef.current;
    onCloseCallbackRef.current = null;
    if (typeof cb === 'function') {
      cb();
    }
  }, []);

  const showInterstitial = useCallback(
    async (onComplete) => {
      // Never show ads to VIP / Premium users
      if (profile.isPremium) {
        if (typeof onComplete === 'function') onComplete();
        return;
      }

      const nativeAdMob = getNativeAdMobPlugin();

      // 1. Native Android/Capacitor AdMob SDK if available
      if (
        nativeAdMob &&
        typeof nativeAdMob.prepareInterstitial === 'function' &&
        typeof nativeAdMob.showInterstitial === 'function'
      ) {
        try {
          await nativeAdMob.prepareInterstitial({
            adId: interstitialUnitId,
            isTesting: isLocalhost,
          });
          await nativeAdMob.showInterstitial();
        } catch {
          // Proceed gracefully so gameplay is never stuck
        }
        if (typeof onComplete === 'function') onComplete();
        return;
      }

      // 2. Localhost development preview modal (uses test unit ID)
      if (isLocalhost) {
        onCloseCallbackRef.current = typeof onComplete === 'function' ? onComplete : null;
        setIsInterstitialVisible(true);
        return;
      }

      // 3. Web production without native AdMob SDK: continue smoothly without fake ad modals
      if (typeof onComplete === 'function') {
        onComplete();
      }
    },
    [profile.isPremium, interstitialUnitId, isLocalhost]
  );

  return {
    showInterstitial,
    isInterstitialVisible,
    countdown,
    dismissInterstitial,
    interstitialUnitId,
    isTestMode: isLocalhost,
  };
};
