"use client";

import { create } from "zustand";
import type { Service } from "@cheia/types";
import { fetchServices } from "@/lib/queries/services";

interface ServicosState {
  services: Service[];
  loading: boolean;
  editingId: string | null;

  fetch: (storeId: string) => Promise<void>;
  setEditingId: (id: string | null) => void;
}

export const useServicosStore = create<ServicosState>((set) => ({
  services: [],
  loading: false,
  editingId: null,

  fetch: async (storeId) => {
    set({ loading: true });
    const services = await fetchServices(storeId);
    set({ services, loading: false });
  },

  setEditingId: (id) => set({ editingId: id }),
}));
