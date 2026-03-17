"use client";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ProfessionalCardProps {
  name: string;
  avatarUrl: string | null;
  specialty: string | null;
  selected: boolean;
  onSelect: () => void;
}

// ---------------------------------------------------------------------------
// Avatar fallback – generates initials from name
// ---------------------------------------------------------------------------

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0]?.slice(0, 2).toUpperCase() ?? "?";
  return (
    (parts[0]?.[0] ?? "") + (parts[parts.length - 1]?.[0] ?? "")
  ).toUpperCase();
}

// ---------------------------------------------------------------------------
// Component — Horizontal layout with larger touch targets
// ---------------------------------------------------------------------------

export default function ProfessionalCard({
  name,
  avatarUrl,
  specialty,
  selected,
  onSelect,
}: ProfessionalCardProps) {
  return (
    <button
      type="button"
      onPointerDown={(e) => {
        e.preventDefault();
        onSelect();
      }}
      className={[
        // Layout — horizontal: avatar left, info right
        "flex items-center gap-5",
        "w-full min-h-[240px]",
        "p-[28px]",
        // Shape
        "rounded-[20px]",
        // Glass base
        "glass",
        // Elevation
        selected ? "card-elevated-active" : "card-elevated",
        // Selected tint + ring
        selected ? "bg-cta/[0.04] ring-2 ring-cta" : "",
        // Transition
        "transition-all duration-200",
        // Focus ring
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-cta",
        // Touch feedback
        "active:scale-[0.97]",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* ------------------------------------------------------------------ */}
      {/* Avatar — 100px with gradient placeholder                           */}
      {/* ------------------------------------------------------------------ */}
      <div className="relative shrink-0">
        <div
          className={[
            "w-[100px] h-[100px] rounded-full overflow-hidden",
            "border-2",
            selected ? "border-cta" : "border-brand-border/50",
          ].join(" ")}
        >
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt={name}
              className="w-full h-full object-cover"
              draggable={false}
            />
          ) : (
            <span
              className="w-full h-full flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, rgba(217,75,140,0.25) 0%, rgba(194,24,91,0.15) 100%)",
              }}
            >
              <span className="text-[32px] font-display font-bold text-brand-text">
                {getInitials(name)}
              </span>
            </span>
          )}
        </div>

        {/* Selected check badge */}
        {selected && (
          <span
            aria-hidden="true"
            className="absolute bottom-0 right-0 translate-x-1 translate-y-1 flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-cta to-primary shadow-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth={3.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-3.5 h-3.5"
              aria-hidden="true"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </span>
        )}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Name + specialty — right side                                       */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex flex-col gap-1.5 min-w-0 text-left">
        <span
          className={[
            "text-[26px] font-semibold font-body leading-tight line-clamp-2",
            selected ? "text-cta" : "text-brand-text",
          ].join(" ")}
        >
          {name}
        </span>

        {specialty && (
          <span className="text-[22px] font-body text-brand-text-muted/70 leading-tight line-clamp-1">
            {specialty}
          </span>
        )}
      </div>
    </button>
  );
}
