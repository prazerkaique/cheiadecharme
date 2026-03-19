"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, User, Scissors } from "lucide-react";
import { useClientStore } from "@/store/client-store";
import { formatRelativeDate, formatTime, formatCents } from "@/lib/format";

const ease = [0.22, 1, 0.36, 1] as const;

export function NextAppointmentBanner() {
  const appointments = useClientStore((s) => s.appointments);
  const upcoming = useMemo(() => {
    const now = new Date();
    return appointments
      .filter((a) => a.status === "scheduled" && a.scheduled_at && new Date(a.scheduled_at) >= now)
      .sort((a, b) => new Date(a.scheduled_at!).getTime() - new Date(b.scheduled_at!).getTime());
  }, [appointments]);
  const next = upcoming[0];

  if (!next || !next.scheduled_at) return null;

  const isToday = new Date(next.scheduled_at).toDateString() === new Date().toDateString();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease, delay: 0.1 }}
      className="relative overflow-hidden rounded-2xl border-l-4 border-cta"
      style={{
        background: "linear-gradient(135deg, rgba(236,72,153,0.08), rgba(139,92,246,0.08))",
      }}
    >
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cta to-primary flex items-center justify-center shadow-sm">
              <Scissors className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold text-cta uppercase tracking-wide">
                Proximo agendamento
              </p>
              <h3 className="text-lg font-display font-bold text-brand-text mt-0.5">
                {next.service_name}
              </h3>
            </div>
          </div>
          {isToday && (
            <span className="px-3 py-1.5 rounded-full bg-cta/15 text-cta text-xs font-bold animate-pulse shadow-sm">
              Hoje
            </span>
          )}
        </div>

        <div className="flex items-center gap-4 text-sm text-brand-text-muted">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            {formatRelativeDate(next.scheduled_at)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            {formatTime(next.scheduled_at)}
          </span>
          {next.professional_name && (
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              {next.professional_name.split(" ")[0]}
            </span>
          )}
        </div>

        {next.price_cents > 0 && (
          <div className="mt-2 text-right">
            <span className="text-sm font-bold text-cta">{formatCents(next.price_cents)}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
