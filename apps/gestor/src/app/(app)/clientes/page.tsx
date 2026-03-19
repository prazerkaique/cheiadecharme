"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Search, UserCheck } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { useClientesStore } from "@/store/clientes-store";
import { useConfigStore } from "@/store/config-store";
import { FrequencyBadge } from "@/components/clientes/FrequencyBadge";
import { computeFrequency } from "@/lib/queries/clients";
import { supabase } from "@/lib/supabase";

const PRIMARY_COLOR = "#EC4899";

export default function ClientesPage() {
  const store = useAuthStore((s) => s.store);
  const showMock = useConfigStore((s) => s.settings?.show_mock_data ?? true);
  const { clients, search, loading, fetch: fetchClients, setSearch } = useClientesStore();
  const [appointmentCounts, setAppointmentCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    if (store?.id) fetchClients(store.id, showMock);
  }, [store?.id, showMock, fetchClients]);

  useEffect(() => {
    if (clients.length === 0 || !store?.id) return;

    const ids = clients.map((c) => c.id);
    supabase
      .from("appointments")
      .select("client_id")
      .eq("store_id", store.id)
      .eq("status", "completed")
      .in("client_id", ids)
      .then(({ data }) => {
        if (data) {
          const counts: Record<string, number> = {};
          data.forEach((a) => {
            counts[a.client_id] = (counts[a.client_id] || 0) + 1;
          });
          setAppointmentCounts(counts);
        }
      });
  }, [clients, store?.id]);

  const filtered = useMemo(() => {
    if (!search) return clients;
    const q = search.toLowerCase();
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.phone && c.phone.includes(q)) ||
        (c.cpf && c.cpf.includes(q))
    );
  }, [clients, search]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
          <p className="text-sm text-gray-500">{clients.length} clientes</p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6 rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Buscar por nome, telefone ou CPF..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border-none bg-gray-50 py-2.5 pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-black"
          />
        </div>
      </div>

      {/* Client List */}
      <div className="space-y-2">
        {filtered.map((client) => {
          const count = appointmentCounts[client.id] || 0;
          const freq = computeFrequency(count);

          return (
            <Link
              key={client.id}
              href={`/clientes/${client.id}`}
              className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 transition-all hover:bg-gray-50 hover:shadow-sm"
            >
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white text-sm font-bold"
                style={{ backgroundColor: PRIMARY_COLOR }}
              >
                {client.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate font-semibold text-gray-900">{client.name}</p>
                  <FrequencyBadge frequency={freq} />
                </div>
                <p className="text-xs text-gray-500">
                  {client.phone || client.email || "Sem contato"}
                </p>
              </div>
              <div className="text-right text-xs text-gray-500">
                <p>{count} atendimentos</p>
              </div>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <UserCheck size={40} className="mb-3 opacity-20" />
          <p className="text-sm">Nenhum cliente encontrado</p>
        </div>
      )}
    </div>
  );
}
