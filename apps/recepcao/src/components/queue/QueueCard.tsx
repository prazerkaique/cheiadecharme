"use client";

import { useReceptionStore } from "@/store/reception-store";
import { formatWait, formatTicket } from "@/lib/format";
import { StatusDot } from "../ui/StatusDot";
import { Avatar } from "../ui/Avatar";
import type { QueueItem } from "@/types/reception";
import { motion } from "framer-motion";
import { Clock, Layers } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

function getWaitMinutes(checkedInAt: string | null, now: Date): number {
  if (!checkedInAt) return 0;
  return Math.max(0, Math.floor((now.getTime() - new Date(checkedInAt).getTime()) / 60_000));
}

const TEMP_CONFIG = [
  { min: 60, bg: "bg-gray-900", text: "text-white" },
  { min: 30, bg: "bg-red-500", text: "text-white" },
  { min: 15, bg: "bg-amber-400", text: "text-amber-900" },
  { min: 0, bg: "bg-emerald-500", text: "text-white" },
] as const;

function getTemp(minutes: number) {
  return TEMP_CONFIG.find((t) => minutes >= t.min)!;
}

interface QueueCardGroupProps {
  items: QueueItem[];
}

export function QueueCardGroup({ items }: QueueCardGroupProps) {
  const selectAppointment = useReceptionStore((s) => s.selectAppointment);
  const selectedId = useReceptionStore((s) => s.selectedAppointmentId);
  const now = useReceptionStore((s) => s.now);
  const getProfessionalName = useReceptionStore((s) => s.getProfessionalName);

  const first = items[0];
  const isMulti = items.length > 1;
  const isSelected = items.some((i) => i.id === selectedId);
  const waitMin = getWaitMinutes(first.checked_in_at, now);
  const temp = getTemp(waitMin);
  const hasWait = !!first.checked_in_at;

  return (
    <motion.button
      layout
      onClick={() => selectAppointment(first.id)}
      className={`w-full rounded-[var(--radius-md)] p-3 text-left transition ${
        isSelected
          ? "glass-strong ring-2 ring-primary/40"
          : "glass hover:bg-white/70"
      }`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease }}
    >
      <div className="flex items-start gap-3">
        <Avatar name={first.client.name} size="sm" />
        <div className="min-w-0 flex-1">
          {/* Row 1: Nome + badge temperatura */}
          <div className="flex items-center gap-2">
            <span className="truncate text-[var(--text-body)] font-semibold text-brand-text">
              {first.client.name.split(" ").slice(0, 2).join(" ")}
            </span>
            <StatusDot status={first.status} />
            {hasWait && (
              <span className={`ml-auto shrink-0 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold tabular-nums ${temp.bg} ${temp.text}`}>
                <Clock size={11} />
                {formatWait(first.checked_in_at, now)}
              </span>
            )}
          </div>

          {/* Row 2: Servicos */}
          {isMulti ? (
            <div className="mt-1.5 flex flex-col gap-1">
              {items.map((item, idx) => (
                <div key={item.id} className="flex items-center gap-2 text-[11px] text-brand-text-muted">
                  <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[9px] font-bold text-primary">
                    {idx + 1}
                  </span>
                  <span className="truncate">{item.service.name}</span>
                  <StatusDot status={item.status} />
                  <span className="ml-auto shrink-0 text-[10px]">
                    {getProfessionalName(item.professional_id).split(" ")[0]}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-1 flex items-center gap-3 text-[11px] text-brand-text-muted">
              {first.ticket_number && (
                <span className="font-bold text-primary">{formatTicket(first.ticket_number)}</span>
              )}
              <span className="truncate">{first.service.name}</span>
              <span className="ml-auto shrink-0">{getProfessionalName(first.professional_id).split(" ")[0]}</span>
            </div>
          )}

          {/* Row 3: Ticket + multi badge */}
          {isMulti && (
            <div className="mt-1.5 flex items-center gap-2 text-[11px]">
              {first.ticket_number && (
                <span className="font-bold text-primary">{formatTicket(first.ticket_number)}</span>
              )}
              <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                <Layers size={10} />
                {items.length} servicos
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.button>
  );
}
