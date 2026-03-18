"use client";

import type { ClientFrequency } from "@cheia/types";

const CONFIG: Record<ClientFrequency, { label: string; className: string }> = {
  vip: { label: "VIP", className: "bg-emerald-100 text-emerald-700" },
  regular: { label: "Regular", className: "bg-blue-100 text-blue-700" },
  occasional: { label: "Ocasional", className: "bg-yellow-100 text-yellow-700" },
  new: { label: "Novo", className: "bg-gray-100 text-gray-500" },
};

interface FrequencyBadgeProps {
  frequency: ClientFrequency;
}

export function FrequencyBadge({ frequency }: FrequencyBadgeProps) {
  const { label, className } = CONFIG[frequency];
  return (
    <span className={`rounded-lg px-2 py-0.5 text-[10px] font-bold ${className}`}>
      {label}
    </span>
  );
}
