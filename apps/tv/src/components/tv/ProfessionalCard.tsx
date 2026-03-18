import type { TVProfessional } from "@/types/tv";
import { StatusBadge } from "./StatusBadge";

interface ProfessionalCardProps {
  professional: TVProfessional;
}

export function ProfessionalCard({ professional }: ProfessionalCardProps) {
  return (
    <div className="glass flex items-center gap-3 px-4 py-3" style={{ borderRadius: "var(--radius-md)" }}>
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary font-display font-bold text-secondary-foreground"
        style={{ fontSize: "var(--text-body)" }}
      >
        {professional.name[0]}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate font-display font-semibold" style={{ fontSize: "var(--text-body)" }}>
          {professional.name}
        </span>

        <StatusBadge status={professional.status} />

        {professional.currentClient && (
          <span className="truncate text-brand-text-muted" style={{ fontSize: "var(--text-small)" }}>
            {professional.currentClient}
            {professional.queueCount ? ` (+${professional.queueCount} na fila)` : ""}
          </span>
        )}
      </div>
    </div>
  );
}
