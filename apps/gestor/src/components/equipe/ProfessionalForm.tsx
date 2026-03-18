"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Save, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const professionalSchema = z.object({
  name: z.string().min(2, "Nome obrigatorio"),
  email: z.string().email("Email invalido").or(z.literal("")),
  phone: z.string(),
  specialty: z.string(),
  commission_rate: z.coerce.number().min(0).max(100),
  is_active: z.boolean(),
});

export type ProfessionalFormData = z.infer<typeof professionalSchema>;

interface ProfessionalFormProps {
  defaultValues?: Partial<ProfessionalFormData>;
  onSubmit: (data: ProfessionalFormData) => Promise<void>;
  title: string;
  submitLabel: string;
}

export function ProfessionalForm({
  defaultValues,
  onSubmit,
  title,
  submitLabel,
}: ProfessionalFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfessionalFormData>({
    resolver: zodResolver(professionalSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      specialty: "",
      commission_rate: 50,
      is_active: true,
      ...defaultValues,
    },
  });

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="rounded-xl p-2 text-gray-400 transition-colors hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-2xl rounded-3xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="mb-2 block text-xs font-bold uppercase text-gray-500">
              Nome *
            </label>
            <input
              {...register("name")}
              className="w-full rounded-xl border-none bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-black"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Email + Phone */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase text-gray-500">
                Email
              </label>
              <input
                type="email"
                {...register("email")}
                className="w-full rounded-xl border-none bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-black"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold uppercase text-gray-500">
                Telefone
              </label>
              <input
                {...register("phone")}
                className="w-full rounded-xl border-none bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          {/* Specialty + Commission */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase text-gray-500">
                Especialidade
              </label>
              <input
                {...register("specialty")}
                placeholder="Ex: Colorista, Barbeiro"
                className="w-full rounded-xl border-none bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold uppercase text-gray-500">
                Comissao (%)
              </label>
              <input
                type="number"
                min={0}
                max={100}
                step={0.5}
                {...register("commission_rate")}
                className="w-full rounded-xl border-none bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          {/* Active */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              {...register("is_active")}
              className="h-5 w-5 rounded accent-black"
            />
            <span className="text-sm font-medium text-gray-900">
              Profissional ativo
            </span>
          </label>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 rounded-xl bg-black px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            <Save size={18} />
            {isSubmitting ? "Salvando..." : submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}
