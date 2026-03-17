import type { ReactNode } from 'react'

interface DialogBoxProps {
  children: ReactNode
  speaker?: string
  className?: string
}

export function DialogBox({ children, speaker, className = '' }: DialogBoxProps) {
  return (
    <div className={`bg-bg-dark pixel-border-accent p-4 ${className}`}>
      {speaker && (
        <span className="font-pixel text-[10px] text-secondary mb-2 block">{speaker}</span>
      )}
      <div className="font-body text-xl text-text leading-relaxed">{children}</div>
    </div>
  )
}
