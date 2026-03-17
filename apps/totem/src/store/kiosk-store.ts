import { create } from "zustand";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type KioskStep =
  | "idle"
  | "identify"
  | "found"
  | "not_found"
  | "register"
  | "select_service"
  | "confirm"
  | "done";

export type IdentifyMethod = "cpf" | "phone";

export interface KioskClient {
  id: string;
  name: string;
  cpf: string | null;
  phone: string | null;
  balance_charmes: number;
}

export interface KioskService {
  id: string;
  name: string;
  category: string;
  price_charmes: number;
  duration_minutes: number;
  image_url: string | null;
}

export interface KioskProfessional {
  id: string;
  name: string;
  avatar_url: string | null;
  specialty: string | null;
}

export interface KioskAppointment {
  id: string;
  ticket_number: string;
  qr_code: string;
  queue_position: number;
}

export interface KioskTodayAppointment {
  id: string;
  service_name: string;
  scheduled_at: string;
  professional_name: string | null;
}

// ---------------------------------------------------------------------------
// State shape
// ---------------------------------------------------------------------------

interface KioskState {
  // Flow control
  step: KioskStep;

  // Identification
  identifyMethod: IdentifyMethod | null;
  inputValue: string;

  // Client data
  client: KioskClient | null;
  todayAppointments: KioskTodayAppointment[];
  selectedAppointmentId: string | null;

  // Cart (multi-service)
  cart: KioskService[];

  // Cross-sell modal
  showCrossSell: boolean;
  crossSellService: KioskService | null;
  crossSellDiscount: number;

  // Professional selection — per service (serviceId → professional)
  professionalsByService: Record<string, KioskProfessional>;

  // Confirmed appointment
  appointment: KioskAppointment | null;

  // Registration form
  registerName: string;
  registerCpf: string;
  registerPhone: string;

  // Timeout warning
  showTimeoutWarning: boolean;
  timeoutSecondsRemaining: number;

  // Cancel confirm
  showCancelConfirm: boolean;

  // Charmes wallet
  showWallet: boolean;
  showBuyCharmes: boolean;
  buyCharmesDeficit: number | null;

  // ---------------------------------------------------------------------------
  // Actions
  // ---------------------------------------------------------------------------

  goToIdentify: () => void;
  setIdentifyMethod: (method: IdentifyMethod) => void;
  setInputValue: (value: string) => void;

  clientFound: (
    client: KioskClient,
    todayAppointments?: KioskTodayAppointment[]
  ) => void;

  clientNotFound: () => void;

  selectAppointmentForCheckin: (id: string) => void;
  goToRegister: () => void;

  setRegisterName: (name: string) => void;
  setRegisterCpf: (cpf: string) => void;
  setRegisterPhone: (phone: string) => void;

  clientRegistered: (client: KioskClient) => void;

  // Cart
  addToCart: (service: KioskService) => void;
  removeFromCart: (serviceId: string) => void;
  clearCart: () => void;

  // Cross-sell
  showCrossSellModal: (service: KioskService, discount: number) => void;
  hideCrossSell: () => void;

  // Professional — per service
  assignProfessional: (serviceId: string, professional: KioskProfessional) => void;
  /** Assign the same professional to ALL services in cart */
  assignAllProfessionals: (professional: KioskProfessional) => void;

  goToConfirm: () => void;
  appointmentConfirmed: (appointment: KioskAppointment) => void;

  // Timeout
  showTimeout: () => void;
  hideTimeout: () => void;
  setTimeoutSeconds: (seconds: number) => void;

  // Cancel
  showCancel: () => void;
  hideCancel: () => void;

  // Charmes wallet
  openWallet: () => void;
  closeWallet: () => void;
  openBuyCharmes: (deficit?: number) => void;
  closeBuyCharmes: () => void;

  reset: () => void;
}

// ---------------------------------------------------------------------------
// Initial values
// ---------------------------------------------------------------------------

type KioskData = Omit<
  KioskState,
  | "goToIdentify"
  | "setIdentifyMethod"
  | "setInputValue"
  | "clientFound"
  | "clientNotFound"
  | "selectAppointmentForCheckin"
  | "goToRegister"
  | "setRegisterName"
  | "setRegisterCpf"
  | "setRegisterPhone"
  | "clientRegistered"
  | "addToCart"
  | "removeFromCart"
  | "clearCart"
  | "showCrossSellModal"
  | "hideCrossSell"
  | "assignProfessional"
  | "assignAllProfessionals"
  | "goToConfirm"
  | "appointmentConfirmed"
  | "showTimeout"
  | "hideTimeout"
  | "setTimeoutSeconds"
  | "showCancel"
  | "hideCancel"
  | "openWallet"
  | "closeWallet"
  | "openBuyCharmes"
  | "closeBuyCharmes"
  | "reset"
