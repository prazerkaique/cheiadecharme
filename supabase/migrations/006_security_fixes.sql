-- =============================================================================
-- Migration: 006_security_fixes.sql
-- Description: Fix RLS security gaps found in the multi-app audit.
--              1. Drop dangerous open policies from 001
--              2. Remove duplicate policies (001 vs 004)
--              3. Add organizations RLS
--              4. Add client-app policies (appointments insert/select)
--              5. Add stores anon select for totem/tv
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. Drop dangerous open policies from migration 001
-- ---------------------------------------------------------------------------

-- CRITICAL: anon can UPDATE any appointment with no restrictions
DROP POLICY IF EXISTS "anon_update_appointments" ON appointments;

-- CRITICAL: anon can INSERT any appointment with no restrictions (source not checked)
-- Replaced by "appointments_anon_insert" in 004 which enforces source = 'totem'
DROP POLICY IF EXISTS "anon_insert_appointments" ON appointments;

-- ---------------------------------------------------------------------------
-- 2. Drop duplicate policies (001 originals replaced by better 004 versions)
-- ---------------------------------------------------------------------------

-- "anon_select_profiles" (001, USING true) replaced by
-- "profiles_anon_select" (004, role='profissional' AND is_active)
-- + "profiles_anon_select_clients" (004, role='cliente')
DROP POLICY IF EXISTS "anon_select_profiles" ON profiles;

-- "anon_select_appointments" (001, USING true) replaced by
-- "appointments_anon_select" (004, USING true) — same but removes duplicate
DROP POLICY IF EXISTS "anon_select_appointments" ON appointments;

-- "anon_select_services" (001, is_active=true) replaced by
-- "services_anon_select" (004, is_active=true) — exact duplicate
DROP POLICY IF EXISTS "anon_select_services" ON services;

-- ---------------------------------------------------------------------------
-- 3. Organizations RLS
-- ---------------------------------------------------------------------------

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read their own organization
CREATE POLICY "organizations_select_own"
  ON organizations FOR SELECT TO authenticated
  USING (
    id IN (
      SELECT s.organization_id FROM stores s WHERE s.id = auth_store_id()
    )
  );

-- Anon can read organizations (totem/tv need store info)
CREATE POLICY "organizations_anon_select"
  ON organizations FOR SELECT TO anon
  USING (true);

-- ---------------------------------------------------------------------------
-- 4. Stores: anon SELECT (totem/tv need store settings)
-- ---------------------------------------------------------------------------

CREATE POLICY "stores_anon_select"
  ON stores FOR SELECT TO anon
  USING (true);

-- ---------------------------------------------------------------------------
-- 5. Client-app policies (authenticated clients)
-- ---------------------------------------------------------------------------

-- Clients can insert appointments via app (source = 'app')
CREATE POLICY "appointments_client_insert"
  ON appointments FOR INSERT TO authenticated
  WITH CHECK (
    auth_role() = 'cliente'
    AND client_id = auth_profile_id()
    AND source = 'app'
  );

-- Clients can read their own appointments
CREATE POLICY "appointments_client_select"
  ON appointments FOR SELECT TO authenticated
  USING (
    auth_role() = 'cliente'
    AND client_id = auth_profile_id()
  );

-- Clients can read services (for booking)
CREATE POLICY "services_client_select"
  ON services FOR SELECT TO authenticated
  USING (is_active = true);

-- Clients can read active professionals (for booking)
CREATE POLICY "profiles_client_select_professionals"
  ON profiles FOR SELECT TO authenticated
  USING (
    auth_role() = 'cliente'
    AND role = 'profissional'
    AND is_active = true
  );

-- Clients can read active promotions
CREATE POLICY "promotions_client_select"
  ON promotions FOR SELECT TO authenticated
  USING (is_active = true AND starts_at <= now() AND (ends_at IS NULL OR ends_at >= now()));

-- Promotions: anon can also read active (for totem/web)
CREATE POLICY "promotions_anon_select"
  ON promotions FOR SELECT TO anon
  USING (is_active = true AND starts_at <= now() AND (ends_at IS NULL OR ends_at >= now()));
