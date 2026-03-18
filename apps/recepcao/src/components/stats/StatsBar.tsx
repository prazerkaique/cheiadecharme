"use client";

import { useReceptionStore } from "@/store/reception-store";
import { Clock, Users, PlayCircle, CheckCircle } from "lucide-react";

export function StatsBar() {
  // Subscribe to data dependencies so we re-render on changes
  useReceptionStore((s) => s.queue);
  useReceptionStore((s) => s.now);
  const getStats = useReceptionStore((s) => s.getStats);
  const stats = getStats();

  const items = [
    { icon: Users, label: "Esperando", value: stats.waiting, color: "text-warning" },
    { icon: PlayCircle, label: "Atendendo", value: stats.inProgress, color: "text-primary" },
    { icon: CheckCircle, label: "Finalizados", value: stats.completed, color: "text-success" },
    { icon: Clock, label: "Espera media", value: `${stats.avgWaitMinutes}min`, color: "text-brand-text-muted" },
  ];

  return (
    <div className="flex items-center gap-6">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.label} className="flex items-center gap-1.5">
            <Icon size={16} className={item.color} />
            <span className="text-[var(--text-small)] font-bold text-brand-text tabular-nums">
              {item.value}
            </span>
            <span className="text-[11px] text-brand-text-muted">{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}
