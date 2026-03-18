"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, User } from "lucide-react";
import { useClientStore } from "@/store/client-store";
import { formatRelativeDate, formatTime } from "@/lib/format";

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
      className={`glass-strong rounded-2xl p-4 ${isToday ? "pulse-glow" : ""}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs font-semibold text-cta uppercase tracking-wide">
            Proximo agendamento
          </p>
          <h3 className="text-lg font-display font-bold text-brand-text mt-1">
            {next.service_name}
          </h3>
        </div>
        {isToday && (
          <span className="px-2.5 py-1 rounded-full bg-cta/10 text-cta text-xs font-bold">
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
    </motion.div>
  );
}
