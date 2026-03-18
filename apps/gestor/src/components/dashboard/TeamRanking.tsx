"use client";

import { useState } from "react";
import { Trophy, Star, ChevronDown, ChevronUp } from "lucide-react";
import { formatPrice } from "@/lib/format";

interface TeamRankingProps {
  ranking: {
    professional_id: string;
    name: string;
    avatar_url: string | null;
    revenue: number;
    count: number;
  }[];
}

const MEDAL_COLORS = ["#F59E0B", "#9CA3AF", "#B45309"];
const PRIMARY_COLOR = "#EC4899";

export function TeamRanking({ ranking }: TeamRankingProps) {
  const [showStats, setShowStats] = useState(true);

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy size={18} style={{ color: PRIMARY_COLOR }} />
          <h3 className="text-base font-bold text-gray-900">Ranking da Equipe</h3>
          <span className="rounded-lg bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-500">
            {ranking.length}
          </span>
        </div>
        <button
          onClick={() => setShowStats(!showStats)}
          className="flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-gray-600"
        >
          {showStats ? "Ocultar" : "Mostrar"} Estatisticas
          {showStats ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {ranking.length > 0 ? (
        <div className="space-y-2">
          {ranking.map((pro, i) => (
            <div
              key={pro.professional_id}
              className="flex items-center gap-3 rounded-2xl bg-gray-50 p-3 transition-colors hover:bg-gray-100"
            >
              {/* Position */}
              <div className="flex h-7 w-7 shrink-0 items-center justify-center">
                {i < 3 ? (
                  <span className="text-lg font-bold" style={{ color: MEDAL_COLORS[i] }}>
                    {i + 1}
                  </span>
                ) : (
                  <span className="text-sm font-bold text-gray-400">{i + 1}</span>
                )}
              </div>

              {/* Avatar */}
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white text-sm font-bold"
                style={{ backgroundColor: PRIMARY_COLOR }}
              >
                {pro.name.charAt(0).toUpperCase()}
              </div>

              {/* Name + rating */}
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-semibold text-gray-900">
                  {pro.name}
                </p>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={10}
                      className={star <= 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                    />
                  ))}
                </div>
              </div>

              {/* Stats */}
              {showStats && (
                <div className="flex items-center gap-4 text-right">
                  <div>
                    <p className="text-xs text-gray-400">{pro.count} atend.</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      {formatPrice(pro.revenue)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="py-8 text-center text-sm text-gray-400">
          Sem dados no periodo
        </p>
      )}
    </div>
  );
}
