import { useMemo } from 'react'
import { useMapStore } from '@/stores/map-store'
import { useGameStore } from '@/stores/game-store'
import { TILE_SIZE } from '@/types/map'
import { motion } from 'framer-motion'
import { generateCharacterSprite } from '@/config/character-sprites'
import { getWeaponVisual } from '@/config/character'
import { spriteToBoxShadow } from './sprites'

const SPRITE_SCALE = 2.5
const SPRITE_W = 16
const SPRITE_H = 16

export function CharacterSprite() {
  const position = useMapStore(s => s.position)
  const direction = useMapStore(s => s.direction)
  const isMoving = useMapStore(s => s.isMoving)

  const race = useGameStore(s => s.character.race)
  const charClass = useGameStore(s => s.character.class)
  const appearance = useGameStore(s => s.character.appearance)
  const weaponId = useGameStore(s => s.character.equipment.weapon)
  const weaponVisual = getWeaponVisual(weaponId)

  const spriteData = useMemo(
    () => generateCharacterSprite(direction, isMoving, { race, class: charClass, appearance, weaponVisual }),
    [direction, isMoving, race, charClass, appearance, weaponVisual],
  )

  const shadow = useMemo(() => spriteToBoxShadow(spriteData), [spriteData])

  const spriteWidth = SPRITE_W * SPRITE_SCALE
  const spriteHeight = SPRITE_H * SPRITE_SCALE

  // Center sprite on tile
  const offsetX = (TILE_SIZE - spriteWidth) / 2
  const offsetY = TILE_SIZE - spriteHeight - 2

  return (
    <motion.div
      className="absolute z-20 pointer-events-none"
      style={{
        width: TILE_SIZE,
        height: TILE_SIZE,
      }}
      animate={{
        left: position.x * TILE_SIZE,
        top: position.y * TILE_SIZE,
      }}
      transition={{
        duration: 0.18,
        ease: 'linear' as const,
      }}
    >
      {/* Shadow */}
      <div
        className="absolute rounded-full"
        style={{
          width: spriteWidth * 0.7,
          height: 6,
          backgroundColor: 'rgba(0,0,0,0.25)',
          bottom: 1,
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      />

      {/* Sprite */}
      <div
        style={{
          position: 'absolute',
          left: offsetX,
          top: offsetY,
          width: spriteWidth,
          height: spriteHeight,
          overflow: 'hidden',
        }}
        className={isMoving ? 'animate-walk' : ''}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 1,
            height: 1,
            boxShadow: shadow,
            transform: `scale(${SPRITE_SCALE})`,
            transformOrigin: 'top left',
          }}
        />
      </div>
    </motion.div>
  )
}
