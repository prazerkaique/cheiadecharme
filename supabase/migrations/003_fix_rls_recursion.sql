-- =============================================================================
-- Migration: 003_fix_rls_recursion.sql
-- Description: Fix infinite recursion in RLS policies.
--              profiles RLS was querying profiles itself, causing a loop.
--              Solution: SECURITY DEFINER functions that bypass RLS.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. Create helper functions (SECURITY DEFINER = bypasses RLS)
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION auth_store_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT store_id FROM profiles WHERE auth_id = auth.uid() LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION auth_role()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM profiles WHERE auth_id = auth.uid() LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION auth_is_gestor()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE auth_id = auth.uid() AND role IN ('gestor', 'master')
  );
$$;

-- ---------------------------------------------------------------------------
-- 2. Drop ALL old policies that cause recursion
-- ---------------------------------------------------------------------------

-- profiles
DROP POLICY IF EXISTS "auth_select_own_store_profiles" ON profiles;
DROP POLICY IF EXISTS "auth_gestor_manage_profiles" ON profiles;

-- services
DROP POLICY IF EXISTS "auth_select_own_store_services" ON services;
DROP POLICY IF EXISTS "auth_gestor_manage_services" ON services;

-- professional_services
DROP POLICY IF EXISTS "auth_select_prof_services" ON professional_services;
DROP POLICY IF EXISTS "auth_gestor_manage_prof_services" ON professional_services;

-- transactions
DROP POLICY IF EXISTS "auth_select_own_store_transactions" ON transactions;
DROP POLICY IF EXISTS "auth_gestor_manage_transactions" ON transactions;

-- daily_summaries
DROP POLICY IF EXISTS "auth_select_own_store_summaries" ON daily_summaries;
DROP POLICY IF EXISTS "auth_gestor_manage_summaries" ON daily_summaries;

-- stores
DROP POLICY IF EXISTS "auth_select_own_store" ON stores;
DROP POLICY IF EXISTS "auth_gestor_update_store" ON stores;

-- appointments
DROP POLICY IF EXISTS "auth_select_own_store_appointments" ON appointments;

-- ---------------------------------------------------------------------------
-- 3. Recreate policies using helper functions (NO recursion)
-- ---------------------------------------------------------------------------

-- ── profiles ──
CREATE POLICY "profiles_select_own_store"
  ON profiles FOR SELECT TO authenticated
  USING (store_id = auth_store_id());

CREATE POLICY "profiles_gestor_manage"
  ON profiles FOR ALL TO authenticated
  USING (store_id = auth_store_id() AND auth_is_gestor())
  WITH CHECK (store_id = auth_store_id() AND auth_is_gestor());

-- ── services ──
CREATE POLICY "services_select_own_store"
  ON services FOR SELECT TO authenticated
  USING (store_id = auth_store_id());

CREATE POLICY "services_gestor_manage"
  ON services FOR ALL TO authenticated
  USING (store_id = auth_store_id() AND auth_is_gestor())
  WITH CHECK (store_id = auth_store_id() AND auth_is_gestor());

-- ── professional_services ──
CREATE POLICY "prof_services_select_own_store"
  ON professional_services FOR SELECT TO authenticated
  USING (
    professional_id IN (
      SELECT id FROM profiles WHERE store_id = auth_store_id()
    )
  );

CREATE POLICY "prof_services_gestor_manage"
  ON professional_services FOR ALL TO authenticated
  USING (
    auth_is_gestor() AND professional_id IN (
      SELECT id FROM profiles WHERE store_id = auth_store_id()
    )
  )
  WITH CHECK (
    auth_is_gestor() AND professional_id IN (
      SELECT id FROM profiles WHERE store_id = auth_store_id()
    )
  );

-- ── transactions ──
CREATE POLICY "transactions_select_own_store"
  ON transactions FOR SELECT TO authenticated
  USING (store_id = auth_store_id());

CREATE POLICY "transactions_gestor_manage"
  ON transactions FOR ALL TO authenticated
  USING (store_id = auth_store_id() AND auth_is_gestor())
  WITH CHECK (store_id = auth_store_id() AND auth_is_gestor());

-- ── daily_summaries ──
CREATE POLICY "summaries_select_own_store"
  ON daily_summaries FOR SELECT TO authenticated
  USING (store_id = auth_store_id());

CREATE POLICY "summaries_gestor_manage"
  ON daily_summaries FOR ALL TO authenticated
  USING (store_id = auth_store_id() AND auth_is_gestor())
  WITH CHECK (store_id = auth_store_id() AND auth_is_gestor());

-- ── stores ──
CREATE POLICY "stores_select_own"
  ON stores FOR SELECT TO authenticated
  USING (id = auth_store_id());

CREATE POLICY "stores_gestor_update"
  ON stores FOR UPDATE TO authenticated
  USING (id = auth_store_id() AND auth_is_gestor())
  WITH CHECK (id = auth_store_id() AND auth_is_gestor());

-- ── appointments ──
CREATE POLICY "appointments_select_own_store"
  ON appointments FOR SELECT TO authenticated
  USING (store_id = auth_store_id());
