import { useMemo } from 'react'
import { spriteToBoxShadow } from './sprites'

interface PixelSpriteProps {
  sprite: (string | null)[][]
  scale?: number
  className?: string
}

/**
 * Renders pixel art using the CSS box-shadow technique.
 * Each pixel in the sprite data becomes a 1px box-shadow,
 * then the whole thing is scaled up via CSS transform.
 */
export function PixelSprite({ sprite, scale = 3, className = '' }: PixelSpriteProps) {
  const shadow = useMemo(() => spriteToBoxShadow(sprite), [sprite])
  const width = sprite[0]?.length ?? 16
  const height = sprite.length

  return (
    <div
      className={className}
      style={{
        width: width * scale,
        height: height * scale,
        overflow: 'hidden',
        position: 'relative',
      }}
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
  )
}
