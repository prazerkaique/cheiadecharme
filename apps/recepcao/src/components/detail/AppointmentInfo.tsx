import type { QueueItem } from "@/types/reception";
import { formatPrice, formatDuration, formatTime } from "@/lib/format";
import { Calendar, Clock, Tag, Phone } from "lucide-react";

interface AppointmentInfoProps {
  item: QueueItem;
}

export function AppointmentInfo({ item }: AppointmentInfoProps) {
  const rows = [
    { icon: Tag, label: "Servico", value: item.service.name },
    { icon: Clock, label: "Duracao", value: formatDuration(item.service.duration_minutes) },
    { icon: Tag, label: "Valor", value: formatPrice(item.service.price_cents) },
    {
      icon: Calendar,
      label: "Agendado",
      value: item.scheduled_at
        ? formatTime(new Date(item.scheduled_at))
        : "Walk-in",
    },
    {
      icon: Phone,
      label: "Telefone",
      value: item.client.phone ?? "—",
    },
  ];

  return (
    <div className="flex flex-col gap-2">
      {rows.map((row) => {
        const Icon = row.icon;
        return (
          <div key={row.label} className="flex items-center gap-3">
            <Icon size={14} className="shrink-0 text-brand-text-muted" />
            <span className="text-[var(--text-small)] text-brand-text-muted w-20 shrink-0">{row.label}</span>
            <span className="text-[var(--text-body)] font-medium text-brand-text">{row.value}</span>
          </div>
        );
      })}
    </div>
  );
}
