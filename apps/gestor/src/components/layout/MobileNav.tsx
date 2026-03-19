"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Scissors,
  DollarSign,
  UserCheck,
  Gamepad2,
} from "lucide-react";

const PRIMARY_COLOR = "#EC4899";

const TABS = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/equipe", label: "Equipe", icon: Users },
  { href: "/servicos", label: "Servicos", icon: Scissors },
  { href: "/vendas", label: "Vendas", icon: DollarSign },
  { href: "/clientes", label: "Clientes", icon: UserCheck },
  { href: "/game", label: "Game", icon: Gamepad2 },
] as const;

export function MobileNav() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex h-20 items-center justify-between border-t border-gray-200 bg-white/90 px-6 pb-safe pt-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] backdrop-blur-lg lg:hidden">
      {TABS.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className="flex flex-col items-center gap-1 px-2 py-1.5 transition-colors"
        >
          <Icon
            size={22}
            style={isActive(href) ? { color: PRIMARY_COLOR } : undefined}
            className={isActive(href) ? "" : "text-gray-400"}
          />
          <span
            className="text-[10px] font-medium"
            style={isActive(href) ? { color: PRIMARY_COLOR } : undefined}
          >
            {!isActive(href) && <span className="text-gray-400">{label}</span>}
            {isActive(href) && label}
          </span>
        </Link>
      ))}
    </nav>
  );
}
