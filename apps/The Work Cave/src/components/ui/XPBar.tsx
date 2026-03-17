import { useGameStore } from '@/stores/game-store'
import { motion } from 'framer-motion'

export function XPBar() {
  const character = useGameStore(s => s.character)
  const progress = useGameStore(s => s.levelProgress)

  return (
    <div className="flex items-center gap-2">
      <span className="font-pixel text-[10px] text-secondary">LV{character.level}</span>
      <div className="flex-1 h-3 bg-bg-dark pixel-border relative overflow-hidden">
        <motion.div
          className="h-full bg-xp"
          initial={false}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' as const }}
        />
      </div>
      <span className="font-body text-sm text-text-dim">{character.xp_total} XP</span>
    </div>
  )
}
