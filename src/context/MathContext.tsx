import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import {
  AppSettings,
  CookieConsentState,
  DifficultyLevel,
  GameMode,
  GameResult,
  OperationType,
  UserProfile,
} from '../types/math';
import { SITE_CONFIG } from '../config/siteConfig';
import { sound } from '../utils/audio';
import { BADGES } from '../utils/constants';
import { getDifficultyForStage, getStageForDifficulty, getTargetScoreForStage } from '../utils/progression';
import { translations } from '../utils/translations';

export type InfoPageType = 'privacy' | 'about' | 'contact' | 'terms' | 'legal' | 'lessons' | null;

const getInfoPageFromPath = (pathname: string): InfoPageType => {
  const clean = pathname.toLowerCase().replace(/\/+$/, '') || '/';
  if (clean === '/confidentialite' || clean === '/privacy') return 'privacy';
  if (clean === '/a-propos' || clean === '/about') return 'about';
  if (clean === '/contact') return 'contact';
  if (clean === '/conditions-utilisation' || clean === '/terms') return 'terms';
  if (clean === '/mentions-legales' || clean === '/legal') return 'legal';
  if (clean === '/cours' || clean === '/lessons') return 'lessons';
  return null;
};

const getPathFromInfoPage = (page: InfoPageType): string => {
  if (page === 'privacy') return '/confidentialite';
  if (page === 'about') return '/a-propos';
  if (page === 'contact') return '/contact';
  if (page === 'terms') return '/conditions-utilisation';
  if (page === 'legal') return '/mentions-legales';
  if (page === 'lessons') return '/cours';
  return '/';
};

const getSeoMeta = (
  page: InfoPageType,
  lang: 'fr' | 'en'
): { title: string; description: string; path: string } => {
  const path = getPathFromInfoPage(page);
  if (page === 'lessons') {
    return {
      path,
      title: lang === 'fr' ? 'Cours & Fiches Méthode – MATHS PRO' : 'Lessons & Study Guides – MATHS PRO',
      description:
        lang === 'fr'
          ? 'Cours de mathématiques gratuits, formules et exemples corrigés : arithmétique, algèbre, géométrie, fractions, équations, fonctions, statistiques et probabilités.'
          : 'Free math lessons, formulas, and worked examples covering arithmetic, algebra, geometry, fractions, equations, functions, statistics, and probability.',
    };
  }
  if (page === 'about') {
    return {
      path,
      title: lang === 'fr' ? 'À propos – MATHS PRO' : 'About – MATHS PRO',
      description:
        lang === 'fr'
          ? 'Découvrez la mission pédagogique de MATHS PRO : apprendre les mathématiques en s’amusant grâce aux jeux, cours et défis.'
          : 'Discover MATHS PRO’s educational mission: learn mathematics while having fun with interactive games, lessons, and challenges.',
    };
  }
  if (page === 'contact') {
    return {
      path,
      title: lang === 'fr' ? 'Contact – MATHS PRO' : 'Contact – MATHS PRO',
      description:
        lang === 'fr'
          ? 'Contactez l’équipe de MATHS PRO pour toute question pédagogique, technique ou liée à la confidentialité.'
          : 'Contact the MATHS PRO team for educational, technical, or privacy inquiries.',
    };
  }
  if (page === 'privacy') {
    return {
      path,
      title: lang === 'fr' ? 'Politique de Confidentialité – MATHS PRO' : 'Privacy Policy – MATHS PRO',
      description:
        lang === 'fr'
          ? 'Transparence sur le stockage local, les cookies, Google AdSense et vos droits sur MATHS PRO.'
          : 'Details on local storage, cookies, Google AdSense, and user privacy rights on MATHS PRO.',
    };
  }
  if (page === 'terms') {
    return {
      path,
      title: lang === 'fr' ? "Conditions Générales d'Utilisation – MATHS PRO" : 'Terms of Use – MATHS PRO',
      description:
        lang === 'fr'
          ? "Conditions générales d'utilisation de la plateforme éducative MATHS PRO."
          : 'Terms and conditions governing use of the MATHS PRO educational platform.',
    };
  }
  if (page === 'legal') {
    return {
      path,
      title: lang === 'fr' ? 'Mentions Légales – MATHS PRO' : 'Legal Notice – MATHS PRO',
      description:
        lang === 'fr'
          ? 'Mentions légales, hébergement Vercel et informations éditeur de MATHS PRO.'
          : 'Legal notice, Vercel hosting details, and publisher disclosures for MATHS PRO.',
    };
  }
  return {
    path: '/',
    title: 'MATHS PRO – Jeux de Mathématiques',
    description:
      lang === 'fr'
        ? 'Plateforme éducative de mathématiques : cours, fiches méthode et jeux interactifs (arithmétique, algèbre, géométrie, fractions, équations, fonctions, statistiques et probabilités).'
        : 'Interactive math learning platform: lessons, study guides, and practice games covering arithmetic, algebra, geometry, fractions, equations, functions, statistics, and probability.',
  };
};

