// Pixel art sprite data — each sprite is a 2D array of hex colors (null = transparent)
// Rendered via CSS box-shadow at 1px scale, then transformed up

type SpriteData = (string | null)[][]

// ─── CHARACTER SPRITES ───────────────────────────────────────
// 16x16 adventurer

const _ = null
const H = '#4a2810' // hair dark
const h = '#6b3a1a' // hair light
const S = '#f5c49c' // skin
const E = '#1a1a2e' // eyes
const T = '#2563eb' // tunic
const t = '#1d4ed8' // tunic shadow
const B = '#854d0e' // belt
const P = '#374151' // pants
const p = '#1f2937' // pants shadow
const K = '#4a2810' // boots
const A = '#e8b88a' // skin shadow

export const CHARACTER_DOWN: SpriteData = [
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, H, H, H, H, H, H, _, _, _, _, _],
  [_, _, _, _, H, h, h, h, h, h, h, H, _, _, _, _],
  [_, _, _, H, h, h, h, h, h, h, h, h, H, _, _, _],
  [_, _, _, H, S, S, S, S, S, S, S, S, H, _, _, _],
  [_, _, _, H, S, E, S, S, S, E, S, S, H, _, _, _],
  [_, _, _, _, S, S, S, A, S, S, S, S, _, _, _, _],
  [_, _, _, _, S, S, A, A, A, S, S, _, _, _, _, _],
  [_, _, _, _, _, S, S, S, S, S, _, _, _, _, _, _],
  [_, _, _, _, T, T, T, T, T, T, T, _, _, _, _, _],
  [_, _, _, T, T, T, T, T, T, T, T, T, _, _, _, _],
  [_, _, S, T, T, T, B, B, T, T, T, T, S, _, _, _],
  [_, _, S, t, T, T, T, T, T, T, T, t, S, _, _, _],
  [_, _, _, _, P, P, P, _, P, P, P, _, _, _, _, _],
  [_, _, _, _, P, p, P, _, P, p, P, _, _, _, _, _],
  [_, _, _, _, K, K, K, _, K, K, K, _, _, _, _, _],
]

export const CHARACTER_DOWN_WALK: SpriteData = [
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, H, H, H, H, H, H, _, _, _, _, _],
  [_, _, _, _, H, h, h, h, h, h, h, H, _, _, _, _],
  [_, _, _, H, h, h, h, h, h, h, h, h, H, _, _, _],
  [_, _, _, H, S, S, S, S, S, S, S, S, H, _, _, _],
  [_, _, _, H, S, E, S, S, S, E, S, S, H, _, _, _],
  [_, _, _, _, S, S, S, A, S, S, S, S, _, _, _, _],
  [_, _, _, _, S, S, A, A, A, S, S, _, _, _, _, _],
  [_, _, _, _, _, S, S, S, S, S, _, _, _, _, _, _],
  [_, _, _, _, T, T, T, T, T, T, T, _, _, _, _, _],
  [_, _, _, T, T, T, T, T, T, T, T, T, _, _, _, _],
  [_, _, S, T, T, T, B, B, T, T, T, T, S, _, _, _],
  [_, _, S, t, T, T, T, T, T, T, T, t, S, _, _, _],
  [_, _, _, P, P, P, _, _, _, P, P, P, _, _, _, _],
  [_, _, _, _, P, p, _, _, _, _, p, P, _, _, _, _],
  [_, _, _, _, K, K, _, _, _, _, K, K, _, _, _, _],
]

export const CHARACTER_UP: SpriteData = [
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, H, H, H, H, H, H, _, _, _, _, _],
  [_, _, _, _, H, H, H, H, H, H, H, H, _, _, _, _],
  [_, _, _, H, H, H, H, H, H, H, H, H, H, _, _, _],
  [_, _, _, H, H, H, H, H, H, H, H, H, H, _, _, _],
  [_, _, _, H, S, S, S, S, S, S, S, S, H, _, _, _],
  [_, _, _, _, S, S, S, S, S, S, S, S, _, _, _, _],
  [_, _, _, _, _, S, S, S, S, S, S, _, _, _, _, _],
  [_, _, _, _, _, S, S, S, S, S, _, _, _, _, _, _],
  [_, _, _, _, T, T, T, T, T, T, T, _, _, _, _, _],
  [_, _, _, T, T, T, T, T, T, T, T, T, _, _, _, _],
  [_, _, S, T, T, T, B, B, T, T, T, T, S, _, _, _],
  [_, _, S, t, T, T, T, T, T, T, T, t, S, _, _, _],
  [_, _, _, _, P, P, P, _, P, P, P, _, _, _, _, _],
  [_, _, _, _, P, p, P, _, P, p, P, _, _, _, _, _],
  [_, _, _, _, K, K, K, _, K, K, K, _, _, _, _, _],
]

export const CHARACTER_LEFT: SpriteData = [
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, H, H, H, H, H, _, _, _, _, _, _, _],
  [_, _, _, H, h, h, h, h, h, H, _, _, _, _, _, _],
  [_, _, H, h, h, h, h, h, h, h, H, _, _, _, _, _],
  [_, _, H, S, S, S, S, S, S, S, H, _, _, _, _, _],
  [_, _, H, E, S, S, S, E, S, S, H, _, _, _, _, _],
  [_, _, _, S, S, A, S, S, S, _, _, _, _, _, _, _],
  [_, _, _, _, S, A, A, S, S, _, _, _, _, _, _, _],
  [_, _, _, _, S, S, S, S, _, _, _, _, _, _, _, _],
  [_, _, _, T, T, T, T, T, T, _, _, _, _, _, _, _],
  [_, _, T, T, T, T, T, T, T, T, _, _, _, _, _, _],
  [_, S, T, T, T, B, B, T, T, T, _, _, _, _, _, _],
  [_, S, t, T, T, T, T, T, T, t, _, _, _, _, _, _],
  [_, _, _, P, P, P, _, P, P, _, _, _, _, _, _, _],
  [_, _, _, P, p, P, _, P, p, _, _, _, _, _, _, _],
  [_, _, _, K, K, K, _, K, K, _, _, _, _, _, _, _],
]

