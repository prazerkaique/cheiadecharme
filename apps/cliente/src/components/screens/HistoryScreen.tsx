"use client";

import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Clock, Calendar, ShoppingCart, Gem, Trophy } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { useClientStore } from "@/store/client-store";
import type { HistoryItem } from "@/store/client-store";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate, getMonthYear } from "@/lib/format";
import type { LucideIcon } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

const ITEM_CONFIG: Record<string, { icon: LucideIcon; color: string; bg: string }> = {
  appointment: { icon: Calendar, color: "text-cta", bg: "bg-cta/10" },
  charme: { icon: Gem, color: "text-primary", bg: "bg-primary/10" },
  game: { icon: Trophy, color: "text-warning", bg: "bg-warning/10" },
};

const FILTERS = [
  { id: "all" as const, label: "Todos" },
  { id: "appointments" as const, label: "Agendamentos" },
  { id: "charmes" as const, label: "Charmes" },
  { id: "games" as const, label: "Jogos" },
];

function getItemIcon(item: HistoryItem): { Icon: LucideIcon; color: string; bg: string } {
  if (item.type === "charme" && item.title.toLowerCase().includes("compra")) {
    return { Icon: ShoppingCart, color: "text-cta", bg: "bg-cta/10" };
  }
  const config = ITEM_CONFIG[item.type];
  return { Icon: config.icon, color: config.color, bg: config.bg };
}

export function HistoryScreen() {
  const historyItems = useClientStore((s) => s.historyItems);
  const historyFilter = useClientStore((s) => s.historyFilter);
  const setHistoryFilter = useClientStore((s) => s.setHistoryFilter);
  const loadFullHistory = useClientStore((s) => s.loadFullHistory);

  useEffect(() => {
    loadFullHistory();
  }, [loadFullHistory]);

  const filtered = useMemo(() => {
    if (historyFilter === "all") return historyItems;
    if (historyFilter === "appointments") return historyItems.filter((i) => i.type === "appointment");
    if (historyFilter === "charmes") return historyItems.filter((i) => i.type === "charme");
    return historyItems.filter((i) => i.type === "game");
  }, [historyItems, historyFilter]);

  // Group by month
  const grouped = useMemo(() => {
    const map = new Map<string, HistoryItem[]>();
    filtered.forEach((item) => {
      const key = getMonthYear(item.date);
      const arr = map.get(key) ?? [];
      arr.push(item);
      map.set(key, arr);
    });
    return Array.from(map.entries());
  }, [filtered]);

  return (
    <div className="max-w-lg mx-auto">
      <Header title="Historico" showBack />

      <div className="px-4 py-4">
        {/* Filter pills */}
        <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-thin pb-1">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onPointerDown={(e) => { e.preventDefault(); setHistoryFilter(f.id); }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                historyFilter === f.id
                  ? "bg-cta text-white shadow-sm"
                  : "glass-strong text-brand-text-muted"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={Clock} title="Nenhuma atividade" description="Seu historico aparecera aqui" />
        ) : (
          <div className="space-y-6">
            {grouped.map(([month, items]) => (
              <div key={month}>
                <h3 className="text-sm font-semibold text-brand-text-muted uppercase tracking-wide mb-3 px-1">
                  {month}
                </h3>
                <div className="space-y-2">
                  {items.map((item, i) => {
                    const { Icon, color, bg } = getItemIcon(item);
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.25, ease, delay: i * 0.03 }}
                        className="glass-strong rounded-xl p-3 flex items-center gap-3"
                      >
                        <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                          <Icon className={`w-5 h-5 ${color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-brand-text truncate">
                            {item.title}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-brand-text-muted mt-0.5">
                            <span>{item.subtitle}</span>
                            <span>•</span>
                            <span>{formatDate(item.date)}</span>
                          </div>
                        </div>
                        {item.amount !== undefined && (
                          <span className={`text-sm font-bold ${
                            item.type === "charme"
                              ? item.positive ? "text-success" : "text-error"
                              : "text-brand-text"
                          }`}>
                            {item.type === "charme" && (item.positive ? "+" : "")}{item.type === "charme" ? item.amount : `R$${((item.amount ?? 0) / 100).toFixed(0)}`}
                          </span>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
