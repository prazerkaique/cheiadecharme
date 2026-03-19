"use client";

import { useState, useEffect } from "react";
import { Save, Tv } from "lucide-react";
import { NumberInput } from "@/components/ui/NumberInput";
import { useAuthStore } from "@/store/auth-store";
import { useConfigStore } from "@/store/config-store";
import { useUIStore } from "@/store/ui-store";
import type { StoreSettings } from "@cheia/types";

export function TvTab() {
  const store = useAuthStore((s) => s.store);
  const { settings, saving, saveSettings } = useConfigStore();
  const addToast = useUIStore((s) => s.addToast);

  const [form, setForm] = useState({
    tv_message: "",
    tv_refresh_interval_s: 30,
  });

  useEffect(() => {
    if (settings) {
      setForm({
        tv_message: settings.tv_message ?? "",
        tv_refresh_interval_s: settings.tv_refresh_interval_s ?? 30,
      });
    }
  }, [settings]);

  const handleSave = async () => {
    if (!store?.id) return;
    try {
      const merged: StoreSettings = {
        ...settings,
        ...form,
      };
      await saveSettings(store.id, merged);
      addToast("Configuracoes da TV salvas", "success");
    } catch {
      addToast("Erro ao salvar", "error");
    }
  };

  return (
    <div className="max-w-2xl rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-2xl bg-green-50 p-2.5">
          <Tv size={22} className="text-green-500" />
        </div>
        <h3 className="font-bold text-gray-900">TV da Fila</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-xs font-bold uppercase text-gray-500">Mensagem Personalizada</label>
          <textarea
            value={form.tv_message}
            onChange={(e) => setForm((f) => ({ ...f, tv_message: e.target.value }))}
            rows={4}
            placeholder="Mensagem que aparece na TV da fila..."
            className="w-full resize-none rounded-xl border-none bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold uppercase text-gray-500">Intervalo de Refresh (s)</label>
          <NumberInput
            value={form.tv_refresh_interval_s}
            onChange={(v) => setForm((f) => ({ ...f, tv_refresh_interval_s: v }))}
            min={5}
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
