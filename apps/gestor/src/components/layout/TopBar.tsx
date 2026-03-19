"use client";

import { LogOut, Scissors, FlaskConical } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { useConfigStore } from "@/store/config-store";
import { useRouter } from "next/navigation";

const PRIMARY_COLOR = "#EC4899";

export function TopBar() {
  const profile = useAuthStore((s) => s.profile);
  const store = useAuthStore((s) => s.store);
  const logout = useAuthStore((s) => s.logout);
  const showMock = useConfigStore((s) => s.settings?.show_mock_data ?? true);
  const toggleMock = useConfigStore((s) => s.toggleMock);
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <header className="fixed right-0 top-0 z-30 flex h-[var(--topbar-h)] items-center justify-between border-b border-gray-200 bg-white px-6 lg:left-[var(--sidebar-w)]">
      {/* Mobile logo */}
      <div className="flex items-center gap-3 lg:hidden">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-lg text-white"
          style={{ backgroundColor: PRIMARY_COLOR }}
        >
          <Scissors size={16} />
        </div>
        <span className="text-lg font-bold text-gray-900">
          {store?.name || "Cheia de Charme"}
        </span>
      </div>

      {/* Desktop store name */}
      <div className="hidden lg:block">
        {store && (
          <span className="text-sm font-medium text-gray-500">
            {store.name}
          </span>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Mock data toggle */}
        {store && (
          <button
            onClick={() => toggleMock(store.id)}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all ${
              showMock
                ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                : "bg-gray-100 text-gray-400 hover:bg-gray-200"
            }`}
            title={showMock ? "Dados demo visíveis — clique para esconder" : "Dados demo ocultos — clique para mostrar"}
          >
            <FlaskConical size={14} />
            <span className="hidden sm:inline">Demo</span>
          </button>
        )}

        {profile && (
          <div className="hidden items-center gap-2 md:flex">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full text-white text-xs font-bold"
              style={{ backgroundColor: PRIMARY_COLOR }}
            >
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium text-gray-900">
              {profile.name}
            </span>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="rounded-xl p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          title="Sair"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
