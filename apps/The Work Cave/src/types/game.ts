export type StatName = 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha'

export interface Stats {
  str: number
  dex: number
  con: number
  int: number
  wis: number
  cha: number
}

export interface Character {
  id: string
  name: string
  level: number
  xp_total: number
  hp: number
  hp_max: number
  mp: number
  mp_max: number
  stats: Stats
  race: import('@/types/character').CharacterRace
  class: import('@/types/character').CharacterClass
  appearance: import('@/types/character').Appearance
  equipment: Record<import('@/types/character').EquipmentSlot, string>
  isCreated: boolean
  created_at: string
  updated_at: string
}

export type QuestStatus = 'backlog' | 'active' | 'done' | 'failed'
export type QuestDifficulty = 'trivial' | 'easy' | 'medium' | 'hard' | 'legendary'
export type QuestCategory = 'feature' | 'bugfix' | 'refactor' | 'study' | 'planning' | 'communication' | 'other'

export interface Quest {
  id: string
  project_id: string
  title: string
  description: string
  status: QuestStatus
  difficulty: QuestDifficulty
  category: QuestCategory
  xp_reward: number
  stat_bonus: StatName | null
  due_date: string | null
  is_boss: boolean
  completed_at: string | null
  created_at: string
}

export interface Project {
  id: string
  name: string
  slug: string
  color: string
  sprite: string
  map_x: number
  map_y: number
  created_at: string
  updated_at: string
}

export interface PomodoroSession {
  id: string
  duration: number
  project_id: string | null
  quest_id: string | null
  completed: boolean
  started_at: string
  ended_at: string | null
}

export interface DailyLog {
  id: string
  date: string
  coffee_count: number
  water_count: number
  work_minutes: number
  xp_earned: number
  quests_completed: number
  pomodoros_completed: number
}

export interface WorkSession {
  id: string
  project_id: string | null
  started_at: string
  ended_at: string | null
}

export type AchievementRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'

export interface AchievementDef {
  key: string
  name: string
  description: string
  icon: string
  rarity: AchievementRarity
  check: (ctx: AchievementContext) => boolean
}

export interface AchievementContext {
  totalQuests: number
  totalCoffee: number
  totalWater: number
  totalPomodoros: number
  totalBosses: number
  level: number
  streakDays: number
}

export interface Achievement {
  id: string
  achievement_key: string
  unlocked_at: string
}

export interface InventoryItem {
  id: string
  item_key: string
  quantity: number
}

export type ItemKey =
  | 'coffee_potion'
  | 'water_flask'
  | 'quest_scroll'
  | 'boss_trophy'
  | 'experience_gem'
  | 'streak_badge'

export const ITEM_NAMES: Record<ItemKey, string> = {
  coffee_potion: 'Coffee Potion',
  water_flask: 'Water Flask',
  quest_scroll: 'Quest Scroll',
  boss_trophy: 'Boss Trophy',
  experience_gem: 'Experience Gem',
  streak_badge: 'Streak Badge',
}

export const ITEM_ICONS: Record<ItemKey, string> = {
  coffee_potion: '☕',
  water_flask: '💧',
  quest_scroll: '📜',
  boss_trophy: '🏆',
  experience_gem: '💎',
  streak_badge: '🔥',
}
