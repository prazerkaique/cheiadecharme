import { create } from "zustand";
import type {
  ProfessionalProfile,
  ScheduleSlot,
  WaitingQueueItem,
  DailySummary,
} from "@/types/professional";
import { isSupabaseConfigured, supabase, STORE_ID } from "@/lib/supabase";
import { fetchMySchedule, fetchWaitingQueue } from "@/lib/queries/schedule";
import {
  updateAppointmentStatus,
  findAppointmentByTicket,
  createTransactionOnComplete,
} from "@/lib/queries/appointments";
import type { RealtimeChannel } from "@supabase/supabase-js";

export type Screen = "login" | "home" | "ticket" | "active" | "earnings";

interface ConfirmDialog {
  type: "complete" | "call";
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
  _restoringSession: boolean;

  // Data
  professional: ProfessionalProfile;
  schedule: ScheduleSlot[];
  waitingQueue: WaitingQueueItem[];
  now: Date;

  // Internal
  _channel: RealtimeChannel | null;

  // Screen-specific
  selectedSlotId: string | null;
  directedSlotId: string | null;
  ticketInput: string;
  ticketError: string | null;
  earningsVisible: boolean;

  // UI
  toasts: Toast[];
  confirmDialog: ConfirmDialog | null;

  // Navigation
  init: (professionalId: string) => Promise<void>;
  restoreSession: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  subscribe: () => void;
  unsubscribe: () => void;
  goToTicket: (slotId: string) => void;
  goToActive: () => void;
  goToHome: () => void;
  goToEarnings: () => void;

  // Actions
  setTicketInput: (value: string) => void;
  submitTicket: () => Promise<void>;
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

const EMPTY_PROFILE: ProfessionalProfile = {
  id: "",
  name: "",
  avatar_url: null,
  specialty: "",
  availability: "available",
  store_id: "",
};

export const useProfessionalStore = create<ProfessionalState>((set, get) => ({
  screen: "login",
  isLoggedIn: false,
  _restoringSession: true,

  professional: EMPTY_PROFILE,
  schedule: [],
  waitingQueue: [],
  now: new Date(),
  _channel: null,

  selectedSlotId: null,
  directedSlotId: null,
  ticketInput: "",
  ticketError: null,
  earningsVisible: false,

  toasts: [],
  confirmDialog: null,

  // ── Init ────────────────────────────────────────────────────

  init: async (professionalId) => {
    if (!isSupabaseConfigured()) return;
    try {
      const [schedule, waitingQueue] = await Promise.all([
        fetchMySchedule(professionalId),
        fetchWaitingQueue(professionalId),
      ]);
      // Derive directedSlotId: first slot with status "waiting" or "checked_in"
      const directed = schedule.find(
        (s) => s.status === "waiting" || s.status === "checked_in"
      );
      set({ schedule, waitingQueue, directedSlotId: directed?.id ?? null });
    } catch (err) {
      console.error("[professional-store] init error:", err);
    }
  },

  // ── Session restore ──────────────────────────────────────────

  restoreSession: async () => {
    if (!isSupabaseConfigured()) {
      set({ _restoringSession: false });
      return;
    }
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        set({ _restoringSession: false });
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("id, name, avatar_url, specialty, store_id, is_available")
        .eq("auth_id", session.user.id)
        .eq("role", "profissional")
        .eq("store_id", STORE_ID)
        .maybeSingle();

      if (!profile) {
        set({ _restoringSession: false });
        return;
      }

      const professional: ProfessionalProfile = {
        id: profile.id as string,
        name: profile.name as string,
        avatar_url: (profile.avatar_url as string | null) ?? null,
        specialty: (profile.specialty as string) ?? "",
        availability: profile.is_available ? "available" : "busy",
        store_id: profile.store_id as string,
      };

      const [schedule, waitingQueue] = await Promise.all([
        fetchMySchedule(professional.id),
        fetchWaitingQueue(professional.id),
      ]);

      const hasActive = schedule.some((s) => s.status === "in_progress");
      const directed = schedule.find(
        (s) => s.status === "waiting" || s.status === "checked_in"
      );

      set({
        isLoggedIn: true,
        screen: "home",
        _restoringSession: false,
        professional: hasActive
          ? { ...professional, availability: "busy" }
          : professional,
        schedule,
        waitingQueue,
        directedSlotId: directed?.id ?? null,
      });

      get().subscribe();
    } catch (err) {
      console.error("[professional-store] restoreSession error:", err);
      set({ _restoringSession: false });
    }
  },

  // ── Realtime ─────────────────────────────────────────────────

  subscribe: () => {
    if (!isSupabaseConfigured() || get()._channel) return;
    const profId = get().professional.id;

    const channel = supabase
      .channel("profissional-appointments")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "appointments",
          filter: `store_id=eq.${STORE_ID}`,
        },
        async () => {
          // Re-fetch schedule + waiting queue on any appointment change
          try {
            const currentProfId = get().professional.id;
            const [schedule, waitingQueue] = await Promise.all([
              fetchMySchedule(currentProfId),
              fetchWaitingQueue(currentProfId),
            ]);
            const directed = schedule.find(
              (s) => s.status === "waiting" || s.status === "checked_in"
            );
            const hasActive = schedule.some((s) => s.status === "in_progress");
            set({
              schedule,
              waitingQueue,
              directedSlotId: directed?.id ?? null,
              professional: {
                ...get().professional,
                availability: hasActive ? "busy" : "available",
              },
            });
          } catch (err) {
            console.error("[professional-store] realtime re-fetch error:", err);
          }
        }
      )
      .subscribe();

    set({ _channel: channel });
  },

