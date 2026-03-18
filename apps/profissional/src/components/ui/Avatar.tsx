interface AvatarProps {
  name: string;
  url?: string | null;
  size?: "sm" | "md" | "lg";
}

const SIZES = {
  sm: "h-8 w-8 text-[11px]",
  md: "h-10 w-10 text-[13px]",
  lg: "h-14 w-14 text-[18px]",
};

function getInitials(name: string): string {
  const parts = name.split(" ").filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const COLORS = [
  "bg-pink-200 text-pink-800",
  "bg-purple-200 text-purple-800",
  "bg-rose-200 text-rose-800",
  "bg-fuchsia-200 text-fuchsia-800",
  "bg-violet-200 text-violet-800",
];

function getColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLORS[Math.abs(hash) % COLORS.length];
}

export function Avatar({ name, url, size = "md" }: AvatarProps) {
  if (url) {
    return (
      <img
        src={url}
        alt={name}
        className={`${SIZES[size]} rounded-full object-cover`}
      />
    );
  }

  return (
    <div
      className={`${SIZES[size]} ${getColor(name)} flex items-center justify-center rounded-full font-bold`}
    >
      {getInitials(name)}
    </div>
  );
}
