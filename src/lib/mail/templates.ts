import { getPricing } from "@/data/pricing";
import { getPropertyBySlug, site } from "@/data/properties";
import {
  formatDisplayDate,
  formatMoney,
} from "@/lib/booking-engine";
import type { Reservation } from "@/lib/booking-store";

export type MailKind =
  | "guest_confirmation"
  | "host_notification"
  | "guest_cancellation"
  | "host_cancellation";

export type ComposedEmail = {
  kind: MailKind;
  to: string;
  subject: string;
  html: string;
  text: string;
  ics?: { filename: string; content: string };
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&" + "amp;")
    .replace(/</g, "&" + "lt;")
    .replace(/>/g, "&" + "gt;")
    .replace(/"/g, "&" + "quot;");
}

function locationLine(reservation: Reservation): string {
  const property = getPropertyBySlug(reservation.propertySlug);
  if (!property) return "";
  return `${property.city}, ${property.country}`;
}

function icsDate(iso: string): string {
  return iso.replace(/-/g, "");
}

export function buildStayIcs(reservation: Reservation): string {
  const property = getPropertyBySlug(reservation.propertySlug);
  const location = property
    ? `${property.name}, ${property.city}, ${property.country}`
    : reservation.propertyName;
  const stamp = new Date()
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Arnold Management Services//Vacation Stay//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${reservation.confirmationCode}@${site.domain}`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${icsDate(reservation.checkIn)}`,
    `DTEND;VALUE=DATE:${icsDate(reservation.checkOut)}`,
    `SUMMARY:Stay at ${reservation.propertyName}`,
    `LOCATION:${location}`,
    `DESCRIPTION:Confirmation ${reservation.confirmationCode}. Managed by ${site.legalName}. ${site.phone}`,
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ].join("\r\n");
}

