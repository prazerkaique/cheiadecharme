import { supabase, STORE_ID } from "@/lib/supabase";
import type { TVProfessional } from "@/types/tv";

// Category mapping: specialty → categoryId
const SPECIALTY_TO_CATEGORY: Record<string, string> = {
  Cabelo: "cabelo",
  Unhas: "unhas",
  Sobrancelha: "sobrancelha",
  Maquiagem: "maquiagem",
  Depilacao: "depilacao",
  Depilação: "depilacao",
};

export async function fetchTVProfessionals(): Promise<TVProfessional[]> {
  // Fetch all active professionals
  const { data: profiles, error: profError } = await supabase
    .from("profiles")
    .select("id, name, avatar_url, specialty")
    .eq("store_id", STORE_ID)
    .eq("role", "profissional")
    .eq("is_active", true)
    .order("name");

  if (profError) throw profError;

  // Fetch today's active appointments to derive status
  const now = new Date();
  const startOfDay = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  ).toISOString();
  const endOfDay = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1)
  ).toISOString();

  const { data: appointments } = await supabase
    .from("appointments")
    .select(
      "professional_id, status, client_id, profiles!appointments_client_id_fkey(name)"
    )
    .eq("store_id", STORE_ID)
    .in("status", ["in_progress", "waiting", "checked_in"])
    .gte("created_at", startOfDay)
    .lt("created_at", endOfDay);

  // Build status map
  const statusMap = new Map<
    string,
    {
      status: "busy" | "available" | "busy-queue";
      currentClient?: string;
      queueCount: number;
    }
  >();

  for (const apt of appointments ?? []) {
    if (!apt.professional_id) continue;
    const current = statusMap.get(apt.professional_id) ?? {
      status: "available" as const,
      queueCount: 0,
    };

    if (apt.status === "in_progress") {
      const clientName = (apt.profiles as unknown as { name: string } | null)?.name;
      if (current.status === "available") {
        current.status = "busy";
        current.currentClient = clientName ?? undefined;
      } else {
        current.status = "busy-queue";
        current.queueCount++;
      }
    } else if (apt.status === "waiting" || apt.status === "checked_in") {
      if (current.status === "busy") {
        current.status = "busy-queue";
      }
      current.queueCount++;
    }

    statusMap.set(apt.professional_id, current);
  }

  return (profiles ?? []).map((p) => {
    const info = statusMap.get(p.id);
    return {
      id: p.id,
      name: p.name,
      avatar: p.avatar_url ?? "/logo.png",
      categoryId: SPECIALTY_TO_CATEGORY[p.specialty ?? ""] ?? "cabelo",
      status: info?.status ?? "available",
      currentClient: info?.currentClient,
      queueCount: info?.queueCount,
    };
  });
}
