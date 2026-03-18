import { supabase, STORE_ID, isSupabaseConfigured } from "@/lib/supabase";
import type { KioskAppointment, KioskService, KioskProfessional } from "@/store/kiosk-store";

export async function createAppointment(
  clientId: string,
  cart: KioskService[],
  professionalsByService: Record<string, KioskProfessional>
): Promise<KioskAppointment> {
  const ticketNumber = `#${String(Math.floor(Math.random() * 999) + 1).padStart(3, "0")}`;
  const qrCode = crypto.randomUUID();

  if (!isSupabaseConfigured()) {
    return {
      id: crypto.randomUUID(),
      ticket_number: ticketNumber,
      qr_code: qrCode,
      queue_position: Math.floor(Math.random() * 5) + 1,
    };
  }

  try {
    // Get current max queue position
    const { data: maxPos } = await supabase
      .from("appointments")
      .select("queue_position")
      .eq("store_id", STORE_ID)
      .not("queue_position", "is", null)
      .order("queue_position", { ascending: false })
      .limit(1)
      .maybeSingle();

    const nextPosition = (maxPos?.queue_position ?? 0) + 1;

    // Insert one appointment per service in cart
    const appointments = cart.map((service, idx) => ({
      store_id: STORE_ID,
      client_id: clientId,
      service_id: service.id,
      professional_id: professionalsByService[service.id]?.id === "any"
        ? null
        : professionalsByService[service.id]?.id ?? null,
      status: "checked_in" as const,
      checked_in_at: new Date().toISOString(),
      queue_position: nextPosition + idx,
      ticket_number: ticketNumber,
      qr_code: idx === 0 ? qrCode : null,
      source: "totem" as const,
    }));

    const { data, error } = await supabase
      .from("appointments")
      .insert(appointments)
      .select("id, queue_position")
      .order("queue_position", { ascending: true });

    if (error || !data?.length) throw error ?? new Error("No rows returned");

    return {
      id: data[0].id,
      ticket_number: ticketNumber,
      qr_code: qrCode,
      queue_position: data[0].queue_position ?? nextPosition,
    };
  } catch (err) {
    console.error("[createAppointment] Supabase error, using mock:", err);
    return {
      id: crypto.randomUUID(),
      ticket_number: ticketNumber,
      qr_code: qrCode,
      queue_position: Math.floor(Math.random() * 5) + 1,
    };
  }
}
