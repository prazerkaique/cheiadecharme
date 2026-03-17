import type { AchievementDef, AchievementContext } from '@/types/game'

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    key: 'first_quest',
    name: 'First Steps',
    description: 'Complete your first quest',
    icon: '⚔️',
    rarity: 'common',
    check: (ctx: AchievementContext) => ctx.totalQuests >= 1,
  },
  {
    key: 'quest_10',
    name: 'Adventurer',
    description: 'Complete 10 quests',
    icon: '🗡️',
    rarity: 'uncommon',
    check: (ctx: AchievementContext) => ctx.totalQuests >= 10,
  },
  {
    key: 'quest_100',
    name: 'Quest Master',
    description: 'Complete 100 quests',
    icon: '👑',
    rarity: 'epic',
    check: (ctx: AchievementContext) => ctx.totalQuests >= 100,
  },
  {
    key: 'first_coffee',
    name: 'Caffeine Initiate',
    description: 'Drink your first coffee',
    icon: '☕',
    rarity: 'common',
    check: (ctx: AchievementContext) => ctx.totalCoffee >= 1,
  },
  {
    key: 'coffee_100',
    name: 'Coffee Addict',
    description: 'Drink 100 coffees',
    icon: '🫖',
    rarity: 'rare',
    check: (ctx: AchievementContext) => ctx.totalCoffee >= 100,
  },
  {
    key: 'water_50',
    name: 'Hydration Hero',
    description: 'Drink 50 waters',
    icon: '💧',
    rarity: 'uncommon',
    check: (ctx: AchievementContext) => ctx.totalWater >= 50,
  },
  {
    key: 'pomodoro_50',
    name: 'Focus Master',
    description: 'Complete 50 pomodoro sessions',
    icon: '🍅',
    rarity: 'rare',
    check: (ctx: AchievementContext) => ctx.totalPomodoros >= 50,
  },
  {
    key: 'streak_7',
    name: 'Week Warrior',
    description: '7-day work streak',
    icon: '🔥',
    rarity: 'uncommon',
    check: (ctx: AchievementContext) => ctx.streakDays >= 7,
  },
  {
    key: 'streak_30',
    name: 'Monthly Champion',
    description: '30-day work streak',
    icon: '💪',
    rarity: 'epic',
    check: (ctx: AchievementContext) => ctx.streakDays >= 30,
  },
  {
    key: 'first_boss',
    name: 'Boss Slayer',
    description: 'Defeat your first boss',
    icon: '🐉',
    rarity: 'rare',
    check: (ctx: AchievementContext) => ctx.totalBosses >= 1,
  },
  {
    key: 'level_10',
    name: 'Rising Hero',
    description: 'Reach level 10',
    icon: '⬆️',
    rarity: 'uncommon',
    check: (ctx: AchievementContext) => ctx.level >= 10,
  },
  {
    key: 'level_25',
    name: 'Veteran',
    description: 'Reach level 25',
    icon: '🌟',
    rarity: 'rare',
    check: (ctx: AchievementContext) => ctx.level >= 25,
  },
  {
    key: 'level_50',
    name: 'Legendary',
    description: 'Reach level 50',
    icon: '✨',
    rarity: 'legendary',
    check: (ctx: AchievementContext) => ctx.level >= 50,
  },
]

export function checkAchievements(
  ctx: AchievementContext,
  unlockedKeys: string[]
): AchievementDef[] {
  return ACHIEVEMENTS.filter(
    a => !unlockedKeys.includes(a.key) && a.check(ctx)
  )
}
