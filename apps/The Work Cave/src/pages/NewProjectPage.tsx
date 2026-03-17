import { useNavigate } from 'react-router-dom'
import { useQuestStore } from '@/stores/quest-store'
import { useUIStore } from '@/stores/ui-store'
import { ProjectForm } from '@/components/project/ProjectForm'
import { PixelPanel } from '@/components/ui/PixelPanel'

export function NewProjectPage() {
  const navigate = useNavigate()
  const addProject = useQuestStore(s => s.addProject)
  const addToast = useUIStore(s => s.addToast)

  function handleSubmit(name: string, color: string) {
    const project = addProject(name, color)
    addToast({ message: `Project "${name}" created!`, type: 'success', icon: '🏠' })
    navigate(`/project/${project.id}`)
  }

  return (
    <div className="h-full overflow-y-auto p-6 pt-20 pb-16">
      <div className="max-w-lg mx-auto space-y-6">
        <div className="text-center">
          <span className="text-5xl block mb-2">🏗️</span>
          <h1 className="font-pixel text-lg text-secondary pixel-text">New Project</h1>
          <p className="font-body text-xl text-text-dim">Build a new quest hub on the map</p>
        </div>

        <PixelPanel accent>
          <ProjectForm
            onSubmit={handleSubmit}
            onCancel={() => navigate('/')}
          />
        </PixelPanel>
      </div>
    </div>
  )
}
