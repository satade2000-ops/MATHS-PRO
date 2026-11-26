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
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Tv,
  Sparkles,
  Target,
} from 'lucide-react';
import { useMathApp } from '../context/MathContext';
import { sound } from '../utils/audio';
import { OPERATIONS_METADATA } from '../utils/constants';
import { getDifficultyForStage, getTargetScoreForStage } from '../utils/progression';
import { AdSenseBanner } from './AdSenseBanner';
import { MathFormulaText } from './MathFormulaText';

export const ResultScreen: React.FC = () => {
  const {
    activeResult,
    closeResultScreen,
    startNewGame,
    startNextStage,
    setActiveTab,
    openAdModal,
    profile,
    settings,
    t,
  } = useMathApp();

  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    if (!activeResult) return;

    if (activeResult.isVictory || activeResult.accuracy >= 70) {
      sound.playVictory();
      try {
        confetti({
          particleCount: activeResult.isVictory ? 100 : 70,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#4F46E5', '#10B981', '#F59E0B', '#EC4899', '#3B82F6'],
        });
      } catch {
        // ignore
      }
    }
  }, [activeResult]);

  if (!activeResult) return null;

  const isFr = settings.language === 'fr';
  const currentStage = activeResult.stage || 1;
  const nextStage = currentStage + 1;
  const nextDifficulty = getDifficultyForStage(nextStage);
  const nextTargetScore = getTargetScoreForStage(nextStage);
  const isVictory = Boolean(activeResult.isVictory);

  const opMeta =
    OPERATIONS_METADATA.find((m) => m.type === activeResult.operation) ||
    OPERATIONS_METADATA[0];

  const handleContinueNext = () => {
    sound.playClick();
    startNextStage(activeResult.operation, activeResult.mode, currentStage);
  };

  const handleReplay = () => {
    sound.playClick();
    startNewGame(
      activeResult.operation,
      activeResult.mode,
      activeResult.difficulty,
      currentStage
    );
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

  const titleMessage = isVictory
    ? isFr
      ? `PARTIE ${currentStage} RÉUSSIE !`
      : `STAGE ${currentStage} COMPLETE!`
    : activeResult.accuracy >= 60
    ? t('victoryGood')
    : t('victoryPractice');

  return (
    <div className="fixed inset-0 z-[60] bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[94vh] overflow-hidden animate-victoryPop">
        {/* Header Hero */}
        <div
          className={`relative p-6 text-center border-b border-slate-200/80 dark:border-slate-800/80 shrink-0 ${
            isVictory
              ? 'bg-gradient-to-b from-amber-500/15 via-indigo-500/10 to-white dark:from-amber-950/40 dark:via-slate-850 dark:to-slate-900'
              : 'bg-gradient-to-b from-indigo-500/10 via-slate-50 to-white dark:from-indigo-950/40 dark:via-slate-850 dark:to-slate-900'
          }`}
        >
          {/* Trophy Icon */}
          <div
            className={`w-16 h-16 rounded-2xl text-white flex items-center justify-center mx-auto shadow-lg mb-3 ${
              isVictory
                ? 'bg-gradient-to-tr from-amber-400 to-orange-500 shadow-orange-500/30 animate-victoryFloat'
                : 'bg-gradient-to-tr from-indigo-500 to-violet-600 shadow-indigo-500/20'
            }`}
          >
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
            {t(opMeta.titleKey)} · {t('stageLabel')} {currentStage} ({t(activeResult.difficulty)}) ·{' '}
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
          {/* Next Stage Progression Callout on Victory */}
          {isVictory && (
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-indigo-500/15 border border-emerald-400/50 dark:border-emerald-700/60 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 block">
                    {isFr ? 'Partie suivante débloquée' : 'Next stage unlocked'}
                  </span>
                  <span className="text-xs font-black text-slate-900 dark:text-white">
                    {t('stageLabel')} {nextStage} · {t(nextDifficulty)}
                  </span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-white/80 dark:bg-slate-800 text-[11px] font-mono font-extrabold text-indigo-600 dark:text-indigo-400 shrink-0">
                {nextTargetScore} pts
              </span>
            </div>
          )}

          {/* Main Score & XP Banner */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/70 dark:border-indigo-800/60 text-center">
              <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center justify-center gap-1">
                <Target className="w-3 h-3" />
                <span>{t('finalScore')}</span>
              </span>
              <div className="text-3xl font-black text-slate-900 dark:text-white font-mono tabular-nums mt-0.5">
                {activeResult.score}
              </div>
              {activeResult.targetScore && (
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                  {t('goalLabel')} : {activeResult.targetScore} pts
                </span>
              )}
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/70 dark:border-emerald-800/60 text-center flex flex-col justify-center">
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
                        <span className="font-mono text-slate-900 dark:text-slate-100">
                          <MathFormulaText text={item.question.questionText} />
                        </span>
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
                          {isFr ? item.question.explanation.fr : item.question.explanation.en}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Discrete AdSense slot after game completion (hidden for Premium users) */}
          <AdSenseBanner placement="result" />
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700/80 flex flex-col gap-2 shrink-0">
          {isVictory ? (
            <>
              <button
                onClick={handleContinueNext}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-indigo-600 hover:brightness-105 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 active:scale-98 transition-all"
              >
                <span>
                  {t('continueNextStage')} {nextStage} ({t(nextDifficulty)})
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={handleReplay}
                  className="py-2.5 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-1 active:scale-98 transition-transform"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{t('replay')}</span>
                </button>
                <button
                  onClick={handleChangeOperation}
                  className="py-2.5 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-1 active:scale-98 transition-transform"
                >
                  <span>{t('navGames')}</span>
                </button>
                <button
                  onClick={handleGoHome}
                  className="py-2.5 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-1 active:scale-98 transition-transform"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>{t('navHome')}</span>
                </button>
              </div>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};
