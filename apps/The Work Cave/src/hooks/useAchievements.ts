import { useEffect, useRef } from 'react'
import { useGameStore } from '@/stores/game-store'
import { useQuestStore } from '@/stores/quest-store'
import { useInventoryStore } from '@/stores/inventory-store'
import { useTimerStore } from '@/stores/timer-store'
import { useUIStore } from '@/stores/ui-store'
import { checkAchievements } from '@/lib/achievements'
import type { AchievementContext } from '@/types/game'

// Simple in-memory unlocked keys (will be persisted via Supabase later)
const unlockedKeys: string[] = []

export function useAchievements() {
  const level = useGameStore(s => s.character.level)
  const quests = useQuestStore(s => s.quests)
  const items = useInventoryStore(s => s.items)
  const pomodoroCount = useTimerStore(s => s.pomodoroCount)
  const prevCheckRef = useRef<string>('')

  useEffect(() => {
    const completedQuests = quests.filter(q => q.status === 'done').length
    const bossesDefeated = quests.filter(q => q.is_boss && q.status === 'done').length

    const ctx: AchievementContext = {
      totalQuests: completedQuests,
      totalCoffee: items['coffee_potion'] ?? 0,
      totalWater: items['water_flask'] ?? 0,
      totalPomodoros: pomodoroCount,
      totalBosses: bossesDefeated,
      level,
      streakDays: 0, // TODO: calculate from daily_logs
    }

    const checkKey = JSON.stringify(ctx)
    if (checkKey === prevCheckRef.current) return
    prevCheckRef.current = checkKey

    const newAchievements = checkAchievements(ctx, unlockedKeys)
    for (const achievement of newAchievements) {
      unlockedKeys.push(achievement.key)
      useUIStore.getState().addToast({
        message: `Achievement: ${achievement.name}!`,
        type: 'achievement',
        icon: achievement.icon,
        duration: 5000,
      })
    }
  }, [level, quests, items, pomodoroCount])
}
