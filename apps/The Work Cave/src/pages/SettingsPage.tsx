import { useState } from 'react'
import { useGameStore } from '@/stores/game-store'
import { useUIStore } from '@/stores/ui-store'
import { PixelPanel } from '@/components/ui/PixelPanel'
import { PixelButton } from '@/components/ui/PixelButton'
import { PixelInput } from '@/components/ui/PixelInput'

export function SettingsPage() {
  const character = useGameStore(s => s.character)
  const soundEnabled = useUIStore(s => s.soundEnabled)
  const toggleSound = useUIStore(s => s.toggleSound)
  const dailyReset = useGameStore(s => s.dailyReset)
  const addToast = useUIStore(s => s.addToast)

  const [name, setName] = useState(character.name)

  function handleSaveName() {
    if (name.trim()) {
      // Re-init with full build, keeping existing race/class/appearance/equipment
      useGameStore.getState().initCharacter({
        name: name.trim(),
        race: character.race,
        class: character.class,
        appearance: character.appearance,
        equipment: character.equipment,
      })
      addToast({ message: 'Character name updated!', type: 'success', icon: '✅' })
    }
  }

  return (
    <div className="h-full overflow-y-auto p-6 pt-20 pb-16">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <span className="text-5xl block mb-2">⚙️</span>
          <h1 className="font-pixel text-lg text-secondary pixel-text">Settings</h1>
        </div>

        <PixelPanel title="CHARACTER">
          <div className="space-y-3">
            <PixelInput
              label="Character Name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter your hero name..."
            />
            <PixelButton variant="accent" onClick={handleSaveName}>
              SAVE NAME
            </PixelButton>
          </div>
        </PixelPanel>

        <PixelPanel title="SOUND">
          <div className="flex items-center justify-between">
            <span className="font-body text-xl">Sound Effects</span>
            <PixelButton
              variant={soundEnabled ? 'accent' : 'ghost'}
              onClick={toggleSound}
            >
              {soundEnabled ? '🔊 ON' : '🔇 OFF'}
            </PixelButton>
          </div>
        </PixelPanel>

        <PixelPanel title="DAILY RESET">
          <p className="font-body text-lg text-text-dim mb-3">
            Reset HP and MP to full (happens automatically each day)
          </p>
          <PixelButton variant="secondary" onClick={() => {
            dailyReset()
            addToast({ message: 'HP and MP restored!', type: 'success', icon: '✨' })
          }}>
            RESET HP/MP
          </PixelButton>
        </PixelPanel>
      </div>
    </div>
  )
}
