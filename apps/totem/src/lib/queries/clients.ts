import { supabase, STORE_ID, isSupabaseConfigured } from "@/lib/supabase";
import type { KioskClient, KioskTodayAppointment } from "@/store/kiosk-store";

export async function lookupClient(
  value: string,
  method: "cpf" | "phone"
): Promise<{ client: KioskClient; appointments: KioskTodayAppointment[] } | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    // Format CPF for DB lookup: 11111111111 -> 111.111.111-11
    const formattedValue = method === "cpf"
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

    // Fetch today's appointments
    const now = new Date();
    const startOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())).toISOString();
    const endOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1)).toISOString();

    const { data: appointments } = await supabase
      .from("appointments")
      .select(`
        id,
        scheduled_at,
        services:service_id (name),
        professional:professional_id (name)
      `)
      .eq("client_id", profile.id)
      .eq("store_id", STORE_ID)
      .gte("scheduled_at", startOfDay)
      .lt("scheduled_at", endOfDay)
      .in("status", ["scheduled", "checked_in"])
      .order("scheduled_at");

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
      client: {
        id: profile.id,
        name: profile.name,
        cpf: profile.cpf,
        phone: profile.phone,
        balance_charmes: balance,
      },
      appointments: (appointments ?? []).map((a: Record<string, unknown>) => ({
        id: a.id as string,
        service_name: (a.services as Record<string, string>)?.name ?? "Serviço",
        scheduled_at: a.scheduled_at as string,
        professional_name: (a.professional as Record<string, string>)?.name ?? null,
      })),
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
}): Promise<KioskClient> {
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
        cpf: data.cpf ? data.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4") : null,
        phone: data.phone ? data.phone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3") : null,
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
