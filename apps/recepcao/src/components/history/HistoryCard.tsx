import type { QueueItem } from "@/types/reception";
import { StatusBadge } from "../ui/StatusBadge";
import { Avatar } from "../ui/Avatar";
import { formatTime } from "@/lib/format";
import { useReceptionStore } from "@/store/reception-store";

interface HistoryCardProps {
  item: QueueItem;
}

export function HistoryCard({ item }: HistoryCardProps) {
  const getProfessionalName = useReceptionStore((s) => s.getProfessionalName);

  return (
    <div className="glass rounded-[var(--radius-md)] p-3">
      <div className="flex items-center gap-3">
        <Avatar name={item.client.name} size="sm" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-[var(--text-body)] font-semibold text-brand-text">
              {item.client.name.split(" ").slice(0, 2).join(" ")}
            </span>
            <StatusBadge status={item.status} />
          </div>
          <p className="mt-0.5 text-[var(--text-small)] text-brand-text-muted">
            {item.service.name} — {getProfessionalName(item.professional_id).split(" ")[0]}
          </p>
        </div>
        <div className="shrink-0 text-right">
          {item.completed_at && (
            <p className="text-[var(--text-small)] font-medium text-brand-text-muted">
              {formatTime(new Date(item.completed_at))}
            </p>
          )}
          {item.ticket_number && (
            <p className="text-[11px] text-brand-text-muted">{item.ticket_number}</p>
          )}
        </div>
      </div>
    </div>
  );
}
