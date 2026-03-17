import type { Point, TileId } from '@/types/map'
import { NON_WALKABLE, MAP_COLS, MAP_ROWS } from '@/types/map'
import type { MapBuilding } from '@/types/map'

interface Node {
  x: number
  y: number
  g: number
  h: number
  f: number
  parent: Node | null
}

function heuristic(a: Point, b: Point): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
}

function key(p: Point): string {
  return `${p.x},${p.y}`
}

const DIRS: Point[] = [
  { x: 0, y: -1 }, // up
  { x: 0, y: 1 },  // down
  { x: -1, y: 0 }, // left
  { x: 1, y: 0 },  // right
]

/** Check if a tile is walkable (not a non-walkable tile and not inside a building) */
function isWalkable(
  x: number,
  y: number,
  grid: TileId[][],
  buildings: MapBuilding[],
  targetBuilding?: MapBuilding
): boolean {
  if (x < 0 || x >= MAP_COLS || y < 0 || y >= MAP_ROWS) return false
  if (NON_WALKABLE.includes(grid[y]![x]!)) return false

  // Check building collision (skip target building entrance area)
  for (const b of buildings) {
    if (b === targetBuilding) continue
    if (x >= b.x && x < b.x + b.width && y >= b.y && y < b.y + b.height) {
      return false
    }
  }

  return true
}

/** A* pathfinding on the overworld grid */
export function findPath(
  start: Point,
  end: Point,
  grid: TileId[][],
  buildings: MapBuilding[],
  targetBuilding?: MapBuilding
): Point[] {
  const open: Node[] = []
  const closed = new Set<string>()

  // Find the entrance point (bottom-center of building)
  let goal = end
  if (targetBuilding) {
    goal = {
      x: targetBuilding.x + Math.floor(targetBuilding.width / 2),
      y: targetBuilding.y + targetBuilding.height,
    }
    // Clamp to grid
    if (goal.y >= MAP_ROWS) goal.y = MAP_ROWS - 1
  }

  const startNode: Node = {
    x: start.x,
    y: start.y,
    g: 0,
    h: heuristic(start, goal),
    f: heuristic(start, goal),
    parent: null,
  }

  open.push(startNode)

  while (open.length > 0) {
    // Find lowest f
    open.sort((a, b) => a.f - b.f)
    const current = open.shift()!

    if (current.x === goal.x && current.y === goal.y) {
      // Reconstruct path
      const path: Point[] = []
      let node: Node | null = current
      while (node) {
        path.unshift({ x: node.x, y: node.y })
        node = node.parent
      }
      return path
    }

    closed.add(key(current))

    for (const dir of DIRS) {
      const nx = current.x + dir.x
      const ny = current.y + dir.y
      const nk = key({ x: nx, y: ny })

      if (closed.has(nk)) continue
      if (!isWalkable(nx, ny, grid, buildings, targetBuilding)) continue

      const g = current.g + 1
      const h = heuristic({ x: nx, y: ny }, goal)
      const existing = open.find(n => n.x === nx && n.y === ny)

      if (existing) {
        if (g < existing.g) {
          existing.g = g
          existing.f = g + h
          existing.parent = current
        }
      } else {
        open.push({ x: nx, y: ny, g, h, f: g + h, parent: current })
      }
    }
  }

  // No path found — return empty
  return []
}
