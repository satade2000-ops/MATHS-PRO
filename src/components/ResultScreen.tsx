import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  RotateCcw,
  Home,
  CheckCircle2,
  XCircle,
  Clock,
  Percent,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Share2,
  ArrowRight,
  Tv,
} from 'lucide-react';
import { useMathApp } from '../context/MathContext';
import { sound } from '../utils/audio';
import { OPERATIONS_METADATA } from '../utils/constants';

export const ResultScreen: React.FC = () => {
  const {
    activeResult,
    closeResultScreen,
    startNewGame,
    setActiveTab,
    openAdModal,
    profile,
    t,
  } = useMathApp();

  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    if (!activeResult) return;

    if (activeResult.accuracy >= 70) {
      sound.playVictory();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#4F46E5', '#10B981', '#F59E0B', '#EC4899', '#3B82F6'],
        });
      } catch {
        // ignore
      }
    }
  }, [activeResult]);

  if (!activeResult) return null;

  const opMeta =
    OPERATIONS_METADATA.find((m) => m.type === activeResult.operation) ||
    OPERATIONS_METADATA[0];

  const handleReplay = () => {
    sound.playClick();
    startNewGame(activeResult.operation, activeResult.mode, activeResult.difficulty);
  };

  const handleChangeOperation = () => {
    sound.playClick();
    closeResultScreen();
    setActiveTab('games');
  };

  const handleGoHome = () => {
    sound.playClick();
    closeResultScreen();
    setActiveTab('home');
  };

  const titleMessage =
    activeResult.accuracy >= 90
      ? t('victoryExcellent')
      : activeResult.accuracy >= 60
      ? t('victoryGood')
      : t('victoryPractice');

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[94vh] overflow-hidden animate-fadeIn">
        {/* Header Hero */}
        <div className="relative p-6 text-center bg-gradient-to-b from-indigo-500/10 via-slate-50 to-white dark:from-indigo-950/40 dark:via-slate-850 dark:to-slate-900 border-b border-slate-200/80 dark:border-slate-800/80 shrink-0">
          {/* Trophy Icon */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-orange-500/20 mb-3">
            <Trophy className="w-9 h-9" />
          </div>

          {activeResult.isNewRecord && (
            <div className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[11px] font-black uppercase tracking-wider mb-2 shadow-xs">
              ⭐ {t('newRecord')} ⭐
            </div>
          )}

          <h2 className="text-2xl font-black text-slate-900 dark:text-white font-display tracking-tight">
            {titleMessage}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 capitalize">
            {t(opMeta.titleKey)} · {t(activeResult.difficulty)} ·{' '}
            {t(activeResult.mode)}
          </p>

          {/* Stars display */}
          <div className="flex items-center justify-center gap-1.5 mt-3">
            {[1, 2, 3].map((starIdx) => (
              <span
                key={starIdx}
                className={`text-2xl transition-transform ${
                  starIdx <= activeResult.starsEarned
                    ? 'scale-110 drop-shadow-md'
                    : 'opacity-30 grayscale'
                }`}
              >
                ⭐
              </span>
            ))}
          </div>
        </div>

        {/* Scrollable Metrics & Review */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {/* Main Score & XP Banner */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/70 dark:border-indigo-800/60 text-center">
              <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                {t('finalScore')}
              </span>
              <div className="text-3xl font-black text-slate-900 dark:text-white font-mono tabular-nums mt-0.5">
                {activeResult.score}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/70 dark:border-emerald-800/60 text-center">
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                {t('xpEarned')}
              </span>
              <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono tabular-nums mt-0.5">
                +{activeResult.xpEarned}
              </div>
            </div>
          </div>

          {/* Detailed Stat Grid */}
          <div className="grid grid-cols-3 gap-2.5">
            {/* Correct */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex flex-col items-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 mb-1" />
              <span className="text-base font-extrabold text-slate-800 dark:text-slate-100 tabular-nums">
                {activeResult.correctCount}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                {t('correctAnswers')}
              </span>
            </div>

            {/* Mistakes */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex flex-col items-center">
              <XCircle className="w-5 h-5 text-rose-500 mb-1" />
              <span className="text-base font-extrabold text-slate-800 dark:text-slate-100 tabular-nums">
                {activeResult.incorrectCount}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                {t('incorrectAnswers')}
              </span>
            </div>

            {/* Accuracy */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex flex-col items-center">
              <Percent className="w-5 h-5 text-indigo-500 mb-1" />
              <span className="text-base font-extrabold text-slate-800 dark:text-slate-100 tabular-nums">
                {activeResult.accuracy}%
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                {t('accuracy')}
              </span>
            </div>
          </div>

          {/* Time spent */}
          <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/50 text-xs text-slate-600 dark:text-slate-300">
            <span className="flex items-center gap-1.5 font-medium">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>{t('timeSpent')}</span>
            </span>
            <span className="font-mono font-bold">{activeResult.timeSeconds}s</span>
          </div>

          {/* Double XP Rewarded Ad button */}
          {!profile.isPremium && (
            <button
              onClick={openAdModal}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-98"
            >
              <Tv className="w-4 h-4" />
              <span>{t('doubleXpAd')}</span>
            </button>
          )}

          {/* Questions Review Accordion */}
          {activeResult.historyRecords && activeResult.historyRecords.length > 0 && (
            <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
              <button
                onClick={() => {
                  sound.playClick();
                  setShowReview((prev) => !prev);
                }}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/80 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                <span>{t('reviewQuestions')}</span>
                {showReview ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showReview && (
                <div className="p-3 divide-y divide-slate-100 dark:divide-slate-800 max-h-56 overflow-y-auto text-xs space-y-2">
                  {activeResult.historyRecords.map((item, idx) => (
                    <div key={idx} className="pt-2 first:pt-0">
                      <div className="flex items-center justify-between font-bold">
                        <span
                          className="font-mono text-slate-900 dark:text-slate-100"
                          dangerouslySetInnerHTML={{ __html: item.question.questionText }}
                        />
                        <span
                          className={`font-semibold flex items-center gap-1 ${
                            item.isCorrect ? 'text-emerald-600' : 'text-rose-600'
                          }`}
                        >
                          {item.isCorrect ? '✓' : `✗ (${item.question.correctAnswer})`}
                        </span>
                      </div>
                      {!item.isCorrect && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {item.question.explanation.fr}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700/80 flex flex-col gap-2 shrink-0">
          <button
            onClick={handleReplay}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md active:scale-98 transition-transform"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t('replay')}</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleChangeOperation}
              className="py-2.5 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 active:scale-98 transition-transform"
            >
              <span>{t('changeOperation')}</span>
            </button>
            <button
              onClick={handleGoHome}
              className="py-2.5 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 active:scale-98 transition-transform"
            >
              <Home className="w-3.5 h-3.5" />
              <span>{t('backHome')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
