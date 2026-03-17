import type { Stats, StatName } from '@/types/game'
import type { CharacterClass, CharacterRace, EquipmentItem, EquipmentSlot, Appearance } from '@/types/character'

// ─── CLASS DEFINITIONS ──────────────────────────────────────

export interface ClassDef {
  id: CharacterClass
  label: string
  description: string
  icon: string
  defaultOutfitColor: string
  statBonus: Partial<Stats>
}

export const CLASSES: Record<CharacterClass, ClassDef> = {
  warrior: {
    id: 'warrior',
    label: 'Guerreiro',
    description: 'Armadura pesada e espada em punho. Força bruta e resistência.',
    icon: '⚔️',
    defaultOutfitColor: '#475569',
    statBonus: { str: 2, con: 1 },
  },
  rogue: {
    id: 'rogue',
    label: 'Ladino',
    description: 'Ágil e furtivo. Capuz, adagas e sombras são seus aliados.',
    icon: '🗡️',
    defaultOutfitColor: '#475569',
    statBonus: { dex: 2, cha: 1 },
  },
  mage: {
    id: 'mage',
    label: 'Mago',
    description: 'Domina as artes arcanas. Robe longo e cajado de poder.',
    icon: '🔮',
    defaultOutfitColor: '#9333ea',
    statBonus: { int: 2, wis: 1 },
  },
  barbarian: {
    id: 'barbarian',
    label: 'Bárbaro',
    description: 'Fúria selvagem. Pele exposta, machado e sede de batalha.',
    icon: '🪓',
    defaultOutfitColor: '#dc2626',
    statBonus: { str: 2, con: 1 },
  },
}

// ─── RACE DEFINITIONS ───────────────────────────────────────

export interface RaceDef {
  id: CharacterRace
  label: string
  description: string
  icon: string
  defaultSkinColor: string
  statBonus: Partial<Stats>
}

export const RACES: Record<CharacterRace, RaceDef> = {
  human: {
    id: 'human',
    label: 'Humano',
    description: 'Versáteis e adaptáveis. Bons em tudo, mestres de nada.',
    icon: '👤',
    defaultSkinColor: '#f5c49c',
    statBonus: { str: 1, dex: 1, con: 1, int: 1, wis: 1, cha: 1 },
  },
  elf: {
    id: 'elf',
    label: 'Elfo',
    description: 'Graciosos e sábios. Orelhas pontudas e olhar perspicaz.',
    icon: '🧝',
    defaultSkinColor: '#f5c49c',
    statBonus: { dex: 2, int: 1 },
  },
  dwarf: {
    id: 'dwarf',
    label: 'Anão',
    description: 'Robustos e teimosos. Barba longa e coração de pedra.',
    icon: '⛏️',
    defaultSkinColor: '#e8b88a',
    statBonus: { con: 2, str: 1 },
  },
  'half-orc': {
    id: 'half-orc',
    label: 'Meio-Orc',
    description: 'Força implacável. Presas afiadas e vontade de ferro.',
    icon: '👹',
    defaultSkinColor: '#7db37d',
    statBonus: { str: 2, con: 1 },
  },
}

// ─── COLOR PALETTES ─────────────────────────────────────────

export const SKIN_COLORS = [
  { hex: '#f5c49c', label: 'Clara' },
  { hex: '#e8b88a', label: 'Média' },
  { hex: '#c68642', label: 'Morena' },
  { hex: '#8d5524', label: 'Escura' },
  { hex: '#654321', label: 'Muito escura' },
  { hex: '#7db37d', label: 'Orc verde' },
]

export const HAIR_COLORS = [
  { hex: '#4a2810', label: 'Castanho' },
  { hex: '#1a1a1a', label: 'Preto' },
  { hex: '#f5deb3', label: 'Loiro' },
  { hex: '#c0392b', label: 'Ruivo' },
  { hex: '#f5f5f5', label: 'Branco' },
  { hex: '#6b3a1a', label: 'Castanho claro' },
  { hex: '#8b4513', label: 'Marrom' },
  { hex: '#a855f7', label: 'Roxo mágico' },
]

