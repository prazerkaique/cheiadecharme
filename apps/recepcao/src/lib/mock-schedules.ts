import type { ScheduleSlot } from "@/types/schedule";

// --- Helper: today at HH:MM ---
function todayAt(hours: number, minutes: number = 0): string {
  const d = new Date();
  d.setHours(hours, minutes, 0, 0);
  return d.toISOString();
}

function slot(
  id: string,
  scheduledH: number,
  scheduledM: number,
  durationMin: number,
  clientName: string,
  clientId: string,
  serviceName: string,
  serviceCategory: string,
  status: ScheduleSlot["status"],
  appointmentId: string | null = null,
): ScheduleSlot {
  const scheduled_at = todayAt(scheduledH, scheduledM);
  const endH = scheduledH + Math.floor((scheduledM + durationMin) / 60);
  const endM = (scheduledM + durationMin) % 60;
  const estimated_end_at = todayAt(endH, endM);

  let started_at: string | null = null;
  let completed_at: string | null = null;
  if (status === "in_progress") started_at = scheduled_at;
  if (status === "completed") {
    started_at = scheduled_at;
    completed_at = estimated_end_at;
  }

  return {
    id,
    scheduled_at,
    estimated_end_at,
    client_name: clientName,
    client_id: clientId,
    service_name: serviceName,
    service_category: serviceCategory,
    duration_minutes: durationMin,
    status,
    started_at,
    completed_at,
    appointment_id: appointmentId,
  };
}

