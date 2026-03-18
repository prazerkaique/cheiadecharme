import { supabase, STORE_ID } from "@/lib/supabase";
import type { ScheduleSlot, WaitingQueueItem } from "@/types/professional";

export async function fetchMySchedule(professionalId: string): Promise<ScheduleSlot[]> {
  const now = new Date();
  const startOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())).toISOString();

  const { data, error } = await supabase
    .from("appointments")
    .select(`
      id,
      service_id,
      scheduled_at,
      started_at,
      completed_at,
      status,
      ticket_number,
      queue_position,
      client:profiles!appointments_client_id_fkey(id, name),
      service:services(name, category, duration_minutes, price_cents)
    `)
    .eq("store_id", STORE_ID)
    .eq("professional_id", professionalId)
    .gte("created_at", startOfDay)
    .order("scheduled_at", { ascending: true });

  if (error) throw error;

  return (data ?? []).map((row: Record<string, unknown>) => {
    const client = row.client as Record<string, unknown> | null;
    const service = row.service as Record<string, unknown> | null;
    const durationMin = (service?.duration_minutes as number) ?? 30;
    const scheduledAt = (row.scheduled_at as string) ?? new Date().toISOString();
    const estimatedEnd = new Date(
      new Date(scheduledAt).getTime() + durationMin * 60_000
    ).toISOString();

    return {
      id: row.id as string,
      scheduled_at: scheduledAt,
      estimated_end_at: estimatedEnd,
      client_name: (client?.name as string) ?? "Cliente",
      client_id: (client?.id as string) ?? "",
      service_id: (row.service_id as string) ?? "",
      service_name: (service?.name as string) ?? "Servico",
      service_category: (service?.category as string) ?? "",
      duration_minutes: durationMin,
      price_cents: (service?.price_cents as number) ?? 0,
      ticket_number: (row.ticket_number as string) ?? null,
      status: row.status as ScheduleSlot["status"],
      started_at: row.started_at as string | null,
      completed_at: row.completed_at as string | null,
    };
  });
}

export async function fetchWaitingQueue(professionalId: string): Promise<WaitingQueueItem[]> {
  const now = new Date();
  const startOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())).toISOString();

  const { data, error } = await supabase
    .from("appointments")
    .select(`
      id,
      service_id,
      ticket_number,
      checked_in_at,
      client:profiles!appointments_client_id_fkey(id, name),
      service:services(name, category, duration_minutes, price_cents)
    `)
    .eq("store_id", STORE_ID)
    .in("status", ["checked_in", "waiting"])
    .or(`professional_id.eq.${professionalId},professional_id.is.null`)
    .gte("created_at", startOfDay)
    .order("checked_in_at", { ascending: true });

  if (error) throw error;

  return (data ?? []).map((row: Record<string, unknown>) => {
    const client = row.client as Record<string, unknown> | null;
    const service = row.service as Record<string, unknown> | null;

    return {
      id: row.id as string,
      client_name: (client?.name as string) ?? "Cliente",
      client_id: (client?.id as string) ?? "",
      service_id: (row.service_id as string) ?? "",
      service_name: (service?.name as string) ?? "Servico",
      service_category: (service?.category as string) ?? "",
      duration_minutes: (service?.duration_minutes as number) ?? 30,
      price_cents: (service?.price_cents as number) ?? 0,
      ticket_number: (row.ticket_number as string) ?? "",
      checked_in_at: (row.checked_in_at as string) ?? new Date().toISOString(),
    };
  });
}