export const OUTFIT_COLORS = [
  { hex: '#2563eb', label: 'Azul real' },
  { hex: '#dc2626', label: 'Vermelho' },
  { hex: '#16a34a', label: 'Verde' },
  { hex: '#9333ea', label: 'Roxo' },
  { hex: '#ca8a04', label: 'Dourado' },
  { hex: '#475569', label: 'Cinza escuro' },
]

// ─── EQUIPMENT ──────────────────────────────────────────────

export const EQUIPMENT_ITEMS: EquipmentItem[] = [
  // Warrior weapons
  { id: 'longsword', name: 'Espada Longa', slot: 'weapon', icon: '⚔️', statBonus: { str: 1 }, forClass: ['warrior'] },
  { id: 'war_axe', name: 'Machado de Guerra', slot: 'weapon', icon: '🪓', statBonus: { str: 1 }, forClass: ['warrior'] },
  { id: 'warhammer', name: 'Martelo', slot: 'weapon', icon: '🔨', statBonus: { con: 1 }, forClass: ['warrior'] },
  // Rogue weapons
  { id: 'dual_daggers', name: 'Adaga Dupla', slot: 'weapon', icon: '🗡️', statBonus: { dex: 1 }, forClass: ['rogue'] },
  { id: 'shortbow', name: 'Arco Curto', slot: 'weapon', icon: '🏹', statBonus: { dex: 1 }, forClass: ['rogue'] },
  { id: 'shortsword', name: 'Espada Curta', slot: 'weapon', icon: '⚔️', statBonus: { str: 1 }, forClass: ['rogue'] },
  // Mage weapons
  { id: 'arcane_staff', name: 'Cajado Arcano', slot: 'weapon', icon: '🪄', statBonus: { int: 1 }, forClass: ['mage'] },
  { id: 'mystic_orb', name: 'Orbe Místico', slot: 'weapon', icon: '🔮', statBonus: { wis: 1 }, forClass: ['mage'] },
  { id: 'wand', name: 'Varinha', slot: 'weapon', icon: '✨', statBonus: { int: 1 }, forClass: ['mage'] },
  // Barbarian weapons
  { id: 'greataxe', name: 'Machado Grande', slot: 'weapon', icon: '🪓', statBonus: { str: 1 }, forClass: ['barbarian'] },
  { id: 'club', name: 'Clava', slot: 'weapon', icon: '🏏', statBonus: { str: 1 }, forClass: ['barbarian'] },
  { id: 'war_maul', name: 'Martelo de Guerra', slot: 'weapon', icon: '🔨', statBonus: { con: 1 }, forClass: ['barbarian'] },

  // Warrior armor
  { id: 'chainmail', name: 'Cota de Malha', slot: 'armor', icon: '🛡️', statBonus: { con: 1 }, forClass: ['warrior'] },
  { id: 'plate_armor', name: 'Armadura de Placas', slot: 'armor', icon: '🦺', statBonus: { con: 1 }, forClass: ['warrior'] },
  { id: 'shield', name: 'Escudo', slot: 'armor', icon: '🛡️', statBonus: { str: 1 }, forClass: ['warrior'] },
  // Rogue armor
  { id: 'light_leather', name: 'Couro Leve', slot: 'armor', icon: '🧥', statBonus: { dex: 1 }, forClass: ['rogue'] },
  { id: 'shadow_cloak', name: 'Capa das Sombras', slot: 'armor', icon: '🧣', statBonus: { cha: 1 }, forClass: ['rogue'] },
  { id: 'reinforced_leather', name: 'Couro Reforçado', slot: 'armor', icon: '🧥', statBonus: { con: 1 }, forClass: ['rogue'] },
  // Mage armor
  { id: 'arcane_robe', name: 'Robe Arcano', slot: 'armor', icon: '👘', statBonus: { int: 1 }, forClass: ['mage'] },
  { id: 'stellar_mantle', name: 'Manto Estelar', slot: 'armor', icon: '🌟', statBonus: { wis: 1 }, forClass: ['mage'] },
  { id: 'elemental_tunic', name: 'Túnica Elemental', slot: 'armor', icon: '👘', statBonus: { con: 1 }, forClass: ['mage'] },
  // Barbarian armor
  { id: 'bear_hide', name: 'Pele de Urso', slot: 'armor', icon: '🐻', statBonus: { con: 1 }, forClass: ['barbarian'] },
  { id: 'bare_torso', name: 'Torso Nu', slot: 'armor', icon: '💪', statBonus: { str: 1 }, forClass: ['barbarian'] },
  { id: 'dragon_leather', name: 'Couro de Dragão', slot: 'armor', icon: '🐉', statBonus: { con: 1 }, forClass: ['barbarian'] },

  // Universal accessories
  { id: 'strength_amulet', name: 'Amuleto de Força', slot: 'accessory', icon: '📿', statBonus: { str: 1 } },
  { id: 'agility_ring', name: 'Anel de Agilidade', slot: 'accessory', icon: '💍', statBonus: { dex: 1 } },
  { id: 'wisdom_bracelet', name: 'Bracelete de Sabedoria', slot: 'accessory', icon: '⌚', statBonus: { wis: 1 } },
]

