import type { Quest } from '@/types/game'
import { DIFFICULTY_COLORS, CATEGORY_STAT, STAT_LABELS } from '@/config/constants'

interface QuestCardProps {
  quest: Quest
  onComplete: (id: string) => void
  onActivate: (id: string) => void
  onDelete: (id: string) => void
}

export function QuestCard({ quest, onComplete, onActivate, onDelete }: QuestCardProps) {
  const isDone = quest.status === 'done'
  const statLabel = quest.stat_bonus
    ? STAT_LABELS[quest.stat_bonus]
    : STAT_LABELS[CATEGORY_STAT[quest.category]!]

  return (
    <div
      className={`
        pixel-border p-3 flex items-start gap-3
        ${isDone ? 'bg-bg-dark opacity-60' : 'bg-bg-panel'}
        ${quest.is_boss ? 'border-primary boss-pulse' : ''}
      `}
    >
      {/* Status icon */}
      <span className="text-xl mt-0.5">
        {isDone ? '✅' : quest.is_boss ? '💀' : quest.status === 'active' ? '⚔️' : '📋'}
      </span>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`font-body text-xl ${isDone ? 'line-through text-text-dim' : 'text-text'}`}>
            {quest.title}
          </span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="font-pixel text-[8px] px-1.5 py-0.5"
            style={{ color: DIFFICULTY_COLORS[quest.difficulty], borderColor: DIFFICULTY_COLORS[quest.difficulty], borderWidth: 1 }}
          >
            {quest.difficulty.toUpperCase()}
          </span>
          <span className="font-body text-sm text-text-dim">+{quest.xp_reward} XP</span>
          <span className="font-body text-sm text-text-dim">+{statLabel}</span>
          {quest.due_date && (
            <span className="font-body text-sm text-primary">Due: {quest.due_date}</span>
          )}
        </div>
      </div>

      {/* Actions */}
      {!isDone && (
        <div className="flex gap-1">
          {quest.status === 'backlog' && (
            <button
              onClick={() => onActivate(quest.id)}
              className="font-pixel text-[8px] text-accent hover:brightness-125 cursor-pointer px-2 py-1 pixel-border bg-bg-dark"
              title="Start quest"
            >
              GO
            </button>
          )}
          <button
            onClick={() => onComplete(quest.id)}
            className="font-pixel text-[8px] text-secondary hover:brightness-125 cursor-pointer px-2 py-1 pixel-border bg-bg-dark"
            title="Complete"
          >
            ✓
          </button>
          <button
            onClick={() => onDelete(quest.id)}
            className="font-pixel text-[8px] text-primary hover:brightness-125 cursor-pointer px-2 py-1 pixel-border bg-bg-dark"
            title="Delete"
          >
            X
          </button>
        </div>
      )}
    </div>
  )
}
