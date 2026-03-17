import { CharacterPreviewSprite } from './CharacterPreviewSprite'
import { RACES, CLASSES, calculateStats, getEquipmentById, getWeaponVisual } from '@/config/character'
import { STAT_COLORS, STAT_LABELS } from '@/config/constants'
import type { CharacterRace, CharacterClass, Appearance, EquipmentSlot } from '@/types/character'
import type { StatName } from '@/types/game'

interface StepPreviewProps {
  name: string
  race: CharacterRace
  charClass: CharacterClass
  appearance: Appearance
  equipment: Record<EquipmentSlot, string>
}

const STAT_ORDER: StatName[] = ['str', 'dex', 'con', 'int', 'wis', 'cha']
const SLOT_ORDER: EquipmentSlot[] = ['weapon', 'armor', 'accessory']

export function StepPreview({ name, race, charClass, appearance, equipment }: StepPreviewProps) {
  const stats = calculateStats(race, charClass, equipment)
  const raceDef = RACES[race]
  const classDef = CLASSES[charClass]

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="font-body text-lg text-text-dim text-center leading-relaxed">
        O destino aguarda. <span className="text-secondary">Está pronto para adentrar a Work Cave?</span>
      </p>

      {/* Sprite preview */}
      <CharacterPreviewSprite
        race={race}
        charClass={charClass}
        appearance={appearance}
        weaponVisual={getWeaponVisual(equipment.weapon)}
        scale={5}
        animate
      />

      {/* Name / Race / Class */}
      <div className="text-center">
        <p className="font-pixel text-sm text-secondary pixel-text">{name}</p>
        <p className="font-body text-lg text-text-dim">
          {raceDef.icon} {raceDef.label} &middot; {classDef.icon} {classDef.label}
        </p>
      </div>

      {/* Stats table */}
      <div className="w-full max-w-xs">
        <p className="font-pixel text-[10px] text-secondary mb-2 text-center">ATRIBUTOS</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          {STAT_ORDER.map(stat => (
            <div key={stat} className="flex justify-between items-center">
              <span
                className="font-pixel text-[9px]"
                style={{ color: STAT_COLORS[stat] }}
              >
                {STAT_LABELS[stat].slice(0, 3).toUpperCase()}
              </span>
              <span className="font-pixel text-xs text-text">{stats[stat]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Equipment */}
      <div className="w-full max-w-xs">
        <p className="font-pixel text-[10px] text-secondary mb-2 text-center">EQUIPAMENTO</p>
        <div className="flex flex-col gap-1">
          {SLOT_ORDER.map(slot => {
            const item = getEquipmentById(equipment[slot])
            if (!item) return null
            return (
              <div key={slot} className="flex items-center gap-2 font-body text-sm text-text-dim">
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
