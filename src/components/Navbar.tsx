import React from 'react';
import {
  Flame,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Settings as SettingsIcon,
  Crown,
  Home,
  Gamepad2,
  Trophy,
  BarChart2,
  User,
  Sparkles,
} from 'lucide-react';
import { useMathApp } from '../context/MathContext';
import { sound } from '../utils/audio';

export const Navbar: React.FC = () => {
  const {
    profile,
    settings,
    activeTab,
    setActiveTab,
    updateSettings,
    openSettings,
    openPremium,
    t,
  } = useMathApp();

  const handleTabClick = (tab: typeof activeTab) => {
    sound.playClick();
    setActiveTab(tab);
  };

  const toggleSound = () => {
    sound.playClick();
    updateSettings({ soundEnabled: !settings.soundEnabled });
  };

  const toggleTheme = () => {
    sound.playClick();
    updateSettings({ darkMode: !settings.darkMode });
  };

  const toggleLang = () => {
    sound.playClick();
    updateSettings({ language: settings.language === 'fr' ? 'en' : 'fr' });
  };

  return (
    <>
      {/* Top Mobile & Desktop Bar */}
      <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
        <div className="max-w-5xl mx-auto px-4 h-15 flex items-center justify-between gap-3">
          {/* Brand Logo */}
          <div
            onClick={() => handleTabClick('home')}
            className="flex items-center gap-2.5 cursor-pointer group select-none shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-500 flex items-center justify-center text-white font-black text-lg shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform overflow-hidden">
              <img
                src="/pwa-192x192.png"
                alt="MATHS PRO"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white font-display">
                  MATHS <span className="text-indigo-600 dark:text-indigo-400">PRO</span>
                </span>
                {profile.isPremium && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 font-bold uppercase tracking-wider shadow-xs">
                    VIP
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium -mt-1 hidden sm:inline">
                {settings.language === 'fr' ? 'Jeux de Mathématiques' : 'Mathematics Games'}
              </span>
            </div>
          </div>

          {/* Quick Stats Badges */}
          <div className="flex items-center gap-2 text-xs font-semibold">
            {/* Streak */}
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-200/80 dark:border-orange-800/60 text-orange-600 dark:text-orange-400">
              <Flame className="w-3.5 h-3.5 fill-orange-500" />
              <span className="tabular-nums font-bold">{profile.streakDays}</span>
              <span className="text-[10px] hidden xs:inline">{t('streakDays')}</span>
            </div>

            {/* Level & XP */}
            <div
              onClick={() => handleTabClick('profile')}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/60 text-indigo-600 dark:text-indigo-400 cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors"
            >
              <span className="text-[11px] font-bold">Nv.{profile.level}</span>
              <div className="w-12 h-1.5 rounded-full bg-indigo-200 dark:bg-indigo-800/80 overflow-hidden hidden sm:block">
                <div
                  className="h-full bg-indigo-600 dark:bg-indigo-400 rounded-full"
                  style={{ width: `${Math.min(100, ((profile.xp % 250) / 250) * 100)}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 hidden md:inline">
                {profile.xp} XP
              </span>
            </div>

            {/* Premium Button if not premium */}
            {!profile.isPremium ? (
              <button
                onClick={openPremium}
                className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-xs shadow-xs hover:brightness-105 transition-transform active:scale-95"
              >
                <Crown className="w-3.5 h-3.5" />
                <span>VIP</span>
              </button>
            ) : null}
          </div>

          {/* Quick Utility Toggles */}
          <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
            {/* Language switch */}
            <button
              onClick={toggleLang}
              title="Changer de langue / Switch language"
              className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-colors"
            >
              {settings.language === 'fr' ? '🇫🇷' : '🇬🇧'}
            </button>

            {/* Sound toggle */}
            <button
              onClick={toggleSound}
              title={settings.soundEnabled ? 'Son activé' : 'Son désactivé'}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-colors"
            >
              {settings.soundEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              title={settings.darkMode ? 'Mode clair' : 'Mode sombre'}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-colors"
            >
              {settings.darkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {/* Settings button */}
            <button
              onClick={openSettings}
              title={t('settingsTitle')}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-colors"
            >
              <SettingsIcon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            </button>
          </div>
        </div>
      </header>

      {/* Fixed Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200/80 dark:border-slate-800/80 shadow-lg">
        <div className="max-w-lg mx-auto grid grid-cols-5 h-16 px-1">
          {/* ACCUEIL */}
          <button
            onClick={() => handleTabClick('home')}
            className={`flex flex-col items-center justify-center min-h-[48px] py-1 transition-all ${
              activeTab === 'home'
                ? 'text-indigo-600 dark:text-indigo-400 font-bold scale-105'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-medium'
            }`}
          >
            <div className="relative">
              <Home className={`w-5 h-5 ${activeTab === 'home' ? 'stroke-[2.5]' : 'stroke-2'}`} />
              {activeTab === 'home' && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
              )}
            </div>
            <span className="text-[11px] mt-1 tracking-tight">{t('navHome')}</span>
          </button>

          {/* JEUX */}
          <button
            onClick={() => handleTabClick('games')}
            className={`flex flex-col items-center justify-center min-h-[48px] py-1 transition-all ${
              activeTab === 'games'
                ? 'text-indigo-600 dark:text-indigo-400 font-bold scale-105'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-medium'
            }`}
          >
            <div className="relative">
              <Gamepad2 className={`w-5 h-5 ${activeTab === 'games' ? 'stroke-[2.5]' : 'stroke-2'}`} />
              {activeTab === 'games' && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
              )}
            </div>
            <span className="text-[11px] mt-1 tracking-tight">{t('navGames')}</span>
          </button>

          {/* DÉFIS */}
          <button
            onClick={() => handleTabClick('challenges')}
            className={`flex flex-col items-center justify-center min-h-[48px] py-1 transition-all ${
              activeTab === 'challenges'
                ? 'text-indigo-600 dark:text-indigo-400 font-bold scale-105'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-medium'
            }`}
          >
            <div className="relative">
              <Trophy className={`w-5 h-5 ${activeTab === 'challenges' ? 'stroke-[2.5]' : 'stroke-2'}`} />
              {activeTab === 'challenges' && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
              )}
            </div>
            <span className="text-[11px] mt-1 tracking-tight">{t('navChallenges')}</span>
          </button>

          {/* CLASSEMENT */}
          <button
            onClick={() => handleTabClick('leaderboard')}
            className={`flex flex-col items-center justify-center min-h-[48px] py-1 transition-all ${
              activeTab === 'leaderboard'
                ? 'text-indigo-600 dark:text-indigo-400 font-bold scale-105'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-medium'
            }`}
          >
            <div className="relative">
              <BarChart2 className={`w-5 h-5 ${activeTab === 'leaderboard' ? 'stroke-[2.5]' : 'stroke-2'}`} />
              {activeTab === 'leaderboard' && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
              )}
            </div>
            <span className="text-[11px] mt-1 tracking-tight">{t('navLeaderboard')}</span>
          </button>

          {/* PROFIL */}
          <button
            onClick={() => handleTabClick('profile')}
            className={`flex flex-col items-center justify-center min-h-[48px] py-1 transition-all ${
              activeTab === 'profile'
                ? 'text-indigo-600 dark:text-indigo-400 font-bold scale-105'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-medium'
            }`}
          >
            <div className="relative">
              <User className={`w-5 h-5 ${activeTab === 'profile' ? 'stroke-[2.5]' : 'stroke-2'}`} />
              {activeTab === 'profile' && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
              )}
            </div>
            <span className="text-[11px] mt-1 tracking-tight">{t('navProfile')}</span>
          </button>
        </div>
      </nav>
    </>
  );
};
