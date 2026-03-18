"use client";

import { useReceptionStore } from "@/store/reception-store";
import { QueueCardGroup } from "./QueueCard";
import { QueueEmptyState } from "./QueueEmptyState";
import { QueueFilters } from "./QueueFilters";
import { SearchInput } from "../ui/SearchInput";

export function QueueList() {
  // Subscribe to the actual data so we re-render when queue/filter/search change
  const queue = useReceptionStore((s) => s.queue);
  const queueFilter = useReceptionStore((s) => s.queueFilter);
  const searchQuery = useReceptionStore((s) => s.searchQuery);
  const getGroupedQueue = useReceptionStore((s) => s.getGroupedQueue);
  const groups = getGroupedQueue();

  return (
    <div className="flex flex-col gap-2">
      {/* Mobile: show filters + search inline */}
      <div className="flex flex-col gap-3 md:hidden mb-2">
        <SearchInput />
        <QueueFilters />
      </div>

      {groups.length === 0 ? (
        <QueueEmptyState />
      ) : (
        groups.map((group) => (
          <QueueCardGroup key={group.clientId} items={group.items} />
        ))
      )}
    </div>
  );
}
