import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ItemKey } from '@/types/game'

interface InventoryState {
  items: Record<string, number>
  coffeeToday: number
  waterToday: number

  // Actions
  addItem: (key: ItemKey, quantity?: number) => void
  removeItem: (key: ItemKey, quantity?: number) => void
  getQuantity: (key: ItemKey) => number
  addCoffee: () => void
  addWater: () => void
  resetDaily: () => void
}

export const useInventoryStore = create<InventoryState>()(
  persist(
    (set, get) => ({
      items: {},
      coffeeToday: 0,
      waterToday: 0,

      addItem: (key: ItemKey, quantity = 1) => {
        set(state => ({
          items: {
            ...state.items,
            [key]: (state.items[key] ?? 0) + quantity,
          },
        }))
      },

      removeItem: (key: ItemKey, quantity = 1) => {
        set(state => ({
          items: {
            ...state.items,
            [key]: Math.max(0, (state.items[key] ?? 0) - quantity),
          },
        }))
      },

      getQuantity: (key: ItemKey) => get().items[key] ?? 0,

      addCoffee: () => {
        set(state => ({
          coffeeToday: state.coffeeToday + 1,
          items: {
            ...state.items,
            coffee_potion: (state.items['coffee_potion'] ?? 0) + 1,
          },
        }))
      },

      addWater: () => {
        set(state => ({
          waterToday: state.waterToday + 1,
          items: {
            ...state.items,
            water_flask: (state.items['water_flask'] ?? 0) + 1,
          },
        }))
      },

      resetDaily: () => set({ coffeeToday: 0, waterToday: 0 }),
    }),
    { name: 'quest-board-inventory' }
  )
)
