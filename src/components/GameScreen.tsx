import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Check,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  HelpCircle,
  Flame,
  Heart,
  Delete,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useMathApp } from '../context/MathContext';
import { MathQuestion, QuestionAnswerRecord } from '../types/math';
import { sound } from '../utils/audio';
import { generateQuestion } from '../utils/mathGenerator';
import { OPERATIONS_METADATA } from '../utils/constants';

export const GameScreen: React.FC = () => {
  const {
    activeGame,
    settings,
    profile,
    quitActiveGame,
    finishGame,
    updateSettings,
    t,
  } = useMathApp();

  if (!activeGame) return null;

  const { operation, mode, difficulty } = activeGame;
  const opMeta = OPERATIONS_METADATA.find((m) => m.type === operation) || OPERATIONS_METADATA[0];

  // Game state
  const [currentQuestion, setCurrentQuestion] = useState<MathQuestion>(() =>
    generateQuestion(operation, difficulty)
  );
  const [questionIndex, setQuestionIndex] = useState(1);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
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

  // Timers & Duration
  const totalDuration = mode === 'timed' ? settings.timedDuration : 0;
  const [secondsRemaining, setSecondsRemaining] = useState(totalDuration);
  const startTimeRef = useRef(Date.now());
  const questionStartTimeRef = useRef(Date.now());
  const historyRecordsRef = useRef<QuestionAnswerRecord[]>([]);

  const totalQuestionsLimit =
    mode === 'exam' ? settings.examQuestionsCount : mode === 'challenge' ? 15 : null;

  // Timed countdown loop
  useEffect(() => {
    if (mode !== 'timed' || isPaused || feedbackState === 'incorrect') return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinishSession();
          return 0;
        }
        if (prev <= 6) {
          sound.playTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [mode, isPaused, feedbackState]);

  // Wrap up game session
  const handleFinishSession = () => {
    const elapsedSeconds = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));
    const totalQ = correctCount + incorrectCount;
    const accuracy = totalQ > 0 ? Math.round((correctCount / totalQ) * 100) : 0;

    // Calculate stars
    let starsEarned = 1;
    if (accuracy >= 90) starsEarned = 3;
    else if (accuracy >= 70) starsEarned = 2;

    const baseScore = score;
    const xpEarned = Math.max(10, Math.round(baseScore / 2) + correctCount * 5);

    const prevBest = profile.statsByOperation[operation]?.bestScore || 0;
    const isNewRecord = baseScore > prevBest && baseScore > 0;

    finishGame({
      id: `res_${Date.now()}`,
      score: baseScore,
      correctCount,
      incorrectCount,
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

  const handleAnswerSubmit = (userAnswer: number | string) => {
    if (feedbackState !== 'idle') return;

    setSelectedOption(userAnswer);
    const spentMs = Date.now() - questionStartTimeRef.current;
    const isCorrect =
      String(userAnswer).trim().toLowerCase() ===
      String(currentQuestion.correctAnswer).trim().toLowerCase();

    // Record for question review
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
      setMaxCombo((prev) => Math.max(prev, newCombo));

      // Speed bonus & combo multiplier
      const timeBonus = spentMs < 2000 ? 5 : spentMs < 4000 ? 2 : 0;
      const points = 10 + Math.min(newCombo * 2, 20) + timeBonus;
      setScore((prev) => prev + points);
      setCorrectCount((prev) => prev + 1);

      // Advance after short delay
      setTimeout(() => {
        advanceNextQuestion();
      }, 750);
    } else {
      sound.playIncorrect();
      setFeedbackState('incorrect');
      setCombo(0);
      setIncorrectCount((prev) => prev + 1);

      // Check survival mode lives
      if (mode === 'survival') {
        const nextLives = lives - 1;
        setLives(nextLives);
        if (nextLives <= 0) {
          setTimeout(() => {
            handleFinishSession();
          }, 1600);
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

    // Check target count limit for exams / challenges
    if (totalQuestionsLimit && questionIndex >= totalQuestionsLimit) {
      handleFinishSession();
      return;
    }

    setQuestionIndex((prev) => prev + 1);
    setCurrentQuestion(generateQuestion(operation, difficulty));
    questionStartTimeRef.current = Date.now();
  };

  // Virtual Keypad handlers
  const handleKeypadPress = (val: string) => {
    sound.playClick();
    if (feedbackState !== 'idle') return;
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
    historyRecordsRef.current = [];
    setCurrentQuestion(generateQuestion(operation, difficulty));
    startTimeRef.current = Date.now();
    questionStartTimeRef.current = Date.now();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      {/* Phone container / Game canvas */}
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col min-h-[92vh] max-h-[96vh] overflow-hidden">
        {/* Top Header HUD */}
        <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between shrink-0">
          {/* Pause & Quit */}
          <div className="flex items-center gap-1.5">
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
            <div className="flex flex-col ml-1">
              <span className="text-xs font-bold text-slate-900 dark:text-white capitalize">
                {t(opMeta.titleKey)}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 capitalize">
                {t(difficulty)} · {t(mode)}
              </span>
            </div>
          </div>

          {/* Central Question indicator / Timer */}
          <div className="flex items-center gap-3">
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
              <div className="px-2.5 py-1 rounded-full bg-slate-200/80 dark:bg-slate-700/80 text-xs font-semibold text-slate-700 dark:text-slate-300 tabular-nums">
                Q.{questionIndex}
              </div>
            )}

            {/* Score */}
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">
                {t('score')}
              </span>
              <span className="text-sm font-black text-indigo-600 dark:text-indigo-400 tabular-nums">
                {score}
              </span>
            </div>
          </div>
        </div>

        {/* Progress bar on top */}
        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 shrink-0">
          {mode === 'timed' ? (
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
              style={{ width: `${Math.min(100, (questionIndex % 10) * 10)}%` }}
            />
          )}
        </div>

        {/* Combo Banner */}
        {combo >= 2 && (
          <div className="px-4 py-1.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs shrink-0 animate-bounce">
            <Flame className="w-3.5 h-3.5 fill-white" />
            <span>COMBO x{combo} ! (+{combo * 2} pts bonus)</span>
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
                💡 {settings.language === 'fr' ? currentQuestion.hint.fr : currentQuestion.hint.en}
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
                {settings.language === 'fr'
                  ? currentQuestion.explanation.fr
                  : currentQuestion.explanation.en}
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
                        disabled={feedbackState !== 'idle'}
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
                        disabled={feedbackState !== 'idle'}
                        onClick={() => handleKeypadPress(String(num))}
                        className="h-12 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-xl font-bold text-slate-800 dark:text-white shadow-xs active:bg-slate-100 dark:active:bg-slate-700 active:scale-95 transition-all"
                      >
                        {num}
                      </button>
                    ))}
                    <button
                      onClick={handleKeypadDelete}
                      disabled={feedbackState !== 'idle'}
                      className="h-12 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center active:scale-95 transition-all"
                    >
                      <Delete className="w-5 h-5" />
                    </button>
                    <button
                      disabled={feedbackState !== 'idle'}
                      onClick={() => handleKeypadPress('0')}
                      className="h-12 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-xl font-bold text-slate-800 dark:text-white shadow-xs active:scale-95 transition-all"
                    >
                      0
                    </button>
                    <button
                      disabled={feedbackState !== 'idle'}
                      onClick={() => handleKeypadPress('-')}
                      className="h-12 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 font-mono text-xl font-bold text-slate-700 dark:text-slate-300 active:scale-95 transition-all"
                    >
                      −
                    </button>
                  </div>
                  <button
                    disabled={feedbackState !== 'idle' || !typedAnswer}
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

        {/* Pause Modal */}
        {isPaused && (
          <div className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-6 animate-fadeIn">
            <div className="w-full max-w-xs bg-white dark:bg-slate-800 rounded-3xl p-6 text-center shadow-2xl border border-slate-200 dark:border-slate-700">
              <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4">
                <Pause className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white font-display mb-1">
                {t('gamePaused')}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                {t(opMeta.titleKey)} · {t(difficulty)}
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
