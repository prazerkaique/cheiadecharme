import { supabase, STORE_ID } from "@/lib/supabase";

export async function updateAppointmentStatus(
  appointmentId: string,
  status: string,
  extra?: { started_at?: string; completed_at?: string }
): Promise<void> {
  const { error } = await supabase
    .from("appointments")
    .update({ status, ...extra })
    .eq("id", appointmentId);

  if (error) throw error;
}

export async function createTransactionOnComplete(opts: {
  appointmentId: string;
  professionalId: string;
  clientId: string;
  serviceId: string;
  amountCents: number;
}): Promise<void> {
  // Look up commission rate: first check professional_services, fall back to profile default
  let commissionRate = 50; // default 50%

  const { data: psRow } = await supabase
    .from("professional_services")
    .select("commission_rate")
    .eq("professional_id", opts.professionalId)
    .eq("service_id", opts.serviceId)
    .maybeSingle();

  if (psRow?.commission_rate != null) {
    commissionRate = psRow.commission_rate;
  } else {
    const { data: profile } = await supabase
      .from("profiles")
      .select("commission_rate")
      .eq("id", opts.professionalId)
      .maybeSingle();
    if (profile?.commission_rate != null) {
      commissionRate = profile.commission_rate;
    }
  }

  const commissionCents = Math.round(opts.amountCents * commissionRate / 100);

  const { error } = await supabase.from("transactions").insert({
    store_id: STORE_ID,
    appointment_id: opts.appointmentId,
    professional_id: opts.professionalId,
    client_id: opts.clientId,
    service_id: opts.serviceId,
    amount_cents: opts.amountCents,
    commission_cents: commissionCents,
    payment_method: "pix",
    status: "pending",
    transaction_date: new Date().toISOString(),
  });

  if (error) throw error;
}

export async function findAppointmentByTicket(
  ticketNumber: string,
  storeId: string
): Promise<{ id: string; status: string } | null> {
  const { data, error } = await supabase
    .from("appointments")
    .select("id, status")
    .eq("store_id", storeId)
    .eq("ticket_number", ticketNumber)
    .in("status", ["checked_in", "waiting", "scheduled"])
    .maybeSingle();

  if (error) throw error;
  return data;
}
