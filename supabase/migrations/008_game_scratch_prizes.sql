-- Add scratch_prizes column to game_configs
ALTER TABLE game_configs ADD COLUMN IF NOT EXISTS scratch_prizes JSONB NOT NULL DEFAULT '[]'::jsonb;
