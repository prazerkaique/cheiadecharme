import { supabase, STORE_ID } from "@/lib/supabase";
import type { QueueItem } from "@/types/reception";
import type { AppointmentStatus, AppointmentSource } from "@cheia/types";

export async function fetchTodayQueue(): Promise<QueueItem[]> {
  const now = new Date();
  const startOfDay = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  ).toISOString();

  const { data, error } = await supabase
    .from("appointments")
    .select(
      `
      id,
      professional_id,
      status,
      source,
      ticket_number,
      queue_position,
      scheduled_at,
      checked_in_at,
      started_at,
      completed_at,
      client:profiles!appointments_client_id_fkey(id, name, phone, cpf),
      service:services(id, name, category, duration_minutes, price_cents)
    `
    )
    .eq("store_id", STORE_ID)
    .gte("created_at", startOfDay)
    .order("created_at", { ascending: true });

  if (error) throw error;

  return (data ?? []).map((row: Record<string, unknown>) => {
    const client = row.client as Record<string, unknown> | null;
    const service = row.service as Record<string, unknown> | null;
    return {
      id: row.id as string,
      client: {
        id: (client?.id as string) ?? "",
        name: (client?.name as string) ?? "Cliente",
        phone: (client?.phone as string) ?? null,
        cpf: (client?.cpf as string) ?? null,
      },
      service: {
        id: (service?.id as string) ?? "",
        name: (service?.name as string) ?? "Servico",
        category: (service?.category as string) ?? "",
        duration_minutes: (service?.duration_minutes as number) ?? 30,
        price_cents: (service?.price_cents as number) ?? 0,
      },
      professional_id: row.professional_id as string | null,
      status: row.status as AppointmentStatus,
      source: row.source as AppointmentSource,
      ticket_number: row.ticket_number as string | null,
      queue_position: row.queue_position as number | null,
      scheduled_at: row.scheduled_at as string | null,
      checked_in_at: row.checked_in_at as string | null,
      started_at: row.started_at as string | null,
      completed_at: row.completed_at as string | null,
    };
  });
}
