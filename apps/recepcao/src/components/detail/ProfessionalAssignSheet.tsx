"use client";

import { useReceptionStore } from "@/store/reception-store";
import { Avatar } from "../ui/Avatar";
import { StatusDot } from "../ui/StatusDot";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { getNextAvailableTime } from "@/lib/professional-sort";
import { formatTimeFromIso } from "@/lib/format";

interface ProfessionalAssignSheetProps {
  appointmentId: string;
}

const ease = [0.22, 1, 0.36, 1] as const;

export function ProfessionalAssignSheet({ appointmentId }: ProfessionalAssignSheetProps) {
  const getSortedProfessionals = useReceptionStore((s) => s.getSortedProfessionals);
  const assignProfessional = useReceptionStore((s) => s.assignProfessional);
  const setShowAssignSheet = useReceptionStore((s) => s.setShowAssignSheet);
  const queue = useReceptionStore((s) => s.queue);
  const now = useReceptionStore((s) => s.now);

  const item = queue.find((q) => q.id === appointmentId);
  const category = item?.service.category;

  const sorted = getSortedProfessionals(category);

  return (
    <div className="overlay-backdrop" onClick={() => setShowAssignSheet(false)}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease }}
        onClick={(e) => e.stopPropagation()}
        className="glass-strong mx-4 w-full max-w-md max-h-[80vh] rounded-[var(--radius-lg)] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-brand-border p-4">
          <h3 className="font-display text-[var(--text-subtitle)] font-semibold text-brand-text">
            Escolher Profissional
          </h3>
          <button
            onClick={() => setShowAssignSheet(false)}
            className="rounded-full p-1.5 text-brand-text-muted hover:bg-brand-border transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
          <div className="flex flex-col gap-2">
            {sorted.map((prof) => {
              const isMatch = prof.specialty === category;
              const nextAvail = getNextAvailableTime(prof, now);
              const waitingCount = prof.schedule?.filter(
                (s) => s.status === "scheduled" || s.status === "waiting",
              ).length ?? 0;

              return (
                <button
                  key={prof.id}
                  onClick={() => assignProfessional(appointmentId, prof.id)}
                  className={`flex items-center gap-3 rounded-[var(--radius-md)] p-3 text-left transition hover:bg-white/70 ${
                    isMatch ? "glass" : "bg-white/30"
                  }`}
                >
                  <Avatar name={prof.name} url={prof.avatar_url} size="sm" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-[var(--text-body)] font-semibold text-brand-text">
                        {prof.name}
                      </span>
                      <StatusDot status={prof.status} />
                    </div>
                    <p className="text-[var(--text-small)] text-brand-text-muted">
                      {prof.specialty}
                      {isMatch && " — Especialidade"}
                    </p>
                    <div className="mt-0.5 flex items-center gap-3 text-[10px] text-brand-text-muted">
                      {waitingCount > 0 && (
                        <span>{waitingCount} na fila</span>
                      )}
                      {nextAvail && (
                        <span>
                          {nextAvail.getTime() <= now.getTime()
                            ? "Disponivel agora"
                            : `Livre ${formatTimeFromIso(nextAvail.toISOString())}`
                          }
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
