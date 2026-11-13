import React, { useState } from 'react';
import {
  ShieldAlert,
  GraduationCap,
  Target,
  Flame,
  Award,
  ChevronRight,
  BookOpen,
  CheckCircle,
  Play,
  Star,
} from 'lucide-react';
import { useMathApp } from '../context/MathContext';
import { sound } from '../utils/audio';

export const ChallengesTab: React.FC = () => {
  const { startNewGame, profile, t } = useMathApp();

  // Selected table for interactive multiplication explorer
  const [selectedTable, setSelectedTable] = useState<number>(7);

  const handleStartSurvival = () => {
    sound.playClick();
    startNewGame('addition', 'survival', 'medium');
  };

  const handleStartExam = () => {
    sound.playClick();
    startNewGame('multiplication', 'exam', 'medium');
  };

  const handleStartChallenge = () => {
    sound.playClick();
    startNewGame('mental_math', 'challenge', 'medium');
  };

  const handlePracticeTable = (tableNum: number) => {
    sound.playClick();
    startNewGame('multiplication', 'learning', 'medium');
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Title */}
      <div className="px-1">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white font-display">
          {t('navChallenges')}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Repousse tes limites avec des épreuves spéciales
        </p>
      </div>

      {/* Featured Challenge 1: MODE SURVIE (3 Vies) */}
      <div className="relative rounded-3xl bg-gradient-to-br from-rose-600 via-rose-700 to-red-800 text-white p-5 shadow-lg shadow-rose-500/20 overflow-hidden">
        <div className="relative z-10 flex flex-col justify-between h-full">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white mb-3">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-1 bg-black/20 px-2.5 py-1 rounded-full text-xs font-extrabold text-rose-200">
              ❤️❤️❤️ 3 Vies
            </div>
          </div>

          <h3 className="text-xl font-black font-display tracking-tight text-white">
            Mode Survie Extrême
          </h3>
          <p className="text-xs text-rose-100/90 mt-1 max-w-sm leading-relaxed">
            Une seule règle : pas d’erreur ! Tu as 3 vies pour répondre à un maximum de calculs consécutifs.
          </p>

          <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between">
            <span className="text-[11px] text-rose-200">
              Record : <strong className="text-white font-mono">{profile.statsByOperation.addition?.bestScore || 0} pts</strong>
            </span>
            <button
              onClick={handleStartSurvival}
              className="px-4 py-2 rounded-xl bg-white text-rose-700 hover:bg-rose-50 font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
            >
              <span>Relever le Défi</span>
              <Play className="w-3.5 h-3.5 fill-current" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Special Challenges: Examen & Défi Mental */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* EXAMEN OFFICIEL */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 flex flex-col justify-between shadow-xs hover:shadow-md transition-all">
          <div>
            <div className="w-11 h-11 rounded-2xl bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white font-display">
              Examen des 20 Questions
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Passe un test formel noté sur 20. Vise la mention Très Bien et le badge « Sans Faute » !
            </p>
          </div>

          <button
            onClick={handleStartExam}
            className="mt-4 w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
          >
            <span>Passer l’Examen</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* DÉFI MENTAL CHRONO */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 flex flex-col justify-between shadow-xs hover:shadow-md transition-all">
          <div>
            <div className="w-11 h-11 rounded-2xl bg-cyan-100 dark:bg-cyan-950/70 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-3">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white font-display">
              Sprint Calcul Mental
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Enchaîne les opérations combinées (additions, soustractions et multiplications imbriquées).
            </p>
          </div>

          <button
            onClick={handleStartChallenge}
            className="mt-4 w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
          >
            <span>Lancer le Sprint</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Explorateur interactif des Tables de Multiplication */}
      <div className="rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white font-display">
                Tables de Multiplication (1 à 12)
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Révise et mémorise facilement chaque table
              </p>
            </div>
          </div>

          <button
            onClick={() => handlePracticeTable(selectedTable)}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 active:scale-95 transition-transform"
          >
            <Play className="w-3 h-3 fill-white" />
            <span>Tester la table de {selectedTable}</span>
          </button>
        </div>

        {/* Table Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
            <button
              key={num}
              onClick={() => {
                sound.playClick();
                setSelectedTable(num);
              }}
              className={`w-9 h-9 shrink-0 rounded-xl font-mono font-bold text-xs transition-all ${
                selectedTable === num
                  ? 'bg-emerald-600 text-white shadow-sm scale-105'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              ×{num}
            </button>
          ))}
        </div>

        {/* Multiplication Grid Preview */}
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-200/60 dark:border-slate-800/80">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
            <div
              key={i}
              className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 text-xs font-mono flex items-center justify-between"
            >
              <span className="text-slate-500 dark:text-slate-400">
                {selectedTable} × {i} =
              </span>
              <strong className="text-emerald-600 dark:text-emerald-400 font-extrabold">
                {selectedTable * i}
              </strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
