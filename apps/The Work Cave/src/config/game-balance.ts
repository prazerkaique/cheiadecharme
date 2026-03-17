import type { QuestDifficulty } from '@/types/game'
import { DIFFICULTY_XP } from './constants'

/** XP required to reach level n (cumulative from level 1) */
export function xpForLevel(n: number): number {
  if (n <= 1) return 0
  return Math.floor(100 * Math.pow(n, 1.8))
}

/** Current level from total XP */
export function levelFromXp(totalXp: number): number {
  let level = 1
  while (xpForLevel(level + 1) <= totalXp) {
    level++
  }
  return level
}

/** Progress toward next level as 0-1 */
export function levelProgress(totalXp: number): number {
  const level = levelFromXp(totalXp)
  const currentLevelXp = xpForLevel(level)
  const nextLevelXp = xpForLevel(level + 1)
  const range = nextLevelXp - currentLevelXp
  if (range <= 0) return 1
  return (totalXp - currentLevelXp) / range
}

/** XP reward for a quest based on difficulty */
export function questXpReward(difficulty: QuestDifficulty): number {
  return DIFFICULTY_XP[difficulty]
}

/** Bonus XP for streak days */
export function streakBonus(streakDays: number): number {
  if (streakDays >= 30) return 50
  if (streakDays >= 14) return 30
  if (streakDays >= 7) return 20
  if (streakDays >= 3) return 10
  return 0
}

/** Boss bonus XP (50% extra if completed before deadline) */
export function bossXpBonus(baseXp: number): number {
  return Math.floor(baseXp * 0.5)
}
