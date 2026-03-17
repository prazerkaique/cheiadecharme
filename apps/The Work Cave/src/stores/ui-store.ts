import { create } from 'zustand'

export type ModalType =
  | 'character_sheet'
  | 'inventory'
  | 'achievements'
  | 'settings'
  | 'quest_form'
  | 'project_form'
  | 'level_up'
  | null

export interface Toast {
  id: string
  message: string
  type: 'success' | 'info' | 'warning' | 'achievement' | 'xp' | 'level_up'
  icon?: string
  duration?: number
}

interface UIState {
  activeModal: ModalType
  toasts: Toast[]
  soundEnabled: boolean
  currentView: 'overworld' | 'interior'

  // Actions
  openModal: (modal: ModalType) => void
  closeModal: () => void
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  toggleSound: () => void
  setView: (view: 'overworld' | 'interior') => void
}

let toastCounter = 0

export const useUIStore = create<UIState>()((set) => ({
  activeModal: null,
  toasts: [],
  soundEnabled: true,
  currentView: 'overworld',

  openModal: (modal: ModalType) => set({ activeModal: modal }),
  closeModal: () => set({ activeModal: null }),

  addToast: (toast: Omit<Toast, 'id'>) => {
    const id = `toast-${++toastCounter}`
    const duration = toast.duration ?? 3000
    set(state => ({
      toasts: [...state.toasts, { ...toast, id }],
    }))
    // Auto-remove
    setTimeout(() => {
      set(state => ({
        toasts: state.toasts.filter(t => t.id !== id),
      }))
    }, duration)
  },

  removeToast: (id: string) =>
    set(state => ({ toasts: state.toasts.filter(t => t.id !== id) })),

  toggleSound: () => set(state => ({ soundEnabled: !state.soundEnabled })),

  setView: (view) => set({ currentView: view }),
}))
