"use client";

import { create } from "zustand";
import type { Profile, ProfessionalService } from "@cheia/types";
import {
  fetchProfessionals,
  fetchProfessionalServices,
} from "@/lib/queries/professionals";

interface EquipeState {
  professionals: Profile[];
  selectedServices: ProfessionalService[];
  loading: boolean;

  fetch: (storeId: string, showMock?: boolean) => Promise<void>;
  fetchServices: (professionalId: string) => Promise<void>;
}

export const useEquipeStore = create<EquipeState>((set) => ({
  professionals: [],
  selectedServices: [],
  loading: false,

  fetch: async (storeId, showMock = true) => {
    set({ loading: true });
    const professionals = await fetchProfessionals(storeId, showMock);
    set({ professionals, loading: false });
  },

  fetchServices: async (professionalId) => {
    const selectedServices = await fetchProfessionalServices(professionalId);
    set({ selectedServices });
  },
}));