export const CHARACTER_RIGHT: SpriteData = CHARACTER_LEFT.map(row => [...row].reverse())

// ─── BUILDING SPRITES ────────────────────────────────────────

// Guild Hall — 32x24 (will be rendered at building size)
export const GUILD_HALL_COLORS = {
  roof: '#7c2d12',
  roofLight: '#9a3412',
  wall: '#d4a574',
  wallShadow: '#c49464',
  door: '#78350f',
  window: '#f59e0b',
  windowFrame: '#92400e',
  banner: '#dc2626',
  stone: '#9ca3af',
}

export const COFFEE_SHOP_COLORS = {
  roof: '#78350f',
  roofLight: '#92400e',
  wall: '#fef3c7',
  wallShadow: '#fde68a',
  door: '#92400e',
  window: '#f59e0b',
  windowFrame: '#78350f',
  sign: '#92400e',
}

export const FOUNTAIN_COLORS = {
  base: '#6b7280',
  baseLight: '#9ca3af',
  water: '#60a5fa',
  waterLight: '#93c5fd',
  waterDark: '#3b82f6',
  spray: '#bfdbfe',
}

// ─── TILE PATTERNS ───────────────────────────────────────────

export const TILE_STYLES = {
  grass: {
    bg: '#4ade80',
    pattern: [
      { color: '#3bcc6e', positions: [[2, 3], [7, 1], [5, 6], [1, 7], [6, 4]] },
      { color: '#2db85c', positions: [[4, 2], [0, 5], [7, 7], [3, 0], [6, 6]] },
      { color: '#5eea9a', positions: [[1, 1], [6, 3], [3, 5], [7, 0], [0, 7]] },
    ],
  },
  path: {
    bg: '#d4a574',
    pattern: [
      { color: '#c49464', positions: [[1, 2], [5, 1], [3, 5], [7, 3], [0, 6]] },
      { color: '#b8845a', positions: [[3, 0], [6, 4], [1, 7], [4, 3], [7, 6]] },
      { color: '#deb590', positions: [[0, 0], [4, 6], [2, 3], [6, 1], [7, 7]] },
    ],
  },
  water: {
    bg: '#3b82f6',
    pattern: [
      { color: '#60a5fa', positions: [[1, 2], [5, 4], [3, 6], [7, 1]] },
      { color: '#2563eb', positions: [[0, 5], [4, 0], [6, 3], [2, 7]] },
      { color: '#93c5fd', positions: [[3, 1], [7, 5], [1, 6], [5, 2]] },
    ],
  },
  flowers: {
    bg: '#4ade80',
    pattern: [
      { color: '#f472b6', positions: [[2, 2], [6, 5]] },
      { color: '#fb923c', positions: [[5, 1], [1, 6]] },
      { color: '#a78bfa', positions: [[4, 4], [0, 3]] },
      { color: '#3bcc6e', positions: [[3, 0], [7, 3], [1, 5], [6, 7]] },
    ],
  },
  tree: {
    bg: '#166534',
    pattern: [
      { color: '#15803d', positions: [[2, 2], [3, 3], [4, 2], [3, 1], [5, 3]] },
      { color: '#14532d', positions: [[3, 4], [4, 5], [2, 5]] },
      { color: '#0f4c28', positions: [[0, 0], [7, 0], [0, 7], [7, 7]] },
      { color: '#4a2810', positions: [[3, 5], [3, 6], [3, 7]] }, // trunk
    ],
  },
  fence: {
    bg: '#4ade80',
    pattern: [
      { color: '#92400e', positions: [[0, 3], [1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [6, 3], [7, 3]] },
      { color: '#78350f', positions: [[0, 4], [1, 4], [2, 4], [3, 4], [4, 4], [5, 4], [6, 4], [7, 4]] },
      { color: '#a0522d', positions: [[1, 1], [1, 2], [4, 1], [4, 2], [7, 1], [7, 2]] }, // posts
      { color: '#8b4513', positions: [[1, 5], [1, 6], [4, 5], [4, 6], [7, 5], [7, 6]] }, // posts bottom
    ],
  },
}

// ─── SPRITE RENDERER HELPER ──────────────────────────────────

/** Convert a 2D sprite array to CSS box-shadow string */
export function spriteToBoxShadow(sprite: SpriteData): string {
  const shadows: string[] = []
  for (let y = 0; y < sprite.length; y++) {
    for (let x = 0; x < sprite[y]!.length; x++) {
      const color = sprite[y]![x]
      if (color) {
        shadows.push(`${x}px ${y}px 0 ${color}`)
      }
    }
  }
  return shadows.join(',')
}

/** Convert tile pattern to CSS box-shadow for an 8x8 texture */
export function tilePatternToBoxShadow(
  patterns: { color: string; positions: number[][] }[]
): string {
  const shadows: string[] = []
  for (const { color, positions } of patterns) {
    for (const [x, y] of positions) {
      shadows.push(`${x}px ${y}px 0 ${color}`)
    }
  }
  return shadows.join(',')
}
