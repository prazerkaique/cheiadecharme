"use client";

import { create } from "zustand";
import { fetchDashboardKPIs, type DateRange } from "@/lib/queries/dashboard";

interface DashboardState {
  dateRange: DateRange;
  totalRevenue: number;
  totalCommission: number;
  completedCount: number;
  avgTicket: number;
  revenueChart: { date: string; value: number }[];
  serviceDistribution: Record<string, number>;
  ranking: { professional_id: string; revenue: number; count: number }[];
  loading: boolean;

  setDateRange: (range: DateRange) => void;
  fetch: (storeId: string, showMock?: boolean) => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  dateRange: "month",
  totalRevenue: 0,
  totalCommission: 0,
  completedCount: 0,
  avgTicket: 0,
  revenueChart: [],
  serviceDistribution: {},
  ranking: [],
  loading: false,

  setDateRange: (range) => set({ dateRange: range }),

  fetch: async (storeId, showMock = true) => {
    set({ loading: true });
    const data = await fetchDashboardKPIs(storeId, get().dateRange, showMock);
    set({ ...data, loading: false });
  },
}));
