import type { ReactNode } from 'react'

interface PixelPanelProps {
  children: ReactNode
  className?: string
  accent?: boolean
  title?: string
}

export function PixelPanel({ children, className = '', accent = false, title }: PixelPanelProps) {
  return (
    <div className={`bg-bg-panel ${accent ? 'pixel-border-accent' : 'pixel-border'} p-4 ${className}`}>
      {title && (
        <h3 className="font-pixel text-xs text-secondary mb-3 pixel-text">{title}</h3>
      )}
      {children}
    </div>
  )
}
