import type { Profile, Service, Appointment, Promotion, CharmeTransaction, ClientCharmes } from "@cheia/types";

function todayAt(hours: number, minutes: number): string {
  const d = new Date();
  d.setHours(hours, minutes, 0, 0);
  return d.toISOString();
}

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

function daysFromNow(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString();
}

const STORE_ID = "a1b2c3d4-e5f6-7890-abcd-ef1234567890";

export const MOCK_CLIENT: Profile = {
  id: "d0000000-0000-0000-0000-000000000001",
  auth_id: null,
  store_id: STORE_ID,
  name: "Maria das Gracas Silva",
  cpf: "123.456.789-00",
  phone: "(21) 98000-0001",
  email: "maria.gracas@email.com",
  role: "cliente",
  avatar_url: null,
  specialty: null,
  can_parallel: 1,
  is_available: true,
  commission_rate: 0,
  hired_at: null,
  is_active: true,
  created_at: daysAgo(180),
};

export const MOCK_CHARMES: ClientCharmes = {
  id: "g0000000-0000-0000-0000-000000000001",
  client_id: MOCK_CLIENT.id,
  store_id: STORE_ID,
  balance: 350,
  created_at: daysAgo(90),
  updated_at: daysAgo(2),
};

export const MOCK_CHARME_TRANSACTIONS: CharmeTransaction[] = [
  {
    id: "h001",
    client_id: MOCK_CLIENT.id,
    store_id: STORE_ID,
    amount: 30,
    type: "earn",
    reference_id: null,
    description: "Cashback atendimento Corte Feminino",
    created_at: daysAgo(1),
  },
  {
    id: "h002",
    client_id: MOCK_CLIENT.id,
    store_id: STORE_ID,
    amount: -30,
    type: "spend",
    reference_id: null,
    description: "Desconto no servico Coloracao",
    created_at: daysAgo(5),
  },
  {
    id: "h003",
    client_id: MOCK_CLIENT.id,
    store_id: STORE_ID,
    amount: 200,
    type: "purchase",
    reference_id: null,
    description: "Compra de 200 charmes",
    created_at: daysAgo(10),
  },
  {
    id: "h004",
    client_id: MOCK_CLIENT.id,
    store_id: STORE_ID,
    amount: 50,
    type: "bonus",
    reference_id: null,
    description: "Bonus de aniversario",
    created_at: daysAgo(30),
  },
  {
    id: "h005",
    client_id: MOCK_CLIENT.id,
    store_id: STORE_ID,
    amount: 100,
    type: "purchase",
    reference_id: null,
    description: "Compra de 100 charmes",
    created_at: daysAgo(60),
  },
];

