import { supabase, STORE_ID, isSupabaseConfigured } from "@/lib/supabase";
import type { GameConfig, Prize } from "@cheia/types";
import { DEFAULT_GAME_CONFIG, DEFAULT_PRIZES, DEFAULT_SCRATCH_PRIZES } from "@/lib/mock-data";

/**
 * Fetches the game configuration from Supabase.
 * Falls back to mock data if Supabase isn't configured.
 */
export async function fetchGameConfig(): Promise<GameConfig> {
  if (!isSupabaseConfigured()) {
    return DEFAULT_GAME_CONFIG;
  }

  try {
    const { data, error } = await supabase
      .from("game_configs")
      .select("spin_cost_cents, prizes, scratch_prizes, logo_url")
      .eq("store_id", STORE_ID)
      .maybeSingle();

    if (error) throw error;
    if (!data) return DEFAULT_GAME_CONFIG;

    return {
      spin_cost_cents: data.spin_cost_cents,
      prizes: (data.prizes as Prize[]) ?? DEFAULT_PRIZES,
      scratchPrizes: (data.scratch_prizes as Prize[]) ?? DEFAULT_SCRATCH_PRIZES,
      logo_url: data.logo_url ?? undefined,
    };
  } catch (err) {
    console.error("[fetchGameConfig] Supabase error, using defaults:", err);
    return DEFAULT_GAME_CONFIG;
  }
}

/**
 * Registers a spin in the database.
 */
export async function registerSpin(clientId: string, prizeId: string): Promise<void> {
  if (!isSupabaseConfigured()) return;

  try {
    await supabase.from("game_spins").insert({
      store_id: STORE_ID,
      client_id: clientId,
      prize_id: prizeId,
      spun_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[registerSpin] Supabase error:", err);
  }
}

/**
 * Claims a prize for the client (registers the reward).
 */
export async function claimPrize(
  clientId: string,
  prize: Prize
): Promise<void> {
  if (!isSupabaseConfigured()) return;

  try {
    if (prize.type === "charmes") {
      // Add charmes to client balance
      const { data: wallet } = await supabase
        .from("client_charmes")
        .select("id, balance")
        .eq("client_id", clientId)
        .eq("store_id", STORE_ID)
        .maybeSingle();

      if (wallet) {
        await supabase
          .from("client_charmes")
          .update({ balance: wallet.balance + prize.value })
          .eq("id", wallet.id);
      } else {
        await supabase.from("client_charmes").insert({
          client_id: clientId,
          store_id: STORE_ID,
          balance: prize.value,
        });
      }

      // Register charme transaction
      await supabase.from("charme_transactions").insert({
        client_id: clientId,
        store_id: STORE_ID,
        type: "earn",
        amount: prize.value,
        description: `Prêmio Cheia de Sorte: ${prize.label}`,
      });
    }

    // For discount/free_service prizes, you would create a coupon/voucher here
    // This is left for future implementation when the coupon system is ready
  } catch (err) {
    console.error("[claimPrize] Supabase error:", err);
  }
}

/**
 * Deducts charmes from a client's wallet and logs the transaction.
 */
export async function deductClientCharmes(
  clientId: string,
  amount: number,
  description: string
): Promise<void> {
  if (!isSupabaseConfigured()) return;

  try {
    const { data: wallet } = await supabase
      .from("client_charmes")
      .select("id, balance")
      .eq("client_id", clientId)
      .eq("store_id", STORE_ID)
      .maybeSingle();

    if (!wallet) {
      console.error("[deductClientCharmes] No wallet found for client:", clientId);
      return;
    }

    await supabase
      .from("client_charmes")
      .update({ balance: wallet.balance - amount })
      .eq("id", wallet.id);

    await supabase.from("charme_transactions").insert({
      client_id: clientId,
      store_id: STORE_ID,
      type: "spend",
      amount,
      description,
    });
  } catch (err) {
    console.error("[deductClientCharmes] Supabase error:", err);
  }
}
