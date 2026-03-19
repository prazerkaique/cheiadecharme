-- =============================================================================
-- Migration 009: Add is_mock column to filter seed/demo data
-- =============================================================================

-- Add is_mock column to tables that have seed data
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_mock BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE services ADD COLUMN IF NOT EXISTS is_mock BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS is_mock BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS is_mock BOOLEAN NOT NULL DEFAULT false;

-- Mark seed records as mock by their known UUID patterns
-- Professionals: b0000000-0000-0000-0000-000000000001..015 + gestor 099
UPDATE profiles SET is_mock = true WHERE id LIKE 'b0000000-0000-0000-0000-%';
-- Clients: d0000000-...
UPDATE profiles SET is_mock = true WHERE id LIKE 'd0000000-0000-0000-0000-%';
-- Services: c0000000-...
UPDATE services SET is_mock = true WHERE id LIKE 'c0000000-0000-0000-0000-%';
-- Appointments: e0000000-...
UPDATE appointments SET is_mock = true WHERE id LIKE 'e0000000-0000-0000-0000-%';
-- Transactions: f1000000-...
UPDATE transactions SET is_mock = true WHERE id LIKE 'f1000000-0000-0000-0000-%';
