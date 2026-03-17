"use client";

import {
  Clock, Plus, Check,
  Scissors, Hand, Eye, Palette, Flower, Sparkle,
  type Icon,
} from "@phosphor-icons/react";

import { formatCharmes } from "@/lib/format";

/** Map category → accent color for left bar & placeholder */
const CATEGORY_COLORS: Record<string, string> = {
  Cabelo: "#D94B8C",
  Unhas: "#E87AAF",
  Sobrancelha: "#C2185B",
  Maquiagem: "#F5B8D3",
  Depilação: "#7B2D52",
  Tratamentos: "#9D6B9E",
};

const CATEGORY_ICONS: Record<string, Icon> = {
  Cabelo: Scissors,
  Unhas: Hand,
  Sobrancelha: Eye,
  Maquiagem: Palette,
  Depilação: Flower,
  Tratamentos: Sparkle,
};

function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] ?? "#D94B8C";
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ServiceCardProps {
  name: string;
  category: string;
  priceCharmes: number;
  durationMinutes: number;
  imageUrl: string | null;
  inCart: boolean;
  onAdd: () => void;
}

// ---------------------------------------------------------------------------
// Component — New layout with photo
// ---------------------------------------------------------------------------

export default function ServiceCard({
  name,
  category,
  priceCharmes,
  durationMinutes,
  imageUrl,
  inCart,
  onAdd,
}: ServiceCardProps) {
  const categoryColor = getCategoryColor(category);

  return (
    <div
      className={[
        "relative w-full text-left min-h-[180px]",
        "rounded-[20px] p-5",
        "glass",
        inCart ? "card-elevated-active bg-cta/[0.04]" : "card-elevated",
        "transition-all duration-200",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Category color bar — left side accent */}
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-1.5 rounded-l-[20px]"
        style={{ background: categoryColor }}
      />

      {/* Main content row: photo + info */}
      <div className="flex gap-5">
        {/* Photo / Placeholder */}
        <div
          className="shrink-0 rounded-[14px] overflow-hidden"
          style={{ width: 180, height: 130 }}
        >
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover"
              draggable={false}
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${categoryColor}25, ${categoryColor}10)`,
              }}
            >
              {(() => {
                const Icon = CATEGORY_ICONS[category] ?? Scissors;
                return <Icon size={48} weight="light" style={{ color: categoryColor }} />;
              })()}
            </div>
          )}
        </div>

        {/* Info column */}
        <div className="flex flex-col flex-1 min-w-0 justify-between py-1">
          <div className="flex flex-col gap-1.5">
            <span
              className="text-[28px] font-display font-bold leading-tight text-brand-text line-clamp-2"
            >
              {name}
            </span>

            <span className="text-[26px] font-bold font-body text-cta">
              {formatCharmes(priceCharmes)}
            </span>

            <span className="flex items-center gap-1.5 text-[22px] font-body text-brand-text-muted">
              <Clock size={18} weight="light" />
              {durationMinutes} min
            </span>
          </div>
        </div>
      </div>

      {/* Add / In cart button */}
      <button
        type="button"
        onPointerDown={(e) => {
          e.preventDefault();
          if (!inCart) onAdd();
        }}
        className={[
          "w-full mt-4 flex items-center justify-center gap-2",
          "min-h-[64px] rounded-[14px]",
          "font-body text-[24px] font-semibold",
          "transition-all duration-150",
          "active:scale-[0.97]",
          inCart
            ? "bg-cta/10 text-cta border border-cta/30"
            : "bg-gradient-to-r from-primary to-primary-soft text-white glow-primary",
        ].join(" ")}
        disabled={inCart}
      >
        {inCart ? (
          <>
            <Check size={22} weight="bold" />
            No carrinho
          </>
        ) : (
          <>
            <Plus size={22} weight="bold" />
            Adicionar
          </>
        )}
      </button>
    </div>
  );
}
