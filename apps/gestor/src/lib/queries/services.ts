import { supabase } from "@/lib/supabase";
import type { Service } from "@cheia/types";

export async function fetchServices(storeId: string) {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("store_id", storeId)
    .order("category")
    .order("name");

  if (error) throw error;
  return data as Service[];
}

export async function createService(
  storeId: string,
  data: {
    name: string;
    category: string;
    price_cents: number;
    duration_minutes: number;
    description?: string;
  }
) {
  const { data: service, error } = await supabase
    .from("services")
    .insert({
      store_id: storeId,
      name: data.name,
      category: data.category,
      price_cents: data.price_cents,
      duration_minutes: data.duration_minutes,
      description: data.description || null,
      is_active: true,
    })
    .select()
    .single();

  if (error) throw error;
  return service as Service;
}

export async function updateService(
  id: string,
  data: Partial<Pick<Service, "name" | "category" | "price_cents" | "duration_minutes" | "description" | "is_active">>
) {
  const { error } = await supabase
    .from("services")
    .update(data)
    .eq("id", id);

  if (error) throw error;
}
