import { Badge, OperationType } from '../types/math';

export interface AvatarOption {
  id: string;
  name: string;
  emoji: string;
  color: string;
  bgColor: string;
  description: { fr: string; en: string };
  isPremium?: boolean;
}

export const AVATARS: AvatarOption[] = [
  {
    id: 'avatar_euler',
    name: 'Prof. Euler',
    emoji: '🧙‍♂️',
    color: 'text-indigo-600 dark:text-indigo-400',
    bgColor: 'bg-indigo-100 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-700',
    description: { fr: 'Le maître des théorèmes', en: 'Master of theorems' },
  },
  {
    id: 'avatar_owl',
    name: 'Archibald le Hibou',
    emoji: '🦉',
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700',
    description: { fr: 'Sage et réfléchi', en: 'Wise and thoughtful' },
  },
  {
    id: 'avatar_robot',
    name: 'Byte-9000',
    emoji: '🤖',
    color: 'text-cyan-600 dark:text-cyan-400',
    bgColor: 'bg-cyan-100 dark:bg-cyan-950/60 border-cyan-300 dark:border-cyan-700',
    description: { fr: 'Processeur ultra-rapide', en: 'Ultra-fast processor' },
  },
  {
    id: 'avatar_ninja',
    name: 'Ninja des Nombres',
    emoji: '🥷',
    color: 'text-rose-600 dark:text-rose-400',
    bgColor: 'bg-rose-100 dark:bg-rose-950/60 border-rose-300 dark:border-rose-700',
    description: { fr: 'Précis comme l’éclair', en: 'Precise as lightning' },
  },
  {
    id: 'avatar_astro',
    name: 'Cosmo Math',
    emoji: '🧑‍🚀',
    color: 'text-violet-600 dark:text-violet-400',
    bgColor: 'bg-violet-100 dark:bg-violet-950/60 border-violet-300 dark:border-violet-700',
    description: { fr: 'Explore les confins de l’infini', en: 'Explores the ends of infinity' },
  },
  {
    id: 'avatar_fox',
    name: 'Félix le Renard',
    emoji: '🦊',
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-100 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700',
    description: { fr: 'Rusé dans chaque équation', en: 'Clever in every equation' },
  },
  {
    id: 'avatar_dragon',
    name: 'Pythagore le Dragon',
    emoji: '🐉',
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-100 dark:bg-purple-950/60 border-purple-300 dark:border-purple-700',
    description: { fr: 'Flamme de la logique (VIP)', en: 'Flame of logic (VIP)' },
    isPremium: true,
  },
  {
    id: 'avatar_einstein',
    name: 'Génie Galactique',
    emoji: '👑',
    color: 'text-yellow-600 dark:text-yellow-400',
    bgColor: 'bg-yellow-100 dark:bg-yellow-950/60 border-yellow-300 dark:border-yellow-700',
    description: { fr: 'Couronne suprême des maths (VIP)', en: 'Supreme crown of math (VIP)' },
    isPremium: true,
  },
];

