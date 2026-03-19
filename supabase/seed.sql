-- =============================================================================
-- Seed: seed.sql
-- Description: Development / staging seed data for Cheia de Charme CRM.
--              Contains 1 organization, 1 store, 15 professionals, 20 services,
--              5 clients, 10 appointments, 2 auth users, 2 transactions,
--              6 professional-service assignments.
--
-- NEXT_PUBLIC_STORE_ID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
--
-- Test logins:
--   ana.paula@cheiadechame.com.br / 123456  (Cabelo)
--   fernanda.lima@cheiadechame.com.br / 123456  (Unhas)
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
-- GESTOR (1 store manager)
-- ---------------------------------------------------------------------------

INSERT INTO profiles
  (id, store_id, name, role, email, can_parallel, is_available, commission_rate, is_active)
VALUES
  ('b0000000-0000-0000-0000-000000000099',
   'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'Aldo', 'gestor',
   'aldo@cheiadecharme.com.br',
   0, false, 0, true);

-- ---------------------------------------------------------------------------
-- AUTH USERS (2 professionals + 1 gestor with login credentials)
-- ---------------------------------------------------------------------------
-- These entries allow signInWithPassword() in the profissional/gestor apps.
-- Email: ana.paula@cheiadechame.com.br / 123456  (Cabelo)
-- Email: fernanda.lima@cheiadechame.com.br / 123456  (Unhas)
-- Email: aldo@cheiadecharme.com.br / 123456  (Gestor)

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, created_at, updated_at,
  confirmation_token, recovery_token, email_change_token_new, email_change,
  raw_app_meta_data, raw_user_meta_data
)
VALUES
  -- Ana Paula Ferreira (Cabelo)
  ('00000000-0000-0000-0000-000000000000',
   'aa000000-0000-0000-0000-000000000001',
   'authenticated', 'authenticated',
   'ana.paula@cheiadechame.com.br',
   crypt('123456', gen_salt('bf')),
   now(), now(), now(),
   '', '', '', '',
   '{"provider": "email", "providers": ["email"]}',
   '{"name": "Ana Paula Ferreira"}'),

  -- Fernanda Lima (Unhas)
  ('00000000-0000-0000-0000-000000000000',
   'aa000000-0000-0000-0000-000000000002',
   'authenticated', 'authenticated',
   'fernanda.lima@cheiadechame.com.br',
   crypt('123456', gen_salt('bf')),
   now(), now(), now(),
   '', '', '', '',
   '{"provider": "email", "providers": ["email"]}',
   '{"name": "Fernanda Lima"}'),

  -- Aldo (Gestor)
  ('00000000-0000-0000-0000-000000000000',
   'aa000000-0000-0000-0000-000000000003',
   'authenticated', 'authenticated',
   'aldo@cheiadecharme.com.br',
   crypt('123456', gen_salt('bf')),
   now(), now(), now(),
   '', '', '', '',
   '{"provider": "email", "providers": ["email"]}',
   '{"name": "Aldo"}');

-- auth.identities (required for email/password login to work)
INSERT INTO auth.identities (
  id, user_id, provider_id, identity_data, provider,
  last_sign_in_at, created_at, updated_at
)
VALUES
  ('aa000000-0000-0000-0000-000000000001',
   'aa000000-0000-0000-0000-000000000001',
   'aa000000-0000-0000-0000-000000000001',
   jsonb_build_object('sub', 'aa000000-0000-0000-0000-000000000001', 'email', 'ana.paula@cheiadechame.com.br'),
   'email', now(), now(), now()),

  ('aa000000-0000-0000-0000-000000000002',
   'aa000000-0000-0000-0000-000000000002',
   'aa000000-0000-0000-0000-000000000002',
   jsonb_build_object('sub', 'aa000000-0000-0000-0000-000000000002', 'email', 'fernanda.lima@cheiadechame.com.br'),
   'email', now(), now(), now()),

  ('aa000000-0000-0000-0000-000000000003',
   'aa000000-0000-0000-0000-000000000003',
   'aa000000-0000-0000-0000-000000000003',
   jsonb_build_object('sub', 'aa000000-0000-0000-0000-000000000003', 'email', 'aldo@cheiadecharme.com.br'),
   'email', now(), now(), now());

