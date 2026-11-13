import React, { useState } from 'react';
import {
  Edit3,
  Award,
  CheckCircle2,
  Percent,
  Gamepad2,
  Star,
  Flame,
  Crown,
  History,
  Check,
  ChevronRight,
} from 'lucide-react';
import { useMathApp } from '../context/MathContext';
import { AVATARS, BADGES, OPERATIONS_METADATA } from '../utils/constants';
import { sound } from '../utils/audio';

export const ProfileTab: React.FC = () => {
  const {
    profile,
    updateProfileName,
    updateAvatar,
    openPremium,
    t,
  } = useMathApp();

  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(profile.name);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  const currentAvatar = AVATARS.find((a) => a.id === profile.avatarId) || AVATARS[0];

  // Global calculations
  let totalProblems = 0;
  let totalCorrect = 0;
  let totalGamesCount = 0;

  Object.values(profile.statsByOperation).forEach((stat) => {
    totalProblems += stat.total;
    totalCorrect += stat.correct;
    totalGamesCount += stat.played;
  });

  const overallAccuracy = totalProblems > 0 ? Math.round((totalCorrect / totalProblems) * 100) : 100;

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileName(nameInput);
    setIsEditingName(false);
  };

  const handleSelectAvatar = (avatarId: string, isPremium?: boolean) => {
    if (isPremium && !profile.isPremium) {
      sound.playClick();
      openPremium();
      return;
    }
    updateAvatar(avatarId);
    setIsAvatarModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Profile Header Card */}
      <div className="rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex items-center gap-4">
          {/* Avatar button */}
          <div className="relative cursor-pointer group" onClick={() => setIsAvatarModalOpen(true)}>
            <div
              className={`w-20 h-20 rounded-3xl flex items-center justify-center text-4xl shadow-md border-2 ${currentAvatar.bgColor} group-hover:scale-105 transition-transform`}
            >
              <span>{currentAvatar.emoji}</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Edit3 className="w-3 h-3" />
            </div>
          </div>

          {/* Name & Title */}
          <div className="flex-1">
            {isEditingName ? (
              <form onSubmit={handleSaveName} className="flex items-center gap-2">
                <input
                  type="text"
                  maxLength={24}
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-indigo-400 bg-white dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-white w-full max-w-[200px] outline-none"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-xs active:scale-95"
                >
                  <Check className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900 dark:text-white font-display">
                  {profile.name}
                </h2>
                <button
                  onClick={() => {
                    setNameInput(profile.name);
                    setIsEditingName(true);
                  }}
                  className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Niveau {profile.level} · {currentAvatar.description.fr}
            </p>

            <div className="flex items-center gap-3 mt-2 text-xs font-semibold">
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                {profile.xp} XP
              </span>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <span className="text-amber-500 flex items-center gap-1 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-500" />
                {profile.totalStars}
              </span>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <span className="text-orange-500 flex items-center gap-1 font-bold">
                <Flame className="w-3.5 h-3.5 fill-orange-500" />
                {profile.streakDays}j
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 text-center shadow-xs">
          <Gamepad2 className="w-5 h-5 text-indigo-500 mx-auto mb-1" />
          <div className="text-xl font-black text-slate-900 dark:text-white font-mono tabular-nums">
            {totalGamesCount}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            {t('totalGames')}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 text-center shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
          <div className="text-xl font-black text-slate-900 dark:text-white font-mono tabular-nums">
            {totalCorrect}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            {t('totalCorrect')}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 text-center shadow-xs">
          <Percent className="w-5 h-5 text-cyan-500 mx-auto mb-1" />
          <div className="text-xl font-black text-slate-900 dark:text-white font-mono tabular-nums">
            {overallAccuracy}%
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            {t('globalAccuracy')}
          </span>
        </div>
      </div>

      {/* Trophées & Badges Showcase */}
      <div className="rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white font-display">
              {t('trophies')}
            </h3>
          </div>
          <span className="text-xs font-bold text-slate-400">
            {profile.unlockedBadges.length} / {BADGES.length}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {BADGES.map((badge) => {
            const isUnlocked = profile.unlockedBadges.includes(badge.id);

            return (
              <div
                key={badge.id}
                className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-center transition-all ${
                  isUnlocked
                    ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800 opacity-40 grayscale'
                }`}
                title={badge.description.fr}
              >
                <div className="text-2xl mb-1 drop-shadow-sm">{badge.icon}</div>
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-tight line-clamp-1">
                  {badge.title.fr}
                </span>
                <span className="text-[9px] text-slate-400 mt-0.5 line-clamp-1">
                  {isUnlocked ? '✓ Débloqué' : badge.description.fr}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Operations Stats */}
      <div className="rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs">
        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white font-display mb-3">
          {t('statsPerOp')}
        </h3>

        <div className="space-y-3">
          {OPERATIONS_METADATA.map((op) => {
            const stat = profile.statsByOperation[op.type] || { played: 0, correct: 0, total: 0, stars: 0, bestScore: 0 };
            const opAccuracy = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;

            return (
              <div key={op.type} className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs shrink-0">
                  {op.symbol}
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="text-slate-800 dark:text-slate-200">
                      {t(op.titleKey)}
                    </span>
                    <span className="text-slate-500 font-mono text-[11px]">
                      {stat.correct}/{stat.total} ({opAccuracy}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${op.gradient} rounded-full`}
                      style={{ width: `${opAccuracy}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Match History */}
      <div className="rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <History className="w-5 h-5 text-indigo-500" />
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white font-display">
            {t('historyTitle')}
          </h3>
        </div>

        {profile.gameHistory.length === 0 ? (
          <p className="text-xs text-slate-400 py-3 text-center">
            {t('noHistory')}
          </p>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {profile.gameHistory.map((game) => (
              <div key={game.id} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-800 dark:text-slate-200 capitalize">
                    {t(game.operation)} · {t(game.mode)}
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {game.date} · {game.accuracy}% de réussite
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    +{game.score} pts
                  </span>
                  <div className="text-[10px] text-emerald-500 font-semibold">
                    +{game.xpEarned} XP
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Avatar Selection Modal */}
      {isAvatarModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white dark:bg-slate-850 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-700 animate-fadeIn">
            <h3 className="text-lg font-black text-slate-900 dark:text-white font-display mb-1 text-center">
              {t('changeAvatar')}
            </h3>
            <p className="text-xs text-slate-400 text-center mb-5">
              Choisis ton identité mathématique
            </p>

            <div className="grid grid-cols-4 gap-3">
              {AVATARS.map((avatar) => {
                const isSelected = profile.avatarId === avatar.id;
                const isLocked = avatar.isPremium && !profile.isPremium;

                return (
                  <button
                    key={avatar.id}
                    onClick={() => handleSelectAvatar(avatar.id, avatar.isPremium)}
                    className={`relative p-3 rounded-2xl border flex flex-col items-center justify-center transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 ring-2 ring-indigo-500/30 scale-105'
                        : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                    }`}
                  >
                    <span className="text-3xl mb-1">{avatar.emoji}</span>
                    <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 truncate w-full text-center">
                      {avatar.name.split(' ')[0]}
                    </span>
                    {avatar.isPremium && (
                      <span className="absolute -top-1.5 -right-1.5 px-1 py-0.2 rounded-full bg-amber-500 text-white text-[8px] font-black uppercase">
                        VIP
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setIsAvatarModalOpen(false)}
              className="mt-6 w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
