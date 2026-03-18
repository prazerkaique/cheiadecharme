"use client";

import { useTVStore } from "@/store/tv-store";
import { TVHeader } from "@/components/tv/TVHeader";
import { CategoryColumn } from "@/components/tv/CategoryColumn";
import { TickerBar } from "@/components/tv/TickerBar";
import { TVFooter } from "@/components/tv/TVFooter";

export function TVShell() {
  const categories = useTVStore((s) => s.categories);

  return (
    <div className="gradient-mesh-animated texture-noise flex h-screen w-screen flex-col">
      <TVHeader />

      <main
        className="relative z-10 flex flex-1 gap-[var(--tv-column-gap)] overflow-hidden px-[var(--tv-margin-x)] py-4"
      >
        {categories.map((cat) => (
          <CategoryColumn key={cat.id} category={cat} />
        ))}
      </main>

      <TickerBar />
      <TVFooter />
    </div>
  );
}
