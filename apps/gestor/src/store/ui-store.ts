"use client";

import { create } from "zustand";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error";
}

interface UIState {
  sidebarCollapsed: boolean;
  toasts: Toast[];

  toggleSidebar: () => void;
  setSidebarCollapsed: (v: boolean) => void;
  addToast: (message: string, type: "success" | "error") => void;
  dismissToast: (id: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  toasts: [],

  toggleSidebar: () =>
    set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

  setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),

  addToast: (message, type) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    set((s) => ({ toasts: [...s.toasts, { id, message, type }] }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, 4000);
  },

  dismissToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