export const BADGES: Badge[] = [
  {
    id: 'badge_first_step',
    title: { fr: 'Premier Pas', en: 'First Step' },
    description: { fr: 'Joue ta toute première partie de maths.', en: 'Play your first ever math match.' },
    icon: '🎓',
    color: 'from-blue-500 to-indigo-600',
    condition: 'first_game',
  },
  {
    id: 'badge_speedy',
    title: { fr: 'Calculateur Éclair', en: 'Lightning Calculator' },
    description: { fr: 'Réponds à 10 calculs en mode Chrono.', en: 'Answer 10 problems in Timed mode.' },
    icon: '⚡',
    color: 'from-amber-400 to-orange-500',
    condition: 'timed_10',
  },
  {
    id: 'badge_perfect',
    title: { fr: 'Sans Faute', en: 'Flawless' },
    description: { fr: 'Obtiens 100% de réussite lors d’un examen.', en: 'Score 100% accuracy in Exam mode.' },
    icon: '🎯',
    color: 'from-emerald-500 to-teal-600',
    condition: 'accuracy_100',
  },
  {
    id: 'badge_mult_master',
    title: { fr: 'Maître des Tables', en: 'Tables Master' },
    description: { fr: 'Réussis 25 multiplications.', en: 'Successfully solve 25 multiplications.' },
    icon: '✖️',
    color: 'from-purple-500 to-pink-600',
    condition: 'mult_25',
  },
  {
    id: 'badge_div_ace',
    title: { fr: 'As de la Division', en: 'Division Ace' },
    description: { fr: 'Réussis 20 divisions sans erreur.', en: 'Solve 20 divisions without errors.' },
    icon: '➗',
    color: 'from-cyan-500 to-blue-600',
    condition: 'div_20',
  },
  {
    id: 'badge_streak_fire',
    title: { fr: 'Série de Feu', en: 'Fire Combo' },
    description: { fr: 'Atteins un combo de 10 bonnes réponses d’affilée.', en: 'Reach a streak of 10 correct answers in a row.' },
    icon: '🔥',
    color: 'from-rose-500 to-red-600',
    condition: 'combo_10',
  },
  {
    id: 'badge_survival',
    title: { fr: 'Survivant Ultime', en: 'Ultimate Survivor' },
    description: { fr: 'Survis à plus de 15 vagues en mode Survie.', en: 'Survive 15+ rounds in Survival mode.' },
    icon: '🛡️',
    color: 'from-indigo-600 to-purple-700',
    condition: 'survival_15',
  },
  {
    id: 'badge_star_collector',
    title: { fr: 'Constellation', en: 'Star Collector' },
    description: { fr: 'Récolte au moins 15 étoiles de niveau.', en: 'Collect at least 15 stars.' },
    icon: '⭐',
    color: 'from-yellow-400 to-amber-500',
    condition: 'stars_15',
  },
  {
    id: 'badge_centurion',
    title: { fr: 'Centurion des Maths', en: 'Math Centurion' },
    description: { fr: 'Résous plus de 100 calculs au total.', en: 'Solve more than 100 math problems.' },
    icon: '👑',
    color: 'from-amber-500 to-yellow-600',
    condition: 'total_100',
  },
];

export interface OperationMeta {
  type: OperationType;
  titleKey: string;
  descKey: string;
  symbol: string;
  gradient: string;
  borderColor: string;
  textColor: string;
  bgColor: string;
  isMain: boolean;
}

