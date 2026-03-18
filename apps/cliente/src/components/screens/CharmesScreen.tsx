"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Gem, TrendingUp, TrendingDown, Gift, ShoppingCart, RotateCcw, Star } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { useClientStore } from "@/store/client-store";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate } from "@/lib/format";
import type { CharmeTransactionType } from "@cheia/types";
import type { LucideIcon } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

const TX_CONFIG: Record<CharmeTransactionType, { icon: LucideIcon; color: string; label: string }> = {
  earn: { icon: TrendingUp, color: "text-success", label: "Cashback" },
  spend: { icon: TrendingDown, color: "text-error", label: "Usado" },
  purchase: { icon: ShoppingCart, color: "text-cta", label: "Compra" },
  refund: { icon: RotateCcw, color: "text-warning", label: "Estorno" },
  bonus: { icon: Gift, color: "text-primary", label: "Bonus" },
};

export function CharmesScreen() {
  const charmes = useClientStore((s) => s.charmes);
  const transactions = useClientStore((s) => s.charmeTransactions);
  const loadCharmeHistory = useClientStore((s) => s.loadCharmeHistory);

  useEffect(() => {
    loadCharmeHistory();
  }, [loadCharmeHistory]);

  const balance = charmes?.balance ?? 0;

  return (
    <div className="max-w-lg mx-auto">
      <Header title="Charmes" />

      <div className="px-4 py-4 space-y-5">
        {/* Balance card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease }}
          className="rounded-2xl bg-gradient-to-br from-primary via-cta to-primary p-6 text-white text-center glow-cta"
        >
          <Gem className="w-10 h-10 mx-auto mb-2 opacity-90" />
          <p className="text-sm opacity-80 font-semibold">Saldo de Charmes</p>
          <p className="text-4xl font-display font-bold mt-1">{balance}</p>
        </motion.div>

        {/* Transactions */}
        <div>
          <h3 className="text-base font-display font-semibold text-brand-text mb-3">
            Extrato
          </h3>

          {transactions.length === 0 ? (
            <EmptyState icon={Star} title="Nenhuma movimentacao" description="Seu historico de charmes aparecera aqui" />
          ) : (
            <div className="space-y-2">
              {transactions.map((tx, i) => {
                const config = TX_CONFIG[tx.type];
                const Icon = config.icon;
                const isPositive = tx.amount > 0;
                return (
                  <motion.div
                    key={tx.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, ease, delay: i * 0.03 }}
                    className="glass-strong rounded-xl p-3 flex items-center gap-3"
                  >
                    <div className={`w-9 h-9 rounded-lg bg-surface flex items-center justify-center ${config.color}`}>
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-brand-text truncate">{tx.description}</p>
                      <p className="text-xs text-brand-text-muted">{formatDate(tx.created_at)}</p>
                    </div>
                    <span className={`text-sm font-bold ${isPositive ? "text-success" : "text-error"}`}>
                      {isPositive ? "+" : ""}{tx.amount}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
