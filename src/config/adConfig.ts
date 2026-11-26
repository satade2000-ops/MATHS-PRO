import { SITE_CONFIG } from './siteConfig';

export const ADMOB_IDS = {
  appId: 'ca-app-pub-4256744845246337~5905995303',
  bannerReal: 'ca-app-pub-4256744845246337/6559893585',
  bannerTest: 'ca-app-pub-3940256099942544/6300978111',
  interstitialReal: 'ca-app-pub-4256744845246337/4687961602',
  interstitialTest: 'ca-app-pub-3940256099942544/1033173712',
  rewardedReal: 'ca-app-pub-4256744845246337/1383588527',
  rewardedTest: 'ca-app-pub-3940256099942544/5224354917',
} as const;

export interface NativeAdMobPlugin {
  initialize?: (options?: Record<string, unknown>) => Promise<void>;
  showBanner?: (options: Record<string, unknown>) => Promise<void>;
  hideBanner?: () => Promise<void>;
  removeBanner?: () => Promise<void>;
  prepareInterstitial?: (options: Record<string, unknown>) => Promise<void>;
  showInterstitial?: () => Promise<void>;
  prepareRewardVideoAd?: (options: Record<string, unknown>) => Promise<void>;
  showRewardVideoAd?: () => Promise<Record<string, unknown> | boolean | void>;
}

export const isLocalhostEnvironment = (): boolean => {
  if (typeof window === 'undefined') return false;
  const host = window.location.hostname;
  return host === 'localhost' || host === '127.0.0.1';
};

export const getNativeAdMobPlugin = (): NativeAdMobPlugin | null => {
  if (typeof window === 'undefined') return null;
  const win = window as unknown as {
    Capacitor?: { Plugins?: { AdMob?: NativeAdMobPlugin } };
    AdMob?: NativeAdMobPlugin;
  };
  return win.Capacitor?.Plugins?.AdMob || win.AdMob || null;
};

export const getWebAdSenseBannerSlot = (): string => {
  const raw =
    import.meta.env.VITE_ADSENSE_SLOT_BANNER ||
    import.meta.env.VITE_ADSENSE_SLOT_HOME ||
    '';
  return typeof raw === 'string' ? raw.trim() : '';
};

export const hasValidWebAdSenseBannerSlot = (): boolean => {
  return /^\d+$/.test(getWebAdSenseBannerSlot());
};

export const shouldDisplayBottomAdBanner = (params: {
  isPremium: boolean;
  hasActiveGame: boolean;
  consentDecided: boolean;
  consentAds: boolean;
}): boolean => {
  if (params.isPremium || params.hasActiveGame) return false;
  if (isLocalhostEnvironment()) return true;
  if (getNativeAdMobPlugin() !== null) return true;

  return (
    SITE_CONFIG.adsenseApproved &&
    params.consentDecided &&
    params.consentAds &&
    hasValidWebAdSenseBannerSlot()
  );
};
