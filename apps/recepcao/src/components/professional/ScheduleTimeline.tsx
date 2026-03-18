"use client";

import type { ScheduleSlot } from "@/types/schedule";
import { formatTimeFromIso, formatDuration } from "@/lib/format";

interface ScheduleTimelineProps {
  slots: ScheduleSlot[];
}

const DOT_STYLES: Record<ScheduleSlot["status"], string> = {
  completed: "bg-success",
  in_progress: "bg-primary ring-2 ring-primary/30",
  waiting: "bg-warning ring-2 ring-warning/30",
  scheduled: "bg-white border-2 border-brand-border",
};

const ROW_BG: Record<ScheduleSlot["status"], string> = {
  completed: "",
  in_progress: "bg-primary/5 border-primary/10",
  waiting: "bg-warning/5 border-warning/10",
  scheduled: "",
};

export function ScheduleTimeline({ slots }: ScheduleTimelineProps) {
  const sorted = [...slots].sort((a, b) => a.scheduled_at.localeCompare(b.scheduled_at));

  return (
    <div className="flex flex-col">
      {sorted.map((slot, i) => {
        const isLast = i === sorted.length - 1;
        const isCurrent = slot.status === "in_progress" || slot.status === "waiting";

        return (
          <div key={slot.id} className="flex gap-3">
            {/* Timeline column */}
            <div className="flex flex-col items-center">
              <div className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${DOT_STYLES[slot.status]}`} />
              {!isLast && <div className="w-px flex-1 bg-brand-border/50" />}
            </div>

            {/* Content */}
            <div
              className={`mb-2 flex-1 rounded-[var(--radius-sm)] border px-2.5 py-1.5 ${
                isCurrent ? ROW_BG[slot.status] : "border-transparent"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`text-[11px] tabular-nums ${isCurrent ? "font-bold text-brand-text" : "text-brand-text-muted"}`}>
                  {formatTimeFromIso(slot.scheduled_at)}
                </span>
                <span className={`truncate text-[12px] ${isCurrent ? "font-semibold text-brand-text" : "text-brand-text"}`}>
                  {slot.service_name}
                </span>
              </div>
              <div className="mt-0.5 flex items-center gap-2 text-[11px] text-brand-text-muted">
                <span className="truncate">{slot.client_name.split(" ").slice(0, 2).join(" ")}</span>
                <span>{formatDuration(slot.duration_minutes)}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
