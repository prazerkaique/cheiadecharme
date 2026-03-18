"use client";

import { useState, useEffect } from "react";
import type { Service, ProfessionalService } from "@cheia/types";
import { Save } from "lucide-react";

interface ServiceAssignmentProps {
  services: Service[];
  assigned: ProfessionalService[];
  defaultCommission: number;
  onSave: (assignments: { service_id: string; commission_rate: number | null }[]) => Promise<void>;
}

export function ServiceAssignment({
  services,
  assigned,
  defaultCommission,
  onSave,
}: ServiceAssignmentProps) {
  const [selections, setSelections] = useState<
    Record<string, { checked: boolean; override: string }>
  >({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const initial: Record<string, { checked: boolean; override: string }> = {};
    services.forEach((s) => {
      const match = assigned.find((a) => a.service_id === s.id);
      initial[s.id] = {
        checked: !!match,
        override: match?.commission_rate?.toString() ?? "",
      };
    });
    setSelections(initial);
  }, [services, assigned]);

  const toggle = (id: string) => {
    setSelections((prev) => ({
      ...prev,
      [id]: { ...prev[id], checked: !prev[id].checked },
    }));
  };

  const setOverride = (id: string, value: string) => {
    setSelections((prev) => ({
      ...prev,
      [id]: { ...prev[id], override: value },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    const assignments = Object.entries(selections)
      .filter(([, v]) => v.checked)
      .map(([service_id, v]) => ({
        service_id,
        commission_rate: v.override ? parseFloat(v.override) : null,
      }));
    await onSave(assignments);
    setSaving(false);
  };

  const categories = [...new Set(services.map((s) => s.category))];

  return (
    <div className="max-w-2xl rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-base font-bold text-gray-900">
        Servicos Atribuidos
      </h3>
      <p className="mb-4 text-xs text-gray-500">
        Comissao padrao: {defaultCommission}% (deixe em branco para usar padrao)
      </p>

      <div className="space-y-6">
        {categories.map((cat) => (
          <div key={cat}>
            <h4 className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">
              {cat}
            </h4>
            <div className="space-y-2">
              {services
                .filter((s) => s.category === cat)
                .map((service) => {
                  const sel = selections[service.id];
                  if (!sel) return null;
                  return (
                    <div
                      key={service.id}
                      className="flex items-center gap-3 rounded-xl bg-gray-50 p-3"
                    >
                      <input
                        type="checkbox"
                        checked={sel.checked}
                        onChange={() => toggle(service.id)}
                        className="h-4 w-4 rounded accent-black"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium text-gray-900">
                          {service.name}
                        </span>
                      </div>
                      {sel.checked && (
                        <input
                          type="number"
                          min={0}
                          max={100}
                          step={0.5}
                          placeholder={`${defaultCommission}%`}
                          value={sel.override}
                          onChange={(e) => setOverride(service.id, e.target.value)}
                          className="w-20 rounded-lg border-none bg-white px-2 py-1 text-xs text-gray-900 outline-none focus:ring-2 focus:ring-black"
                        />
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-black px-5 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
        >
          <Save size={16} />
          {saving ? "Salvando..." : "Salvar Servicos"}
        </button>
      </div>
    </div>
  );
}