export const MOCK_SERVICES: Service[] = [
  { id: "s01", store_id: STORE_ID, name: "Corte Feminino", category: "Cabelo", price_cents: 8000, duration_minutes: 60, is_active: true, description: null, image_url: null, created_at: "" },
  { id: "s02", store_id: STORE_ID, name: "Corte Masculino", category: "Cabelo", price_cents: 5000, duration_minutes: 40, is_active: true, description: null, image_url: null, created_at: "" },
  { id: "s03", store_id: STORE_ID, name: "Escova Progressiva", category: "Cabelo", price_cents: 25000, duration_minutes: 150, is_active: true, description: null, image_url: null, created_at: "" },
  { id: "s04", store_id: STORE_ID, name: "Coloracao", category: "Cabelo", price_cents: 18000, duration_minutes: 120, is_active: true, description: null, image_url: null, created_at: "" },
  { id: "s05", store_id: STORE_ID, name: "Hidratacao Capilar", category: "Cabelo", price_cents: 7000, duration_minutes: 60, is_active: true, description: null, image_url: null, created_at: "" },
  { id: "s06", store_id: STORE_ID, name: "Escova Simples", category: "Cabelo", price_cents: 6000, duration_minutes: 50, is_active: true, description: null, image_url: null, created_at: "" },
  { id: "s07", store_id: STORE_ID, name: "Manicure", category: "Unhas", price_cents: 3500, duration_minutes: 40, is_active: true, description: null, image_url: null, created_at: "" },
  { id: "s08", store_id: STORE_ID, name: "Pedicure", category: "Unhas", price_cents: 4500, duration_minutes: 50, is_active: true, description: null, image_url: null, created_at: "" },
  { id: "s09", store_id: STORE_ID, name: "Gel nas Unhas", category: "Unhas", price_cents: 9000, duration_minutes: 90, is_active: true, description: null, image_url: null, created_at: "" },
  { id: "s10", store_id: STORE_ID, name: "Nail Art", category: "Unhas", price_cents: 6000, duration_minutes: 60, is_active: true, description: null, image_url: null, created_at: "" },
  { id: "s11", store_id: STORE_ID, name: "Design de Sobrancelha", category: "Sobrancelha", price_cents: 4000, duration_minutes: 30, is_active: true, description: null, image_url: null, created_at: "" },
  { id: "s12", store_id: STORE_ID, name: "Henna de Sobrancelha", category: "Sobrancelha", price_cents: 5500, duration_minutes: 45, is_active: true, description: null, image_url: null, created_at: "" },
  { id: "s13", store_id: STORE_ID, name: "Maquiagem Social", category: "Maquiagem", price_cents: 12000, duration_minutes: 60, is_active: true, description: null, image_url: null, created_at: "" },
  { id: "s14", store_id: STORE_ID, name: "Maquiagem para Noiva", category: "Maquiagem", price_cents: 35000, duration_minutes: 120, is_active: true, description: null, image_url: null, created_at: "" },
  { id: "s15", store_id: STORE_ID, name: "Depilacao Pernas Completa", category: "Depilacao", price_cents: 8000, duration_minutes: 60, is_active: true, description: null, image_url: null, created_at: "" },
  { id: "s16", store_id: STORE_ID, name: "Depilacao Axilas", category: "Depilacao", price_cents: 3000, duration_minutes: 20, is_active: true, description: null, image_url: null, created_at: "" },
];

export const MOCK_PROFESSIONALS: Profile[] = [
  { id: "p01", auth_id: null, store_id: STORE_ID, name: "Ana Paula Ferreira", cpf: null, phone: null, email: null, role: "profissional", avatar_url: null, specialty: "Cabelo", can_parallel: 1, is_available: true, commission_rate: 0.5, hired_at: null, is_active: true, created_at: "" },
  { id: "p02", auth_id: null, store_id: STORE_ID, name: "Juliana Nascimento", cpf: null, phone: null, email: null, role: "profissional", avatar_url: null, specialty: "Cabelo", can_parallel: 1, is_available: true, commission_rate: 0.5, hired_at: null, is_active: true, created_at: "" },
  { id: "p03", auth_id: null, store_id: STORE_ID, name: "Fernanda Lima", cpf: null, phone: null, email: null, role: "profissional", avatar_url: null, specialty: "Unhas", can_parallel: 2, is_available: true, commission_rate: 0.5, hired_at: null, is_active: true, created_at: "" },
  { id: "p04", auth_id: null, store_id: STORE_ID, name: "Larissa Alves", cpf: null, phone: null, email: null, role: "profissional", avatar_url: null, specialty: "Sobrancelha", can_parallel: 1, is_available: true, commission_rate: 0.5, hired_at: null, is_active: true, created_at: "" },
  { id: "p05", auth_id: null, store_id: STORE_ID, name: "Vanessa Cardoso", cpf: null, phone: null, email: null, role: "profissional", avatar_url: null, specialty: "Maquiagem", can_parallel: 1, is_available: true, commission_rate: 0.5, hired_at: null, is_active: true, created_at: "" },
  { id: "p06", auth_id: null, store_id: STORE_ID, name: "Aline Santos", cpf: null, phone: null, email: null, role: "profissional", avatar_url: null, specialty: "Depilacao", can_parallel: 1, is_available: true, commission_rate: 0.5, hired_at: null, is_active: true, created_at: "" },
];

