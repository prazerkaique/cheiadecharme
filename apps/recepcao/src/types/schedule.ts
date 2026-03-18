export type ScheduleSlotStatus = "completed" | "in_progress" | "waiting" | "scheduled";

export interface ScheduleSlot {
  id: string;
  scheduled_at: string;
  estimated_end_at: string;
  client_name: string;
  client_id: string;
  service_name: string;
  service_category: string;
  duration_minutes: number;
  status: ScheduleSlotStatus;
  started_at: string | null;
  completed_at: string | null;
  appointment_id: string | null;
}

export type SuggestionReason =
  | "specialty_match"
  | "available_now"
  | "low_queue"
  | "earliest_available"
  | "fewest_completed";

export interface ProfessionalSuggestionResult {
  professional_id: string;
  professional_name: string;
  reasons: SuggestionReason[];
  score: number;
  next_available_at: string | null;
  queue_count: number;
  completed_today: number;
}
