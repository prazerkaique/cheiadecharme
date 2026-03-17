import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Project, Quest, QuestStatus, QuestDifficulty, QuestCategory, StatName } from '@/types/game'
import { DIFFICULTY_XP, CATEGORY_STAT } from '@/config/constants'
import { PROJECT_LOTS, DEFAULT_PROJECTS } from '@/config/maps'
import { v4 as uuid } from 'uuid'

interface QuestState {
  projects: Project[]
  quests: Quest[]
  initialized: boolean

  // Project actions
  addProject: (name: string, color: string, sprite?: string) => Project
  updateProject: (id: string, data: Partial<Project>) => void
  deleteProject: (id: string) => void

  // Quest actions
  addQuest: (data: {
    project_id: string
    title: string
    description?: string
    difficulty?: QuestDifficulty
    category?: QuestCategory
    is_boss?: boolean
    due_date?: string | null
  }) => Quest
  updateQuest: (id: string, data: Partial<Quest>) => void
  completeQuest: (id: string) => Quest | null
  deleteQuest: (id: string) => void

  // Init
  ensureDefaults: () => void
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function createDefaultProjects(): Project[] {
  const now = new Date().toISOString()
  return DEFAULT_PROJECTS.map(p => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    color: p.color,
    sprite: p.sprite,
    map_x: p.map_x,
    map_y: p.map_y,
    created_at: now,
    updated_at: now,
  }))
}

export const useQuestStore = create<QuestState>()(
  persist(
    (set, get) => ({
      projects: [],
      quests: [],
      initialized: false,

      ensureDefaults: () => {
        if (get().initialized) return
        set({
          projects: createDefaultProjects(),
          initialized: true,
        })
      },

      addProject: (name: string, color: string, sprite?: string) => {
        const existingCount = get().projects.length - DEFAULT_PROJECTS.length
        const lot = PROJECT_LOTS[Math.max(0, existingCount) % PROJECT_LOTS.length]!
        const project: Project = {
          id: uuid(),
          name,
          slug: slugify(name),
          color,
          sprite: sprite ?? 'default',
          map_x: lot.x,
          map_y: lot.y,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        set(state => ({ projects: [...state.projects, project] }))
        return project
      },

      updateProject: (id: string, data: Partial<Project>) => {
        set(state => ({
          projects: state.projects.map(p =>
            p.id === id ? { ...p, ...data, updated_at: new Date().toISOString() } : p
          ),
        }))
      },

      deleteProject: (id: string) => {
        set(state => ({
          projects: state.projects.filter(p => p.id !== id),
          quests: state.quests.filter(q => q.project_id !== id),
        }))
      },

      addQuest: (data) => {
        const difficulty = data.difficulty ?? 'medium'
        const category = data.category ?? 'other'
        const quest: Quest = {
          id: uuid(),
          project_id: data.project_id,
          title: data.title,
          description: data.description ?? '',
          status: 'backlog',
          difficulty,
          category,
          xp_reward: DIFFICULTY_XP[difficulty],
          stat_bonus: CATEGORY_STAT[category] as StatName,
          due_date: data.due_date ?? null,
          is_boss: data.is_boss ?? false,
          completed_at: null,
          created_at: new Date().toISOString(),
        }
        set(state => ({ quests: [...state.quests, quest] }))
        return quest
      },

      updateQuest: (id: string, data: Partial<Quest>) => {
        set(state => ({
          quests: state.quests.map(q => (q.id === id ? { ...q, ...data } : q)),
        }))
      },

      completeQuest: (id: string) => {
        const quest = get().quests.find(q => q.id === id)
        if (!quest) return null
        const completed: Quest = {
          ...quest,
          status: 'done' as QuestStatus,
          completed_at: new Date().toISOString(),
        }
        set(state => ({
          quests: state.quests.map(q => (q.id === id ? completed : q)),
        }))
        return completed
      },

      deleteQuest: (id: string) => {
        set(state => ({ quests: state.quests.filter(q => q.id !== id) }))
      },
    }),
    { name: 'quest-board-quests' }
  )
)
