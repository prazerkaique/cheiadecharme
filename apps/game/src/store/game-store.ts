import { create } from "zustand";
import type { GameStep, GameClient, GameConfig, GameType, Prize } from "@cheia/types";
import { DEFAULT_GAME_CONFIG } from "@/lib/mock-data";
import { fetchGameConfig } from "@/lib/queries/game";

// ---------------------------------------------------------------------------
// State shape
// ---------------------------------------------------------------------------

interface GameState {
  step: GameStep;
  client: GameClient | null;
  config: GameConfig;
  wonPrize: Prize | null;
  isSpinning: boolean;
  isScratching: boolean;
  gameType: GameType | null;
  paymentMethod: "charmes" | "pix" | null;

  // Timeout warning
  showTimeoutWarning: boolean;
  timeoutSecondsRemaining: number;

  // Cancel confirm
  showCancelConfirm: boolean;

  // Actions
  reset: () => void;
  setStep: (step: GameStep) => void;
  setClient: (client: GameClient) => void;
  setWonPrize: (prize: Prize) => void;
  setIsSpinning: (spinning: boolean) => void;
  setIsScratching: (scratching: boolean) => void;
  setGameType: (type: GameType) => void;
  setPaymentMethod: (method: "charmes" | "pix") => void;
  deductCharmes: (amount: number) => void;
  addCharmes: (amount: number) => void;

  // Timeout
  showTimeout: () => void;
  hideTimeout: () => void;
  setTimeoutSeconds: (seconds: number) => void;

  // Cancel
  showCancel: () => void;
  hideCancel: () => void;

  // Config
  loadConfig: () => Promise<void>;
}

// ---------------------------------------------------------------------------
// Initial values
// ---------------------------------------------------------------------------

type GameData = Omit<
  GameState,
  | "reset"
  | "setStep"
  | "setClient"
  | "setWonPrize"
  | "setIsSpinning"
  | "setIsScratching"
  | "setGameType"
  | "setPaymentMethod"
  | "deductCharmes"
  | "addCharmes"
  | "showTimeout"
  | "hideTimeout"
  | "setTimeoutSeconds"
  | "showCancel"
  | "hideCancel"
  | "loadConfig"
>;

const initialState: GameData = {
  step: "idle",
  client: null,
  config: DEFAULT_GAME_CONFIG,
  wonPrize: null,
  isSpinning: false,
  isScratching: false,
  gameType: null,
  paymentMethod: null,
  showTimeoutWarning: false,
  timeoutSecondsRemaining: 15,
  showCancelConfirm: false,
};

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useGameStore = create<GameState>()((set) => ({
  ...initialState,

  reset: () => set({ ...initialState }),

  setStep: (step) => set({ step }),

  setClient: (client) => set({ client }),

  setWonPrize: (prize) => set({ wonPrize: prize }),

  setIsSpinning: (spinning) => set({ isSpinning: spinning }),

  setIsScratching: (scratching) => set({ isScratching: scratching }),

  setGameType: (type) => set({ gameType: type }),

  setPaymentMethod: (method) => set({ paymentMethod: method }),

  deductCharmes: (amount) =>
    set((state) => ({
      client: state.client
        ? { ...state.client, balance_charmes: state.client.balance_charmes - amount }
        : null,
    })),

  addCharmes: (amount) =>
    set((state) => ({
      client: state.client
        ? { ...state.client, balance_charmes: state.client.balance_charmes + amount }
        : null,
    })),

  // Timeout
  showTimeout: () => set({ showTimeoutWarning: true, timeoutSecondsRemaining: 15 }),
  hideTimeout: () => set({ showTimeoutWarning: false, timeoutSecondsRemaining: 15 }),
  setTimeoutSeconds: (seconds) => set({ timeoutSecondsRemaining: seconds }),

  // Cancel
  showCancel: () => set({ showCancelConfirm: true }),
  hideCancel: () => set({ showCancelConfirm: false }),

  // Config
  loadConfig: async () => {
    try {
      const config = await fetchGameConfig();
      set({ config });
    } catch (err) {
      console.error("[loadConfig] Failed, using defaults:", err);
    }
  },
}));
