import { supabase } from "@/lib/supabase";
import type { StoreSettings } from "@cheia/types";

export async function fetchStoreWithSettings(storeId: string) {
  const { data, error } = await supabase
    .from("stores")
    .select("name, address, phone, settings")
    .eq("id", storeId)
    .single();

  if (error) throw error;
  return data as { name: string; address: string | null; phone: string | null; settings: StoreSettings | null };
}

export async function updateStoreInfo(storeId: string, data: { name: string; address: string | null; phone: string | null }) {
  const { error } = await supabase
    .from("stores")
    .update(data)
    .eq("id", storeId);

  if (error) throw error;
}

export async function updateStoreSettings(storeId: string, settings: StoreSettings) {
  const { error } = await supabase
    .from("stores")
    .update({ settings })
    .eq("id", storeId);

  if (error) throw error;
}
