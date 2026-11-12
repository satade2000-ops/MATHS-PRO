import React, { useState } from 'react';
import { Trophy, Medal, Crown, Flame, Star, Sparkles } from 'lucide-react';
import { useMathApp } from '../context/MathContext';
import { INITIAL_LEADERBOARD, LeaderboardUser } from '../utils/constants';

export const LeaderboardTab: React.FC = () => {
  const { profile, t } = useMathApp();
  const [activeFilter, setActiveFilter] = useState<'weekly' | 'alltime'>('weekly');

  // Insert current user into leaderboard dynamically
  const userEntry: LeaderboardUser = {
    id: 'user_player',
    name: `${profile.name} (Toi)`,
    avatarEmoji: '🧙‍♂️',
    score: profile.xp,
    level: profile.level,
    country: '🇫🇷',
    league: 'Or',
  };

  const fullList = [...INITIAL_LEADERBOARD, userEntry].sort((a, b) => b.score - a.score);
  const userRank = fullList.findIndex((item) => item.id === 'user_player') + 1;

  const top3 = fullList.slice(0, 3);
  const rest = fullList.slice(3);

  return (
    <div className="space-y-6 pb-24">
      {/* Title */}
      <div className="px-1">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white font-display">
          {t('leaderboardTitle')}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {t('leaderboardSubtitle')}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl max-w-xs">
        <button
          onClick={() => setActiveFilter('weekly')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${
            activeFilter === 'weekly'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Hebdomadaire
        </button>
        <button
          onClick={() => setActiveFilter('alltime')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${
            activeFilter === 'alltime'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Général
        </button>
      </div>

      {/* Current Player Rank Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white p-4 flex items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-black text-lg">
            #{userRank}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-extrabold">{profile.name}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 font-bold uppercase">
                Ligue Or
              </span>
            </div>
            <p className="text-xs text-indigo-100">
              {profile.xp} XP au compteur
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-indigo-200 uppercase font-semibold block">
            Position
          </span>
          <span className="text-sm font-black font-mono">Top {Math.min(99, Math.round((userRank / fullList.length) * 100))}%</span>
        </div>
      </div>

      {/* Podium Top 3 */}
      <div className="grid grid-cols-3 gap-2 pt-6 pb-2 items-end">
        {/* 2nd Place */}
        {top3[1] && (
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-2xl shadow-sm mb-1.5 border-2 border-slate-300">
              {top3[1].avatarEmoji}
            </div>
            <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[90px]">
              {top3[1].name}
            </span>
            <span className="text-[10px] text-slate-500 font-mono font-semibold">
              {top3[1].score} pts
            </span>
            <div className="w-full h-18 mt-2 rounded-t-2xl bg-slate-200 dark:bg-slate-750 flex flex-col items-center justify-center border-t-2 border-slate-300">
              <span className="font-black text-slate-700 dark:text-slate-300 text-lg">2</span>
              <Medal className="w-4 h-4 text-slate-400" />
            </div>
          </div>
        )}

        {/* 1st Place */}
        {top3[0] && (
          <div className="flex flex-col items-center">
            <div className="relative">
              <Crown className="w-5 h-5 text-amber-500 fill-amber-400 absolute -top-4 left-1/2 -translate-x-1/2 animate-bounce" />
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-400 text-white flex items-center justify-center text-3xl shadow-md mb-1.5 border-2 border-amber-300">
                {top3[0].avatarEmoji}
              </div>
            </div>
            <span className="text-xs font-extrabold text-slate-900 dark:text-white truncate max-w-[100px]">
              {top3[0].name}
            </span>
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-mono font-bold">
              {top3[0].score} pts
            </span>
            <div className="w-full h-24 mt-2 rounded-t-2xl bg-gradient-to-b from-amber-200 to-amber-100 dark:from-amber-950/60 dark:to-amber-900/40 flex flex-col items-center justify-center border-t-2 border-amber-400">
              <span className="font-black text-amber-800 dark:text-amber-200 text-2xl">1</span>
              <Trophy className="w-5 h-5 text-amber-500" />
            </div>
          </div>
        )}

        {/* 3rd Place */}
        {top3[2] && (
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center text-2xl shadow-sm mb-1.5 border-2 border-amber-300">
              {top3[2].avatarEmoji}
            </div>
            <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[90px]">
              {top3[2].name}
            </span>
            <span className="text-[10px] text-slate-500 font-mono font-semibold">
              {top3[2].score} pts
            </span>
            <div className="w-full h-14 mt-2 rounded-t-2xl bg-amber-100 dark:bg-amber-950/40 flex flex-col items-center justify-center border-t-2 border-amber-300">
              <span className="font-black text-amber-700 dark:text-amber-300 text-lg">3</span>
              <Medal className="w-4 h-4 text-amber-600" />
            </div>
          </div>
        )}
      </div>

      {/* Rest of the List */}
      <div className="rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden shadow-xs">
        {rest.map((user, idx) => {
          const rank = idx + 4;
          const isMe = user.id === 'user_player';

          return (
            <div
              key={user.id}
              className={`p-3.5 flex items-center justify-between transition-colors ${
                isMe ? 'bg-indigo-50/80 dark:bg-indigo-950/50 font-bold' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-6 text-center font-mono font-bold text-xs text-slate-400">
                  {rank}
                </span>
                <span className="text-xl">{user.avatarEmoji}</span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {user.name}
                    </span>
                    <span className="text-xs">{user.country}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-normal">
                    Niveau {user.level} · {user.league}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono font-extrabold text-indigo-600 dark:text-indigo-400">
                  {user.score} pts
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