-- Link auth users to their profiles
UPDATE profiles SET auth_id = 'aa000000-0000-0000-0000-000000000001'
  WHERE id = 'b0000000-0000-0000-0000-000000000001'; -- Ana Paula

UPDATE profiles SET auth_id = 'aa000000-0000-0000-0000-000000000002'
  WHERE id = 'b0000000-0000-0000-0000-000000000005'; -- Fernanda

UPDATE profiles SET auth_id = 'aa000000-0000-0000-0000-000000000003'
  WHERE id = 'b0000000-0000-0000-0000-000000000099'; -- Aldo (Gestor)

-- ---------------------------------------------------------------------------
-- APPOINTMENTS (10 for today — covers all app views)
-- ---------------------------------------------------------------------------
-- Status mix: 2 waiting, 2 scheduled, 1 in_progress, 2 checked_in,
--             2 completed, 1 no_show

INSERT INTO appointments (
  id, store_id, client_id, professional_id, service_id,
  status, scheduled_at, checked_in_at, started_at, completed_at,
  queue_position, ticket_number, source
)
VALUES
  -- 1: Maria → Ana Paula, Corte Feminino — WAITING (Recepção, TV, Profissional)
  ('e0000000-0000-0000-0000-000000000001',
   'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'd0000000-0000-0000-0000-000000000001',  -- Maria
   'b0000000-0000-0000-0000-000000000001',  -- Ana Paula (Cabelo)
   'c0000000-0000-0000-0000-000000000001',  -- Corte Feminino
   'waiting',
   CURRENT_DATE + interval '10 hours',
   now() - interval '5 minutes',
   NULL, NULL,
   1, 'CCC-001', 'totem'),

  -- 2: Josefa → Ana Paula, Hidratação — SCHEDULED (Profissional agenda)
  ('e0000000-0000-0000-0000-000000000002',
   'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'd0000000-0000-0000-0000-000000000002',  -- Josefa
   'b0000000-0000-0000-0000-000000000001',  -- Ana Paula (Cabelo)
   'c0000000-0000-0000-0000-000000000005',  -- Hidratação Capilar
   'scheduled',
   CURRENT_DATE + interval '14 hours',
   NULL, NULL, NULL,
   NULL, 'CCC-002', 'app'),

  -- 3: Francisca → Larissa, Design Sobrancelha — IN_PROGRESS (TV busy, Recepção)
  ('e0000000-0000-0000-0000-000000000003',
   'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'd0000000-0000-0000-0000-000000000003',  -- Francisca
   'b0000000-0000-0000-0000-000000000008',  -- Larissa (Sobrancelha)
   'c0000000-0000-0000-0000-000000000011',  -- Design de Sobrancelha
   'in_progress',
   CURRENT_DATE + interval '9 hours',
   CURRENT_DATE + interval '9 hours',
   now() - interval '10 minutes',
   NULL,
   NULL, 'CCC-003', 'totem'),

  -- 4: Antônia → Fernanda, Manicure — CHECKED_IN (Recepção fila, Profissional queue)
  ('e0000000-0000-0000-0000-000000000004',
   'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'd0000000-0000-0000-0000-000000000004',  -- Antônia
   'b0000000-0000-0000-0000-000000000005',  -- Fernanda (Unhas)
   'c0000000-0000-0000-0000-000000000007',  -- Manicure
   'checked_in',
   CURRENT_DATE + interval '11 hours',
   now() - interval '2 minutes',
   NULL, NULL,
   2, 'CCC-004', 'totem'),

  -- 5: Elizabete → Fernanda, Pedicure — WAITING (TV busy-queue)
  ('e0000000-0000-0000-0000-000000000005',
   'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'd0000000-0000-0000-0000-000000000005',  -- Elizabete
   'b0000000-0000-0000-0000-000000000005',  -- Fernanda (Unhas)
   'c0000000-0000-0000-0000-000000000008',  -- Pedicure
   'waiting',
   CURRENT_DATE + interval '11 hours 30 minutes',
   now() - interval '1 minute',
   NULL, NULL,
   3, 'CCC-005', 'totem'),

  -- 6: Maria → Bruna, Gel nas Unhas — SCHEDULED (Recepção agendados)
  ('e0000000-0000-0000-0000-000000000006',
   'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'd0000000-0000-0000-0000-000000000001',  -- Maria
   'b0000000-0000-0000-0000-000000000006',  -- Bruna (Unhas)
   'c0000000-0000-0000-0000-000000000009',  -- Gel nas Unhas
   'scheduled',
   CURRENT_DATE + interval '15 hours',
   NULL, NULL, NULL,
   NULL, 'CCC-006', 'web'),

  -- 7: Josefa → NULL, Escova Simples — CHECKED_IN (Recepção sem prof atribuído)
  ('e0000000-0000-0000-0000-000000000007',
   'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'd0000000-0000-0000-0000-000000000002',  -- Josefa
   NULL,                                     -- sem profissional
   'c0000000-0000-0000-0000-000000000006',  -- Escova Simples
   'checked_in',
   CURRENT_DATE + interval '12 hours',
   now() - interval '3 minutes',
   NULL, NULL,
   4, 'CCC-007', 'totem'),

  -- 8: Francisca → Ana Paula, Coloração — COMPLETED (Gestor KPIs, Histórico)
  ('e0000000-0000-0000-0000-000000000008',
   'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'd0000000-0000-0000-0000-000000000003',  -- Francisca
   'b0000000-0000-0000-0000-000000000001',  -- Ana Paula (Cabelo)
   'c0000000-0000-0000-0000-000000000004',  -- Coloração
   'completed',
   CURRENT_DATE + interval '9 hours',
   CURRENT_DATE + interval '9 hours',
   CURRENT_DATE + interval '9 hours 5 minutes',
   CURRENT_DATE + interval '11 hours',
   NULL, 'CCC-008', 'totem'),

  -- 9: Antônia → Vanessa, Maquiagem Social — COMPLETED (Gestor KPIs)
  ('e0000000-0000-0000-0000-000000000009',
   'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'd0000000-0000-0000-0000-000000000004',  -- Antônia
   'b0000000-0000-0000-0000-000000000011',  -- Vanessa (Maquiagem)
   'c0000000-0000-0000-0000-000000000014',  -- Maquiagem Social
   'completed',
   CURRENT_DATE + interval '10 hours',
   CURRENT_DATE + interval '10 hours',
   CURRENT_DATE + interval '10 hours 5 minutes',
   CURRENT_DATE + interval '11 hours',
   NULL, 'CCC-009', 'app'),

  -- 10: Elizabete → Tatiane, Henna Sobrancelha — NO_SHOW (Gestor no-show KPI)
  ('e0000000-0000-0000-0000-000000000010',
   'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'd0000000-0000-0000-0000-000000000005',  -- Elizabete
   'b0000000-0000-0000-0000-000000000009',  -- Tatiane (Sobrancelha)
   'c0000000-0000-0000-0000-000000000012',  -- Henna de Sobrancelha
   'no_show',
   CURRENT_DATE + interval '9 hours',
   NULL, NULL, NULL,
   NULL, 'CCC-010', 'whatsapp');

