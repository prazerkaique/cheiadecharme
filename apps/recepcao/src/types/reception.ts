import type { AppointmentStatus, AppointmentSource } from "@cheia/types";
import type { ScheduleSlot } from "./schedule";

export type QueueFilter = "all" | "waiting" | "in_progress" | "scheduled" | "completed";
export type TabId = "fila" | "profissionais" | "historico";
export type ProfessionalStatus = "available" | "busy" | "busy-queue";

export interface QueueClient {
  id: string;
  name: string;
  phone: string | null;
  cpf: string | null;
}

export interface QueueService {
  id: string;
  name: string;
  category: string;
  duration_minutes: number;
  price_cents: number;
}

export interface QueueItem {
  id: string;
  client: QueueClient;
  service: QueueService;
  professional_id: string | null;
  status: AppointmentStatus;
  source: AppointmentSource;
  ticket_number: string | null;
  queue_position: number | null;
  scheduled_at: string | null;
  checked_in_at: string | null;
  started_at: string | null;
  completed_at: string | null;
}

export interface ReceptionProfessional {
  id: string;
  name: string;
  avatar_url: string | null;
  specialty: string;
  status: ProfessionalStatus;
  currentClients: string[];
  queueCount: number;
  completedToday: number;
  schedule?: ScheduleSlot[];
}
