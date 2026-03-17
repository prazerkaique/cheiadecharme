-- =============================================================================
-- Seed: seed.sql
-- Description: Development / staging seed data for Cheia de Charme CRM.
--              Contains 1 organization, 1 store, 15 professionals, 20 services,
--              5 clients and 3 appointments for today.
--
-- NEXT_PUBLIC_STORE_ID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
-- =============================================================================

-- ---------------------------------------------------------------------------
-- ORGANIZATION
-- ---------------------------------------------------------------------------

INSERT INTO organizations (id, name, slug)
VALUES (
  'f0000000-0000-0000-0000-000000000001',
  'Rede Cheia de Charme',
  'rede-cheia-de-charme'
);

-- ---------------------------------------------------------------------------
-- STORE
-- ---------------------------------------------------------------------------
-- Fixed UUID used as NEXT_PUBLIC_STORE_ID in all application .env files.

INSERT INTO stores (id, organization_id, name, slug, address, phone, settings)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'f0000000-0000-0000-0000-000000000001',
  'Cheia de Charme - Copacabana',
  'cheia-de-charme-copacabana',
  'Av. Nossa Senhora de Copacabana, 500 - Copacabana, Rio de Janeiro - RJ',
  '(21) 99000-0001',
  '{"open_time": "09:00", "close_time": "19:00", "max_queue": 50, "ticket_prefix": "CCC"}'
);

-- ---------------------------------------------------------------------------
-- PROFESSIONALS (15)
-- Specialties: Cabelo, Unhas, Sobrancelha, Maquiagem, Depilação
-- ---------------------------------------------------------------------------

INSERT INTO profiles
  (id, store_id, name, role, specialty, can_parallel, is_available)
