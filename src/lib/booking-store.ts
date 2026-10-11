import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DateRange } from "@/data/pricing";

export type BookingGuest = {
  fullName: string;
  email: string;
  phone: string;
  message?: string;
};

export type Reservation = {
  id: string;
  confirmationCode: string;
  propertyId: string;
  propertySlug: string;
  propertyName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  subtotal: number;
  cleaningFee: number;
  tax: number;
  total: number;
  securityDeposit: number;
  currency: "USD";
  status: "confirmed" | "cancelled";
  guest: BookingGuest;
  createdAt: string;
  emailStatus?: "sent" | "queued" | "failed" | null;
};

type BookingState = {
  reservations: Reservation[];
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  rememberReservation: (reservation: Reservation) => void;
  cancelLocal: (id: string) => void;
  getById: (id: string) => Reservation | undefined;
  getByCode: (code: string) => Reservation | undefined;
  getBookedRanges: (propertyId: string) => DateRange[];
};

function mergeReservations(
  a: Reservation[] = [],
  b: Reservation[] = [],
): Reservation[] {
  const byId = new Map<string, Reservation>();
  for (const r of a) byId.set(r.id, r);
  for (const r of b) byId.set(r.id, r);
  return [...byId.values()].sort((x, y) =>
    y.createdAt.localeCompare(x.createdAt),
  );
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      reservations: [],
      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),

      rememberReservation: (reservation) => {
        set((s) => ({
          reservations: mergeReservations(s.reservations, [reservation]),
        }));
      },

      cancelLocal: (id) => {
        set((s) => ({
          reservations: s.reservations.map((r) =>
            r.id === id ? { ...r, status: "cancelled" as const } : r,
          ),
        }));
      },

      getById: (id) => get().reservations.find((r) => r.id === id),

      getByCode: (code) =>
        get().reservations.find(
          (r) => r.confirmationCode.toLowerCase() === code.toLowerCase(),
        ),

      getBookedRanges: (propertyId) =>
        get()
          .reservations.filter(
            (r) => r.propertyId === propertyId && r.status === "confirmed",
          )
          .map((r) => ({
            start: r.checkIn,
            end: r.checkOut,
            reason: "Guest reservation",
          })),
    }),
    {
      name: "ams-booking-engine-v2",
      partialize: (s) => ({ reservations: s.reservations }),
      merge: (persisted, current) => {
        const stored = (persisted as { reservations?: Reservation[] } | undefined)
          ?.reservations;
        return {
          ...current,
          reservations: mergeReservations(stored, current.reservations),
        };
      },
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
