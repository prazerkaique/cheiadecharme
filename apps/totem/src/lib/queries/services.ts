import { supabase, STORE_ID } from "@/lib/supabase";
import type { KioskService } from "@/store/kiosk-store";

export async function fetchServices(): Promise<KioskService[]> {
  const { data, error } = await supabase
    .from("services")
    .select("id, name, category, price_cents, duration_minutes, image_url")
    .eq("store_id", STORE_ID)
    .eq("is_active", true)
    .order("category")
    .order("name");

  if (error) throw error;

  return (data ?? []).map((s) => ({
    id: s.id,
    name: s.name,
    category: s.category,
    price_charmes: s.price_cents, // 1:1 mapping for now (charmes = cents)
    duration_minutes: s.duration_minutes,
    image_url: s.image_url,
  }));
}
