import { getEquipmentForClass } from '@/config/character'
import type { CharacterClass, EquipmentSlot } from '@/types/character'
import type { StatName } from '@/types/game'
import { STAT_COLORS } from '@/config/constants'

interface StepEquipmentProps {
  charClass: CharacterClass
  equipment: Record<EquipmentSlot, string>
  onChange: (equipment: Record<EquipmentSlot, string>) => void
}

const SLOT_LABELS: Record<EquipmentSlot, string> = {
  weapon: 'Arma',
  armor: 'Armadura',
  accessory: 'Acessório',
}

const SLOT_ORDER: EquipmentSlot[] = ['weapon', 'armor', 'accessory']

export function StepEquipment({ charClass, equipment, onChange }: StepEquipmentProps) {
  return (
    <div className="flex flex-col gap-4">
      <p className="font-body text-xl text-text-dim text-center leading-relaxed">
        Toda jornada começa com as ferramentas certas.<br />
        <span className="text-secondary">Escolha bem — elas definirão seus primeiros passos.</span>
      </p>

      <div className="grid grid-cols-3 gap-3">
        {SLOT_ORDER.map(slot => {
          const items = getEquipmentForClass(charClass, slot)
          return (
            <div key={slot}>
              <p className="font-pixel text-[10px] text-secondary mb-2 text-center">
                {SLOT_LABELS[slot]}
              </p>
              <div className="flex flex-col gap-2">
                {items.map(item => {
                  const isSelected = equipment[slot] === item.id
                  return (
                    <button
                      key={item.id}
                      onClick={() => onChange({ ...equipment, [slot]: item.id })}
                      className={`
                        p-2 cursor-pointer text-left transition-all
                        ${isSelected ? 'pixel-border-accent bg-bg-light' : 'pixel-border bg-bg-panel hover:bg-bg-light'}
                      `}
                    >
                      <div className="flex items-center gap-1 mb-1">
                        <span className="text-lg">{item.icon}</span>
                        <span className="font-body text-sm text-text">{item.name}</span>
                      </div>
                      <div className="flex gap-1">
                        {Object.entries(item.statBonus).map(([stat, val]) => (
                          <span
                            key={stat}
                            className="font-pixel text-[8px] px-1 py-0.5 rounded"
                            style={{ color: STAT_COLORS[stat as StatName], backgroundColor: 'rgba(0,0,0,0.3)' }}
                          >
                            {stat.toUpperCase()} +{val}
                          </span>
                        ))}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
