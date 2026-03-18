"use client";

import { motion } from "framer-motion";
import { ArrowLeft, DollarSign, TrendingUp, CheckCircle } from "lucide-react";
import { useProfessionalStore } from "@/store/professional-store";
import { Avatar } from "@/components/ui/Avatar";
import { formatPrice, formatTimeFromIso, formatDuration } from "@/lib/format";

const ease = [0.22, 1, 0.36, 1] as const;

export function EarningsScreen() {
  const getDailySummary = useProfessionalStore((s) => s.getDailySummary);
  const getCompletedSlots = useProfessionalStore((s) => s.getCompletedSlots);
  const goToHome = useProfessionalStore((s) => s.goToHome);

  const summary = getDailySummary();
  const completed = getCompletedSlots();

  return (
    <div className="mx-auto max-w-[var(--pro-max-w)] px-4 py-6">
      {/* Back */}
      <button
        onClick={goToHome}
        className="mb-6 flex items-center gap-2 text-[var(--text-body)] font-semibold text-brand-text-muted transition hover:text-brand-text"
      >
        <ArrowLeft size={20} />
        Voltar
      </button>

      <h1 className="font-display text-[var(--text-title)] font-bold text-brand-text mb-5">
        Ganhos do Dia
      </h1>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease }}
          className="glass rounded-[var(--radius-md)] p-4 text-center"
        >
          <DollarSign size={24} className="mx-auto text-primary" />
          <p className="mt-2 text-[var(--text-title)] font-bold tabular-nums text-brand-text">
            {formatPrice(summary.totalCents)}
          </p>
          <p className="text-[var(--text-small)] font-semibold text-brand-text-muted">
            Total Faturado
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease, delay: 0.05 }}
          className="glass rounded-[var(--radius-md)] p-4 text-center"
        >
          <TrendingUp size={24} className="mx-auto text-success" />
          <p className="mt-2 text-[var(--text-title)] font-bold tabular-nums text-brand-text">
            {formatPrice(summary.commissionCents)}
          </p>
          <p className="text-[var(--text-small)] font-semibold text-brand-text-muted">
            Comissao 50%
          </p>
        </motion.div>
      </div>

      {/* Completed list */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle size={18} className="text-success" />
          <h2 className="font-display text-[var(--text-body)] font-bold text-brand-text">
            Atendimentos Concluidos ({completed.length})
          </h2>
        </div>

        {completed.length === 0 ? (
          <p className="text-[var(--text-small)] text-brand-text-muted text-center py-8">
            Nenhum atendimento concluido ainda
          </p>
        ) : (
          <div className="space-y-2">
            {completed.map((slot, i) => (
              <motion.div
                key={slot.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, ease, delay: i * 0.04 }}
                className="glass rounded-[var(--radius-md)] p-3 flex items-center gap-3"
              >
                <Avatar name={slot.client_name} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-[var(--text-body)] font-semibold text-brand-text truncate">
                    {slot.client_name}
                  </p>
                  <p className="text-[var(--text-small)] text-brand-text-muted">
                    {slot.service_name} — {formatDuration(slot.duration_minutes)}
                  </p>
                </div>
                <p className="shrink-0 text-[var(--text-body)] font-bold tabular-nums text-primary">
                  {formatPrice(slot.price_cents)}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
