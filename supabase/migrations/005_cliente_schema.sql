-- =============================================================================
-- Migration: 005_cliente_schema.sql
-- Description: Client app tables — charmes wallet, charme transactions,
--              promotions. RLS using helper functions from migration 003.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Helper: get profile ID for current auth user
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION auth_profile_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM profiles WHERE auth_id = auth.uid() LIMIT 1;
$$;

-- ---------------------------------------------------------------------------
-- 1. client_charmes — wallet balance per client per store
-- ---------------------------------------------------------------------------

CREATE TABLE client_charmes (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  store_id    UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  balance     INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(client_id, store_id)
);

ALTER TABLE client_charmes ENABLE ROW LEVEL SECURITY;

-- Clients read own balance
CREATE POLICY "charmes_select_own"
  ON client_charmes FOR SELECT TO authenticated
  USING (client_id = auth_profile_id());

-- Gestor manages all in store
CREATE POLICY "charmes_gestor_manage"
  ON client_charmes FOR ALL TO authenticated
  USING (store_id = auth_store_id() AND auth_is_gestor())
  WITH CHECK (store_id = auth_store_id() AND auth_is_gestor());

-- ---------------------------------------------------------------------------
-- 2. charme_transactions — ledger of charme earn/spend
-- ---------------------------------------------------------------------------

CREATE TYPE charme_transaction_type AS ENUM (
  'earn', 'spend', 'purchase', 'refund', 'bonus'
);

CREATE TABLE charme_transactions (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  store_id      UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  amount        INTEGER NOT NULL,
  type          charme_transaction_type NOT NULL,
  reference_id  UUID,
  description   TEXT NOT NULL DEFAULT '',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_charme_tx_client ON charme_transactions(client_id, created_at DESC);

ALTER TABLE charme_transactions ENABLE ROW LEVEL SECURITY;

-- Clients read own transactions
CREATE POLICY "charme_tx_select_own"
  ON charme_transactions FOR SELECT TO authenticated
  USING (client_id = auth_profile_id());

-- Gestor manages all in store
CREATE POLICY "charme_tx_gestor_manage"
  ON charme_transactions FOR ALL TO authenticated
  USING (store_id = auth_store_id() AND auth_is_gestor())
  WITH CHECK (store_id = auth_store_id() AND auth_is_gestor());

-- ---------------------------------------------------------------------------
-- 3. promotions — store promotions visible to clients
-- ---------------------------------------------------------------------------

CREATE TABLE promotions (
  id                    UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id              UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  title                 TEXT NOT NULL,
  description           TEXT,
  image_url             TEXT,
  discount_percent      INTEGER,
  discount_amount_cents INTEGER,
  service_id            UUID REFERENCES services(id) ON DELETE SET NULL,
  starts_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
  ends_at               TIMESTAMPTZ,
  is_active             BOOLEAN NOT NULL DEFAULT true,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_promotions_active ON promotions(store_id, is_active, starts_at);

ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;

-- Anyone (anon + authenticated) can read active promotions
CREATE POLICY "promotions_read_active"
  ON promotions FOR SELECT TO anon, authenticated
  USING (is_active = true AND starts_at <= now() AND (ends_at IS NULL OR ends_at > now()));

-- Gestor manages all promotions in store
CREATE POLICY "promotions_gestor_manage"
  ON promotions FOR ALL TO authenticated
  USING (store_id = auth_store_id() AND auth_is_gestor())
  WITH CHECK (store_id = auth_store_id() AND auth_is_gestor());

-- ---------------------------------------------------------------------------
-- 4. Additional appointment policies for client app
-- ---------------------------------------------------------------------------

-- Clients can insert appointments with source = 'app'
CREATE POLICY "appointments_client_insert"
  ON appointments FOR INSERT TO authenticated
  WITH CHECK (
    client_id = auth_profile_id()
    AND source = 'app'
    AND store_id = auth_store_id()
  );

-- Clients can select own appointments
CREATE POLICY "appointments_client_select_own"
  ON appointments FOR SELECT TO authenticated
  USING (client_id = auth_profile_id());

-- ---------------------------------------------------------------------------
-- 5. Realtime publications
-- ---------------------------------------------------------------------------

ALTER PUBLICATION supabase_realtime ADD TABLE promotions;
ALTER PUBLICATION supabase_realtime ADD TABLE client_charmes;

-- ---------------------------------------------------------------------------
-- 6. Updated_at trigger for client_charmes
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_client_charmes_updated_at
  BEFORE UPDATE ON client_charmes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
