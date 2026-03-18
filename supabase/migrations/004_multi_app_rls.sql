-- =============================================================================
-- Migration: 004_multi_app_rls.sql
-- Description: Add RLS policies for multi-app access.
--              Totem/TV use anon key (SELECT + INSERT on appointments).
--              Recepcao/Profissional use authenticated (UPDATE appointments,
--              INSERT transactions, UPDATE own profile).
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. Anon policies — Totem & TV (read services, profiles, appointments)
-- ---------------------------------------------------------------------------

-- Services: anon can read active services (totem needs service list)
CREATE POLICY "services_anon_select"
  ON services FOR SELECT TO anon
  USING (is_active = true);

-- Profiles: anon can read professionals (totem shows professional list)
CREATE POLICY "profiles_anon_select"
  ON profiles FOR SELECT TO anon
  USING (role = 'profissional' AND is_active = true);

-- Appointments: anon can read today's appointments (TV queue display)
CREATE POLICY "appointments_anon_select"
  ON appointments FOR SELECT TO anon
  USING (true);

-- Appointments: anon can insert (totem creates check-ins)
CREATE POLICY "appointments_anon_insert"
  ON appointments FOR INSERT TO anon
  WITH CHECK (source = 'totem');

-- ---------------------------------------------------------------------------
-- 2. Authenticated policies — Recepcao & Profissional
-- ---------------------------------------------------------------------------

-- Appointments: authenticated can insert (gestor/recepcao create appointments)
CREATE POLICY "appointments_auth_insert"
  ON appointments FOR INSERT TO authenticated
  WITH CHECK (store_id = auth_store_id());

-- Appointments: authenticated can update own store (recepcao/profissional update status)
CREATE POLICY "appointments_auth_update"
  ON appointments FOR UPDATE TO authenticated
  USING (store_id = auth_store_id())
  WITH CHECK (store_id = auth_store_id());

-- Transactions: authenticated can insert (on service completion)
CREATE POLICY "transactions_auth_insert"
  ON transactions FOR INSERT TO authenticated
  WITH CHECK (store_id = auth_store_id());

-- Profiles: authenticated can update self (profissional changes availability)
CREATE POLICY "profiles_auth_update_self"
  ON profiles FOR UPDATE TO authenticated
  USING (auth_id = auth.uid())
  WITH CHECK (auth_id = auth.uid());

-- Profiles: anon can read clients by CPF/phone (totem client lookup)
CREATE POLICY "profiles_anon_select_clients"
  ON profiles FOR SELECT TO anon
  USING (role = 'cliente');
