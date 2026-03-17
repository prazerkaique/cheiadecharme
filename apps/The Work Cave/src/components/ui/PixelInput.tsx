import { type InputHTMLAttributes } from 'react'

interface PixelInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export function PixelInput({ label, className = '', ...props }: PixelInputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="font-pixel text-[10px] text-text-dim">{label}</label>
      )}
      <input
        className={`
          bg-bg-dark pixel-border font-body text-lg text-text
          px-3 py-2 outline-none
          focus:border-secondary
          placeholder:text-text-dim
          ${className}
        `}
        {...props}
      />
    </div>
  )
}
