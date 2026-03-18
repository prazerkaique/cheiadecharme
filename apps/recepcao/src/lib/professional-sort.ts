import type { ReceptionProfessional } from "@/types/reception";
import type { ScheduleSlot, ProfessionalSuggestionResult, SuggestionReason } from "@/types/schedule";

const STATUS_ORDER: Record<string, number> = {
  available: 0,
  busy: 1,
  "busy-queue": 2,
};

/**
 * Sort professionals by: status (available first) → queue count (less first) → name
 */
export function sortProfessionals(
  profs: ReceptionProfessional[],
  preferredCategory?: string,
): ReceptionProfessional[] {
  return [...profs].sort((a, b) => {
    // Preferred category first
    if (preferredCategory) {
      const aMatch = a.specialty === preferredCategory ? 0 : 1;
      const bMatch = b.specialty === preferredCategory ? 0 : 1;
      if (aMatch !== bMatch) return aMatch - bMatch;
    }

    // Status order
    const aStatus = STATUS_ORDER[a.status] ?? 3;
    const bStatus = STATUS_ORDER[b.status] ?? 3;
    if (aStatus !== bStatus) return aStatus - bStatus;

    // Queue count (less first)
    if (a.queueCount !== b.queueCount) return a.queueCount - b.queueCount;

    // Completed today (less first — balancear carga)
    if (a.completedToday !== b.completedToday) return a.completedToday - b.completedToday;

    // Alphabetical
    return a.name.localeCompare(b.name);
  });
}

/**
 * Get the current in_progress slot for a professional
 */
export function getCurrentService(prof: ReceptionProfessional): ScheduleSlot | null {
  return prof.schedule?.find((s) => s.status === "in_progress") ?? null;
}

/**
 * Get the next available time for a professional based on their schedule
 */
export function getNextAvailableTime(prof: ReceptionProfessional, now: Date): Date | null {
  if (!prof.schedule || prof.schedule.length === 0) return null;

  if (prof.status === "available") {
    // Check if there's a gap before the next scheduled slot
    const futureSlots = prof.schedule
      .filter((s) => s.status === "scheduled" || s.status === "waiting")
      .sort((a, b) => a.scheduled_at.localeCompare(b.scheduled_at));

    if (futureSlots.length === 0) return now;

    const nextStart = new Date(futureSlots[0].scheduled_at);
    if (nextStart > now) return now; // Available right now
    return null;
  }

  // Busy or busy-queue: find when current service ends
  const currentSlot = getCurrentService(prof);
  if (currentSlot) {
    return new Date(currentSlot.estimated_end_at);
  }

  // If waiting status, find the waiting slot
  const waitingSlot = prof.schedule?.find((s) => s.status === "waiting");
  if (waitingSlot) {
    const endTime = new Date(waitingSlot.estimated_end_at);
    return endTime;
  }

  return null;
}

/**
 * Count slots remaining today (scheduled + waiting)
 */
function getRemainingSlotCount(prof: ReceptionProfessional): number {
  return prof.schedule?.filter(
    (s) => s.status === "scheduled" || s.status === "waiting",
  ).length ?? 0;
}

/**
 * Suggest top professionals for a service category
 */
export function suggestProfessionals(
  profs: ReceptionProfessional[],
  serviceCategory: string,
  now: Date,
  limit: number = 3,
): ProfessionalSuggestionResult[] {
  const scored: ProfessionalSuggestionResult[] = profs.map((prof) => {
    let score = 0;
    const reasons: SuggestionReason[] = [];

    // Specialty match: +40 points
    if (prof.specialty === serviceCategory) {
      score += 40;
      reasons.push("specialty_match");
    }

    // Available now: +30 points
    if (prof.status === "available") {
      score += 30;
      reasons.push("available_now");
    } else if (prof.status === "busy") {
      score += 10; // Will be available soon
    }
    // busy-queue: +0

    // Low queue: +20 for 0, +15 for 1, +10 for 2, etc
    const queuePenalty = Math.min(prof.queueCount, 4);
    const queueScore = Math.max(0, 20 - queuePenalty * 5);
    if (queueScore >= 15) {
      score += queueScore;
      reasons.push("low_queue");
    } else {
      score += queueScore;
    }

    // Earliest available: +10 for available now, scaled for future
    const nextAvail = getNextAvailableTime(prof, now);
    if (nextAvail) {
      const minutesUntil = Math.max(0, (nextAvail.getTime() - now.getTime()) / 60_000);
      if (minutesUntil === 0) {
        score += 10;
        if (!reasons.includes("available_now")) reasons.push("earliest_available");
      } else if (minutesUntil < 30) {
        score += 5;
        reasons.push("earliest_available");
      }
    }

    // Fewer remaining slots = more availability: +0 to +5
    const remaining = getRemainingSlotCount(prof);
    score += Math.max(0, 5 - remaining);

    // Fewest completed today: +0 to +15 (balancear carga)
    // Quem atendeu menos ganha mais pontos
    const completedPenalty = Math.min(prof.completedToday, 6);
    const completedScore = Math.max(0, 15 - completedPenalty * 2.5);
    score += completedScore;
    if (completedScore >= 10) {
      reasons.push("fewest_completed");
    }

    return {
      professional_id: prof.id,
      professional_name: prof.name,
      reasons,
      score,
      next_available_at: nextAvail?.toISOString() ?? null,
      queue_count: prof.queueCount,
      completed_today: prof.completedToday,
    };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Get completed count for today
 */
export function getCompletedCount(prof: ReceptionProfessional): number {
  return prof.schedule?.filter((s) => s.status === "completed").length ?? 0;
}
