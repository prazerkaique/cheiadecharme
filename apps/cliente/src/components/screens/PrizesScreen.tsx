"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Gem, Percent, Scissors, DollarSign } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { useClientStore } from "@/store/client-store";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate } from "@/lib/format";
import type { PrizeType } from "@cheia/types";
import type { LucideIcon } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

const PRIZE_CONFIG: Record<string, { icon: LucideIcon; color: string; bg: string }> = {
  charmes: { icon: Gem, color: "text-primary", bg: "bg-primary/10" },
  discount_percent: { icon: Percent, color: "text-warning", bg: "bg-warning/10" },
  discount_fixed: { icon: DollarSign, color: "text-cta", bg: "bg-cta/10" },
  free_service: { icon: Scissors, color: "text-success", bg: "bg-success/10" },
  yearly_service: { icon: Scissors, color: "text-success", bg: "bg-success/10" },
};

const DEFAULT_CONFIG = { icon: Trophy, color: "text-primary", bg: "bg-primary/10" };

function getPrizeConfig(type?: PrizeType) {
  if (!type) return DEFAULT_CONFIG;
  return PRIZE_CONFIG[type] ?? DEFAULT_CONFIG;
}

export function PrizesScreen() {
  const prizes = useClientStore((s) => s.prizes);
  const loadPrizes = useClientStore((s) => s.loadPrizes);

  useEffect(() => {
    loadPrizes();
  }, [loadPrizes]);

  // Filter out nothing/try_again (already filtered in store, but double-check)
  const validPrizes = prizes.filter(
    (p) => p.prize && p.prize.type !== "nothing" && p.prize.type !== "try_again"
  );

  return (
    <div className="max-w-lg mx-auto">
      <Header title="Meus Premios" showBack />

      <div className="px-4 py-4">
        {validPrizes.length === 0 ? (
          <EmptyState
            icon={Trophy}
            title="Nenhum premio"
            description="Jogue na Roleta ou Raspadinha no totem para ganhar premios!"
          />
        ) : (
          <div className="space-y-2">
            {validPrizes.map((spin, i) => {
              const config = getPrizeConfig(spin.prize?.type);
              const Icon = config.icon;
              const gameLabel = spin.game_type === "scratch" ? "Raspadinha" : "Roleta";

              return (
                <motion.div
                  key={spin.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, ease, delay: i * 0.03 }}
                  className="glass-strong rounded-xl p-3 flex items-center gap-3"
                >
                  <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${config.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-brand-text truncate">
                      {spin.prize?.label ?? "Premio"}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-brand-text-muted mt-0.5">
                      <span>{gameLabel}</span>
                      <span>•</span>
                      <span>{formatDate(spin.spun_at)}</span>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <span className="text-xs font-semibold text-cta bg-cta/10 px-2 py-1 rounded-full">
                      {spin.prize?.type === "charmes" && `+${spin.prize.value}`}
                      {spin.prize?.type === "discount_percent" && `${spin.prize.value}% OFF`}
                      {spin.prize?.type === "discount_fixed" && `R$${(spin.prize.value / 100).toFixed(0)} OFF`}
                      {spin.prize?.type === "free_service" && "Gratis"}
                      {spin.prize?.type === "yearly_service" && "Anual"}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
