import { site } from "@/data/properties";
import type { ComposedEmail } from "@/lib/mail/templates";

export type Delivery = {
  ok: boolean;
  provider: string;
  id?: string;
  error?: string;
};

export type OutboundMail = ComposedEmail & {
  fromName?: string;
  replyTo?: string;
};

function mailFrom(): string {
  return (
    process.env.MAIL_FROM ||
    process.env.RESEND_FROM ||
    `${site.name} <onboarding@resend.dev>`
  );
}

async function sendWithResend(
  apiKey: string,
  mail: OutboundMail,
): Promise<Delivery> {
  const attachments = mail.ics
    ? [
        {
          filename: mail.ics.filename,
          content: Buffer.from(mail.ics.content).toString("base64"),
        },
      ]
    : undefined;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: mailFrom(),
      to: [mail.to],
      reply_to: mail.replyTo || site.email,
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
      attachments,
    }),
  });

  const body = (await res.json().catch(() => ({}))) as {
    id?: string;
    message?: string;
    error?: { message?: string };
  };

  if (!res.ok) {
    return {
      ok: false,
      provider: "resend",
      error:
        body.error?.message ||
        body.message ||
        `Resend HTTP ${res.status}`,
    };
  }

  return { ok: true, provider: "resend", id: body.id };
}

/**
 * Deliver a composed email.
 * Uses Resend when RESEND_API_KEY is set (preview + deploy).
 * Otherwise the caller stores the message as queued for the confirmation page.
 */
export async function deliverEmail(mail: OutboundMail): Promise<Delivery> {
  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    try {
      return await sendWithResend(apiKey, mail);
    } catch (err) {
      return {
        ok: false,
        provider: "resend",
        error: err instanceof Error ? err.message : "Send failed",
      };
    }
  }
  return {
    ok: false,
    provider: "none",
    error: "queued",
  };
}
