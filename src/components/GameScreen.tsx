import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  Check,
  Pause,
  Play,
  RotateCcw,
  HelpCircle,
  Flame,
  Heart,
  Delete,
  ArrowRight,
  Sparkles,
  Trophy,
  Star,
  Target,
} from 'lucide-react';
import { useMathApp } from '../context/MathContext';
import { MathQuestion, QuestionAnswerRecord } from '../types/math';
import { sound } from '../utils/audio';
import { generateQuestion } from '../utils/mathGenerator';
import { OPERATIONS_METADATA } from '../utils/constants';
import { getDifficultyForStage, getTargetScoreForStage } from '../utils/progression';

interface FinishSnapshot {
  score: number;
  correctCount: number;
  incorrectCount: number;
  isVictory: boolean;
}

export const GameScreen: React.FC = () => {
  const {
    activeGame,
    settings,
    profile,
    quitActiveGame,
    finishGame,
    t,
  } = useMathApp();

  if (!activeGame) return null;

  const { operation, mode, difficulty, stage, targetScore } = activeGame;
  const opMeta = OPERATIONS_METADATA.find((m) => m.type === operation) || OPERATIONS_METADATA[0];
  const isFr = settings.language === 'fr';

  // Game state
  const [currentQuestion, setCurrentQuestion] = useState<MathQuestion>(() =>
    generateQuestion(operation, difficulty, stage)
  );
  const [questionIndex, setQuestionIndex] = useState(1);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [combo, setCombo] = useState(0);
  const [lives, setLives] = useState(3);
  const [isPaused, setIsPaused] = useState(false);
  const [inputMode, setInputMode] = useState<'multiple_choice' | 'numpad'>(
    settings.defaultInputMethod
  );
  const [typedAnswer, setTypedAnswer] = useState('');
  const [selectedOption, setSelectedOption] = useState<number | string | null>(null);
  const [feedbackState, setFeedbackState] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [showExplanation, setShowExplanation] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Victory Celebration Overlay state
  const [victorySnapshot, setVictorySnapshot] = useState<FinishSnapshot | null>(null);

  // Live refs to prevent stale closures inside timers
  const scoreRef = useRef(0);
  const correctRef = useRef(0);
  const incorrectRef = useRef(0);
  const livesRef = useRef(3);
  const hasFinishedRef = useRef(false);
  const advanceTimerRef = useRef<number | null>(null);
  const victoryTimerRef = useRef<number | null>(null);

  // Timers & Duration
  const totalDuration = mode === 'timed' ? settings.timedDuration : 0;
  const [secondsRemaining, setSecondsRemaining] = useState(totalDuration);
  const startTimeRef = useRef(Date.now());
  const questionStartTimeRef = useRef(Date.now());
  const historyRecordsRef = useRef<QuestionAnswerRecord[]>([]);

  const totalQuestionsLimit =
    mode === 'exam' ? settings.examQuestionsCount : mode === 'challenge' ? 15 : null;

  // Cleanup pending timeouts on unmount
  useEffect(() => {
    return () => {
      if (advanceTimerRef.current !== null) clearTimeout(advanceTimerRef.current);
      if (victoryTimerRef.current !== null) clearTimeout(victoryTimerRef.current);
    };
  }, []);

  // Reset internal session state cleanly if activeGame stage/operation/mode changes (e.g. clicking "Continuer · Partie suivante")
  useEffect(() => {
    if (advanceTimerRef.current !== null) clearTimeout(advanceTimerRef.current);
    if (victoryTimerRef.current !== null) clearTimeout(victoryTimerRef.current);

    scoreRef.current = 0;
    correctRef.current = 0;
    incorrectRef.current = 0;
    livesRef.current = 3;
    hasFinishedRef.current = false;
    historyRecordsRef.current = [];
    startTimeRef.current = Date.now();
    questionStartTimeRef.current = Date.now();

    setScore(0);
    setCorrectCount(0);
    setIncorrectCount(0);
    setCombo(0);
    setLives(3);
    setQuestionIndex(1);
    setSecondsRemaining(mode === 'timed' ? settings.timedDuration : 0);
    setIsPaused(false);
    setFeedbackState('idle');
    setSelectedOption(null);
    setTypedAnswer('');
    setShowExplanation(false);
    setShowHint(false);
    setVictorySnapshot(null);
    setCurrentQuestion(generateQuestion(operation, difficulty, stage));
  }, [operation, mode, difficulty, stage, settings.timedDuration]);

  // Timed countdown loop
  useEffect(() => {
    if (mode !== 'timed' || isPaused || feedbackState === 'incorrect' || victorySnapshot) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          const s = scoreRef.current;
          const c = correctRef.current;
          const inc = incorrectRef.current;
          const totalQ = c + inc;
          const acc = totalQ > 0 ? Math.round((c / totalQ) * 100) : 0;
          const won = totalQ > 0 && (s >= targetScore || acc >= 60);
          if (won) {
            triggerVictoryCelebration({ score: s, correctCount: c, incorrectCount: inc, isVictory: true });
          } else {
            commitFinishSession({ score: s, correctCount: c, incorrectCount: inc, isVictory: false });
          }
          return 0;
        }
        if (prev <= 6) {
          sound.playTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [mode, isPaused, feedbackState, victorySnapshot, targetScore]);

  const commitFinishSession = (snapshot?: FinishSnapshot) => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;

    if (advanceTimerRef.current !== null) clearTimeout(advanceTimerRef.current);
    if (victoryTimerRef.current !== null) clearTimeout(victoryTimerRef.current);

    const finalScore = snapshot ? snapshot.score : scoreRef.current;
    const finalCorrect = snapshot ? snapshot.correctCount : correctRef.current;
    const finalIncorrect = snapshot ? snapshot.incorrectCount : incorrectRef.current;
    const elapsedSeconds = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));
    const totalQ = finalCorrect + finalIncorrect;
    const accuracy = totalQ > 0 ? Math.round((finalCorrect / totalQ) * 100) : 0;

    const isVictory =
      snapshot?.isVictory !== undefined
        ? snapshot.isVictory
        : mode === 'learning'
        ? finalScore >= targetScore
        : mode === 'survival'
        ? livesRef.current > 0 && finalCorrect > 0
        : totalQ > 0 && (finalScore >= targetScore || accuracy >= 60);

    // Calculate stars
    let starsEarned = 1;
    if (isVictory && accuracy >= 90) starsEarned = 3;
    else if (isVictory && accuracy >= 70) starsEarned = 2;
    else if (!isVictory && accuracy < 50) starsEarned = 0;

    const xpEarned = Math.max(10, Math.round(finalScore / 2) + finalCorrect * 5 + (isVictory ? 20 : 0));
    const prevBest = profile.statsByOperation[operation]?.bestScore || 0;
    const isNewRecord = finalScore > prevBest && finalScore > 0;

    finishGame({
      id: `res_${Date.now()}`,
      score: finalScore,
      targetScore,
      stage,
      isVictory,
      correctCount: finalCorrect,
      incorrectCount: finalIncorrect,
      totalQuestions: totalQ,
      accuracy,
      timeSeconds: elapsedSeconds,
      mode,
      operation,
      difficulty,
      date: new Date().toLocaleDateString(settings.language === 'fr' ? 'fr-FR' : 'en-US'),
      xpEarned,
      starsEarned,
      isNewRecord,
      historyRecords: historyRecordsRef.current,
    });
  };

  const triggerVictoryCelebration = (snapshot: FinishSnapshot) => {
    if (victorySnapshot || hasFinishedRef.current) return;
    if (advanceTimerRef.current !== null) clearTimeout(advanceTimerRef.current);

    setVictorySnapshot(snapshot);
    sound.playVictory();

    try {
      confetti({
        particleCount: 95,
        spread: 75,
        origin: { y: 0.55 },
        colors: ['#4F46E5', '#10B981', '#F59E0B', '#EC4899', '#3B82F6'],
      });
    } catch {
      // ignore
    }

    victoryTimerRef.current = window.setTimeout(() => {
      commitFinishSession(snapshot);
    }, 2100);
  };

  const handleAnswerSubmit = (userAnswer: number | string) => {
    if (feedbackState !== 'idle' || victorySnapshot || hasFinishedRef.current) return;

    setSelectedOption(userAnswer);
    const spentMs = Date.now() - questionStartTimeRef.current;
    const isCorrect =
      String(userAnswer).trim().toLowerCase() ===
      String(currentQuestion.correctAnswer).trim().toLowerCase();

    historyRecordsRef.current.push({
      question: currentQuestion,
      userAnswer,
      isCorrect,
      timeSpentMs: spentMs,
    });

    if (isCorrect) {
      sound.playCorrect();
      setFeedbackState('correct');
      const newCombo = combo + 1;
      setCombo(newCombo);

      // Speed bonus & combo multiplier
      const timeBonus = spentMs < 2000 ? 5 : spentMs < 4000 ? 2 : 0;
      const points = 10 + Math.min(newCombo * 2, 20) + timeBonus;

      const nextScore = scoreRef.current + points;
      const nextCorrect = correctRef.current + 1;
      scoreRef.current = nextScore;
      correctRef.current = nextCorrect;

      setScore(nextScore);
      setCorrectCount(nextCorrect);

      // End round with victory animation once target score is reached (in learning mode)
      if (mode === 'learning' && nextScore >= targetScore) {
        advanceTimerRef.current = window.setTimeout(() => {
          triggerVictoryCelebration({
            score: nextScore,
            correctCount: nextCorrect,
            incorrectCount: incorrectRef.current,
            isVictory: true,
          });
        }, 550);
        return;
      }

      // Or check exam/challenge question limit
      if (totalQuestionsLimit && questionIndex >= totalQuestionsLimit) {
        advanceTimerRef.current = window.setTimeout(() => {
          const totalQ = nextCorrect + incorrectRef.current;
          const acc = totalQ > 0 ? Math.round((nextCorrect / totalQ) * 100) : 0;
          const won = nextScore >= targetScore || acc >= 60;
          if (won) {
            triggerVictoryCelebration({
              score: nextScore,
              correctCount: nextCorrect,
              incorrectCount: incorrectRef.current,
              isVictory: true,
            });
          } else {
            commitFinishSession({
              score: nextScore,
              correctCount: nextCorrect,
              incorrectCount: incorrectRef.current,
              isVictory: false,
            });
          }
        }, 650);
        return;
      }

      advanceTimerRef.current = window.setTimeout(() => {
        advanceNextQuestion();
      }, 700);
    } else {
      sound.playIncorrect();
      setFeedbackState('incorrect');
      setCombo(0);

      const nextIncorrect = incorrectRef.current + 1;
      incorrectRef.current = nextIncorrect;
      setIncorrectCount(nextIncorrect);

      // Check survival mode lives
      if (mode === 'survival') {
        const nextLives = livesRef.current - 1;
        livesRef.current = nextLives;
        setLives(nextLives);
        if (nextLives <= 0) {
          advanceTimerRef.current = window.setTimeout(() => {
            commitFinishSession({
              score: scoreRef.current,
              correctCount: correctRef.current,
              incorrectCount: nextIncorrect,
              isVictory: false,
            });
          }, 1500);
          return;
        }
      }

      setShowExplanation(true);
    }
  };

  const advanceNextQuestion = () => {
    setFeedbackState('idle');
    setSelectedOption(null);
    setTypedAnswer('');
    setShowExplanation(false);
    setShowHint(false);

    if (totalQuestionsLimit && questionIndex >= totalQuestionsLimit) {
      const c = correctRef.current;
      const inc = incorrectRef.current;
      const s = scoreRef.current;
      const totalQ = c + inc;
      const acc = totalQ > 0 ? Math.round((c / totalQ) * 100) : 0;
      const won = s >= targetScore || acc >= 60;
      if (won) {
        triggerVictoryCelebration({ score: s, correctCount: c, incorrectCount: inc, isVictory: true });
      } else {
        commitFinishSession({ score: s, correctCount: c, incorrectCount: inc, isVictory: false });
      }
      return;
    }

    setQuestionIndex((prev) => prev + 1);
    setCurrentQuestion(generateQuestion(operation, difficulty, stage));
    questionStartTimeRef.current = Date.now();
  };

  // Virtual Keypad handlers
  const handleKeypadPress = (val: string) => {
    sound.playClick();
    if (feedbackState !== 'idle' || victorySnapshot) return;
    if (typedAnswer.length < 8) {
      setTypedAnswer((prev) => prev + val);
    }
  };

  const handleKeypadDelete = () => {
    sound.playClick();
    setTypedAnswer((prev) => prev.slice(0, -1));
  };

  const handleKeypadSubmit = () => {
    if (!typedAnswer.trim()) return;
    handleAnswerSubmit(typedAnswer.trim());
  };

  const handleRestart = () => {
    sound.playClick();
    if (advanceTimerRef.current !== null) clearTimeout(advanceTimerRef.current);
    if (victoryTimerRef.current !== null) clearTimeout(victoryTimerRef.current);

    scoreRef.current = 0;
    correctRef.current = 0;
    incorrectRef.current = 0;
    livesRef.current = 3;
    hasFinishedRef.current = false;
    historyRecordsRef.current = [];
    startTimeRef.current = Date.now();
    questionStartTimeRef.current = Date.now();

    setIsPaused(false);
    setScore(0);
    setCorrectCount(0);
    setIncorrectCount(0);
    setCombo(0);
    setLives(3);
    setQuestionIndex(1);
    setSecondsRemaining(totalDuration);
    setFeedbackState('idle');
    setSelectedOption(null);
    setTypedAnswer('');
    setShowExplanation(false);
    setShowHint(false);
    setVictorySnapshot(null);
    setCurrentQuestion(generateQuestion(operation, difficulty, stage));
  };

  const nextStage = stage + 1;
  const nextDifficulty = getDifficultyForStage(nextStage);
  const nextTargetScore = getTargetScoreForStage(nextStage);
  const scoreProgressPct = Math.min(100, Math.round((score / targetScore) * 100));

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      {/* Phone container / Game canvas */}
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col min-h-[92vh] max-h-[96vh] overflow-hidden">
        {/* Top Header HUD */}
        <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between shrink-0">
          {/* Pause & Operation / Stage info */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sound.playClick();
                setIsPaused(true);
              }}
              className="w-9 h-9 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-700 dark:text-slate-200 active:scale-95 transition-transform"
              title={t('pause')}
            >
              <Pause className="w-4 h-4" />
            </button>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-extrabold text-slate-900 dark:text-white capitalize">
                  {t(opMeta.titleKey)}
                </span>
                <span className="px-1.5 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 text-[10px] font-black">
                  {t('stageLabel')} {stage}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 capitalize">
                {t(difficulty)} · {t(mode)}
              </span>
            </div>
          </div>

          {/* Central Indicator & Score Goal */}
          <div className="flex items-center gap-2.5">
            {mode === 'timed' ? (
              <div
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full font-mono text-xs font-bold ${
                  secondsRemaining <= 10
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300'
                }`}
              >
                <span>⏱️</span>
                <span className="tabular-nums">{secondsRemaining}s</span>
              </div>
            ) : mode === 'survival' ? (
              <div className="flex items-center gap-1">
                {[1, 2, 3].map((heartIndex) => (
                  <Heart
                    key={heartIndex}
                    className={`w-4 h-4 transition-transform ${
                      heartIndex <= lives
                        ? 'text-rose-500 fill-rose-500 scale-100'
                        : 'text-slate-300 dark:text-slate-700 scale-90'
                    }`}
                  />
                ))}
              </div>
            ) : totalQuestionsLimit ? (
              <div className="px-2.5 py-1 rounded-full bg-slate-200/80 dark:bg-slate-700/80 text-xs font-semibold text-slate-700 dark:text-slate-300 tabular-nums">
                {questionIndex}/{totalQuestionsLimit}
              </div>
            ) : (
              <div className="px-2 py-1 rounded-full bg-slate-200/80 dark:bg-slate-700/80 text-[11px] font-semibold text-slate-700 dark:text-slate-300 tabular-nums">
                Q.{questionIndex}
              </div>
            )}

            {/* Score / Goal */}
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
                <Target className="w-2.5 h-2.5 text-indigo-500" />
                <span>{mode === 'learning' ? t('goalLabel') : t('score')}</span>
              </span>
              <span className="text-sm font-black text-indigo-600 dark:text-indigo-400 tabular-nums font-mono">
                {mode === 'learning' ? (
                  <>
                    {score}
                    <span className="text-[11px] text-slate-400 font-bold">/{targetScore}</span>
                  </>
                ) : (
                  score
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Progress bar on top */}
        <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 shrink-0 overflow-hidden">
          {mode === 'learning' ? (
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500 transition-all duration-500 ease-out"
              style={{ width: `${scoreProgressPct}%` }}
            />
          ) : mode === 'timed' ? (
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-1000 ease-linear"
              style={{ width: `${(secondsRemaining / totalDuration) * 100}%` }}
            />
          ) : totalQuestionsLimit ? (
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300"
              style={{ width: `${(questionIndex / totalQuestionsLimit) * 100}%` }}
            />
          ) : (
            <div
              className="h-full bg-indigo-500 transition-all duration-300"
              style={{ width: `${scoreProgressPct}%` }}
            />
          )}
        </div>

        {/* Combo Banner */}
        {combo >= 2 && (
          <div className="px-4 py-1.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs shrink-0 animate-bounce">
            <Flame className="w-3.5 h-3.5 fill-white" />
            <span>COMBO x{combo} ! (+{Math.min(combo * 2, 20)} pts bonus)</span>
          </div>
        )}

        {/* Active Play Area */}
        <div className="flex-1 px-4 py-4 flex flex-col justify-between overflow-y-auto">
          {/* Question Card */}
          <div className="relative w-full rounded-2xl bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-800/80 dark:to-slate-850/80 border border-slate-200/80 dark:border-slate-700/80 p-6 flex flex-col items-center justify-center shadow-inner my-auto">
            {/* Operator background watermark */}
            <span className="absolute -top-3 -right-2 text-7xl font-black text-slate-200 dark:text-slate-800/50 select-none pointer-events-none opacity-40">
              {opMeta.symbol}
            </span>

            {/* Hint Button if available */}
            {currentQuestion.hint && (
              <button
                onClick={() => {
                  sound.playClick();
                  setShowHint((prev) => !prev);
                }}
                className="absolute top-3 left-3 text-xs text-slate-500 dark:text-slate-400 hover:text-indigo-600 flex items-center gap-1 bg-white/80 dark:bg-slate-700/80 px-2 py-1 rounded-lg border border-slate-200/60 dark:border-slate-600/60 shadow-xs"
              >
                <HelpCircle className="w-3 h-3 text-amber-500" />
                <span>{t('hintBtn')}</span>
              </button>
            )}

            {/* Input mode switcher */}
            <div className="absolute top-3 right-3 flex items-center bg-white dark:bg-slate-700 rounded-lg p-0.5 border border-slate-200/80 dark:border-slate-600">
              <button
                onClick={() => {
                  sound.playClick();
                  setInputMode('multiple_choice');
                }}
                className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-colors ${
                  inputMode === 'multiple_choice'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                QCM
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  setInputMode('numpad');
                }}
                className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-colors ${
                  inputMode === 'numpad'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                123
              </button>
            </div>

            {/* The Math Formula */}
            <div
              className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-wide text-center font-display my-4 tabular-nums"
              dangerouslySetInnerHTML={{ __html: currentQuestion.questionText }}
            />

            {/* Hint alert */}
            {showHint && currentQuestion.hint && (
              <div className="w-full mt-2 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-200 text-center animate-fadeIn">
                💡 {isFr ? currentQuestion.hint.fr : currentQuestion.hint.en}
              </div>
            )}

            {/* Typed input preview in numpad mode */}
            {inputMode === 'numpad' && (
              <div className="w-full max-w-[200px] h-12 rounded-xl bg-white dark:bg-slate-900 border-2 border-indigo-400 dark:border-indigo-600 flex items-center justify-center text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono tracking-widest shadow-sm">
                {typedAnswer || <span className="text-slate-300 dark:text-slate-600">?</span>}
              </div>
            )}
          </div>

          {/* Feedback Overlay / Toast */}
          {feedbackState === 'correct' && (
            <div className="my-2 p-3 rounded-2xl bg-emerald-500 text-white font-extrabold flex items-center justify-center gap-2 shadow-lg animate-bounce">
              <Check className="w-5 h-5 stroke-[3]" />
              <span>{t('correct')}</span>
            </div>
          )}

          {feedbackState === 'incorrect' && (
            <div className="my-2 p-3 rounded-2xl bg-rose-500 text-white flex flex-col items-center justify-center gap-1 shadow-lg">
              <div className="flex items-center gap-1.5 font-extrabold">
                <X className="w-5 h-5 stroke-[3]" />
                <span>{t('incorrect')}</span>
              </div>
              <span className="text-xs text-rose-100">
                {t('correctAnswerWas')}:{' '}
                <strong className="underline text-white font-mono text-sm ml-1">
                  {currentQuestion.correctAnswer}
                </strong>
              </span>
            </div>
          )}

          {/* Explanation Modal / Drawer if incorrect */}
          {showExplanation && (
            <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 my-2 shadow-sm text-left animate-fadeIn">
              <div className="flex items-center gap-1.5 font-bold text-xs text-indigo-700 dark:text-indigo-300 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span>{t('explanationTitle')}</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {isFr ? currentQuestion.explanation.fr : currentQuestion.explanation.en}
              </p>
              <button
                onClick={advanceNextQuestion}
                className="mt-3 w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-98 transition-transform"
              >
                <span>{t('gotIt')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Inputs Section */}
          {!showExplanation && (
            <div className="mt-3">
              {inputMode === 'multiple_choice' ? (
                /* 4 Big Choices Buttons */
                <div className="grid grid-cols-2 gap-3">
                  {currentQuestion.options.map((option, idx) => {
                    const letters = ['A', 'B', 'C', 'D'];
                    const isSelected = selectedOption === option;
                    const isCorrectAnswer =
                      String(option).trim() === String(currentQuestion.correctAnswer).trim();

                    let btnStyle =
                      'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:border-indigo-400 dark:hover:border-indigo-500';

                    if (feedbackState !== 'idle') {
                      if (isCorrectAnswer) {
                        btnStyle = 'bg-emerald-500 border-emerald-500 text-white shadow-lg scale-102';
                      } else if (isSelected && !isCorrectAnswer) {
                        btnStyle = 'bg-rose-500 border-rose-500 text-white';
                      } else {
                        btnStyle = 'opacity-40 bg-slate-100 dark:bg-slate-800 text-slate-400';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        disabled={feedbackState !== 'idle' || Boolean(victorySnapshot)}
                        onClick={() => handleAnswerSubmit(option)}
                        className={`h-16 sm:h-20 rounded-2xl border-2 font-bold text-xl sm:text-2xl flex items-center justify-between px-4 shadow-sm transition-all active:scale-95 cursor-pointer ${btnStyle}`}
                      >
                        <span className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 text-xs font-black flex items-center justify-center">
                          {letters[idx]}
                        </span>
                        <span className="font-mono tabular-nums text-center flex-1">{option}</span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                /* Interactive Numeric Keypad */
                <div className="flex flex-col gap-2 max-w-[320px] mx-auto w-full">
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                      <button
                        key={num}
                        disabled={feedbackState !== 'idle' || Boolean(victorySnapshot)}
                        onClick={() => handleKeypadPress(String(num))}
                        className="h-12 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-xl font-bold text-slate-800 dark:text-white shadow-xs active:bg-slate-100 dark:active:bg-slate-700 active:scale-95 transition-all"
                      >
                        {num}
                      </button>
                    ))}
                    <button
                      onClick={handleKeypadDelete}
                      disabled={feedbackState !== 'idle' || Boolean(victorySnapshot)}
                      className="h-12 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center active:scale-95 transition-all"
                    >
                      <Delete className="w-5 h-5" />
                    </button>
                    <button
                      disabled={feedbackState !== 'idle' || Boolean(victorySnapshot)}
                      onClick={() => handleKeypadPress('0')}
                      className="h-12 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-xl font-bold text-slate-800 dark:text-white shadow-xs active:scale-95 transition-all"
                    >
                      0
                    </button>
                    <button
                      disabled={feedbackState !== 'idle' || Boolean(victorySnapshot)}
                      onClick={() => handleKeypadPress('-')}
                      className="h-12 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 font-mono text-xl font-bold text-slate-700 dark:text-slate-300 active:scale-95 transition-all"
                    >
                      −
                    </button>
                  </div>
                  <button
                    disabled={feedbackState !== 'idle' || !typedAnswer || Boolean(victorySnapshot)}
                    onClick={handleKeypadSubmit}
                    className={`h-12 rounded-xl font-bold text-base flex items-center justify-center gap-2 shadow-md transition-transform active:scale-98 ${
                      typedAnswer
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <Check className="w-5 h-5 stroke-[2.5]" />
                    <span>{t('validate')}</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Victory Celebration Animation Overlay */}
        {victorySnapshot && (
          <div className="absolute inset-0 z-50 bg-gradient-to-br from-indigo-900/95 via-violet-900/95 to-slate-950/95 backdrop-blur-md flex items-center justify-center p-6 text-center text-white animate-fadeIn">
            <div className="w-full max-w-xs space-y-5 animate-victoryPop">
              {/* Pulsing Trophy Halo */}
              <div className="relative mx-auto w-28 h-28 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-amber-400/25 animate-ping" />
                <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-amber-400/30 to-orange-500/30 blur-md" />
                <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-400 via-yellow-400 to-orange-500 text-slate-950 flex items-center justify-center shadow-2xl shadow-amber-500/40 animate-victoryFloat">
                  <Trophy className="w-12 h-12" />
                </div>
                <Star className="w-6 h-6 text-amber-300 fill-amber-300 absolute -top-1 -left-1 animate-bounce" />
                <Sparkles className="w-6 h-6 text-emerald-300 absolute -bottom-1 -right-1 animate-pulse" />
              </div>

              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[11px] font-black uppercase tracking-widest mb-2">
                  {t('stageLabel')} {stage} · {t(difficulty)}
                </span>
                <h2 className="text-3xl font-black font-display tracking-tight text-white">
                  {t('stageVictoryTitle')} 🎉
                </h2>
                <p className="text-xs text-indigo-100/90 mt-1">
                  {t('stageCompletedMsg')}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/10 border border-white/15 space-y-1.5">
                <div className="text-2xl font-black font-mono text-amber-300 tabular-nums">
                  {victorySnapshot.score} / {targetScore} pts
                </div>
                <div className="text-[11px] text-indigo-200 font-semibold">
                  {t('nextStagePreview')} : <strong className="text-white">{t('stageLabel')} {nextStage} · {t(nextDifficulty)}</strong> ({nextTargetScore} pts)
                </div>
              </div>

              <button
                onClick={() => commitFinishSession(victorySnapshot)}
                className="w-full py-3 rounded-xl bg-white text-indigo-700 font-extrabold text-xs uppercase tracking-wider shadow-lg active:scale-95 transition-transform"
              >
                {t('seeResults')} →
              </button>
            </div>
          </div>
        )}

        {/* Pause Modal */}
        {isPaused && !victorySnapshot && (
          <div className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-6 animate-fadeIn">
            <div className="w-full max-w-xs bg-white dark:bg-slate-800 rounded-3xl p-6 text-center shadow-2xl border border-slate-200 dark:border-slate-700">
              <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4">
                <Pause className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white font-display mb-1">
                {t('gamePaused')}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                {t(opMeta.titleKey)} · {t('stageLabel')} {stage} ({t(difficulty)})
              </p>

              <div className="flex flex-col gap-2.5">
                <button
                  onClick={() => {
                    sound.playClick();
                    setIsPaused(false);
                  }}
                  className="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md active:scale-98 transition-transform"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>{t('resume')}</span>
                </button>
                <button
                  onClick={handleRestart}
                  className="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-sm flex items-center justify-center gap-2 active:scale-98 transition-transform"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{t('restart')}</span>
                </button>
                <button
                  onClick={quitActiveGame}
                  className="w-full py-3 rounded-xl border border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 font-bold text-sm flex items-center justify-center gap-2 active:scale-98 transition-transform"
                >
                  <X className="w-4 h-4" />
                  <span>{t('quitGame')}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
