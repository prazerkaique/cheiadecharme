import type { Stats } from './game'

export type CharacterClass = 'warrior' | 'rogue' | 'mage' | 'barbarian'
export type CharacterRace = 'human' | 'elf' | 'dwarf' | 'half-orc'

export interface Appearance {
  skinColor: string
  hairColor: string
  outfitColor: string
}

export type EquipmentSlot = 'weapon' | 'armor' | 'accessory'

export interface EquipmentItem {
  id: string
  name: string
  slot: EquipmentSlot
  icon: string
  statBonus: Partial<Stats>
  forClass?: CharacterClass[]
}

export interface CharacterBuild {
  name: string
  race: CharacterRace
  class: CharacterClass
  appearance: Appearance
  equipment: Record<EquipmentSlot, string>
}
