import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Character, Stats, StatName } from '@/types/game'
import type { CharacterBuild } from '@/types/character'
import { DEFAULT_HP_MAX, DEFAULT_MP_MAX, DEFAULT_STAT_VALUE } from '@/config/constants'
import { calculateStats } from '@/config/character'
import { levelFromXp, levelProgress } from '@/config/game-balance'
import { v4 as uuid } from 'uuid'

interface GameState {
  character: Character
  levelProgress: number

  // Actions
  initCharacter: (build: CharacterBuild) => void
  addXp: (amount: number) => { leveled: boolean; newLevel: number }
  addStatPoint: (stat: StatName, amount?: number) => void
  takeDamage: (amount: number) => void
  restoreHp: (amount: number) => void
  useMp: (amount: number) => void
  restoreMp: (amount: number) => void
  dailyReset: () => void
}

function defaultCharacter(): Character {
  return {
    id: uuid(),
    name: 'Hero',
    level: 1,
    xp_total: 0,
    hp: DEFAULT_HP_MAX,
    hp_max: DEFAULT_HP_MAX,
    mp: DEFAULT_MP_MAX,
    mp_max: DEFAULT_MP_MAX,
    stats: {
      str: DEFAULT_STAT_VALUE,
      dex: DEFAULT_STAT_VALUE,
      con: DEFAULT_STAT_VALUE,
      int: DEFAULT_STAT_VALUE,
      wis: DEFAULT_STAT_VALUE,
      cha: DEFAULT_STAT_VALUE,
    },
    race: 'human',
    class: 'warrior',
    appearance: {
      skinColor: '#f5c49c',
      hairColor: '#4a2810',
      outfitColor: '#2563eb',
    },
    equipment: {
      weapon: '',
      armor: '',
      accessory: '',
    },
    isCreated: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      character: defaultCharacter(),
      levelProgress: 0,

      initCharacter: (build: CharacterBuild) => {
        const stats = calculateStats(build.race, build.class, build.equipment, DEFAULT_STAT_VALUE)
        set({
          character: {
            ...defaultCharacter(),
            name: build.name,
            race: build.race,
            class: build.class,
            appearance: build.appearance,
            equipment: build.equipment,
            stats,
            isCreated: true,
          },
          levelProgress: 0,
        })
      },

      addXp: (amount: number) => {
        const prev = get().character
        const prevLevel = prev.level
        const newXp = prev.xp_total + amount
        const newLevel = levelFromXp(newXp)
        const progress = levelProgress(newXp)
        const leveled = newLevel > prevLevel

        set({
          character: {
            ...prev,
            xp_total: newXp,
            level: newLevel,
            updated_at: new Date().toISOString(),
          },
          levelProgress: progress,
        })

        return { leveled, newLevel }
      },

      addStatPoint: (stat: StatName, amount = 1) => {
        set(state => {
          const stats: Stats = { ...state.character.stats }
          stats[stat] = Math.min(20, stats[stat] + amount)
          return {
            character: {
              ...state.character,
              stats,
              updated_at: new Date().toISOString(),
            },
          }
        })
      },

      takeDamage: (amount: number) => {
        set(state => ({
          character: {
            ...state.character,
            hp: Math.max(0, state.character.hp - amount),
          },
        }))
      },

      restoreHp: (amount: number) => {
        set(state => ({
          character: {
            ...state.character,
            hp: Math.min(state.character.hp_max, state.character.hp + amount),
          },
        }))
      },

      useMp: (amount: number) => {
        set(state => ({
          character: {
            ...state.character,
            mp: Math.max(0, state.character.mp - amount),
          },
        }))
      },

      restoreMp: (amount: number) => {
        set(state => ({
          character: {
            ...state.character,
            mp: Math.min(state.character.mp_max, state.character.mp + amount),
          },
        }))
      },

      dailyReset: () => {
        set(state => ({
          character: {
            ...state.character,
            hp: state.character.hp_max,
            mp: state.character.mp_max,
          },
        }))
      },
    }),
    { name: 'quest-board-game' }
  )
)
