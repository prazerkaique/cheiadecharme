"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Ticket } from "lucide-react";
import { useProfessionalStore } from "@/store/professional-store";
import { Avatar } from "@/components/ui/Avatar";
import { formatTimeFromIso, formatDuration } from "@/lib/format";

const ease = [0.22, 1, 0.36, 1] as const;

export function TicketScreen() {
  const selectedSlotId = useProfessionalStore((s) => s.selectedSlotId);
  const schedule = useProfessionalStore((s) => s.schedule);
  const ticketInput = useProfessionalStore((s) => s.ticketInput);
  const setTicketInput = useProfessionalStore((s) => s.setTicketInput);
  const submitTicket = useProfessionalStore((s) => s.submitTicket);
  const goToHome = useProfessionalStore((s) => s.goToHome);

  const slot = schedule.find((s) => s.id === selectedSlotId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitTicket();
  };

  return (
    <div className="mx-auto max-w-[var(--pro-max-w)] px-4 py-6">
      {/* Back button */}
      <button
        onClick={goToHome}
        className="mb-6 flex items-center gap-2 text-[var(--text-body)] font-semibold text-brand-text-muted transition hover:text-brand-text"
      >
        <ArrowLeft size={20} />
        Voltar
      </button>

      {/* Title */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cta/10">
          <Ticket size={24} className="text-cta" />
        </div>
        <h1 className="font-display text-[var(--text-title)] font-bold text-brand-text">
          Validar Ticket
        </h1>
      </div>

      {/* Client context */}
      {slot && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease }}
          className="glass rounded-[var(--radius-lg)] p-4 mb-6 flex items-center gap-3"
        >
          <Avatar name={slot.client_name} size="lg" />
          <div>
            <p className="text-[var(--text-body)] font-semibold text-brand-text">
              {slot.client_name}
            </p>
            <p className="text-[var(--text-small)] text-brand-text-muted">
              {slot.service_name} — {formatDuration(slot.duration_minutes)}
            </p>
            <p className="text-[var(--text-small)] text-brand-text-muted">
              Agendado: {formatTimeFromIso(slot.scheduled_at)}
            </p>
          </div>
        </motion.div>
      )}

      {/* Ticket input */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease, delay: 0.1 }}
        >
          <label className="block text-[var(--text-small)] font-bold uppercase tracking-wide text-brand-text-muted mb-2">
            Numero do ticket
          </label>
          <input
            type="text"
            value={ticketInput}
            onChange={(e) => setTicketInput(e.target.value)}
            placeholder="CCC-XXX"
            autoFocus
            className="glass-strong h-16 w-full rounded-[var(--radius-lg)] px-6 text-center font-display text-[var(--text-title)] font-bold tracking-widest text-brand-text placeholder:text-brand-text-muted/40 focus:outline-none focus:ring-2 focus:ring-cta/30"
          />
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease, delay: 0.2 }}
          type="submit"
          disabled={!ticketInput.trim()}
          className="w-full rounded-[var(--radius-md)] bg-cta py-4 text-[var(--text-body)] font-bold text-white transition hover:bg-cta-soft glow-cta disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Confirmar
        </motion.button>
      </form>
    </div>
  );
}
