import { supabase } from "@/lib/supabase";
import type { Transaction } from "@cheia/types";

export type SalesDateRange = "today" | "week" | "month" | "quarter" | "year";

function getDateBounds(range: SalesDateRange): { start: string; end: string } {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let start: Date;

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

  return { start: start.toISOString(), end: now.toISOString() };
}

export async function fetchTransactions(storeId: string, range: SalesDateRange) {
  const { start, end } = getDateBounds(range);

  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("store_id", storeId)
    .gte("transaction_date", start)
    .lte("transaction_date", end)
    .order("transaction_date", { ascending: false });

  if (error) throw error;
  return data as Transaction[];
}
