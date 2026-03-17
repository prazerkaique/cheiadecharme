import { useMemo } from 'react'
import { OVERWORLD_TILES } from '@/config/maps'
import { TILE_SIZE, MAP_COLS, MAP_ROWS, type TileId } from '@/types/map'
import { TILE_STYLES, tilePatternToBoxShadow } from './sprites'

const TILE_TEXTURE_SCALE = TILE_SIZE / 8 // 8x8 pattern scaled to tile size

function TileCell({ tile }: { tile: TileId }) {
  const style = TILE_STYLES[tile]

  const patternShadow = useMemo(() => {
    if (!style?.pattern) return ''
    return tilePatternToBoxShadow(style.pattern)
  }, [style])

  const isTree = tile === 'tree'
  const isWater = tile === 'water'

  return (
    <div
      style={{
        width: TILE_SIZE,
        height: TILE_SIZE,
        backgroundColor: isTree ? '#4ade80' : style.bg,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Texture pattern */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 1,
          height: 1,
          boxShadow: patternShadow,
          transform: `scale(${TILE_TEXTURE_SCALE})`,
          transformOrigin: 'top left',
          opacity: 0.8,
        }}
      />

      {/* Tree overlay */}
      {isTree && (
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Tree trunk */}
          <div
            className="absolute"
            style={{
              width: 6,
              height: 14,
              backgroundColor: '#4a2810',
              bottom: 4,
              left: '50%',
              transform: 'translateX(-50%)',
              borderRadius: 1,
            }}
          />
          {/* Tree canopy - layered circles */}
          <div
            className="absolute"
            style={{
              width: 32,
              height: 26,
              bottom: 14,
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          >
            <div className="absolute" style={{
              width: 24, height: 20, backgroundColor: '#166534',
              borderRadius: '50%', bottom: 0, left: 4,
              boxShadow: 'inset -4px -4px 0 #14532d, inset 4px 4px 0 #1a7a3c',
            }} />
            <div className="absolute" style={{
              width: 20, height: 16, backgroundColor: '#15803d',
              borderRadius: '50%', bottom: 6, left: 2,
              boxShadow: 'inset -3px -3px 0 #166534',
            }} />
            <div className="absolute" style={{
              width: 16, height: 14, backgroundColor: '#16a34a',
              borderRadius: '50%', bottom: 10, left: 8,
              boxShadow: 'inset -2px -2px 0 #15803d',
            }} />
          </div>
          {/* Tree shadow on ground */}
          <div className="absolute" style={{
            width: 28, height: 8, backgroundColor: 'rgba(0,0,0,0.15)',
            borderRadius: '50%', bottom: 2, left: '50%', transform: 'translateX(-50%)',
          }} />
        </div>
      )}

      {/* Water shimmer animation */}
      {isWater && (
        <div
          className="absolute inset-0 water-shimmer"
          style={{
            background: `
              linear-gradient(135deg, transparent 25%, rgba(147,197,253,0.3) 50%, transparent 75%)
            `,
            backgroundSize: '200% 200%',
          }}
        />
      )}

      {/* Subtle grid line */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRight: '1px solid rgba(0,0,0,0.06)',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
        }}
      />
    </div>
  )
}

export function TileLayer() {
  return (
    <div
      className="absolute inset-0"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${MAP_COLS}, ${TILE_SIZE}px)`,
        gridTemplateRows: `repeat(${MAP_ROWS}, ${TILE_SIZE}px)`,
      }}
    >
      {OVERWORLD_TILES.flatMap((row, y) =>
        row.map((tile, x) => (
          <TileCell key={`${x}-${y}`} tile={tile} />
        ))
      )}
    </div>
  )
}
