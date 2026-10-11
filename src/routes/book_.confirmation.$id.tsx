import { useEffect, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { CalendarCheck, CheckCircle2, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPricing } from "@/data/pricing";
import { site } from "@/data/properties";
import { formatDisplayDate, formatMoney } from "@/lib/booking-engine";
import {
  getReservationFn,
  listReservationEmailsFn,
  resendConfirmationEmailFn,
} from "@/lib/booking-server";
import { useBookingStore, type Reservation } from "@/lib/booking-store";

type EmailCopy = {
  id: string;
  kind: string;
  to: string;
  subject: string;
  html: string;
  status: "sent" | "queued" | "failed";
  createdAt: string;
};

export const Route = createFileRoute("/book_/confirmation/$id")({
  component: ConfirmationPage,
  head: () => ({
    meta: [{ title: `Reservation confirmed | ${site.legalName}` }],
  }),
});

function ConfirmationPage() {
  const { id } = Route.useParams();
  const local = useBookingStore((s) =>
    s.reservations.find((r) => r.id === id),
  );
  const rememberReservation = useBookingStore((s) => s.rememberReservation);
  const [remote, setRemote] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(!local);
  const [emails, setEmails] = useState<EmailCopy[]>([]);
  const [viewId, setViewId] = useState<string | null>(null);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (local) {
      setLoading(false);
    }
    let cancelled = false;
    getReservationFn({ data: { id } })
      .then((row) => {
        if (cancelled) return;
        if (row) rememberReservation(row);
        setRemote(row);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    listReservationEmailsFn({ data: { reservationId: id } })
      .then((rows) => {
        if (!cancelled) {
          setEmails(rows);
          const guest = rows.find((e) => e.kind === "guest_confirmation");
          if (guest) setViewId(guest.id);
        }
      })
      .catch(() => {
        /* outbox may not exist yet */
      });
    return () => {
      cancelled = true;
    };
  }, [id, local, rememberReservation]);

  const reservation = local ?? remote;
  const guestMail =
    emails.find((e) => e.kind === "guest_confirmation") ?? emails[0];
  const viewing = emails.find((e) => e.id === viewId) ?? guestMail;

  async function resend() {
    if (!reservation) return;
    setResending(true);
    try {
      const sent = await resendConfirmationEmailFn({
        data: { reservationId: reservation.id },
      });
      setEmails((current) => [sent, ...current]);
      setViewId(sent.id);
      rememberReservation({ ...reservation, emailStatus: sent.status });
    } finally {
      setResending(false);
    }
  }

  if (loading) {
    return (
      <div className="container-page py-20 text-center">
        <p className="text-fg-muted">Loading your confirmation…</p>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="font-display text-3xl text-fg">Reservation not found</h1>
        <p className="mt-2 text-fg-muted">
          This confirmation link may be invalid. Look up your stay with the
          confirmation code on My stays.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link to="/book">Book a stay</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/reservations">My stays</Link>
          </Button>
        </div>
      </div>
    );
  }

  const pricing = getPricing(reservation.propertyId);
  const feeLabel = pricing?.feeLabel ?? "Fees";
  const emailStatus = guestMail?.status ?? reservation.emailStatus;
  const statusLabel =
    emailStatus === "sent"
      ? `Confirmation emailed to ${reservation.guest.email}`
      : emailStatus === "failed"
        ? `We could not deliver email to ${reservation.guest.email} — the message is saved below so you can resend or print it.`
        : `A confirmation email for ${reservation.guest.email} is on file. A copy was also prepared for ${site.email}.`;

  return (
    <div className="pb-16 md:pb-24">
      <section className="border-b border-border bg-bg-elevated">
        <div className="container-page py-12 md:py-16">
          <div className="mx-auto max-w-xl text-center">
            <CheckCircle2 className="mx-auto size-12 text-success" />
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              Confirmed
            </p>
            <h1 className="mt-2 font-display text-3xl tracking-tight text-fg md:text-4xl">
              Your stay is reserved
            </h1>
            <p className="mt-3 text-fg-muted">
              Confirmation code{" "}
              <span className="font-semibold tracking-wide text-fg">
                {reservation.confirmationCode}
              </span>
            </p>
            <p className="mx-auto mt-4 flex max-w-md items-start justify-center gap-2 text-sm text-fg-muted">
              <Mail className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>{statusLabel}</span>
            </p>
          </div>
        </div>
      </section>

      <div className="container-page max-w-2xl py-10">
        <div className="rounded-2xl border border-border bg-bg-elevated p-6 shadow-[var(--shadow-soft)] sm:p-8">
          <h2 className="font-display text-2xl text-fg">
            {reservation.propertyName}
          </h2>
          <ul className="mt-6 space-y-4 text-sm">
            <li className="flex gap-3">
              <CalendarCheck className="mt-0.5 size-4 shrink-0 text-primary" />
              <div>
                <p className="text-xs uppercase tracking-wide text-fg-subtle">
                  Dates
                </p>
                <p className="mt-0.5 text-fg">
                  {formatDisplayDate(reservation.checkIn)} →{" "}
                  {formatDisplayDate(reservation.checkOut)}
                </p>
                <p className="text-fg-muted">
                  {reservation.nights} nights · {reservation.guests} guest
                  {reservation.guests === 1 ? "" : "s"}
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 size-4 shrink-0 text-primary" />
              <div>
                <p className="text-xs uppercase tracking-wide text-fg-subtle">
                  Guest
                </p>
                <p className="mt-0.5 text-fg">{reservation.guest.fullName}</p>
                <p className="text-fg-muted">{reservation.guest.email}</p>
                {reservation.guest.phone ? (
                  <p className="text-fg-muted">{reservation.guest.phone}</p>
                ) : null}
              </div>
            </li>
          </ul>

          <div className="mt-6 space-y-2 border-t border-border pt-5 text-sm">
            <div className="flex justify-between text-fg-muted">
              <span>Lodging</span>
              <span className="tabular-nums text-fg">
                {formatMoney(reservation.subtotal)}
              </span>
            </div>
            <div className="flex justify-between text-fg-muted">
              <span>{feeLabel}</span>
              <span className="tabular-nums text-fg">
                {formatMoney(reservation.cleaningFee)}
              </span>
            </div>
            <div className="flex justify-between text-fg-muted">
              <span>Taxes</span>
              <span className="tabular-nums text-fg">
                {formatMoney(reservation.tax)}
              </span>
            </div>
            <div className="flex justify-between border-t border-border pt-2 text-base font-medium text-fg">
              <span>Total</span>
              <span className="font-display text-2xl tabular-nums">
                {formatMoney(reservation.total)}
              </span>
            </div>
            <p className="text-xs text-fg-subtle">
              Security deposit {formatMoney(reservation.securityDeposit)} due
              before arrival (refundable).
            </p>
          </div>

          <div className="mt-6 rounded-xl bg-bg-subtle p-4 text-sm text-fg-muted">
            <p>
              {site.legalName} will contact you with check-in instructions and
              deposit details. For urgent questions:
            </p>
            <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
              <a
                href={`tel:${site.phoneTel}`}
                className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline"
              >
                <Phone className="size-3.5" />
                {site.phone}
              </a>
              <a
                href={`mailto:${site.email}`}
                className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline"
              >
                <Mail className="size-3.5" />
                {site.email}
              </a>
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <Link to="/reservations">View my stays</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link
                to="/properties/$slug"
                params={{ slug: reservation.propertySlug }}
              >
                Back to property
              </Link>
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={resending}
              onClick={() => void resend()}
            >
              {resending ? "Sending…" : "Resend email"}
            </Button>
          </div>
        </div>

        {viewing ? (
          <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-bg-elevated shadow-[var(--shadow-soft)]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                  Confirmation email
                </p>
                <p className="mt-1 text-sm text-fg">{viewing.subject}</p>
                <p className="text-xs text-fg-muted">
                  To {viewing.to} · {viewing.status}
                </p>
              </div>
            </div>
            <iframe
              title="Confirmation email"
              sandbox=""
              srcDoc={viewing.html}
              className="h-[32rem] w-full bg-white"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
