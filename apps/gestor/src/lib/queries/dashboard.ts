import { supabase } from "@/lib/supabase";

export type DateRange = "today" | "week" | "month" | "quarter" | "year";

function getDateBounds(range: DateRange): { start: string; end: string } {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let start: Date;
  const end = now;

  switch (range) {
    case "today":
      start = today;
      break;
    case "week": {
      const day = today.getDay();
      const diff = today.getDate() - day + (day === 0 ? -6 : 1);
      start = new Date(today);
      start.setDate(diff);
      break;
    }
    case "month":
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case "quarter": {
      const q = Math.floor(now.getMonth() / 3);
      start = new Date(now.getFullYear(), q * 3, 1);
      break;
    }
    case "year":
      start = new Date(now.getFullYear(), 0, 1);
      break;
  }

  return {
    start: start.toISOString(),
    end: end.toISOString(),
  };
}

export async function fetchDashboardKPIs(storeId: string, range: DateRange) {
  const { start, end } = getDateBounds(range);

  const { data: transactions } = await supabase
    .from("transactions")
    .select("amount_cents, commission_cents, professional_id, service_id, transaction_date")
    .eq("store_id", storeId)
    .eq("status", "completed")
    .gte("transaction_date", start)
    .lte("transaction_date", end);

  const { data: appointments } = await supabase
    .from("appointments")
    .select("id, status, professional_id, completed_at")
    .eq("store_id", storeId)
    .gte("created_at", start)
    .lte("created_at", end);

  const txs = transactions ?? [];
  const appts = appointments ?? [];

  const totalRevenue = txs.reduce((acc, t) => acc + t.amount_cents, 0);
  const totalCommission = txs.reduce((acc, t) => acc + t.commission_cents, 0);
  const completedCount = appts.filter((a) => a.status === "completed").length;
  const avgTicket = txs.length > 0 ? Math.round(totalRevenue / txs.length) : 0;

  // Revenue by day for chart
  const revenueByDay: Record<string, number> = {};
  txs.forEach((t) => {
    const day = t.transaction_date.split("T")[0];
    revenueByDay[day] = (revenueByDay[day] || 0) + t.amount_cents;
  });

  const revenueChart = Object.entries(revenueByDay)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, value]) => ({
      date,
      value: value / 100,
    }));

  // Service distribution
  const serviceCount: Record<string, number> = {};
  txs.forEach((t) => {
    if (t.service_id) {
      serviceCount[t.service_id] = (serviceCount[t.service_id] || 0) + 1;
    }
  });

  // Professional ranking
  const proRevenue: Record<string, { revenue: number; count: number }> = {};
  txs.forEach((t) => {
    if (t.professional_id) {
      if (!proRevenue[t.professional_id]) {
        proRevenue[t.professional_id] = { revenue: 0, count: 0 };
      }
      proRevenue[t.professional_id].revenue += t.amount_cents;
      proRevenue[t.professional_id].count += 1;
    }
  });

  const ranking = Object.entries(proRevenue)
    .sort(([, a], [, b]) => b.revenue - a.revenue)
    .map(([id, data]) => ({
      professional_id: id,
      revenue: data.revenue,
      count: data.count,
    }));

  return {
    totalRevenue,
    totalCommission,
    completedCount,
    avgTicket,
    revenueChart,
    serviceDistribution: serviceCount,
    ranking,
  };
}
