import type { Sql } from "@/lib/db";
import { deliverEmail } from "@/lib/mail/send";
import {
  composeGuestCancellation,
  composeGuestConfirmation,
  composeHostCancellation,
  composeHostNotification,
  type ComposedEmail,
  type MailKind,
} from "@/lib/mail/templates";
import type { Reservation } from "@/lib/booking-store";

export type StoredEmail = {
  id: string;
  reservationId: string;
  kind: MailKind;
  to: string;
  subject: string;
  html: string;
  status: "sent" | "queued" | "failed";
  provider: string | null;
  createdAt: string;
};

function mailId(): string {
  return `em_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

async function recordAndSend(
  sql: Sql,
  reservation: Reservation,
  composed: ComposedEmail,
): Promise<StoredEmail> {
  const id = mailId();
  const delivery = await deliverEmail(composed);
  const status: StoredEmail["status"] = delivery.ok
    ? "sent"
    : delivery.error === "queued"
      ? "queued"
      : "failed";

  await sql.query(
    `insert into email_log (
      id, reservation_id, kind, to_email, subject, html, text_body,
      status, provider, provider_id, error
    ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
    [
      id,
      reservation.id,
      composed.kind,
      composed.to,
      composed.subject,
      composed.html,
      composed.text,
      status,
      delivery.provider,
      delivery.id ?? null,
      delivery.ok ? null : delivery.error ?? null,
    ],
  );

  if (composed.kind === "guest_confirmation") {
    await sql.query(
      `update reservations
       set guest_email_status = $2,
           guest_email_sent_at = case when $2 = 'sent' then now() else guest_email_sent_at end
       where id = $1`,
      [reservation.id, status],
    );
  }

  return {
    id,
    reservationId: reservation.id,
    kind: composed.kind,
    to: composed.to,
    subject: composed.subject,
    html: composed.html,
    status,
    provider: delivery.provider,
    createdAt: new Date().toISOString(),
  };
}

export async function sendBookingEmails(
  sql: Sql,
  reservation: Reservation,
): Promise<{ guest: StoredEmail; host: StoredEmail }> {
  const guest = await recordAndSend(
    sql,
    reservation,
    composeGuestConfirmation(reservation),
  );
  const host = await recordAndSend(
    sql,
    reservation,
    composeHostNotification(reservation),
  );
  return { guest, host };
}

export async function sendCancellationEmails(
  sql: Sql,
  reservation: Reservation,
): Promise<void> {
  await recordAndSend(sql, reservation, composeGuestCancellation(reservation));
  await recordAndSend(sql, reservation, composeHostCancellation(reservation));
}

export async function listEmailsForReservation(
  sql: Sql,
  reservationId: string,
): Promise<StoredEmail[]> {
  const rows = await sql.query<{
    id: string;
    reservation_id: string;
    kind: MailKind;
    to_email: string;
    subject: string;
    html: string;
    status: StoredEmail["status"];
    provider: string | null;
    created_at: string;
  }>(
    `select id, reservation_id, kind, to_email, subject, html, status, provider, created_at
     from email_log where reservation_id = $1 order by created_at desc`,
    [reservationId],
  );
  return rows.map((row) => ({
    id: row.id,
    reservationId: row.reservation_id,
    kind: row.kind,
    to: row.to_email,
    subject: row.subject,
    html: row.html,
    status: row.status,
    provider: row.provider,
    createdAt: String(row.created_at),
  }));
}
