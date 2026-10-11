import { useState, type FormEvent } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { CalendarRange, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { site } from "@/data/properties";
import { formatDisplayDate, formatMoney } from "@/lib/booking-engine";
import {
  cancelReservationFn,
  getReservationFn,
} from "@/lib/booking-server";
import { useBookingStore } from "@/lib/booking-store";

export const Route = createFileRoute("/reservations")({
  component: ReservationsPage,
  head: () => ({
    meta: [
      { title: `My stays | ${site.legalName}` },
      {
        name: "description",
        content: `View and manage your vacation rental reservations with ${site.legalName}.`,
      },
    ],
  }),
});

function ReservationsPage() {
  const reservations = useBookingStore((s) => s.reservations);
  const rememberReservation = useBookingStore((s) => s.rememberReservation);
  const cancelLocal = useBookingStore((s) => s.cancelLocal);
  const [code, setCode] = useState("");
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [looking, setLooking] = useState(false);

  async function lookupStay(e: FormEvent) {
    e.preventDefault();
    const trimmed = code.trim();
    if (!trimmed) return;
    setLooking(true);
    setLookupError(null);
    try {
      const row = await getReservationFn({ data: { code: trimmed } });
      if (!row) {
        setLookupError("No reservation found for that confirmation code.");
        return;
      }
      rememberReservation(row);
      setCode("");
    } catch {
      setLookupError("Unable to look up that code. Try again.");
    } finally {
      setLooking(false);
    }
  }

  async function cancelStay(id: string, confirmationCode: string) {
    if (!window.confirm(`Cancel reservation ${confirmationCode}?`)) return;
    try {
      const updated = await cancelReservationFn({ data: { id } });
      if (updated) rememberReservation(updated);
      else cancelLocal(id);
    } catch {
      cancelLocal(id);
    }
  }

  return (
    <div className="pb-16 md:pb-24">
      <section className="border-b border-border bg-bg-elevated">
        <div className="container-page py-12 md:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            Reservations
          </p>
          <h1 className="mt-2 font-display text-4xl tracking-tight text-fg md:text-5xl">
            My stays
          </h1>
          <p className="mt-3 max-w-xl text-fg-muted">
            Confirmed bookings appear here. Look up a stay with your
            confirmation code, or cancel to release the dates for new guests.
          </p>
          <Button asChild className="mt-6">
            <Link to="/book">Book another stay</Link>
          </Button>
        </div>
      </section>

      <div className="container-page py-10">
        <form
          onSubmit={lookupStay}
          className="mb-8 rounded-2xl border border-border bg-bg-elevated p-5 shadow-[var(--shadow-soft)] sm:p-6"
        >
          <h2 className="font-display text-lg text-fg">Find a reservation</h2>
          <p className="mt-1 text-sm text-fg-muted">
            Enter the confirmation code from your booking (example AMS-4K7NPQ).
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="min-w-0 flex-1 space-y-2">
              <Label htmlFor="confirmation-code">Confirmation code</Label>
              <Input
                id="confirmation-code"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="AMS-XXXXXX"
                autoComplete="off"
              />
            </div>
            <Button type="submit" disabled={looking || !code.trim()}>
              {looking ? "Looking…" : "Look up"}
            </Button>
          </div>
          {lookupError ? (
            <p className="mt-3 text-sm text-danger">{lookupError}</p>
          ) : null}
        </form>

        {reservations.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border-strong bg-bg-elevated px-6 py-16 text-center">
            <CalendarRange className="mx-auto size-10 text-fg-subtle" />
            <h2 className="mt-4 font-display text-2xl text-fg">No stays yet</h2>
            <p className="mt-2 text-sm text-fg-muted">
              Book a home to get an instant confirmation code, or look up an
              existing reservation above.
            </p>
            <Button asChild className="mt-6">
              <Link to="/book">Start booking</Link>
            </Button>
          </div>
        ) : (
          <ul className="space-y-4">
            {reservations.map((r) => (
              <li
                key={r.id}
                className="rounded-2xl border border-border bg-bg-elevated p-5 shadow-[var(--shadow-soft)] sm:p-6"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-display text-xl text-fg">
                        {r.propertyName}
                      </h2>
                      <Badge
                        variant={
                          r.status === "confirmed" ? "default" : "outline"
                        }
                      >
                        {r.status}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-fg-muted">
                      {formatDisplayDate(r.checkIn)} →{" "}
                      {formatDisplayDate(r.checkOut)} · {r.nights} nights ·{" "}
                      {r.guests} guests
                    </p>
                    <p className="mt-2 text-sm">
                      <span className="text-fg-subtle">Confirmation </span>
                      <span className="font-semibold tracking-wide text-fg">
                        {r.confirmationCode}
                      </span>
                    </p>
                    <p className="mt-1 text-sm text-fg-muted">
                      {r.guest.fullName} · {r.guest.email}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="font-display text-2xl tabular-nums text-fg">
                      {formatMoney(r.total)}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2 sm:justify-end">
                      <Button asChild size="sm" variant="secondary">
                        <Link
                          to="/book/confirmation/$id"
                          params={{ id: r.id }}
                        >
                          Details
                        </Link>
                      </Button>
                      {r.status === "confirmed" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => cancelStay(r.id, r.confirmationCode)}
                        >
                          <XCircle className="size-3.5" />
                          Cancel
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