>;

const initialState: KioskData = {
  step: "idle",
  identifyMethod: null,
  inputValue: "",
  client: null,
  todayAppointments: [],
  selectedAppointmentId: null,
  cart: [],
  showCrossSell: false,
  crossSellService: null,
  crossSellDiscount: 0,
  professionalsByService: {},
  appointment: null,
  registerName: "",
  registerCpf: "",
  registerPhone: "",
  showTimeoutWarning: false,
  timeoutSecondsRemaining: 15,
  showCancelConfirm: false,
  showWallet: false,
  showBuyCharmes: false,
  buyCharmesDeficit: null,
};

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useKioskStore = create<KioskState>()((set) => ({
  ...initialState,

  // -- Navigation -----------------------------------------------------------

  goToIdentify: () =>
    set({ step: "identify", identifyMethod: null, inputValue: "" }),

  setIdentifyMethod: (method) => set({ identifyMethod: method }),
  setInputValue: (value) => set({ inputValue: value }),

  clientFound: (client, todayAppointments = []) =>
    set({ step: "found", client, todayAppointments, selectedAppointmentId: null }),

  clientNotFound: () =>
    set({ step: "not_found", client: null, todayAppointments: [], selectedAppointmentId: null }),

  selectAppointmentForCheckin: (id) => set({ selectedAppointmentId: id }),

  goToRegister: () =>
    set({ step: "register", registerName: "", registerCpf: "", registerPhone: "" }),

  // -- Registration ---------------------------------------------------------

  setRegisterName: (name) => set({ registerName: name }),
  setRegisterCpf: (cpf) => set({ registerCpf: cpf }),
  setRegisterPhone: (phone) => set({ registerPhone: phone }),

  clientRegistered: (client) =>
    set({
      step: "select_service",
      client,
      registerName: "",
      registerCpf: "",
      registerPhone: "",
    }),

  // -- Cart -----------------------------------------------------------------

  addToCart: (service) =>
    set((state) => {
      if (state.cart.some((s) => s.id === service.id)) return state;
      return { cart: [...state.cart, service] };
    }),

  removeFromCart: (serviceId) =>
    set((state) => {
      const { [serviceId]: _, ...rest } = state.professionalsByService;
      return {
        cart: state.cart.filter((s) => s.id !== serviceId),
        professionalsByService: rest,
      };
    }),

  clearCart: () => set({ cart: [], professionalsByService: {} }),

  // -- Cross-sell -----------------------------------------------------------

  showCrossSellModal: (service, discount) =>
    set({ showCrossSell: true, crossSellService: service, crossSellDiscount: discount }),

  hideCrossSell: () =>
    set({ showCrossSell: false, crossSellService: null, crossSellDiscount: 0 }),

  // -- Professional per service ---------------------------------------------

  assignProfessional: (serviceId, professional) =>
    set((state) => ({
      professionalsByService: {
        ...state.professionalsByService,
        [serviceId]: professional,
      },
    })),

  assignAllProfessionals: (professional) =>
    set((state) => {
      const assignments: Record<string, KioskProfessional> = {};
      for (const s of state.cart) {
        assignments[s.id] = professional;
      }
      return { professionalsByService: assignments };
    }),

  // -- Confirm / Done -------------------------------------------------------

  goToConfirm: () => set({ step: "confirm" }),

  appointmentConfirmed: (appointment) =>
    set({ step: "done", appointment }),

  // -- Timeout --------------------------------------------------------------

  showTimeout: () => set({ showTimeoutWarning: true, timeoutSecondsRemaining: 15 }),
  hideTimeout: () => set({ showTimeoutWarning: false, timeoutSecondsRemaining: 15 }),
  setTimeoutSeconds: (seconds) => set({ timeoutSecondsRemaining: seconds }),

  // -- Cancel ---------------------------------------------------------------

  showCancel: () => set({ showCancelConfirm: true }),
  hideCancel: () => set({ showCancelConfirm: false }),

  // -- Charmes wallet -------------------------------------------------------

  openWallet: () => set({ showWallet: true }),
  closeWallet: () => set({ showWallet: false }),
  openBuyCharmes: (deficit) => set({ showWallet: false, showBuyCharmes: true, buyCharmesDeficit: deficit ?? null }),
  closeBuyCharmes: () => set({ showBuyCharmes: false, buyCharmesDeficit: null }),

  // -- Reset ----------------------------------------------------------------

  reset: () => set({ ...initialState }),
}));
