"use client";

import { useState, useEffect } from "react";
import { Save, Settings } from "lucide-react";
import { NumberInput } from "@/components/ui/NumberInput";
import { useAuthStore } from "@/store/auth-store";
import { useGameConfigStore } from "@/store/game-config-store";
import { useUIStore } from "@/store/ui-store";

export function GeneralTab() {
  const store = useAuthStore((s) => s.store);
  const { config, saving, save } = useGameConfigStore();
  const addToast = useUIStore((s) => s.addToast);

  const [form, setForm] = useState({
    spin_cost_cents: 100,
    logo_url: "",
    is_active: true,
  });

  useEffect(() => {
    if (config) {
      setForm({
        spin_cost_cents: config.spin_cost_cents,
        logo_url: config.logo_url ?? "",
        is_active: config.is_active,
      });
    }
  }, [config]);

  const handleSave = async () => {
    if (!store?.id) return;
    try {
      await save(store.id, {
        spin_cost_cents: form.spin_cost_cents,
        logo_url: form.logo_url || null,
        is_active: form.is_active,
      });
      addToast("Configuracoes do game salvas", "success");
    } catch {
      addToast("Erro ao salvar", "error");
    }
  };

  return (
    <div className="max-w-2xl rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-2xl bg-gray-100 p-2.5">
          <Settings size={22} className="text-gray-500" />
        </div>
        <h3 className="font-bold text-gray-900">Configuracoes Gerais</h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500">Game Ativo</label>
            <p className="text-xs text-gray-400">Habilita/desabilita o Cheia de Sorte</p>
          </div>
          <button
            onClick={() => setForm((f) => ({ ...f, is_active: !f.is_active }))}
            className={`relative h-7 w-12 rounded-full transition-colors ${form.is_active ? "bg-green-500" : "bg-gray-300"}`}
          >
            <span
              className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-transform ${form.is_active ? "left-[22px]" : "left-0.5"}`}
            />
          </button>
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold uppercase text-gray-500">Custo do Giro (centavos em charmes)</label>
          <NumberInput
            value={form.spin_cost_cents}
            onChange={(v) => setForm((f) => ({ ...f, spin_cost_cents: v }))}
            min={0}
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold uppercase text-gray-500">Logo URL</label>
          <input
            value={form.logo_url}
            onChange={(e) => setForm((f) => ({ ...f, logo_url: e.target.value }))}
            placeholder="https://..."
            className="w-full rounded-xl border-none bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-black"
          />
        </div>
      </div>

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
