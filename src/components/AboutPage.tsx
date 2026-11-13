import React from 'react';
import {
  ArrowLeft,
  Home,
  Brain,
  Zap,
  Trophy,
  Users,
  Sparkles,
  BookOpen,
  Gamepad2,
  CheckCircle2,
} from 'lucide-react';
import { useMathApp } from '../context/MathContext';
import { OPERATIONS_METADATA } from '../utils/constants';
import { MascotEuler } from './MascotEuler';
import { sound } from '../utils/audio';

export const AboutPage: React.FC = () => {
  const { settings, goHome, setActiveTab } = useMathApp();
  const isFr = settings.language === 'fr';

  const handleBackHome = () => {
    sound.playClick();
    goHome();
  };

  const objectives = isFr
    ? [
        {
          icon: <BookOpen className="w-5 h-5" />,
          color: 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400',
          title: 'Faciliter l’apprentissage des mathématiques.',
          desc: 'Des explications claires après chaque réponse pour transformer chaque erreur en progrès.',
        },
        {
          icon: <Brain className="w-5 h-5" />,
          color: 'bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400',
          title: 'Développer l’esprit logique.',
          desc: 'Équations, fractions, puissances et racines carrées pour stimuler le raisonnement.',
        },
        {
          icon: <Zap className="w-5 h-5" />,
          color: 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400',
          title: 'Améliorer les capacités de calcul mental.',
          desc: 'Des modes chronométrés et combos pour gagner en réflexes et en confiance.',
        },
        {
          icon: <Trophy className="w-5 h-5" />,
          color: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400',
          title: 'Encourager la compétition positive.',
          desc: 'Système de niveaux, étoiles, trophées et classement pour rester motivé chaque jour.',
        },
        {
          icon: <Users className="w-5 h-5" />,
          color: 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400',
          title: 'Rendre les mathématiques accessibles à tous.',
          desc: '5 niveaux progressifs (Débutant à Expert), bilingue FR/EN et utilisable même hors-ligne.',
        },
      ]
    : [
        {
          icon: <BookOpen className="w-5 h-5" />,
          color: 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400',
          title: 'Make learning mathematics easier.',
          desc: 'Clear step-by-step explanations after questions turn mistakes into lasting progress.',
        },
        {
          icon: <Brain className="w-5 h-5" />,
          color: 'bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400',
          title: 'Develop logical thinking.',
          desc: 'Equations, fractions, powers, and square roots crafted to strengthen reasoning.',
        },
        {
          icon: <Zap className="w-5 h-5" />,
          color: 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400',
          title: 'Improve mental calculation speed.',
          desc: 'Timed sprints and streak combos to build sharp numerical reflexes.',
        },
        {
          icon: <Trophy className="w-5 h-5" />,
          color: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400',
          title: 'Encourage positive competition.',
          desc: 'Levels, stars, badges, and leaderboard rankings keep motivation high every day.',
        },
        {
          icon: <Users className="w-5 h-5" />,
          color: 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400',
          title: 'Make mathematics accessible to everyone.',
          desc: '5 progressive difficulty levels, bilingual FR/EN interface, and offline PWA support.',
        },
      ];

  return (
    <div className="space-y-6 pb-6 animate-fadeIn select-text">
      {/* Top Return Navigation */}
      <div>
        <button
          onClick={handleBackHome}
          className="inline-flex items-center gap-2 px-3.5 py-2 min-h-[44px] rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-indigo-400 dark:hover:border-indigo-500 text-xs font-bold shadow-xs active:scale-95 transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>{isFr ? "Retour à l'accueil" : 'Back to Home'}</span>
        </button>
      </div>

      {/* Mathematical Visual Hero Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-700 to-violet-800 text-white p-6 sm:p-7 shadow-xl shadow-indigo-500/20 overflow-hidden">
        {/* Decorative Math SVG & Floating Symbols */}
        <svg
          aria-hidden="true"
          viewBox="0 0 400 220"
          className="absolute inset-0 w-full h-full opacity-15 pointer-events-none"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <pattern id="about-math-grid" width="28" height="28" patternUnits="userSpaceOnUse">
              <path d="M 28 0 L 0 0 0 28" fill="none" stroke="white" strokeWidth="0.7" />
            </pattern>
          </defs>
          <rect width="400" height="220" fill="url(#about-math-grid)" />
          <path
            d="M 10 175 Q 95 65 190 120 T 390 45"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeDasharray="6 4"
          />
          <circle cx="330" cy="60" r="42" fill="none" stroke="white" strokeWidth="2" />
          <polygon points="48,185 88,120 128,185" fill="none" stroke="white" strokeWidth="2" />
        </svg>

        {/* Floating Symbolic Badges */}
        <div
          aria-hidden="true"
          className="absolute top-4 right-5 hidden sm:flex items-center gap-2 opacity-80 pointer-events-none"
        >
          <span className="w-8 h-8 rounded-lg bg-white/15 backdrop-blur-xs flex items-center justify-center font-mono font-bold text-sm">
            π
          </span>
          <span className="w-8 h-8 rounded-lg bg-white/15 backdrop-blur-xs flex items-center justify-center font-mono font-bold text-sm">
            ∑
          </span>
          <span className="w-8 h-8 rounded-lg bg-white/15 backdrop-blur-xs flex items-center justify-center font-mono font-bold text-sm">
            √
          </span>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="space-y-3 flex-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-[11px] font-bold uppercase tracking-wider text-indigo-100">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{isFr ? 'À propos de MATHS PRO' : 'About MATHS PRO'}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight leading-tight text-white">
              {isFr
                ? "MATHS PRO – Apprendre les mathématiques en s'amusant."
                : 'MATHS PRO – Learn mathematics while having fun.'}
            </h1>

            <div className="space-y-2 text-xs sm:text-sm text-indigo-100/95 leading-relaxed">
              <p>
                {isFr
                  ? "MATHS PRO est une plateforme éducative interactive conçue pour rendre l'apprentissage des mathématiques plus amusant, accessible et stimulant."
                  : 'MATHS PRO is an interactive educational platform designed to make learning mathematics more fun, accessible, and engaging.'}
              </p>
              <p>
                {isFr
                  ? "Grâce à des jeux, des exercices et des défis mathématiques, les utilisateurs peuvent développer leur logique, améliorer leur rapidité de calcul et renforcer leurs connaissances tout en s'amusant."
                  : 'Through math games, exercises, and challenges, learners can build logical reasoning, improve calculation speed, and strengthen their skills while having fun.'}
              </p>
            </div>
          </div>

          <div className="shrink-0 self-center sm:self-end flex flex-col items-center gap-2">
            <MascotEuler size="lg" mood="teaching" />
            <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-indigo-100 bg-black/20 px-2.5 py-1 rounded-full">
              <span>+</span>
              <span>−</span>
              <span>×</span>
              <span>÷</span>
              <span>x²</span>
              <span>%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Nos Objectifs */}
      <section className="rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            {isFr ? 'Notre mission' : 'Our Mission'}
          </span>
          <h2 className="text-xl font-black text-slate-900 dark:text-white font-display mt-0.5">
            {isFr ? 'Nos objectifs' : 'Our Objectives'}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {objectives.map((obj, index) => (
            <div
              key={index}
              className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${obj.color}`}>
                {obj.icon}
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white font-display flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{obj.title}</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                  {obj.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Rich Visual Math Showcase: 10 Modules & Numbers */}
      <section className="rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white font-display">
              {isFr ? 'Un univers mathématique complet' : 'A Complete Math Universe'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isFr
                ? '10 disciplines interactives, 5 modes de jeu et 5 niveaux de progression'
                : '10 interactive math modules, 5 game modes, and 5 difficulty levels'}
            </p>
          </div>
          <div className="font-mono font-black text-sm px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shrink-0">
            10 × 5 × 5
          </div>
        </div>

        {/* 10 Math Symbol Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {OPERATIONS_METADATA.map((op) => (
            <div
              key={op.type}
              className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 flex items-center sm:flex-col sm:text-center gap-2.5 sm:gap-1.5"
            >
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${op.gradient} text-white flex items-center justify-center font-black text-lg shadow-xs shrink-0`}
              >
                {op.symbol}
              </div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                {isFr
                  ? {
                      addition: 'Addition',
                      subtraction: 'Soustraction',
                      multiplication: 'Multiplication',
                      division: 'Division',
                      mental_math: 'Calcul Mental',
                      square_root: 'Racines Carrées',
                      percentage: 'Pourcentages',
                      power: 'Puissances',
                      fraction: 'Fractions',
                      equation: 'Équations',
                    }[op.type]
                  : {
                      addition: 'Addition',
                      subtraction: 'Subtraction',
                      multiplication: 'Multiplication',
                      division: 'Division',
                      mental_math: 'Mental Math',
                      square_root: 'Square Roots',
                      percentage: 'Percentages',
                      power: 'Powers',
                      fraction: 'Fractions',
                      equation: 'Equations',
                    }[op.type]}
              </span>
            </div>
          ))}
        </div>

        {/* Key Numbers Strip */}
        <div className="grid grid-cols-3 gap-2.5 pt-1">
          <div className="p-3 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/60 text-center">
            <div className="text-xl font-black font-mono text-indigo-600 dark:text-indigo-400">10</div>
            <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
              {isFr ? 'Modules maths' : 'Math modules'}
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 text-center">
            <div className="text-xl font-black font-mono text-emerald-600 dark:text-emerald-400">5</div>
            <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
              {isFr ? 'Modes de jeu' : 'Game modes'}
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/60 text-center">
            <div className="text-xl font-black font-mono text-amber-600 dark:text-amber-400">100%</div>
            <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
              {isFr ? 'Sans inscription' : 'No sign-up'}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Action Buttons */}
      <div className="flex flex-wrap items-center gap-2.5">
        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('games');
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm active:scale-95 transition-all"
        >
          <Gamepad2 className="w-4 h-4" />
          <span>{isFr ? 'Explorer les Jeux' : 'Explore Games'}</span>
        </button>

        <button
          onClick={handleBackHome}
          className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 text-slate-700 dark:text-slate-200 text-xs font-bold shadow-xs active:scale-95 transition-all"
        >
          <Home className="w-4 h-4" />
          <span>{isFr ? "Retour à l'accueil" : 'Back to Home'}</span>
        </button>
      </div>
    </div>
  );
};
