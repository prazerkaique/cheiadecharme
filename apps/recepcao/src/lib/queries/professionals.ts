import { supabase, STORE_ID } from "@/lib/supabase";
import type { ReceptionProfessional } from "@/types/reception";

export async function fetchStoreProfessionals(): Promise<
  ReceptionProfessional[]
> {
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("id, name, avatar_url, specialty")
    .eq("store_id", STORE_ID)
    .eq("role", "profissional")
    .eq("is_active", true)
    .order("name");

  if (error) throw error;

  // Fetch today's appointments to derive status + completed count
  const now = new Date();
  const startOfDay = new Date(
    now.getFullYear(), now.getMonth(), now.getDate()
  ).toISOString();

  const { data: appointments } = await supabase
    .from("appointments")
    .select("professional_id, status, client_id")
    .eq("store_id", STORE_ID)
    .in("status", ["in_progress", "waiting", "checked_in", "completed"])
    .gte("created_at", startOfDay);

  const statusMap = new Map<
    string,
    { currentClients: string[]; queueCount: number; completedToday: number }
  >();

  for (const apt of appointments ?? []) {
    if (!apt.professional_id) continue;
    const entry = statusMap.get(apt.professional_id) ?? {
      currentClients: [],
      queueCount: 0,
      completedToday: 0,
    };
    if (apt.status === "in_progress" && apt.client_id) {
      entry.currentClients.push(apt.client_id as string);
    }
    if (apt.status === "waiting" || apt.status === "checked_in") {
      entry.queueCount++;
    }
    if (apt.status === "completed") {
      entry.completedToday++;
    }
    statusMap.set(apt.professional_id as string, entry);
  }

  return (profiles ?? []).map((p) => {
    const info = statusMap.get(p.id);
    const hasCurrent = (info?.currentClients.length ?? 0) > 0;
    const hasQueue = (info?.queueCount ?? 0) > 0;
    let status: "available" | "busy" | "busy-queue" = "available";
    if (hasCurrent && hasQueue) status = "busy-queue";
    else if (hasCurrent) status = "busy";

    return {
      id: p.id as string,
      name: p.name as string,
      avatar_url: (p.avatar_url as string | null) ?? null,
      specialty: (p.specialty as string | null) ?? "",
      status,
      currentClients: info?.currentClients ?? [],
      queueCount: info?.queueCount ?? 0,
      completedToday: info?.completedToday ?? 0,
    };
  });
}
