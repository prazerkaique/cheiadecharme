import { WaterTracker } from '@/components/tracker/WaterTracker'
import { PixelPanel } from '@/components/ui/PixelPanel'
import { useGameStore } from '@/stores/game-store'

export function FountainPage() {
  const character = useGameStore(s => s.character)

  return (
    <div className="h-full overflow-y-auto p-6 pt-20 pb-16">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <span className="text-5xl block mb-2">⛲</span>
          <h1 className="font-pixel text-lg text-secondary pixel-text">Fonte da Vitalidade</h1>
          <p className="font-body text-xl text-text-dim">
            A água cristalina brilha com energia ancestral.<br />
            <span className="text-secondary">Cada gole restaura suas forças.</span>
          </p>
        </div>

        <PixelPanel accent>
          <WaterTracker />
        </PixelPanel>

        <PixelPanel title="VITALIDADE">
          <div className="space-y-3">
            <div>
              <div className="flex justify-between font-body text-lg mb-1">
                <span className="text-hp">❤️ HP (Energia)</span>
                <span>{character.hp}/{character.hp_max}</span>
              </div>
              <div className="h-6 bg-bg-dark pixel-border overflow-hidden">
                <div
                  className="h-full bg-hp transition-all"
                  style={{ width: `${(character.hp / character.hp_max) * 100}%` }}
                />
              </div>
              <p className="font-body text-sm text-text-dim mt-1">
                -10 HP por hora trabalhada. Água restaura 15 HP.
              </p>
            </div>
            <div>
              <div className="flex justify-between font-body text-lg mb-1">
                <span className="text-mp">💎 MP (Foco)</span>
                <span>{character.mp}/{character.mp_max}</span>
              </div>
              <div className="h-6 bg-bg-dark pixel-border overflow-hidden">
                <div
                  className="h-full bg-mp transition-all"
                  style={{ width: `${(character.mp / character.mp_max) * 100}%` }}
                />
              </div>
              <p className="font-body text-sm text-text-dim mt-1">
                -10 MP por pomodoro. Café restaura 20 MP.
              </p>
            </div>
          </div>
        </PixelPanel>
      </div>
    </div>
  )
}
