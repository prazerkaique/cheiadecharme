import { supabase } from "@/lib/supabase";
import type { Profile, ProfessionalService } from "@cheia/types";

export async function fetchProfessionals(storeId: string, showMock = true) {
  let query = supabase
    .from("profiles")
    .select("*")
    .eq("store_id", storeId)
    .eq("role", "profissional")
    .order("name");

  if (!showMock) query = query.eq("is_mock", false);

  const { data, error } = await query;
  if (error) throw error;
  return data as Profile[];
}

export async function fetchProfessional(id: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Profile;
}

export async function createProfessional(
  storeId: string,
  data: {
    name: string;
    email?: string;
    phone?: string;
    specialty?: string;
    commission_rate: number;
  }
) {
  const { data: profile, error } = await supabase
    .from("profiles")
    .insert({
      store_id: storeId,
      role: "profissional",
      name: data.name,
      email: data.email || null,
      phone: data.phone || null,
      specialty: data.specialty || null,
      commission_rate: data.commission_rate,
      is_available: true,
      is_active: true,
    })
    .select()
    .single();

  if (error) throw error;
  return profile as Profile;
}

export async function updateProfessional(
  id: string,
  data: Partial<Pick<Profile, "name" | "email" | "phone" | "specialty" | "commission_rate" | "is_active" | "is_available">>
) {
  const { error } = await supabase
    .from("profiles")
    .update(data)
    .eq("id", id);

  if (error) throw error;
}

export async function fetchProfessionalServices(professionalId: string) {
  const { data, error } = await supabase
    .from("professional_services")
    .select("*")
    .eq("professional_id", professionalId);

  if (error) throw error;
  return data as ProfessionalService[];
}

export async function setProfessionalServices(
  professionalId: string,
  assignments: { service_id: string; commission_rate: number | null }[]
) {
  // Delete existing
  await supabase
    .from("professional_services")
    .delete()
    .eq("professional_id", professionalId);

  if (assignments.length === 0) return;

  const { error } = await supabase.from("professional_services").insert(
    assignments.map((a) => ({
      professional_id: professionalId,
      service_id: a.service_id,
      commission_rate: a.commission_rate,
      is_active: true,
    }))
  );

  if (error) throw error;
}
