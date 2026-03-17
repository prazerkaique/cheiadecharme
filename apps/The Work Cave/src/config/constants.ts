import type { StatName, QuestDifficulty, AchievementRarity } from '@/types/game'

export const STAT_LABELS: Record<StatName, string> = {
  str: 'Strength',
  dex: 'Dexterity',
  con: 'Constitution',
  int: 'Intelligence',
  wis: 'Wisdom',
  cha: 'Charisma',
}

export const STAT_COLORS: Record<StatName, string> = {
  str: '#ef4444',
  dex: '#22c55e',
  con: '#f97316',
  int: '#3b82f6',
  wis: '#a855f7',
  cha: '#ec4899',
}

export const DIFFICULTY_XP: Record<QuestDifficulty, number> = {
  trivial: 10,
  easy: 25,
  medium: 50,
  hard: 100,
  legendary: 250,
}

export const DIFFICULTY_COLORS: Record<QuestDifficulty, string> = {
  trivial: '#9ca3af',
  easy: '#22c55e',
  medium: '#3b82f6',
  hard: '#f97316',
  legendary: '#a855f7',
}

export const RARITY_COLORS: Record<AchievementRarity, string> = {
  common: '#9ca3af',
  uncommon: '#22c55e',
  rare: '#3b82f6',
  epic: '#a855f7',
  legendary: '#f59e0b',
}

export const CATEGORY_STAT: Record<string, StatName> = {
  feature: 'str',
  bugfix: 'dex',
  refactor: 'con',
  study: 'int',
  planning: 'wis',
  communication: 'cha',
  other: 'str',
}

export const POMODORO_XP = 30
export const COFFEE_XP = 5
export const WATER_XP = 5
export const COFFEE_MP_RESTORE = 20
export const WATER_HP_RESTORE = 15
export const HP_LOSS_PER_HOUR = 10
export const MP_LOSS_PER_POMODORO = 10
export const DEFAULT_HP_MAX = 100
export const DEFAULT_MP_MAX = 50
export const DEFAULT_STAT_VALUE = 10
export const POMODORO_DURATION = 25 * 60 // 25 minutes in seconds
export const SHORT_BREAK = 5 * 60
export const LONG_BREAK = 15 * 60
