import { useInventoryStore } from '@/stores/inventory-store'
import { useGameStore } from '@/stores/game-store'
import { useUIStore } from '@/stores/ui-store'
import { WATER_XP, WATER_HP_RESTORE } from '@/config/constants'
import { PixelButton } from '@/components/ui/PixelButton'

export function WaterTracker() {
  const waterToday = useInventoryStore(s => s.waterToday)
  const addWater = useInventoryStore(s => s.addWater)
  const addXp = useGameStore(s => s.addXp)
  const restoreHp = useGameStore(s => s.restoreHp)
  const addToast = useUIStore(s => s.addToast)
  const hp = useGameStore(s => s.character.hp)
  const hpMax = useGameStore(s => s.character.hp_max)

  function handleWater() {
    addWater()
    addXp(WATER_XP)
    restoreHp(WATER_HP_RESTORE)
    addToast({
      message: `Frasco da Fonte! +${WATER_XP} XP, +${WATER_HP_RESTORE} HP`,
      type: 'info',
      icon: '💧',
    })
  }

  return (
    <div className="text-center space-y-4">
      <span className="text-6xl block">⛲</span>
      <h3 className="font-pixel text-sm text-secondary pixel-text">Fonte da Vitalidade</h3>
      <p className="font-body text-xl text-text-dim">
        Cada frasco restaura <span className="text-hp">{WATER_HP_RESTORE} HP</span> e concede{' '}
        <span className="text-xp">{WATER_XP} XP</span>
      </p>
      <div className="bg-bg-dark pixel-border p-4 inline-block">
        <p className="font-pixel text-3xl text-mana">{waterToday}</p>
        <p className="font-body text-lg text-text-dim">frascos hoje</p>
      </div>
      <div className="flex items-center justify-center gap-2">
        <span className="font-body text-lg text-text-dim">HP: {hp}/{hpMax}</span>
      </div>
      <PixelButton variant="accent" size="lg" onClick={handleWater}>
        💧 ENCHER FRASCO
      </PixelButton>
    </div>
  )
}
