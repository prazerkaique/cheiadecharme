import type { ProfessionalStatus } from "@/types/tv";

const STATUS_CONFIG: Record<ProfessionalStatus, { color: string; label: string }> = {
  available: { color: "bg-success", label: "Disponivel" },
  busy: { color: "bg-primary", label: "Atendendo" },
  "busy-queue": { color: "bg-warning", label: "Fila" },
};

interface StatusBadgeProps {
  status: ProfessionalStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <div className="flex items-center gap-2">
      <span className={`inline-block h-3 w-3 rounded-full ${config.color}`} />
      <span className="text-brand-text-muted" style={{ fontSize: "var(--text-small)" }}>
        {config.label}
      </span>
    </div>
  );
}
