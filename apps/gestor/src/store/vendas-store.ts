"use client";

import { create } from "zustand";
import type { Transaction } from "@cheia/types";
import { fetchTransactions, type SalesDateRange } from "@/lib/queries/transactions";

interface VendasState {
  transactions: Transaction[];
  dateRange: SalesDateRange;
  search: string;
  loading: boolean;

  fetch: (storeId: string) => Promise<void>;
  setDateRange: (range: SalesDateRange) => void;
  setSearch: (s: string) => void;
}

export const useVendasStore = create<VendasState>((set, get) => ({
  transactions: [],
  dateRange: "month",
  search: "",
  loading: false,

  fetch: async (storeId) => {
    set({ loading: true });
    const transactions = await fetchTransactions(storeId, get().dateRange);
    set({ transactions, loading: false });
  },

  setDateRange: (range) => set({ dateRange: range }),
  setSearch: (s) => set({ search: s }),
}));
