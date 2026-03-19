"use client";

import { create } from "zustand";
import type { Prize } from "@cheia/types";
import { fetchGameConfig, updateGameConfig, type GameConfigRow } from "@/lib/queries/game-config";

interface GameConfigState {
  config: GameConfigRow | null;
  loading: boolean;
  saving: boolean;

  fetch: (storeId: string) => Promise<void>;
  save: (storeId: string, data: Partial<Omit<GameConfigRow, "id" | "store_id">>) => Promise<void>;
}

export const useGameConfigStore = create<GameConfigState>((set, get) => ({
  config: null,
  loading: false,
  saving: false,

  fetch: async (storeId) => {
    set({ loading: true });
    try {
      const config = await fetchGameConfig(storeId);
      set({ config, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  save: async (storeId, data) => {
    set({ saving: true });
    try {
      await updateGameConfig(storeId, data);
      const prev = get().config;
      if (prev) {
        set({ config: { ...prev, ...data } });
      }
    } finally {
      set({ saving: false });
    }
  },
}));
