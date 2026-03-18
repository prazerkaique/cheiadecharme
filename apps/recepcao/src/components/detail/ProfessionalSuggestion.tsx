"use client";

import { useReceptionStore } from "@/store/reception-store";
import { Avatar } from "../ui/Avatar";
import { Sparkles } from "lucide-react";
import { formatTimeFromIso } from "@/lib/format";
import type { ProfessionalSuggestionResult, SuggestionReason } from "@/types/schedule";

interface ProfessionalSuggestionProps {
  appointmentId: string;
}

const REASON_LABELS: Record<SuggestionReason, { label: string; color: string }> = {
  specialty_match: { label: "Especialidade", color: "bg-primary/10 text-primary" },
  available_now: { label: "Disponivel", color: "bg-success/10 text-success" },
  low_queue: { label: "Pouca fila", color: "bg-violet-100 text-violet-700" },
  earliest_available: { label: "Livre em breve", color: "bg-blue-100 text-blue-700" },
  fewest_completed: { label: "Menos atendimentos", color: "bg-amber-100 text-amber-700" },
};

function ReasonPill({ reason }: { reason: SuggestionReason }) {
  const config = REASON_LABELS[reason];
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${config.color}`}>
      {config.label}
    </span>
  );
}

function SuggestionRow({
  suggestion,
  isPrimary,
  onAssign,
  professionalName,
}: {
  suggestion: ProfessionalSuggestionResult;
  isPrimary: boolean;
  onAssign: () => void;
  professionalName: string;
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-[var(--radius-md)] p-3 ${
        isPrimary ? "glass border border-primary/15" : "bg-white/30"
      }`}
    >
      <Avatar name={professionalName} size={isPrimary ? "md" : "sm"} />
      <div className="min-w-0 flex-1">
        <p className={`truncate font-semibold text-brand-text ${isPrimary ? "text-[var(--text-body)]" : "text-[var(--text-small)]"}`}>
          {professionalName}
        </p>
        <div className="mt-0.5 flex flex-wrap gap-1">
          {suggestion.reasons.map((r) => (
            <ReasonPill key={r} reason={r} />
          ))}
          {suggestion.next_available_at && suggestion.reasons.includes("earliest_available") && (
            <span className="text-[10px] text-brand-text-muted">
              {formatTimeFromIso(suggestion.next_available_at)}
            </span>
          )}
          <span className="text-[10px] text-brand-text-muted">
            {suggestion.completed_today} atend.
          </span>
        </div>
      </div>
      <button
        onClick={onAssign}
        className={`shrink-0 rounded-[var(--radius-sm)] font-bold transition ${
          isPrimary
            ? "bg-cta px-3 py-1.5 text-[12px] text-white hover:bg-cta/90"
            : "bg-primary/10 px-2.5 py-1 text-[11px] text-primary hover:bg-primary/20"
        }`}
      >
        Atribuir
      </button>
    </div>
  );
}

export function ProfessionalSuggestion({ appointmentId }: ProfessionalSuggestionProps) {
  const getSuggestion = useReceptionStore((s) => s.getSuggestion);
  const assignProfessional = useReceptionStore((s) => s.assignProfessional);
  const setShowAssignSheet = useReceptionStore((s) => s.setShowAssignSheet);
  const professionals = useReceptionStore((s) => s.professionals);

  const suggestions = getSuggestion(appointmentId);
  if (suggestions.length === 0) return null;

  const getName = (id: string) =>
    professionals.find((p) => p.id === id)?.name ?? "Desconhecido";

  return (
    <div className="rounded-[var(--radius-md)] bg-primary/5 border border-primary/10 p-3">
      {/* Header */}
      <div className="mb-3 flex items-center gap-2">
        <Sparkles size={16} className="text-cta" />
        <h4 className="text-[var(--text-small)] font-bold text-brand-text">Sugestao</h4>
      </div>

      {/* Suggestions */}
      <div className="flex flex-col gap-2">
        {suggestions.map((s, i) => (
          <SuggestionRow
            key={s.professional_id}
            suggestion={s}
            isPrimary={i === 0}
            onAssign={() => assignProfessional(appointmentId, s.professional_id)}
            professionalName={getName(s.professional_id)}
          />
        ))}
      </div>

      {/* Ver todos */}
      <button
        onClick={() => setShowAssignSheet(true)}
        className="mt-2 w-full text-center text-[12px] font-semibold text-primary hover:text-primary/80 transition"
      >
        Ver todos os profissionais
      </button>
    </div>
  );
}
