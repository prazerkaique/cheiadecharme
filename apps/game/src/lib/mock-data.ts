import type { GameConfig, Prize } from "@cheia/types";

// 12 segments: branco, rosa claro, branco, rosa choque (repeating x3)
const C = ["#FFFFFF", "#F5B8D3", "#FFFFFF", "#C2185B"] as const;
const SEGMENT_COLORS = [...C, ...C, ...C]; // 12 cores perfeitas

export const DEFAULT_PRIZES: Prize[] = [
  { id: "prize-1",  label: "10% Desconto",      type: "discount_percent", value: 10, color: SEGMENT_COLORS[0],  weight: 20 },
  { id: "prize-2",  label: "20% Desconto",      type: "discount_percent", value: 20, color: SEGMENT_COLORS[1],  weight: 12 },
  { id: "prize-3",  label: "30% Desconto",      type: "discount_percent", value: 30, color: SEGMENT_COLORS[2],  weight: 6 },
  { id: "prize-4",  label: "Hidratação Grátis", type: "free_service",     value: 0,  color: SEGMENT_COLORS[3],  weight: 3 },
  { id: "prize-5",  label: "Escova Grátis",     type: "free_service",     value: 0,  color: SEGMENT_COLORS[4],  weight: 4 },
  { id: "prize-6",  label: "+10 Charmes",       type: "charmes",          value: 10, color: SEGMENT_COLORS[5],  weight: 15 },
  { id: "prize-7",  label: "+25 Charmes",       type: "charmes",          value: 25, color: SEGMENT_COLORS[6],  weight: 10 },
  { id: "prize-8",  label: "+50 Charmes",       type: "charmes",          value: 50, color: SEGMENT_COLORS[7],  weight: 5 },
  { id: "prize-9",  label: "50% Desconto",      type: "discount_percent", value: 50, color: SEGMENT_COLORS[8],  weight: 8 },
  { id: "prize-10", label: "Tente Novamente",   type: "try_again",        value: 0,  color: SEGMENT_COLORS[9],  weight: 15 },
  { id: "prize-11", label: "Corte Grátis",      type: "free_service",     value: 0,  color: SEGMENT_COLORS[10], weight: 2 },
  { id: "prize-12", label: "+100 Charmes",      type: "charmes",          value: 100,color: SEGMENT_COLORS[11], weight: 3 },
];

export const DEFAULT_SCRATCH_PRIZES: Prize[] = [
  { id: "scratch-1", label: "Nada",                    type: "nothing",          value: 0,  color: "#FFFFFF",  weight: 60 },
  { id: "scratch-2", label: "+25 Charmes",             type: "charmes",          value: 25, color: "#F5B8D3",  weight: 20 },
  { id: "scratch-3", label: "20% Desconto",            type: "discount_percent", value: 20, color: "#FFFFFF",  weight: 12 },
  { id: "scratch-4", label: "50% Desconto",            type: "discount_percent", value: 50, color: "#C2185B",  weight: 7.9 },
  { id: "scratch-5", label: "1 Ano de Corte Grátis",   type: "yearly_service",   value: 0,  color: "#D94B8C",  weight: 0.1 },
];

export const DEFAULT_GAME_CONFIG: GameConfig = {
  spin_cost_cents: 500,
  prizes: DEFAULT_PRIZES,
  scratchPrizes: DEFAULT_SCRATCH_PRIZES,
};