  unsubscribe: () => {
    const channel = get()._channel;
    if (channel) {
      supabase.removeChannel(channel);
      set({ _channel: null });
    }
  },

  // ── Navigation ──────────────────────────────────────────────

  login: async (email, password) => {
    if (!isSupabaseConfigured()) return;

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("id, name, avatar_url, specialty, store_id, is_available")
        .eq("auth_id", session.user.id)
        .eq("role", "profissional")
        .eq("store_id", STORE_ID)
        .maybeSingle();

      if (!profile) throw new Error("Profile not found");

      const professional: ProfessionalProfile = {
        id: profile.id as string,
        name: profile.name as string,
        avatar_url: (profile.avatar_url as string | null) ?? null,
        specialty: (profile.specialty as string) ?? "",
        availability: profile.is_available ? "available" : "busy",
        store_id: profile.store_id as string,
      };

      // Fetch schedule and waiting queue in parallel
      const [schedule, waitingQueue] = await Promise.all([
        fetchMySchedule(professional.id),
        fetchWaitingQueue(professional.id),
      ]);

      const hasActive = schedule.some((s) => s.status === "in_progress");
      const directed = schedule.find(
        (s) => s.status === "waiting" || s.status === "checked_in"
      );

      set({
        isLoggedIn: true,
        screen: "home",
        professional: hasActive
          ? { ...professional, availability: "busy" }
          : professional,
        schedule,
        waitingQueue,
        directedSlotId: directed?.id ?? null,
      });

      get().subscribe();
    } catch (err) {
      console.error("[professional-store] login error:", err);
      throw err;
    }
  },

  logout: async () => {
    get().unsubscribe();
    if (isSupabaseConfigured()) {
      try {
        await supabase.auth.signOut();
      } catch {
        // ignore sign-out errors
      }
    }
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

  setTicketInput: (value) => set({ ticketInput: value.toUpperCase(), ticketError: null }),

  submitTicket: async () => {
    const { ticketInput, selectedSlotId, schedule, waitingQueue } = get();
    const code = ticketInput.trim();
    if (!code || !selectedSlotId) return;

    // Clear previous error
    set({ ticketError: null });

    // Find the selected slot
    const selectedSlot = schedule.find((s) => s.id === selectedSlotId);
    if (!selectedSlot) return;

    // Check if ticket matches the selected slot's ticket
    if (selectedSlot.ticket_number === code) {
      // Update local state immediately
      set((state) => ({
        schedule: state.schedule.map((s) =>
          s.id === selectedSlotId
            ? {
                ...s,
                status: "in_progress" as const,
                started_at: new Date().toISOString(),
              }
            : s
        ),
        professional: { ...state.professional, availability: "busy" },
        screen: "active",
        ticketInput: "",
      }));
      get().addToast(`Atendimento iniciado: ${selectedSlot.client_name}`, "success");

      // Fire Supabase update in background
      if (isSupabaseConfigured()) {
        updateAppointmentStatus(selectedSlot.id, "in_progress", {
          started_at: new Date().toISOString(),
        }).catch((err) =>
          console.error("[professional-store] submitTicket update error:", err)
        );
      }
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
        service_id: queueItem.service_id,
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

      // Fire Supabase update in background
      if (isSupabaseConfigured()) {
        updateAppointmentStatus(queueItem.id, "in_progress", {
          started_at: new Date().toISOString(),
        }).catch((err) =>
          console.error("[professional-store] submitTicket queue update error:", err)
        );
      }
      return;
    }

    // Not found locally — try Supabase
    if (isSupabaseConfigured()) {
      try {
        const apt = await findAppointmentByTicket(
          code,
          get().professional.store_id
        );
        if (apt) {
          await updateAppointmentStatus(apt.id, "in_progress", {
            started_at: new Date().toISOString(),
          });
          // Re-fetch schedule to get full slot data
          await get().init(get().professional.id);
          set({ screen: "active", ticketInput: "" });
          get().addToast("Atendimento iniciado", "success");
          return;
        }
      } catch (err) {
        console.error("[professional-store] submitTicket Supabase error:", err);
      }
    }

    // Not found anywhere
    set({ ticketError: "Codigo invalido. Verifique e tente novamente." });
    get().addToast("Ticket nao encontrado", "error");
  },

  completeService: (slotId) => {
    set((state) => {
      const updatedSchedule = state.schedule.map((s) =>
        s.id === slotId
          ? {
              ...s,
              status: "completed" as const,
              completed_at: new Date().toISOString(),
            }
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

    // Fire Supabase update + transaction creation in background
    if (isSupabaseConfigured()) {
      const slot = get().schedule.find((s) => s.id === slotId);
      updateAppointmentStatus(slotId, "completed", {
        completed_at: new Date().toISOString(),
      })
        .then(async () => {
          if (slot && slot.client_id && slot.service_id) {
            await createTransactionOnComplete({
              appointmentId: slotId,
              professionalId: get().professional.id,
              clientId: slot.client_id,
              serviceId: slot.service_id,
              amountCents: slot.price_cents,
            });
          }
        })
        .then(() => get().init(get().professional.id))
        .catch((err) =>
          console.error("[professional-store] completeService error:", err)
        );
    }
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
