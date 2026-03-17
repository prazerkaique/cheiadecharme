import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { POMODORO_DURATION, SHORT_BREAK, LONG_BREAK } from '@/config/constants'

type TimerMode = 'work' | 'short_break' | 'long_break'

interface TimerState {
  mode: TimerMode
  secondsLeft: number
  isRunning: boolean
  pomodoroCount: number
  activeProjectId: string | null
  activeQuestId: string | null

  // Work session tracking
  workSessionStart: string | null
  totalWorkMinutesToday: number

  // Actions
  startTimer: (projectId?: string, questId?: string) => void
  pauseTimer: () => void
  resumeTimer: () => void
  tick: () => boolean // returns true when timer completes
  resetTimer: () => void
  switchMode: (mode: TimerMode) => void
  setActiveProject: (projectId: string | null) => void
  setActiveQuest: (questId: string | null) => void

  // Work session
  startWorkSession: () => void
  endWorkSession: () => void
  addWorkMinutes: (minutes: number) => void
  resetDailyWork: () => void
}

export const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => ({
      mode: 'work',
      secondsLeft: POMODORO_DURATION,
      isRunning: false,
      pomodoroCount: 0,
      activeProjectId: null,
      activeQuestId: null,
      workSessionStart: null,
      totalWorkMinutesToday: 0,

      startTimer: (projectId?: string, questId?: string) => {
        set({
          isRunning: true,
          activeProjectId: projectId ?? get().activeProjectId,
          activeQuestId: questId ?? get().activeQuestId,
        })
      },

      pauseTimer: () => set({ isRunning: false }),
      resumeTimer: () => set({ isRunning: true }),

      tick: () => {
        const { secondsLeft, mode, pomodoroCount } = get()
        if (secondsLeft <= 1) {
          const newCount = mode === 'work' ? pomodoroCount + 1 : pomodoroCount
          const nextMode: TimerMode =
            mode === 'work'
              ? newCount % 4 === 0
                ? 'long_break'
                : 'short_break'
              : 'work'
          const nextDuration =
            nextMode === 'work'
              ? POMODORO_DURATION
              : nextMode === 'short_break'
                ? SHORT_BREAK
                : LONG_BREAK
          set({
            secondsLeft: nextDuration,
            isRunning: false,
            mode: nextMode,
            pomodoroCount: newCount,
          })
          return true // timer completed
        }
        set({ secondsLeft: secondsLeft - 1 })
        return false
      },

      resetTimer: () => {
        const duration =
          get().mode === 'work'
            ? POMODORO_DURATION
            : get().mode === 'short_break'
              ? SHORT_BREAK
              : LONG_BREAK
        set({ secondsLeft: duration, isRunning: false })
      },

      switchMode: (mode: TimerMode) => {
        const duration =
          mode === 'work'
            ? POMODORO_DURATION
            : mode === 'short_break'
              ? SHORT_BREAK
              : LONG_BREAK
        set({ mode, secondsLeft: duration, isRunning: false })
      },

      setActiveProject: (projectId: string | null) =>
        set({ activeProjectId: projectId }),

      setActiveQuest: (questId: string | null) =>
        set({ activeQuestId: questId }),

      startWorkSession: () =>
        set({ workSessionStart: new Date().toISOString() }),

      endWorkSession: () => {
        const { workSessionStart } = get()
        if (workSessionStart) {
          const minutes = Math.floor(
            (Date.now() - new Date(workSessionStart).getTime()) / 60000
          )
          set(state => ({
            workSessionStart: null,
            totalWorkMinutesToday: state.totalWorkMinutesToday + minutes,
          }))
        }
      },

      addWorkMinutes: (minutes: number) =>
        set(state => ({
          totalWorkMinutesToday: state.totalWorkMinutesToday + minutes,
        })),

      resetDailyWork: () => set({ totalWorkMinutesToday: 0 }),
    }),
    {
      name: 'quest-board-timer',
      partialize: (state) => ({
        pomodoroCount: state.pomodoroCount,
        totalWorkMinutesToday: state.totalWorkMinutesToday,
      }),
    }
  )
)
