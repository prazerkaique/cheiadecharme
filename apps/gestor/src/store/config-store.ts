"use client";

import { create } from "zustand";
import type { StoreSettings } from "@cheia/types";
import { fetchStoreWithSettings, updateStoreInfo, updateStoreSettings } from "@/lib/queries/store-settings";

interface ConfigState {
  storeData: { name: string; address: string; phone: string } | null;
  settings: StoreSettings | null;
  loading: boolean;
  saving: boolean;

  showMock: () => boolean;
  fetch: (storeId: string) => Promise<void>;
  saveStore: (storeId: string, data: { name: string; address: string; phone: string }) => Promise<void>;
  saveSettings: (storeId: string, settings: StoreSettings) => Promise<void>;
  toggleMock: (storeId: string) => Promise<void>;
}

export const useConfigStore = create<ConfigState>((set, get) => ({
  storeData: null,
  settings: null,
  loading: false,
  saving: false,

  showMock: () => get().settings?.show_mock_data ?? true,

  fetch: async (storeId) => {
    set({ loading: true });
    try {
      const data = await fetchStoreWithSettings(storeId);
      set({
        storeData: {
          name: data.name,
          address: data.address ?? "",
          phone: data.phone ?? "",
        },
        settings: data.settings ?? {},
        loading: false,
      });
    } catch {
      set({ loading: false });
    }
  },

  saveStore: async (storeId, data) => {
    set({ saving: true });
    try {
      await updateStoreInfo(storeId, {
        name: data.name,
        address: data.address || null,
        phone: data.phone || null,
      });
    } finally {
      set({ saving: false });
    }
  },

  saveSettings: async (storeId, settings) => {
    set({ saving: true });
    try {
      await updateStoreSettings(storeId, settings);
      set({ settings });
    } finally {
      set({ saving: false });
    }
  },

  toggleMock: async (storeId) => {
    const current = get().settings ?? {};
    const next = { ...current, show_mock_data: !(current.show_mock_data ?? true) };
    set({ settings: next });
    try {
      await updateStoreSettings(storeId, next);
    } catch {
      // Revert on error
      set({ settings: current });
    }
  },
}));
