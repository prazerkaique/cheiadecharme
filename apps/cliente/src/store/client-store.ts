"use client";

import { create } from "zustand";
import type { Profile, Service, Appointment, Promotion, CharmeTransaction, ClientCharmes } from "@cheia/types";
import type { ClientScreen, BookingStep, BottomTab, LoginMethod } from "@/types/client";
import { isSupabaseConfigured, supabase, STORE_ID } from "@/lib/supabase";
import {
  MOCK_CLIENT,
  MOCK_CHARMES,
  MOCK_CHARME_TRANSACTIONS,
  MOCK_SERVICES,
  MOCK_PROFESSIONALS,
  MOCK_APPOINTMENTS,
  MOCK_PROMOTIONS,
} from "@/lib/mock-data";

type EnrichedAppointment = Appointment & {
  service_name: string;
  professional_name: string | null;
  service_category: string;
  price_cents: number;
};

interface Toast {
  id: string;
  message: string;
  type: "success" | "error";
}

interface ClientState {
  // Auth
  screen: ClientScreen;
  isLoggedIn: boolean;
  _restoringSession: boolean;
  loginMethod: LoginMethod | null;
  phone: string;
  email: string;
  cpf: string;
  otpCode: string;
  authLoading: boolean;
  authError: string | null;

  // Data
  profile: Profile | null;
  charmes: ClientCharmes | null;
  charmeTransactions: CharmeTransaction[];
  services: Service[];
  professionals: Profile[];
  appointments: EnrichedAppointment[];
  promotions: Promotion[];

  // Booking
  bookingStep: BookingStep;
  selectedCategory: string | null;
  selectedServiceId: string | null;
  selectedProfessionalId: string | null;
  selectedDate: string | null;
  selectedTime: string | null;

  // UI
  toasts: Toast[];
  activeTab: BottomTab;

  // Auth actions
  setLoginMethod: (method: LoginMethod | null) => void;
  setPhone: (phone: string) => void;
  setEmail: (email: string) => void;
  setCpf: (cpf: string) => void;
  setOtpCode: (code: string) => void;
  sendOtp: () => Promise<void>;
  verifyOtp: () => Promise<void>;
  restoreSession: () => Promise<void>;
  logout: () => void;

  // Navigation
  navigate: (screen: ClientScreen) => void;
  setActiveTab: (tab: BottomTab) => void;
  goBack: () => void;

  // Booking actions
  setBookingStep: (step: BookingStep) => void;
  selectCategory: (cat: string) => void;
  selectService: (id: string) => void;
  selectProfessional: (id: string | null) => void;
  selectDate: (date: string) => void;
  selectTime: (time: string) => void;
  confirmBooking: () => Promise<void>;
  resetBooking: () => void;

  // Data fetching
  loadHomeData: () => Promise<void>;
  loadServices: () => Promise<void>;
  loadCharmeHistory: () => Promise<void>;
  loadPromotions: () => Promise<void>;
  loadHistory: () => Promise<void>;

  // UI
  addToast: (message: string, type: "success" | "error") => void;
  dismissToast: (id: string) => void;

  // Computed
  getUpcomingAppointments: () => EnrichedAppointment[];
  getPastAppointments: () => EnrichedAppointment[];
  getCategories: () => { name: string; count: number }[];
  getServicesByCategory: (cat: string) => Service[];
  getProfessionalsByCategory: (cat: string) => Profile[];
}

const TAB_SCREEN_MAP: Record<BottomTab, ClientScreen> = {
  home: "home",
  booking: "booking",
  charmes: "charmes",
  profile: "profile",
};

