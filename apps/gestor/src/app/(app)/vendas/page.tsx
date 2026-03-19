"use client";

import { useEffect, useState, useMemo } from "react";
import { DollarSign, ShoppingBag, Search } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { useVendasStore } from "@/store/vendas-store";
import { useConfigStore } from "@/store/config-store";
import { formatPrice, formatDateTime } from "@/lib/format";
import { supabase } from "@/lib/supabase";
import type { SalesDateRange } from "@/lib/queries/transactions";

const DATE_OPTIONS: { label: string; value: SalesDateRange }[] = [
  { label: "Hoje", value: "today" },
  { label: "Semana", value: "week" },
  { label: "Mes", value: "month" },
  { label: "Trimestre", value: "quarter" },
  { label: "Ano", value: "year" },
];

const PAYMENT_LABELS: Record<string, string> = {
  cash: "Dinheiro",
  credit: "Credito",
  debit: "Debito",
  pix: "Pix",
  charmes: "Charmes",
};

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  completed: { label: "Pago", className: "bg-green-50 text-green-600" },
  pending: { label: "Pendente", className: "bg-yellow-50 text-yellow-700" },
  cancelled: { label: "Cancelado", className: "bg-red-50 text-red-500" },
  refunded: { label: "Reembolsado", className: "bg-gray-100 text-gray-500" },
};

export default function VendasPage() {
  const store = useAuthStore((s) => s.store);
  const showMock = useConfigStore((s) => s.settings?.show_mock_data ?? true);
  const {
    transactions,
    dateRange,
    search,
    loading,
    fetch: fetchTxs,
    setDateRange,
    setSearch,
  } = useVendasStore();

  const [proNames, setProNames] = useState<Record<string, string>>({});
  const [svcNames, setSvcNames] = useState<Record<string, string>>({});
  const [clientNames, setClientNames] = useState<Record<string, string>>({});

  useEffect(() => {
    if (store?.id) fetchTxs(store.id, showMock);
  }, [store?.id, showMock, dateRange, fetchTxs]);

  useEffect(() => {
    if (transactions.length === 0) return;

    const proIds = [...new Set(transactions.map((t) => t.professional_id).filter(Boolean))] as string[];
    const svcIds = [...new Set(transactions.map((t) => t.service_id).filter(Boolean))] as string[];
    const clientIds = [...new Set(transactions.map((t) => t.client_id).filter(Boolean))] as string[];

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

    if (clientIds.length > 0) {
      supabase.from("profiles").select("id, name").in("id", clientIds).then(({ data }) => {
        if (data) {
          const map: Record<string, string> = {};
          data.forEach((c) => (map[c.id] = c.name));
          setClientNames(map);
        }
      });
    }
  }, [transactions]);

  const filtered = useMemo(() => {
    if (!search) return transactions;
    const q = search.toLowerCase();
    return transactions.filter((t) => {
      const proName = t.professional_id ? proNames[t.professional_id] ?? "" : "";
      const clientName = t.client_id ? clientNames[t.client_id] ?? "" : "";
      return proName.toLowerCase().includes(q) || clientName.toLowerCase().includes(q);
    });
  }, [transactions, search, proNames, clientNames]);

  const totalRevenue = filtered.reduce((acc, t) => acc + t.amount_cents, 0);
  const totalCount = filtered.length;
  const avgTicket = totalCount > 0 ? Math.round(totalRevenue / totalCount) : 0;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Vendas</h1>
        <p className="text-sm text-gray-500">Historico de transacoes</p>
      </div>

      {/* KPI Cards */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-2 w-fit rounded-xl bg-green-50 p-2">
            <DollarSign size={20} className="text-green-500" />
          </div>
          <p className="text-xl font-bold text-gray-900">{formatPrice(totalRevenue)}</p>
          <p className="text-xs text-gray-500">Receita no periodo</p>
        </div>
        <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-2 w-fit rounded-xl bg-pink-50 p-2">
            <ShoppingBag size={20} className="text-pink-500" />
          </div>
          <p className="text-xl font-bold text-gray-900">{totalCount}</p>
          <p className="text-xs text-gray-500">Transacoes</p>
        </div>
        <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-2 w-fit rounded-xl bg-yellow-50 p-2">
            <DollarSign size={20} className="text-yellow-500" />
          </div>
          <p className="text-xl font-bold text-gray-900">{formatPrice(avgTicket)}</p>
          <p className="text-xs text-gray-500">Ticket medio</p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="mb-6 flex flex-col gap-3 rounded-3xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Buscar por cliente ou profissional..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border-none bg-gray-50 py-2.5 pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        <div className="flex gap-2">
          {DATE_OPTIONS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setDateRange(value)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                dateRange === value
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-100 bg-gray-50 text-xs font-bold uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Servico</th>
                <th className="px-6 py-4">Profissional</th>
                <th className="px-6 py-4">Pagamento</th>
                <th className="px-6 py-4 text-right">Valor</th>
                <th className="px-6 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length > 0 ? (
                filtered.map((tx) => {
                  const st = STATUS_LABELS[tx.status] ?? STATUS_LABELS.completed;
                  return (
                    <tr key={tx.id} className="transition-colors hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4 text-gray-500">
                        {formatDateTime(tx.transaction_date)}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {tx.client_id ? clientNames[tx.client_id] ?? "..." : "—"}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {tx.service_id ? svcNames[tx.service_id] ?? "..." : "—"}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {tx.professional_id ? proNames[tx.professional_id] ?? "..." : "—"}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {PAYMENT_LABELS[tx.payment_method] ?? tx.payment_method}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-gray-900">
                        {formatPrice(tx.amount_cents)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`rounded-lg px-2 py-0.5 text-[10px] font-bold ${st.className}`}>
                          {st.label}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                    {loading ? "Carregando..." : "Nenhuma transacao encontrada"}
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
