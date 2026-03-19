"use client";

import { Save, Target } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { useGameConfigStore } from "@/store/game-config-store";
import { useUIStore } from "@/store/ui-store";
import { PrizeEditor } from "./PrizeEditor";
import type { Prize, PrizeType } from "@cheia/types";
import { useState, useEffect } from "react";

const ROULETTE_TYPES: { value: PrizeType; label: string }[] = [
  { value: "discount_percent", label: "% Desconto" },
  { value: "discount_fixed", label: "R$ Desconto" },
  { value: "free_service", label: "Servico Gratis" },
  { value: "charmes", label: "Charmes" },
  { value: "try_again", label: "Tente Novamente" },
];

export function RouletteTab() {
  const store = useAuthStore((s) => s.store);
  const { config, saving, save } = useGameConfigStore();
  const addToast = useUIStore((s) => s.addToast);

  const [prizes, setPrizes] = useState<Prize[]>([]);

  useEffect(() => {
    if (config?.prizes) setPrizes(config.prizes);
  }, [config?.prizes]);

  const handleSave = async () => {
    if (!store?.id) return;
    try {
      await save(store.id, { prizes });
      addToast("Premios da roleta salvos", "success");
    } catch {
      addToast("Erro ao salvar", "error");
    }
  };

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-2xl bg-pink-50 p-2.5">
          <Target size={22} className="text-pink-500" />
        </div>
        <h3 className="font-bold text-gray-900">Premios da Roleta</h3>
      </div>

      <PrizeEditor prizes={prizes} onChange={setPrizes} typeOptions={ROULETTE_TYPES} />

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-black px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
        >
          <Save size={18} />
          {saving ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </div>
  );
}
