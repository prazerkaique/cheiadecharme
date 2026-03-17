import { useCallback, useMemo } from 'react'
import { TILE_SIZE, MAP_COLS, MAP_ROWS } from '@/types/map'
import type { MapBuilding } from '@/types/map'
import { FIXED_BUILDINGS, DEFAULT_PROJECTS, PROJECT_LOTS, PROJECT_BUILDING_SIZE } from '@/config/maps'
import { useQuestStore } from '@/stores/quest-store'
import { useCharacterMovement } from '@/hooks/useCharacterMovement'
import { TileLayer } from './TileLayer'
import { BuildingLayer } from './BuildingLayer'
import { CharacterSprite } from './CharacterSprite'

export function OverworldMap() {
  const projects = useQuestStore(s => s.projects)

  const allBuildings: MapBuilding[] = useMemo(() => {
    const projectBuildings: MapBuilding[] = projects.map((project, i) => {
      const defaultDef = DEFAULT_PROJECTS.find(d => d.id === project.id)
      const lot = PROJECT_LOTS[Math.max(0, i - DEFAULT_PROJECTS.length) % PROJECT_LOTS.length]!
      return {
        id: `project-${project.id}`,
        name: project.name,
        type: 'project' as const,
        x: project.map_x || lot.x,
        y: project.map_y || lot.y,
        width: defaultDef?.width ?? PROJECT_BUILDING_SIZE.width,
        height: defaultDef?.height ?? PROJECT_BUILDING_SIZE.height,
        color: project.color,
        icon: '',
        route: `/project/${project.id}`,
        projectId: project.id,
      }
    })
    return [...FIXED_BUILDINGS, ...projectBuildings]
  }, [projects])

  const { walkTo } = useCharacterMovement(allBuildings)

  const handleBuildingClick = useCallback(
    (building: MapBuilding) => {
      const target = {
        x: building.x + Math.floor(building.width / 2),
        y: building.y + building.height,
      }
      walkTo(target, building)
    },
    [walkTo]
  )

  const mapWidth = MAP_COLS * TILE_SIZE
  const mapHeight = MAP_ROWS * TILE_SIZE

  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden bg-bg-dark">
      <div className="map-frame relative" style={{ width: mapWidth, height: mapHeight }}>
        <div className="relative w-full h-full overflow-hidden">
          <TileLayer />
          <BuildingLayer onBuildingClick={handleBuildingClick} />
          <CharacterSprite />
          <div className="absolute inset-0 pointer-events-none map-vignette" />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at 40% 30%, rgba(255,255,200,0.06) 0%, transparent 60%)',
            }}
          />
        </div>
      </div>
    </div>
  )
}
