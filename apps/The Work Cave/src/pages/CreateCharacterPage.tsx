import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGameStore } from '@/stores/game-store'
import { defaultAppearance, CLASSES, getEquipmentForClass, getWeaponVisual } from '@/config/character'
import { PixelButton } from '@/components/ui/PixelButton'
import { CharacterPreviewSprite } from '@/components/character-create/CharacterPreviewSprite'
import { StepName } from '@/components/character-create/StepName'
import { StepRace } from '@/components/character-create/StepRace'
import { StepClass } from '@/components/character-create/StepClass'
import { StepAppearance } from '@/components/character-create/StepAppearance'
import { StepEquipment } from '@/components/character-create/StepEquipment'
import { StepPreview } from '@/components/character-create/StepPreview'
import type { CharacterClass, CharacterRace, Appearance, EquipmentSlot } from '@/types/character'

const STEP_COUNT = 6
const STEP_TITLES = [
  'BATISMO',
  'LINHAGEM',
  'CAMINHO',
  'FORMA',
  'ARSENAL',
  'DESTINO',
]

function getDefaultEquipment(charClass: CharacterClass): Record<EquipmentSlot, string> {
  return {
    weapon: getEquipmentForClass(charClass, 'weapon')[0]?.id ?? '',
    armor: getEquipmentForClass(charClass, 'armor')[0]?.id ?? '',
    accessory: getEquipmentForClass(charClass, 'accessory')[0]?.id ?? '',
  }
}

export function CreateCharacterPage() {
  const navigate = useNavigate()
  const initCharacter = useGameStore(s => s.initCharacter)

  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [race, setRace] = useState<CharacterRace>('human')
  const [charClass, setCharClass] = useState<CharacterClass>('warrior')
  const [appearance, setAppearance] = useState<Appearance>(defaultAppearance('human', 'warrior'))
  const [equipment, setEquipment] = useState<Record<EquipmentSlot, string>>(getDefaultEquipment('warrior'))

  const handleRaceChange = useCallback((newRace: CharacterRace) => {
    setRace(newRace)
    setAppearance(prev => ({ ...prev, skinColor: defaultAppearance(newRace, charClass).skinColor }))
  }, [charClass])

  const handleClassChange = useCallback((newClass: CharacterClass) => {
    setCharClass(newClass)
    setAppearance(prev => ({ ...prev, outfitColor: CLASSES[newClass].defaultOutfitColor }))
    setEquipment(getDefaultEquipment(newClass))
  }, [])

  const canNext = (): boolean => {
    if (step === 0) return name.trim().length >= 2 && name.trim().length <= 20
    return true
  }

  const handleConfirm = () => {
    initCharacter({
      name: name.trim(),
      race,
      class: charClass,
      appearance,
      equipment,
    })
    navigate('/')
  }

  const showPreview = step >= 1 && step < 5

  return (
    <div className="w-full h-full flex items-center justify-center bg-bg p-4">
      <div className="w-full max-w-2xl flex flex-col gap-4">
        {/* Progress dots */}
        <div className="flex justify-center gap-3">
          {Array.from({ length: STEP_COUNT }).map((_, i) => (
            <div
              key={i}
              className={`
                w-3 h-3 rounded-full transition-all
                ${i === step ? 'bg-secondary scale-125' : i < step ? 'bg-accent' : 'bg-border-light'}
              `}
            />
          ))}
        </div>

        {/* Title */}
        <h2 className="font-pixel text-sm text-secondary text-center pixel-text">
          {STEP_TITLES[step]}
        </h2>

        {/* Content area */}
        <div className="pixel-border bg-bg-panel p-6 min-h-[340px] flex">
          {/* Step content */}
          <div className={`flex-1 ${showPreview ? 'pr-4' : ''}`}>
            {step === 0 && <StepName name={name} onChange={setName} />}
            {step === 1 && <StepRace selected={race} onChange={handleRaceChange} />}
            {step === 2 && <StepClass selected={charClass} onChange={handleClassChange} />}
            {step === 3 && <StepAppearance appearance={appearance} onChange={setAppearance} />}
            {step === 4 && <StepEquipment charClass={charClass} equipment={equipment} onChange={setEquipment} />}
            {step === 5 && (
              <StepPreview
                name={name.trim()}
                race={race}
                charClass={charClass}
                appearance={appearance}
                equipment={equipment}
              />
            )}
          </div>

          {/* Live preview sidebar */}
          {showPreview && (
            <div className="flex flex-col items-center justify-center pl-4 border-l border-border-light">
              <p className="font-pixel text-[8px] text-text-dim mb-3">PREVIEW</p>
              <CharacterPreviewSprite
                race={race}
                charClass={charClass}
                appearance={appearance}
                weaponVisual={getWeaponVisual(equipment.weapon)}
                scale={4}
              />
            </div>
          )}
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between">
          <PixelButton
            variant="ghost"
            size="md"
            onClick={() => setStep(s => s - 1)}
            disabled={step === 0}
          >
            Voltar
          </PixelButton>

          {step < STEP_COUNT - 1 ? (
            <PixelButton
              variant="primary"
              size="md"
              onClick={() => setStep(s => s + 1)}
              disabled={!canNext()}
            >
              Próximo
            </PixelButton>
          ) : (
            <PixelButton
              variant="accent"
              size="lg"
              onClick={handleConfirm}
            >
              Adentrar a Work Cave
            </PixelButton>
          )}
        </div>
      </div>
    </div>
  )
}
