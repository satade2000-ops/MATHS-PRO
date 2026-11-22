import { DifficultyLevel } from '../types/math';

export interface StageConfig {
  stage: number;
  difficulty: DifficultyLevel;
  targetScore: number;
}

const DIFFICULTY_ORDER: DifficultyLevel[] = ['beginner', 'easy', 'medium', 'hard', 'expert'];

const STAGE_TARGET_SCORES = [100, 150, 220, 300, 400];

export function getDifficultyForStage(stage: number): DifficultyLevel {
  const safeStage = Math.max(1, Math.floor(stage));
  const idx = Math.min(safeStage - 1, DIFFICULTY_ORDER.length - 1);
  return DIFFICULTY_ORDER[idx];
}

export function getStageForDifficulty(difficulty: DifficultyLevel): number {
  const idx = DIFFICULTY_ORDER.indexOf(difficulty);
  return idx >= 0 ? idx + 1 : 1;
}

export function getTargetScoreForStage(stage: number): number {
  const safeStage = Math.max(1, Math.floor(stage));
  if (safeStage <= STAGE_TARGET_SCORES.length) {
    return STAGE_TARGET_SCORES[safeStage - 1];
  }
  return 400 + (safeStage - STAGE_TARGET_SCORES.length) * 100;
}

export function getStageConfig(stage: number): StageConfig {
  const safeStage = Math.max(1, Math.floor(stage));
  return {
    stage: safeStage,
    difficulty: getDifficultyForStage(safeStage),
    targetScore: getTargetScoreForStage(safeStage),
  };
}
