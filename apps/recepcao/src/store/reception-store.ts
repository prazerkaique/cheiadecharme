import { create } from "zustand";
import type { QueueItem, ReceptionProfessional, QueueFilter, TabId } from "@/types/reception";
import type { ProfessionalSuggestionResult } from "@/types/schedule";
import { MOCK_QUEUE, MOCK_PROFESSIONALS } from "@/lib/mock-data";
import { sortProfessionals, suggestProfessionals } from "@/lib/professional-sort";
import { isSupabaseConfigured, supabase, STORE_ID } from "@/lib/supabase";
import { fetchTodayQueue } from "@/lib/queries/queue";
import { fetchStoreProfessionals } from "@/lib/queries/professionals";
import { updateAppointmentStatus, assignProfessionalToAppointment, createTransactionOnComplete } from "@/lib/queries/appointments";
import type { RealtimeChannel } from "@supabase/supabase-js";

interface ReceptionState {
  // Data
  queue: QueueItem[];
  professionals: ReceptionProfessional[];
  now: Date;

  // Mock toggle
  useMockData: boolean;

  // Internal
  _channel: RealtimeChannel | null;
  _pollInterval: ReturnType<typeof setInterval> | null;

  // UI
  activeTab: TabId;
  queueFilter: QueueFilter;
  searchQuery: string;
  selectedAppointmentId: string | null;
  selectedProfessionalId: string | null;
  showAssignSheet: boolean;
  confirmDialog: { type: "no_show" | "complete"; appointmentId: string } | null;
  toasts: { id: string; message: string; type: "success" | "error" }[];

  // Actions — init & realtime
  init: () => Promise<void>;
  subscribe: () => void;
  unsubscribe: () => void;
  toggleMockData: () => void;

  // Actions — clock
  tick: () => void;

  // Actions — navigation
  setActiveTab: (tab: TabId) => void;
  setQueueFilter: (filter: QueueFilter) => void;
  setSearchQuery: (query: string) => void;

  // Actions — selection
  selectAppointment: (id: string | null) => void;
  selectProfessional: (id: string) => void;

  // Actions — queue management
  assignProfessional: (appointmentId: string, professionalId: string) => void;
  callClient: (appointmentId: string) => void;
  startService: (appointmentId: string) => void;
  completeService: (appointmentId: string) => void;
  markNoShow: (appointmentId: string) => void;

  // Actions — professionals
  toggleProfessionalStatus: (id: string) => void;

  // Actions — UI
  setShowAssignSheet: (show: boolean) => void;
  setConfirmDialog: (dialog: ReceptionState["confirmDialog"]) => void;
  addToast: (message: string, type?: "success" | "error") => void;
  dismissToast: (id: string) => void;

  // Computed
  getFilteredQueue: () => QueueItem[];
  getGroupedQueue: () => { clientId: string; clientName: string; items: QueueItem[] }[];
  getClientAppointments: (clientId: string) => QueueItem[];
  getStats: () => { waiting: number; inProgress: number; completed: number; avgWaitMinutes: number };
  getHistory: () => QueueItem[];
  getProfessionalName: (id: string | null) => string;
  getSortedProfessionals: (category?: string) => ReceptionProfessional[];
  getSuggestion: (appointmentId: string) => ProfessionalSuggestionResult[];
}

const statusCycle: Record<string, "available" | "busy" | "busy-queue"> = {
  available: "busy",
  busy: "busy-queue",
  "busy-queue": "available",
};

const MOCK_KEY = "rec:useMockData";
const readMockFlag = (): boolean => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(MOCK_KEY) === "true";
};

