import { supabase } from "@/lib/supabase";
import type { Prize } from "@cheia/types";

export interface GameConfigRow {
  id: string;
  store_id: string;
  spin_cost_cents: number;
  prizes: Prize[];
  scratch_prizes: Prize[];
  logo_url: string | null;
  is_active: boolean;
}

export async function fetchGameConfig(storeId: string) {
  const { data, error } = await supabase
    .from("game_configs")
    .select("*")
    .eq("store_id", storeId)
    .maybeSingle();

  if (error) throw error;
  return data as GameConfigRow | null;
}

export async function updateGameConfig(storeId: string, data: Partial<Omit<GameConfigRow, "id" | "store_id">>) {
  const { error } = await supabase
    .from("game_configs")
    .update(data)
    .eq("store_id", storeId);

  if (error) throw error;
}