VALUES
  -- Cabelo (4)
  ('b0000000-0000-0000-0000-000000000001',
   'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'Ana Paula Ferreira', 'profissional', 'Cabelo', 1, true),

  ('b0000000-0000-0000-0000-000000000002',
   'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'Juliana Nascimento', 'profissional', 'Cabelo', 1, true),

  ('b0000000-0000-0000-0000-000000000003',
   'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'Rodrigo Mendes', 'profissional', 'Cabelo', 1, false),

  ('b0000000-0000-0000-0000-000000000004',
   'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'Camila Souza', 'profissional', 'Cabelo', 1, true),

  -- Unhas (3)
  ('b0000000-0000-0000-0000-000000000005',
   'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'Fernanda Lima', 'profissional', 'Unhas', 2, true),

  ('b0000000-0000-0000-0000-000000000006',
   'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'Bruna Oliveira', 'profissional', 'Unhas', 2, true),

  ('b0000000-0000-0000-0000-000000000007',
   'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'Patricia Costa', 'profissional', 'Unhas', 2, false),

  -- Sobrancelha (3)
  ('b0000000-0000-0000-0000-000000000008',
   'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'Larissa Alves', 'profissional', 'Sobrancelha', 1, true),

  ('b0000000-0000-0000-0000-000000000009',
   'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'Tatiane Rocha', 'profissional', 'Sobrancelha', 1, true),

  ('b0000000-0000-0000-0000-000000000010',
   'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'Monique Dias', 'profissional', 'Sobrancelha', 1, true),

  -- Maquiagem (2)
  ('b0000000-0000-0000-0000-000000000011',
   'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'Vanessa Cardoso', 'profissional', 'Maquiagem', 1, true),

  ('b0000000-0000-0000-0000-000000000012',
   'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'Isabela Martins', 'profissional', 'Maquiagem', 1, false),

  -- Depilação (3)
  ('b0000000-0000-0000-0000-000000000013',
   'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'Aline Santos', 'profissional', 'Depilação', 1, true),

  ('b0000000-0000-0000-0000-000000000014',
   'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'Renata Pereira', 'profissional', 'Depilação', 1, true),

  ('b0000000-0000-0000-0000-000000000015',
   'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'Daniela Moreira', 'profissional', 'Depilação', 1, false);

-- ---------------------------------------------------------------------------
-- SERVICES (20)
-- Prices in cents (BRL). Durations in minutes.
-- ---------------------------------------------------------------------------

INSERT INTO services
  (id, store_id, name, category, price_cents, duration_minutes, is_active)
VALUES
  -- Cabelo (6)
  ('c0000000-0000-0000-0000-000000000001',
   'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'Corte Feminino', 'Cabelo', 8000, 60, true),

  ('c0000000-0000-0000-0000-000000000002',
   'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'Corte Masculino', 'Cabelo', 5000, 40, true),

  ('c0000000-0000-0000-0000-000000000003',
   'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'Escova Progressiva', 'Cabelo', 25000, 150, true),

  ('c0000000-0000-0000-0000-000000000004',
   'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'Coloração', 'Cabelo', 18000, 120, true),

  ('c0000000-0000-0000-0000-000000000005',
   'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'Hidratação Capilar', 'Cabelo', 7000, 60, true),

  ('c0000000-0000-0000-0000-000000000006',
   'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'Escova Simples', 'Cabelo', 6000, 50, true),

  -- Unhas (4)
  ('c0000000-0000-0000-0000-000000000007',
   'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'Manicure', 'Unhas', 3500, 40, true),

  ('c0000000-0000-0000-0000-000000000008',
   'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'Pedicure', 'Unhas', 4500, 50, true),

  ('c0000000-0000-0000-0000-000000000009',
   'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'Gel nas Unhas', 'Unhas', 9000, 90, true),

  ('c0000000-0000-0000-0000-000000000010',
   'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'Nail Art', 'Unhas', 6000, 60, true),

  -- Sobrancelha (3)
  ('c0000000-0000-0000-0000-000000000011',
   'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'Design de Sobrancelha', 'Sobrancelha', 4000, 30, true),

  ('c0000000-0000-0000-0000-000000000012',
   'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'Henna de Sobrancelha', 'Sobrancelha', 5500, 45, true),

  ('c0000000-0000-0000-0000-000000000013',
   'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'Micropigmentação de Sobrancelha', 'Sobrancelha', 65000, 180, true),

  -- Maquiagem (3)
  ('c0000000-0000-0000-0000-000000000014',
   'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'Maquiagem Social', 'Maquiagem', 12000, 60, true),

  ('c0000000-0000-0000-0000-000000000015',
   'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'Maquiagem para Noiva', 'Maquiagem', 35000, 120, true),

  ('c0000000-0000-0000-0000-000000000016',
   'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'Maquiagem para Festa', 'Maquiagem', 18000, 75, true),

  -- Depilação (4)
  ('c0000000-0000-0000-0000-000000000017',
   'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'Depilação de Pernas Completa', 'Depilação', 8000, 60, true),

  ('c0000000-0000-0000-0000-000000000018',
   'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'Depilação Axilas', 'Depilação', 3000, 20, true),

  ('c0000000-0000-0000-0000-000000000019',
   'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'Depilação Buço', 'Depilação', 2500, 15, true),

  ('c0000000-0000-0000-0000-000000000020',
   'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'Depilação Virilha Completa', 'Depilação', 6500, 40, true);

-- ---------------------------------------------------------------------------
-- CLIENTS (5)
-- Walk-in clients registered via totem (no auth_id).
-- CPF format: 000.000.000-00 (fictitious, for testing only).
-- ---------------------------------------------------------------------------

INSERT INTO profiles
  (id, store_id, name, role, cpf, phone, email)
VALUES
  ('d0000000-0000-0000-0000-000000000001',
   'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'Maria das Graças Silva', 'cliente',
   '123.456.789-00', '(21) 98000-0001', 'maria.gracas@email.com'),

  ('d0000000-0000-0000-0000-000000000002',
   'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'Josefa Aparecida Gonçalves', 'cliente',
   '234.567.890-00', '(21) 98000-0002', 'josefa.aparecida@email.com'),

  ('d0000000-0000-0000-0000-000000000003',
   'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'Francisca Rodrigues Lima', 'cliente',
   '345.678.901-00', '(21) 98000-0003', 'francisca.lima@email.com'),

  ('d0000000-0000-0000-0000-000000000004',
   'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'Antônia Carvalho Nunes', 'cliente',
   '456.789.012-00', '(21) 98000-0004', 'antonia.nunes@email.com'),

  ('d0000000-0000-0000-0000-000000000005',
   'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'Elizabete Figueiredo Barros', 'cliente',
   '567.890.123-00', '(21) 98000-0005', 'elizabete.barros@email.com');

-- ---------------------------------------------------------------------------
-- APPOINTMENTS (3 for today)
-- ---------------------------------------------------------------------------
-- Appointment 1: Maria checked in, waiting for Ana Paula (Corte Feminino)
-- Appointment 2: Josefa scheduled for later today (Manicure with Fernanda)
-- Appointment 3: Francisca currently in progress (Design de Sobrancelha with Larissa)

INSERT INTO appointments (
  id,
  store_id,
  client_id,
  professional_id,
  service_id,
  status,
  scheduled_at,
  checked_in_at,
  started_at,
  completed_at,
  queue_position,
  ticket_number,
  source
)
VALUES
  -- Appointment 1: checked in, waiting in queue
  ('e0000000-0000-0000-0000-000000000001',
   'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'd0000000-0000-0000-0000-000000000001',  -- Maria das Graças
   'b0000000-0000-0000-0000-000000000001',  -- Ana Paula (Cabelo)
   'c0000000-0000-0000-0000-000000000001',  -- Corte Feminino
   'waiting',
   CURRENT_DATE + interval '10 hours',
   now(),
   NULL,
   NULL,
   1,
   'CCC-001',
   'totem'),

  -- Appointment 2: scheduled for later in the day
  ('e0000000-0000-0000-0000-000000000002',
   'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'd0000000-0000-0000-0000-000000000002',  -- Josefa Aparecida
   'b0000000-0000-0000-0000-000000000005',  -- Fernanda (Unhas)
   'c0000000-0000-0000-0000-000000000007',  -- Manicure
   'scheduled',
   CURRENT_DATE + interval '14 hours',
   NULL,
   NULL,
   NULL,
   NULL,
   'CCC-002',
   'app'),

  -- Appointment 3: currently in progress
  ('e0000000-0000-0000-0000-000000000003',
   'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'd0000000-0000-0000-0000-000000000003',  -- Francisca Rodrigues
   'b0000000-0000-0000-0000-000000000008',  -- Larissa (Sobrancelha)
   'c0000000-0000-0000-0000-000000000011',  -- Design de Sobrancelha
   'in_progress',
   CURRENT_DATE + interval '9 hours',
   CURRENT_DATE + interval '9 hours',
   now() - interval '10 minutes',
   NULL,
   NULL,
   'CCC-003',
   'totem');
