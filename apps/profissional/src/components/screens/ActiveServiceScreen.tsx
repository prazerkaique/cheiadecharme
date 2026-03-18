"use client";

import { motion } from "framer-motion";
import { ArrowLeft, User, Clock, Scissors } from "lucide-react";
import { useProfessionalStore } from "@/store/professional-store";
import { Avatar } from "@/components/ui/Avatar";
import { formatDuration } from "@/lib/format";

const ease = [0.22, 1, 0.36, 1] as const;

export function ActiveServiceScreen() {
  const getActiveService = useProfessionalStore((s) => s.getActiveService);
  const now = useProfessionalStore((s) => s.now);
  const setConfirmDialog = useProfessionalStore((s) => s.setConfirmDialog);
  const goToHome = useProfessionalStore((s) => s.goToHome);

  const active = getActiveService();

  if (!active) {
    return (
      <div className="mx-auto max-w-[var(--pro-max-w)] px-4 py-6">
        <button
          onClick={goToHome}
          className="mb-6 flex items-center gap-2 text-[var(--text-body)] font-semibold text-brand-text-muted transition hover:text-brand-text"
        >
          <ArrowLeft size={20} />
          Voltar
        </button>
        <p className="text-center text-[var(--text-body)] text-brand-text-muted py-12">
          Nenhum atendimento ativo
        </p>
      </div>
    );
  }

  const startedAt = active.started_at ? new Date(active.started_at).getTime() : now.getTime();
  const elapsed = Math.max(0, now.getTime() - startedAt);
  const total = active.duration_minutes * 60_000;
  const progress = Math.min(1, elapsed / total);
  const remaining = Math.max(0, total - elapsed);
  const remainingMin = Math.ceil(remaining / 60_000);

  const elapsedMin = Math.floor(elapsed / 60_000);
  const elapsedSec = Math.floor((elapsed % 60_000) / 1000);

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

      {/* Service header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease }}
        className="glass-strong rounded-[var(--radius-xl)] p-6 glow-primary"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            <Scissors size={16} className="text-primary" />
          </div>
          <span className="text-[var(--text-small)] font-bold uppercase tracking-wide text-primary">
            Atendimento Ativo
          </span>
        </div>

        {/* Client info */}
        <div className="flex items-center gap-3 mb-5">
          <Avatar name={active.client_name} size="lg" />
          <div>
            <p className="text-[var(--text-subtitle)] font-bold text-brand-text">
              {active.client_name}
            </p>
            <p className="text-[var(--text-body)] text-brand-text-muted">
              {active.service_name}
            </p>
          </div>
        </div>

        {/* Timer */}
        <div className="text-center mb-5">
          <p className="font-display text-[48px] font-bold tabular-nums text-brand-text leading-none">
            {String(elapsedMin).padStart(2, "0")}:{String(elapsedSec).padStart(2, "0")}
          </p>
          <p className="mt-1 text-[var(--text-small)] text-brand-text-muted">
            de {formatDuration(active.duration_minutes)}
          </p>
        </div>

        {/* Progress bar */}
        <div className="h-3 overflow-hidden rounded-full bg-brand-border">
          <motion.div
            className="h-full rounded-full progress-shimmer"
            initial={{ width: 0 }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.5, ease }}
          />
        </div>

        <div className="mt-2 flex items-center justify-between text-[var(--text-small)]">
          <span className="flex items-center gap-1 text-brand-text-muted">
            <Clock size={12} />
            {remainingMin > 0 ? `${remainingMin}min restantes` : "Tempo esgotado"}
          </span>
          <span className="font-semibold tabular-nums text-primary">
            {Math.round(progress * 100)}%
          </span>
        </div>

        {/* Finish button */}
        <button
          onClick={() => setConfirmDialog({ type: "complete", slotId: active.id })}
          className="mt-6 w-full rounded-[var(--radius-md)] bg-cta py-4 text-[var(--text-body)] font-bold text-white transition hover:bg-cta-soft glow-cta"
        >
          Finalizar Atendimento
        </button>
      </motion.div>
    </div>
  );
}
