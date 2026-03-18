import { Inbox } from "lucide-react";

export function QueueEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Inbox size={40} className="text-brand-text-muted/40" />
      <p className="mt-3 text-[var(--text-body)] font-semibold text-brand-text-muted">
        Nenhum cliente na fila
      </p>
      <p className="mt-1 text-[var(--text-small)] text-brand-text-muted/70">
        Clientes aparecerao aqui apos check-in no totem
      </p>
    </div>
  );
}