const CONSENT_STORAGE_KEY = 'maths_pro_consent_v1';

const defaultConsent: CookieConsentState = {
  decided: false,
  essential: true,
  ads: false,
  updatedAt: '',
};

interface MathContextType {
  profile: UserProfile;
  settings: AppSettings;
  cookieConsent: CookieConsentState;
  activeTab: 'home' | 'games' | 'challenges' | 'leaderboard' | 'profile';
  activeInfoPage: InfoPageType;
  activeGame: {
    operation: OperationType;
    mode: GameMode;
    difficulty: DifficultyLevel;
    stage: number;
    targetScore: number;
  } | null;
  activeResult: GameResult | null;
  isSettingsOpen: boolean;
  isPremiumOpen: boolean;
  isAdOpen: boolean;
  isCookieModalOpen: boolean;
  showExitPrompt: boolean;
  setActiveTab: (tab: 'home' | 'games' | 'challenges' | 'leaderboard' | 'profile') => void;
  startNewGame: (
    operation: OperationType,
    mode: GameMode,
    difficulty?: DifficultyLevel,
    stage?: number
  ) => void;
  startNextStage: (operation: OperationType, mode: GameMode, currentStage: number) => void;
  quitActiveGame: () => void;
  finishGame: (result: GameResult) => void;
  closeResultScreen: () => void;
  claimDailyReward: () => void;
  updateSettings: (partial: Partial<AppSettings>) => void;
  updateProfileName: (name: string) => void;
  updateAvatar: (avatarId: string) => void;
  togglePremium: (active?: boolean) => void;
  resetAllData: () => void;
  openSettings: () => void;
  closeSettings: () => void;
  openPremium: () => void;
  closePremium: () => void;
  isPlayStoreOpen: boolean;
  openPlayStore: () => void;
  closePlayStore: () => void;
  openPrivacy: () => void;
  openAbout: () => void;
  openContact: () => void;
  openTerms: () => void;
  openLegalNotice: () => void;
  openLessons: () => void;
  goHome: () => void;
  openAdModal: () => void;
  closeAdModal: () => void;
  openCookieModal: () => void;
  closeCookieModal: () => void;
  acceptAllCookies: () => void;
  rejectOptionalCookies: () => void;
  saveCustomCookieConsent: (allowAds: boolean) => void;
  doubleLastGameXp: () => void;
  t: (key: string) => string;
}

