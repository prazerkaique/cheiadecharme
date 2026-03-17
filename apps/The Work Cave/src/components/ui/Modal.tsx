import { type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUIStore } from '@/stores/ui-store'

interface ModalProps {
  children: ReactNode
  title: string
  isOpen: boolean
}

export function Modal({ children, title, isOpen }: ModalProps) {
  const closeModal = useUIStore(s => s.closeModal)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60" onClick={closeModal} />

          {/* Content */}
          <motion.div
            className="relative bg-bg-panel pixel-border-accent p-6 max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-pixel text-sm text-secondary pixel-text">{title}</h2>
              <button
                onClick={closeModal}
                className="font-pixel text-xs text-text-dim hover:text-primary cursor-pointer"
              >
                X
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
