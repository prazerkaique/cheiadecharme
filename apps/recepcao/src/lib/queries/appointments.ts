import { supabase, STORE_ID } from "@/lib/supabase";

export async function updateAppointmentStatus(
  appointmentId: string,
  status: string,
  extra?: { started_at?: string; completed_at?: string }
) {
  const { error } = await supabase
    .from("appointments")
    .update({ status, ...extra })
    .eq("id", appointmentId);

  if (error) throw error;
}

export async function assignProfessionalToAppointment(
  appointmentId: string,
  professionalId: string
) {
  const { error } = await supabase
    .from("appointments")
    .update({ professional_id: professionalId })
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
  let commissionRate = 50;

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
      .single();
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
