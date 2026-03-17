import { FIXED_BUILDINGS, DEFAULT_PROJECTS, PROJECT_LOTS, PROJECT_BUILDING_SIZE } from '@/config/maps'
import { useQuestStore } from '@/stores/quest-store'
import { Building } from './Building'
import type { MapBuilding } from '@/types/map'

interface BuildingLayerProps {
  onBuildingClick: (building: MapBuilding) => void
}

export function BuildingLayer({ onBuildingClick }: BuildingLayerProps) {
  const projects = useQuestStore(s => s.projects)

  const projectBuildings: MapBuilding[] = projects.map((project, i) => {
    // Check if this is a default project with custom sizing
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

  const allBuildings = [...FIXED_BUILDINGS, ...projectBuildings]

  return (
    <div className="absolute inset-0">
      {allBuildings.map(building => (
        <Building
          key={building.id}
          building={building}
          onClick={onBuildingClick}
        />
      ))}
    </div>
  )
}
