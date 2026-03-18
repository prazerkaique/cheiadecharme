import type { AppointmentStatus } from "@cheia/types";
import type { ProfessionalStatus } from "@/types/reception";

const APPOINTMENT_LABELS: Record<AppointmentStatus, string> = {
  scheduled: "Agendado",
  checked_in: "Check-in",
  waiting: "Esperando",
  in_progress: "Atendendo",
  completed: "Finalizado",
  no_show: "No-show",
};

const APPOINTMENT_STYLES: Record<AppointmentStatus, string> = {
  scheduled: "bg-blue-100 text-blue-700",
  checked_in: "bg-amber-100 text-amber-700",
  waiting: "bg-amber-100 text-amber-700",
  in_progress: "bg-pink-100 text-pink-700",
  completed: "bg-emerald-100 text-emerald-700",
  no_show: "bg-red-100 text-red-700",
};

const PROFESSIONAL_LABELS: Record<ProfessionalStatus, string> = {
  available: "Disponivel",
  busy: "Atendendo",
  "busy-queue": "Indisponivel",
};

const PROFESSIONAL_STYLES: Record<ProfessionalStatus, string> = {
  available: "bg-emerald-100 text-emerald-700",
  busy: "bg-pink-100 text-pink-700",
  "busy-queue": "bg-amber-100 text-amber-700",
};

type StatusBadgeProps = {
  status: AppointmentStatus | ProfessionalStatus;
  type?: "appointment" | "professional";
};

export function StatusBadge({ status, type = "appointment" }: StatusBadgeProps) {
  const label =
    type === "professional"
      ? PROFESSIONAL_LABELS[status as ProfessionalStatus]
      : APPOINTMENT_LABELS[status as AppointmentStatus];

  const style =
    type === "professional"
      ? PROFESSIONAL_STYLES[status as ProfessionalStatus]
      : APPOINTMENT_STYLES[status as AppointmentStatus];

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold ${style}`}>
      {label}
    </span>
  );
}
