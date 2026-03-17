import type { CharacterClass, CharacterRace, Appearance } from '@/types/character'
import type { WeaponVisual } from '@/config/character'

type SpriteData = (string | null)[][]
type Direction = 'down' | 'up' | 'left' | 'right'

// ─── COLOR HELPERS ──────────────────────────────────────────

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ]
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(v => Math.max(0, Math.min(255, v)).toString(16).padStart(2, '0')).join('')
}

export function darken(hex: string, percent: number): string {
  const [r, g, b] = hexToRgb(hex)
  const f = 1 - percent / 100
  return rgbToHex(Math.round(r * f), Math.round(g * f), Math.round(b * f))
}

export function lighten(hex: string, percent: number): string {
  const [r, g, b] = hexToRgb(hex)
  const f = percent / 100
  return rgbToHex(
    Math.round(r + (255 - r) * f),
    Math.round(g + (255 - g) * f),
    Math.round(b + (255 - b) * f),
  )
}

// ─── PIXEL KEYS ─────────────────────────────────────────────
// _ = transparent, S = skin, A = skin shadow, H = hair, h = hair light
// T = tunic/outfit, t = tunic shadow, E = eyes, B = belt
// P = pants, p = pants shadow, K = boots, M = metallic, m = metallic shadow
// F = fang (white)

type PixelKey = '_' | 'S' | 'A' | 'H' | 'h' | 'T' | 't' | 'E' | 'B' | 'P' | 'p' | 'K' | 'M' | 'm' | 'F'

// ─── BASE TEMPLATES ────────────────────────────────────────

const BASE_DOWN: PixelKey[][] = [
  ['_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_'],
  ['_','_','_','_','_','H','H','H','H','H','H','_','_','_','_','_'],
  ['_','_','_','_','H','h','h','h','h','h','h','H','_','_','_','_'],
  ['_','_','_','H','h','h','h','h','h','h','h','h','H','_','_','_'],
  ['_','_','_','H','S','S','S','S','S','S','S','S','H','_','_','_'],
  ['_','_','_','H','S','E','S','S','S','E','S','S','H','_','_','_'],
  ['_','_','_','_','S','S','S','A','S','S','S','S','_','_','_','_'],
  ['_','_','_','_','S','S','A','A','A','S','S','_','_','_','_','_'],
  ['_','_','_','_','_','S','S','S','S','S','_','_','_','_','_','_'],
  ['_','_','_','_','T','T','T','T','T','T','T','_','_','_','_','_'],
  ['_','_','_','T','T','T','T','T','T','T','T','T','_','_','_','_'],
  ['_','_','S','T','T','T','B','B','T','T','T','T','S','_','_','_'],
  ['_','_','S','t','T','T','T','T','T','T','T','t','S','_','_','_'],
  ['_','_','_','_','P','P','P','_','P','P','P','_','_','_','_','_'],
  ['_','_','_','_','P','p','P','_','P','p','P','_','_','_','_','_'],
  ['_','_','_','_','K','K','K','_','K','K','K','_','_','_','_','_'],
]

const BASE_DOWN_WALK: PixelKey[][] = [
  ['_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_'],
  ['_','_','_','_','_','H','H','H','H','H','H','_','_','_','_','_'],
  ['_','_','_','_','H','h','h','h','h','h','h','H','_','_','_','_'],
  ['_','_','_','H','h','h','h','h','h','h','h','h','H','_','_','_'],
  ['_','_','_','H','S','S','S','S','S','S','S','S','H','_','_','_'],
  ['_','_','_','H','S','E','S','S','S','E','S','S','H','_','_','_'],
  ['_','_','_','_','S','S','S','A','S','S','S','S','_','_','_','_'],
  ['_','_','_','_','S','S','A','A','A','S','S','_','_','_','_','_'],
  ['_','_','_','_','_','S','S','S','S','S','_','_','_','_','_','_'],
  ['_','_','_','_','T','T','T','T','T','T','T','_','_','_','_','_'],
  ['_','_','_','T','T','T','T','T','T','T','T','T','_','_','_','_'],
  ['_','_','S','T','T','T','B','B','T','T','T','T','S','_','_','_'],
  ['_','_','S','t','T','T','T','T','T','T','T','t','S','_','_','_'],
  ['_','_','_','P','P','P','_','_','_','P','P','P','_','_','_','_'],
  ['_','_','_','_','P','p','_','_','_','_','p','P','_','_','_','_'],
  ['_','_','_','_','K','K','_','_','_','_','K','K','_','_','_','_'],
]

