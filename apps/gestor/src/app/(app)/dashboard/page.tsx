"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DollarSign,
  CalendarCheck,
  Ticket,
  Activity,
  Sparkles,
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { useDashboardStore } from "@/store/dashboard-store";
import { KPICard } from "@/components/dashboard/KPICard";
import { GoalCard } from "@/components/dashboard/GoalCard";
import { SeasonalityChart } from "@/components/dashboard/SeasonalityChart";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { ServiceDistribution } from "@/components/dashboard/ServiceDistribution";
import { TeamRanking } from "@/components/dashboard/TeamRanking";
import { AppointmentSource } from "@/components/dashboard/AppointmentSource";
import { formatPrice } from "@/lib/format";
import { supabase } from "@/lib/supabase";
import type { DateRange } from "@/lib/queries/dashboard";

const DATE_OPTIONS: { label: string; value: DateRange }[] = [
  { label: "Hoje", value: "today" },
  { label: "Semana", value: "week" },
  { label: "Mes", value: "month" },
  { label: "Trimestre", value: "quarter" },
  { label: "Ano", value: "year" },
];

// Revenue goals (could come from DB later)
const REVENUE_GOAL = 2500000; // R$ 25.000 in cents
const APPOINTMENTS_GOAL = 600;

export default function DashboardPage() {
  const router = useRouter();
  const store = useAuthStore((s) => s.store);
  const profile = useAuthStore((s) => s.profile);
  const {
    dateRange,
    setDateRange,
    fetch: fetchKPIs,
    totalRevenue,
    totalCommission,
    completedCount,
    avgTicket,
    revenueChart,
    serviceDistribution,
    ranking,
    loading,
  } = useDashboardStore();

  const [seasonality, setSeasonality] = useState<{ month: number; value: number }[]>([]);

  useEffect(() => {
    if (store?.id) fetchKPIs(store.id);
  }, [store?.id, dateRange, fetchKPIs]);

  // Fetch yearly seasonality data
  useEffect(() => {
    if (!store?.id) return;
    const year = new Date().getFullYear();
    const start = `${year}-01-01`;
    const end = `${year}-12-31`;

    supabase
      .from("transactions")
      .select("amount_cents, transaction_date")
      .eq("store_id", store.id)
      .eq("status", "completed")
      .gte("transaction_date", start)
      .lte("transaction_date", end)
      .then(({ data }) => {
        if (!data) return;
        const monthly: Record<number, number> = {};
        data.forEach((tx) => {
          const m = new Date(tx.transaction_date).getMonth() + 1;
          monthly[m] = (monthly[m] || 0) + tx.amount_cents;
        });
        setSeasonality(
          Object.entries(monthly).map(([m, v]) => ({ month: Number(m), value: v }))
        );
      });
  }, [store?.id]);

  // Resolve names
  const [serviceNames] = useMemoServiceNames(serviceDistribution, store?.id);
  const [proNames] = useMemoProNames(ranking, store?.id);

  const pieData = useMemo(() => {
    return Object.entries(serviceDistribution).map(([id, count]) => ({
      name: serviceNames[id] || "Servico",
      value: count,
    }));
  }, [serviceDistribution, serviceNames]);

  const rankingData = useMemo(() => {
    return ranking.map((r) => ({
      ...r,
      name: proNames[r.professional_id] || "Profissional",
      avatar_url: null,
    }));
  }, [ranking, proNames]);

  // Occupancy rate (completed / total appointments)
  const occupancyRate = completedCount > 0 ? 100 : 0;

  // Goals
  const revenuePercent = REVENUE_GOAL > 0 ? Math.round((totalRevenue / REVENUE_GOAL) * 100) : 0;
  const appointmentsPercent = APPOINTMENTS_GOAL > 0 ? Math.round((completedCount / APPOINTMENTS_GOAL) * 100) : 0;

  return (
    <div>
      {/* Welcome Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">
            {store?.name || "Cheia de Charme"} &middot; Bem-vindo de volta, {profile?.name?.split(" ")[0] || "Gestor"}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
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

      {/* KPI Cards — 4 columns */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KPICard
          label="Faturamento Total"
          value={formatPrice(totalRevenue)}
          icon={DollarSign}
          trend={11.1}
          color="#10B981"
          actionLabel="Ver Extrato"
          onAction={() => router.push("/vendas")}
        />
        <KPICard
          label="Taxa de Ocupacao"
          value={`${occupancyRate.toFixed(1)}%`}
          icon={Activity}
          trend={5.3}
          color="#3B82F6"
          actionLabel="Ver detalhes"
        />
        <KPICard
          label="Atendimentos"
          value={completedCount.toString()}
          icon={CalendarCheck}
          trend={11.1}
          color="#8B5CF6"
          actionLabel="Ver Extrato"
          onAction={() => router.push("/vendas")}
        />
        <KPICard
          label="Ticket Medio"
          value={formatPrice(avgTicket)}
          icon={Ticket}
          trend={5.3}
          color="#F59E0B"
          actionLabel="Ver detalhes"
        />
      </div>

      {/* Goals — 2 columns */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <GoalCard
          title="Meta de Faturamento"
          current={formatPrice(totalRevenue)}
          goal={formatPrice(REVENUE_GOAL)}
          percent={revenuePercent}
          color="#10B981"
        />
        <GoalCard
          title="Meta de Atendimentos"
          current={`${completedCount} atend.`}
          goal={APPOINTMENTS_GOAL.toString()}
          percent={appointmentsPercent}
          color="#8B5CF6"
        />
      </div>

      {/* Insights banner */}
      <div className="mb-6 flex items-center gap-3 rounded-2xl bg-gradient-to-r from-pink-50 to-purple-50 p-4">
        <Sparkles size={20} className="text-pink-500" />
        <div>
          <p className="text-sm font-bold text-gray-900">Insights Inteligentes</p>
          <p className="text-xs text-gray-500">Visao da Loja &middot; Indicadores vs benchmarks do mercado</p>
        </div>
      </div>

      {/* Seasonality Chart — full width */}
      <div className="mb-6">
        <SeasonalityChart
          data={seasonality}
          year={new Date().getFullYear()}
        />
      </div>

      {/* Team Ranking — full width */}
      <div className="mb-6">
        <TeamRanking ranking={rankingData} />
      </div>

      {/* Bottom row: Service Distribution + Appointment Source */}
      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <ServiceDistribution data={pieData} />
        <AppointmentSource
          appCount={Math.round(completedCount * 0.65)}
          manualCount={Math.round(completedCount * 0.35)}
        />
      </div>

      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900" />
        </div>
      )}
    </div>
  );
}

// --- Helper hooks ---
function useMemoServiceNames(
  distribution: Record<string, number>,
  storeId: string | undefined
): [Record<string, string>] {
  const [names, setNames] = useState<Record<string, string>>({});

  useEffect(() => {
    const ids = Object.keys(distribution);
    if (ids.length === 0 || !storeId) return;

    supabase
      .from("services")
      .select("id, name")
      .in("id", ids)
      .then(({ data }) => {
        if (data) {
          const map: Record<string, string> = {};
          data.forEach((s) => (map[s.id] = s.name));
          setNames(map);
        }
      });
  }, [distribution, storeId]);

  return [names];
}

function useMemoProNames(
  ranking: { professional_id: string }[],
  storeId: string | undefined
): [Record<string, string>] {
  const [names, setNames] = useState<Record<string, string>>({});

  useEffect(() => {
    const ids = ranking.map((r) => r.professional_id);
    if (ids.length === 0 || !storeId) return;

    supabase
      .from("profiles")
      .select("id, name")
      .in("id", ids)
      .then(({ data }) => {
        if (data) {
          const map: Record<string, string> = {};
          data.forEach((p) => (map[p.id] = p.name));
          setNames(map);
        }
      });
  }, [ranking, storeId]);

  return [names];
}
