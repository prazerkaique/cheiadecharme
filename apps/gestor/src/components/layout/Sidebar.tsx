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
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useUIStore } from "@/store/ui-store";
import { useAuthStore } from "@/store/auth-store";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/equipe", label: "Equipe", icon: Users },
  { href: "/servicos", label: "Servicos", icon: Scissors },
  { href: "/vendas", label: "Vendas", icon: DollarSign },
  { href: "/clientes", label: "Clientes", icon: UserCheck },
  { href: "/game", label: "Cheia de Sorte", icon: Gamepad2 },
] as const;

const PRIMARY_COLOR = "#EC4899";

export function Sidebar() {
  const pathname = usePathname();
  const collapsed = useUIStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const profile = useAuthStore((s) => s.profile);
  const store = useAuthStore((s) => s.store);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <aside
      className="fixed left-0 top-0 z-40 hidden h-screen flex-col border-r border-gray-200 bg-white transition-all duration-300 lg:flex"
      style={{ width: collapsed ? "var(--sidebar-collapsed-w)" : "var(--sidebar-w)" }}
    >
      {/* Logo + Collapse */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white font-bold text-xl"
            style={{ backgroundColor: PRIMARY_COLOR }}
          >
            C
          </div>
          {!collapsed && (
            <span className="truncate text-base font-bold text-gray-900">
              {store?.name || "Cheia de Charme"}
            </span>
          )}
        </div>
        <button
          onClick={toggleSidebar}
          className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* User info */}
      {profile && !collapsed && (
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white text-sm font-bold"
            style={{ backgroundColor: PRIMARY_COLOR }}
          >
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-gray-900">{profile.name}</p>
            <p className="truncate text-xs text-gray-500">{profile.role}</p>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-1 px-3 pt-4">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
              isActive(href)
                ? "text-white shadow-md"
                : "text-gray-500 hover:bg-gray-100"
            }`}
            style={isActive(href) ? { backgroundColor: PRIMARY_COLOR } : undefined}
          >
            <Icon size={20} />
            {!collapsed && <span className="whitespace-nowrap">{label}</span>}
          </Link>
        ))}

        <div className="mt-auto">
          <div className="mx-3 my-2 h-px bg-gray-100" />
          <Link
            href="/configuracoes"
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
              isActive("/configuracoes")
                ? "text-white shadow-md"
                : "text-gray-500 hover:bg-gray-100"
            }`}
            style={isActive("/configuracoes") ? { backgroundColor: PRIMARY_COLOR } : undefined}
          >
            <Settings size={20} />
            {!collapsed && <span>Configuracoes</span>}
          </Link>
        </div>
      </nav>

      <div className="h-4" />
    </aside>
  );
}
