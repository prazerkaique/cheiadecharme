import type { QueueItem, ReceptionProfessional } from "@/types/reception";
import { MOCK_SCHEDULES } from "./mock-schedules";

const STORE_ID = "a1b2c3d4-e5f6-7890-abcd-ef1234567890";

// --- Helper: today at HH:MM ---
function todayAt(hours: number, minutes: number = 0): string {
  const d = new Date();
  d.setHours(hours, minutes, 0, 0);
  return d.toISOString();
}

function minutesAgo(m: number): string {
  return new Date(Date.now() - m * 60_000).toISOString();
}

// --- Professionals (15, from seed.sql) — with schedules attached ---
const RAW_PROFESSIONALS: Omit<ReceptionProfessional, "schedule" | "completedToday">[] = [
  { id: "b0000000-0000-0000-0000-000000000001", name: "Ana Paula Ferreira", avatar_url: null, specialty: "Cabelo", status: "busy", currentClients: ["e0000000-0000-0000-0000-000000000001"], queueCount: 1 },
  { id: "b0000000-0000-0000-0000-000000000002", name: "Juliana Nascimento", avatar_url: null, specialty: "Cabelo", status: "available", currentClients: [], queueCount: 0 },
  { id: "b0000000-0000-0000-0000-000000000003", name: "Rodrigo Mendes", avatar_url: null, specialty: "Cabelo", status: "busy-queue", currentClients: [], queueCount: 0 },
  { id: "b0000000-0000-0000-0000-000000000004", name: "Camila Souza", avatar_url: null, specialty: "Cabelo", status: "available", currentClients: [], queueCount: 0 },
  { id: "b0000000-0000-0000-0000-000000000005", name: "Fernanda Lima", avatar_url: null, specialty: "Unhas", status: "available", currentClients: [], queueCount: 1 },
  { id: "b0000000-0000-0000-0000-000000000006", name: "Bruna Oliveira", avatar_url: null, specialty: "Unhas", status: "busy", currentClients: ["e0000000-0000-0000-0000-000000000006"], queueCount: 0 },
  { id: "b0000000-0000-0000-0000-000000000007", name: "Patricia Costa", avatar_url: null, specialty: "Unhas", status: "busy-queue", currentClients: [], queueCount: 0 },
  { id: "b0000000-0000-0000-0000-000000000008", name: "Larissa Alves", avatar_url: null, specialty: "Sobrancelha", status: "busy", currentClients: ["e0000000-0000-0000-0000-000000000003"], queueCount: 0 },
  { id: "b0000000-0000-0000-0000-000000000009", name: "Tatiane Rocha", avatar_url: null, specialty: "Sobrancelha", status: "available", currentClients: [], queueCount: 0 },
  { id: "b0000000-0000-0000-0000-000000000010", name: "Monique Dias", avatar_url: null, specialty: "Sobrancelha", status: "available", currentClients: [], queueCount: 0 },
  { id: "b0000000-0000-0000-0000-000000000011", name: "Vanessa Cardoso", avatar_url: null, specialty: "Maquiagem", status: "available", currentClients: [], queueCount: 0 },
  { id: "b0000000-0000-0000-0000-000000000012", name: "Isabela Martins", avatar_url: null, specialty: "Maquiagem", status: "busy-queue", currentClients: [], queueCount: 0 },
  { id: "b0000000-0000-0000-0000-000000000013", name: "Aline Santos", avatar_url: null, specialty: "Depilacao", status: "available", currentClients: [], queueCount: 0 },
  { id: "b0000000-0000-0000-0000-000000000014", name: "Renata Pereira", avatar_url: null, specialty: "Depilacao", status: "available", currentClients: [], queueCount: 0 },
  { id: "b0000000-0000-0000-0000-000000000015", name: "Daniela Moreira", avatar_url: null, specialty: "Depilacao", status: "busy-queue", currentClients: [], queueCount: 0 },
];

export const MOCK_PROFESSIONALS: ReceptionProfessional[] = RAW_PROFESSIONALS.map((p) => {
  const schedule = MOCK_SCHEDULES[p.id] ?? [];
  return {
    ...p,
    completedToday: schedule.filter((s) => s.status === "completed").length,
    schedule,
  };
});

