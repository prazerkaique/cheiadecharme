export interface Database {
  public: {
    Tables: {
      characters: {
        Row: {
          id: string
          user_id: string
          name: string
          level: number
          xp_total: number
          hp: number
          hp_max: number
          mp: number
          mp_max: number
          stat_str: number
          stat_dex: number
          stat_con: number
          stat_int: number
          stat_wis: number
          stat_cha: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['characters']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['characters']['Insert']>
      }
      projects: {
        Row: {
          id: string
          user_id: string
          name: string
          slug: string
          color: string
          sprite: string
          map_x: number
          map_y: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['projects']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['projects']['Insert']>
      }
      quests: {
        Row: {
          id: string
          user_id: string
          project_id: string
          title: string
          description: string
          status: string
          difficulty: string
          category: string
          xp_reward: number
          stat_bonus: string | null
          due_date: string | null
          is_boss: boolean
          completed_at: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['quests']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['quests']['Insert']>
      }
      pomodoro_sessions: {
        Row: {
          id: string
          user_id: string
          duration: number
          project_id: string | null
          quest_id: string | null
          completed: boolean
          started_at: string
          ended_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['pomodoro_sessions']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['pomodoro_sessions']['Insert']>
      }
      daily_logs: {
        Row: {
          id: string
          user_id: string
          date: string
          coffee_count: number
          water_count: number
          work_minutes: number
          xp_earned: number
          quests_completed: number
          pomodoros_completed: number
        }
        Insert: Omit<Database['public']['Tables']['daily_logs']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['daily_logs']['Insert']>
      }
      achievements: {
        Row: {
          id: string
          user_id: string
          achievement_key: string
          unlocked_at: string
        }
        Insert: Omit<Database['public']['Tables']['achievements']['Row'], 'id' | 'unlocked_at'>
        Update: Partial<Database['public']['Tables']['achievements']['Insert']>
      }
      inventory_items: {
        Row: {
          id: string
          user_id: string
          item_key: string
          quantity: number
        }
        Insert: Omit<Database['public']['Tables']['inventory_items']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['inventory_items']['Insert']>
      }
      work_sessions: {
        Row: {
          id: string
          user_id: string
          project_id: string | null
          started_at: string
          ended_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['work_sessions']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['work_sessions']['Insert']>
      }
    }
  }
}
