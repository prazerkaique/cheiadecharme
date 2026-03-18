"use client";

import { useState } from "react";
import { useReceptionStore } from "@/store/reception-store";
import { Avatar } from "../ui/Avatar";
import { StatusBadge } from "../ui/StatusBadge";
import { AppointmentInfo } from "./AppointmentInfo";
import { CallButton } from "./CallButton";
import { ActionBar } from "./ActionBar";
import { ProfessionalAssignSheet } from "./ProfessionalAssignSheet";
import { ProfessionalSuggestion } from "./ProfessionalSuggestion";
import { formatWait, formatPrice, formatDuration } from "@/lib/format";
import type { QueueItem } from "@/types/reception";

function ServiceRow({
  item,
  index,
  isActive,
  onClick,
  professionalName,
}: {
  item: QueueItem;
  index: number;
  isActive: boolean;
  onClick: () => void;
  professionalName: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-[var(--radius-sm)] p-3 text-left transition ${
        isActive ? "bg-primary/10 border border-primary/20" : "bg-white/40 border border-transparent hover:bg-white/60"
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[10px] font-bold text-primary">
          {index + 1}
        </span>
        <span className="truncate text-[var(--text-body)] font-semibold text-brand-text">
          {item.service.name}
        </span>
        <StatusBadge status={item.status} />
      </div>
      <div className="mt-1 ml-7 flex items-center gap-3 text-[11px] text-brand-text-muted">
        <span>{professionalName}</span>
        <span>{formatDuration(item.service.duration_minutes)}</span>
        <span>{formatPrice(item.service.price_cents)}</span>
      </div>
    </button>
  );
}

export function ClientDetailPanel() {
  const queue = useReceptionStore((s) => s.queue);
  const selectedId = useReceptionStore((s) => s.selectedAppointmentId);
  const now = useReceptionStore((s) => s.now);
  const getProfessionalName = useReceptionStore((s) => s.getProfessionalName);
  const showAssignSheet = useReceptionStore((s) => s.showAssignSheet);
  const getClientAppointments = useReceptionStore((s) => s.getClientAppointments);
  const selectAppointment = useReceptionStore((s) => s.selectAppointment);

  const selectedItem = queue.find((q) => q.id === selectedId);
  if (!selectedItem) return null;

  const allItems = getClientAppointments(selectedItem.client.id);
  const activeItems = allItems.filter((i) => !["completed", "no_show"].includes(i.status));
  const isMulti = activeItems.length > 1;

  // The "focused" service for actions (the one selected or first active)
  const activeItem = queue.find((q) => q.id === selectedId) ?? activeItems[0];
  if (!activeItem) return null;

  const canCall =
    (activeItem.status === "checked_in" || activeItem.status === "waiting") &&
    activeItem.professional_id !== null;

  const totalCents = activeItems.reduce((acc, i) => acc + i.service.price_cents, 0);
  const totalMinutes = activeItems.reduce((acc, i) => acc + i.service.duration_minutes, 0);

  return (
    <>
      <div className="flex h-full flex-col p-4">
        {/* Client header */}
        <div className="flex items-center gap-4">
          <Avatar name={selectedItem.client.name} size="lg" />
          <div className="min-w-0 flex-1">
            <h2 className="truncate font-display text-[var(--text-title)] font-semibold text-brand-text">
              {selectedItem.client.name}
            </h2>
            <div className="mt-1 flex items-center gap-2">
              {selectedItem.ticket_number && (
                <span className="text-[var(--text-small)] font-bold text-primary">
                  {selectedItem.ticket_number}
                </span>
              )}
              <span className="inline-flex items-center rounded-full bg-brand-border/50 px-2.5 py-0.5 text-[11px] font-bold text-brand-text-muted">
                via {selectedItem.source}
              </span>
            </div>
          </div>
        </div>

        {/* Wait time */}
        {selectedItem.checked_in_at && (
          <div className="mt-4 rounded-[var(--radius-sm)] bg-warning/10 border border-warning/20 px-3 py-2">
            <p className="text-[12px] text-brand-text-muted">Tempo de espera</p>
            <p className="text-[var(--text-subtitle)] font-bold text-warning">
              {formatWait(selectedItem.checked_in_at, now)}
            </p>
          </div>
        )}

        {/* Services list */}
        {isMulti ? (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[12px] font-bold text-brand-text-muted uppercase tracking-wide">
                Servicos ({activeItems.length})
              </p>
              <p className="text-[11px] text-brand-text-muted">
                {formatDuration(totalMinutes)} · {formatPrice(totalCents)}
              </p>
            </div>
            <div className="flex flex-col gap-1.5">
              {activeItems.map((item, idx) => (
                <ServiceRow
                  key={item.id}
                  item={item}
                  index={idx}
                  isActive={item.id === selectedId}
                  onClick={() => selectAppointment(item.id)}
                  professionalName={getProfessionalName(item.professional_id)}
                />
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Single service: professional or suggestion */}
            {activeItem.professional_id === null ? (
              <div className="mt-4">
                <ProfessionalSuggestion appointmentId={activeItem.id} />
              </div>
            ) : (
              <div className="mt-4 rounded-[var(--radius-sm)] bg-primary/5 border border-primary/10 px-3 py-2">
                <p className="text-[12px] text-brand-text-muted">Profissional</p>
                <p className="text-[var(--text-body)] font-semibold text-brand-text">
                  {getProfessionalName(activeItem.professional_id)}
                </p>
              </div>
            )}
            <div className="mt-4">
              <AppointmentInfo item={activeItem} />
            </div>
          </>
        )}

        {/* Active service details (multi) */}
        {isMulti && (
          <div className="mt-3 rounded-[var(--radius-sm)] bg-primary/5 border border-primary/10 px-3 py-2">
            <p className="text-[12px] text-brand-text-muted">
              Acao para: <span className="font-semibold text-brand-text">{activeItem.service.name}</span>
            </p>
            <p className="text-[var(--text-small)] text-brand-text-muted">
              Profissional: <span className="font-semibold text-brand-text">{getProfessionalName(activeItem.professional_id)}</span>
            </p>
            <p className="mt-0.5 text-[11px] text-brand-text-muted">
              <StatusBadge status={activeItem.status} />
            </p>
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Actions */}
        <div className="mt-6 flex flex-col gap-3 pb-4">
          {canCall && <CallButton appointmentId={activeItem.id} clientName={selectedItem.client.name} />}
          <ActionBar item={activeItem} />
        </div>
      </div>

      {/* Assign Sheet */}
      {showAssignSheet && <ProfessionalAssignSheet appointmentId={activeItem.id} />}
    </>
  );
}
