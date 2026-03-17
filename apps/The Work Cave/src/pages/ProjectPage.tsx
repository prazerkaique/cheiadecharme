import { useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuestStore } from '@/stores/quest-store'
import { QuestBoard } from '@/components/quest/QuestBoard'
import { PomodoroTimer } from '@/components/timer/PomodoroTimer'
import { PixelPanel } from '@/components/ui/PixelPanel'
import { PixelButton } from '@/components/ui/PixelButton'

export function ProjectPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  const projects = useQuestStore(s => s.projects)
  const project = projects.find(p => p.id === projectId)
  const allQuests = useQuestStore(s => s.quests)
  const quests = useMemo(() => allQuests.filter(q => q.project_id === projectId), [allQuests, projectId])

  if (!project) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <span className="text-4xl block mb-4">❓</span>
          <p className="font-pixel text-sm text-text-dim mb-4">Project not found</p>
          <PixelButton onClick={() => navigate('/')}>BACK TO MAP</PixelButton>
        </div>
      </div>
    )
  }

  const completedQuests = quests.filter(q => q.status === 'done').length
  const totalQuests = quests.length

  return (
    <div className="h-full overflow-y-auto p-6 pt-20 pb-16">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Project header */}
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 pixel-border flex items-center justify-center text-3xl"
            style={{ backgroundColor: project.color }}
          >
            🏠
          </div>
          <div>
            <h1 className="font-pixel text-lg text-secondary pixel-text">{project.name}</h1>
            <p className="font-body text-xl text-text-dim">
              {completedQuests}/{totalQuests} quests completed
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quest Board */}
          <div className="lg:col-span-2">
            <PixelPanel title="QUEST BOARD">
              <QuestBoard projectId={project.id} />
            </PixelPanel>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <PixelPanel title="POMODORO">
              <PomodoroTimer />
            </PixelPanel>
          </div>
        </div>
      </div>
    </div>
  )
}
