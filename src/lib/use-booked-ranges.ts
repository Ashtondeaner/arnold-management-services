import { useEffect, useMemo, useState } from "react";
import type { DateRange } from "@/data/pricing";
import { fetchBookedRangesFn } from "@/lib/booking-server";
import { useBookingStore } from "@/lib/booking-store";

/** Seeded owner blocks + confirmed reservations (server and this browser). */
export function useBookedRanges(propertyId: string): DateRange[] {
  const local = useBookingStore((s) => s.reservations);
  const [remote, setRemote] = useState<DateRange[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetchBookedRangesFn({ data: { propertyId } })
      .then((rows) => {
        if (!cancelled) setRemote(rows);
      })
      .catch(() => {
        if (!cancelled) setRemote([]);
      });
    return () => {
      cancelled = true;
    };
  }, [propertyId, local]);

  return useMemo(() => {
    const localRanges = local
      .filter((r) => r.propertyId === propertyId && r.status === "confirmed")
      .map((r) => ({
        start: r.checkIn,
        end: r.checkOut,
        reason: "Guest reservation",
      }));
    const seen = new Set<string>();
    const merged: DateRange[] = [];
    for (const range of [...remote, ...localRanges]) {
      const key = `${range.start}:${range.end}`;
      if (seen.has(key)) continue;
      seen.add(key);
      merged.push(range);
    }
    return merged;
  }, [local, remote, propertyId]);
}
