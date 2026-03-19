"use client";

import { useState, useEffect } from "react";
import { Save, Store } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { useConfigStore } from "@/store/config-store";
import { useUIStore } from "@/store/ui-store";
import type { StoreSettings } from "@cheia/types";

export function LojaTab() {
  const store = useAuthStore((s) => s.store);
  const { storeData, settings, saving, saveStore, saveSettings } = useConfigStore();
  const addToast = useUIStore((s) => s.addToast);

  const [form, setForm] = useState({ name: "", address: "", phone: "" });
  const [settingsForm, setSettingsForm] = useState({
    open_time: "09:00",
    close_time: "19:00",
    max_queue: 50,
    ticket_prefix: "CCC",
  });

  useEffect(() => {
    if (storeData) {
      setForm({ name: storeData.name, address: storeData.address, phone: storeData.phone });
    }
  }, [storeData]);

  useEffect(() => {
    if (settings) {
      setSettingsForm({
        open_time: settings.open_time ?? "09:00",
        close_time: settings.close_time ?? "19:00",
        max_queue: settings.max_queue ?? 50,
        ticket_prefix: settings.ticket_prefix ?? "CCC",
      });
    }
  }, [settings]);

  const handleSave = async () => {
    if (!store?.id) return;
    try {
      await saveStore(store.id, form);
      const merged: StoreSettings = {
        ...settings,
        open_time: settingsForm.open_time,
        close_time: settingsForm.close_time,
        max_queue: settingsForm.max_queue,
        ticket_prefix: settingsForm.ticket_prefix,
      };
      await saveSettings(store.id, merged);
      addToast("Configuracoes da loja salvas", "success");
    } catch {
      addToast("Erro ao salvar", "error");
    }
  };

  return (
    <div className="max-w-2xl rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-2xl bg-pink-50 p-2.5">
          <Store size={22} className="text-pink-500" />
        </div>
        <h3 className="font-bold text-gray-900">Informacoes da Loja</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-xs font-bold uppercase text-gray-500">Nome da Loja</label>
          <input
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="w-full rounded-xl border-none bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold uppercase text-gray-500">Endereco</label>
          <input
            value={form.address}
            onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
            placeholder="Rua, numero, bairro, cidade"
            className="w-full rounded-xl border-none bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold uppercase text-gray-500">Telefone</label>
          <input
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            placeholder="(21) 99999-9999"
            className="w-full rounded-xl border-none bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div className="h-px bg-gray-100" />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase text-gray-500">Horario de Abertura</label>
            <input
              type="time"
              value={settingsForm.open_time}
              onChange={(e) => setSettingsForm((f) => ({ ...f, open_time: e.target.value }))}
              className="w-full rounded-xl border-none bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div>
            <label className="mb-2 block text-xs font-bold uppercase text-gray-500">Horario de Fechamento</label>
            <input
              type="time"
              value={settingsForm.close_time}
              onChange={(e) => setSettingsForm((f) => ({ ...f, close_time: e.target.value }))}
              className="w-full rounded-xl border-none bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase text-gray-500">Tamanho Max. Fila</label>
            <input
              type="number"
              value={settingsForm.max_queue}
              onChange={(e) => setSettingsForm((f) => ({ ...f, max_queue: Number(e.target.value) }))}
              className="w-full rounded-xl border-none bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div>
            <label className="mb-2 block text-xs font-bold uppercase text-gray-500">Prefixo do Ticket</label>
            <input
              value={settingsForm.ticket_prefix}
              onChange={(e) => setSettingsForm((f) => ({ ...f, ticket_prefix: e.target.value }))}
              placeholder="CCC"
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
