"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const MONTHS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

interface SeasonalityChartProps {
  data: { month: number; value: number }[];
  year?: number;
}

export function SeasonalityChart({ data, year }: SeasonalityChartProps) {
  const chartData = MONTHS.map((name, i) => ({
    name,
    value: data.find((d) => d.month === i + 1)?.value ?? 0,
  }));

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-bold text-gray-900">Sazonalidade Anual</h3>
        {year && (
          <span className="rounded-lg bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-600">
            {year}
          </span>
        )}
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barSize={28}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: "#9CA3AF" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#9CA3AF" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => {
                if (v >= 1000) return `R$${(v / 1000).toFixed(0)}k`;
                return `R$${v}`;
              }}
            />
            <Tooltip
              contentStyle={{
                background: "#FFFFFF",
                border: "1px solid #E5E7EB",
                borderRadius: "12px",
                fontSize: "13px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
              formatter={(v: number) => [`R$ ${(v / 100).toFixed(2)}`, "Receita"]}
            />
            <Bar
              dataKey="value"
              fill="#EC4899"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