// --- Queue Items (10 appointments) ---
export const MOCK_QUEUE: QueueItem[] = [
  // 1 — Maria: waiting for Ana Paula (Corte Feminino) — from seed
  {
    id: "e0000000-0000-0000-0000-000000000001",
    client: { id: "d0000000-0000-0000-0000-000000000001", name: "Maria das Gracas Silva", phone: "(21) 98000-0001", cpf: "123.456.789-00" },
    service: { id: "c0000000-0000-0000-0000-000000000001", name: "Corte Feminino", category: "Cabelo", duration_minutes: 60, price_cents: 8000 },
    professional_id: "b0000000-0000-0000-0000-000000000001",
    status: "waiting",
    source: "totem",
    ticket_number: "CCC-001",
    queue_position: 1,
    scheduled_at: todayAt(10),
    checked_in_at: minutesAgo(25),
    started_at: null,
    completed_at: null,
  },
  // 2 — Josefa: scheduled for later (Manicure with Fernanda)
  {
    id: "e0000000-0000-0000-0000-000000000002",
    client: { id: "d0000000-0000-0000-0000-000000000002", name: "Josefa Aparecida Goncalves", phone: "(21) 98000-0002", cpf: "234.567.890-00" },
    service: { id: "c0000000-0000-0000-0000-000000000007", name: "Manicure", category: "Unhas", duration_minutes: 40, price_cents: 3500 },
    professional_id: "b0000000-0000-0000-0000-000000000005",
    status: "scheduled",
    source: "app",
    ticket_number: "CCC-002",
    queue_position: null,
    scheduled_at: todayAt(14),
    checked_in_at: null,
    started_at: null,
    completed_at: null,
  },
  // 3 — Francisca: in progress (Design de Sobrancelha with Larissa)
  {
    id: "e0000000-0000-0000-0000-000000000003",
    client: { id: "d0000000-0000-0000-0000-000000000003", name: "Francisca Rodrigues Lima", phone: "(21) 98000-0003", cpf: "345.678.901-00" },
    service: { id: "c0000000-0000-0000-0000-000000000011", name: "Design de Sobrancelha", category: "Sobrancelha", duration_minutes: 30, price_cents: 4000 },
    professional_id: "b0000000-0000-0000-0000-000000000008",
    status: "in_progress",
    source: "totem",
    ticket_number: "CCC-003",
    queue_position: null,
    scheduled_at: todayAt(9),
    checked_in_at: todayAt(9),
    started_at: minutesAgo(10),
    completed_at: null,
  },
  // 4 — Antonia: checked in (Coloracao, no professional yet)
  {
    id: "e0000000-0000-0000-0000-000000000004",
    client: { id: "d0000000-0000-0000-0000-000000000004", name: "Antonia Carvalho Nunes", phone: "(21) 98000-0004", cpf: "456.789.012-00" },
    service: { id: "c0000000-0000-0000-0000-000000000004", name: "Coloracao", category: "Cabelo", duration_minutes: 120, price_cents: 18000 },
    professional_id: null,
    status: "checked_in",
    source: "totem",
    ticket_number: "CCC-004",
    queue_position: 2,
    scheduled_at: null,
    checked_in_at: minutesAgo(12),
    started_at: null,
    completed_at: null,
  },
  // 5 — Elizabete: checked in (Pedicure, no professional)
  {
    id: "e0000000-0000-0000-0000-000000000005",
    client: { id: "d0000000-0000-0000-0000-000000000005", name: "Elizabete Figueiredo Barros", phone: "(21) 98000-0005", cpf: "567.890.123-00" },
    service: { id: "c0000000-0000-0000-0000-000000000008", name: "Pedicure", category: "Unhas", duration_minutes: 50, price_cents: 4500 },
    professional_id: null,
    status: "checked_in",
    source: "totem",
    ticket_number: "CCC-005",
    queue_position: 3,
    scheduled_at: null,
    checked_in_at: minutesAgo(8),
    started_at: null,
    completed_at: null,
  },
  // 6 — Claudia: in_progress (Gel nas Unhas with Bruna)
  {
    id: "e0000000-0000-0000-0000-000000000006",
    client: { id: "d0000000-0000-0000-0000-000000000006", name: "Claudia Ribeiro Santos", phone: "(21) 98000-0006", cpf: "678.901.234-00" },
    service: { id: "c0000000-0000-0000-0000-000000000009", name: "Gel nas Unhas", category: "Unhas", duration_minutes: 90, price_cents: 9000 },
    professional_id: "b0000000-0000-0000-0000-000000000006",
    status: "in_progress",
    source: "whatsapp",
    ticket_number: "CCC-006",
    queue_position: null,
    scheduled_at: todayAt(10, 30),
    checked_in_at: todayAt(10, 25),
    started_at: minutesAgo(35),
    completed_at: null,
  },
  // 7 — Lucia: completed earlier (Escova Simples with Camila)
  {
    id: "e0000000-0000-0000-0000-000000000007",
    client: { id: "d0000000-0000-0000-0000-000000000007", name: "Lucia Almeida Pinto", phone: "(21) 98000-0007", cpf: "789.012.345-00" },
    service: { id: "c0000000-0000-0000-0000-000000000006", name: "Escova Simples", category: "Cabelo", duration_minutes: 50, price_cents: 6000 },
    professional_id: "b0000000-0000-0000-0000-000000000004",
    status: "completed",
    source: "web",
    ticket_number: "CCC-007",
    queue_position: null,
    scheduled_at: todayAt(8),
    checked_in_at: todayAt(7, 55),
    started_at: todayAt(8, 5),
    completed_at: todayAt(8, 55),
  },
  // 8 — Teresa: no_show
  {
    id: "e0000000-0000-0000-0000-000000000008",
    client: { id: "d0000000-0000-0000-0000-000000000008", name: "Teresa Correia Martins", phone: "(21) 98000-0008", cpf: "890.123.456-00" },
    service: { id: "c0000000-0000-0000-0000-000000000014", name: "Maquiagem Social", category: "Maquiagem", duration_minutes: 60, price_cents: 12000 },
    professional_id: "b0000000-0000-0000-0000-000000000011",
    status: "no_show",
    source: "app",
    ticket_number: "CCC-008",
    queue_position: null,
    scheduled_at: todayAt(9, 30),
    checked_in_at: null,
    started_at: null,
    completed_at: null,
  },
  // 9 — Rosana: waiting (Depilacao Pernas with Aline)
  {
    id: "e0000000-0000-0000-0000-000000000009",
    client: { id: "d0000000-0000-0000-0000-000000000009", name: "Rosana Teixeira Gomes", phone: "(21) 98000-0009", cpf: "901.234.567-00" },
    service: { id: "c0000000-0000-0000-0000-000000000017", name: "Depilacao de Pernas Completa", category: "Depilacao", duration_minutes: 60, price_cents: 8000 },
    professional_id: "b0000000-0000-0000-0000-000000000013",
    status: "waiting",
    source: "totem",
    ticket_number: "CCC-009",
    queue_position: 4,
    scheduled_at: null,
    checked_in_at: minutesAgo(5),
    started_at: null,
    completed_at: null,
  },
  // 10 — Sandra: scheduled (Henna Sobrancelha with Tatiane)
  {
    id: "e0000000-0000-0000-0000-000000000010",
    client: { id: "d0000000-0000-0000-0000-000000000010", name: "Sandra Vieira Costa", phone: "(21) 98000-0010", cpf: "012.345.678-00" },
    service: { id: "c0000000-0000-0000-0000-000000000012", name: "Henna de Sobrancelha", category: "Sobrancelha", duration_minutes: 45, price_cents: 5500 },
    professional_id: "b0000000-0000-0000-0000-000000000009",
    status: "scheduled",
    source: "gestor",
    ticket_number: "CCC-010",
    queue_position: null,
    scheduled_at: todayAt(15, 30),
    checked_in_at: null,
    started_at: null,
    completed_at: null,
  },

  // === Luana — 3 servicos, 3 profissionais ===
  // 11 — Luana: checked_in (Corte Feminino with Juliana)
  {
    id: "e0000000-0000-0000-0000-000000000011",
    client: { id: "d0000000-0000-0000-0000-000000000011", name: "Luana Cristina Moraes", phone: "(21) 98000-0011", cpf: "111.222.333-00" },
    service: { id: "c0000000-0000-0000-0000-000000000001", name: "Corte Feminino", category: "Cabelo", duration_minutes: 60, price_cents: 8000 },
    professional_id: "b0000000-0000-0000-0000-000000000002",
    status: "checked_in",
    source: "totem",
    ticket_number: "CCC-011",
    queue_position: 5,
    scheduled_at: todayAt(11),
    checked_in_at: minutesAgo(15),
    started_at: null,
    completed_at: null,
  },
  // 12 — Luana: checked_in (Manicure with Fernanda)
  {
    id: "e0000000-0000-0000-0000-000000000012",
    client: { id: "d0000000-0000-0000-0000-000000000011", name: "Luana Cristina Moraes", phone: "(21) 98000-0011", cpf: "111.222.333-00" },
    service: { id: "c0000000-0000-0000-0000-000000000007", name: "Manicure", category: "Unhas", duration_minutes: 40, price_cents: 3500 },
    professional_id: "b0000000-0000-0000-0000-000000000005",
    status: "checked_in",
    source: "totem",
    ticket_number: "CCC-011",
    queue_position: 5,
    scheduled_at: todayAt(12),
    checked_in_at: minutesAgo(15),
    started_at: null,
    completed_at: null,
  },
  // 13 — Luana: checked_in (Design de Sobrancelha with Tatiane)
  {
    id: "e0000000-0000-0000-0000-000000000013",
    client: { id: "d0000000-0000-0000-0000-000000000011", name: "Luana Cristina Moraes", phone: "(21) 98000-0011", cpf: "111.222.333-00" },
    service: { id: "c0000000-0000-0000-0000-000000000011", name: "Design de Sobrancelha", category: "Sobrancelha", duration_minutes: 30, price_cents: 4000 },
    professional_id: "b0000000-0000-0000-0000-000000000009",
    status: "checked_in",
    source: "totem",
    ticket_number: "CCC-011",
    queue_position: 5,
    scheduled_at: todayAt(12, 30),
    checked_in_at: minutesAgo(15),
    started_at: null,
    completed_at: null,
  },
];
