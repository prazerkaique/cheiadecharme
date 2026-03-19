"use client";

import { useState, useEffect } from "react";
import { Save, Coins, Plus, Trash2 } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { useConfigStore } from "@/store/config-store";
import { useUIStore } from "@/store/ui-store";
import type { StoreSettings, CharmePack } from "@cheia/types";

const DEFAULT_PACKS: CharmePack[] = [
  { charmes: 50, priceReais: 50 },
  { charmes: 100, priceReais: 100 },
  { charmes: 200, priceReais: 200 },
  { charmes: 500, priceReais: 500 },
];

export function CharmesTab() {
  const store = useAuthStore((s) => s.store);
  const { settings, saving, saveSettings } = useConfigStore();
  const addToast = useUIStore((s) => s.addToast);

  const [form, setForm] = useState({
    charme_rate_cents: 1,
    charme_discount_2x: 10,
    charme_discount_4x: 15,
    charme_min_custom: 10,
    charme_max_custom: 9999,
  });
  const [packs, setPacks] = useState<CharmePack[]>(DEFAULT_PACKS);

  useEffect(() => {
    if (settings) {
      setForm({
        charme_rate_cents: settings.charme_rate_cents ?? 1,
        charme_discount_2x: settings.charme_discount_2x ?? 10,
        charme_discount_4x: settings.charme_discount_4x ?? 15,
        charme_min_custom: settings.charme_min_custom ?? 10,
        charme_max_custom: settings.charme_max_custom ?? 9999,
      });
      setPacks(settings.charme_packs?.length ? settings.charme_packs : DEFAULT_PACKS);
    }
  }, [settings]);

  const addPack = () => setPacks((p) => [...p, { charmes: 100, priceReais: 100 }]);
  const removePack = (i: number) => setPacks((p) => p.filter((_, idx) => idx !== i));
  const updatePack = (i: number, field: keyof CharmePack, value: number) =>
    setPacks((p) => p.map((pack, idx) => (idx === i ? { ...pack, [field]: value } : pack)));

  const handleSave = async () => {
    if (!store?.id) return;
    try {
      const merged: StoreSettings = {
        ...settings,
        ...form,
        charme_packs: packs,
      };
      await saveSettings(store.id, merged);
      addToast("Configuracoes de charmes salvas", "success");
    } catch {
      addToast("Erro ao salvar", "error");
    }
  };

  return (
    <div className="max-w-2xl rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-2xl bg-purple-50 p-2.5">
          <Coins size={22} className="text-purple-500" />
        </div>
        <h3 className="font-bold text-gray-900">Charmes</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-xs font-bold uppercase text-gray-500">
            Taxa de Cambio (1 charme = X centavos)
          </label>
          <input
            type="number"
            value={form.charme_rate_cents}
            onChange={(e) => setForm((f) => ({ ...f, charme_rate_cents: Number(e.target.value) }))}
            className="w-full rounded-xl border-none bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Packs */}
        <div>
          <label className="mb-2 block text-xs font-bold uppercase text-gray-500">Pacotes de Compra</label>
          <div className="space-y-2">
            {packs.map((pack, i) => (
              <div key={i} className="flex items-center gap-3">
                <input
                  type="number"
                  value={pack.charmes}
                  onChange={(e) => updatePack(i, "charmes", Number(e.target.value))}
                  placeholder="Charmes"
                  className="w-full rounded-xl border-none bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-black"
                />
                <span className="shrink-0 text-sm text-gray-400">por R$</span>
                <input
                  type="number"
                  value={pack.priceReais}
                  onChange={(e) => updatePack(i, "priceReais", Number(e.target.value))}
                  placeholder="Preco"
                  className="w-full rounded-xl border-none bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-black"
                />
                <button
                  onClick={() => removePack(i)}
                  className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={addPack}
            className="mt-2 flex items-center gap-1 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
          >
            <Plus size={16} /> Adicionar Pacote
          </button>
        </div>

        <div className="h-px bg-gray-100" />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase text-gray-500">Desconto 2x Qtd (%)</label>
            <input
              type="number"
              value={form.charme_discount_2x}
              onChange={(e) => setForm((f) => ({ ...f, charme_discount_2x: Number(e.target.value) }))}
              className="w-full rounded-xl border-none bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div>
            <label className="mb-2 block text-xs font-bold uppercase text-gray-500">Desconto 4x Qtd (%)</label>
            <input
              type="number"
              value={form.charme_discount_4x}
              onChange={(e) => setForm((f) => ({ ...f, charme_discount_4x: Number(e.target.value) }))}
              className="w-full rounded-xl border-none bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase text-gray-500">Min. Charmes Customizado</label>
            <input
              type="number"
              value={form.charme_min_custom}
              onChange={(e) => setForm((f) => ({ ...f, charme_min_custom: Number(e.target.value) }))}
              className="w-full rounded-xl border-none bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div>
            <label className="mb-2 block text-xs font-bold uppercase text-gray-500">Max. Charmes Customizado</label>
            <input
              type="number"
              value={form.charme_max_custom}
              onChange={(e) => setForm((f) => ({ ...f, charme_max_custom: Number(e.target.value) }))}
              className="w-full rounded-xl border-none bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-black"
            />
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