export const useReceptionStore = create<ReceptionState>((set, get) => ({
  queue: [],
  professionals: [],
  now: new Date(),
  useMockData: readMockFlag(),
  _channel: null,
  _pollInterval: null,

  activeTab: "fila",
  queueFilter: "all",
  searchQuery: "",
  selectedAppointmentId: null,
  selectedProfessionalId: null,
  showAssignSheet: false,
  confirmDialog: null,
  toasts: [],

  init: async () => {
    if (get().useMockData) {
      set({ queue: MOCK_QUEUE, professionals: MOCK_PROFESSIONALS });
      return;
    }

    if (!isSupabaseConfigured()) return;

    try {
      const queue = await fetchTodayQueue();
      set({ queue });
    } catch (err) {
      console.error("[reception-store] fetchTodayQueue error:", err);
    }

    try {
      const professionals = await fetchStoreProfessionals();
      set({ professionals });
    } catch (err) {
      console.error("[reception-store] fetchStoreProfessionals error:", err);
    }
  },

  subscribe: () => {
    if (get().useMockData || !isSupabaseConfigured() || get()._channel) return;

    const refetch = async () => {
      try {
        const queue = await fetchTodayQueue();
        set({ queue });
      } catch (err) {
        console.error("[reception-store] re-fetch queue error:", err);
      }
      try {
        const professionals = await fetchStoreProfessionals();
        set({ professionals });
      } catch (err) {
        console.error("[reception-store] re-fetch professionals error:", err);
      }
    };

    const channel = supabase
      .channel("recepcao-appointments")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "appointments",
          filter: `store_id=eq.${STORE_ID}`,
        },
        () => { refetch(); }
      )
      .subscribe();

    // Polling fallback: re-fetch every 10s in case Realtime misses events
    const pollInterval = setInterval(refetch, 10_000);

    set({ _channel: channel, _pollInterval: pollInterval });
  },

  unsubscribe: () => {
    const channel = get()._channel;
    const pollInterval = get()._pollInterval;
    if (channel) {
      supabase.removeChannel(channel);
    }
    if (pollInterval) {
      clearInterval(pollInterval);
    }
    set({ _channel: null, _pollInterval: null });
  },

  tick: () => set({ now: new Date() }),

  toggleMockData: () => {
    const next = !get().useMockData;
    localStorage.setItem(MOCK_KEY, String(next));
    set({ useMockData: next });

    if (next) {
      // Switching TO mock — load mock data, stop realtime
      get().unsubscribe();
      set({ queue: MOCK_QUEUE, professionals: MOCK_PROFESSIONALS });
    } else {
      // Switching FROM mock — re-fetch from Supabase
      set({ queue: [], professionals: [] });
      get().init();
      get().subscribe();
    }
  },

  setActiveTab: (tab) => set({ activeTab: tab, selectedAppointmentId: null }),
  setQueueFilter: (filter) => set({ queueFilter: filter }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  selectAppointment: (id) => set({ selectedAppointmentId: id }),

  selectProfessional: (id) =>
    set((state) => ({
      selectedProfessionalId: state.selectedProfessionalId === id ? null : id,
    })),

  assignProfessional: (appointmentId, professionalId) => {
    // Optimistic update
    set((state) => {
      const prof = state.professionals.find((p) => p.id === professionalId);
      return {
        queue: state.queue.map((item) =>
          item.id === appointmentId
            ? { ...item, professional_id: professionalId }
            : item
        ),
        showAssignSheet: false,
        toasts: [
          ...state.toasts,
          {
            id: `toast-${Date.now()}`,
            message: `Profissional ${prof?.name ?? ""} atribuida`,
            type: "success" as const,
          },
        ],
      };
    });
    // Fire Supabase call
    if (isSupabaseConfigured()) {
      assignProfessionalToAppointment(appointmentId, professionalId).catch(
        (err) =>
          console.error("[reception-store] assignProfessional error:", err)
      );
    }
  },

  callClient: (appointmentId) => {
    set((state) => ({
      queue: state.queue.map((item) =>
        item.id === appointmentId ? { ...item, status: "waiting" } : item
      ),
      toasts: [
        ...state.toasts,
        {
          id: `toast-${Date.now()}`,
          message: "Cliente chamado — exibindo na TV",
          type: "success" as const,
        },
      ],
    }));
    if (isSupabaseConfigured()) {
      updateAppointmentStatus(appointmentId, "waiting").catch((err) =>
        console.error("[reception-store] callClient error:", err)
      );
    }
  },

  startService: (appointmentId) => {
    const now = new Date().toISOString();
    set((state) => ({
      queue: state.queue.map((item) =>
        item.id === appointmentId
          ? {
              ...item,
              status: "in_progress",
              started_at: now,
              queue_position: null,
            }
          : item
      ),
      toasts: [
        ...state.toasts,
        {
          id: `toast-${Date.now()}`,
          message: "Atendimento iniciado",
          type: "success" as const,
        },
      ],
    }));
    if (isSupabaseConfigured()) {
      updateAppointmentStatus(appointmentId, "in_progress", {
        started_at: now,
      }).catch((err) =>
        console.error("[reception-store] startService error:", err)
      );
    }
  },

  completeService: (appointmentId) => {
    const now = new Date().toISOString();
    set((state) => ({
      queue: state.queue.map((item) =>
        item.id === appointmentId
          ? { ...item, status: "completed", completed_at: now }
          : item
      ),
      confirmDialog: null,
      toasts: [
        ...state.toasts,
        {
          id: `toast-${Date.now()}`,
          message: "Atendimento finalizado",
          type: "success" as const,
        },
      ],
    }));
    if (isSupabaseConfigured()) {
      const item = get().queue.find((q) => q.id === appointmentId);
      updateAppointmentStatus(appointmentId, "completed", {
        completed_at: now,
      })
        .then(async () => {
          if (item && item.professional_id && item.client.id && item.service.id) {
            await createTransactionOnComplete({
              appointmentId,
              professionalId: item.professional_id,
              clientId: item.client.id,
              serviceId: item.service.id,
              amountCents: item.service.price_cents,
            });
          }
        })
        .catch((err) =>
          console.error("[reception-store] completeService error:", err)
        );
    }
  },

  markNoShow: (appointmentId) => {
    set((state) => ({
      queue: state.queue.map((item) =>
        item.id === appointmentId ? { ...item, status: "no_show" } : item
      ),
      confirmDialog: null,
      toasts: [
        ...state.toasts,
        {
          id: `toast-${Date.now()}`,
          message: "Marcado como no-show",
          type: "error" as const,
        },
      ],
    }));
    if (isSupabaseConfigured()) {
      updateAppointmentStatus(appointmentId, "no_show").catch((err) =>
        console.error("[reception-store] markNoShow error:", err)
      );
    }
  },

  toggleProfessionalStatus: (id) =>
    set((state) => ({
      professionals: state.professionals.map((p) =>
        p.id === id ? { ...p, status: statusCycle[p.status] } : p
      ),
    })),

  setShowAssignSheet: (show) => set({ showAssignSheet: show }),
  setConfirmDialog: (dialog) => set({ confirmDialog: dialog }),

  addToast: (message, type = "success") =>
    set((state) => ({
      toasts: [...state.toasts, { id: `toast-${Date.now()}`, message, type }],
    })),

  dismissToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  getFilteredQueue: () => {
    const { queue, queueFilter, searchQuery } = get();

    let filtered: QueueItem[];

    if (queueFilter === "completed") {
      filtered = queue.filter((item) => item.status === "completed");
    } else {
      const activeStatuses = ["checked_in", "waiting", "in_progress", "scheduled"];
      filtered = queue.filter((item) => activeStatuses.includes(item.status));

      if (queueFilter === "waiting") {
        filtered = filtered.filter(
          (item) => item.status === "checked_in" || item.status === "waiting"
        );
      } else if (queueFilter === "in_progress") {
        filtered = filtered.filter((item) => item.status === "in_progress");
      } else if (queueFilter === "scheduled") {
        filtered = filtered.filter((item) => item.status === "scheduled");
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (item) =>
          item.client.name.toLowerCase().includes(q) ||
          (item.ticket_number && item.ticket_number.toLowerCase().includes(q))
      );
    }

    return filtered;
  },

  getGroupedQueue: () => {
    const filtered = get().getFilteredQueue();
    const groups: { clientId: string; clientName: string; items: QueueItem[] }[] = [];
    const seen = new Set<string>();

    for (const item of filtered) {
      if (seen.has(item.client.id)) continue;
      seen.add(item.client.id);
      const clientItems = filtered.filter((q) => q.client.id === item.client.id);
      groups.push({
        clientId: item.client.id,
        clientName: item.client.name,
        items: clientItems,
      });
    }
    return groups;
  },

  getClientAppointments: (clientId) => {
    const { queue } = get();
    return queue.filter((q) => q.client.id === clientId);
  },

  getStats: () => {
    const { queue, now } = get();
    const active = queue.filter((i) => !["completed", "no_show"].includes(i.status));
    const waiting = active.filter(
      (i) => i.status === "checked_in" || i.status === "waiting"
    ).length;
    const inProgress = active.filter((i) => i.status === "in_progress").length;
    const completed = queue.filter((i) => i.status === "completed").length;

    const waitingItems = active.filter(
      (i) =>
        i.checked_in_at &&
        (i.status === "checked_in" || i.status === "waiting")
    );
    const totalWaitMs = waitingItems.reduce((acc, i) => {
      return acc + (now.getTime() - new Date(i.checked_in_at!).getTime());
    }, 0);
    const avgWaitMinutes =
      waitingItems.length > 0
        ? Math.round(totalWaitMs / waitingItems.length / 60_000)
        : 0;

    return { waiting, inProgress, completed, avgWaitMinutes };
  },

  getHistory: () => {
    const { queue } = get();
    return queue
      .filter((i) => i.status === "completed" || i.status === "no_show")
      .sort((a, b) => {
        const ta = a.completed_at ?? a.scheduled_at ?? "";
        const tb = b.completed_at ?? b.scheduled_at ?? "";
        return tb.localeCompare(ta);
      });
  },

  getProfessionalName: (id) => {
    if (!id) return "Nao atribuido";
    const prof = get().professionals.find((p) => p.id === id);
    return prof?.name ?? "Desconhecido";
  },

  getSortedProfessionals: (category?) => {
    const { professionals } = get();
    return sortProfessionals(professionals, category);
  },

  getSuggestion: (appointmentId) => {
    const { queue, professionals, now } = get();
    const item = queue.find((q) => q.id === appointmentId);
    if (!item) return [];
    return suggestProfessionals(professionals, item.service.category, now, 3);
  },
}));
