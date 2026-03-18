"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { ArrowRight } from "lucide-react";

const COLORS = ["#EC4899", "#8B5CF6", "#F59E0B", "#10B981", "#3B82F6", "#EF4444"];

interface ServiceDistributionProps {
  data: { name: string; value: number }[];
}

export function ServiceDistribution({ data }: ServiceDistributionProps) {
  const total = data.reduce((acc, d) => acc + d.value, 0);

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-bold text-gray-900">Servicos Mais Vendidos</h3>
        <button className="flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-gray-600">
          Ver Detalhes <ArrowRight size={12} />
        </button>
      </div>

      <div className="h-52">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={75}
                paddingAngle={4}
                dataKey="value"
                nameKey="name"
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "#FFFFFF",
                  border: "1px solid #E5E7EB",
                  borderRadius: "12px",
                  fontSize: "13px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            Sem dados no periodo
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-2 space-y-2">
        {data.slice(0, 5).map((item, i) => (
          <div key={item.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ background: COLORS[i % COLORS.length] }}
              />
              <span className="truncate text-gray-600">{item.name}</span>
            </div>
            <span className="font-semibold text-gray-900">
              {total > 0 ? Math.round((item.value / total) * 100) : 0}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