const defaultProfile: UserProfile = {
  name: 'Champion des Maths',
  avatarId: 'avatar_euler',
  level: 1,
  xp: 120,
  xpToNextLevel: 250,
  totalStars: 4,
  coins: 150,
  streakDays: 1,
  lastPlayedDate: new Date().toISOString().split('T')[0],
  dailyRewardClaimed: false,
  isPremium: false,
  unlockedBadges: ['badge_first_step'],
  statsByOperation: {
    addition: { played: 2, correct: 18, total: 20, bestScore: 180, stars: 2 },
    subtraction: { played: 1, correct: 9, total: 10, bestScore: 90, stars: 1 },
    multiplication: { played: 1, correct: 10, total: 10, bestScore: 100, stars: 1 },
    division: { played: 0, correct: 0, total: 0, bestScore: 0, stars: 0 },
    mental_math: { played: 0, correct: 0, total: 0, bestScore: 0, stars: 0 },
    square_root: { played: 0, correct: 0, total: 0, bestScore: 0, stars: 0 },
    percentage: { played: 0, correct: 0, total: 0, bestScore: 0, stars: 0 },
    power: { played: 0, correct: 0, total: 0, bestScore: 0, stars: 0 },
    fraction: { played: 0, correct: 0, total: 0, bestScore: 0, stars: 0 },
    equation: { played: 0, correct: 0, total: 0, bestScore: 0, stars: 0 },
    geometry: { played: 0, correct: 0, total: 0, bestScore: 0, stars: 0 },
    functions: { played: 0, correct: 0, total: 0, bestScore: 0, stars: 0 },
    statistics: { played: 0, correct: 0, total: 0, bestScore: 0, stars: 0 },
    probability: { played: 0, correct: 0, total: 0, bestScore: 0, stars: 0 },
  },
  stageByOperation: {
    addition: 1,
    subtraction: 1,
    multiplication: 1,
    division: 1,
    mental_math: 1,
    square_root: 1,
    percentage: 1,
    power: 1,
    fraction: 1,
    equation: 1,
    geometry: 1,
    functions: 1,
    statistics: 1,
    probability: 1,
  },
  gameHistory: [],
};

const defaultSettings: AppSettings = {
  language: 'fr',
  darkMode: true,
  soundEnabled: true,
  musicEnabled: false,
  defaultInputMethod: 'multiple_choice',
  timedDuration: 60,
  examQuestionsCount: 20,
  selectedDifficulty: 'medium',
};

const MathContext = createContext<MathContextType | undefined>(undefined);

