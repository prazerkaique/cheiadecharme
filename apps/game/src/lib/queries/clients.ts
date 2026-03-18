import { supabase, STORE_ID, isSupabaseConfigured } from "@/lib/supabase";
import type { GameClient } from "@cheia/types";

export async function lookupClient(
  value: string,
  method: "cpf" | "phone"
): Promise<GameClient | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    const formattedValue =
      method === "cpf"
        ? value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
        : value.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");

    const column = method === "cpf" ? "cpf" : "phone";

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("id, name, cpf, phone")
      .eq("role", "cliente")
      .eq(column, formattedValue)
      .maybeSingle();

    if (error) throw error;
    if (!profile) return null;

    // Fetch charmes balance
    let balance = 0;
    const { data: wallet } = await supabase
      .from("client_charmes")
      .select("balance")
      .eq("client_id", profile.id)
      .eq("store_id", STORE_ID)
      .maybeSingle();
    if (wallet) balance = wallet.balance;

    return {
      id: profile.id,
      name: profile.name,
      cpf: profile.cpf,
      phone: profile.phone,
      balance_charmes: balance,
    };
  } catch (err) {
    console.error("[lookupClient] Supabase error:", err);
    return null;
  }
}

export async function registerClient(data: {
  name: string;
  cpf: string | null;
  phone: string | null;
}): Promise<GameClient> {
  if (!isSupabaseConfigured()) {
    return {
      id: "new-" + Date.now(),
      name: data.name,
      cpf: data.cpf,
      phone: data.phone,
      balance_charmes: 0,
    };
  }

  try {
    const { data: profile, error } = await supabase
      .from("profiles")
      .insert({
        store_id: STORE_ID,
        name: data.name,
        cpf: data.cpf
          ? data.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
          : null,
        phone: data.phone
          ? data.phone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
          : null,
        role: "cliente",
        is_active: true,
        can_parallel: 1,
        commission_rate: 0,
        is_available: false,
      })
      .select("id, name, cpf, phone")
      .single();

    if (error) throw error;

    return {
      id: profile.id,
      name: profile.name,
      cpf: profile.cpf,
      phone: profile.phone,
      balance_charmes: 0,
    };
  } catch (err) {
    console.error("[registerClient] Supabase error, using mock:", err);
    return {
      id: "new-" + Date.now(),
      name: data.name,
      cpf: data.cpf,
      phone: data.phone,
      balance_charmes: 0,
    };
  }
}
