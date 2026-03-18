-- =============================================================================
-- Migration: 002_gestor_schema.sql
-- Description: Gestor app tables — professional services, transactions,
--              daily summaries. Extends profiles and services with new columns.
--              Adds authenticated RLS policies for gestor/profissional roles.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- ALTER EXISTING TABLES
-- ---------------------------------------------------------------------------

-- profiles: commission rate, hire date, active status
ALTER TABLE profiles
  ADD COLUMN commission_rate DECIMAL(5,2) DEFAULT 50.00,
  ADD COLUMN hired_at DATE,
  ADD COLUMN is_active BOOLEAN DEFAULT true;

-- services: description and image
ALTER TABLE services
  ADD COLUMN description TEXT,
  ADD COLUMN image_url TEXT;

-- ---------------------------------------------------------------------------
-- NEW TABLES
-- ---------------------------------------------------------------------------

-- professional_services: which services each professional performs
-- with optional commission override
CREATE TABLE professional_services (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  service_id      UUID REFERENCES services(id) ON DELETE CASCADE,
  commission_rate DECIMAL(5,2),  -- NULL = use profile default
  is_active       BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT now(),
  UNIQUE(professional_id, service_id)
);

-- transactions: financial records linked to completed appointments
CREATE TABLE transactions (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id         UUID REFERENCES stores(id) ON DELETE CASCADE,
  appointment_id   UUID REFERENCES appointments(id) ON DELETE SET NULL,
  professional_id  UUID REFERENCES profiles(id) ON DELETE SET NULL,
  client_id        UUID REFERENCES profiles(id) ON DELETE SET NULL,
  service_id       UUID REFERENCES services(id) ON DELETE SET NULL,
  amount_cents     INT NOT NULL,
  commission_cents INT NOT NULL,
  payment_method   TEXT CHECK (payment_method IN ('cash','credit','debit','pix','charmes')) DEFAULT 'cash',
  status           TEXT CHECK (status IN ('pending','completed','cancelled','refunded')) DEFAULT 'completed',
  transaction_date TIMESTAMPTZ DEFAULT now(),
  notes            TEXT,
  created_at       TIMESTAMPTZ DEFAULT now()
);

-- daily_summaries: pre-computed daily aggregates per store
CREATE TABLE daily_summaries (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id           UUID REFERENCES stores(id) ON DELETE CASCADE,
  summary_date       DATE NOT NULL,
  total_revenue      INT DEFAULT 0,
  total_appointments INT DEFAULT 0,
  completed_count    INT DEFAULT 0,
  no_show_count      INT DEFAULT 0,
  avg_ticket_cents   INT DEFAULT 0,
  created_at         TIMESTAMPTZ DEFAULT now(),
  UNIQUE(store_id, summary_date)
);

-- ---------------------------------------------------------------------------
-- INDEXES
-- ---------------------------------------------------------------------------

CREATE INDEX idx_prof_services_prof ON professional_services(professional_id);
CREATE INDEX idx_prof_services_svc ON professional_services(service_id);
CREATE INDEX idx_transactions_store_date ON transactions(store_id, transaction_date);
CREATE INDEX idx_transactions_professional ON transactions(professional_id);
CREATE INDEX idx_daily_summaries_store ON daily_summaries(store_id, summary_date);

-- ---------------------------------------------------------------------------
-- ROW LEVEL SECURITY
-- ---------------------------------------------------------------------------

ALTER TABLE professional_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions          ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_summaries       ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- RLS POLICIES — authenticated roles (gestor, master, profissional)
-- ---------------------------------------------------------------------------

-- Helper: get the current user's profile
-- Usage in policies: (SELECT store_id FROM profiles WHERE auth_id = auth.uid())

-- ── profiles: authenticated users can read profiles from their store ──

CREATE POLICY "auth_select_own_store_profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    store_id IN (SELECT store_id FROM profiles WHERE auth_id = auth.uid())
  );

CREATE POLICY "auth_gestor_manage_profiles"
  ON profiles
  FOR ALL
  TO authenticated
  USING (
    store_id IN (
      SELECT store_id FROM profiles
      WHERE auth_id = auth.uid() AND role IN ('gestor', 'master')
    )
  )
  WITH CHECK (
    store_id IN (
      SELECT store_id FROM profiles
      WHERE auth_id = auth.uid() AND role IN ('gestor', 'master')
    )
  );