const BASE_UP: PixelKey[][] = [
  ['_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_'],
  ['_','_','_','_','_','H','H','H','H','H','H','_','_','_','_','_'],
  ['_','_','_','_','H','H','H','H','H','H','H','H','_','_','_','_'],
  ['_','_','_','H','H','H','H','H','H','H','H','H','H','_','_','_'],
  ['_','_','_','H','H','H','H','H','H','H','H','H','H','_','_','_'],
  ['_','_','_','H','S','S','S','S','S','S','S','S','H','_','_','_'],
  ['_','_','_','_','S','S','S','S','S','S','S','S','_','_','_','_'],
  ['_','_','_','_','_','S','S','S','S','S','S','_','_','_','_','_'],
  ['_','_','_','_','_','S','S','S','S','S','_','_','_','_','_','_'],
  ['_','_','_','_','T','T','T','T','T','T','T','_','_','_','_','_'],
  ['_','_','_','T','T','T','T','T','T','T','T','T','_','_','_','_'],
  ['_','_','S','T','T','T','B','B','T','T','T','T','S','_','_','_'],
  ['_','_','S','t','T','T','T','T','T','T','T','t','S','_','_','_'],
  ['_','_','_','_','P','P','P','_','P','P','P','_','_','_','_','_'],
  ['_','_','_','_','P','p','P','_','P','p','P','_','_','_','_','_'],
  ['_','_','_','_','K','K','K','_','K','K','K','_','_','_','_','_'],
]

const BASE_LEFT: PixelKey[][] = [
  ['_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_'],
  ['_','_','_','_','H','H','H','H','H','_','_','_','_','_','_','_'],
  ['_','_','_','H','h','h','h','h','h','H','_','_','_','_','_','_'],
  ['_','_','H','h','h','h','h','h','h','h','H','_','_','_','_','_'],
  ['_','_','H','S','S','S','S','S','S','S','H','_','_','_','_','_'],
  ['_','_','H','E','S','S','S','E','S','S','H','_','_','_','_','_'],
  ['_','_','_','S','S','A','S','S','S','_','_','_','_','_','_','_'],
  ['_','_','_','_','S','A','A','S','S','_','_','_','_','_','_','_'],
  ['_','_','_','_','S','S','S','S','_','_','_','_','_','_','_','_'],
  ['_','_','_','T','T','T','T','T','T','_','_','_','_','_','_','_'],
  ['_','_','T','T','T','T','T','T','T','T','_','_','_','_','_','_'],
  ['_','S','T','T','T','B','B','T','T','T','_','_','_','_','_','_'],
  ['_','S','t','T','T','T','T','T','T','t','_','_','_','_','_','_'],
  ['_','_','_','P','P','P','_','P','P','_','_','_','_','_','_','_'],
  ['_','_','_','P','p','P','_','P','p','_','_','_','_','_','_','_'],
  ['_','_','_','K','K','K','_','K','K','_','_','_','_','_','_','_'],
]

// ─── CLASS MODIFIERS ────────────────────────────────────────

