-- =============================================================================
-- Migration: 007_game_schema.sql
-- Description: Game (Cheia de Sorte) tables — config per store, spin history.
--              Anon access for kiosk (same pattern as totem).
--              Also adds anon policies for client_charmes and charme_transactions
--              so the game kiosk can manage charmes without authentication.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 0. Ensure update_updated_at() exists (created in 005, may not be applied)
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ---------------------------------------------------------------------------
-- 1. game_configs — per-store game configuration (prizes, cost, logo)
-- ---------------------------------------------------------------------------

CREATE TABLE game_configs (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id        UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  spin_cost_cents INTEGER NOT NULL DEFAULT 500,
  prizes          JSONB NOT NULL DEFAULT '[]'::jsonb,
  logo_url        TEXT,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(store_id)
);

ALTER TABLE game_configs ENABLE ROW LEVEL SECURITY;

-- Anon can read active game config (kiosk needs it)
CREATE POLICY "game_configs_anon_select"
  ON game_configs FOR SELECT TO anon
  USING (is_active = true);

-- Authenticated gestor can manage game config
CREATE POLICY "game_configs_gestor_manage"
  ON game_configs FOR ALL TO authenticated
  USING (store_id = auth_store_id() AND auth_is_gestor())
  WITH CHECK (store_id = auth_store_id() AND auth_is_gestor());

-- Updated_at trigger
CREATE TRIGGER set_game_configs_updated_at
  BEFORE UPDATE ON game_configs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ---------------------------------------------------------------------------
-- 2. game_spins — spin/scratch history per client
-- ---------------------------------------------------------------------------

CREATE TABLE game_spins (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id   UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  client_id  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  prize_id   TEXT NOT NULL,
  game_type  TEXT NOT NULL DEFAULT 'roulette',
  spun_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_game_spins_client ON game_spins(client_id, spun_at DESC);
CREATE INDEX idx_game_spins_store ON game_spins(store_id, spun_at DESC);

ALTER TABLE game_spins ENABLE ROW LEVEL SECURITY;

-- Anon can insert spins (kiosk registers them)
CREATE POLICY "game_spins_anon_insert"
  ON game_spins FOR INSERT TO anon
  WITH CHECK (true);

-- Anon can read spins (kiosk may check recent spins)
CREATE POLICY "game_spins_anon_select"
  ON game_spins FOR SELECT TO anon
  USING (true);

-- Gestor can manage all spins in store
CREATE POLICY "game_spins_gestor_manage"
  ON game_spins FOR ALL TO authenticated
  USING (store_id = auth_store_id() AND auth_is_gestor())
  WITH CHECK (store_id = auth_store_id() AND auth_is_gestor());

-- ---------------------------------------------------------------------------
-- 3. Anon policies for client_charmes (game kiosk needs to read/write)
-- ---------------------------------------------------------------------------

-- Anon can read client charmes (kiosk shows balance)
CREATE POLICY "charmes_anon_select"
  ON client_charmes FOR SELECT TO anon
  USING (true);

-- Anon can insert new wallet (kiosk creates wallet for new clients)
CREATE POLICY "charmes_anon_insert"
  ON client_charmes FOR INSERT TO anon
  WITH CHECK (true);

-- Anon can update balance (kiosk deducts/adds charmes)
CREATE POLICY "charmes_anon_update"
  ON client_charmes FOR UPDATE TO anon
  USING (true)
  WITH CHECK (true);

-- ---------------------------------------------------------------------------
-- 4. Anon policies for charme_transactions (game kiosk logs transactions)
-- ---------------------------------------------------------------------------

-- Anon can insert charme transactions (kiosk logs earn/spend)
CREATE POLICY "charme_tx_anon_insert"
  ON charme_transactions FOR INSERT TO anon
  WITH CHECK (true);

-- Anon can read charme transactions (kiosk may show history)
CREATE POLICY "charme_tx_anon_select"
  ON charme_transactions FOR SELECT TO anon
  USING (true);

-- ---------------------------------------------------------------------------
-- 5. Anon insert on profiles (game kiosk can register new clients)
-- ---------------------------------------------------------------------------

CREATE POLICY "profiles_anon_insert"
  ON profiles FOR INSERT TO anon
  WITH CHECK (role = 'cliente');
