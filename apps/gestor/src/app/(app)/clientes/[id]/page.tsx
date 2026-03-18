"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Phone, Mail, History } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { FrequencyBadge } from "@/components/clientes/FrequencyBadge";
import { computeFrequency, fetchClientAppointments } from "@/lib/queries/clients";
import { formatPrice, formatDate } from "@/lib/format";
import { supabase } from "@/lib/supabase";
import type { Profile, Appointment } from "@cheia/types";

const PRIMARY_COLOR = "#EC4899";

export default function ClienteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const store = useAuthStore((s) => s.store);

  const [client, setClient] = useState<Profile | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [proNames, setProNames] = useState<Record<string, string>>({});
  const [svcNames, setSvcNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    Promise.all([
      supabase.from("profiles").select("*").eq("id", id).single(),
      fetchClientAppointments(id),
    ]).then(([{ data: profile }, appts]) => {
      setClient(profile as Profile | null);
      setAppointments(appts);
      setLoading(false);

      const proIds = [...new Set(appts.map((a) => a.professional_id).filter(Boolean))] as string[];
      const svcIds = [...new Set(appts.map((a) => a.service_id).filter(Boolean))] as string[];

      if (proIds.length > 0) {
        supabase.from("profiles").select("id, name").in("id", proIds).then(({ data }) => {
          if (data) {
            const map: Record<string, string> = {};
            data.forEach((p) => (map[p.id] = p.name));
            setProNames(map);
          }
        });
      }
      if (svcIds.length > 0) {
        supabase.from("services").select("id, name").in("id", svcIds).then(({ data }) => {
          if (data) {
            const map: Record<string, string> = {};
            data.forEach((s) => (map[s.id] = s.name));
            setSvcNames(map);
          }
        });
      }
    });
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900" />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="py-20 text-center text-sm text-gray-400">
        Cliente nao encontrado
      </div>
    );
  }

  const completedAppts = appointments.filter((a) => a.status === "completed");
  const freq = computeFrequency(completedAppts.length);

  return (
    <div>
      {/* Back button */}
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="rounded-xl p-2 text-gray-400 transition-colors hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Detalhe do Cliente</h1>
      </div>

      {/* Profile Header */}
      <div className="mb-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <div
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-2xl font-bold text-white"
            style={{ backgroundColor: PRIMARY_COLOR }}
          >
            {client.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center gap-2 sm:justify-start">
              <h2 className="text-xl font-bold text-gray-900">{client.name}</h2>
              <FrequencyBadge frequency={freq} />
            </div>
            <div className="mt-2 flex flex-wrap justify-center gap-3 sm:justify-start">
              {client.phone && (
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <Phone size={12} /> {client.phone}
                </span>
              )}
              {client.email && (
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <Mail size={12} /> {client.email}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-5 grid grid-cols-3 gap-4 border-t border-gray-100 pt-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
              Total Atendimentos
            </p>
            <p className="text-lg font-bold text-gray-900">{completedAppts.length}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
              Ultimo Atendimento
            </p>
            <p className="text-lg font-bold text-gray-900">
              {completedAppts.length > 0
                ? formatDate(completedAppts[0].completed_at ?? completedAppts[0].created_at)
                : "—"}
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
              Status
            </p>
            <p className="text-lg font-bold text-gray-900 capitalize">{freq}</p>
          </div>
        </div>
      </div>

      {/* History */}
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <History size={18} style={{ color: PRIMARY_COLOR }} />
          <h3 className="font-bold text-gray-900">Historico de Atendimentos</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-100 text-xs font-bold uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">Data</th>
                <th className="px-4 py-3">Servico</th>
                <th className="px-4 py-3">Profissional</th>
                <th className="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {appointments.length > 0 ? (
                appointments.map((appt) => (
                  <tr key={appt.id} className="transition-colors hover:bg-gray-50">
                    <td className="whitespace-nowrap px-4 py-3 text-gray-500">
                      {formatDate(appt.completed_at ?? appt.created_at)}
                    </td>
                    <td className="px-4 py-3 text-gray-900">
                      {appt.service_id ? svcNames[appt.service_id] ?? "..." : "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {appt.professional_id ? proNames[appt.professional_id] ?? "..." : "—"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`rounded-lg px-2 py-0.5 text-[10px] font-bold ${
                          appt.status === "completed"
                            ? "bg-green-50 text-green-600"
                            : appt.status === "no_show"
                            ? "bg-red-50 text-red-500"
                            : "bg-yellow-50 text-yellow-700"
                        }`}
                      >
                        {appt.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                    Nenhum atendimento registrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
