"use client";

import { useState, useEffect, useCallback } from "react";
import { isSupabaseConfigured } from "@/lib/supabase";

interface UseFallbackQueryResult<T> {
  data: T;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useFallbackQuery<T>(
  queryFn: () => Promise<T>,
  mockData: T
): UseFallbackQueryResult<T> {
  const [data, setData] = useState<T>(mockData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setData(mockData);
      return;
    }

    setLoading(true);
    try {
      const result = await queryFn();
      setData(result);
      setError(null);
    } catch (err) {
      console.error("[useFallbackQuery] Supabase error, using mock:", err);
      setData(mockData);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [queryFn, mockData]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
