import { useInventoryStore } from '@/stores/inventory-store'
import { useGameStore } from '@/stores/game-store'
import { useUIStore } from '@/stores/ui-store'
import { COFFEE_XP, COFFEE_MP_RESTORE } from '@/config/constants'
import { PixelButton } from '@/components/ui/PixelButton'

export function CoffeeTracker() {
  const coffeeToday = useInventoryStore(s => s.coffeeToday)
  const addCoffee = useInventoryStore(s => s.addCoffee)
  const addXp = useGameStore(s => s.addXp)
  const restoreMp = useGameStore(s => s.restoreMp)
  const addToast = useUIStore(s => s.addToast)
  const mp = useGameStore(s => s.character.mp)
  const mpMax = useGameStore(s => s.character.mp_max)

  function handleCoffee() {
    addCoffee()
    addXp(COFFEE_XP)
    restoreMp(COFFEE_MP_RESTORE)
    addToast({
      message: `Poção de Foco! +${COFFEE_XP} XP, +${COFFEE_MP_RESTORE} MP`,
      type: 'info',
      icon: '☕',
    })
  }

  return (
    <div className="text-center space-y-4">
      <span className="text-6xl block">☕</span>
      <h3 className="font-pixel text-sm text-secondary pixel-text">Poção de Foco</h3>
      <p className="font-body text-xl text-text-dim">
        Cada poção restaura <span className="text-mp">{COFFEE_MP_RESTORE} MP</span> e concede{' '}
        <span className="text-xp">{COFFEE_XP} XP</span>
      </p>
      <div className="bg-bg-dark pixel-border p-4 inline-block">
        <p className="font-pixel text-3xl text-secondary">{coffeeToday}</p>
        <p className="font-body text-lg text-text-dim">poções hoje</p>
      </div>
      <div className="flex items-center justify-center gap-2">
        <span className="font-body text-lg text-text-dim">MP: {mp}/{mpMax}</span>
      </div>
      <PixelButton variant="secondary" size="lg" onClick={handleCoffee}>
        ☕ BEBER POÇÃO
      </PixelButton>
    </div>
  )
}