-- ---------------------------------------------------------------------------
-- TRANSACTIONS (2 — linked to completed appointments)
-- ---------------------------------------------------------------------------

INSERT INTO transactions (
  id, store_id, appointment_id, professional_id, client_id, service_id,
  amount_cents, commission_cents, payment_method, status, transaction_date
)
VALUES
  -- Transaction for appointment 8 (Coloração — R$180, 50% commission)
  ('f1000000-0000-0000-0000-000000000001',
   'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'e0000000-0000-0000-0000-000000000008',
   'b0000000-0000-0000-0000-000000000001',  -- Ana Paula
   'd0000000-0000-0000-0000-000000000003',  -- Francisca
   'c0000000-0000-0000-0000-000000000004',  -- Coloração
   18000, 9000, 'pix', 'completed',
   CURRENT_DATE + interval '11 hours'),

  -- Transaction for appointment 9 (Maquiagem Social — R$120, 50% commission)
  ('f1000000-0000-0000-0000-000000000002',
   'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'e0000000-0000-0000-0000-000000000009',
   'b0000000-0000-0000-0000-000000000011',  -- Vanessa
   'd0000000-0000-0000-0000-000000000004',  -- Antônia
   'c0000000-0000-0000-0000-000000000014',  -- Maquiagem Social
   12000, 6000, 'credit', 'completed',
   CURRENT_DATE + interval '11 hours');