export const MathProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('maths_pro_profile_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...defaultProfile,
          ...parsed,
          statsByOperation: {
            ...defaultProfile.statsByOperation,
            ...(parsed?.statsByOperation || {}),
          },
          stageByOperation: {
            ...defaultProfile.stageByOperation,
            ...(parsed?.stageByOperation || {}),
          },
        };
      }
    } catch {
      // ignore
    }
    return defaultProfile;
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('maths_pro_settings_v2');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return defaultSettings;
  });

  const [cookieConsent, setCookieConsent] = useState<CookieConsentState>(() => {
    try {
      const saved = localStorage.getItem(CONSENT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed?.decided === 'boolean' && typeof parsed?.ads === 'boolean') {
          return {
            decided: parsed.decided,
            essential: true,
            ads: parsed.ads,
            updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : '',
          };
        }
      }
    } catch {
      // ignore
    }
    return defaultConsent;
  });

  const [activeTab, setActiveTabState] = useState<'home' | 'games' | 'challenges' | 'leaderboard' | 'profile'>('home');
  const [activeInfoPage, setActiveInfoPage] = useState<InfoPageType>(() =>
    typeof window !== 'undefined' ? getInfoPageFromPath(window.location.pathname) : null
  );
  const [activeGame, setActiveGame] = useState<{
    operation: OperationType;
    mode: GameMode;
    difficulty: DifficultyLevel;
    stage: number;
    targetScore: number;
  } | null>(null);
  const [activeResult, setActiveResult] = useState<GameResult | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPremiumOpen, setIsPremiumOpen] = useState(false);
  const [isAdOpen, setIsAdOpen] = useState(false);
  const [isPlayStoreOpen, setIsPlayStoreOpen] = useState(false);
  const [isCookieModalOpen, setIsCookieModalOpen] = useState(false);
  const [showExitPrompt, setShowExitPrompt] = useState(false);

  const exitArmedRef = useRef(false);
  const exitTimerRef = useRef<number | null>(null);
  const isExitingRef = useRef(false);

  const latestNavStateRef = useRef({
    activeGame,
    activeResult,
    activeInfoPage,
    activeTab,
    isSettingsOpen,
    isPremiumOpen,
    isAdOpen,
    isPlayStoreOpen,
    isCookieModalOpen,
  });

  latestNavStateRef.current = {
    activeGame,
    activeResult,
    activeInfoPage,
    activeTab,
    isSettingsOpen,
    isPremiumOpen,
    isAdOpen,
    isPlayStoreOpen,
    isCookieModalOpen,
  };

  const clearExitArm = () => {
    if (exitTimerRef.current !== null) {
      clearTimeout(exitTimerRef.current);
      exitTimerRef.current = null;
    }
    exitArmedRef.current = false;
    setShowExitPrompt(false);
  };

  const ensureHistoryGuard = (path?: string) => {
    try {
      const targetPath = path || window.location.pathname || '/';
      if (!window.history.state?.__mathsProGuard) {
        window.history.pushState({ __mathsProGuard: true, path: targetPath }, '', targetPath);
      }
    } catch {
      // ignore
    }
  };

  // Initialize base + guard history entry and handle Back button (Retour) cleanly
  useEffect(() => {
    try {
      const initialPath = window.location.pathname || '/';
      if (!window.history.state?.__mathsProGuard && !window.history.state?.__mathsProBase) {
        window.history.replaceState({ __mathsProBase: true, path: initialPath }, '', initialPath);
        window.history.pushState({ __mathsProGuard: true, path: initialPath }, '', initialPath);
      }
    } catch {
      // ignore
    }

    const handlePopState = () => {
      if (isExitingRef.current) return;

      const s = latestNavStateRef.current;

      // 1. Close any open modal first
      if (s.isSettingsOpen || s.isPremiumOpen || s.isAdOpen || s.isPlayStoreOpen || s.isCookieModalOpen) {
        sound.playClick();
        setIsSettingsOpen(false);
        setIsPremiumOpen(false);
        setIsAdOpen(false);
        setIsPlayStoreOpen(false);
        setIsCookieModalOpen(false);
        clearExitArm();
        ensureHistoryGuard(s.activeInfoPage ? getPathFromInfoPage(s.activeInfoPage) : '/');
        return;
      }

      // 2. If inside a game or on result screen -> return to Main Menu (do not exit app)
      if (s.activeGame !== null || s.activeResult !== null) {
        sound.playClick();
        setActiveGame(null);
        setActiveResult(null);
        setActiveInfoPage(null);
        setActiveTabState('home');
        clearExitArm();
        ensureHistoryGuard('/');
        return;
      }

      // 3. If on an info page or secondary tab -> return to Main Menu
      if (s.activeInfoPage !== null || s.activeTab !== 'home') {
        sound.playClick();
        setActiveInfoPage(null);
        setActiveTabState('home');
        clearExitArm();
        ensureHistoryGuard('/');
        return;
      }

      // 4. Already on Main Menu -> require double Back press to exit
      if (exitArmedRef.current) {
        clearExitArm();
        isExitingRef.current = true;
        try {
          window.history.back();
        } catch {
          // ignore
        }
        return;
      }

      exitArmedRef.current = true;
      setShowExitPrompt(true);
      ensureHistoryGuard('/');

      if (exitTimerRef.current !== null) clearTimeout(exitTimerRef.current);
      exitTimerRef.current = window.setTimeout(() => {
        exitArmedRef.current = false;
        setShowExitPrompt(false);
        exitTimerRef.current = null;
      }, 2200);
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      if (exitTimerRef.current !== null) clearTimeout(exitTimerRef.current);
    };
  }, []);

  const navigateInfoPage = (page: InfoPageType) => {
    clearExitArm();
    setActiveInfoPage(page);
    try {
      const targetPath = getPathFromInfoPage(page);
      window.history.replaceState({ __mathsProGuard: true, infoPage: page }, '', targetPath);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      // ignore
    }
  };

  const setActiveTab = (tab: 'home' | 'games' | 'challenges' | 'leaderboard' | 'profile') => {
    clearExitArm();
    setActiveTabState(tab);
    ensureHistoryGuard('/');
    if (activeInfoPage !== null) {
      navigateInfoPage(null);
    } else {
      try {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch {
        // ignore
      }
    }
  };

  const goHome = () => {
    clearExitArm();
    setActiveTabState('home');
    navigateInfoPage(null);
  };

  // Sync dark class on document element
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  // Sync document language and dynamic SEO title/description/canonical
  useEffect(() => {
    document.documentElement.lang = settings.language;
    const meta = getSeoMeta(activeInfoPage, settings.language);
    document.title = meta.title;

    const descEl = document.querySelector('meta[name="description"]');
    if (descEl) descEl.setAttribute('content', meta.description);

    const canonicalEl = document.querySelector('link[rel="canonical"]');
    if (canonicalEl) {
      canonicalEl.setAttribute('href', `${SITE_CONFIG.siteUrl}${meta.path === '/' ? '/' : meta.path}`);
    }
  }, [settings.language, activeInfoPage]);

  // Persist Cookie Consent & sync Google Consent Mode v2 + AdSense pauseAdRequests
  useEffect(() => {
    try {
      if (cookieConsent.decided) {
        localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(cookieConsent));
      }
    } catch {
      // ignore
    }

    const disableAds =
      profile.isPremium ||
      !!activeGame ||
      !cookieConsent.decided ||
      !cookieConsent.ads ||
      !SITE_CONFIG.adsenseApproved;

    document.documentElement.setAttribute('data-ads-disabled', disableAds ? 'true' : 'false');

    try {
      const win = window as unknown as {
        adsbygoogle?: { pauseAdRequests?: number } & unknown[];
        gtag?: (...args: unknown[]) => void;
      };
      win.adsbygoogle = win.adsbygoogle || [];
      win.adsbygoogle.pauseAdRequests = disableAds ? 1 : 0;

      if (typeof win.gtag === 'function' && cookieConsent.decided) {
        const consentValue = cookieConsent.ads ? 'granted' : 'denied';
        win.gtag('consent', 'update', {
          ad_storage: consentValue,
          ad_user_data: consentValue,
          ad_personalization: consentValue,
          analytics_storage: 'denied',
        });
      }
    } catch {
      // ignore
    }
  }, [profile.isPremium, activeGame, cookieConsent]);

  // Audio settings sync
  useEffect(() => {
    sound.setSoundEnabled(settings.soundEnabled);
    sound.setMusicEnabled(settings.musicEnabled);
  }, [settings.soundEnabled, settings.musicEnabled]);

  // Persist Profile
  useEffect(() => {
    try {
      localStorage.setItem('maths_pro_profile_v2', JSON.stringify(profile));
    } catch {
      // storage full / disabled
    }
  }, [profile]);

  // Persist Settings
  useEffect(() => {
    try {
      localStorage.setItem('maths_pro_settings_v2', JSON.stringify(settings));
    } catch {
      // storage full / disabled
    }
  }, [settings]);

  const t = (key: string): string => {
    const lang = settings.language;
    const dict = translations[lang] as Record<string, string>;
    const fallback = translations['fr'] as Record<string, string>;
    return dict?.[key] || fallback?.[key] || key;
  };

  const startNewGame = (
    operation: OperationType,
    mode: GameMode,
    difficulty?: DifficultyLevel,
    stage?: number
  ) => {
    sound.playClick();
    clearExitArm();
    ensureHistoryGuard('/');
    const resolvedStage =
      stage !== undefined
        ? Math.max(1, stage)
        : difficulty !== undefined
        ? getStageForDifficulty(difficulty)
        : Math.max(1, profile.stageByOperation?.[operation] || 1);
    const finalDiff = difficulty || getDifficultyForStage(resolvedStage);
    const targetScore = getTargetScoreForStage(resolvedStage);
    setActiveResult(null);
    setActiveGame({
      operation,
      mode,
      difficulty: finalDiff,
      stage: resolvedStage,
      targetScore,
    });
  };

  const startNextStage = (operation: OperationType, mode: GameMode, currentStage: number) => {
    const nextStage = Math.max(1, currentStage + 1);
    const nextDiff = getDifficultyForStage(nextStage);
    startNewGame(operation, mode, nextDiff, nextStage);
  };

  const quitActiveGame = () => {
    sound.playClick();
    clearExitArm();
    setActiveGame(null);
    setActiveResult(null);
    setActiveInfoPage(null);
    setActiveTabState('home');
  };

  const finishGame = (result: GameResult) => {
    setActiveGame(null);
    setActiveResult(result);

    setProfile((prev) => {
      const prevStat = prev.statsByOperation[result.operation] || {
        played: 0,
        correct: 0,
        total: 0,
        bestScore: 0,
        stars: 0,
      };

      const newPlayed = prevStat.played + 1;
      const newCorrect = prevStat.correct + result.correctCount;
      const newTotal = prevStat.total + result.totalQuestions;
      const newBestScore = Math.max(prevStat.bestScore, result.score);
      const newOpStars = Math.max(prevStat.stars, result.starsEarned);

      const multiplier = prev.isPremium ? 2 : 1;
      const totalEarnedXp = result.xpEarned * multiplier;
      const newXp = prev.xp + totalEarnedXp;
      const newCoins = prev.coins + Math.floor(result.score / 10);
      const newLevel = Math.floor(newXp / 250) + 1;
      const newXpToNext = newLevel * 250;

      if (newLevel > prev.level) {
        sound.playLevelUp();
      }

      // Check badges
      const unlocked = [...prev.unlockedBadges];
      BADGES.forEach((b) => {
        if (!unlocked.includes(b.id)) {
          if (b.condition === 'first_game') unlocked.push(b.id);
          if (b.condition === 'accuracy_100' && result.accuracy === 100 && result.totalQuestions >= 10) unlocked.push(b.id);
          if (b.condition === 'timed_10' && result.mode === 'timed' && result.correctCount >= 10) unlocked.push(b.id);
          if (b.condition === 'mult_25' && result.operation === 'multiplication' && newCorrect >= 25) unlocked.push(b.id);
          if (b.condition === 'div_20' && result.operation === 'division' && newCorrect >= 20) unlocked.push(b.id);
          if (b.condition === 'survival_15' && result.mode === 'survival' && result.correctCount >= 15) unlocked.push(b.id);
          if (b.condition === 'stars_15' && prev.totalStars + result.starsEarned >= 15) unlocked.push(b.id);
          if (b.condition === 'total_100' && newTotal >= 100) unlocked.push(b.id);
        }
      });

      const currentSavedStage = prev.stageByOperation?.[result.operation] || 1;
      const nextUnlockedStage = result.isVictory
        ? Math.max(currentSavedStage, (result.stage || currentSavedStage) + 1)
        : currentSavedStage;

      return {
        ...prev,
        level: newLevel,
        xp: newXp,
        xpToNextLevel: newXpToNext,
        coins: newCoins + (result.isVictory ? 15 : 0),
        totalStars: prev.totalStars + result.starsEarned,
        unlockedBadges: unlocked,
        statsByOperation: {
          ...prev.statsByOperation,
          [result.operation]: {
            played: newPlayed,
            correct: newCorrect,
            total: newTotal,
            bestScore: newBestScore,
            stars: newOpStars,
          },
        },
        stageByOperation: {
          ...(prev.stageByOperation || {}),
          [result.operation]: nextUnlockedStage,
        },
        gameHistory: [result, ...prev.gameHistory.slice(0, 19)],
      };
    });
  };

  const closeResultScreen = () => {
    sound.playClick();
    setActiveResult(null);
  };

  const claimDailyReward = () => {
    if (profile.dailyRewardClaimed) return;
    sound.playLevelUp();
    setProfile((prev) => ({
      ...prev,
      xp: prev.xp + 50,
      coins: prev.coins + 30,
      dailyRewardClaimed: true,
      streakDays: prev.streakDays + 1,
    }));
  };

  const updateSettings = (partial: Partial<AppSettings>) => {
    sound.playClick();
    setSettings((prev) => ({ ...prev, ...partial }));
  };

  const updateProfileName = (name: string) => {
    sound.playClick();
    setProfile((prev) => ({ ...prev, name: name.trim() || 'Champion des Maths' }));
  };

  const updateAvatar = (avatarId: string) => {
    sound.playClick();
    setProfile((prev) => ({ ...prev, avatarId }));
  };

  const togglePremium = (active?: boolean) => {
    sound.playVictory();
    setProfile((prev) => ({
      ...prev,
      isPremium: active !== undefined ? active : !prev.isPremium,
    }));
  };

  const resetAllData = () => {
    sound.playClick();
    setProfile(defaultProfile);
    setSettings(defaultSettings);
    localStorage.removeItem('maths_pro_profile_v2');
    localStorage.removeItem('maths_pro_settings_v2');
  };

  const doubleLastGameXp = () => {
    if (!activeResult) return;
    sound.playVictory();
    const bonusXp = activeResult.xpEarned;
    setProfile((prev) => ({
      ...prev,
      xp: prev.xp + bonusXp,
    }));
    setActiveResult((prev) => (prev ? { ...prev, xpEarned: prev.xpEarned * 2 } : null));
  };

  const acceptAllCookies = () => {
    setCookieConsent({
      decided: true,
      essential: true,
      ads: true,
      updatedAt: new Date().toISOString(),
    });
    setIsCookieModalOpen(false);
  };

  const rejectOptionalCookies = () => {
    setCookieConsent({
      decided: true,
      essential: true,
      ads: false,
      updatedAt: new Date().toISOString(),
    });
    setIsCookieModalOpen(false);
  };

  const saveCustomCookieConsent = (allowAds: boolean) => {
    setCookieConsent({
      decided: true,
      essential: true,
      ads: allowAds,
      updatedAt: new Date().toISOString(),
    });
    setIsCookieModalOpen(false);
  };

  return (
    <MathContext.Provider
      value={{
        profile,
        settings,
        cookieConsent,
        activeTab,
        activeInfoPage,
        activeGame,
        activeResult,
        isSettingsOpen,
        isPremiumOpen,
        isAdOpen,
        isPlayStoreOpen,
        isCookieModalOpen,
        showExitPrompt,
        setActiveTab,
        startNewGame,
        startNextStage,
        quitActiveGame,
        finishGame,
        closeResultScreen,
        claimDailyReward,
        updateSettings,
        updateProfileName,
        updateAvatar,
        togglePremium,
        resetAllData,
        openSettings: () => setIsSettingsOpen(true),
        closeSettings: () => setIsSettingsOpen(false),
        openPremium: () => setIsPremiumOpen(true),
        closePremium: () => setIsPremiumOpen(false),
        openPlayStore: () => setIsPlayStoreOpen(true),
        closePlayStore: () => setIsPlayStoreOpen(false),
        openPrivacy: () => navigateInfoPage('privacy'),
        openAbout: () => navigateInfoPage('about'),
        openContact: () => navigateInfoPage('contact'),
        openTerms: () => navigateInfoPage('terms'),
        openLegalNotice: () => navigateInfoPage('legal'),
        openLessons: () => navigateInfoPage('lessons'),
        goHome,
        openAdModal: () => setIsAdOpen(true),
        closeAdModal: () => setIsAdOpen(false),
        openCookieModal: () => setIsCookieModalOpen(true),
        closeCookieModal: () => setIsCookieModalOpen(false),
        acceptAllCookies,
        rejectOptionalCookies,
        saveCustomCookieConsent,
        doubleLastGameXp,
        t,
      }}
    >
      {children}
    </MathContext.Provider>
  );
};

export const useMathApp = () => {
  const context = useContext(MathContext);
  if (!context) throw new Error('useMathApp must be used within MathProvider');
  return context;
};
