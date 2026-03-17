import { useState, useMemo } from 'react'
import { useQuestStore } from '@/stores/quest-store'
import { useGameStore } from '@/stores/game-store'
import { useInventoryStore } from '@/stores/inventory-store'
import { useUIStore } from '@/stores/ui-store'
import { QuestCard } from './QuestCard'
import { QuestForm } from './QuestForm'
import { PixelButton } from '@/components/ui/PixelButton'
import { CATEGORY_STAT } from '@/config/constants'
import { bossXpBonus } from '@/config/game-balance'
import type { StatName } from '@/types/game'

interface QuestBoardProps {
  projectId: string
}

export function QuestBoard({ projectId }: QuestBoardProps) {
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState<'all' | 'backlog' | 'active' | 'done'>('all')

  const allQuests = useQuestStore(s => s.quests)
  const quests = useMemo(() => allQuests.filter(q => q.project_id === projectId), [allQuests, projectId])
  const addQuest = useQuestStore(s => s.addQuest)
  const completeQuest = useQuestStore(s => s.completeQuest)
  const updateQuest = useQuestStore(s => s.updateQuest)
  const deleteQuest = useQuestStore(s => s.deleteQuest)
  const addXp = useGameStore(s => s.addXp)
  const addStatPoint = useGameStore(s => s.addStatPoint)
  const addToast = useUIStore(s => s.addToast)
  const openModal = useUIStore(s => s.openModal)
  const addItem = useInventoryStore(s => s.addItem)

  const filteredQuests = filter === 'all'
    ? quests
    : quests.filter(q => q.status === filter)

  function handleComplete(id: string) {
    const quest = completeQuest(id)
    if (!quest) return

    let totalXp = quest.xp_reward
    if (quest.is_boss && quest.due_date) {
      const deadline = new Date(quest.due_date)
      if (new Date() <= deadline) {
        totalXp += bossXpBonus(quest.xp_reward)
        addItem('boss_trophy')
        addToast({ message: 'Boss defeated before deadline! Bonus XP!', type: 'success', icon: '💀' })
      }
    }

    const { leveled, newLevel } = addXp(totalXp)
    const stat = (quest.stat_bonus ?? CATEGORY_STAT[quest.category]) as StatName
    if (stat) addStatPoint(stat)

    addItem('quest_scroll')
    addToast({ message: `Quest complete! +${totalXp} XP`, type: 'xp', icon: '⚔️' })

    if (leveled) {
      openModal('level_up')
      addItem('experience_gem')
      addToast({ message: `Level Up! Level ${newLevel}!`, type: 'level_up', icon: '⬆️', duration: 5000 })
    }
  }

  function handleActivate(id: string) {
    updateQuest(id, { status: 'active' })
  }

  const counts = {
    all: quests.length,
    backlog: quests.filter(q => q.status === 'backlog').length,
    active: quests.filter(q => q.status === 'active').length,
    done: quests.filter(q => q.status === 'done').length,
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        {(['all', 'backlog', 'active', 'done'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`
              font-pixel text-[10px] px-3 py-1.5 pixel-border cursor-pointer
              ${filter === f ? 'bg-secondary text-bg-dark' : 'bg-bg-dark text-text-dim hover:text-text'}
            `}
          >
            {f.toUpperCase()} ({counts[f]})
          </button>
        ))}
        <div className="flex-1" />
        <PixelButton size="sm" variant="accent" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'CANCEL' : '+ NEW QUEST'}
        </PixelButton>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-bg-dark pixel-border p-4">
          <QuestForm
            projectId={projectId}
            onSubmit={(data) => {
              addQuest(data)
              setShowForm(false)
              addToast({ message: 'New quest created!', type: 'info', icon: '📋' })
            }}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {/* Quest list */}
      <div className="space-y-2 max-h-[50vh] overflow-y-auto">
        {filteredQuests.length === 0 ? (
          <div className="text-center py-8">
            <span className="text-4xl block mb-2">📜</span>
            <p className="font-body text-xl text-text-dim">No quests yet. Create one!</p>
          </div>
        ) : (
          filteredQuests.map(quest => (
            <QuestCard
              key={quest.id}
              quest={quest}
              onComplete={handleComplete}
              onActivate={handleActivate}
              onDelete={deleteQuest}
            />
          ))
        )}
      </div>
    </div>
  )
}
