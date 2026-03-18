import { create } from "zustand";
import type {
  ProfessionalProfile,
  ScheduleSlot,
  WaitingQueueItem,
  DailySummary,
} from "@/types/professional";
import { MOCK_PROFESSIONAL, MOCK_SCHEDULE, MOCK_WAITING_QUEUE } from "@/lib/mock-data";

export type Screen = "login" | "home" | "ticket" | "active" | "earnings";

interface ConfirmDialog {
  type: "complete";
  slotId: string;
}

interface Toast {
  id: string;
  message: string;
  type: "success" | "error";
}

interface ProfessionalState {
  // State machine
  screen: Screen;
  isLoggedIn: boolean;

  // Data
  professional: ProfessionalProfile;
  schedule: ScheduleSlot[];
  waitingQueue: WaitingQueueItem[];
  now: Date;

  // Screen-specific
  selectedSlotId: string | null;
  ticketInput: string;
  earningsVisible: boolean;

  // UI
  toasts: Toast[];
  confirmDialog: ConfirmDialog | null;

  // Navigation
  login: (email: string, password: string) => void;
  logout: () => void;
  goToTicket: (slotId: string) => void;
  goToActive: () => void;
  goToHome: () => void;
  goToEarnings: () => void;

  // Actions
  setTicketInput: (value: string) => void;
  submitTicket: () => void;
  completeService: (slotId: string) => void;
  toggleEarningsVisible: () => void;

  // Clock
  tick: () => void;

  // UI actions
  setConfirmDialog: (dialog: ConfirmDialog | null) => void;
  addToast: (message: string, type: "success" | "error") => void;
  dismissToast: (id: string) => void;

  // Computed
  getActiveService: () => ScheduleSlot | null;
  getUpcomingSlots: () => ScheduleSlot[];
  getCompletedSlots: () => ScheduleSlot[];
  getDailySummary: () => DailySummary;
}

export const useProfessionalStore = create<ProfessionalState>((set, get) => ({
  screen: "login",
  isLoggedIn: false,

  professional: MOCK_PROFESSIONAL,
  schedule: MOCK_SCHEDULE,
  waitingQueue: MOCK_WAITING_QUEUE,
  now: new Date(),

  selectedSlotId: null,
  ticketInput: "",
  earningsVisible: false,

  toasts: [],
  confirmDialog: null,

  // ── Navigation ──────────────────────────────────────────────

  login: (_email, _password) => {
    // Mock: always accepts
    set({ isLoggedIn: true, screen: "home" });
  },

  logout: () => {
    set({ isLoggedIn: false, screen: "login" });
  },

  goToTicket: (slotId) => {
    set({ screen: "ticket", selectedSlotId: slotId, ticketInput: "" });
  },

  goToActive: () => {
    set({ screen: "active" });
  },

  goToHome: () => {
    set({ screen: "home", selectedSlotId: null, ticketInput: "" });
  },

  goToEarnings: () => {
    set({ screen: "earnings" });
  },

  // ── Actions ─────────────────────────────────────────────────

  setTicketInput: (value) => set({ ticketInput: value.toUpperCase() }),

  submitTicket: () => {
    const { ticketInput, selectedSlotId, schedule, waitingQueue } = get();
    const code = ticketInput.trim();
    if (!code || !selectedSlotId) return;

    // Find the selected slot
    const selectedSlot = schedule.find((s) => s.id === selectedSlotId);
    if (!selectedSlot) return;

    // Check if ticket matches the selected slot's ticket
    if (selectedSlot.ticket_number === code) {
      // Start the service
      set((state) => ({
        schedule: state.schedule.map((s) =>
          s.id === selectedSlotId
            ? { ...s, status: "in_progress" as const, started_at: new Date().toISOString() }
            : s
        ),
        professional: { ...state.professional, availability: "busy" },
        screen: "active",
        ticketInput: "",
      }));
      get().addToast(`Atendimento iniciado: ${selectedSlot.client_name}`, "success");
      return;
    }

    // Check waiting queue
    const queueItem = waitingQueue.find((w) => w.ticket_number === code);
    if (queueItem) {
      const newSlot: ScheduleSlot = {
        id: queueItem.id,
        scheduled_at: new Date().toISOString(),
        estimated_end_at: new Date(
          Date.now() + queueItem.duration_minutes * 60_000
        ).toISOString(),
        client_name: queueItem.client_name,
        client_id: queueItem.client_id,
        service_name: queueItem.service_name,
        service_category: queueItem.service_category,
        duration_minutes: queueItem.duration_minutes,
        price_cents: queueItem.price_cents,
        ticket_number: queueItem.ticket_number,
        status: "in_progress",
        started_at: new Date().toISOString(),
        completed_at: null,
      };

      set((state) => ({
        schedule: [...state.schedule, newSlot],
        waitingQueue: state.waitingQueue.filter((w) => w.id !== queueItem.id),
        professional: { ...state.professional, availability: "busy" },
        screen: "active",
        ticketInput: "",
      }));

      get().addToast(`Atendimento iniciado: ${queueItem.client_name}`, "success");
      return;
    }

    // Not found
    get().addToast("Ticket nao encontrado", "error");
    set({ ticketInput: "" });
  },

  completeService: (slotId) => {
    set((state) => {
      const updatedSchedule = state.schedule.map((s) =>
        s.id === slotId
          ? { ...s, status: "completed" as const, completed_at: new Date().toISOString() }
          : s
      );

      const hasOtherActive = updatedSchedule.some(
        (s) => s.status === "in_progress" && s.id !== slotId
      );

      return {
        schedule: updatedSchedule,
        professional: {
          ...state.professional,
          availability: hasOtherActive ? "busy" : ("available" as const),
        },
        confirmDialog: null,
        screen: "home",
        selectedSlotId: null,
      };
    });

    get().addToast("Atendimento finalizado", "success");
  },

  toggleEarningsVisible: () => {
    set((state) => ({ earningsVisible: !state.earningsVisible }));
  },

  // ── Clock ───────────────────────────────────────────────────

  tick: () => set({ now: new Date() }),

  // ── UI ──────────────────────────────────────────────────────

  setConfirmDialog: (dialog) => set({ confirmDialog: dialog }),

  addToast: (message, type) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }],
    }));
  },

  dismissToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  // ── Computed ────────────────────────────────────────────────

  getActiveService: () => {
    return get().schedule.find((s) => s.status === "in_progress") ?? null;
  },

  getUpcomingSlots: () => {
    return get().schedule.filter(
      (s) => s.status === "scheduled" || s.status === "waiting"
    );
  },

  getCompletedSlots: () => {
    return get().schedule.filter((s) => s.status === "completed");
  },

  getDailySummary: () => {
    const { schedule } = get();
    const completed = schedule.filter((s) => s.status === "completed");
    const totalCents = completed.reduce((acc, s) => acc + s.price_cents, 0);
    return {
      totalCents,
      commissionCents: Math.round(totalCents * 0.5),
      completedCount: completed.length,
      totalCount: schedule.length,
    };
  },
}));
