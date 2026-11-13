import React, { useState } from 'react';
import {
  BookOpen,
  Clock,
  Target,
  GraduationCap,
  ShieldAlert,
  Play,
  Star,
  Zap,
  Sliders,
} from 'lucide-react';
import { useMathApp } from '../context/MathContext';
import { DifficultyLevel, GameMode, OperationType } from '../types/math';
import { sound } from '../utils/audio';
import { OPERATIONS_METADATA } from '../utils/constants';

export const GamesTab: React.FC = () => {
  const {
    settings,
    profile,
    startNewGame,
    updateSettings,
    t,
  } = useMathApp();

  const [selectedMode, setSelectedMode] = useState<GameMode>('learning');
  const [selectedDiff, setSelectedDiff] = useState<DifficultyLevel>(settings.selectedDifficulty);

  const modes: { mode: GameMode; icon: React.ReactNode; labelKey: string; descKey: string }[] = [
    {
      mode: 'learning',
      icon: <BookOpen className="w-4 h-4" />,
      labelKey: 'learning',
      descKey: 'desc_mode_learning',
    },
    {
      mode: 'timed',
      icon: <Clock className="w-4 h-4" />,
      labelKey: 'timed',
      descKey: 'desc_mode_timed',
    },
    {
      mode: 'challenge',
      icon: <Target className="w-4 h-4" />,
      labelKey: 'challenge',
      descKey: 'desc_mode_challenge',
    },
    {
      mode: 'exam',
      icon: <GraduationCap className="w-4 h-4" />,
      labelKey: 'exam',
      descKey: 'desc_mode_exam',
    },
    {
      mode: 'survival',
      icon: <ShieldAlert className="w-4 h-4 text-rose-500" />,
      labelKey: 'survival',
      descKey: 'desc_mode_survival',
    },
  ];

  const difficulties: DifficultyLevel[] = ['beginner', 'easy', 'medium', 'hard', 'expert'];

  const handleLaunchGame = (op: OperationType) => {
    sound.playClick();
    startNewGame(op, selectedMode, selectedDiff);
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Title Header */}
      <div className="px-1">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white font-display">
          {t('navGames')}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Sélectionne un mode, un niveau et ton opération favorite
        </p>
      </div>

      {/* 1. Mode Selector Segmented Controls */}
      <div className="rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 p-4 shadow-xs">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-2.5">
          1. Choisis ton mode de jeu
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {modes.map((item) => (
            <button
              key={item.mode}
              onClick={() => {
                sound.playClick();
                setSelectedMode(item.mode);
              }}
              className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all active:scale-95 ${
                selectedMode === item.mode
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                  : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-indigo-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={selectedMode === item.mode ? 'text-white' : 'text-indigo-600 dark:text-indigo-400'}>
                  {item.icon}
                </span>
                {selectedMode === item.mode && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                )}
              </div>
              <span className="text-xs font-extrabold capitalize">
                {t(item.labelKey)}
              </span>
            </button>
          ))}
        </div>

        {/* Selected Mode Summary */}
        <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between gap-2">
          <p className="flex-1 text-[11px]">
            {t(modes.find((m) => m.mode === selectedMode)?.descKey || '')}
          </p>
          {selectedMode === 'timed' && (
            <div className="flex items-center gap-1 shrink-0">
              {[30, 60, 120].map((sec) => (
                <button
                  key={sec}
                  onClick={() => updateSettings({ timedDuration: sec as 30 | 60 | 120 })}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                    settings.timedDuration === sec
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {sec}s
                </button>
              ))}
            </div>
          )}
          {selectedMode === 'exam' && (
            <div className="flex items-center gap-1 shrink-0">
              {[10, 20, 50].map((qCount) => (
                <button
                  key={qCount}
                  onClick={() => updateSettings({ examQuestionsCount: qCount as 10 | 20 | 50 })}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                    settings.examQuestionsCount === qCount
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {qCount}Q
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 2. Difficulty Level Selector */}
      <div className="rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 p-4 shadow-xs">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-2.5">
          2. Niveau de difficulté
        </span>

        <div className="grid grid-cols-5 gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80">
          {difficulties.map((diff) => (
            <button
              key={diff}
              onClick={() => {
                sound.playClick();
                setSelectedDiff(diff);
                updateSettings({ selectedDifficulty: diff });
              }}
              className={`py-2 px-1 text-center text-xs font-bold rounded-lg transition-colors capitalize ${
                selectedDiff === diff
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t(diff)}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Operations Catalog */}
      <div>
        <div className="mb-3 px-1">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            3. Choisis une opération et commence !
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {OPERATIONS_METADATA.map((op) => {
            const stat = profile.statsByOperation[op.type] || { played: 0, correct: 0, bestScore: 0, stars: 0 };

            return (
              <div
                key={op.type}
                onClick={() => handleLaunchGame(op.type)}
                className="group p-4 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 flex items-center justify-between gap-3 cursor-pointer shadow-xs hover:shadow-md transition-all active:scale-98"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${op.gradient} text-white flex items-center justify-center font-bold text-xl shadow-xs group-hover:scale-105 transition-transform`}
                  >
                    {op.symbol}
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white font-display">
                      {t(op.titleKey)}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                      <span>{stat.correct} résolus</span>
                      <span>·</span>
                      <div className="flex items-center">
                        {[1, 2, 3].map((s) => (
                          <Star
                            key={s}
                            className={`w-3 h-3 ${
                              s <= stat.stars ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-slate-600'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
