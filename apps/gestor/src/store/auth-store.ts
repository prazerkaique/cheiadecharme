"use client";

import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";
import type { Profile, Store } from "@cheia/types";

interface AuthState {
  session: Session | null;
  profile: Profile | null;
  store: Store | null;
  loading: boolean;

  init: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  profile: null,
  store: null,
  loading: true,

  init: async () => {
    // Guard: don't re-init if already done
    if (!get().loading) return;

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("auth_id", session.user.id)
          .in("role", ["gestor", "master"])
          .single();

        let store: Store | null = null;
        if (profile) {
          const { data } = await supabase
            .from("stores")
            .select("*")
            .eq("id", profile.store_id)
            .single();
          store = data;
        }

        set({ session, profile, store, loading: false });
      } else {
        set({ session: null, profile: null, store: null, loading: false });
      }

      supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session && !get().profile) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("auth_id", session.user.id)
            .in("role", ["gestor", "master"])
            .single();

          let store: Store | null = null;
          if (profile) {
            const { data } = await supabase
              .from("stores")
              .select("*")
              .eq("id", profile.store_id)
              .single();
            store = data;
          }

          set({ session, profile, store, loading: false });
        } else if (!session) {
          set({ session: null, profile: null, store: null, loading: false });
        }
      });
    } catch {
      set({ session: null, profile: null, store: null, loading: false });
    }
  },

  login: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ session: null, profile: null, store: null });
  },
}));
