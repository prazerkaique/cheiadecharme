import { useCallback, useRef } from 'react'
import { useMapStore } from '@/stores/map-store'
import { useUIStore } from '@/stores/ui-store'
import { findPath } from '@/lib/pathfinding'
import { OVERWORLD_TILES } from '@/config/maps'
import type { MapBuilding, Point } from '@/types/map'
import { useNavigate } from 'react-router-dom'

const STEP_DURATION = 200 // ms per tile

export function useCharacterMovement(buildings: MapBuilding[]) {
  const navigate = useNavigate()
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const walkTo = useCallback(
    (target: Point, building?: MapBuilding) => {
      const position = useMapStore.getState().position

      // Calculate path
      const path = findPath(position, target, OVERWORLD_TILES, buildings, building)
      if (path.length <= 1) return

      // Clear any existing movement
      if (intervalRef.current) clearInterval(intervalRef.current)

      useMapStore.getState().setPath(path, building)

      // Animate step by step
      intervalRef.current = setInterval(() => {
        const next = useMapStore.getState().advancePath()
        if (!next) {
          clearInterval(intervalRef.current!)
          intervalRef.current = null

          // Arrived at building — navigate
          if (building) {
            useUIStore.getState().setView('interior')
            navigate(building.route)
          }
        }
      }, STEP_DURATION)
    },
    [buildings, navigate]
  )

  const stopMovement = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    useMapStore.getState().clearPath()
  }, [])

  return { walkTo, stopMovement }
}
