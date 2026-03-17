import { useInventoryStore } from '@/stores/inventory-store'
import { ITEM_NAMES, ITEM_ICONS, type ItemKey } from '@/types/game'

const ALL_ITEMS: ItemKey[] = [
  'coffee_potion',
  'water_flask',
  'quest_scroll',
  'boss_trophy',
  'experience_gem',
  'streak_badge',
]

export function InventoryGrid() {
  const items = useInventoryStore(s => s.items)

  return (
    <div className="grid grid-cols-3 gap-3">
      {ALL_ITEMS.map(key => {
        const qty = items[key] ?? 0
        return (
          <div
            key={key}
            className={`
              bg-bg-dark pixel-border p-3 text-center
              ${qty > 0 ? 'opacity-100' : 'opacity-40'}
            `}
          >
            <span className="text-3xl block mb-1">{ITEM_ICONS[key]}</span>
            <span className="font-body text-sm block text-text-dim">{ITEM_NAMES[key]}</span>
            <span className="font-pixel text-xs text-secondary">x{qty}</span>
          </div>
        )
      })}
    </div>
  )
}
