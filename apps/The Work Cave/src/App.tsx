import { Routes, Route, Navigate } from 'react-router-dom'
import { GameShell } from '@/components/layout/GameShell'
import { OverworldPage } from '@/pages/OverworldPage'
import { ProjectPage } from '@/pages/ProjectPage'
import { TavernPage } from '@/pages/TavernPage'
import { FountainPage } from '@/pages/FountainPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { NewProjectPage } from '@/pages/NewProjectPage'
import { CreateCharacterPage } from '@/pages/CreateCharacterPage'
import { useKeyboard } from '@/hooks/useKeyboard'
import { useAchievements } from '@/hooks/useAchievements'
import { usePomodoro } from '@/hooks/usePomodoro'
import { useQuestStore } from '@/stores/quest-store'
import { useGameStore } from '@/stores/game-store'
import { useEffect } from 'react'

function RequireCharacter({ children }: { children: React.ReactNode }) {
  const isCreated = useGameStore(s => s.character.isCreated)
  if (!isCreated) return <Navigate to="/create-character" replace />
  return <>{children}</>
}

export default function App() {
  const ensureDefaults = useQuestStore(s => s.ensureDefaults)
  useEffect(() => { ensureDefaults() }, [ensureDefaults])

  useKeyboard()
  useAchievements()
  usePomodoro()

  return (
    <Routes>
      <Route path="/create-character" element={<CreateCharacterPage />} />
      <Route path="/*" element={
        <RequireCharacter>
          <GameShell>
            <Routes>
              <Route path="/" element={<OverworldPage />} />
              <Route path="/project/:projectId" element={<ProjectPage />} />
              <Route path="/tavern" element={<TavernPage />} />
              <Route path="/fountain" element={<FountainPage />} />
              <Route path="/new-project" element={<NewProjectPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </GameShell>
        </RequireCharacter>
      } />
    </Routes>
  )
}
