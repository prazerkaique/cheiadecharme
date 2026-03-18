"use client";

import { useEffect, useState, useMemo } from "react";
import { Plus, Edit2, Trash2, Scissors, Tag, CreditCard, Info } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { useServicosStore } from "@/store/servicos-store";
import { useUIStore } from "@/store/ui-store";
import { createService, updateService } from "@/lib/queries/services";
import { formatPrice, formatDuration } from "@/lib/format";
import { ServiceModal, type ServiceFormData } from "@/components/servicos/ServiceModal";
import type { Service } from "@cheia/types";

type Tab = "services" | "plans" | "promos";

export default function ServicosPage() {
  const store = useAuthStore((s) => s.store);
  const { services, loading, fetch: fetchAll, setEditingId } = useServicosStore();
  const addToast = useUIStore((s) => s.addToast);

  const [activeTab, setActiveTab] = useState<Tab>("services");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  useEffect(() => {
    if (store?.id) fetchAll(store.id);
  }, [store?.id, fetchAll]);

  const openCreate = () => {
    setEditingService(null);
    setModalOpen(true);
  };

  const openEdit = (service: Service) => {
    setEditingService(service);
    setModalOpen(true);
  };

  const handleSubmit = async (data: ServiceFormData) => {
    if (!store?.id) return;
    try {
      if (editingService) {
        await updateService(editingService.id, {
          name: data.name,
          category: data.category,
          duration_minutes: data.duration_minutes,
          price_cents: data.price_cents,
          description: data.description || undefined,
        });
        addToast("Servico atualizado", "success");
      } else {
        await createService(store.id, {
          name: data.name,
          category: data.category,
          duration_minutes: data.duration_minutes,
          price_cents: data.price_cents,
          description: data.description || undefined,
        });
        addToast("Servico criado", "success");
      }
      fetchAll(store.id);
    } catch {
      addToast("Erro ao salvar servico", "error");
    }
  };

  const handleToggleActive = async (s: Service) => {
    if (!store?.id) return;
    await updateService(s.id, { is_active: !s.is_active });
    addToast(s.is_active ? "Servico desativado" : "Servico ativado", "success");
    fetchAll(store.id);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl pb-20">
      {/* Header */}
      <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Servicos & Planos</h1>
          <p className="text-sm text-gray-500">{services.length} servicos cadastrados</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-80"
        >
          <Plus size={18} />
          {activeTab === "services" ? "Novo Servico" : activeTab === "plans" ? "Novo Plano" : "Nova Promocao"}
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex rounded-xl bg-gray-100 p-1">
        {([
          { key: "services" as Tab, label: "Servicos", icon: Scissors },
          { key: "plans" as Tab, label: "Planos", icon: CreditCard },
          { key: "promos" as Tab, label: "Promocoes", icon: Tag },
        ]).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-all ${
              activeTab === key
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {/* TAB: Services */}
      {activeTab === "services" && (
        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-100 bg-gray-50 text-xs font-bold uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-6 py-4">Nome</th>
                  <th className="px-6 py-4">Categoria</th>
                  <th className="px-6 py-4">Duracao</th>
                  <th className="px-6 py-4">Preco</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Acoes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {services.length > 0 ? (
                  services.map((service) => (
                    <tr
                      key={service.id}
                      className={`transition-colors hover:bg-gray-50 ${!service.is_active ? "opacity-50" : ""}`}
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {service.name}
                      </td>
                      <td className="px-6 py-4">
                        <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                          {service.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {formatDuration(service.duration_minutes)}
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        {formatPrice(service.price_cents)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleToggleActive(service)}
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold transition-colors ${
                            service.is_active
                              ? "bg-green-50 text-green-600 hover:bg-green-100"
                              : "bg-red-50 text-red-500 hover:bg-red-100"
                          }`}
                        >
                          {service.is_active ? "Ativo" : "Inativo"}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEdit(service)}
                            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                          >
                            <Edit2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center italic text-gray-400">
                      Nenhum servico cadastrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: Plans */}
      {activeTab === "plans" && (
        <PlansTab />
      )}

      {/* TAB: Promos */}
      {activeTab === "promos" && (
        <PromosTab />
      )}

      {/* Service Modal */}
      <ServiceModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingService(null); }}
        onSubmit={handleSubmit}
        service={editingService}
      />
    </div>
  );
}

/* ─── Plans Tab (placeholder) ─── */
function PlansTab() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Example plan cards */}
      <div className="relative rounded-2xl border border-gray-100 bg-gray-50 p-6">
        <div className="mb-3">
          <h3 className="text-xl font-bold text-gray-900">Clube VIP</h3>
          <p className="text-sm text-gray-500">Acesso ilimitado aos servicos selecionados</p>
        </div>
        <div className="mb-4 flex items-baseline gap-1">
          <span className="text-sm font-bold text-gray-400">R$</span>
          <span className="text-3xl font-bold text-gray-900">199</span>
          <span className="text-xs text-gray-400">/ mensal</span>
        </div>
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">
            Servicos inclusos
          </p>
          <div className="flex flex-wrap gap-2">
            {["Corte Feminino", "Escova", "Hidratacao"].map((s) => (
              <span
                key={s}
                className="rounded-md border border-gray-100 bg-white px-2 py-1 text-xs font-medium text-gray-600"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Empty state / CTA */}
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 p-6 text-center">
        <CreditCard size={32} className="mb-3 text-gray-300" />
        <p className="text-sm font-medium text-gray-500">Crie planos de assinatura</p>
        <p className="mt-1 text-xs text-gray-400">Fideleze seus clientes com planos mensais</p>
      </div>
    </div>
  );
}

/* ─── Promos Tab (placeholder) ─── */
function PromosTab() {
  return (
    <div className="space-y-4">
      {/* Example promo */}
      <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-purple-50 p-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-600">
            <Tag size={20} />
          </div>
          <div>
            <p className="font-bold text-gray-900">
              Terca da Beleza
              <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700">
                ATIVA
              </span>
            </p>
            <p className="mt-1 flex items-center gap-2 text-xs text-gray-500">
              <span className="font-semibold text-purple-600">20% OFF</span>
              &middot; Toda terca-feira
            </p>
          </div>
        </div>
      </div>

      {/* Empty state / Info */}
      <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4">
        <Info size={20} className="shrink-0 text-gray-400" />
        <div>
          <p className="text-sm font-medium text-gray-600">Promocoes em breve</p>
          <p className="text-xs text-gray-400">
            Configure descontos por dia da semana, horario ou servico especifico.
          </p>
        </div>
      </div>
    </div>
  );
}
