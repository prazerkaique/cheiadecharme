"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { MobileNav } from "@/components/layout/MobileNav";
import { ToastContainer } from "@/components/ui/Toast";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const session = useAuthStore((s) => s.session);
  const loading = useAuthStore((s) => s.loading);
  const init = useAuthStore((s) => s.init);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (!loading && !session) {
      router.replace("/login");
    }
  }, [loading, session, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900" />
      </div>
    );
  }

  if (!session) return null;

  return (
    <>
      <Sidebar />
      <TopBar />
      <main className="min-h-screen bg-gray-50 pt-[var(--topbar-h)] pb-24 lg:pb-8 lg:pl-[var(--sidebar-w)]">
        <div className="mx-auto max-w-[var(--content-max-w)] px-4 py-6 lg:px-8">
          {children}
        </div>
      </main>
      <MobileNav />
      <ToastContainer />
    </>
  );
}
