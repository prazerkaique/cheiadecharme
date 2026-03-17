import { useGameStore } from '@/stores/game-store'
import { useTimerStore } from '@/stores/timer-store'
import { useUIStore } from '@/stores/ui-store'
import { XPBar } from '@/components/ui/XPBar'

export function HUD() {
  const character = useGameStore(s => s.character)
  const secondsLeft = useTimerStore(s => s.secondsLeft)
  const isRunning = useTimerStore(s => s.isRunning)
  const mode = useTimerStore(s => s.mode)
  const openModal = useUIStore(s => s.openModal)

  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60
  const timerDisplay = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`

  return (
    <div className="absolute top-0 left-0 right-0 z-40 flex items-start justify-between p-3 pointer-events-none">
      {/* Left: Character info */}
      <div className="pointer-events-auto flex flex-col gap-2 w-64">
        <div className="bg-bg-dark/90 pixel-border p-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">🧙</span>
            <span className="font-pixel text-[10px] text-text-bright">{character.name}</span>
          </div>
          <XPBar />
          <div className="flex gap-3 mt-2">
            <div className="flex items-center gap-1">
              <span className="text-sm">❤️</span>
              <div className="w-16 h-2 bg-bg-dark pixel-border overflow-hidden">
                <div
                  className="h-full bg-hp"
                  style={{ width: `${(character.hp / character.hp_max) * 100}%` }}
                />
              </div>
              <span className="font-body text-xs text-text-dim">{character.hp}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm">💎</span>
              <div className="w-16 h-2 bg-bg-dark pixel-border overflow-hidden">
                <div
                  className="h-full bg-mp"
                  style={{ width: `${(character.mp / character.mp_max) * 100}%` }}
                />
              </div>
              <span className="font-body text-xs text-text-dim">{character.mp}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Center: Timer */}
      {(isRunning || mode !== 'work' || secondsLeft < 1500) && (
        <div className="pointer-events-auto bg-bg-dark/90 pixel-border px-4 py-2 text-center">
          <span className="font-pixel text-[10px] text-text-dim block mb-1">
            {mode === 'work' ? 'FOCUS' : mode === 'short_break' ? 'BREAK' : 'LONG BREAK'}
          </span>
          <span className={`font-pixel text-lg ${isRunning ? 'text-accent' : 'text-text-dim'}`}>
            {timerDisplay}
          </span>
        </div>
      )}

      {/* Right: Quick actions */}
      <div className="pointer-events-auto flex gap-2">
        <button
          onClick={() => openModal('character_sheet')}
          className="bg-bg-dark/90 pixel-border px-3 py-2 font-pixel text-[10px] text-text-dim hover:text-secondary cursor-pointer"
          title="Character (C)"
        >
          🧙 CHAR
        </button>
        <button
          onClick={() => openModal('inventory')}
          className="bg-bg-dark/90 pixel-border px-3 py-2 font-pixel text-[10px] text-text-dim hover:text-secondary cursor-pointer"
          title="Inventory (I)"
        >
          🎒 INV
        </button>
        <button
          onClick={() => openModal('achievements')}
          className="bg-bg-dark/90 pixel-border px-3 py-2 font-pixel text-[10px] text-text-dim hover:text-secondary cursor-pointer"
          title="Achievements"
        >
          🏆
        </button>
      </div>
    </div>
  )
}
