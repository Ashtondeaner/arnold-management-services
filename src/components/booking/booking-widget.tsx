import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { CalendarDays, Users } from "lucide-react";
import { site, type Property } from "@/data/properties";
import { getPricing } from "@/data/pricing";
import {
  checkAvailability,
  formatDisplayDate,
  formatMoney,
  formatRateWithFees,
  quoteStay,
} from "@/lib/booking-engine";
import { useBookedRanges } from "@/lib/use-booked-ranges";
import { DateCalendar } from "@/components/booking/date-calendar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Props = {
  property: Property;
  className?: string;
};

export function BookingWidget({ property, className }: Props) {
  const pricing = getPricing(property.id);
  const extraBlocked = useBookedRanges(property.id);

  const [checkIn, setCheckIn] = useState<string | null>(null);
  const [checkOut, setCheckOut] = useState<string | null>(null);
  const [guests, setGuests] = useState(2);
  const [touched, setTouched] = useState(false);

  const quote = useMemo(() => {
    if (!checkIn || !checkOut) return null;
    return quoteStay(property.id, checkIn, checkOut, guests, extraBlocked);
  }, [property.id, checkIn, checkOut, guests, extraBlocked]);

  const availability = useMemo(() => {
    if (!checkIn || !checkOut) return null;
    return checkAvailability(
      property.id,
      checkIn,
      checkOut,
      guests,
      extraBlocked,
    );
  }, [property.id, checkIn, checkOut, guests, extraBlocked]);

  if (!pricing) {
    return (
      <div className={cn("rounded-2xl border border-border p-6", className)}>
        <p className="text-sm text-fg-muted">Booking not available online.</p>
      </div>
    );
  }

  const maxGuests = Math.min(pricing.maxGuests, property.sleeps);

  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-bg-elevated p-5 shadow-[var(--shadow-soft)] sm:p-6",
        className,
      )}
    >
      <div className="border-b border-border pb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          Reserve
        </p>
        <p className="mt-1 text-xs font-medium uppercase tracking-wide text-fg-subtle">
          {property.propertyType}
        </p>
        <p className="mt-1 font-display text-lg leading-snug text-fg text-balance">
          {property.name}
        </p>
        <p className="mt-2 font-display text-2xl text-fg">
          {formatMoney(pricing.nightlyRate)}
          <span className="text-base font-sans font-normal text-fg-muted">
            /night
          </span>
        </p>
        <p className="mt-0.5 text-sm font-medium text-fg-muted">
          {pricing.rateSuffix}{" "}
          <span className="text-fg-subtle">· {pricing.minNights}+ night min</span>
        </p>
        <p className="mt-2 text-xs text-fg-subtle">
          {property.bedrooms} BR · {property.bathrooms} BA · Sleeps{" "}
          {property.sleeps}
        </p>
      </div>

      <div className="mt-4">
        <DateCalendar
          propertyId={property.id}
          checkIn={checkIn}
          checkOut={checkOut}
          extraBlocked={extraBlocked}
          onChange={(cin, cout) => {
            setCheckIn(cin);
            setCheckOut(cout);
            setTouched(true);
          }}
        />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-bg px-3 py-2.5">
          <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-fg-subtle">
            Check-in
          </p>
          <p className="mt-0.5 flex items-center gap-1.5 text-sm text-fg">
            <CalendarDays className="size-3.5 text-fg-muted" />
            {checkIn ? formatDisplayDate(checkIn) : "Select date"}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-bg px-3 py-2.5">
          <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-fg-subtle">
            Check-out
          </p>
          <p className="mt-0.5 flex items-center gap-1.5 text-sm text-fg">
            <CalendarDays className="size-3.5 text-fg-muted" />
            {checkOut ? formatDisplayDate(checkOut) : "Select date"}
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <Label htmlFor={`guests-${property.id}`} className="flex items-center gap-1.5">
          <Users className="size-3.5" />
          Guests
        </Label>
        <select
          id={`guests-${property.id}`}
          value={guests}
          onChange={(e) => {
            setGuests(Number(e.target.value));
            setTouched(true);
          }}
          className="flex h-11 w-full rounded-md border border-border bg-bg-elevated px-3.5 text-sm text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {Array.from({ length: maxGuests }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              {n} guest{n === 1 ? "" : "s"}
            </option>
          ))}
        </select>
      </div>

      {touched && availability && !availability.ok ? (
        <p className="mt-4 rounded-lg border border-danger/30 bg-danger/5 px-3 py-2 text-sm text-danger">
          {availability.reason}
        </p>
      ) : null}

      {quote ? (
        <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
          {quote.lineItems.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between gap-3 text-fg-muted"
            >
              <span>{item.label}</span>
              <span className="tabular-nums text-fg">
                {formatMoney(item.amount)}
              </span>
            </div>
          ))}
          <div className="flex items-center justify-between gap-3 border-t border-border pt-2 font-medium text-fg">
            <span>Total</span>
            <span className="font-display text-xl tabular-nums">
              {formatMoney(quote.total)}
            </span>
          </div>
          <p className="text-xs text-fg-subtle">
            Rate: {formatRateWithFees(pricing)}. Refundable security deposit{" "}
            {formatMoney(quote.securityDeposit)} collected separately before
            arrival.
          </p>
        </div>
      ) : null}

      {quote ? (
        <Button asChild size="lg" className="mt-5 w-full">
          <Link
            to="/book"
            search={{
              property: property.slug,
              checkIn: quote.checkIn,
              checkOut: quote.checkOut,
              guests: quote.guests,
            }}
          >
            Continue to reserve
          </Link>
        </Button>
      ) : (
        <Button size="lg" className="mt-5 w-full" disabled>
          Select dates to continue
        </Button>
      )}

      <p className="mt-3 text-center text-xs text-fg-subtle">
        Held upon confirmation · {site.legalName}
      </p>
    </div>
  );
}
