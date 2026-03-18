"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { Service } from "@cheia/types";

interface ServiceModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ServiceFormData) => Promise<void>;
  service?: Service | null;
}

export interface ServiceFormData {
  name: string;
  category: string;
  duration_minutes: number;
  price_cents: number;
  description: string;
}

const CATEGORIES = ["Cabelo", "Coloracao", "Tratamento", "Manicure", "Maquiagem", "Combo", "Outros"];

export function ServiceModal({ open, onClose, onSubmit, service }: ServiceModalProps) {
  const [form, setForm] = useState({
    name: "",
    category: "Cabelo",
    duration: "30",
    price: "",
    description: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (service) {
      setForm({
        name: service.name,
        category: service.category,
        duration: service.duration_minutes.toString(),
        price: (service.price_cents / 100).toFixed(2),
        description: service.description ?? "",
      });
    } else {
      setForm({ name: "", category: "Cabelo", duration: "30", price: "", description: "" });
    }
  }, [service, open]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price) return;
    setSaving(true);
    await onSubmit({
      name: form.name,
      category: form.category,
      duration_minutes: parseInt(form.duration || "30"),
      price_cents: Math.round(parseFloat(form.price) * 100),
      description: form.description,
    });
    setSaving(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {service ? "Editar Servico" : "Adicionar Servico"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-500">Nome</label>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Ex: Corte Feminino"
              required
              className="w-full rounded-xl border-none bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Category */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-500">Categoria</label>
            <select
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className="w-full appearance-none rounded-xl border-none bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-black"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Duration + Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-500">Duracao (min)</label>
              <input
                type="number"
                min={5}
                value={form.duration}
                onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
                className="w-full rounded-xl border-none bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-500">Preco (R$)</label>
              <input
                type="number"
                step="0.01"
                min={0}
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                placeholder="0.00"
                required
                className="w-full rounded-xl border-none bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-500">Descricao (opcional)</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={2}
              placeholder="Descricao do servico..."
              className="w-full resize-none rounded-xl border-none bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={saving}
            className="mt-2 w-full rounded-xl bg-black py-3 font-bold text-white shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            {saving ? "Salvando..." : "Salvar"}
          </button>
        </form>
      </div>
    </div>
  );
}
