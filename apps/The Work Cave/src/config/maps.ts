import type { TileId } from '@/types/map'
import type { MapBuilding } from '@/types/map'

const TILE_KEY: Record<string, TileId> = {
  T: 'tree',
  G: 'grass',
  P: 'path',
  W: 'water',
  F: 'flowers',
  X: 'fence',
}

// 20x14 overworld — RPG village layout
// Guild Hall at top center, projects around the plaza, amenities on sides
const OVERWORLD_RAW = [
  'TTGGGGGGGGGGGGGGGTTG',
  'TGGGGGGGGGGGGGGGGGGT',
  'GGFGGGGGPPPPGGGGGFGG',
  'GGGGGGPPPPPPPPGGGGGG',
  'GGGGGPPPPPPPPPPPGGGG',
  'GGGGPPPPPPPPPPPPGGGG',
  'GGGPPPPPPPPPPPPPGWWG',
  'GGGPPPPPPPPPPPPPGWWG',
  'GGGGPPPPPPPPPPPPGGGG',
  'GGGGGPPPPPPPPPPPGGGG',
  'GGFGGGPPPPPPPPGGGGGG',
  'GGGGGGGGPPPPGGGGFGGG',
  'TGGGGGGGGGGGGGGGGGGT',
  'TTGGGGGGGGGGGGGGGTTG',
]

export const OVERWORLD_TILES: TileId[][] = OVERWORLD_RAW.map(row =>
  row.split('').map(c => TILE_KEY[c] ?? 'grass')
)

// Fixed buildings — village infrastructure
export const FIXED_BUILDINGS: MapBuilding[] = [
  {
    id: 'tavern',
    name: 'O Sapo Caolho',
    type: 'tavern',
    x: 8,
    y: 0,
    width: 4,
    height: 3,
    color: '#92400e',
    icon: '',
    route: '/tavern',
  },
  {
    id: 'fountain',
    name: 'Fonte da Vitalidade',
    type: 'fountain',
    x: 17,
    y: 5,
    width: 3,
    height: 3,
    color: '#1e40af',
    icon: '',
    route: '/fountain',
  },
  {
    id: 'add_project',
    name: 'Construir Aqui',
    type: 'add_project',
    x: 9,
    y: 11,
    width: 2,
    height: 2,
    color: '#6b7280',
    icon: '',
    route: '/new-project',
  },
]

// Default project buildings — specific positions for the 4 kaique projects
export const DEFAULT_PROJECTS = [
  {
    id: 'proj-nerau',
    name: 'Nerau',
    slug: 'nerau',
    color: '#dc2626',
    sprite: 'dojo',
    map_x: 5,
    map_y: 0,
    width: 3,
    height: 3,
  },
  {
    id: 'proj-vizzu',
    name: 'Vizzu',
    slug: 'vizzu',
    color: '#f97316',
    sprite: 'atelier',
    map_x: 12,
    map_y: 0,
    width: 3,
    height: 3,
  },
  {
    id: 'proj-devocional',
    name: 'Devocional',
    slug: 'devocional',
    color: '#f5f5dc',
    sprite: 'chapel',
    map_x: 2,
    map_y: 9,
    width: 3,
    height: 3,
  },
  {
    id: 'proj-charme',
    name: 'Cheia de Charme',
    slug: 'cheia-de-charme',
    color: '#ec4899',
    sprite: 'enchantment_shop',
    map_x: 15,
    map_y: 9,
    width: 3,
    height: 3,
  },
]

// Pre-defined lot positions for NEW project buildings
export const PROJECT_LOTS: { x: number; y: number }[] = [
  { x: 6, y: 10 },
  { x: 12, y: 10 },
  { x: 6, y: 2 },
  { x: 12, y: 2 },
]

export const PROJECT_BUILDING_SIZE = { width: 3, height: 2 }

export const SPAWN_POINT = { x: 9, y: 6 }
