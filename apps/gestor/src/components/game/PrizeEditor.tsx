"use client";

import { Plus, Trash2 } from "lucide-react";
import type { Prize, PrizeType } from "@cheia/types";

interface PrizeEditorProps {
  prizes: Prize[];
  onChange: (prizes: Prize[]) => void;
  typeOptions: { value: PrizeType; label: string }[];
}

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

export function PrizeEditor({ prizes, onChange, typeOptions }: PrizeEditorProps) {
  const totalWeight = prizes.reduce((sum, p) => sum + p.weight, 0);

  const update = (i: number, field: string, value: string | number) =>
    onChange(prizes.map((p, idx) => (idx === i ? { ...p, [field]: value } : p)));

  const remove = (i: number) => onChange(prizes.filter((_, idx) => idx !== i));

  const add = () =>
    onChange([
      ...prizes,
      { id: generateId(), label: "", type: "try_again", value: 0, color: "#EC4899", weight: 1 },
    ]);

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="hidden grid-cols-[1fr_140px_80px_80px_60px_40px] items-center gap-2 text-xs font-bold uppercase text-gray-400 md:grid">
        <span>Label</span>
        <span>Tipo</span>
        <span>Valor</span>
        <span>Cor</span>
        <span>Peso</span>
        <span />
      </div>

      {prizes.map((prize, i) => (
        <div
          key={prize.id}
          className="grid grid-cols-1 gap-2 rounded-2xl border border-gray-100 bg-gray-50 p-3 md:grid-cols-[1fr_140px_80px_80px_60px_40px] md:items-center md:rounded-xl md:border-0 md:bg-transparent md:p-0"
        >
          <input
            value={prize.label}
            onChange={(e) => update(i, "label", e.target.value)}
            placeholder="Nome do premio"
            className="w-full rounded-xl border-none bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-black md:bg-gray-50"
          />
          <select
            value={prize.type}
            onChange={(e) => update(i, "type", e.target.value)}
            className="w-full rounded-xl border-none bg-gray-50 px-3 py-3 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-black"
          >
            {typeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <input
            type="number"
            value={prize.value}
            onChange={(e) => update(i, "value", Number(e.target.value))}
            placeholder="0"
            className="w-full rounded-xl border-none bg-gray-50 px-3 py-3 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-black"
          />
          <input
            type="color"
            value={prize.color}
            onChange={(e) => update(i, "color", e.target.value)}
            className="h-[44px] w-full cursor-pointer rounded-xl border-none bg-gray-50 px-1"
          />
          <input
            type="number"
            value={prize.weight}
            onChange={(e) => update(i, "weight", Number(e.target.value))}
            min={1}
            className="w-full rounded-xl border-none bg-gray-50 px-3 py-3 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-black"
          />
          <button
            onClick={() => remove(i)}
            className="flex items-center justify-center rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}

      <button
        onClick={add}
        className="flex items-center gap-1 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
      >
        <Plus size={16} /> Adicionar Premio
      </button>

      {/* Probability bar */}
      {prizes.length > 0 && totalWeight > 0 && (
        <div className="mt-4">
          <label className="mb-2 block text-xs font-bold uppercase text-gray-400">Probabilidade</label>
          <div className="flex h-8 overflow-hidden rounded-xl">
            {prizes.map((prize) => {
              const pct = (prize.weight / totalWeight) * 100;
              if (pct <= 0) return null;
              return (
                <div
                  key={prize.id}
                  title={`${prize.label || "?"}: ${pct.toFixed(1)}%`}
                  className="flex items-center justify-center text-[10px] font-bold text-white transition-all"
                  style={{ width: `${pct}%`, backgroundColor: prize.color, minWidth: pct > 3 ? undefined : "2px" }}
                >
                  {pct >= 8 && `${pct.toFixed(1)}%`}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
