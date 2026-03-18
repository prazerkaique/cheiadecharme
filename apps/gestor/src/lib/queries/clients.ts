import { supabase } from "@/lib/supabase";
import type { Profile, Appointment, ClientFrequency } from "@cheia/types";

export async function fetchClients(storeId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("store_id", storeId)
    .eq("role", "cliente")
    .order("name");

  if (error) throw error;
  return data as Profile[];
}

export async function fetchClientAppointments(clientId: string) {
  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Appointment[];
}

export function computeFrequency(appointmentCount: number): ClientFrequency {
  if (appointmentCount >= 8) return "vip";
  if (appointmentCount >= 4) return "regular";
  if (appointmentCount >= 1) return "occasional";
  return "new";
}
