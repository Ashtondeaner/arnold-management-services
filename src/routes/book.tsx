import { useMemo, useState, type FormEvent } from "react";
import {
  Link,
  createFileRoute,
  useNavigate,
} from "@tanstack/react-router";
import { z } from "zod";
import {
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { DateCalendar } from "@/components/booking/date-calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getPricing } from "@/data/pricing";
import {
  getPropertyBySlug,
  properties,
  site,
  teamNamesList,
} from "@/data/properties";
import {
  checkAvailability,
  formatDisplayDate,
  formatMoney,
  formatRateWithFees,
  quoteStay,
} from "@/lib/booking-engine";
import { createReservationFn } from "@/lib/booking-server";
import { useBookingStore } from "@/lib/booking-store";
import { useBookedRanges } from "@/lib/use-booked-ranges";
import { buildPageMeta, siteKeywords } from "@/data/seo";

const bookSearchSchema = z.object({
  property: z.string().optional(),
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
  guests: z.coerce.number().optional(),
});

export const Route = createFileRoute("/book")({
  validateSearch: bookSearchSchema,
  component: BookPage,
  head: () => ({
    meta: buildPageMeta({
      title: `Book a Vacation Rental Online | ${site.legalName}`,
      description: `Reserve Naples Florida and Treasure Cay Bahamas vacation rentals online with ${site.legalName}. Live availability, transparent nightly rates, resort fees, and instant confirmation for I102, Tahiti Street, and Bahama Beach Club.`,
      keywords: [
        ...siteKeywords,
        "book vacation rental online",
        "Naples vacation rental availability",
        "reserve beach house Bahamas",
      ],
      path: "/book",
    }),
    links: [{ rel: "canonical", href: `https://${site.domain}/book` }],
  }),
});

function BookPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const rememberReservation = useBookingStore((s) => s.rememberReservation);

  const initialProperty =
    getPropertyBySlug(search.property ?? "") ?? properties[0];

  const [propertySlug, setPropertySlug] = useState(initialProperty.slug);
  const [checkIn, setCheckIn] = useState<string | null>(
    search.checkIn ?? null,
  );
  const [checkOut, setCheckOut] = useState<string | null>(
    search.checkOut ?? null,
  );
  const [guests, setGuests] = useState(search.guests ?? 2);
  const [step, setStep] = useState<"dates" | "guest">(
    search.checkIn && search.checkOut ? "guest" : "dates",
  );
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [guest, setGuest] = useState({
    fullName: "",
    email: "",
    phone: "",
    message: "",
  });

  const property = getPropertyBySlug(propertySlug) ?? properties[0];
  const pricing = getPricing(property.id);
  const extraBlocked = useBookedRanges(property.id);

  const quote = useMemo(() => {
    if (!checkIn || !checkOut || !pricing) return null;
    return quoteStay(property.id, checkIn, checkOut, guests, extraBlocked);
  }, [property.id, checkIn, checkOut, guests, extraBlocked, pricing]);

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

  function goToGuestDetails() {
    if (!checkIn || !checkOut) {
      setError("Select check-in and check-out dates.");
      return;
    }
    const result = checkAvailability(
      property.id,
      checkIn,
      checkOut,
      guests,
      extraBlocked,
    );
    if (!result.ok) {
      setError(result.reason);
      return;
    }
    setError(null);
    setStep("guest");
  }

  async function submitBooking(e: FormEvent) {
    e.preventDefault();
    if (!quote || !pricing) return;

    const result = checkAvailability(
      property.id,
      quote.checkIn,
      quote.checkOut,
      quote.guests,
      extraBlocked,
    );
    if (!result.ok) {
      setError(result.reason);
      setStep("dates");
      return;
    }

    if (!guest.fullName.trim() || !guest.email.trim()) {
      setError("Name and email are required.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const reservation = await createReservationFn({
        data: {
          propertyId: property.id,
          propertySlug: property.slug,
          propertyName: property.name,
          checkIn: quote.checkIn,
          checkOut: quote.checkOut,
          guests: quote.guests,
          guest: {
            fullName: guest.fullName.trim(),
            email: guest.email.trim(),
            phone: guest.phone.trim() || undefined,
            message: guest.message.trim() || undefined,
          },
        },
      });
      rememberReservation(reservation);
      await navigate({
        to: "/book/confirmation/$id",
        params: { id: reservation.id },
      });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message.replace(/^.*?Error:\s*/, "")
          : "Unable to complete this reservation. Please try different dates.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="pb-16 md:pb-24">
      <section className="border-b border-border bg-bg-elevated">
        <div className="container-page py-10 md:py-12">
          <Button asChild variant="ghost" size="sm" className="-ml-2 text-fg-muted">
            <Link to="/properties">
              <ArrowLeft className="size-4" />
              Properties
            </Link>
          </Button>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            Reservations
          </p>
          <h1 className="mt-2 font-display text-3xl tracking-tight text-fg md:text-4xl">
            Reserve your stay
          </h1>
          <p className="mt-2 max-w-xl text-fg-muted">
            Select a residence and dates. Confirmation is issued by{" "}
            {site.legalName}; arrival details follow from the partners.
          </p>

          <ol className="mt-6 flex flex-wrap gap-3 text-sm">
            {[
              { id: "dates", label: "1. Dates & home" },
              { id: "guest", label: "2. Guest details" },
            ].map((s) => (
              <li
                key={s.id}
                className={
                  step === s.id
                    ? "rounded-full bg-primary px-3 py-1 font-medium text-primary-fg"
                    : "rounded-full bg-bg-subtle px-3 py-1 text-fg-muted"
                }
              >
                {s.label}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <div className="container-page grid gap-8 py-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          {step === "dates" ? (
            <div className="rounded-2xl border border-border bg-bg-elevated p-5 shadow-[var(--shadow-soft)] sm:p-8">
              <div className="space-y-2">
                <Label htmlFor="property">Property</Label>
                <select
                  id="property"
                  value={propertySlug}
                  onChange={(e) => {
                    setPropertySlug(e.target.value);
                    setCheckIn(null);
                    setCheckOut(null);
                    setError(null);
                  }}
                  className="flex h-11 w-full rounded-md border border-border bg-bg-elevated px-3.5 text-sm text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {properties.map((p) => {
                    const pPricing = getPricing(p.id);
                    return (
                      <option key={p.id} value={p.slug}>
                        {p.name}
                        {pPricing
                          ? ` — ${formatMoney(pPricing.nightlyRate)}/night ${pPricing.rateSuffix}`
                          : ""}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="mt-6">
                <DateCalendar
                  propertyId={property.id}
                  checkIn={checkIn}
                  checkOut={checkOut}
                  extraBlocked={extraBlocked}
                  onChange={(cin, cout) => {
                    setCheckIn(cin);
                    setCheckOut(cout);
                    setError(null);
                  }}
                />
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="guests">Guests</Label>
                  <select
                    id="guests"
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="flex h-11 w-full rounded-md border border-border bg-bg-elevated px-3.5 text-sm text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {Array.from(
                      { length: pricing?.maxGuests ?? property.sleeps },
                      (_, i) => i + 1,
                    ).map((n) => (
                      <option key={n} value={n}>
                        {n} guest{n === 1 ? "" : "s"}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="rounded-lg border border-border bg-bg px-3 py-2">
                  <p className="text-xs text-fg-subtle">Selected range</p>
                  <p className="mt-1 text-sm text-fg">
                    {checkIn && checkOut
                      ? `${formatDisplayDate(checkIn)} → ${formatDisplayDate(checkOut)}`
                      : checkIn
                        ? `${formatDisplayDate(checkIn)} → select checkout`
                        : "Pick dates on the calendar"}
                  </p>
                </div>
              </div>

              {error || (availability && !availability.ok) ? (
                <p className="mt-4 rounded-lg border border-danger/30 bg-danger/5 px-3 py-2 text-sm text-danger">
                  {error ?? (availability && !availability.ok ? availability.reason : null)}
                </p>
              ) : null}

              <Button
                type="button"
                size="lg"
                className="mt-6 w-full sm:w-auto"
                disabled={!quote}
                onClick={goToGuestDetails}
              >
                Continue to guest details
              </Button>
            </div>
          ) : (
            <form
              onSubmit={submitBooking}
              className="rounded-2xl border border-border bg-bg-elevated p-5 shadow-[var(--shadow-soft)] sm:p-8"
            >
              <button
                type="button"
                className="text-sm font-medium text-primary hover:underline"
                onClick={() => setStep("dates")}
              >
                ← Edit dates
              </button>
              <h2 className="mt-3 font-display text-2xl text-fg">
                Guest information
              </h2>
              <p className="mt-1 text-sm text-fg-muted">
                We’ll send your confirmation to this email.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="fullName">Full name</Label>
                  <Input
                    id="fullName"
                    required
                    autoComplete="name"
                    value={guest.fullName}
                    onChange={(e) =>
                      setGuest((g) => ({ ...g, fullName: e.target.value }))
                    }
                    placeholder="Jane Smith"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={guest.email}
                    onChange={(e) =>
                      setGuest((g) => ({ ...g, email: e.target.value }))
                    }
                    placeholder="you@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    value={guest.phone}
                    onChange={(e) =>
                      setGuest((g) => ({ ...g, phone: e.target.value }))
                    }
                    placeholder="(239) 555-0100"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="message">Special requests (optional)</Label>
                  <Textarea
                    id="message"
                    rows={3}
                    value={guest.message}
                    onChange={(e) =>
                      setGuest((g) => ({ ...g, message: e.target.value }))
                    }
                    placeholder="Arrival time, accessibility needs, celebrations…"
                  />
                </div>
              </div>

              {error ? (
                <p className="mt-4 rounded-lg border border-danger/30 bg-danger/5 px-3 py-2 text-sm text-danger">
                  {error}
                </p>
              ) : null}

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button type="submit" size="lg" disabled={!quote || submitting}>
                  {submitting ? "Confirming…" : "Confirm reservation"}
                </Button>
                <p className="text-xs text-fg-subtle">
                  You’ll receive an email confirmation immediately. {site.legalName}{" "}
                  also gets a copy at {site.email} and will follow up on deposit
                  and check-in details.
                </p>
              </div>
            </form>
          )}
        </div>

        <aside className="lg:col-span-5">
          <div className="sticky top-24 space-y-4">
            <div className="overflow-hidden rounded-2xl border border-border bg-bg-elevated shadow-[var(--shadow-soft)]">
              <div className="relative aspect-16/10 bg-bg-subtle">
                <img
                  src={property.heroImage}
                  alt={`${property.name} vacation rental`}
                  className="absolute inset-0 size-full object-cover"
                  decoding="async"
                />
              </div>
              <div className="p-5">
                <h2 className="font-display text-xl text-fg">{property.name}</h2>
                <p className="mt-1 text-sm text-fg-muted">
                  {property.city}, {property.country}
                </p>
                {pricing ? (
                  <p className="mt-3 text-sm text-fg-muted">
                    <span className="font-medium text-fg">
                      {formatRateWithFees(pricing)}
                    </span>
                    {" · "}
                    {pricing.minNights}-night minimum
                  </p>
                ) : null}

                {quote ? (
                  <div className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
                    <div className="flex justify-between gap-3 text-fg-muted">
                      <span>
                        {formatDisplayDate(quote.checkIn)} →{" "}
                        {formatDisplayDate(quote.checkOut)}
                      </span>
                    </div>
                    <div className="flex justify-between gap-3 text-fg-muted">
                      <span>
                        {quote.nights} nights · {quote.guests} guest
                        {quote.guests === 1 ? "" : "s"}
                      </span>
                    </div>
                    {quote.lineItems.map((item) => (
                      <div
                        key={item.label}
                        className="flex justify-between gap-3 text-fg-muted"
                      >
                        <span>{item.label}</span>
                        <span className="tabular-nums text-fg">
                          {formatMoney(item.amount)}
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between gap-3 border-t border-border pt-2 text-base font-medium text-fg">
                      <span>Total due</span>
                      <span className="font-display text-2xl tabular-nums">
                        {formatMoney(quote.total)}
                      </span>
                    </div>
                    <p className="text-xs text-fg-subtle">
                      + {formatMoney(quote.securityDeposit)} refundable
                      security deposit
                    </p>
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-fg-muted">
                    Select available dates to see a live quote.
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-bg-subtle p-4 text-sm text-fg-muted">
              <div className="flex gap-2">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
                <p>
                  Bookings are held instantly in our system and managed by{" "}
                  Partners {teamNamesList()}. Questions?{" "}
                  <a
                    href={`tel:${site.phoneTel}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {site.phone}
                  </a>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2 rounded-xl border border-border bg-bg-elevated p-4 text-sm text-fg-muted">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
              <p>
                After confirmation you’ll receive a reservation code and can
                review it anytime under My stays.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
