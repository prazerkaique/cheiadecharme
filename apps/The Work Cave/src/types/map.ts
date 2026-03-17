export type TileId = 'grass' | 'path' | 'water' | 'flowers' | 'tree' | 'fence'

export interface Point {
  x: number
  y: number
}

export type Direction = 'up' | 'down' | 'left' | 'right'

export interface MapBuilding {
  id: string
  name: string
  type: 'tavern' | 'fountain' | 'project' | 'add_project'
  x: number
  y: number
  width: number
  height: number
  color: string
  icon: string
  route: string
  projectId?: string
}

export const NON_WALKABLE: TileId[] = ['tree', 'fence', 'water']

export const TILE_COLORS: Record<TileId, string> = {
  grass: '#4ade80',
  path: '#d4a574',
  water: '#60a5fa',
  flowers: '#f9a8d4',
  tree: '#166534',
  fence: '#92400e',
}

export const MAP_COLS = 20
export const MAP_ROWS = 14
export const TILE_SIZE = 48
