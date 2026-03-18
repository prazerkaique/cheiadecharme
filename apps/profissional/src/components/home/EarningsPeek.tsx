"use client";

import { motion } from "framer-motion";
import { TrendingUp, Eye, EyeOff } from "lucide-react";
import { useProfessionalStore } from "@/store/professional-store";
import { formatPrice } from "@/lib/format";

const ease = [0.22, 1, 0.36, 1] as const;

export function EarningsPeek() {
  const getDailySummary = useProfessionalStore((s) => s.getDailySummary);
  const earningsVisible = useProfessionalStore((s) => s.earningsVisible);
  const toggleEarningsVisible = useProfessionalStore((s) => s.toggleEarningsVisible);
  const goToEarnings = useProfessionalStore((s) => s.goToEarnings);
  const summary = getDailySummary();

  const EyeIcon = earningsVisible ? Eye : EyeOff;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease }}
      className="relative glass rounded-[var(--radius-lg)] p-4"
    >
      <button
        onClick={goToEarnings}
        className="flex w-full items-center gap-3 text-left"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
          <TrendingUp size={20} className="text-success" />
        </div>
        <div className="flex-1">
          <p className="text-[var(--text-small)] font-semibold text-brand-text-muted">
            Comissao hoje
          </p>
          <p className="text-[var(--text-subtitle)] font-bold tabular-nums text-brand-text">
            {earningsVisible ? formatPrice(summary.commissionCents) : "R$ ••••"}
          </p>
        </div>
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleEarningsVisible();
        }}
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-2 text-brand-text-muted transition hover:bg-brand-border"
      >
        <EyeIcon size={20} />
      </button>
    </motion.div>
  );
}
