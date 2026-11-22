import React from 'react';
import {
  Sparkles,
  Play,
  Gift,
  Flame,
  Star,
  Award,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { useMathApp } from '../context/MathContext';
import { sound } from '../utils/audio';
import { OPERATIONS_METADATA } from '../utils/constants';
import { getDifficultyForStage, getTargetScoreForStage } from '../utils/progression';
import { MascotEuler } from './MascotEuler';
import { AdSenseBanner } from './AdSenseBanner';
import { OperationType } from '../types/math';

export const HomeTab: React.FC = () => {
  const {
    profile,
    settings,
    startNewGame,
    claimDailyReward,
    setActiveTab,
    openPlayStore,
    t,
  } = useMathApp();

  const mainOperations = OPERATIONS_METADATA.filter((op) => op.isMain);
  const otherOperations = OPERATIONS_METADATA.filter((op) => !op.isMain);

  const handleStartOp = (type: OperationType) => {
    sound.playClick();
    const currentStage = Math.max(1, profile.stageByOperation?.[type] || 1);
    startNewGame(type, 'learning', getDifficultyForStage(currentStage), currentStage);
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Hero Card with Mascot & Player Progression */}
      <div className="relative rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 text-white p-5 sm:p-6 shadow-xl shadow-indigo-500/15 overflow-hidden">
        {/* Subtle decorative background shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-indigo-400/10 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-4">
          {/* Welcome row & Mascot */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <span className="text-xs font-semibold text-indigo-200 tracking-wide uppercase">
                {t('welcomeBack')}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white mt-0.5">
                {profile.name} 👋
              </h1>
              <p className="text-xs text-indigo-100/90 mt-1 max-w-sm">
                {t('slogan')}
              </p>
            </div>

            {/* Mascot Euler */}
            <div className="shrink-0">
              <MascotEuler size="md" mood="teaching" />
            </div>
          </div>

          {/* Level & XP Progress Bar */}
          <div className="pt-2 border-t border-white/10">
            <div className="flex items-center justify-between text-xs font-bold mb-1.5">
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-md bg-white/20 text-[11px]">
                  {t('playerLevel')} {profile.level}
                </span>
                <span className="text-indigo-200 font-normal">
                  · {profile.xp} XP au total
                </span>
              </div>
              <span className="text-amber-300 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-300" />
                <span className="tabular-nums font-bold">{profile.totalStars}</span>
              </span>
            </div>

            <div className="w-full h-3 rounded-full bg-black/20 overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${Math.min(100, ((profile.xp % 250) / 250) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Daily Reward / Streak Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 dark:from-amber-950/30 dark:via-orange-950/30 dark:to-amber-950/30 border border-amber-300/60 dark:border-amber-800/60 p-4 flex items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Gift className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                {t('dailyRewardTitle')}
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 font-extrabold">
                {profile.streakDays}j 🔥
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {profile.dailyRewardClaimed ? t('dailyRewardClaimed') : '+50 XP gratuits pour ta régularité !'}
            </p>
          </div>
        </div>

        <button
          onClick={claimDailyReward}
          disabled={profile.dailyRewardClaimed}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-transform active:scale-95 ${
            profile.dailyRewardClaimed
              ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-default'
              : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md hover:brightness-105'
          }`}
        >
          {profile.dailyRewardClaimed ? '✓ Récupéré' : t('dailyRewardClaim')}
        </button>
      </div>

      {/* SECTION 1 : LES QUATRE OPÉRATIONS PRINCIPALES */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white font-display">
              {t('mainOperations')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Entraîne-toi sur les bases fondamentales des mathématiques
            </p>
          </div>
          <button
            onClick={() => setActiveTab('games')}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5"
          >
            <span>Voir tout</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4 Big Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {mainOperations.map((op) => {
            const stat = profile.statsByOperation[op.type] || { played: 0, correct: 0, stars: 0 };
            const currentStage = Math.max(1, profile.stageByOperation?.[op.type] || 1);
            const stageDiff = getDifficultyForStage(currentStage);
            const stageGoal = getTargetScoreForStage(currentStage);

            return (
              <div
                key={op.type}
                className="group relative rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
              >
                {/* Subtle colored accent glow in top right */}
                <div
                  className={`absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-10 bg-gradient-to-br ${op.gradient} pointer-events-none group-hover:scale-125 transition-transform duration-500`}
                />

                <div>
                  {/* Top card header */}
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${op.gradient} text-white flex items-center justify-center font-black text-2xl shadow-md group-hover:scale-105 transition-transform`}
                    >
                      <span>{op.symbol}</span>
                    </div>

                    {/* Operation Stars from user performance */}
                    <div className="flex items-center gap-0.5 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 rounded-full border border-slate-200/60 dark:border-slate-700/60">
                      {[1, 2, 3].map((starIdx) => (
                        <Star
                          key={starIdx}
                          className={`w-3.5 h-3.5 ${
                            starIdx <= stat.stars
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-300 dark:text-slate-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Title, Stage & Description */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white font-display tracking-tight">
                      {t(op.titleKey)}
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 font-bold border border-indigo-200/60 dark:border-indigo-800/60">
                      {t('stageLabel')} {currentStage} · {t(stageDiff)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {t(op.descKey)}
                  </p>
                  <p className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1.5">
                    🎯 {t('goalLabel')} : {stageGoal} pts
                  </p>
                </div>

                {/* Bottom action row */}
                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <div className="text-[11px] text-slate-400 font-medium">
                    <strong className="text-slate-700 dark:text-slate-200 font-semibold">
                      {stat.correct}
                    </strong>{' '}
                    résolus
                  </div>

                  <button
                    onClick={() => handleStartOp(op.type)}
                    className={`px-4 py-2.5 rounded-xl bg-gradient-to-r ${op.gradient} text-white font-bold text-xs flex items-center gap-1.5 shadow-sm hover:brightness-105 active:scale-95 transition-all`}
                  >
                    <span>{t('playNow')}</span>
                    <Play className="w-3.5 h-3.5 fill-white" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2 : AUTRES EXERCICES */}
      <div>
        <div className="mb-3 px-1">
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white font-display">
            {t('otherExercises')}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Perfectionne ton esprit avec des modules avancés
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {otherOperations.map((op) => {
            const opStage = Math.max(1, profile.stageByOperation?.[op.type] || 1);
            return (
              <div
                key={op.type}
                onClick={() => handleStartOp(op.type)}
                className="p-3.5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all cursor-pointer flex flex-col justify-between group shadow-xs hover:shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${op.gradient} text-white flex items-center justify-center font-bold text-base shadow-xs group-hover:scale-105 transition-transform`}
                  >
                    {op.symbol}
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold">
                    P.{opStage}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white font-display">
                    {t(op.titleKey)}
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                    {t(op.descKey)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Google Play Store Export Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-indigo-500/10 border border-emerald-300/60 dark:border-emerald-800/60 p-4 flex items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center font-black text-xl shadow-xs shrink-0">
            📱
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 dark:text-white block">
              Prêt pour Google Play Store
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Package .aab, mode hors-ligne & Web Manifest configurés
            </span>
          </div>
        </div>

        <button
          onClick={openPlayStore}
          className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs whitespace-nowrap shadow-sm active:scale-95 transition-transform"
        >
          Voir l'Export
        </button>
      </div>

      {/* Pedagogical Mascot Wisdom Banner */}
      <div className="rounded-2xl bg-slate-50 dark:bg-slate-850/80 border border-slate-200/80 dark:border-slate-800 p-4">
        <MascotEuler
          size="sm"
          mood="celebrating"
          message={t('mascotTip')}
        />
      </div>

      {/* Discrete AdSense slot (hidden for Premium users) */}
      <AdSenseBanner placement="home" />
    </div>
  );
};
