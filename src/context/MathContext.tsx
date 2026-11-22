import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppSettings, DifficultyLevel, GameMode, GameResult, OperationType, UserProfile } from '../types/math';
import { sound } from '../utils/audio';
import { BADGES } from '../utils/constants';
import { getDifficultyForStage, getStageForDifficulty, getTargetScoreForStage } from '../utils/progression';
import { translations } from '../utils/translations';

export type InfoPageType = 'privacy' | 'about' | 'contact' | null;

const getInfoPageFromPath = (pathname: string): InfoPageType => {
  const clean = pathname.toLowerCase().replace(/\/+$/, '') || '/';
  if (clean === '/confidentialite' || clean === '/privacy') return 'privacy';
  if (clean === '/a-propos' || clean === '/about') return 'about';
  if (clean === '/contact') return 'contact';
  return null;
};

const getPathFromInfoPage = (page: InfoPageType): string => {
  if (page === 'privacy') return '/confidentialite';
  if (page === 'about') return '/a-propos';
  if (page === 'contact') return '/contact';
  return '/';
};

interface MathContextType {
  profile: UserProfile;
  settings: AppSettings;
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
  goHome: () => void;
  openAdModal: () => void;
  closeAdModal: () => void;
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

  // Sync browser back/forward navigation with info pages
  useEffect(() => {
    const handlePopState = () => {
      setActiveInfoPage(getInfoPageFromPath(window.location.pathname));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateInfoPage = (page: InfoPageType) => {
    setActiveInfoPage(page);
    try {
      const targetPath = getPathFromInfoPage(page);
      if (window.location.pathname !== targetPath) {
        window.history.pushState({ infoPage: page }, '', targetPath);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      // ignore
    }
  };

  const setActiveTab = (tab: 'home' | 'games' | 'challenges' | 'leaderboard' | 'profile') => {
    setActiveTabState(tab);
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

  // Sync document language
  useEffect(() => {
    document.documentElement.lang = settings.language;
  }, [settings.language]);

  // Enforce AdSense suppression during VIP mode or active gameplay
  useEffect(() => {
    const disableAds = profile.isPremium || !!activeGame;
    document.documentElement.setAttribute('data-ads-disabled', disableAds ? 'true' : 'false');
    try {
      const win = window as unknown as { adsbygoogle?: { pauseAdRequests?: number } & unknown[] };
      win.adsbygoogle = win.adsbygoogle || [];
      win.adsbygoogle.pauseAdRequests = disableAds ? 1 : 0;
    } catch {
      // ignore
    }
  }, [profile.isPremium, activeGame]);

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
    setActiveGame(null);
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

  return (
    <MathContext.Provider
      value={{
        profile,
        settings,
        activeTab,
        activeInfoPage,
        activeGame,
        activeResult,
        isSettingsOpen,
        isPremiumOpen,
        isAdOpen,
        isPlayStoreOpen,
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
        goHome,
        openAdModal: () => setIsAdOpen(true),
        closeAdModal: () => setIsAdOpen(false),
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
