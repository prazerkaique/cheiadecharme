-- =============================================================================
-- Migration: 001_initial_schema.sql
-- Description: Initial schema for Cheia de Charme CRM - Multi-tenant beauty
--              salon platform with queue management and totem support.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- TABLES
-- ---------------------------------------------------------------------------

-- organizations: top-level tenant grouping (rede de salões)
CREATE TABLE organizations (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT        NOT NULL,
  slug       TEXT        UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- stores: individual salon locations (lojas / sub-tenants)
CREATE TABLE stores (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID        REFERENCES organizations(id) ON DELETE CASCADE,
  name            TEXT        NOT NULL,
  slug            TEXT        UNIQUE NOT NULL,
  address         TEXT,
  phone           TEXT,
  settings        JSONB       DEFAULT '{}',
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- profiles: clients, professionals, managers and masters
-- auth_id is nullable so walk-in clients registered via totem
-- do not require a Supabase Auth account.
CREATE TABLE profiles (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id      UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  store_id     UUID        REFERENCES stores(id) ON DELETE CASCADE,
  name         TEXT        NOT NULL,
  cpf          TEXT,
  phone        TEXT,
  email        TEXT,
  role         TEXT        CHECK (role IN ('master','gestor','profissional','cliente')),
  avatar_url   TEXT,
  specialty    TEXT,
  can_parallel INT         DEFAULT 1,
  is_available BOOLEAN     DEFAULT false,
  created_at   TIMESTAMPTZ DEFAULT now()
);

-- services: offerings per store (serviços)
CREATE TABLE services (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id         UUID        REFERENCES stores(id) ON DELETE CASCADE,
  name             TEXT        NOT NULL,
  category         TEXT        NOT NULL,
  price_cents      INT         NOT NULL,
  duration_minutes INT         NOT NULL,
  is_active        BOOLEAN     DEFAULT true,
  created_at       TIMESTAMPTZ DEFAULT now()
);

-- appointments: scheduled and walk-in queue entries
CREATE TABLE appointments (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id        UUID        REFERENCES stores(id) ON DELETE CASCADE,
  client_id       UUID        REFERENCES profiles(id) ON DELETE SET NULL,
  professional_id UUID        REFERENCES profiles(id) ON DELETE SET NULL,
  service_id      UUID        REFERENCES services(id) ON DELETE SET NULL,
  status          TEXT        CHECK (status IN (
                                'scheduled',
                                'checked_in',
                                'waiting',
                                'in_progress',
                                'completed',
                                'no_show'
                              )),
  scheduled_at    TIMESTAMPTZ,
  checked_in_at   TIMESTAMPTZ,
  started_at      TIMESTAMPTZ,
  completed_at    TIMESTAMPTZ,
  queue_position  INT,
  ticket_number   TEXT,
  qr_code         TEXT,
  source          TEXT        CHECK (source IN (
                                'totem',
                                'app',
                                'whatsapp',
                                'web',
                                'gestor'
                              )),
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- INDEXES
-- ---------------------------------------------------------------------------

-- profiles lookups (CPF and phone used for totem client identification)
CREATE INDEX idx_profiles_cpf      ON profiles (cpf);
CREATE INDEX idx_profiles_phone    ON profiles (phone);
CREATE INDEX idx_profiles_store_id ON profiles (store_id);

-- services per store
CREATE INDEX idx_services_store_id ON services (store_id);

-- appointments: main operational queries filter by store + status
CREATE INDEX idx_appointments_store_status ON appointments (store_id, status);
CREATE INDEX idx_appointments_client_id    ON appointments (client_id);

-- ---------------------------------------------------------------------------
-- ROW LEVEL SECURITY
-- ---------------------------------------------------------------------------

ALTER TABLE organizations  ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores          ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE services        ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments    ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- RLS POLICIES — anon role (totem kiosk, unauthenticated flows)
--
-- The totem operates as an anonymous client. It must be able to:
--   - Read the current store record (to display store info on boot).
--   - Read professionals for the store (to render the selection screen).
--   - Register new walk-in clients (INSERT profile with role = 'cliente').
--   - Read active services for the store (service selection screen).
--   - Read, create and update appointments for the store (queue management).
--
-- NOTE: More restrictive, role-based policies for authenticated roles
-- (master, gestor, profissional, cliente) will be added in a subsequent
-- migration once the auth integration is finalised.
-- ---------------------------------------------------------------------------

-- stores: anon can read any store (filtered at application layer by store id)
CREATE POLICY "anon_select_stores"
  ON stores
  FOR SELECT
  TO anon
  USING (true);

-- profiles: anon can read profiles that belong to a specific store
-- (used by totem to list professionals and identify returning clients)
CREATE POLICY "anon_select_profiles"
  ON profiles
  FOR SELECT
  TO anon
  USING (true);

-- profiles: anon can register a new walk-in client via totem
CREATE POLICY "anon_insert_profiles"
  ON profiles
  FOR INSERT
  TO anon
  WITH CHECK (role = 'cliente');

-- services: anon can read active services for a store
CREATE POLICY "anon_select_services"
  ON services
  FOR SELECT
  TO anon
  USING (is_active = true);

-- appointments: anon can read all appointments for a store
-- (totem needs to display queue position and ticket status)
CREATE POLICY "anon_select_appointments"
  ON appointments
  FOR SELECT
  TO anon
  USING (true);

-- appointments: anon can create a new appointment (check-in or booking via totem)
CREATE POLICY "anon_insert_appointments"
  ON appointments
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- appointments: anon can update an appointment
-- (e.g. client scans QR code to confirm check-in, status transitions)
CREATE POLICY "anon_update_appointments"
  ON appointments
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- ---------------------------------------------------------------------------
-- REALTIME
-- Appointments table is published to the realtime channel so that the totem,
-- manager dashboard and professional app can react to queue changes instantly.
-- ---------------------------------------------------------------------------

ALTER PUBLICATION supabase_realtime ADD TABLE appointments;
