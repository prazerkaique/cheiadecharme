export type ProfessionalAvailability = "available" | "busy";

export type ScheduleSlotStatus = "completed" | "in_progress" | "waiting" | "scheduled";

export interface ProfessionalProfile {
  id: string;
  name: string;
  avatar_url: string | null;
  specialty: string;
  availability: ProfessionalAvailability;
  store_id: string;
}

export interface ScheduleSlot {
  id: string;
  scheduled_at: string;
  estimated_end_at: string;
  client_name: string;
  client_id: string;
  service_name: string;
  service_category: string;
  duration_minutes: number;
  price_cents: number;
  ticket_number: string | null;
  status: ScheduleSlotStatus;
  started_at: string | null;
  completed_at: string | null;
}

export interface WaitingQueueItem {
  id: string;
  client_name: string;
  client_id: string;
  service_name: string;
  service_category: string;
  duration_minutes: number;
  price_cents: number;
  ticket_number: string;
  checked_in_at: string;
}

export interface DailySummary {
  totalCents: number;
  commissionCents: number;
  completedCount: number;
  totalCount: number;
}
