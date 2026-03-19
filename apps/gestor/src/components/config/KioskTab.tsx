"use client";

import { useState, useEffect } from "react";
import { Save, Monitor, Plus, Trash2 } from "lucide-react";
import { NumberInput } from "@/components/ui/NumberInput";
import { useAuthStore } from "@/store/auth-store";
import { useConfigStore } from "@/store/config-store";
import { useUIStore } from "@/store/ui-store";
import type { StoreSettings } from "@cheia/types";

const DEFAULT_CATEGORIES = ["Cabelo", "Unhas", "Sobrancelha", "Maquiagem", "Depilacao", "Tratamentos"];

export function KioskTab() {
  const store = useAuthStore((s) => s.store);
  const { settings, saving, saveSettings } = useConfigStore();
  const addToast = useUIStore((s) => s.addToast);

  const [form, setForm] = useState({
    kiosk_idle_timeout_s: 45,
    kiosk_warning_s: 15,
    kiosk_done_countdown_s: 15,
    kiosk_cross_sell_enabled: true,
    kiosk_cross_sell_discount: 20,
    kiosk_slideshow_interval_s: 6,
  });
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    if (settings) {
      setForm({
        kiosk_idle_timeout_s: settings.kiosk_idle_timeout_s ?? 45,
        kiosk_warning_s: settings.kiosk_warning_s ?? 15,
        kiosk_done_countdown_s: settings.kiosk_done_countdown_s ?? 15,
        kiosk_cross_sell_enabled: settings.kiosk_cross_sell_enabled ?? true,
        kiosk_cross_sell_discount: settings.kiosk_cross_sell_discount ?? 20,
        kiosk_slideshow_interval_s: settings.kiosk_slideshow_interval_s ?? 6,
      });
      setCategories(settings.kiosk_categories?.length ? settings.kiosk_categories : DEFAULT_CATEGORIES);
    }
  }, [settings]);

  const addCategory = () => {
    const val = newCategory.trim();
    if (val && !categories.includes(val)) {
      setCategories((c) => [...c, val]);
      setNewCategory("");
    }
  };

  const removeCategory = (i: number) => setCategories((c) => c.filter((_, idx) => idx !== i));

  const handleSave = async () => {
    if (!store?.id) return;
    try {
      const merged: StoreSettings = {
        ...settings,
        ...form,
        kiosk_categories: categories,
      };
      await saveSettings(store.id, merged);
      addToast("Configuracoes do kiosk salvas", "success");
    } catch {
      addToast("Erro ao salvar", "error");
    }
  };

  return (
    <div className="max-w-2xl rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-2xl bg-blue-50 p-2.5">
          <Monitor size={22} className="text-blue-500" />
        </div>
        <h3 className="font-bold text-gray-900">Kiosk / Totem</h3>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase text-gray-500">Timeout Inatividade (s)</label>
            <NumberInput
              value={form.kiosk_idle_timeout_s}
              onChange={(v) => setForm((f) => ({ ...f, kiosk_idle_timeout_s: v }))}
              min={5}
            />
          </div>
          <div>
            <label className="mb-2 block text-xs font-bold uppercase text-gray-500">Countdown Aviso (s)</label>
            <NumberInput
              value={form.kiosk_warning_s}
              onChange={(v) => setForm((f) => ({ ...f, kiosk_warning_s: v }))}
              min={3}
            />
          </div>
          <div>
            <label className="mb-2 block text-xs font-bold uppercase text-gray-500">Countdown Sucesso (s)</label>
            <NumberInput
              value={form.kiosk_done_countdown_s}
              onChange={(v) => setForm((f) => ({ ...f, kiosk_done_countdown_s: v }))}
              min={3}
            />
          </div>
        </div>

        <div className="h-px bg-gray-100" />

        <div className="flex items-center justify-between">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500">Cross-sell Ativo</label>
            <p className="text-xs text-gray-400">Oferece servicos adicionais com desconto</p>
          </div>
          <button
            onClick={() => setForm((f) => ({ ...f, kiosk_cross_sell_enabled: !f.kiosk_cross_sell_enabled }))}
            className={`relative h-7 w-12 rounded-full transition-colors ${form.kiosk_cross_sell_enabled ? "bg-green-500" : "bg-gray-300"}`}
          >
            <span
              className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-transform ${form.kiosk_cross_sell_enabled ? "left-[22px]" : "left-0.5"}`}
            />
          </button>
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold uppercase text-gray-500">Desconto Cross-sell (%)</label>
          <NumberInput
            value={form.kiosk_cross_sell_discount}
            onChange={(v) => setForm((f) => ({ ...f, kiosk_cross_sell_discount: v }))}
            min={0}
            max={100}
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold uppercase text-gray-500">Intervalo Slideshow Idle (s)</label>
          <NumberInput
            value={form.kiosk_slideshow_interval_s}
            onChange={(v) => setForm((f) => ({ ...f, kiosk_slideshow_interval_s: v }))}
            min={1}
          />
        </div>

        <div className="h-px bg-gray-100" />

        <div>
          <label className="mb-2 block text-xs font-bold uppercase text-gray-500">Categorias de Servico</label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat, i) => (
              <span
                key={i}
                className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700"
              >
                {cat}
                <button
                  onClick={() => removeCategory(i)}
                  className="ml-1 text-gray-400 transition-colors hover:text-red-500"
                >
                  <Trash2 size={14} />
                </button>
              </span>
            ))}
          </div>
          <div className="mt-2 flex items-center gap-2">
            <input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCategory()}
              placeholder="Nova categoria..."
              className="flex-1 rounded-xl border-none bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-black"
            />
            <button
              onClick={addCategory}
              className="flex items-center gap-1 rounded-xl bg-gray-100 px-4 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
            >
              <Plus size={16} /> Adicionar
            </button>
          </div>
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