function applyClassModifiers(template: PixelKey[][], charClass: CharacterClass, direction: Direction): PixelKey[][] {
  const s = template.map(row => [...row])

  switch (charClass) {
    case 'warrior':
      // Full metallic armor on torso
      for (let y = 9; y <= 12; y++) {
        for (let x = 0; x < 16; x++) {
          if (s[y]![x] === 'T') s[y]![x] = 'M'
          if (s[y]![x] === 't') s[y]![x] = 'm'
        }
      }
      // Wider shoulder pads
      if (s[9]) {
        const left = s[9].indexOf('M')
        const right = s[9].lastIndexOf('M')
        if (left > 0) s[9]![left - 1] = 'M'
        if (right < 15) s[9]![right + 1] = 'M'
      }
      if (s[10]) {
        const left = s[10].indexOf('M')
        if (left > 0) s[10]![left - 1] = 'M'
        const right = s[10].lastIndexOf('M')
        if (right < 15) s[10]![right + 1] = 'M'
      }
      break

    case 'rogue':
      // Hood covers entire head — wraps around
      for (let y = 1; y <= 3; y++) {
        for (let x = 0; x < 16; x++) {
          if (s[y]![x] === 'H' || s[y]![x] === 'h') s[y]![x] = 'T'
        }
      }
      // Hood sides on face rows
      if (direction === 'down' || direction === 'up') {
        if (s[4]) { s[4]![3] = 't'; s[4]![12] = 't' }
        if (s[5]) { s[5]![3] = 't'; s[5]![12] = 't' }
      }
      if (direction === 'left') {
        if (s[4]) s[4]![2] = 't'
        if (s[5]) s[5]![2] = 't'
      }
      if (direction === 'right') {
        if (s[4]) s[4]![13] = 't'
        if (s[5]) s[5]![13] = 't'
      }
      break

    case 'mage':
      // Big pointy hat
      if (direction === 'down' || direction === 'up') {
        s[0] = ['_','_','_','_','_','_','_','T','T','_','_','_','_','_','_','_']
        s[1] = ['_','_','_','_','_','_','T','t','T','T','_','_','_','_','_','_']
        s[2] = ['_','_','_','_','_','T','t','T','T','t','T','_','_','_','_','_']
        s[3] = ['_','_','_','T','T','T','T','T','T','T','T','T','T','_','_','_']
      } else if (direction === 'left') {
        s[0] = ['_','_','_','_','_','T','T','_','_','_','_','_','_','_','_','_']
        s[1] = ['_','_','_','_','T','t','T','T','_','_','_','_','_','_','_','_']
        s[2] = ['_','_','_','T','t','T','T','t','T','_','_','_','_','_','_','_']
        s[3] = ['_','_','T','T','T','T','T','T','T','T','_','_','_','_','_','_']
      } else {
        s[0] = ['_','_','_','_','_','_','_','_','T','T','_','_','_','_','_','_']
        s[1] = ['_','_','_','_','_','_','T','T','t','T','_','_','_','_','_','_']
        s[2] = ['_','_','_','_','_','T','t','T','T','t','T','_','_','_','_','_']
        s[3] = ['_','_','_','T','T','T','T','T','T','T','T','T','_','_','_','_']
      }
      // Full robe — covers pants AND boots
      for (let y = 13; y <= 15; y++) {
        for (let x = 0; x < 16; x++) {
          if (s[y]![x] === 'P' || s[y]![x] === 'K') s[y]![x] = 'T'
          if (s[y]![x] === 'p') s[y]![x] = 't'
        }
      }
      break

    case 'barbarian':
      // Bare torso — skin everywhere
      for (let y = 9; y <= 12; y++) {
        for (let x = 0; x < 16; x++) {
          if (s[y]![x] === 'T') s[y]![x] = 'S'
          if (s[y]![x] === 't') s[y]![x] = 'A'
        }
      }
      // Keep belt
      if (s[11]) {
        s[11]![6] = 'B'; s[11]![7] = 'B'
      }
      // Loincloth instead of pants — skin legs with cloth strip center
      if (s[13]) {
        for (let x = 0; x < 16; x++) {
          if (s[13]![x] === 'P') s[13]![x] = 'S'
          if (s[13]![x] === 'p') s[13]![x] = 'A'
        }
        // Cloth in center
        s[13]![6] = 'T'; s[13]![7] = 'T'
        if (s[13]![9] !== '_') s[13]![8] = 'T'
      }
      if (s[14]) {
        for (let x = 0; x < 16; x++) {
          if (s[14]![x] === 'P') s[14]![x] = 'S'
          if (s[14]![x] === 'p') s[14]![x] = 'A'
        }
        s[14]![6] = 't'; s[14]![7] = 't'
      }
      break
  }

  return s
}

// ─── RACE MODIFIERS ─────────────────────────────────────────

