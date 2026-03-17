import { useState } from 'react'
import { PixelButton } from '@/components/ui/PixelButton'
import { PixelInput } from '@/components/ui/PixelInput'
import type { QuestDifficulty, QuestCategory } from '@/types/game'

interface QuestFormProps {
  projectId: string
  onSubmit: (data: {
    project_id: string
    title: string
    description?: string
    difficulty: QuestDifficulty
    category: QuestCategory
    is_boss: boolean
    due_date?: string | null
  }) => void
  onCancel: () => void
}

const DIFFICULTIES: QuestDifficulty[] = ['trivial', 'easy', 'medium', 'hard', 'legendary']
const CATEGORIES: QuestCategory[] = ['feature', 'bugfix', 'refactor', 'study', 'planning', 'communication', 'other']

export function QuestForm({ projectId, onSubmit, onCancel }: QuestFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [difficulty, setDifficulty] = useState<QuestDifficulty>('medium')
  const [category, setCategory] = useState<QuestCategory>('feature')
  const [isBoss, setIsBoss] = useState(false)
  const [dueDate, setDueDate] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    onSubmit({
      project_id: projectId,
      title: title.trim(),
      description: description.trim() || undefined,
      difficulty,
      category,
      is_boss: isBoss,
      due_date: dueDate || null,
    })
    setTitle('')
    setDescription('')
    setDifficulty('medium')
    setCategory('feature')
    setIsBoss(false)
    setDueDate('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <PixelInput
        label="Quest Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="What needs to be done?"
        autoFocus
      />

      <PixelInput
        label="Description (optional)"
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="Details..."
      />

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="font-pixel text-[10px] text-text-dim block mb-1">Difficulty</label>
          <select
            value={difficulty}
            onChange={e => setDifficulty(e.target.value as QuestDifficulty)}
            className="w-full bg-bg-dark pixel-border font-body text-lg text-text px-3 py-2"
          >
            {DIFFICULTIES.map(d => (
              <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="font-pixel text-[10px] text-text-dim block mb-1">Category</label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value as QuestCategory)}
            className="w-full bg-bg-dark pixel-border font-body text-lg text-text px-3 py-2"
          >
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isBoss}
            onChange={e => setIsBoss(e.target.checked)}
            className="accent-primary w-4 h-4"
          />
          <span className="font-body text-lg text-text">💀 Boss Fight (deadline)</span>
        </label>
      </div>

      {isBoss && (
        <PixelInput
          label="Due Date"
          type="date"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
        />
      )}

      <div className="flex gap-2 justify-end">
        <PixelButton variant="ghost" type="button" onClick={onCancel}>
          Cancel
        </PixelButton>
        <PixelButton variant="accent" type="submit" disabled={!title.trim()}>
          Create Quest
        </PixelButton>
      </div>
    </form>
  )
}