export function getEquipmentForClass(charClass: CharacterClass, slot: EquipmentSlot): EquipmentItem[] {
  return EQUIPMENT_ITEMS.filter(item =>
    item.slot === slot && (!item.forClass || item.forClass.includes(charClass))
  )
}

export function getEquipmentById(id: string): EquipmentItem | undefined {
  return EQUIPMENT_ITEMS.find(item => item.id === id)
}

// ─── STAT CALCULATION ───────────────────────────────────────

export function calculateStats(
  race: CharacterRace,
  charClass: CharacterClass,
  equipment: Record<string, string>,
  baseValue = 10,
): Stats {
  const stats: Stats = {
    str: baseValue, dex: baseValue, con: baseValue,
    int: baseValue, wis: baseValue, cha: baseValue,
  }

  // Apply race bonus
  const raceDef = RACES[race]
  for (const [stat, bonus] of Object.entries(raceDef.statBonus)) {
    stats[stat as StatName] += bonus
  }

  // Apply class bonus
  const classDef = CLASSES[charClass]
  for (const [stat, bonus] of Object.entries(classDef.statBonus)) {
    stats[stat as StatName] += bonus
  }

  // Apply equipment bonuses
  for (const itemId of Object.values(equipment)) {
    const item = getEquipmentById(itemId)
    if (item) {
      for (const [stat, bonus] of Object.entries(item.statBonus)) {
        stats[stat as StatName] += bonus!
      }
    }
  }

  return stats
}

export function defaultAppearance(race: CharacterRace, charClass: CharacterClass): Appearance {
  return {
    skinColor: RACES[race].defaultSkinColor,
    hairColor: '#4a2810',
    outfitColor: CLASSES[charClass].defaultOutfitColor,
  }
}

// ─── WEAPON VISUAL MAPPING ─────────────────────────────────

export type WeaponVisual = 'none' | 'sword' | 'axe' | 'blunt' | 'dagger' | 'bow' | 'staff' | 'orb' | 'wand'

export const WEAPON_VISUALS: Record<string, WeaponVisual> = {
  longsword: 'sword',
  shortsword: 'sword',
  war_axe: 'axe',
  greataxe: 'axe',
  warhammer: 'blunt',
  club: 'blunt',
  war_maul: 'blunt',
  dual_daggers: 'dagger',
  shortbow: 'bow',
  arcane_staff: 'staff',
  mystic_orb: 'orb',
  wand: 'wand',
}

export function getWeaponVisual(weaponId: string): WeaponVisual {
  return WEAPON_VISUALS[weaponId] ?? 'none'
}