-- ---------------------------------------------------------------------------
-- PROFESSIONAL_SERVICES (6 assignments)
-- ---------------------------------------------------------------------------
-- Maps which services each professional performs.

INSERT INTO professional_services (professional_id, service_id, commission_rate)
VALUES
  -- Ana Paula (Cabelo): Corte Feminino, Coloração, Hidratação, Escova Simples
  ('b0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', NULL),  -- Corte Feminino (default 50%)
  ('b0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000004', 55.00), -- Coloração (55%)
  ('b0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000005', NULL),  -- Hidratação
  ('b0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000006', NULL),  -- Escova Simples

  -- Fernanda (Unhas): Manicure, Pedicure
  ('b0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000007', NULL),  -- Manicure
  ('b0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000008', NULL);  -- Pedicure

-- ---------------------------------------------------------------------------
-- CLIENT CHARMES (wallets for all 5 clients)
-- ---------------------------------------------------------------------------

INSERT INTO client_charmes (id, client_id, store_id, balance)
VALUES
  ('g0000000-0000-0000-0000-000000000001',
   'd0000000-0000-0000-0000-000000000001',
   'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 350),

  ('g0000000-0000-0000-0000-000000000002',
   'd0000000-0000-0000-0000-000000000002',
   'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 120),

  ('g0000000-0000-0000-0000-000000000003',
   'd0000000-0000-0000-0000-000000000003',
   'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 500),

  ('g0000000-0000-0000-0000-000000000004',
   'd0000000-0000-0000-0000-000000000004',
   'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 80),

  ('g0000000-0000-0000-0000-000000000005',
   'd0000000-0000-0000-0000-000000000005',
   'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 200);

-- ---------------------------------------------------------------------------
-- CHARME TRANSACTIONS (sample history for Maria)
-- ---------------------------------------------------------------------------

INSERT INTO charme_transactions (id, client_id, store_id, amount, type, reference_id, description)
VALUES
  ('h0000000-0000-0000-0000-000000000001',
   'd0000000-0000-0000-0000-000000000001',
   'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   100, 'purchase', NULL, 'Compra de 100 charmes'),

  ('h0000000-0000-0000-0000-000000000002',
   'd0000000-0000-0000-0000-000000000001',
   'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   -30, 'spend', 'e0000000-0000-0000-0000-000000000008', 'Desconto no servico Coloracao'),

  ('h0000000-0000-0000-0000-000000000003',
   'd0000000-0000-0000-0000-000000000001',
   'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   50, 'bonus', NULL, 'Bonus de aniversario'),

  ('h0000000-0000-0000-0000-000000000004',
   'd0000000-0000-0000-0000-000000000001',
   'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   200, 'purchase', NULL, 'Compra de 200 charmes'),

  ('h0000000-0000-0000-0000-000000000005',
   'd0000000-0000-0000-0000-000000000001',
   'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   30, 'earn', 'e0000000-0000-0000-0000-000000000001', 'Cashback atendimento Corte Feminino');

-- ---------------------------------------------------------------------------
-- PROMOTIONS (4 active promotions)
-- ---------------------------------------------------------------------------

INSERT INTO promotions (id, store_id, title, description, discount_percent, discount_amount_cents, service_id, starts_at, ends_at, is_active)
VALUES
  ('p0000000-0000-0000-0000-000000000001',
   'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'Dia da Beleza', 'Todos os servicos de cabelo com 20% de desconto!',
   20, NULL,
   NULL,
   now() - interval '2 days', now() + interval '30 days', true),

  ('p0000000-0000-0000-0000-000000000002',
   'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'Combo Manicure + Pedicure', 'Faca manicure e pedicure e ganhe R$15 de desconto!',
   NULL, 1500,
   'c0000000-0000-0000-0000-000000000007',
   now() - interval '5 days', now() + interval '60 days', true),

  ('p0000000-0000-0000-0000-000000000003',
   'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'Charmes em Dobro', 'Compre charmes e ganhe o dobro! Promocao valida esta semana.',
   NULL, NULL,
   NULL,
   now() - interval '1 day', now() + interval '7 days', true),

  ('p0000000-0000-0000-0000-000000000004',
   'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'Sobrancelha Perfeita', 'Design de sobrancelha com 15% off para novas clientes.',
   15, NULL,
   'c0000000-0000-0000-0000-000000000011',
   now() - interval '3 days', now() + interval '45 days', true);

-- ---------------------------------------------------------------------------
-- GAME CONFIG
-- ---------------------------------------------------------------------------

INSERT INTO game_configs (store_id, spin_cost_cents, prizes, scratch_prizes, logo_url, is_active)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  500,
  '[
    {"id":"prize-1","label":"10% Desconto","type":"discount_percent","value":10,"color":"#FFFFFF","weight":20},
    {"id":"prize-2","label":"20% Desconto","type":"discount_percent","value":20,"color":"#F5B8D3","weight":12},
    {"id":"prize-3","label":"30% Desconto","type":"discount_percent","value":30,"color":"#FFFFFF","weight":6},
    {"id":"prize-4","label":"Hidratação Grátis","type":"free_service","value":0,"color":"#C2185B","weight":3},
    {"id":"prize-5","label":"Escova Grátis","type":"free_service","value":0,"color":"#FFFFFF","weight":4},
    {"id":"prize-6","label":"+10 Charmes","type":"charmes","value":10,"color":"#F5B8D3","weight":15},
    {"id":"prize-7","label":"+25 Charmes","type":"charmes","value":25,"color":"#FFFFFF","weight":10},
    {"id":"prize-8","label":"+50 Charmes","type":"charmes","value":50,"color":"#C2185B","weight":5},
    {"id":"prize-9","label":"50% Desconto","type":"discount_percent","value":50,"color":"#FFFFFF","weight":8},
    {"id":"prize-10","label":"Tente Novamente","type":"try_again","value":0,"color":"#F5B8D3","weight":15},
    {"id":"prize-11","label":"Corte Grátis","type":"free_service","value":0,"color":"#FFFFFF","weight":2},
    {"id":"prize-12","label":"+100 Charmes","type":"charmes","value":100,"color":"#C2185B","weight":3}
  ]'::jsonb,
  '[
    {"id":"scratch-1","label":"10% Desconto","type":"discount_percent","value":10,"color":"#EC4899","weight":20},
    {"id":"scratch-2","label":"20% Desconto","type":"discount_percent","value":20,"color":"#F59E0B","weight":12},
    {"id":"scratch-3","label":"R$ 10 Desconto","type":"discount_fixed","value":1000,"color":"#8B5CF6","weight":8},
    {"id":"scratch-4","label":"+15 Charmes","type":"charmes","value":15,"color":"#10B981","weight":15},
    {"id":"scratch-5","label":"+30 Charmes","type":"charmes","value":30,"color":"#3B82F6","weight":10},
    {"id":"scratch-6","label":"Escova Grátis","type":"free_service","value":0,"color":"#D94B8C","weight":4},
    {"id":"scratch-7","label":"Hidratação Grátis","type":"free_service","value":0,"color":"#C2185B","weight":3},
    {"id":"scratch-8","label":"Tente Novamente","type":"try_again","value":0,"color":"#9CA3AF","weight":18},
    {"id":"scratch-9","label":"Nada dessa vez","type":"nothing","value":0,"color":"#6B7280","weight":10}
  ]'::jsonb,
  NULL,
  true
);