function applyRaceModifiers(template: PixelKey[][], race: CharacterRace, direction: Direction): PixelKey[][] {
  const s = template.map(row => [...row])

  switch (race) {
    case 'elf':
      // Pointed ears at face level (rows 5-6), OUTSIDE the head boundary
      if (direction === 'down') {
        // Left ear
        if (s[4]) s[4]![2] = 'S'
        if (s[5]) s[5]![2] = 'S'
        // Right ear
        if (s[4]) s[4]![13] = 'S'
        if (s[5]) s[5]![13] = 'S'
        // Ear tips point outward-up
        if (s[3]) { s[3]![2] = 'S' }
        if (s[3]) { s[3]![13] = 'S' }
      }
      if (direction === 'left') {
        if (s[4]) s[4]![1] = 'S'
        if (s[5]) s[5]![1] = 'S'
      }
      if (direction === 'right') {
        if (s[4]) s[4]![11] = 'S'
        if (s[5]) s[5]![11] = 'S'
      }
      break

    case 'dwarf': {
      // Dwarf is shorter: push sprite DOWN (empty rows at top, feet stay at row 15)
      // Big long beard hangs from chin over the torso
      const _: PixelKey = '_'
      const mt: PixelKey[] = [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_]
      const o = s.map(row => [...row]) // snapshot after class modifiers

      // Rows 0-2: empty (dwarf head starts at row 3 = 2 rows shorter than human)
      s[0] = [...mt]
      s[1] = [...mt]
      s[2] = [...mt]

      // Rows 3-5: hair (copy from original rows 1-3)
      s[3] = [...o[1]!]
      s[4] = [...o[2]!]
      s[5] = [...o[3]!]

      // Rows 6-7: face (from original rows 4-5)
      s[6] = [...o[4]!]
      s[7] = [...o[5]!]

      // Row 8: mouth area (from original row 7, compressed — skip row 6 cheeks)
      s[8] = [...o[7]!]

      if (direction === 'down') {
        // Row 9: beard wide — hair color across face width
        s[9]  = [_,_,_,_,'H','h','H','h','H','h','H',_,_,_,_,_]
        // Row 10: beard middle
        s[10] = [_,_,_,_,_,'H','h','H','h','H',_,_,_,_,_,_]
        // Row 11: beard tip + torso start (class-modified torso from o[9])
        s[11] = [...o[9]!]
        s[11]![6] = 'H'; s[11]![7] = 'h'; s[11]![8] = 'H'
      } else if (direction === 'left') {
        s[9]  = [_,_,_,_,'H','h','H',_,_,_,_,_,_,_,_,_]
        s[10] = [_,_,_,_,_,'H','h',_,_,_,_,_,_,_,_,_]
        s[11] = [...o[9]!]
        s[11]![5] = 'H'
      } else if (direction === 'right') {
        s[9]  = [_,_,_,_,_,_,_,_,_,'H','h','H',_,_,_,_]
        s[10] = [_,_,_,_,_,_,_,_,_,_,'h','H',_,_,_,_]
        s[11] = [...o[9]!]
        s[11]![10] = 'H'
      } else {
        // UP: no beard visible, just shorter body
        s[9]  = [...o[8]!] // neck
        s[10] = [...o[9]!] // torso
        s[11] = [...o[10]!]
      }

      // Row 12: torso / belt (from class-modified o[11])
      s[12] = [...o[11]!]
      // Row 13: torso bottom (from class-modified o[12])
      s[13] = [...o[12]!]
      // Row 14: short legs — single row (from o[13])
      s[14] = [...o[13]!]
      // Row 15: boots — grounded at the bottom! (from o[15])
      s[15] = [...o[15]!]

      break
    }

    case 'half-orc':
      // BALD — replace all hair with skin shadow (outline) and skin
      for (let y = 1; y <= 3; y++) {
        for (let x = 0; x < 16; x++) {
          if (s[y]![x] === 'h') s[y]![x] = 'S'
          if (s[y]![x] === 'H') s[y]![x] = 'A'
        }
      }
      // Head border becomes skin shadow
      if (direction === 'down' || direction === 'up') {
        if (s[4]) { s[4]![3] = 'A'; s[4]![12] = 'A' }
        if (s[5]) { s[5]![3] = 'A'; s[5]![12] = 'A' }
      }
      // White fang/tooth at mouth
      if (direction === 'down') {
        if (s[7]) s[7]![6] = 'F'
        if (s[7]) s[7]![9] = 'F'
      }
      // Wider shoulders
      if (s[10]) {
        const left = s[10].findIndex(p => p !== '_')
        const right = 15 - [...s[10]].reverse().findIndex(p => p !== '_')
        if (left > 0 && s[10]![left] !== '_') s[10]![left - 1] = s[10]![left]!
        if (right < 15 && s[10]![right] !== '_') s[10]![right + 1] = s[10]![right]!
      }
      break
  }

  return s
}