export const OPERATIONS_METADATA: OperationMeta[] = [
  {
    type: 'addition',
    titleKey: 'addition',
    descKey: 'desc_addition',
    symbol: '+',
    gradient: 'from-blue-600 to-indigo-600',
    borderColor: 'border-blue-500/30',
    textColor: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-500/10',
    isMain: true,
  },
  {
    type: 'subtraction',
    titleKey: 'subtraction',
    descKey: 'desc_subtraction',
    symbol: '−',
    gradient: 'from-violet-600 to-purple-600',
    borderColor: 'border-violet-500/30',
    textColor: 'text-violet-600 dark:text-violet-400',
    bgColor: 'bg-violet-500/10',
    isMain: true,
  },
  {
    type: 'multiplication',
    titleKey: 'multiplication',
    descKey: 'desc_multiplication',
    symbol: '×',
    gradient: 'from-emerald-500 to-teal-600',
    borderColor: 'border-emerald-500/30',
    textColor: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    isMain: true,
  },
  {
    type: 'division',
    titleKey: 'division',
    descKey: 'desc_division',
    symbol: '÷',
    gradient: 'from-amber-500 to-orange-600',
    borderColor: 'border-amber-500/30',
    textColor: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-500/10',
    isMain: true,
  },
  {
    type: 'mental_math',
    titleKey: 'mental_math',
    descKey: 'desc_mental_math',
    symbol: '⚡',
    gradient: 'from-cyan-500 to-blue-600',
    borderColor: 'border-cyan-500/30',
    textColor: 'text-cyan-600 dark:text-cyan-400',
    bgColor: 'bg-cyan-500/10',
    isMain: false,
  },
  {
    type: 'square_root',
    titleKey: 'square_root',
    descKey: 'desc_square_root',
    symbol: '√',
    gradient: 'from-pink-500 to-rose-600',
    borderColor: 'border-pink-500/30',
    textColor: 'text-pink-600 dark:text-pink-400',
    bgColor: 'bg-pink-500/10',
    isMain: false,
  },
  {
    type: 'percentage',
    titleKey: 'percentage',
    descKey: 'desc_percentage',
    symbol: '%',
    gradient: 'from-teal-500 to-emerald-600',
    borderColor: 'border-teal-500/30',
    textColor: 'text-teal-600 dark:text-teal-400',
    bgColor: 'bg-teal-500/10',
    isMain: false,
  },
  {
    type: 'power',
    titleKey: 'power',
    descKey: 'desc_power',
    symbol: 'xⁿ',
    gradient: 'from-purple-500 to-indigo-600',
    borderColor: 'border-purple-500/30',
    textColor: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-500/10',
    isMain: false,
  },
  {
    type: 'fraction',
    titleKey: 'fraction',
    descKey: 'desc_fraction',
    symbol: '½',
    gradient: 'from-orange-500 to-amber-600',
    borderColor: 'border-orange-500/30',
    textColor: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-500/10',
    isMain: false,
  },
  {
    type: 'equation',
    titleKey: 'equation',
    descKey: 'desc_equation',
    symbol: 'x=',
    gradient: 'from-blue-600 to-cyan-600',
    borderColor: 'border-blue-500/30',
    textColor: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-500/10',
    isMain: false,
  },
  {
    type: 'geometry',
    titleKey: 'geometry',
    descKey: 'desc_geometry',
    symbol: '△',
    gradient: 'from-emerald-600 to-cyan-600',
    borderColor: 'border-emerald-500/30',
    textColor: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    isMain: false,
  },
  {
    type: 'functions',
    titleKey: 'functions',
    descKey: 'desc_functions',
    symbol: 'f(x)',
    gradient: 'from-indigo-600 to-violet-600',
    borderColor: 'border-indigo-500/30',
    textColor: 'text-indigo-600 dark:text-indigo-400',
    bgColor: 'bg-indigo-500/10',
    isMain: false,
  },
  {
    type: 'statistics',
    titleKey: 'statistics',
    descKey: 'desc_statistics',
    symbol: '📊',
    gradient: 'from-sky-500 to-indigo-600',
    borderColor: 'border-sky-500/30',
    textColor: 'text-sky-600 dark:text-sky-400',
    bgColor: 'bg-sky-500/10',
    isMain: false,
  },
  {
    type: 'probability',
    titleKey: 'probability',
    descKey: 'desc_probability',
    symbol: '🎲',
    gradient: 'from-fuchsia-500 to-purple-600',
    borderColor: 'border-fuchsia-500/30',
    textColor: 'text-fuchsia-600 dark:text-fuchsia-400',
    bgColor: 'bg-fuchsia-500/10',
    isMain: false,
  },
];

export interface LeaderboardUser {
  id: string;
  name: string;
  avatarEmoji: string;
  score: number;
  level: number;
  country: string;
  league: string;
}

export const INITIAL_LEADERBOARD: LeaderboardUser[] = [
  { id: '1', name: 'Sophie Martin', avatarEmoji: '🧙‍♀️', score: 9840, level: 32, country: '🇫🇷', league: 'Diamant' },
  { id: '2', name: 'Lucas Chen', avatarEmoji: '🤖', score: 8920, level: 29, country: '🇨🇦', league: 'Diamant' },
  { id: '3', name: 'Alexandre Roy', avatarEmoji: '🦉', score: 8150, level: 27, country: '🇧🇪', league: 'Platine' },
  { id: '4', name: 'Elena Kowalski', avatarEmoji: '🥷', score: 7600, level: 24, country: '🇨🇭', league: 'Platine' },
  { id: '5', name: 'Youcef Benali', avatarEmoji: '🧑‍🚀', score: 6940, level: 22, country: '🇫🇷', league: 'Or' },
  { id: '6', name: 'Emma Wilson', avatarEmoji: '🦊', score: 6200, level: 20, country: '🇬🇧', league: 'Or' },
  { id: '7', name: 'David Kim', avatarEmoji: '⚡', score: 5540, level: 18, country: '🇺🇸', league: 'Argent' },
  { id: '8', name: 'Inès Dupont', avatarEmoji: '🌟', score: 4890, level: 16, country: '🇫🇷', league: 'Argent' },
];
