import { RACES } from '@/config/character'
import type { CharacterRace } from '@/types/character'
import type { StatName } from '@/types/game'
import { STAT_COLORS } from '@/config/constants'

interface StepRaceProps {
  selected: CharacterRace
  onChange: (race: CharacterRace) => void
}

const RACE_ORDER: CharacterRace[] = ['human', 'elf', 'dwarf', 'half-orc']

export function StepRace({ selected, onChange }: StepRaceProps) {
  return (
    <div className="flex flex-col gap-4">
      <p className="font-body text-xl text-text-dim text-center leading-relaxed">
        De que povo você descende?<br />
        <span className="text-secondary">Cada linhagem carrega dons ancestrais.</span>
      </p>

      <div className="grid grid-cols-2 gap-3">
        {RACE_ORDER.map(raceId => {
          const race = RACES[raceId]
          const isSelected = selected === raceId
          return (
            <button
              key={raceId}
              onClick={() => onChange(raceId)}
              className={`
                p-3 cursor-pointer text-left transition-all
                ${isSelected ? 'pixel-border-accent bg-bg-light' : 'pixel-border bg-bg-panel hover:bg-bg-light'}
              `}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{race.icon}</span>
                <span className="font-pixel text-xs text-text">{race.label}</span>
              </div>
              <p className="font-body text-sm text-text-dim mb-2">{race.description}</p>
              <div className="flex flex-wrap gap-1">
                {Object.entries(race.statBonus).map(([stat, val]) => (
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
