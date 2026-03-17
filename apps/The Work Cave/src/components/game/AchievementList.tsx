import { ACHIEVEMENTS } from '@/lib/achievements'
import { RARITY_COLORS } from '@/config/constants'

export function AchievementList() {
  // TODO: get unlocked from persistent store
  const unlockedKeys: string[] = []

  return (
    <div className="space-y-2 max-h-96 overflow-y-auto">
      {ACHIEVEMENTS.map(a => {
        const unlocked = unlockedKeys.includes(a.key)
        return (
          <div
            key={a.key}
            className={`
              flex items-center gap-3 p-3 pixel-border
              ${unlocked ? 'bg-bg-light' : 'bg-bg-dark opacity-50'}
            `}
          >
            <span className="text-2xl">{unlocked ? a.icon : '❓'}</span>
            <div className="flex-1">
              <span
                className="font-pixel text-[10px] block"
                style={{ color: unlocked ? RARITY_COLORS[a.rarity] : '#6b7280' }}
              >
                {unlocked ? a.name : '???'}
              </span>
              <span className="font-body text-sm text-text-dim">
                {unlocked ? a.description : 'Locked'}
              </span>
            </div>
            {unlocked && (
              <span
                className="font-pixel text-[8px]"
                style={{ color: RARITY_COLORS[a.rarity] }}
              >
                {a.rarity.toUpperCase()}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}