function wrap(title: string, inner: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:#eef3f4;font-family:Georgia,'Times New Roman',serif;color:#1c2426;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#eef3f4;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #d5e0e2;">
          <tr>
            <td style="background:#1a5f6a;padding:28px 32px;color:#f7f4ef;">
              <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;opacity:0.85;">${escapeHtml(site.legalName)}</p>
              <h1 style="margin:8px 0 0;font-size:28px;line-height:1.2;font-weight:normal;">${escapeHtml(title)}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px 8px;font-size:16px;line-height:1.55;">
              ${inner}
            </td>
          </tr>
          <tr>
            <td style="padding:8px 32px 28px;font-family:Arial,sans-serif;font-size:13px;line-height:1.5;color:#5b6b6e;">
              <p style="margin:0 0 8px;">${escapeHtml(site.headquarters.full)}</p>
              <p style="margin:0;">
                <a href="tel:${site.phoneTel}" style="color:#1a5f6a;text-decoration:none;">${escapeHtml(site.phone)}</a>
                &nbsp;·&nbsp;
                <a href="mailto:${site.email}" style="color:#1a5f6a;text-decoration:none;">${escapeHtml(site.email)}</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function stayDetailsHtml(reservation: Reservation): string {
  const pricing = getPricing(reservation.propertyId);
  const feeLabel = pricing?.feeLabel ?? "Fees";
  const loc = locationLine(reservation);
  return `
    <p style="margin:0 0 16px;font-family:Arial,sans-serif;font-size:13px;letter-spacing:0.12em;text-transform:uppercase;color:#1a5f6a;">
      Confirmation ${escapeHtml(reservation.confirmationCode)}
    </p>
    <h2 style="margin:0 0 6px;font-size:22px;font-weight:normal;">${escapeHtml(reservation.propertyName)}</h2>
    ${loc ? `<p style="margin:0 0 18px;color:#5b6b6e;">${escapeHtml(loc)}</p>` : ""}
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-family:Arial,sans-serif;font-size:14px;border-top:1px solid #e3ecee;">
      <tr>
        <td style="padding:10px 0;color:#5b6b6e;">Check-in</td>
        <td style="padding:10px 0;text-align:right;">${escapeHtml(formatDisplayDate(reservation.checkIn))}</td>
      </tr>
      <tr>
        <td style="padding:10px 0;color:#5b6b6e;">Check-out</td>
        <td style="padding:10px 0;text-align:right;">${escapeHtml(formatDisplayDate(reservation.checkOut))}</td>
      </tr>
      <tr>
        <td style="padding:10px 0;color:#5b6b6e;">Stay</td>
        <td style="padding:10px 0;text-align:right;">${reservation.nights} nights · ${reservation.guests} guest${reservation.guests === 1 ? "" : "s"}</td>
      </tr>
      <tr>
        <td style="padding:10px 0;color:#5b6b6e;">Guest</td>
        <td style="padding:10px 0;text-align:right;">${escapeHtml(reservation.guest.fullName)}</td>
      </tr>
      <tr>
        <td style="padding:10px 0;color:#5b6b6e;">Lodging</td>
        <td style="padding:10px 0;text-align:right;">${formatMoney(reservation.subtotal)}</td>
      </tr>
      <tr>
        <td style="padding:10px 0;color:#5b6b6e;">${escapeHtml(feeLabel)}</td>
        <td style="padding:10px 0;text-align:right;">${formatMoney(reservation.cleaningFee)}</td>
      </tr>
      <tr>
        <td style="padding:10px 0;color:#5b6b6e;">Taxes</td>
        <td style="padding:10px 0;text-align:right;">${formatMoney(reservation.tax)}</td>
      </tr>
      <tr>
        <td style="padding:12px 0 4px;font-size:16px;"><strong>Total</strong></td>
        <td style="padding:12px 0 4px;text-align:right;font-size:16px;"><strong>${formatMoney(reservation.total)}</strong></td>
      </tr>
    </table>
    <p style="margin:12px 0 0;font-family:Arial,sans-serif;font-size:13px;color:#5b6b6e;">
      Refundable security deposit ${formatMoney(reservation.securityDeposit)} is collected separately before arrival.
    </p>`;
}

function stayDetailsText(reservation: Reservation): string {
  const loc = locationLine(reservation);
  return [
    `${site.legalName}`,
    `Confirmation ${reservation.confirmationCode}`,
    reservation.propertyName,
    loc,
    `Check-in: ${formatDisplayDate(reservation.checkIn)}`,
    `Check-out: ${formatDisplayDate(reservation.checkOut)}`,
    `${reservation.nights} nights · ${reservation.guests} guests`,
    `Guest: ${reservation.guest.fullName} <${reservation.guest.email}>`,
    reservation.guest.phone ? `Phone: ${reservation.guest.phone}` : "",
    `Lodging: ${formatMoney(reservation.subtotal)}`,
    `Fees: ${formatMoney(reservation.cleaningFee)}`,
    `Taxes: ${formatMoney(reservation.tax)}`,
    `Total: ${formatMoney(reservation.total)}`,
    `Security deposit: ${formatMoney(reservation.securityDeposit)} (refundable, due before arrival)`,
    `Questions: ${site.phone} · ${site.email}`,
    site.headquarters.full,
  ]
    .filter(Boolean)
    .join("\n");
}

export function composeGuestConfirmation(reservation: Reservation): ComposedEmail {
  const subject = `Your stay is confirmed — ${reservation.propertyName} (${reservation.confirmationCode})`;
  const inner = `
    <p>Dear ${escapeHtml(reservation.guest.fullName.split(" ")[0] || "guest")},</p>
    <p>Thank you for booking with ${escapeHtml(site.name)}. Your reservation is confirmed and the dates are held on our calendar.</p>
    ${stayDetailsHtml(reservation)}
    <p style="margin:20px 0 0;">Our partners will follow up with check-in instructions and deposit details. You can look up this stay anytime at ${escapeHtml(site.domain)} using confirmation code <strong>${escapeHtml(reservation.confirmationCode)}</strong>.</p>
    <p>We look forward to hosting you.</p>
    <p style="margin-bottom:0;">Warmly,<br/>${escapeHtml(site.legalName)}</p>
  `;
  return {
    kind: "guest_confirmation",
    to: reservation.guest.email,
    subject,
    html: wrap("Your stay is confirmed", inner),
    text: `Dear ${reservation.guest.fullName},\n\nYour reservation is confirmed.\n\n${stayDetailsText(reservation)}\n\nLook up your stay at ${site.domain} with code ${reservation.confirmationCode}.`,
    ics: {
      filename: `${reservation.confirmationCode}.ics`,
      content: buildStayIcs(reservation),
    },
  };
}

export function composeHostNotification(reservation: Reservation): ComposedEmail {
  const subject = `New reservation ${reservation.confirmationCode} — ${reservation.propertyName}`;
  const request = reservation.guest.message
    ? `<p style="margin:16px 0 0;"><strong>Guest note:</strong> ${escapeHtml(reservation.guest.message)}</p>`
    : "";
  const inner = `
    <p>A new stay has been booked on ${escapeHtml(site.domain)}.</p>
    ${stayDetailsHtml(reservation)}
    <p style="margin:16px 0 0;font-family:Arial,sans-serif;font-size:14px;">
      ${escapeHtml(reservation.guest.fullName)}<br/>
      <a href="mailto:${escapeHtml(reservation.guest.email)}" style="color:#1a5f6a;">${escapeHtml(reservation.guest.email)}</a>
      ${reservation.guest.phone ? `<br/>${escapeHtml(reservation.guest.phone)}` : ""}
    </p>
    ${request}
  `;
  return {
    kind: "host_notification",
    to: site.email,
    subject,
    html: wrap("New reservation", inner),
    text: `New reservation ${reservation.confirmationCode}\n\n${stayDetailsText(reservation)}\n${reservation.guest.message ? `\nGuest note: ${reservation.guest.message}` : ""}`,
  };
}

export function composeGuestCancellation(reservation: Reservation): ComposedEmail {
  const subject = `Reservation cancelled — ${reservation.propertyName} (${reservation.confirmationCode})`;
  const inner = `
    <p>Dear ${escapeHtml(reservation.guest.fullName.split(" ")[0] || "guest")},</p>
    <p>Your reservation <strong>${escapeHtml(reservation.confirmationCode)}</strong> for ${escapeHtml(reservation.propertyName)} (${escapeHtml(formatDisplayDate(reservation.checkIn))} → ${escapeHtml(formatDisplayDate(reservation.checkOut))}) has been cancelled. Those dates are now available again.</p>
    <p>If this was unexpected, contact us at <a href="mailto:${site.email}" style="color:#1a5f6a;">${escapeHtml(site.email)}</a> or ${escapeHtml(site.phone)}.</p>
    <p style="margin-bottom:0;">${escapeHtml(site.legalName)}</p>
  `;
  return {
    kind: "guest_cancellation",
    to: reservation.guest.email,
    subject,
    html: wrap("Reservation cancelled", inner),
    text: `Your reservation ${reservation.confirmationCode} for ${reservation.propertyName} has been cancelled.\n${formatDisplayDate(reservation.checkIn)} → ${formatDisplayDate(reservation.checkOut)}\n\n${site.email} · ${site.phone}`,
  };
}

export function composeHostCancellation(reservation: Reservation): ComposedEmail {
  const subject = `Cancelled ${reservation.confirmationCode} — ${reservation.propertyName}`;
  const inner = `
    <p>${escapeHtml(reservation.guest.fullName)} cancelled ${escapeHtml(reservation.confirmationCode)} at ${escapeHtml(reservation.propertyName)} (${escapeHtml(formatDisplayDate(reservation.checkIn))} → ${escapeHtml(formatDisplayDate(reservation.checkOut))}). The calendar is open for those dates.</p>
  `;
  return {
    kind: "host_cancellation",
    to: site.email,
    subject,
    html: wrap("Reservation cancelled", inner),
    text: `Cancelled ${reservation.confirmationCode} — ${reservation.propertyName}\n${reservation.guest.fullName} <${reservation.guest.email}>`,
  };
}
