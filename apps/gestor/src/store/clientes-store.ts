"use client";

import { create } from "zustand";
import type { Profile } from "@cheia/types";
import { fetchClients } from "@/lib/queries/clients";

interface ClientesState {
  clients: Profile[];
  search: string;
  loading: boolean;

  fetch: (storeId: string, showMock?: boolean) => Promise<void>;
  setSearch: (s: string) => void;
}

export const useClientesStore = create<ClientesState>((set) => ({
  clients: [],
  search: "",
  loading: false,

  fetch: async (storeId, showMock = true) => {
    set({ loading: true });
    const clients = await fetchClients(storeId, showMock);
    set({ clients, loading: false });
  },

  setSearch: (s) => set({ search: s }),
}));