// ─── RESOLVE COLORS ─────────────────────────────────────────

function resolveColors(template: PixelKey[][], appearance: Appearance): SpriteData {
  const skinShadow = darken(appearance.skinColor, 15)
  const hairLight = lighten(appearance.hairColor, 15)
  const tunicShadow = darken(appearance.outfitColor, 20)
  const metallic = '#c0c0c0'
  const metallicShadow = '#8a8a8a'

  const colorMap: Record<PixelKey, string | null> = {
    '_': null,
    'S': appearance.skinColor,
    'A': skinShadow,
    'H': appearance.hairColor,
    'h': hairLight,
    'T': appearance.outfitColor,
    't': tunicShadow,
    'E': '#1a1a2e',
    'B': '#854d0e',
    'P': '#374151',
    'p': '#1f2937',
    'K': '#4a2810',
    'M': metallic,
    'm': metallicShadow,
    'F': '#ffffff',
  }

  return template.map(row => row.map(pixel => colorMap[pixel]))
}

// ─── WEAPON OVERLAY ─────────────────────────────────────────

function setPixel(sprite: SpriteData, x: number, y: number, color: string) {
  if (y >= 0 && y < sprite.length && x >= 0 && x < (sprite[0]?.length ?? 0)) {
    sprite[y]![x] = color
  }
}

