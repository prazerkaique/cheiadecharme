import { supabase, STORE_ID } from "@/lib/supabase";
import type { KioskProfessional } from "@/store/kiosk-store";

export async function fetchProfessionals(): Promise<KioskProfessional[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, name, avatar_url, specialty")
    .eq("store_id", STORE_ID)
    .eq("role", "profissional")
    .eq("is_active", true)
    .order("name");

  if (error) throw error;

  return (data ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    avatar_url: p.avatar_url,
    specialty: p.specialty,
  }));
}
