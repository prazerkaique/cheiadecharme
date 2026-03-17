import type { ReactNode } from 'react'
import { HUD } from './HUD'
import { BottomBar } from './BottomBar'
import { ToastContainer } from '@/components/ui/Toast'
import { CharacterSheet } from '@/components/game/CharacterSheet'
import { InventoryGrid } from '@/components/game/InventoryGrid'
import { AchievementList } from '@/components/game/AchievementList'
import { LevelUpOverlay } from '@/components/game/LevelUpOverlay'
import { Modal } from '@/components/ui/Modal'
import { useUIStore } from '@/stores/ui-store'

interface GameShellProps {
  children: ReactNode
}

export function GameShell({ children }: GameShellProps) {
  const activeModal = useUIStore(s => s.activeModal)

  return (
    <div className="relative w-full h-screen overflow-hidden bg-bg">
      <HUD />
      <main className="w-full h-full">{children}</main>
      <BottomBar />
      <ToastContainer />

      {/* Modals */}
      <Modal title="Character Sheet" isOpen={activeModal === 'character_sheet'}>
        <CharacterSheet />
      </Modal>
      <Modal title="Inventory" isOpen={activeModal === 'inventory'}>
        <InventoryGrid />
      </Modal>
      <Modal title="Achievements" isOpen={activeModal === 'achievements'}>
        <AchievementList />
      </Modal>

      <LevelUpOverlay />
    </div>
  )
}
