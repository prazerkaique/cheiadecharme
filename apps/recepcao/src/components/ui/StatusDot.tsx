import type { AppointmentStatus } from "@cheia/types";
import type { ProfessionalStatus } from "@/types/reception";

const APPOINTMENT_COLORS: Record<AppointmentStatus, string> = {
  scheduled: "bg-blue-400",
  checked_in: "bg-warning",
  waiting: "bg-warning",
  in_progress: "bg-primary",
  completed: "bg-success",
  no_show: "bg-error",
};

const PROFESSIONAL_COLORS: Record<ProfessionalStatus, string> = {
  available: "bg-success",
  busy: "bg-primary",
  "busy-queue": "bg-warning",
};

export function StatusDot({ status }: { status: AppointmentStatus | ProfessionalStatus }) {
  const color =
    status in APPOINTMENT_COLORS
      ? APPOINTMENT_COLORS[status as AppointmentStatus]
      : PROFESSIONAL_COLORS[status as ProfessionalStatus];

  return (
    <span className={`inline-block h-2.5 w-2.5 rounded-full ${color}`} />
  );
}
