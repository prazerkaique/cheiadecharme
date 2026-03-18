"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import type { Profile } from "@cheia/types";

const PRIMARY_COLOR = "#EC4899";

interface ProfessionalListProps {
  professionals: Profile[];
}

export function ProfessionalList({ professionals }: ProfessionalListProps) {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Equipe</h1>
          <p className="text-sm text-gray-500">
            {professionals.length} profissionais
          </p>
        </div>
        <Link
          href="/equipe/novo"
          className="flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus size={18} />
          Novo Profissional
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {professionals.map((pro) => (
          <Link
            key={pro.id}
            href={`/equipe/${pro.id}`}
            className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm transition-transform hover:scale-[1.02] hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white text-lg font-bold"
                style={{ backgroundColor: PRIMARY_COLOR }}
              >
                {pro.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-gray-900">
                  {pro.name}
                </p>
                <p className="text-xs text-gray-500">
                  {pro.specialty || "Geral"}
                </p>
              </div>
              <span
                className={`rounded-lg px-2 py-0.5 text-[10px] font-bold ${
                  pro.is_active
                    ? "bg-green-50 text-green-600"
                    : "bg-red-50 text-red-500"
                }`}
              >
                {pro.is_active ? "Ativo" : "Inativo"}
              </span>
            </div>
            <div className="mt-3 flex justify-between text-xs text-gray-500">
              <span>Comissao: {pro.commission_rate}%</span>
              {pro.phone && <span>{pro.phone}</span>}
            </div>
          </Link>
        ))}
      </div>

      {professionals.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <p className="text-sm">Nenhum profissional cadastrado</p>
        </div>
      )}
    </div>
  );
}
