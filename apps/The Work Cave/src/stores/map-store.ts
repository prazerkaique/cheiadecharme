import { create } from 'zustand'
import type { Point, Direction, MapBuilding } from '@/types/map'
import { SPAWN_POINT } from '@/config/maps'

interface MapState {
  position: Point
  direction: Direction
  path: Point[]
  isMoving: boolean
  targetBuilding: MapBuilding | null

  // Actions
  setPosition: (pos: Point) => void
  setDirection: (dir: Direction) => void
  setPath: (path: Point[], target?: MapBuilding) => void
  advancePath: () => Point | null
  clearPath: () => void
  resetPosition: () => void
}

export const useMapStore = create<MapState>()((set, get) => ({
  position: SPAWN_POINT,
  direction: 'down',
  path: [],
  isMoving: false,
  targetBuilding: null,

  setPosition: (pos: Point) => set({ position: pos }),

  setDirection: (dir: Direction) => set({ direction: dir }),

  setPath: (path: Point[], target?: MapBuilding) =>
    set({ path, isMoving: path.length > 1, targetBuilding: target ?? null }),

  advancePath: () => {
    const { path } = get()
    if (path.length <= 1) {
      set({ path: [], isMoving: false })
      return null
    }
    const next = path[1]!
    const prev = path[0]!

    // Determine direction
    let dir: Direction = 'down'
    if (next.x > prev.x) dir = 'right'
    else if (next.x < prev.x) dir = 'left'
    else if (next.y > prev.y) dir = 'down'
    else if (next.y < prev.y) dir = 'up'

    set({
      position: next,
      direction: dir,
      path: path.slice(1),
      isMoving: path.length > 2,
    })
    return next
  },

  clearPath: () => set({ path: [], isMoving: false, targetBuilding: null }),

  resetPosition: () =>
    set({
      position: SPAWN_POINT,
      direction: 'down',
      path: [],
      isMoving: false,
      targetBuilding: null,
    }),
}))