export const useClientStore = create<ClientState>((set, get) => ({
  // ── Auth ──────────────────────────────────────────────────
  screen: "login",
  isLoggedIn: false,
  _restoringSession: true,
  loginMethod: null,
  phone: "",
  email: "",
  cpf: "",
  otpCode: "",
  authLoading: false,
  authError: null,

  // ── Data ──────────────────────────────────────────────────
  profile: null,
  charmes: null,
  charmeTransactions: [],
  services: [],
  professionals: [],
  appointments: [],
  promotions: [],

  // ── Booking ───────────────────────────────────────────────
  bookingStep: "category",
  selectedCategory: null,
  selectedServiceId: null,
  selectedProfessionalId: null,
  selectedDate: null,
  selectedTime: null,

  // ── UI ────────────────────────────────────────────────────
  toasts: [],
  activeTab: "home",

  // ── Auth actions ──────────────────────────────────────────

  setLoginMethod: (method) => set({ loginMethod: method, authError: null }),
  setPhone: (phone) => set({ phone, authError: null }),
  setEmail: (email) => set({ email, authError: null }),
  setCpf: (cpf) => set({ cpf, authError: null }),
  setOtpCode: (code) => set({ otpCode: code, authError: null }),

  sendOtp: async () => {
    const { loginMethod, phone, email, cpf } = get();

    // Validate input per method
    if (loginMethod === "phone") {
      const digits = phone.replace(/\D/g, "");
      if (digits.length < 10) {
        set({ authError: "Informe um telefone valido" });
        return;
      }
    } else if (loginMethod === "email") {
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        set({ authError: "Informe um email valido" });
        return;
      }
    } else if (loginMethod === "cpf") {
      const cpfDigits = cpf.replace(/\D/g, "");
      if (cpfDigits.length !== 11) {
        set({ authError: "Informe um CPF valido" });
        return;
      }
    }

    set({ authLoading: true, authError: null });

    if (!isSupabaseConfigured()) {
      // Mock: go straight to OTP screen
      await new Promise((r) => setTimeout(r, 800));
      if (loginMethod === "cpf") {
        // Mock: pretend we found a profile with this phone
        set({ authLoading: false, screen: "otp", phone: "(44) 99760-7545" });
      } else {
        set({ authLoading: false, screen: "otp" });
      }
      return;
    }

    try {
      if (loginMethod === "phone") {
        const digits = phone.replace(/\D/g, "");
        const fullPhone = `+55${digits}`;
        const { error } = await supabase.auth.signInWithOtp({ phone: fullPhone });
        if (error) throw error;
        set({ authLoading: false, screen: "otp" });
      } else if (loginMethod === "email") {
        const { error } = await supabase.auth.signInWithOtp({ email });
        if (error) throw error;
        set({ authLoading: false, screen: "otp" });
      } else if (loginMethod === "cpf") {
        // Look up profile by CPF (stored formatted as XXX.XXX.XXX-XX)
        const cpfDigits = cpf.replace(/\D/g, "");
        const cpfFormatted = cpfDigits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
        const { data: profile } = await supabase
          .from("profiles")
          .select("phone")
          .eq("cpf", cpfFormatted)
          .eq("role", "cliente")
          .eq("store_id", STORE_ID)
          .single();

        if (!profile || !profile.phone) {
          set({ authLoading: false, authError: "CPF nao cadastrado" });
          return;
        }

        // Send OTP to the phone on file (stored as "(XX) XXXXX-XXXX", auth needs "+55XXXXXXXXXXX")
        const profilePhoneDigits = profile.phone.replace(/\D/g, "");
        const profilePhoneFull = `+55${profilePhoneDigits}`;
        const { error } = await supabase.auth.signInWithOtp({ phone: profilePhoneFull });
        if (error) throw error;
        set({ authLoading: false, screen: "otp", phone: profile.phone });
      }
    } catch {
      set({ authLoading: false, authError: "Erro ao enviar codigo. Tente novamente." });
    }
  },

  verifyOtp: async () => {
    const { loginMethod, phone, email, otpCode } = get();

    if (otpCode.length < 6) {
      set({ authError: "Informe o codigo de 6 digitos" });
      return;
    }

    set({ authLoading: true, authError: null });

    if (!isSupabaseConfigured()) {
      // Mock: accept any 6-digit code
      await new Promise((r) => setTimeout(r, 800));
      set({
        authLoading: false,
        isLoggedIn: true,
        screen: "home",
        profile: MOCK_CLIENT,
        charmes: MOCK_CHARMES,
        appointments: MOCK_APPOINTMENTS,
        promotions: MOCK_PROMOTIONS,
        services: MOCK_SERVICES,
        professionals: MOCK_PROFESSIONALS,
        charmeTransactions: MOCK_CHARME_TRANSACTIONS,
        activeTab: "home",
      });
      return;
    }

    try {
      // Verify OTP by method
      if (loginMethod === "email") {
        const { error } = await supabase.auth.verifyOtp({
          email,
          token: otpCode,
          type: "email",
        });
        if (error) throw error;
      } else {
        // phone or cpf — both use SMS
        const phoneDigits = phone.replace(/\D/g, "");
        const fullPhone = phone.startsWith("+") ? phone : `+55${phoneDigits}`;
        const { error } = await supabase.auth.verifyOtp({
          phone: fullPhone,
          token: otpCode,
          type: "sms",
        });
        if (error) throw error;
      }

      // Fetch or create profile
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Session not found");

      // Look up profile by email or phone
      let existingProfile;
      if (loginMethod === "email") {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("email", email)
          .eq("role", "cliente")
          .eq("store_id", STORE_ID)
          .single();
        existingProfile = data;
      } else {
        const phoneDigits = phone.replace(/\D/g, "");
        const fullPhone = phone.startsWith("+") ? phone : `+55${phoneDigits}`;
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("phone", fullPhone)
          .eq("role", "cliente")
          .eq("store_id", STORE_ID)
          .single();
        existingProfile = data;
      }

      let profile: Profile;
      if (existingProfile) {
        // Link auth_id if not yet linked
        if (!existingProfile.auth_id) {
          await supabase
            .from("profiles")
            .update({ auth_id: session.user.id })
            .eq("id", existingProfile.id);
        }
        profile = { ...existingProfile, auth_id: session.user.id } as Profile;
      } else {
        // Create new profile + wallet
        const phoneDigits = phone.replace(/\D/g, "");
        const fullPhone = phone.startsWith("+") ? phone : `+55${phoneDigits}`;
        const { data: newProfile, error: createErr } = await supabase
          .from("profiles")
          .insert({
            auth_id: session.user.id,
            store_id: STORE_ID,
            name: loginMethod === "email" ? email : (session.user.phone ?? fullPhone),
            phone: loginMethod === "email" ? null : fullPhone,
            email: loginMethod === "email" ? email : null,
            role: "cliente",
          })
          .select()
          .single();
        if (createErr || !newProfile) throw createErr ?? new Error("Profile creation failed");
        profile = newProfile as Profile;

        // Create charmes wallet
        await supabase.from("client_charmes").insert({
          client_id: profile.id,
          store_id: STORE_ID,
          balance: 0,
        });
      }

      set({
        authLoading: false,
        isLoggedIn: true,
        screen: "home",
        profile,
        activeTab: "home",
      });

      // Load data in background
      get().loadHomeData();
    } catch {
      set({ authLoading: false, authError: "Codigo invalido. Tente novamente." });
    }
  },

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
        .select("*")
        .eq("auth_id", session.user.id)
        .eq("role", "cliente")
        .maybeSingle();

      if (!profile) {
        set({ _restoringSession: false });
        return;
      }

      set({
        _restoringSession: false,
        isLoggedIn: true,
        screen: "home",
        profile: profile as Profile,
        activeTab: "home",
      });

      get().loadHomeData();
    } catch {
      set({ _restoringSession: false });
    }
  },

  logout: () => {
    if (isSupabaseConfigured()) {
      supabase.auth.signOut().catch(() => {});
    }
    set({
      isLoggedIn: false,
      screen: "login",
      profile: null,
      charmes: null,
      charmeTransactions: [],
      appointments: [],
      loginMethod: null,
      phone: "",
      email: "",
      cpf: "",
      otpCode: "",
      activeTab: "home",
    });
  },

  // ── Navigation ────────────────────────────────────────────

  navigate: (screen) => set({ screen }),

  setActiveTab: (tab) => {
    const screen = TAB_SCREEN_MAP[tab];
    set({ activeTab: tab, screen });
    if (tab === "booking") {
      get().resetBooking();
      get().loadServices();
    }
  },

  goBack: () => {
    const { screen, bookingStep } = get();
    if (screen === "booking") {
      const steps: BookingStep[] = ["category", "service", "professional", "datetime", "confirm"];
      const idx = steps.indexOf(bookingStep);
      if (idx > 0) {
        set({ bookingStep: steps[idx - 1] });
        return;
      }
    }
    set({ screen: "home", activeTab: "home" });
  },

  // ── Booking actions ───────────────────────────────────────

  setBookingStep: (step) => set({ bookingStep: step }),

  selectCategory: (cat) => {
    set({ selectedCategory: cat, bookingStep: "service", selectedServiceId: null });
  },

  selectService: (id) => {
    set({ selectedServiceId: id, bookingStep: "professional", selectedProfessionalId: null });
  },

  selectProfessional: (id) => {
    set({ selectedProfessionalId: id, bookingStep: "datetime", selectedDate: null, selectedTime: null });
  },

  selectDate: (date) => set({ selectedDate: date, selectedTime: null }),
  selectTime: (time) => set({ selectedTime: time }),

  confirmBooking: async () => {
    const { selectedServiceId, selectedProfessionalId, selectedDate, selectedTime, profile } = get();
    if (!selectedServiceId || !selectedDate || !selectedTime || !profile) return;

    const scheduledAt = new Date(`${selectedDate}T${selectedTime}:00`).toISOString();
    const service = get().services.find((s) => s.id === selectedServiceId);

    if (isSupabaseConfigured()) {
      try {
        await supabase.from("appointments").insert({
          store_id: STORE_ID,
          client_id: profile.id,
          service_id: selectedServiceId,
          professional_id: selectedProfessionalId,
          source: "app",
          status: "scheduled",
          scheduled_at: scheduledAt,
        });
      } catch {
        get().addToast("Erro ao agendar. Tente novamente.", "error");
        return;
      }
    }

    // Add to local state
    const newAppt: EnrichedAppointment = {
      id: `local-${Date.now()}`,
      store_id: STORE_ID,
      client_id: profile.id,
      professional_id: selectedProfessionalId,
      service_id: selectedServiceId,
      status: "scheduled",
      scheduled_at: scheduledAt,
      checked_in_at: null,
      started_at: null,
      completed_at: null,
      queue_position: null,
      ticket_number: null,
      qr_code: null,
      source: "app",
      created_at: new Date().toISOString(),
      service_name: service?.name ?? "Servico",
      professional_name: get().professionals.find((p) => p.id === selectedProfessionalId)?.name ?? null,
      service_category: service?.category ?? "",
      price_cents: service?.price_cents ?? 0,
    };

    set((s) => ({ appointments: [newAppt, ...s.appointments] }));
    get().addToast("Agendamento confirmado!", "success");
    get().resetBooking();
    set({ screen: "home", activeTab: "home" });
  },

  resetBooking: () => {
    set({
      bookingStep: "category",
      selectedCategory: null,
      selectedServiceId: null,
      selectedProfessionalId: null,
      selectedDate: null,
      selectedTime: null,
    });
  },

  // ── Data fetching ─────────────────────────────────────────

  loadHomeData: async () => {
    if (!isSupabaseConfigured()) {
      set({
        charmes: MOCK_CHARMES,
        appointments: MOCK_APPOINTMENTS,
        promotions: MOCK_PROMOTIONS,
        services: MOCK_SERVICES,
        professionals: MOCK_PROFESSIONALS,
      });
      return;
    }

    const profile = get().profile;
    if (!profile) return;

    try {
      const [charmesRes, appointmentsRes, promotionsRes] = await Promise.all([
        supabase.from("client_charmes").select("*").eq("client_id", profile.id).eq("store_id", STORE_ID).single(),
        supabase
          .from("appointments")
          .select("*, services(name, category, price_cents), profiles!appointments_professional_id_fkey(name)")
          .eq("client_id", profile.id)
          .eq("store_id", STORE_ID)
          .order("scheduled_at", { ascending: false })
          .limit(20),
        supabase.from("promotions").select("*").eq("store_id", STORE_ID).eq("is_active", true),
      ]);

      if (charmesRes.data) set({ charmes: charmesRes.data as unknown as ClientCharmes });

      if (appointmentsRes.data) {
        const enriched: EnrichedAppointment[] = appointmentsRes.data.map((a: Record<string, unknown>) => ({
          ...(a as unknown as Appointment),
          service_name: ((a.services as Record<string, unknown>)?.name as string) ?? "Servico",
          service_category: ((a.services as Record<string, unknown>)?.category as string) ?? "",
          price_cents: ((a.services as Record<string, unknown>)?.price_cents as number) ?? 0,
          professional_name: ((a.profiles as Record<string, unknown>)?.name as string) ?? null,
        }));
        set({ appointments: enriched });
      }

      if (promotionsRes.data) set({ promotions: promotionsRes.data as Promotion[] });
    } catch (err) {
      console.error("[client-store] loadHomeData error:", err);
    }
  },

  loadServices: async () => {
    if (!isSupabaseConfigured()) {
      set({ services: MOCK_SERVICES, professionals: MOCK_PROFESSIONALS });
      return;
    }

    try {
      const [servicesRes, professionalsRes] = await Promise.all([
        supabase.from("services").select("*").eq("store_id", STORE_ID).eq("is_active", true).order("category"),
        supabase.from("profiles").select("*").eq("store_id", STORE_ID).eq("role", "profissional").eq("is_active", true).eq("is_available", true),
      ]);

      if (servicesRes.data) set({ services: servicesRes.data as Service[] });
      if (professionalsRes.data) set({ professionals: professionalsRes.data as Profile[] });
    } catch (err) {
      console.error("[client-store] loadServices error:", err);
    }
  },

  loadCharmeHistory: async () => {
    if (!isSupabaseConfigured()) {
      set({ charmeTransactions: MOCK_CHARME_TRANSACTIONS });
      return;
    }

    const profile = get().profile;
    if (!profile) return;

    try {
      const { data } = await supabase
        .from("charme_transactions")
        .select("*")
        .eq("client_id", profile.id)
        .eq("store_id", STORE_ID)
        .order("created_at", { ascending: false })
        .limit(50);

      if (data) set({ charmeTransactions: data as CharmeTransaction[] });
    } catch (err) {
      console.error("[client-store] loadCharmeHistory error:", err);
    }
  },

  loadPromotions: async () => {
    if (!isSupabaseConfigured()) {
      set({ promotions: MOCK_PROMOTIONS });
      return;
    }

    try {
      const { data } = await supabase
        .from("promotions")
        .select("*")
        .eq("store_id", STORE_ID)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (data) set({ promotions: data as Promotion[] });
    } catch (err) {
      console.error("[client-store] loadPromotions error:", err);
    }
  },

  loadHistory: async () => {
    if (!isSupabaseConfigured()) {
      set({ appointments: MOCK_APPOINTMENTS });
      return;
    }

    const profile = get().profile;
    if (!profile) return;

    try {
      const { data } = await supabase
        .from("appointments")
        .select("*, services(name, category, price_cents), profiles!appointments_professional_id_fkey(name)")
        .eq("client_id", profile.id)
        .eq("store_id", STORE_ID)
        .order("scheduled_at", { ascending: false })
        .limit(50);

      if (data) {
        const enriched: EnrichedAppointment[] = data.map((a: Record<string, unknown>) => ({
          ...(a as unknown as Appointment),
          service_name: ((a.services as Record<string, unknown>)?.name as string) ?? "Servico",
          service_category: ((a.services as Record<string, unknown>)?.category as string) ?? "",
          price_cents: ((a.services as Record<string, unknown>)?.price_cents as number) ?? 0,
          professional_name: ((a.profiles as Record<string, unknown>)?.name as string) ?? null,
        }));
        set({ appointments: enriched });
      }
    } catch (err) {
      console.error("[client-store] loadHistory error:", err);
    }
  },

  // ── UI ────────────────────────────────────────────────────

  addToast: (message, type) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    set((s) => ({ toasts: [...s.toasts, { id, message, type }] }));
  },

  dismissToast: (id) => {
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
  },

  // ── Computed ──────────────────────────────────────────────

  getUpcomingAppointments: () => {
    const now = new Date();
    return get()
      .appointments
      .filter((a) => a.status === "scheduled" && a.scheduled_at && new Date(a.scheduled_at) >= now)
      .sort((a, b) => new Date(a.scheduled_at!).getTime() - new Date(b.scheduled_at!).getTime());
  },

  getPastAppointments: () => {
    return get()
      .appointments
      .filter((a) => a.status === "completed" || a.status === "no_show")
      .sort((a, b) => new Date(b.scheduled_at ?? b.created_at).getTime() - new Date(a.scheduled_at ?? a.created_at).getTime());
  },

  getCategories: () => {
    const services = get().services;
    const map = new Map<string, number>();
    services.forEach((s) => map.set(s.category, (map.get(s.category) ?? 0) + 1));
    return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
  },

  getServicesByCategory: (cat) => {
    return get().services.filter((s) => s.category === cat);
  },

  getProfessionalsByCategory: (cat) => {
    return get().professionals.filter((p) => p.specialty === cat);
  },
}));
