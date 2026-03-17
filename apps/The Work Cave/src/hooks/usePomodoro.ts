import { useEffect, useRef } from 'react'
import { useTimerStore } from '@/stores/timer-store'
import { useGameStore } from '@/stores/game-store'
import { useInventoryStore } from '@/stores/inventory-store'
import { useUIStore } from '@/stores/ui-store'
import { POMODORO_XP, MP_LOSS_PER_POMODORO } from '@/config/constants'

export function usePomodoro() {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const isRunning = useTimerStore(s => s.isRunning)
  const tick = useTimerStore(s => s.tick)

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        const completed = tick()
        if (completed) {
          const mode = useTimerStore.getState().mode
          // Was a work session that just completed
          if (mode !== 'work') {
            // Pomodoro completed — reward!
            const { leveled, newLevel } = useGameStore.getState().addXp(POMODORO_XP)
            useGameStore.getState().useMp(MP_LOSS_PER_POMODORO)
            useInventoryStore.getState().addItem('quest_scroll')

            useUIStore.getState().addToast({
              message: `Pomodoro complete! +${POMODORO_XP} XP`,
              type: 'xp',
              icon: '🍅',
            })

            if (leveled) {
              useUIStore.getState().openModal('level_up')
              useUIStore.getState().addToast({
                message: `Level Up! You are now level ${newLevel}!`,
                type: 'level_up',
                icon: '⬆️',
                duration: 5000,
              })
            }
          }
        }
      }, 1000)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning, tick])
}
