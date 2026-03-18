import type { ProfessionalProfile, ScheduleSlot, WaitingQueueItem } from "@/types/professional";

function todayAt(hours: number, minutes: number): string {
  const d = new Date();
  d.setHours(hours, minutes, 0, 0);
  return d.toISOString();
}

function minutesAgo(m: number): string {
  return new Date(Date.now() - m * 60_000).toISOString();
}

export const MOCK_CREDENTIALS = {
  email: "ana.paula@cheiadechame.com.br",
  password: "123456",
};

export const MOCK_PROFESSIONAL: ProfessionalProfile = {
  id: "b0000000-0000-0000-0000-000000000001",
  name: "Ana Paula Ferreira",
  avatar_url: null,
  specialty: "Cabelo",
  availability: "busy",
  store_id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
};

export const MOCK_SCHEDULE: ScheduleSlot[] = [
  {
    id: "slot-001",
    scheduled_at: todayAt(9, 0),
    estimated_end_at: todayAt(9, 45),
    client_name: "Joana Silva",
    client_id: "cli-001",
    service_name: "Corte Feminino",
    service_category: "Cabelo",
    duration_minutes: 45,
    price_cents: 8000,
    ticket_number: "CCC-001",
    status: "completed",
    started_at: todayAt(9, 2),
    completed_at: todayAt(9, 40),
  },
  {
    id: "slot-002",
    scheduled_at: todayAt(10, 0),
    estimated_end_at: todayAt(10, 30),
    client_name: "Beatriz Moura",
    client_id: "cli-002",
    service_name: "Escova Progressiva",
    service_category: "Cabelo",
    duration_minutes: 30,
    price_cents: 6000,
    ticket_number: "CCC-002",
    status: "completed",
    started_at: todayAt(10, 0),
    completed_at: todayAt(10, 28),
  },
  {
    id: "slot-003",
    scheduled_at: todayAt(11, 0),
    estimated_end_at: todayAt(12, 0),
    client_name: "Maria das Gracas",
    client_id: "cli-003",
    service_name: "Coloracao Completa",
    service_category: "Cabelo",
    duration_minutes: 60,
    price_cents: 15000,
    ticket_number: "CCC-003",
    status: "in_progress",
    started_at: minutesAgo(25),
    completed_at: null,
  },
  {
    id: "slot-004",
    scheduled_at: todayAt(13, 0),
    estimated_end_at: todayAt(13, 45),
    client_name: "Fernanda Costa",
    client_id: "cli-004",
    service_name: "Hidratacao Profunda",
    service_category: "Cabelo",
    duration_minutes: 45,
    price_cents: 7000,
    ticket_number: "CCC-005",
    status: "scheduled",
    started_at: null,
    completed_at: null,
  },
  {
    id: "slot-005",
    scheduled_at: todayAt(14, 0),
    estimated_end_at: todayAt(14, 30),
    client_name: "Lucia Martins",
    client_id: "cli-005",
    service_name: "Corte + Escova",
    service_category: "Cabelo",
    duration_minutes: 30,
    price_cents: 9000,
    ticket_number: "CCC-006",
    status: "scheduled",
    started_at: null,
    completed_at: null,
  },
  {
    id: "slot-006",
    scheduled_at: todayAt(15, 0),
    estimated_end_at: todayAt(15, 45),
    client_name: "Carla Souza",
    client_id: "cli-006",
    service_name: "Balayage",
    service_category: "Cabelo",
    duration_minutes: 45,
    price_cents: 18000,
    ticket_number: "CCC-007",
    status: "scheduled",
    started_at: null,
    completed_at: null,
  },
];

export const MOCK_WAITING_QUEUE: WaitingQueueItem[] = [
  {
    id: "wq-001",
    client_name: "Antonia Oliveira",
    client_id: "cli-007",
    service_name: "Corte Feminino",
    service_category: "Cabelo",
    duration_minutes: 45,
    price_cents: 8000,
    ticket_number: "CCC-004",
    checked_in_at: minutesAgo(12),
  },
];
