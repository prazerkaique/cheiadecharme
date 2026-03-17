import { useMemo } from 'react'
import { generateCharacterSprite } from '@/config/character-sprites'
import { spriteToBoxShadow } from '@/components/map/sprites'
import type { CharacterClass, CharacterRace, Appearance } from '@/types/character'
import type { WeaponVisual } from '@/config/character'

interface CharacterPreviewSpriteProps {
  race: CharacterRace
  charClass: CharacterClass
  appearance: Appearance
  weaponVisual?: WeaponVisual
  scale?: number
  animate?: boolean
}

export function CharacterPreviewSprite({
  race,
  charClass,
  appearance,
  weaponVisual = 'none',
  scale = 4,
  animate = false,
}: CharacterPreviewSpriteProps) {
  const sprite = useMemo(
    () => generateCharacterSprite('down', false, { race, class: charClass, appearance, weaponVisual }),
    [race, charClass, appearance, weaponVisual],
  )

  const shadow = useMemo(() => spriteToBoxShadow(sprite), [sprite])

  const width = 16 * scale
  const height = 16 * scale

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        style={{ width, height, overflow: 'hidden', position: 'relative' }}
        className={animate ? 'animate-walk' : ''}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 1,
            height: 1,
            boxShadow: shadow,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
        />
      </div>
      <div
        className="rounded-full"
        style={{
          width: width * 0.6,
          height: 6,
          backgroundColor: 'rgba(0,0,0,0.3)',
          marginTop: -8,
        }}
      />
    </div>
  )
}