function applyWeaponOverlay(sprite: SpriteData, weapon: WeaponVisual, direction: Direction): SpriteData {
  const result = sprite.map(row => [...row])
  if (weapon === 'none') return result

  const blade = '#c0c0c0'
  const bladeTip = '#e8e8e8'
  const handle = '#854d0e'
  const magic = '#a855f7'
  const glow = '#c4b5fd'

  if (direction === 'down') {
    switch (weapon) {
      case 'sword':
        setPixel(result, 14, 7, bladeTip)
        setPixel(result, 14, 8, blade)
        setPixel(result, 14, 9, blade)
        setPixel(result, 14, 10, blade)
        setPixel(result, 14, 11, handle)
        setPixel(result, 13, 11, '#b8860b') // crossguard
        setPixel(result, 15, 11, '#b8860b')
        break
      case 'axe':
        setPixel(result, 14, 8, blade)
        setPixel(result, 15, 8, blade)
        setPixel(result, 14, 9, blade)
        setPixel(result, 14, 10, handle)
        setPixel(result, 14, 11, handle)
        break
      case 'blunt':
        setPixel(result, 13, 8, blade)
        setPixel(result, 14, 8, blade)
        setPixel(result, 15, 8, blade)
        setPixel(result, 14, 9, handle)
        setPixel(result, 14, 10, handle)
        setPixel(result, 14, 11, handle)
        break
      case 'dagger':
        setPixel(result, 13, 10, bladeTip)
        setPixel(result, 13, 11, blade)
        setPixel(result, 2, 10, bladeTip)
        setPixel(result, 2, 11, blade)
        break
      case 'bow':
        setPixel(result, 14, 7, handle)
        setPixel(result, 15, 8, handle)
        setPixel(result, 15, 9, handle)
        setPixel(result, 15, 10, handle)
        setPixel(result, 14, 11, handle)
        setPixel(result, 14, 9, '#f5f5dc') // string
        break
      case 'staff':
        setPixel(result, 14, 3, glow)
        setPixel(result, 14, 4, magic)
        setPixel(result, 14, 5, handle)
        setPixel(result, 14, 6, handle)
        setPixel(result, 14, 7, handle)
        setPixel(result, 14, 8, handle)
        setPixel(result, 14, 9, handle)
        setPixel(result, 14, 10, handle)
        setPixel(result, 14, 11, handle)
        break
      case 'orb':
        setPixel(result, 13, 10, magic)
        setPixel(result, 14, 10, glow)
        setPixel(result, 13, 11, glow)
        setPixel(result, 14, 11, magic)
        break
      case 'wand':
        setPixel(result, 14, 8, glow)
        setPixel(result, 14, 9, handle)
        setPixel(result, 14, 10, handle)
        setPixel(result, 14, 11, handle)
        break
    }
  } else if (direction === 'left') {
    switch (weapon) {
      case 'sword':
        setPixel(result, 1, 8, bladeTip)
        setPixel(result, 1, 9, blade)
        setPixel(result, 1, 10, blade)
        setPixel(result, 1, 11, handle)
        break
      case 'axe':
        setPixel(result, 0, 8, blade)
        setPixel(result, 1, 8, blade)
        setPixel(result, 1, 9, blade)
        setPixel(result, 1, 10, handle)
        setPixel(result, 1, 11, handle)
        break
      case 'blunt':
        setPixel(result, 0, 8, blade)
        setPixel(result, 1, 8, blade)
        setPixel(result, 1, 9, handle)
        setPixel(result, 1, 10, handle)
        break
      case 'dagger':
        setPixel(result, 1, 10, bladeTip)
        setPixel(result, 1, 11, blade)
        break
      case 'staff':
        setPixel(result, 1, 4, glow)
        for (let y = 5; y <= 11; y++) setPixel(result, 1, y, handle)
        break
      case 'orb':
        setPixel(result, 1, 10, magic)
        setPixel(result, 1, 11, glow)
        break
      case 'wand':
        setPixel(result, 1, 9, glow)
        setPixel(result, 1, 10, handle)
        setPixel(result, 1, 11, handle)
        break
      default:
        break
    }
  } else if (direction === 'right') {
    switch (weapon) {
      case 'sword':
        setPixel(result, 14, 8, bladeTip)
        setPixel(result, 14, 9, blade)
        setPixel(result, 14, 10, blade)
        setPixel(result, 14, 11, handle)
        break
      case 'axe':
        setPixel(result, 14, 8, blade)
        setPixel(result, 15, 8, blade)
        setPixel(result, 14, 9, blade)
        setPixel(result, 14, 10, handle)
        setPixel(result, 14, 11, handle)
        break
      case 'blunt':
        setPixel(result, 14, 8, blade)
        setPixel(result, 15, 8, blade)
        setPixel(result, 14, 9, handle)
        setPixel(result, 14, 10, handle)
        break
      case 'dagger':
        setPixel(result, 14, 10, bladeTip)
        setPixel(result, 14, 11, blade)
        break
      case 'staff':
        setPixel(result, 14, 4, glow)
        for (let y = 5; y <= 11; y++) setPixel(result, 14, y, handle)
        break
      case 'orb':
        setPixel(result, 14, 10, magic)
        setPixel(result, 14, 11, glow)
        break
      case 'wand':
        setPixel(result, 14, 9, glow)
        setPixel(result, 14, 10, handle)
        setPixel(result, 14, 11, handle)
        break
      default:
        break
    }
  }
  // UP direction: weapon mostly hidden behind character, skip

  return result
}

// ─── PUBLIC API ─────────────────────────────────────────────

export function generateCharacterSprite(
  direction: Direction,
  isWalking: boolean,
  config: {
    race: CharacterRace
    class: CharacterClass
    appearance: Appearance
    weaponVisual?: WeaponVisual
  },
): SpriteData {
  // Pick base template
  let template: PixelKey[][]
  switch (direction) {
    case 'down':
      template = isWalking ? BASE_DOWN_WALK : BASE_DOWN
      break
    case 'up':
      template = BASE_UP
      break
    case 'left':
      template = BASE_LEFT
      break
    case 'right':
      template = BASE_LEFT.map(row => [...row].reverse())
      break
  }

  template = template.map(row => [...row])
  template = applyClassModifiers(template, config.class, direction)
  template = applyRaceModifiers(template, config.race, direction)

  let resolved = resolveColors(template, config.appearance)

  if (config.weaponVisual && config.weaponVisual !== 'none') {
    resolved = applyWeaponOverlay(resolved, config.weaponVisual, direction)
  }

  return resolved
}

export type { SpriteData, Direction }