-- ── services: gestor/master full CRUD on own store ──

CREATE POLICY "auth_select_own_store_services"
  ON services
  FOR SELECT
  TO authenticated
  USING (
    store_id IN (SELECT store_id FROM profiles WHERE auth_id = auth.uid())
  );

CREATE POLICY "auth_gestor_manage_services"
  ON services
  FOR ALL
  TO authenticated
  USING (
    store_id IN (
      SELECT store_id FROM profiles
      WHERE auth_id = auth.uid() AND role IN ('gestor', 'master')
    )
  )
  WITH CHECK (
    store_id IN (
      SELECT store_id FROM profiles
      WHERE auth_id = auth.uid() AND role IN ('gestor', 'master')
    )
  );

-- ── professional_services ──

CREATE POLICY "auth_select_prof_services"
  ON professional_services
  FOR SELECT
  TO authenticated
  USING (
    professional_id IN (
      SELECT id FROM profiles
      WHERE store_id IN (SELECT store_id FROM profiles WHERE auth_id = auth.uid())
    )
  );

CREATE POLICY "auth_gestor_manage_prof_services"
  ON professional_services
  FOR ALL
  TO authenticated
  USING (
    professional_id IN (
      SELECT id FROM profiles
      WHERE store_id IN (
        SELECT store_id FROM profiles
        WHERE auth_id = auth.uid() AND role IN ('gestor', 'master')
      )
    )
  )
  WITH CHECK (
    professional_id IN (
      SELECT id FROM profiles
      WHERE store_id IN (
        SELECT store_id FROM profiles
        WHERE auth_id = auth.uid() AND role IN ('gestor', 'master')
      )
    )
  );

-- ── transactions ──

CREATE POLICY "auth_select_own_store_transactions"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (
    store_id IN (SELECT store_id FROM profiles WHERE auth_id = auth.uid())
  );

CREATE POLICY "auth_gestor_manage_transactions"
  ON transactions
  FOR ALL
  TO authenticated
  USING (
    store_id IN (
      SELECT store_id FROM profiles
      WHERE auth_id = auth.uid() AND role IN ('gestor', 'master')
    )
  )
  WITH CHECK (
    store_id IN (
      SELECT store_id FROM profiles
      WHERE auth_id = auth.uid() AND role IN ('gestor', 'master')
    )
  );

-- ── daily_summaries ──

CREATE POLICY "auth_select_own_store_summaries"
  ON daily_summaries
  FOR SELECT
  TO authenticated
  USING (
    store_id IN (SELECT store_id FROM profiles WHERE auth_id = auth.uid())
  );

CREATE POLICY "auth_gestor_manage_summaries"
  ON daily_summaries
  FOR ALL
  TO authenticated
  USING (
    store_id IN (
      SELECT store_id FROM profiles
      WHERE auth_id = auth.uid() AND role IN ('gestor', 'master')
    )
  )
  WITH CHECK (
    store_id IN (
      SELECT store_id FROM profiles
      WHERE auth_id = auth.uid() AND role IN ('gestor', 'master')
    )
  );

-- ── stores: authenticated can read own store, gestor can update ──

CREATE POLICY "auth_select_own_store"
  ON stores
  FOR SELECT
  TO authenticated
  USING (
    id IN (SELECT store_id FROM profiles WHERE auth_id = auth.uid())
  );

CREATE POLICY "auth_gestor_update_store"
  ON stores
  FOR UPDATE
  TO authenticated
  USING (
    id IN (
      SELECT store_id FROM profiles
      WHERE auth_id = auth.uid() AND role IN ('gestor', 'master')
    )
  )
  WITH CHECK (
    id IN (
      SELECT store_id FROM profiles
      WHERE auth_id = auth.uid() AND role IN ('gestor', 'master')
    )
  );

-- ── appointments: authenticated read own store ──

CREATE POLICY "auth_select_own_store_appointments"
  ON appointments
  FOR SELECT
  TO authenticated
  USING (
    store_id IN (SELECT store_id FROM profiles WHERE auth_id = auth.uid())
  );

-- ---------------------------------------------------------------------------
-- REALTIME
-- ---------------------------------------------------------------------------

ALTER PUBLICATION supabase_realtime ADD TABLE transactions;
ALTER PUBLICATION supabase_realtime ADD TABLE professional_services;
