import { useGameStore } from '@/stores/game-store'
import { STAT_LABELS, STAT_COLORS } from '@/config/constants'
import { RACES, CLASSES, getEquipmentById } from '@/config/character'
import type { StatName } from '@/types/game'
import type { EquipmentSlot } from '@/types/character'

const STAT_ORDER: StatName[] = ['str', 'dex', 'con', 'int', 'wis', 'cha']
const SLOT_ORDER: EquipmentSlot[] = ['weapon', 'armor', 'accessory']

export function CharacterSheet() {
  const character = useGameStore(s => s.character)
  const raceDef = RACES[character.race]
  const classDef = CLASSES[character.class]

  return (
    <div className="space-y-4">
      {/* Name & Level */}
      <div className="text-center">
        <p className="font-pixel text-lg text-secondary pixel-text">{character.name}</p>
        <p className="font-body text-lg text-text-dim">
          {raceDef.icon} {raceDef.label} &middot; {classDef.icon} {classDef.label}
        </p>
        <p className="font-body text-xl text-text-dim">Level {character.level}</p>
      </div>

      {/* HP/MP */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="flex justify-between font-body text-sm mb-1">
            <span className="text-hp">HP</span>
            <span>{character.hp}/{character.hp_max}</span>
          </div>
          <div className="h-4 bg-bg-dark pixel-border overflow-hidden">
            <div
              className="h-full bg-hp transition-all"
              style={{ width: `${(character.hp / character.hp_max) * 100}%` }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between font-body text-sm mb-1">
            <span className="text-mp">MP</span>
            <span>{character.mp}/{character.mp_max}</span>
          </div>
          <div className="h-4 bg-bg-dark pixel-border overflow-hidden">
            <div
              className="h-full bg-mp transition-all"
              style={{ width: `${(character.mp / character.mp_max) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-2">
        {STAT_ORDER.map(stat => (
          <div key={stat} className="flex items-center gap-3">
            <span
              className="font-pixel text-[10px] w-12 text-right"
              style={{ color: STAT_COLORS[stat] }}
            >
              {STAT_LABELS[stat].slice(0, 3).toUpperCase()}
            </span>
            <div className="flex-1 h-3 bg-bg-dark pixel-border overflow-hidden">
              <div
                className="h-full transition-all"
                style={{
                  width: `${(character.stats[stat] / 20) * 100}%`,
                  backgroundColor: STAT_COLORS[stat],
                }}
              />
            </div>
            <span className="font-pixel text-xs text-text w-6 text-right">
              {character.stats[stat]}
            </span>
          </div>
        ))}
      </div>

      {/* Equipment */}
      <div>
        <p className="font-pixel text-[10px] text-secondary mb-2">EQUIPAMENTO</p>
        <div className="space-y-1">
          {SLOT_ORDER.map(slot => {
            const item = getEquipmentById(character.equipment[slot])
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

      {/* Total XP */}
      <div className="text-center font-body text-lg text-text-dim">
        Total XP: <span className="text-xp">{character.xp_total}</span>
      </div>
    </div>
  )
}