export const MOCK_APPOINTMENTS: (Appointment & { service_name: string; professional_name: string | null; service_category: string; price_cents: number })[] = [
  {
    id: "a01", store_id: STORE_ID, client_id: MOCK_CLIENT.id,
    professional_id: "p01", service_id: "s01",
    status: "scheduled", scheduled_at: todayAt(14, 0),
    checked_in_at: null, started_at: null, completed_at: null,
    queue_position: null, ticket_number: "CCC-100", qr_code: null,
    source: "app", created_at: daysAgo(3),
    service_name: "Corte Feminino", professional_name: "Ana Paula Ferreira",
    service_category: "Cabelo", price_cents: 8000,
  },
  {
    id: "a02", store_id: STORE_ID, client_id: MOCK_CLIENT.id,
    professional_id: "p03", service_id: "s08",
    status: "scheduled", scheduled_at: daysFromNow(3) ,
    checked_in_at: null, started_at: null, completed_at: null,
    queue_position: null, ticket_number: "CCC-101", qr_code: null,
    source: "app", created_at: daysAgo(1),
    service_name: "Pedicure", professional_name: "Fernanda Lima",
    service_category: "Unhas", price_cents: 4500,
  },
  {
    id: "a03", store_id: STORE_ID, client_id: MOCK_CLIENT.id,
    professional_id: "p01", service_id: "s04",
    status: "completed", scheduled_at: daysAgo(7),
    checked_in_at: daysAgo(7), started_at: daysAgo(7), completed_at: daysAgo(7),
    queue_position: null, ticket_number: "CCC-090", qr_code: null,
    source: "app", created_at: daysAgo(10),
    service_name: "Coloracao", professional_name: "Ana Paula Ferreira",
    service_category: "Cabelo", price_cents: 18000,
  },
  {
    id: "a04", store_id: STORE_ID, client_id: MOCK_CLIENT.id,
    professional_id: "p04", service_id: "s11",
    status: "completed", scheduled_at: daysAgo(14),
    checked_in_at: daysAgo(14), started_at: daysAgo(14), completed_at: daysAgo(14),
    queue_position: null, ticket_number: "CCC-080", qr_code: null,
    source: "totem", created_at: daysAgo(14),
    service_name: "Design de Sobrancelha", professional_name: "Larissa Alves",
    service_category: "Sobrancelha", price_cents: 4000,
  },
  {
    id: "a05", store_id: STORE_ID, client_id: MOCK_CLIENT.id,
    professional_id: null, service_id: "s05",
    status: "no_show", scheduled_at: daysAgo(21),
    checked_in_at: null, started_at: null, completed_at: null,
    queue_position: null, ticket_number: "CCC-070", qr_code: null,
    source: "whatsapp", created_at: daysAgo(25),
    service_name: "Hidratacao Capilar", professional_name: null,
    service_category: "Cabelo", price_cents: 7000,
  },
];

export const MOCK_PROMOTIONS: Promotion[] = [
  {
    id: "promo01", store_id: STORE_ID,
    title: "Dia da Beleza", description: "Todos os servicos de cabelo com 20% de desconto!",
    image_url: null, discount_percent: 20, discount_amount_cents: null,
    service_id: null, starts_at: daysAgo(2), ends_at: daysFromNow(30),
    is_active: true, created_at: daysAgo(2),
  },
  {
    id: "promo02", store_id: STORE_ID,
    title: "Combo Manicure + Pedicure", description: "Faca manicure e pedicure e ganhe R$15 de desconto!",
    image_url: null, discount_percent: null, discount_amount_cents: 1500,
    service_id: "s07", starts_at: daysAgo(5), ends_at: daysFromNow(60),
    is_active: true, created_at: daysAgo(5),
  },
  {
    id: "promo03", store_id: STORE_ID,
    title: "Charmes em Dobro", description: "Compre charmes e ganhe o dobro! Promocao valida esta semana.",
    image_url: null, discount_percent: null, discount_amount_cents: null,
    service_id: null, starts_at: daysAgo(1), ends_at: daysFromNow(7),
    is_active: true, created_at: daysAgo(1),
  },
  {
    id: "promo04", store_id: STORE_ID,
    title: "Sobrancelha Perfeita", description: "Design de sobrancelha com 15% off para novas clientes.",
    image_url: null, discount_percent: 15, discount_amount_cents: null,
    service_id: "s11", starts_at: daysAgo(3), ends_at: daysFromNow(45),
    is_active: true, created_at: daysAgo(3),
  },
];
