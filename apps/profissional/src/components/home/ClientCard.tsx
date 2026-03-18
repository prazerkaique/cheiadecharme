"use client";

import { motion } from "framer-motion";
import { Clock, Play } from "lucide-react";
import type { ScheduleSlot } from "@/types/professional";
import { Avatar } from "@/components/ui/Avatar";
import { formatTimeFromIso, formatDuration } from "@/lib/format";
import { useProfessionalStore } from "@/store/professional-store";

const ease = [0.22, 1, 0.36, 1] as const;

interface ClientCardProps {
  slot: ScheduleSlot;
  index: number;
}

export function ClientCard({ slot, index }: ClientCardProps) {
  const goToTicket = useProfessionalStore((s) => s.goToTicket);

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease, delay: index * 0.05 }}
      className="glass rounded-[var(--radius-md)] p-4 flex items-center gap-3"
    >
      <Avatar name={slot.client_name} size="md" />

      <div className="flex-1 min-w-0">
        <p className="text-[var(--text-body)] font-semibold text-brand-text truncate">
          {slot.client_name}
        </p>
        <p className="text-[var(--text-small)] text-brand-text-muted truncate">
          {slot.service_name}
        </p>
        <div className="mt-1 flex items-center gap-2 text-[var(--text-small)] text-brand-text-muted">
          <Clock size={12} />
          <span>{formatTimeFromIso(slot.scheduled_at)}</span>
          <span>·</span>
          <span>{formatDuration(slot.duration_minutes)}</span>
        </div>
      </div>

      <button
        onClick={() => goToTicket(slot.id)}
        className="shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-cta text-white transition hover:bg-cta-soft glow-cta"
      >
        <Play size={18} fill="white" />
      </button>
    </motion.div>
  );
}
