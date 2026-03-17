import { type ButtonHTMLAttributes } from 'react'

interface PixelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

const VARIANTS = {
  primary: 'bg-primary hover:brightness-110',
  secondary: 'bg-secondary text-bg-dark hover:brightness-110',
  accent: 'bg-accent text-bg-dark hover:brightness-110',
  danger: 'bg-hp hover:brightness-110',
  ghost: 'bg-transparent border-border-light hover:bg-bg-light',
}

const SIZES = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

export function PixelButton({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: PixelButtonProps) {
  return (
    <button
      className={`
        font-pixel pixel-border cursor-pointer
        transition-all active:translate-y-0.5
        disabled:opacity-50 disabled:cursor-not-allowed
        ${VARIANTS[variant]} ${SIZES[size]} ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}
