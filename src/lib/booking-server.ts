import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  checkAvailability,
  generateConfirmationCode,
  quoteStay,
} from "@/lib/booking-engine";
import type { Reservation } from "@/lib/booking-store";
import type { DateRange } from "@/data/pricing";

const createInput = z.object({
  propertyId: z.string().min(1),
  propertySlug: z.string().min(1),
  propertyName: z.string().min(1),
  checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  guests: z.number().int().min(1).max(20),
  guest: z.object({
    fullName: z.string().trim().min(2).max(120),
    email: z
      .string()
      .trim()
      .min(5)
      .max(200)
      .refine((value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), {
        message: "Enter a valid email",
      }),
    phone: z.string().trim().max(40).optional(),
    message: z.string().trim().max(2000).optional(),
  }),
});

type ReservationRow = {
  id: string;
  confirmation_code: string;
  property_id: string;
  property_slug: string;
  property_name: string;
  check_in: string;
  check_out: string;
  nights: number;
  guests: number;
  subtotal: string | number;
  cleaning_fee: string | number;
  tax: string | number;
  total: string | number;
  security_deposit: string | number;
  currency: string;
  status: "confirmed" | "cancelled";
  guest_name: string;
  guest_email: string;
  guest_phone: string | null;
  guest_message: string | null;
  created_at: string;
  guest_email_status?: string | null;
};

function money(value: string | number): number {
  return typeof value === "number" ? value : Number(value);
}

function rowToReservation(row: ReservationRow): Reservation {
  return {
    id: row.id,
    confirmationCode: row.confirmation_code,
    propertyId: row.property_id,
    propertySlug: row.property_slug,
    propertyName: row.property_name,
    checkIn: String(row.check_in).slice(0, 10),
    checkOut: String(row.check_out).slice(0, 10),
    nights: Number(row.nights),
    guests: Number(row.guests),
    subtotal: money(row.subtotal),
    cleaningFee: money(row.cleaning_fee),
    tax: money(row.tax),
    total: money(row.total),
    securityDeposit: money(row.security_deposit),
    currency: "USD",
    status: row.status === "cancelled" ? "cancelled" : "confirmed",
    guest: {
      fullName: row.guest_name,
      email: row.guest_email,
      phone: row.guest_phone ?? "",
      message: row.guest_message ?? undefined,
    },
    createdAt: row.created_at,
    emailStatus:
      row.guest_email_status === "sent" ||
      row.guest_email_status === "queued" ||
      row.guest_email_status === "failed"
        ? row.guest_email_status
        : null,
  };
}

async function bookedRangesForProperty(
  sql: Awaited<ReturnType<typeof import("@/lib/db").getSql>>,
  propertyId: string,
): Promise<DateRange[]> {
  const rows = await sql.query<{ check_in: string; check_out: string }>(
    `select check_in, check_out from reservations
     where property_id = $1 and status = 'confirmed'`,
    [propertyId],
  );
  return rows.map((r) => ({
    start: String(r.check_in).slice(0, 10),
    end: String(r.check_out).slice(0, 10),
    reason: "Guest reservation",
  }));
}

export const fetchBookedRangesFn = createServerFn({ method: "GET" })
  .validator(z.object({ propertyId: z.string().min(1) }))
  .handler(async ({ data }) => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    return bookedRangesForProperty(sql, data.propertyId);
  });

export const getReservationFn = createServerFn({ method: "GET" })
  .validator(
    z.object({
      id: z.string().optional(),
      code: z.string().optional(),
    }),
  )
  .handler(async ({ data }) => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    if (data.id) {
      const rows = await sql.query<ReservationRow>(
        "select * from reservations where id = $1 limit 1",
        [data.id],
      );
      return rows[0] ? rowToReservation(rows[0]) : null;
    }
    if (data.code) {
      const rows = await sql.query<ReservationRow>(
        "select * from reservations where lower(confirmation_code) = lower($1) limit 1",
        [data.code.trim()],
      );
      return rows[0] ? rowToReservation(rows[0]) : null;
    }
    return null;
  });

export const createReservationFn = createServerFn({ method: "POST" })
  .validator(createInput)
  .handler(async ({ data }) => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const extraBlocked = await bookedRangesForProperty(sql, data.propertyId);

    const availability = checkAvailability(
      data.propertyId,
      data.checkIn,
      data.checkOut,
      data.guests,
      extraBlocked,
    );
    if (!availability.ok) {
      throw new Error(availability.reason);
    }

    const quote = quoteStay(
      data.propertyId,
      data.checkIn,
      data.checkOut,
      data.guests,
      extraBlocked,
    );
    if (!quote) {
      throw new Error("Unable to price those dates.");
    }

    const id = `res_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
    const confirmationCode = generateConfirmationCode();

    await sql.query(
      `insert into reservations (
        id, confirmation_code, property_id, property_slug, property_name,
        check_in, check_out, nights, guests, subtotal, cleaning_fee, tax, total,
        security_deposit, currency, status, guest_name, guest_email, guest_phone,
        guest_message
      ) values (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,'USD','confirmed',
        $15,$16,$17,$18
      )`,
      [
        id,
        confirmationCode,
        data.propertyId,
        data.propertySlug,
        data.propertyName,
        data.checkIn,
        data.checkOut,
        quote.nights,
        quote.guests,
        quote.subtotal,
        quote.cleaningFee,
        quote.tax,
        quote.total,
        quote.securityDeposit,
        data.guest.fullName,
        data.guest.email.toLowerCase(),
        data.guest.phone || null,
        data.guest.message || null,
      ],
    );

    const rows = await sql.query<ReservationRow>(
      "select * from reservations where id = $1",
      [id],
    );
    const reservation = rowToReservation(rows[0]);
    try {
      const { sendBookingEmails } = await import("@/lib/mail/reservation-mail");
      const mailed = await sendBookingEmails(sql, reservation);
      reservation.emailStatus = mailed.guest.status;
    } catch {
      reservation.emailStatus = reservation.emailStatus ?? "failed";
    }
    return reservation;
  });

export const cancelReservationFn = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string().min(1) }))
  .handler(async ({ data }) => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    await sql.query(
      "update reservations set status = 'cancelled' where id = $1 and status = 'confirmed'",
      [data.id],
    );
    const rows = await sql.query<ReservationRow>(
      "select * from reservations where id = $1",
      [data.id],
    );
    const reservation = rows[0] ? rowToReservation(rows[0]) : null;
    if (reservation) {
      try {
        const { sendCancellationEmails } = await import(
          "@/lib/mail/reservation-mail"
        );
        await sendCancellationEmails(sql, reservation);
      } catch {
        // Cancellation should still succeed if mail fails.
      }
    }
    return reservation;
  });

export const listReservationEmailsFn = createServerFn({ method: "GET" })
  .validator(z.object({ reservationId: z.string().min(1) }))
  .handler(async ({ data }) => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const { listEmailsForReservation } = await import(
      "@/lib/mail/reservation-mail"
    );
    return listEmailsForReservation(sql, data.reservationId);
  });

export const resendConfirmationEmailFn = createServerFn({ method: "POST" })
  .validator(z.object({ reservationId: z.string().min(1) }))
  .handler(async ({ data }) => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const rows = await sql.query<ReservationRow>(
      "select * from reservations where id = $1 limit 1",
      [data.reservationId],
    );
    if (!rows[0]) throw new Error("Reservation not found.");
    const reservation = rowToReservation(rows[0]);
    const { sendBookingEmails } = await import("@/lib/mail/reservation-mail");
    const mailed = await sendBookingEmails(sql, reservation);
    return mailed.guest;
  });
