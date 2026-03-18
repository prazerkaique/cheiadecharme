"use client";

import { useReceptionStore } from "@/store/reception-store";
import { ScheduleTimeline } from "./ScheduleTimeline";
import { getCurrentService, getNextAvailableTime } from "@/lib/professional-sort";
import { formatWait, formatTimeFromIso, formatDuration } from "@/lib/format";
import type { ReceptionProfessional } from "@/types/reception";

interface ProfessionalDetailCardProps {
  professional: ReceptionProfessional;
}

function ProgressBar({ elapsed, total }: { elapsed: number; total: number }) {
  const pct = Math.min(100, Math.max(0, (elapsed / total) * 100));
  return (
    <div className="h-1.5 w-full rounded-full bg-brand-border/40">
      <div
        className="h-full rounded-full bg-primary transition-all"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function ProfessionalDetailCard({ professional }: ProfessionalDetailCardProps) {
  const now = useReceptionStore((s) => s.now);
  const queue = useReceptionStore((s) => s.queue);

  const currentSlot = getCurrentService(professional);
  const nextAvail = getNextAvailableTime(professional, now);
  const completedCount = professional.completedToday;

  // Current client from queue for elapsed time
  const currentQueueItem = professional.currentClients.length > 0
    ? queue.find((q) => q.id === professional.currentClients[0])
    : null;

  const elapsedMinutes = currentQueueItem?.started_at
    ? Math.max(0, (now.getTime() - new Date(currentQueueItem.started_at).getTime()) / 60_000)
    : currentSlot?.started_at
    ? Math.max(0, (now.getTime() - new Date(currentSlot.started_at).getTime()) / 60_000)
    : 0;

  const totalMinutes = currentQueueItem?.service.duration_minutes ?? currentSlot?.duration_minutes ?? 0;

  const waitingSlots = professional.schedule?.filter(
    (s) => s.status === "scheduled" || s.status === "waiting",
  ).length ?? 0;

  return (
    <div className="flex flex-col gap-3 p-4 pt-0">
      {/* Current client */}
      {(currentQueueItem || currentSlot) && (
        <div className="rounded-[var(--radius-sm)] bg-primary/5 border border-primary/10 px-3 py-2.5">
          <p className="text-[11px] font-bold uppercase tracking-wide text-brand-text-muted">
            Atendendo agora
          </p>
          <p className="mt-1 text-[var(--text-body)] font-semibold text-brand-text truncate">
            {currentQueueItem
              ? `${currentQueueItem.client.name.split(" ").slice(0, 2).join(" ")} — ${currentQueueItem.service.name}`
              : `${currentSlot!.client_name.split(" ").slice(0, 2).join(" ")} — ${currentSlot!.service_name}`
            }
          </p>
          {totalMinutes > 0 && (
            <div className="mt-2">
              <ProgressBar elapsed={elapsedMinutes} total={totalMinutes} />
              <div className="mt-1 flex justify-between text-[11px] text-brand-text-muted">
                <span>{formatWait(currentQueueItem?.started_at ?? currentSlot?.started_at ?? null, now)}</span>
                <span>{formatDuration(totalMinutes)}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-[var(--radius-sm)] bg-white/50 px-2.5 py-2 text-center">
          <p className="text-[11px] text-brand-text-muted">Fila</p>
          <p className="text-[var(--text-body)] font-bold text-brand-text">{waitingSlots}</p>
        </div>
        <div className="rounded-[var(--radius-sm)] bg-white/50 px-2.5 py-2 text-center">
          <p className="text-[11px] text-brand-text-muted">Proximo</p>
          <p className="text-[var(--text-body)] font-bold text-brand-text">
            {nextAvail
              ? nextAvail.getTime() <= now.getTime()
                ? "Agora"
                : formatTimeFromIso(nextAvail.toISOString())
              : "—"
            }
          </p>
        </div>
        <div className="rounded-[var(--radius-sm)] bg-white/50 px-2.5 py-2 text-center">
          <p className="text-[11px] text-brand-text-muted">Feitos</p>
          <p className="text-[var(--text-body)] font-bold text-brand-text">{completedCount}</p>
        </div>
      </div>

      {/* Schedule timeline */}
      {professional.schedule && professional.schedule.length > 0 && (
        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-brand-text-muted">
            Agenda do dia
          </p>
          <div className="max-h-48 overflow-y-auto scrollbar-thin">
            <ScheduleTimeline slots={professional.schedule} />
          </div>
        </div>
      )}
    </div>
  );
}
