import { create } from "zustand";
import type { TVProfessional, TVCategory, TVCall, TVAd } from "@/types/tv";
import { MOCK_CATEGORIES, MOCK_ADS } from "@/lib/mock-data";
import { isSupabaseConfigured, supabase, STORE_ID } from "@/lib/supabase";
import { fetchTVProfessionals } from "@/lib/queries/professionals";
import type { RealtimeChannel } from "@supabase/supabase-js";

interface TVState {
  categories: TVCategory[];
  professionals: TVProfessional[];
  ads: TVAd[];
  currentAdIndex: number;
  showAd: boolean;
  callQueue: TVCall[];
  currentCall: TVCall | null;
  now: Date;
  _channel: RealtimeChannel | null;
  _pollInterval: ReturnType<typeof setInterval> | null;

  // Actions
  init: () => Promise<void>;
  subscribe: () => void;
  unsubscribe: () => void;
  tick: () => void;
  showNextAd: () => void;
  hideAd: () => void;
  pushCall: (call: TVCall) => void;
  dismissCall: () => void;
  getProfessionalsByCategory: (categoryId: string) => TVProfessional[];
}

export const useTVStore = create<TVState>((set, get) => ({
  categories: MOCK_CATEGORIES,
  professionals: [],
  ads: MOCK_ADS,
  currentAdIndex: 0,
  showAd: false,
  callQueue: [],
  currentCall: null,
  now: new Date(),
  _channel: null,
  _pollInterval: null,

  init: async () => {
    if (!isSupabaseConfigured()) return;

    try {
      const professionals = await fetchTVProfessionals();
      if (professionals.length > 0) {
        // Derive categories from professionals' categoryIds
        const categoryIds = new Set(professionals.map((p) => p.categoryId));
        const categories = MOCK_CATEGORIES.filter((c) => categoryIds.has(c.id));
        set({
          professionals,
          categories: categories.length > 0 ? categories : MOCK_CATEGORIES,
        });
      }
    } catch (err) {
      console.error("[tv-store] init error, using mock:", err);
    }
  },

  subscribe: () => {
    if (!isSupabaseConfigured() || get()._channel) return;

    const refetchProfessionals = async () => {
      try {
        const professionals = await fetchTVProfessionals();
        if (professionals.length > 0) {
          set({ professionals });
        }
      } catch (err) {
        console.error("[tv-store] re-fetch error:", err);
      }
    };

    const channel = supabase
      .channel("tv-appointments")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "appointments",
          filter: `store_id=eq.${STORE_ID}`,
        },
        async (payload) => {
          // Re-fetch professionals to update statuses on any appointment change
          await refetchProfessionals();

          // If status changed to "waiting", push a call notification
          if (
            payload.eventType === "UPDATE" &&
            payload.new.status === "waiting" &&
            payload.old.status !== "waiting"
          ) {
            try {
              // Fetch client and service info for the call
              const { data: apt } = await supabase
                .from("appointments")
                .select(
                  `
                  ticket_number,
                  client_id,
                  professional_id,
                  services(name)
                `
                )
                .eq("id", payload.new.id)
                .single();

              if (apt) {
                // Fetch client and professional names separately
                let clientName = "Cliente";
                let professionalName = "";
                if (apt.client_id) {
                  const { data: client } = await supabase
                    .from("profiles")
                    .select("name")
                    .eq("id", apt.client_id)
                    .single();
                  if (client) clientName = client.name;
                }
                if (apt.professional_id) {
                  const { data: prof } = await supabase
                    .from("profiles")
                    .select("name")
                    .eq("id", apt.professional_id)
                    .single();
                  if (prof) professionalName = prof.name;
                }

                const call: TVCall = {
                  id: payload.new.id as string,
                  clientName,
                  professionalName,
                  service:
                    (apt.services as unknown as { name: string } | null)?.name ?? "Serviço",
                  code: apt.ticket_number ?? "",
                  timestamp: Date.now(),
                };
                get().pushCall(call);
              }
            } catch (err) {
              console.error("[tv-store] call fetch error:", err);
            }
          }
        }
      )
      .subscribe();

    // Polling fallback: refetch professionals every 10s in case Realtime misses events
    const pollInterval = setInterval(refetchProfessionals, 10_000);

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

  showNextAd: () =>
    set((state) => ({
      showAd: true,
      currentAdIndex: (state.currentAdIndex + 1) % state.ads.length,
    })),

  hideAd: () => set({ showAd: false }),

  pushCall: (call) =>
    set((state) => ({
      callQueue: [...state.callQueue, call],
      currentCall: state.currentCall ?? call,
    })),

  dismissCall: () =>
    set((state) => {
      const remaining = state.callQueue.slice(1);
      return {
        callQueue: remaining,
        currentCall: remaining[0] ?? null,
      };
    }),

  getProfessionalsByCategory: (categoryId: string) =>
    get().professionals.filter((p) => p.categoryId === categoryId),
}));