// professionalId → ScheduleSlot[]
// Consistent with MOCK_QUEUE appointment IDs where applicable
export const MOCK_SCHEDULES: Record<string, ScheduleSlot[]> = {
  // Ana Paula Ferreira — Cabelo (busy, serving Maria)
  "b0000000-0000-0000-0000-000000000001": [
    slot("s001-1", 8, 0, 60, "Carla Mendes", "dx01", "Corte Feminino", "Cabelo", "completed"),
    slot("s001-2", 9, 0, 45, "Renata Souza", "dx02", "Escova Progressiva", "Cabelo", "completed"),
    slot("s001-3", 10, 0, 60, "Maria das Gracas Silva", "d0000000-0000-0000-0000-000000000001", "Corte Feminino", "Cabelo", "waiting", "e0000000-0000-0000-0000-000000000001"),
    slot("s001-4", 11, 30, 90, "Patricia Vieira", "dx03", "Coloracao", "Cabelo", "scheduled"),
    slot("s001-5", 14, 0, 60, "Simone Araujo", "dx04", "Corte Feminino", "Cabelo", "scheduled"),
    slot("s001-6", 16, 0, 50, "Debora Luz", "dx05", "Escova Simples", "Cabelo", "scheduled"),
  ],

  // Juliana Nascimento — Cabelo (available, will serve Luana)
  "b0000000-0000-0000-0000-000000000002": [
    slot("s002-1", 8, 30, 50, "Amanda Lopes", "dx06", "Escova Simples", "Cabelo", "completed"),
    slot("s002-2", 9, 30, 60, "Beatriz Cunha", "dx07", "Corte Feminino", "Cabelo", "completed"),
    slot("s002-3", 11, 0, 60, "Luana Cristina Moraes", "d0000000-0000-0000-0000-000000000011", "Corte Feminino", "Cabelo", "scheduled", "e0000000-0000-0000-0000-000000000011"),
    slot("s002-4", 13, 0, 90, "Helena Costa", "dx08", "Coloracao", "Cabelo", "scheduled"),
    slot("s002-5", 15, 0, 60, "Viviane Dias", "dx09", "Corte Feminino", "Cabelo", "scheduled"),
  ],

  // Rodrigo Mendes — Cabelo (busy-queue)
  "b0000000-0000-0000-0000-000000000003": [
    slot("s003-1", 8, 0, 60, "Felipe Santos", "dx10", "Corte Masculino", "Cabelo", "completed"),
    slot("s003-2", 9, 0, 45, "Marcos Pereira", "dx11", "Corte Masculino", "Cabelo", "completed"),
    slot("s003-3", 10, 0, 60, "Bruno Almeida", "dx12", "Corte Masculino", "Cabelo", "in_progress"),
    slot("s003-4", 11, 30, 45, "Rafael Lima", "dx13", "Corte Masculino", "Cabelo", "scheduled"),
    slot("s003-5", 13, 0, 60, "Gustavo Rocha", "dx14", "Corte Masculino", "Cabelo", "scheduled"),
    slot("s003-6", 14, 30, 45, "Lucas Martins", "dx15", "Corte Masculino", "Cabelo", "scheduled"),
    slot("s003-7", 16, 0, 60, "Thiago Nunes", "dx16", "Corte Masculino", "Cabelo", "scheduled"),
  ],

  // Camila Souza — Cabelo (available)
  "b0000000-0000-0000-0000-000000000004": [
    slot("s004-1", 8, 0, 50, "Lucia Almeida Pinto", "d0000000-0000-0000-0000-000000000007", "Escova Simples", "Cabelo", "completed", "e0000000-0000-0000-0000-000000000007"),
    slot("s004-2", 9, 0, 90, "Monica Ferreira", "dx17", "Coloracao", "Cabelo", "completed"),
    slot("s004-3", 12, 0, 60, "Juliana Barros", "dx18", "Corte Feminino", "Cabelo", "scheduled"),
    slot("s004-4", 14, 0, 50, "Adriana Campos", "dx19", "Escova Simples", "Cabelo", "scheduled"),
  ],

  // Fernanda Lima — Unhas (available, queue=1)
  "b0000000-0000-0000-0000-000000000005": [
    slot("s005-1", 8, 0, 40, "Carolina Silva", "dx20", "Manicure", "Unhas", "completed"),
    slot("s005-2", 9, 0, 50, "Priscila Gomes", "dx21", "Pedicure", "Unhas", "completed"),
    slot("s005-3", 10, 0, 40, "Mariana Costa", "dx22", "Manicure", "Unhas", "completed"),
    slot("s005-4", 12, 0, 40, "Luana Cristina Moraes", "d0000000-0000-0000-0000-000000000011", "Manicure", "Unhas", "scheduled", "e0000000-0000-0000-0000-000000000012"),
    slot("s005-5", 14, 0, 40, "Josefa Aparecida Goncalves", "d0000000-0000-0000-0000-000000000002", "Manicure", "Unhas", "scheduled", "e0000000-0000-0000-0000-000000000002"),
    slot("s005-6", 15, 0, 50, "Elisa Nogueira", "dx23", "Pedicure", "Unhas", "scheduled"),
  ],

  // Bruna Oliveira — Unhas (busy, serving Claudia)
  "b0000000-0000-0000-0000-000000000006": [
    slot("s006-1", 8, 30, 40, "Leticia Moura", "dx24", "Manicure", "Unhas", "completed"),
    slot("s006-2", 9, 30, 50, "Raquel Duarte", "dx25", "Pedicure", "Unhas", "completed"),
    slot("s006-3", 10, 30, 90, "Claudia Ribeiro Santos", "d0000000-0000-0000-0000-000000000006", "Gel nas Unhas", "Unhas", "in_progress", "e0000000-0000-0000-0000-000000000006"),
    slot("s006-4", 13, 0, 40, "Sabrina Farias", "dx26", "Manicure", "Unhas", "scheduled"),
    slot("s006-5", 14, 0, 90, "Natalia Reis", "dx27", "Gel nas Unhas", "Unhas", "scheduled"),
  ],

  // Patricia Costa — Unhas (busy-queue)
  "b0000000-0000-0000-0000-000000000007": [
    slot("s007-1", 8, 0, 50, "Vanessa Lopes", "dx28", "Pedicure", "Unhas", "completed"),
    slot("s007-2", 9, 0, 40, "Cristiane Melo", "dx29", "Manicure", "Unhas", "completed"),
    slot("s007-3", 10, 0, 90, "Fabiana Teixeira", "dx30", "Gel nas Unhas", "Unhas", "in_progress"),
    slot("s007-4", 12, 0, 40, "Jaqueline Rosa", "dx31", "Manicure", "Unhas", "scheduled"),
    slot("s007-5", 13, 0, 50, "Lilian Santos", "dx32", "Pedicure", "Unhas", "scheduled"),
    slot("s007-6", 14, 30, 40, "Solange Vieira", "dx33", "Manicure", "Unhas", "scheduled"),
  ],

  // Larissa Alves — Sobrancelha (busy, serving Francisca)
  "b0000000-0000-0000-0000-000000000008": [
    slot("s008-1", 8, 0, 30, "Regina Barros", "dx34", "Design de Sobrancelha", "Sobrancelha", "completed"),
    slot("s008-2", 8, 45, 45, "Denise Cardoso", "dx35", "Henna de Sobrancelha", "Sobrancelha", "completed"),
    slot("s008-3", 9, 45, 30, "Francisca Rodrigues Lima", "d0000000-0000-0000-0000-000000000003", "Design de Sobrancelha", "Sobrancelha", "in_progress", "e0000000-0000-0000-0000-000000000003"),
    slot("s008-4", 10, 30, 45, "Marlene Ribeiro", "dx36", "Henna de Sobrancelha", "Sobrancelha", "scheduled"),
    slot("s008-5", 13, 0, 30, "Neide Alves", "dx37", "Design de Sobrancelha", "Sobrancelha", "scheduled"),
    slot("s008-6", 14, 0, 30, "Sueli Costa", "dx38", "Design de Sobrancelha", "Sobrancelha", "scheduled"),
  ],

  // Tatiane Rocha — Sobrancelha (available)
  "b0000000-0000-0000-0000-000000000009": [
    slot("s009-1", 8, 0, 30, "Eliane Nunes", "dx39", "Design de Sobrancelha", "Sobrancelha", "completed"),
    slot("s009-2", 9, 0, 45, "Catia Ferreira", "dx40", "Henna de Sobrancelha", "Sobrancelha", "completed"),
    slot("s009-3", 12, 30, 30, "Luana Cristina Moraes", "d0000000-0000-0000-0000-000000000011", "Design de Sobrancelha", "Sobrancelha", "scheduled", "e0000000-0000-0000-0000-000000000013"),
    slot("s009-4", 15, 30, 45, "Sandra Vieira Costa", "d0000000-0000-0000-0000-000000000010", "Henna de Sobrancelha", "Sobrancelha", "scheduled", "e0000000-0000-0000-0000-000000000010"),
  ],

  // Monique Dias — Sobrancelha (available)
  "b0000000-0000-0000-0000-000000000010": [
    slot("s010-1", 8, 30, 30, "Rosangela Pinto", "dx41", "Design de Sobrancelha", "Sobrancelha", "completed"),
    slot("s010-2", 9, 30, 30, "Ivone Martins", "dx42", "Design de Sobrancelha", "Sobrancelha", "completed"),
    slot("s010-3", 13, 0, 45, "Tereza Lima", "dx43", "Henna de Sobrancelha", "Sobrancelha", "scheduled"),
    slot("s010-4", 15, 0, 30, "Aparecida Gomes", "dx44", "Design de Sobrancelha", "Sobrancelha", "scheduled"),
  ],

  // Vanessa Cardoso — Maquiagem (available)
  "b0000000-0000-0000-0000-000000000011": [
    slot("s011-1", 9, 30, 60, "Teresa Correia Martins", "d0000000-0000-0000-0000-000000000008", "Maquiagem Social", "Maquiagem", "completed", "e0000000-0000-0000-0000-000000000008"),
    slot("s011-2", 14, 0, 60, "Clara Fonseca", "dx45", "Maquiagem Social", "Maquiagem", "scheduled"),
    slot("s011-3", 16, 0, 90, "Roberta Azevedo", "dx46", "Maquiagem para Noiva", "Maquiagem", "scheduled"),
    slot("s011-4", 18, 0, 60, "Fernanda Castro", "dx47", "Maquiagem Social", "Maquiagem", "scheduled"),
  ],

  // Isabela Martins — Maquiagem (busy-queue)
  "b0000000-0000-0000-0000-000000000012": [
    slot("s012-1", 8, 0, 90, "Vera Lucia Rocha", "dx48", "Maquiagem para Noiva", "Maquiagem", "completed"),
    slot("s012-2", 10, 0, 60, "Angela Dias", "dx49", "Maquiagem Social", "Maquiagem", "in_progress"),
    slot("s012-3", 11, 30, 60, "Paula Moreira", "dx50", "Maquiagem Social", "Maquiagem", "scheduled"),
    slot("s012-4", 14, 0, 90, "Marcia Souza", "dx51", "Maquiagem para Noiva", "Maquiagem", "scheduled"),
    slot("s012-5", 16, 0, 60, "Silvia Cardoso", "dx52", "Maquiagem Social", "Maquiagem", "scheduled"),
  ],

  // Aline Santos — Depilacao (available)
  "b0000000-0000-0000-0000-000000000013": [
    slot("s013-1", 8, 0, 60, "Joice Mendes", "dx53", "Depilacao de Pernas Completa", "Depilacao", "completed"),
    slot("s013-2", 9, 30, 30, "Miriam Barros", "dx54", "Depilacao Axilas", "Depilacao", "completed"),
    slot("s013-3", 10, 30, 60, "Rosana Teixeira Gomes", "d0000000-0000-0000-0000-000000000009", "Depilacao de Pernas Completa", "Depilacao", "waiting", "e0000000-0000-0000-0000-000000000009"),
    slot("s013-4", 14, 0, 30, "Tania Oliveira", "dx55", "Depilacao Axilas", "Depilacao", "scheduled"),
    slot("s013-5", 15, 0, 60, "Ines Ferreira", "dx56", "Depilacao de Pernas Completa", "Depilacao", "scheduled"),
  ],

  // Renata Pereira — Depilacao (available)
  "b0000000-0000-0000-0000-000000000014": [
    slot("s014-1", 8, 0, 30, "Selma Costa", "dx57", "Depilacao Axilas", "Depilacao", "completed"),
    slot("s014-2", 9, 0, 60, "Edna Ribeiro", "dx58", "Depilacao de Pernas Completa", "Depilacao", "completed"),
    slot("s014-3", 13, 0, 60, "Norma Lima", "dx59", "Depilacao de Pernas Completa", "Depilacao", "scheduled"),
    slot("s014-4", 15, 0, 30, "Zelia Dias", "dx60", "Depilacao Axilas", "Depilacao", "scheduled"),
  ],

  // Daniela Moreira — Depilacao (busy-queue)
  "b0000000-0000-0000-0000-000000000015": [
    slot("s015-1", 8, 0, 60, "Vania Santos", "dx61", "Depilacao de Pernas Completa", "Depilacao", "completed"),
    slot("s015-2", 9, 30, 30, "Celia Gomes", "dx62", "Depilacao Axilas", "Depilacao", "completed"),
    slot("s015-3", 10, 0, 60, "Rosa Almeida", "dx63", "Depilacao de Pernas Completa", "Depilacao", "in_progress"),
    slot("s015-4", 11, 30, 30, "Dalva Pereira", "dx64", "Depilacao Axilas", "Depilacao", "scheduled"),
    slot("s015-5", 13, 0, 60, "Neusa Martins", "dx65", "Depilacao de Pernas Completa", "Depilacao", "scheduled"),
    slot("s015-6", 14, 30, 30, "Iara Costa", "dx66", "Depilacao Axilas", "Depilacao", "scheduled"),
  ],
};
