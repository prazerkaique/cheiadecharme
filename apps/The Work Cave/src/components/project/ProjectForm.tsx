import { useState } from 'react'
import { PixelButton } from '@/components/ui/PixelButton'
import { PixelInput } from '@/components/ui/PixelInput'

interface ProjectFormProps {
  onSubmit: (name: string, color: string) => void
  onCancel: () => void
}

const COLORS = ['#8B5CF6', '#3B82F6', '#22C55E', '#F59E0B', '#EF4444', '#EC4899', '#06B6D4', '#F97316']

export function ProjectForm({ onSubmit, onCancel }: ProjectFormProps) {
  const [name, setName] = useState('')
  const [color, setColor] = useState(COLORS[0]!)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    onSubmit(name.trim(), color)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PixelInput
        label="Project Name"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="e.g., Nerau CX, Vizzu..."
        autoFocus
      />

      <div>
        <label className="font-pixel text-[10px] text-text-dim block mb-2">Color</label>
        <div className="flex gap-2 flex-wrap">
          {COLORS.map(c => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={`
                w-10 h-10 pixel-border cursor-pointer
                ${color === c ? 'ring-2 ring-secondary ring-offset-2 ring-offset-bg-dark' : ''}
              `}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <PixelButton variant="ghost" type="button" onClick={onCancel}>
          Cancel
        </PixelButton>
        <PixelButton variant="accent" type="submit" disabled={!name.trim()}>
          Create Project
        </PixelButton>
      </div>
    </form>
  )
}
