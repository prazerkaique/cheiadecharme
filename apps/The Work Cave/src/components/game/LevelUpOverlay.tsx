import { motion, AnimatePresence } from 'framer-motion'
import { useUIStore } from '@/stores/ui-store'
import { useGameStore } from '@/stores/game-store'

export function LevelUpOverlay() {
  const activeModal = useUIStore(s => s.activeModal)
  const closeModal = useUIStore(s => s.closeModal)
  const character = useGameStore(s => s.character)
  const isOpen = activeModal === 'level_up'

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeModal}
        >
          <motion.div
            className="text-center"
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 10 }}
            transition={{ type: 'spring', damping: 15 }}
            onClick={e => e.stopPropagation()}
          >
            <motion.div
              className="level-glow inline-block"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <span className="text-8xl block mb-4">⬆️</span>
            </motion.div>
            <h2 className="font-pixel text-2xl text-secondary pixel-text mb-2">LEVEL UP!</h2>
            <p className="font-pixel text-4xl text-xp pixel-text mb-4">{character.level}</p>
            <p className="font-body text-2xl text-text-dim mb-6">
              You have grown stronger!
            </p>
            <button
              onClick={closeModal}
              className="font-pixel text-sm text-secondary hover:text-primary cursor-pointer px-6 py-3 pixel-border bg-bg-panel"
            >
              CONTINUE
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
