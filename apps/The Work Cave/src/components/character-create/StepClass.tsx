import { CLASSES } from '@/config/character'
import type { CharacterClass } from '@/types/character'
import type { StatName } from '@/types/game'
import { STAT_COLORS } from '@/config/constants'

interface StepClassProps {
  selected: CharacterClass
  onChange: (charClass: CharacterClass) => void
}

const CLASS_ORDER: CharacterClass[] = ['warrior', 'rogue', 'mage', 'barbarian']

export function StepClass({ selected, onChange }: StepClassProps) {
  return (
    <div className="flex flex-col gap-4">
      <p className="font-body text-xl text-text-dim text-center leading-relaxed">
        Qual caminho você trilha?<br />
        <span className="text-secondary">A espada, a sombra, ou a magia?</span>
      </p>

      <div className="grid grid-cols-2 gap-3">
        {CLASS_ORDER.map(classId => {
          const cls = CLASSES[classId]
          const isSelected = selected === classId
          return (
            <button
              key={classId}
              onClick={() => onChange(classId)}
              className={`
                p-3 cursor-pointer text-left transition-all
                ${isSelected ? 'pixel-border-accent bg-bg-light' : 'pixel-border bg-bg-panel hover:bg-bg-light'}
              `}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{cls.icon}</span>
                <span className="font-pixel text-xs text-text">{cls.label}</span>
              </div>
              <p className="font-body text-sm text-text-dim mb-2">{cls.description}</p>
              <div className="flex flex-wrap gap-1">
                {Object.entries(cls.statBonus).map(([stat, val]) => (
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
}
