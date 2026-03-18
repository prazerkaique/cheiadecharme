"use client";

import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown, ArrowRight } from "lucide-react";

interface KPICardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  trend?: number;
  color?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function KPICard({ label, value, icon: Icon, trend, color, actionLabel, onAction }: KPICardProps) {
  const iconBg = color ? `${color}15` : "rgba(236,72,153,0.1)";
  const iconColor = color || "#EC4899";

  return (
    <div className="flex flex-col justify-between rounded-3xl border border-gray-200 bg-white p-5 shadow-sm transition-transform hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="rounded-2xl p-2.5" style={{ backgroundColor: iconBg }}>
          <Icon size={22} style={{ color: iconColor }} />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 rounded-lg px-2 py-0.5 text-xs font-bold ${
            trend >= 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
          }`}>
            {trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(trend).toFixed(1)}%
          </div>
        )}
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="mt-0.5 text-sm text-gray-500">{label}</p>
      </div>
      {actionLabel && (
        <button
          onClick={onAction}
          className="mt-3 flex items-center gap-1 text-xs font-semibold text-gray-400 transition-colors hover:text-gray-600"
        >
          {actionLabel} <ArrowRight size={12} />
        </button>
      )}
    </div>
  );
}
