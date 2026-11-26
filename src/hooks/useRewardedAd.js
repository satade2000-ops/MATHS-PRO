import { useCallback, useState } from 'react';
import { useMathApp } from '../context/MathContext';
import { SITE_CONFIG } from '../config/siteConfig';
import {
  ADMOB_IDS,
  getNativeAdMobPlugin,
  isLocalhostEnvironment,
} from '../config/adConfig';

export const useRewardedAd = () => {
  const { cookieConsent } = useMathApp();
  const [isRewardedLoading, setIsRewardedLoading] = useState(false);

  const isLocalhost = isLocalhostEnvironment();
  const rewardedUnitId = isLocalhost
    ? ADMOB_IDS.rewardedTest
    : ADMOB_IDS.rewardedReal;

  const showRewardedAd = useCallback(
    async ({ onRewarded, onDismissed, onUnavailable } = {}) => {
      // 1. Localhost: grant +1 life directly for local testing
      if (isLocalhost) {
        if (typeof onRewarded === 'function') onRewarded();
        return;
      }

      if (isRewardedLoading) return;
      setIsRewardedLoading(true);

      const nativeAdMob = getNativeAdMobPlugin();

      // 2. Native Android/Capacitor AdMob Rewarded Video SDK
      if (
        nativeAdMob &&
        typeof nativeAdMob.prepareRewardVideoAd === 'function' &&
        typeof nativeAdMob.showRewardVideoAd === 'function'
      ) {
        try {
          await nativeAdMob.prepareRewardVideoAd({
            adId: rewardedUnitId,
            isTesting: false,
          });
          const rewardResult = await nativeAdMob.showRewardVideoAd();
          setIsRewardedLoading(false);

          const earnedReward =
            rewardResult === true ||
            (typeof rewardResult === 'object' &&
              rewardResult !== null &&
              (Boolean(rewardResult.amount) ||
                Boolean(rewardResult.type) ||
                rewardResult.rewarded === true));

          if (earnedReward) {
            if (typeof onRewarded === 'function') onRewarded();
          } else if (typeof onDismissed === 'function') {
            onDismissed();
          }
        } catch {
          setIsRewardedLoading(false);
          if (typeof onUnavailable === 'function') onUnavailable();
        }
        return;
      }

      // 3. Google AdSense H5 / Ad Placement API (window.adBreak) when approved & consented
      const win = typeof window !== 'undefined' ? window : null;
      const adBreakFn = win && typeof win.adBreak === 'function' ? win.adBreak : null;

      if (
        adBreakFn &&
        SITE_CONFIG.adsenseApproved &&
        cookieConsent.decided &&
        cookieConsent.ads
      ) {
        try {
          // Ensure adsbygoogle requests are not paused before invoking rewarded placement
          if (win.adsbygoogle) {
            win.adsbygoogle.pauseAdRequests = 0;
          }

          let settled = false;
          adBreakFn({
            type: 'reward',
            name: 'maths_pro_extra_life',
            beforeReward: (showAdFn) => {
              if (typeof showAdFn === 'function') {
                showAdFn();
              } else if (!settled) {
                settled = true;
                setIsRewardedLoading(false);
                if (typeof onUnavailable === 'function') onUnavailable();
              }
            },
            adViewed: () => {
              if (settled) return;
              settled = true;
              setIsRewardedLoading(false);
              if (typeof onRewarded === 'function') onRewarded();
            },
            adDismissed: () => {
              if (settled) return;
              settled = true;
              setIsRewardedLoading(false);
              if (typeof onDismissed === 'function') onDismissed();
            },
            adBreakDone: (placementInfo) => {
              if (settled) return;
              if (
                placementInfo &&
                placementInfo.breakStatus &&
                placementInfo.breakStatus !== 'viewed'
              ) {
                settled = true;
                setIsRewardedLoading(false);
                if (placementInfo.breakStatus === 'dismissed') {
                  if (typeof onDismissed === 'function') onDismissed();
                } else if (typeof onUnavailable === 'function') {
                  onUnavailable();
                }
              }
            },
          });
        } catch {
          setIsRewardedLoading(false);
          if (typeof onUnavailable === 'function') onUnavailable();
        }
        return;
      }

      // 4. Rewarded ad network not yet available on this web session
      setIsRewardedLoading(false);
      if (typeof onUnavailable === 'function') {
        onUnavailable();
      }
    },
    [isLocalhost, isRewardedLoading, rewardedUnitId, cookieConsent.decided, cookieConsent.ads]
  );

  return {
    showRewardedAd,
    isRewardedLoading,
    rewardedUnitId,
    isTestMode: isLocalhost,
  };
};
