import { useEffect } from 'react'
import { useUIStore } from '@/stores/ui-store'

export function useKeyboard() {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Escape closes modals
      if (e.key === 'Escape') {
        useUIStore.getState().closeModal()
      }

      // C = Character sheet
      if (e.key === 'c' && !e.metaKey && !e.ctrlKey) {
        const modal = useUIStore.getState().activeModal
        if (!modal) {
          useUIStore.getState().openModal('character_sheet')
        }
      }

      // I = Inventory
      if (e.key === 'i' && !e.metaKey && !e.ctrlKey) {
        const modal = useUIStore.getState().activeModal
        if (!modal) {
          useUIStore.getState().openModal('inventory')
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])
}
