export type OperationType =
  | 'addition'
  | 'subtraction'
  | 'multiplication'
  | 'division'
  | 'mental_math'
  | 'square_root'
  | 'percentage'
  | 'power'
  | 'fraction'
  | 'equation';

export type DifficultyLevel = 'beginner' | 'easy' | 'medium' | 'hard' | 'expert';

export type GameMode = 'learning' | 'timed' | 'challenge' | 'exam' | 'survival';

export type InputMethod = 'multiple_choice' | 'numpad';

export interface MathQuestion {
  id: string;
  operation: OperationType;
  difficulty: DifficultyLevel;
  questionText: string;
  operand1?: number | string;
  operand2?: number | string;
  operatorSymbol: string;
  correctAnswer: number | string;
  options: (number | string)[];
  explanation: {
    fr: string;
    en: string;
  };
  hint?: {
    fr: string;
    en: string;
  };
}

export interface QuestionAnswerRecord {
  question: MathQuestion;
  userAnswer: number | string;
  isCorrect: boolean;
  timeSpentMs: number;
}

export interface GameResult {
  id: string;
  score: number;
  correctCount: number;
  incorrectCount: number;
  totalQuestions: number;
  accuracy: number;
  timeSeconds: number;
  mode: GameMode;
  operation: OperationType;
  difficulty: DifficultyLevel;
  date: string;
  xpEarned: number;
  starsEarned: number;
  isNewRecord: boolean;
  historyRecords?: QuestionAnswerRecord[];
}

export interface OperationStat {
  played: number;
  correct: number;
  total: number;
  bestScore: number;
  stars: number;
}

export interface Badge {
  id: string;
  title: { fr: string; en: string };
  description: { fr: string; en: string };
  icon: string;
  color: string;
  unlockedAt?: string;
  condition: string;
}

export interface UserProfile {
  name: string;
  avatarId: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalStars: number;
  coins: number;
  streakDays: number;
  lastPlayedDate: string;
  dailyRewardClaimed: boolean;
  isPremium: boolean;
  unlockedBadges: string[];
  statsByOperation: Record<OperationType, OperationStat>;
  gameHistory: GameResult[];
}

export interface AppSettings {
  language: 'fr' | 'en';
  darkMode: boolean;
  soundEnabled: boolean;
  musicEnabled: boolean;
  defaultInputMethod: InputMethod;
  timedDuration: 30 | 60 | 120;
  examQuestionsCount: 10 | 20 | 50;
  selectedDifficulty: DifficultyLevel;
}
