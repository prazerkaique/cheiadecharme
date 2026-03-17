import { useMemo } from 'react'
import { TILE_SIZE } from '@/types/map'
import type { MapBuilding } from '@/types/map'
import { useQuestStore } from '@/stores/quest-store'

interface BuildingProps {
  building: MapBuilding
  onClick: (building: MapBuilding) => void
}

// ═══════════════════════════════════════════════════════════════
// TAVERNA DO SAPO CAOLHO — Medieval tavern, central hub + coffee
// ═══════════════════════════════════════════════════════════════
function TavernSprite({ h }: { w: number; h: number }) {
  return (
    <div className="w-full h-full relative">
      {/* Stone foundation */}
      <div className="absolute inset-x-0 bottom-0" style={{
        height: h * 0.55, backgroundColor: '#c4a882',
        boxShadow: 'inset -5px 0 0 #a08868, inset 0 -4px 0 #8a7458, inset 5px 0 0 #d4b892',
      }}>
        {/* Timber beams */}
        <div className="absolute inset-0" style={{
          background: `
            linear-gradient(90deg, #5c3a1e 2px, transparent 2px) 0 0 / 30px 100%,
            linear-gradient(0deg, transparent 60%, #5c3a1e 60%, #5c3a1e calc(60% + 2px), transparent calc(60% + 2px))
          `,
        }} />
        {/* Large arched door */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2" style={{
          width: 28, height: h * 0.38, backgroundColor: '#4a2810',
          borderRadius: '14px 14px 0 0',
          boxShadow: 'inset -4px 0 0 rgba(0,0,0,0.3), inset 4px 0 0 rgba(255,255,255,0.05)',
        }}>
          {/* Door studs */}
          <div className="absolute top-3 left-2 w-2 h-2 rounded-full bg-yellow-600" />
          <div className="absolute top-3 right-2 w-2 h-2 rounded-full bg-yellow-600" />
          {/* Door handle */}
          <div className="absolute right-3 top-1/2 w-2 h-4 rounded bg-yellow-500" />
        </div>
        {/* Warm tavern windows */}
        <div className="absolute" style={{ top: 4, left: 8, width: 16, height: 18, background: 'linear-gradient(180deg, #f59e0b 0%, #dc7633 100%)', border: '3px solid #5c3a1e', borderRadius: '8px 8px 0 0', boxShadow: '0 0 8px rgba(245,158,11,0.4)' }}>
          <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, transparent 45%, #5c3a1e 45%, #5c3a1e 55%, transparent 55%)' }} />
        </div>
        <div className="absolute" style={{ top: 4, right: 8, width: 16, height: 18, background: 'linear-gradient(180deg, #f59e0b 0%, #dc7633 100%)', border: '3px solid #5c3a1e', borderRadius: '8px 8px 0 0', boxShadow: '0 0 8px rgba(245,158,11,0.4)' }}>
          <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, transparent 45%, #5c3a1e 45%, #5c3a1e 55%, transparent 55%)' }} />
        </div>
      </div>
      {/* Steep roof */}
      <div className="absolute inset-x-0 top-0" style={{ height: h * 0.5 }}>
        <div className="absolute bottom-0 left-0 right-0 h-full" style={{
          background: 'linear-gradient(135deg, #7c2d12 0%, #5c1d0c 60%, #4a1508 100%)',
          clipPath: 'polygon(50% 0%, -8% 100%, 108% 100%)',
        }} />
        <div className="absolute bottom-0 left-0 right-0 h-full" style={{
          background: 'repeating-linear-gradient(to bottom, transparent 0px, transparent 5px, rgba(0,0,0,0.12) 5px, rgba(0,0,0,0.12) 6px)',
          clipPath: 'polygon(50% 0%, -8% 100%, 108% 100%)',
        }} />
      </div>
      {/* Chimney with smoke */}
      <div className="absolute" style={{ top: -4, right: '15%', width: 10, height: 16, backgroundColor: '#4a2e16', borderRadius: '2px 2px 0 0' }}>
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-gray-500/40 chimney-smoke" />
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-gray-400/30 chimney-smoke" style={{ animationDelay: '0.5s' }} />
      </div>
      {/* Hanging tavern sign */}
      <div className="absolute" style={{ top: h * 0.18, left: -6 }}>
        <div style={{ width: 2, height: 10, backgroundColor: '#5c3a1e', marginLeft: 10 }} />
        <div style={{
          width: 24, height: 14, backgroundColor: '#4a2810', borderRadius: 2,
          border: '1px solid #d4a030', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: 8 }}>🐸</span>
        </div>
      </div>
      <BuildingLabel text="O SAPO CAOLHO" color="#f59e0b" />
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// DOJO DO DRAGÃO VERMELHO (Nerau) — Oriental dojo, red/black
// ═══════════════════════════════════════════════════════════════
function DojoSprite({ h }: { w: number; h: number }) {
  return (
    <div className="w-full h-full relative">
      {/* White/cream walls */}
      <div className="absolute inset-x-0 bottom-0" style={{
        height: h * 0.55, backgroundColor: '#f5f0e0',
        boxShadow: 'inset -4px 0 0 #ddd8c8, inset 0 -3px 0 #ccc8b8, inset 4px 0 0 #fffaf0',
      }}>
        {/* Dark wood frame lines */}
        <div className="absolute inset-0" style={{
          background: `
            linear-gradient(90deg, #1a1a1a 2px, transparent 2px) 0 0 / 28px 100%,
            linear-gradient(0deg, transparent 55%, #1a1a1a 55%, #1a1a1a calc(55% + 2px), transparent calc(55% + 2px))
          `,
        }} />
        {/* Sliding shoji door */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2" style={{
          width: 26, height: h * 0.38, backgroundColor: '#f5f0e0',
          border: '2px solid #1a1a1a',
        }}>
          {/* Shoji grid pattern */}
          <div className="absolute inset-0" style={{
            background: `
              linear-gradient(90deg, #1a1a1a 1px, transparent 1px) 0 0 / 9px 100%,
              linear-gradient(0deg, #1a1a1a 1px, transparent 1px) 0 0 / 100% 10px
            `,
            opacity: 0.3,
          }} />
        </div>
        {/* Red paper lanterns */}
        <div className="absolute" style={{ top: 2, left: 8, width: 8, height: 12, backgroundColor: '#dc2626', borderRadius: '4px', boxShadow: '0 0 8px rgba(220,38,38,0.5)', border: '1px solid #991b1b' }}>
          <div className="absolute inset-x-0 top-1/2 h-px bg-black/20" />
        </div>
        <div className="absolute" style={{ top: 2, right: 8, width: 8, height: 12, backgroundColor: '#dc2626', borderRadius: '4px', boxShadow: '0 0 8px rgba(220,38,38,0.5)', border: '1px solid #991b1b' }}>
          <div className="absolute inset-x-0 top-1/2 h-px bg-black/20" />
        </div>
      </div>
      {/* Pagoda-style roof — black/dark gray */}
      <div className="absolute inset-x-0 top-0" style={{ height: h * 0.5 }}>
        <div className="absolute bottom-0 left-0 right-0 h-full" style={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
          clipPath: 'polygon(50% 15%, -10% 100%, 110% 100%)',
        }} />
        {/* Curved eaves */}
        <div className="absolute bottom-0 inset-x-0 h-4" style={{
          background: 'linear-gradient(180deg, transparent 0%, #1a1a1a 40%)',
          clipPath: 'polygon(0% 0%, 5% 100%, 95% 100%, 100% 0%, 90% 60%, 50% 30%, 10% 60%)',
        }} />
      </div>
      {/* Torii gate accent on top */}
      <div className="absolute left-1/2 -translate-x-1/2" style={{ top: -8 }}>
        {/* Horizontal beam */}
        <div style={{ width: 30, height: 3, backgroundColor: '#dc2626', borderRadius: 1 }} />
        {/* Second beam */}
        <div style={{ width: 24, height: 2, backgroundColor: '#dc2626', marginTop: 2, marginLeft: 3 }} />
        {/* Pillars */}
        <div className="absolute" style={{ top: 0, left: 2, width: 3, height: 12, backgroundColor: '#dc2626' }} />
        <div className="absolute" style={{ top: 0, right: 2, width: 3, height: 12, backgroundColor: '#dc2626' }} />
      </div>
      <BuildingLabel text="NERAU" color="#dc2626" />
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// ATELIER VIZZU — Medieval tailor's workshop, fabrics & mannequin
// ═══════════════════════════════════════════════════════════════
function AtelierSprite({ h }: { w: number; h: number }) {
  return (
    <div className="w-full h-full relative">
      {/* Warm wood walls */}
      <div className="absolute inset-x-0 bottom-0" style={{
        height: h * 0.55, backgroundColor: '#d4a574',
        boxShadow: 'inset -4px 0 0 #b8956a, inset 0 -3px 0 #a0805a, inset 4px 0 0 #e8c098',
      }}>
        {/* Wood plank lines */}
        <div className="absolute inset-0" style={{
          background: `
            repeating-linear-gradient(0deg, transparent 0px, transparent 10px, rgba(0,0,0,0.06) 10px, rgba(0,0,0,0.06) 11px)
          `,
        }} />
        {/* Shop door with fabric curtain */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2" style={{
          width: 24, height: h * 0.36, backgroundColor: '#4a2810',
          borderRadius: '3px 3px 0 0',
          boxShadow: 'inset -3px 0 0 rgba(0,0,0,0.3)',
        }}>
          {/* Draped curtain over door */}
          <div className="absolute top-0 inset-x-0" style={{
            height: '40%',
            background: 'linear-gradient(180deg, #9333ea 0%, #7c3aed 50%, transparent 100%)',
            clipPath: 'polygon(0% 0%, 50% 70%, 100% 0%)',
          }} />
          {/* Door handle */}
          <div className="absolute right-2 top-1/2 w-2 h-3 rounded bg-yellow-600" />
        </div>
        {/* Display window left — fabric rolls */}
        <div className="absolute" style={{ top: 3, left: 6, width: 18, height: 16, backgroundColor: '#fef3c7', border: '2px solid #92400e', borderRadius: 2 }}>
          {/* Fabric rolls */}
          <div className="absolute bottom-1 left-1" style={{ width: 4, height: 10, borderRadius: '2px 2px 4px 4px', background: 'linear-gradient(180deg, #ec4899, #be185d)' }} />
          <div className="absolute bottom-1 left-6" style={{ width: 4, height: 8, borderRadius: '2px 2px 4px 4px', background: 'linear-gradient(180deg, #f97316, #ea580c)' }} />
          <div className="absolute bottom-1 left-11" style={{ width: 4, height: 12, borderRadius: '2px 2px 4px 4px', background: 'linear-gradient(180deg, #8b5cf6, #6d28d9)' }} />
        </div>
        {/* Display window right — mannequin */}
        <div className="absolute" style={{ top: 3, right: 6, width: 18, height: 16, backgroundColor: '#fef3c7', border: '2px solid #92400e', borderRadius: 2 }}>
          {/* Mannequin dress form */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2">
            {/* Stand */}
            <div style={{ width: 2, height: 4, backgroundColor: '#78716c', marginLeft: 3 }} />
            <div style={{ width: 8, height: 2, backgroundColor: '#78716c', borderRadius: 1, marginTop: -1 }} />
            {/* Torso */}
            <div style={{ width: 8, height: 8, backgroundColor: '#f97316', borderRadius: '3px 3px 1px 1px', position: 'absolute', bottom: 5, left: 0, boxShadow: 'inset -2px 0 0 rgba(0,0,0,0.15)' }} />
          </div>
        </div>
      </div>
      {/* Elegant sloped roof — warm burgundy */}
      <div className="absolute inset-x-0 top-0" style={{ height: h * 0.5 }}>
        <div className="absolute bottom-0 left-0 right-0 h-full" style={{
          background: 'linear-gradient(135deg, #9f1239 0%, #881337 60%, #701a2e 100%)',
          clipPath: 'polygon(50% 0%, -6% 100%, 106% 100%)',
        }} />
        {/* Decorative trim along roof edge */}
        <div className="absolute bottom-0 inset-x-0 h-2" style={{
          background: 'repeating-linear-gradient(90deg, #d4a030 0px, #d4a030 4px, transparent 4px, transparent 8px)',
        }} />
      </div>
      {/* Chimney with warm smoke */}
      <div className="absolute" style={{ top: -4, right: '18%', width: 8, height: 14, backgroundColor: '#92400e', borderRadius: '2px 2px 0 0' }}>
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-gray-400/40 chimney-smoke" />
      </div>
      {/* Hanging shop sign — scissors icon */}
      <div className="absolute" style={{ top: h * 0.18, left: -4 }}>
        <div style={{ width: 2, height: 8, backgroundColor: '#92400e', marginLeft: 8 }} />
        <div style={{
          width: 20, height: 14, backgroundColor: '#4a2810', borderRadius: 2,
          border: '1px solid #d4a030', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: 7 }}>✂️</span>
        </div>
      </div>
      {/* Sparkle particles — fashion magic */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="sparkle-particle" style={{ left: '20%', top: '25%', animationDelay: '0s' }} />
        <div className="sparkle-particle" style={{ left: '70%', top: '20%', animationDelay: '1s' }} />
        <div className="sparkle-particle" style={{ left: '45%', top: '15%', animationDelay: '0.5s' }} />
      </div>
      <BuildingLabel text="VIZZU" color="#f97316" />
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// SACRED CHAPEL (Devocional) — White church, cross, stained glass
// ═══════════════════════════════════════════════════════════════
function ChapelSprite({ h }: { w: number; h: number }) {
  return (
    <div className="w-full h-full relative">
      {/* White stone walls */}
      <div className="absolute inset-x-0 bottom-0" style={{
        height: h * 0.6, backgroundColor: '#f5f0e0',
        boxShadow: 'inset -4px 0 0 #ddd8c8, inset 0 -3px 0 #ccc8b8, inset 4px 0 0 #fffaf0',
      }}>
        {/* Stone line */}
        <div className="absolute inset-0" style={{
          background: 'repeating-linear-gradient(0deg, transparent 0px, transparent 12px, rgba(0,0,0,0.04) 12px, rgba(0,0,0,0.04) 13px)',
        }} />
        {/* Arched entrance */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2" style={{
          width: 22, height: h * 0.35, backgroundColor: '#3a2a1e',
          borderRadius: '11px 11px 0 0', border: '3px solid #c8b898',
        }}>
          <div className="absolute bottom-0 left-1/2 -translate-x-0.5 w-0.5 h-full bg-yellow-700/30" />
        </div>
        {/* Rose window (stained glass) */}
        <div className="absolute" style={{ top: 4, left: '50%', transform: 'translateX(-50%)', width: 20, height: 20, borderRadius: '50%', border: '3px solid #c8b898', overflow: 'hidden' }}>
          <div className="absolute inset-0" style={{
            background: `conic-gradient(
              #dc2626 0deg, #3b82f6 60deg, #f59e0b 120deg,
              #22c55e 180deg, #a855f7 240deg, #dc2626 300deg, #3b82f6 360deg
            )`,
            opacity: 0.7,
          }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-white/60" />
          </div>
          <div className="absolute inset-0" style={{ boxShadow: '0 0 8px rgba(245,158,11,0.4)' }} />
        </div>
      </div>
      {/* Triangular facade */}
      <div className="absolute inset-x-0 top-0" style={{ height: h * 0.45 }}>
        <div className="absolute bottom-0 left-0 right-0 h-full" style={{
          background: 'linear-gradient(180deg, #f5f0e0 0%, #e8e0d0 100%)',
          clipPath: 'polygon(50% 0%, 5% 100%, 95% 100%)',
        }} />
      </div>
      {/* Bell tower */}
      <div className="absolute left-1/2 -translate-x-1/2" style={{
        top: -12, width: 16, height: 18, backgroundColor: '#f5f0e0',
        border: '2px solid #c8b898', borderRadius: '2px 2px 0 0',
      }}>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-black/20 flex items-center justify-center">
          <div className="w-3 h-4 rounded-full bg-yellow-600" style={{
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
          }} />
        </div>
      </div>
      {/* Cross on top */}
      <div className="absolute left-1/2 -translate-x-1/2" style={{ top: -22 }}>
        <div style={{ width: 3, height: 12, backgroundColor: '#d4a030', marginLeft: 4 }} />
        <div style={{ width: 11, height: 3, backgroundColor: '#d4a030', position: 'absolute', top: 3, left: 0 }} />
      </div>
      <BuildingLabel text="DEVOCIONAL" color="#d4a030" />
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// ENCHANTMENT SHOP (Cheia de Charme) — Pink cottage, potions, sparkles
// ═══════════════════════════════════════════════════════════════
function EnchantmentShopSprite({ h }: { w: number; h: number }) {
  return (
    <div className="w-full h-full relative">
      {/* Cottage walls */}
      <div className="absolute inset-x-0 bottom-0" style={{
        height: h * 0.6, backgroundColor: '#fce7f3',
        boxShadow: 'inset -4px 0 0 #f9a8d4, inset 0 -3px 0 #f472b6, inset 4px 0 0 #fdf2f8',
        borderRadius: '0 0 4px 4px',
      }}>
        {/* Decorative trim */}
        <div className="absolute top-0 inset-x-0 h-1" style={{ backgroundColor: '#ec4899' }} />
        {/* Cute round door */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2" style={{
          width: 20, height: h * 0.32, backgroundColor: '#be185d',
          borderRadius: '10px 10px 0 0',
          boxShadow: 'inset -3px 0 0 rgba(0,0,0,0.2), 0 0 8px rgba(236,72,153,0.3)',
          border: '2px solid #ec4899',
        }}>
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-pink-300" />
        </div>
        {/* Potion bottle windows */}
        <div className="absolute" style={{ top: 5, left: 6, width: 16, height: 14, backgroundColor: '#fdf2f8', border: '2px solid #ec4899', borderRadius: 3 }}>
          <div className="absolute bottom-1 left-1" style={{ width: 4, height: 8, borderRadius: '2px 2px 4px 4px', background: 'linear-gradient(180deg, #ec4899, #be185d)' }} />
          <div className="absolute bottom-1 left-6" style={{ width: 3, height: 6, borderRadius: '1px 1px 3px 3px', background: 'linear-gradient(180deg, #a855f7, #7c3aed)' }} />
          <div className="absolute bottom-1 left-10" style={{ width: 4, height: 7, borderRadius: '2px 2px 4px 4px', background: 'linear-gradient(180deg, #f472b6, #db2777)' }} />
        </div>
        <div className="absolute" style={{ top: 5, right: 6, width: 16, height: 14, backgroundColor: '#fdf2f8', border: '2px solid #ec4899', borderRadius: 3 }}>
          <div className="absolute bottom-1 left-1" style={{ width: 3, height: 7, borderRadius: '1px 1px 3px 3px', background: 'linear-gradient(180deg, #fb923c, #ea580c)' }} />
          <div className="absolute bottom-1 left-5" style={{ width: 5, height: 6, borderRadius: '2px 2px 4px 4px', background: 'linear-gradient(180deg, #f9a8d4, #ec4899)' }} />
          <div className="absolute bottom-1 left-11" style={{ width: 3, height: 8, borderRadius: '1px 1px 3px 3px', background: 'linear-gradient(180deg, #c084fc, #9333ea)' }} />
        </div>
      </div>
      {/* Witch hat roof */}
      <div className="absolute inset-x-0 top-0" style={{ height: h * 0.45 }}>
        <div className="absolute bottom-0 left-0 right-0 h-full" style={{
          background: 'linear-gradient(135deg, #ec4899 0%, #be185d 60%, #9d174d 100%)',
          clipPath: 'polygon(50% 0%, -6% 100%, 106% 100%)',
        }} />
        {/* Roof scallops */}
        <div className="absolute bottom-0 inset-x-0 h-3" style={{
          background: 'repeating-radial-gradient(circle at 8px 0px, #db2777 4px, transparent 4px)',
          backgroundSize: '16px 6px',
        }} />
      </div>
      {/* Chimney with pink smoke */}
      <div className="absolute" style={{ top: -2, right: '18%', width: 8, height: 14, backgroundColor: '#be185d', borderRadius: '2px 2px 0 0' }}>
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-pink-300/50 chimney-smoke" />
      </div>
      {/* Sparkle particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="sparkle-particle" style={{ left: '15%', top: '20%', animationDelay: '0s' }} />
        <div className="sparkle-particle" style={{ left: '75%', top: '30%', animationDelay: '0.7s' }} />
        <div className="sparkle-particle" style={{ left: '40%', top: '10%', animationDelay: '1.4s' }} />
      </div>
      <BuildingLabel text="CHARME" color="#ec4899" />
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// FONTE DA VITALIDADE — Stone well with glowing water
// ═══════════════════════════════════════════════════════════════
function MysticWellSprite({ w, h }: { w: number; h: number }) {
  return (
    <div className="w-full h-full relative flex items-end justify-center">
      {/* Stone base pool */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2" style={{
        width: w * 0.8, height: h * 0.35,
        backgroundColor: '#60a5fa', borderRadius: '50%',
        boxShadow: '0 4px 0 #6b7280, 0 6px 0 #4b5563, inset 0 -6px 12px #2563eb, inset 0 3px 6px #93c5fd, 0 0 16px rgba(96,165,250,0.3)',
      }}>
        <div className="absolute top-1 left-1/4 w-2 h-1 bg-white/40 rounded-full water-sparkle" />
        <div className="absolute top-2 right-1/3 w-1.5 h-0.5 bg-white/30 rounded-full water-sparkle" style={{ animationDelay: '0.7s' }} />
        <div className="absolute top-1 right-1/4 w-1 h-0.5 bg-white/25 rounded-full water-sparkle" style={{ animationDelay: '1.4s' }} />
      </div>
      {/* Stone pillar */}
      <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2" style={{
        width: 12, height: h * 0.35,
        backgroundColor: '#9ca3af',
        boxShadow: 'inset -4px 0 0 #6b7280, inset 4px 0 0 #d1d5db',
        borderRadius: 2,
      }} />
      {/* Top cross-beam with bucket */}
      <div className="absolute" style={{ top: h * 0.1, left: '50%', transform: 'translateX(-50%)', width: w * 0.5, height: 4, backgroundColor: '#4a2810', borderRadius: 1 }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: 3, height: h * 0.25, backgroundColor: '#4a2810' }} />
        <div style={{ position: 'absolute', top: 0, right: 0, width: 3, height: h * 0.25, backgroundColor: '#4a2810' }} />
      </div>
      {/* Hanging bucket */}
      <div className="absolute" style={{ top: h * 0.12, left: '50%', transform: 'translateX(-50%)' }}>
        <div style={{ width: 1, height: 12, backgroundColor: '#78716c', marginLeft: 4 }} />
        <div style={{ width: 10, height: 8, backgroundColor: '#78350f', borderRadius: '0 0 3px 3px', border: '1px solid #92400e' }} />
      </div>
      <BuildingLabel text="FONTE" color="#60a5fa" />
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// ADD PROJECT — Construction site placeholder
// ═══════════════════════════════════════════════════════════════
function ConstructionSiteSprite({ w, h }: { w: number; h: number }) {
  return (
    <div className="w-full h-full relative flex items-center justify-center">
      {/* Foundation stones */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2" style={{
        width: w * 0.7, height: 6,
        backgroundColor: '#6b7280', borderRadius: 1,
        boxShadow: 'inset -2px 0 0 #4b5563',
      }} />
      {/* Scaffolding */}
      <div className="absolute" style={{ bottom: 8, left: '25%', width: 3, height: h * 0.5, backgroundColor: '#92400e' }} />
      <div className="absolute" style={{ bottom: 8, right: '25%', width: 3, height: h * 0.5, backgroundColor: '#92400e' }} />
      <div className="absolute" style={{ bottom: h * 0.35, left: '25%', right: '25%', height: 2, backgroundColor: '#78350f' }} />
      {/* Plus sign */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div style={{ width: 16, height: 4, backgroundColor: '#9ca3af', position: 'absolute', top: 6, left: 0 }} />
        <div style={{ width: 4, height: 16, backgroundColor: '#9ca3af', position: 'absolute', top: 0, left: 6 }} />
      </div>
      <BuildingLabel text="CONSTRUIR" color="#9ca3af" />
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// Generic project building fallback
// ═══════════════════════════════════════════════════════════════
function GenericProjectSprite({ h, color, name }: { w: number; h: number; color: string; name: string }) {
  return (
    <div className="w-full h-full relative">
      <div className="absolute inset-x-0 bottom-0" style={{
        height: h * 0.6, backgroundColor: color,
        boxShadow: 'inset -4px 0 0 rgba(0,0,0,0.2), inset 0 -3px 0 rgba(0,0,0,0.15), inset 4px 0 0 rgba(255,255,255,0.1)',
      }}>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2" style={{
          width: 16, height: h * 0.3, backgroundColor: 'rgba(0,0,0,0.35)',
          borderRadius: '3px 3px 0 0',
        }} />
        <div className="absolute" style={{ top: 5, left: 8, width: 12, height: 10, backgroundColor: '#f59e0b', border: '2px solid rgba(0,0,0,0.3)' }} />
        <div className="absolute" style={{ top: 5, right: 8, width: 12, height: 10, backgroundColor: '#f59e0b', border: '2px solid rgba(0,0,0,0.3)' }} />
      </div>
      <div className="absolute inset-x-0 top-0" style={{ height: h * 0.45 }}>
        <div className="absolute bottom-0 left-0 right-0 h-full" style={{
          background: `linear-gradient(135deg, ${color}, rgba(0,0,0,0.4))`,
          clipPath: 'polygon(50% 0%, -5% 100%, 105% 100%)', filter: 'brightness(0.7)',
        }} />
      </div>
      <BuildingLabel text={name.length > 12 ? name.slice(0, 11) + '..' : name.toUpperCase()} />
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// Shared label
// ═══════════════════════════════════════════════════════════════
function BuildingLabel({ text, color = '#ffffff' }: { text: string; color?: string }) {
  return (
    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap z-10">
      <span
        className="font-pixel text-[6px] pixel-text px-1.5 py-0.5 rounded-sm"
        style={{ color, backgroundColor: 'rgba(10,10,26,0.85)' }}
      >
        {text}
      </span>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// MAIN BUILDING COMPONENT
// ═══════════════════════════════════════════════════════════════
export function Building({ building, onClick }: BuildingProps) {
  const quests = useQuestStore(s => s.quests)
  const hasBoss = useMemo(
    () =>
      building.type === 'project' &&
      quests.some(q => q.is_boss && q.status !== 'done' && q.status !== 'failed' && q.project_id === building.projectId),
    [quests, building.type, building.projectId]
  )

  const w = building.width * TILE_SIZE
  const h = building.height * TILE_SIZE

  // Determine which sprite to use based on building type or project sprite key
  const spriteKey = building.type === 'project'
    ? (useQuestStore.getState().projects.find(p => p.id === building.projectId)?.sprite ?? 'default')
    : building.type

  return (
    <div
      className={`
        absolute cursor-pointer transition-transform duration-150 hover:scale-105 hover:z-10
        ${hasBoss ? 'boss-pulse' : ''}
      `}
      style={{
        left: building.x * TILE_SIZE,
        top: building.y * TILE_SIZE,
        width: w,
        height: h,
      }}
      onClick={() => onClick(building)}
    >
      {/* Ground shadow */}
      <div className="absolute -bottom-1 inset-x-2" style={{
        height: 8, backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: '50%', filter: 'blur(3px)',
      }} />

      {/* Sprite dispatch */}
      {spriteKey === 'tavern' && <TavernSprite w={w} h={h} />}
      {spriteKey === 'fountain' && <MysticWellSprite w={w} h={h} />}
      {spriteKey === 'add_project' && <ConstructionSiteSprite w={w} h={h} />}
      {spriteKey === 'dojo' && <DojoSprite w={w} h={h} />}
      {spriteKey === 'atelier' && <AtelierSprite w={w} h={h} />}
      {spriteKey === 'chapel' && <ChapelSprite w={w} h={h} />}
      {spriteKey === 'enchantment_shop' && <EnchantmentShopSprite w={w} h={h} />}
      {spriteKey === 'default' && (
        <GenericProjectSprite w={w} h={h} color={building.color} name={building.name} />
      )}

      {/* Boss indicator */}
      {hasBoss && (
        <div className="absolute -top-5 -right-2 animate-bounce">
          <div className="w-6 h-6 rounded-full flex items-center justify-center"
               style={{ backgroundColor: '#e94560', boxShadow: '0 0 12px rgba(233,69,96,0.7)' }}>
            <span className="font-pixel text-[7px] text-white">!</span>
          </div>
        </div>
      )}
    </div>
  )
}
