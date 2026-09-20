"use server";

import { headers } from "next/headers";
import { Resend } from "resend";

/**
 * Contact form Server Action.
 *
 * A Server Function is reachable by direct POST, so every rule here is enforced
 * server-side: nothing relies on the form's HTML validation.
 */
export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  /** Per-field messages, keyed like the inputs. */
  errors?: Partial<Record<"email" | "message", string>>;
  /** Set when sending is impossible — the UI offers a mailto: link instead. */
  fallback?: boolean;
};

const MAX_MESSAGE_LENGTH = 2000;
const MAX_EMAIL_LENGTH = 254;
/** Filling both fields + reading takes longer than this. */
const MIN_FILL_MS = 2000;
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const SEND_FAILED =
  "Could not send your message right now. Email me directly instead.";
const TOO_MANY =
  "Too many messages from this connection. Try again later, or email me directly.";
const TOO_FAST = "That was submitted too quickly — please try again.";

/**
 * Per-instance rate limit. A serverless deployment runs several instances, so
 * this is a speed bump, not a guarantee — a durable limit needs a store.
 */
const attempts = new Map<string, number[]>();

function isRateLimited(key: string) {
  const now = Date.now();
  const recent = (attempts.get(key) ?? []).filter(
    (at) => now - at < RATE_LIMIT_WINDOW_MS,
  );

  if (recent.length >= RATE_LIMIT_MAX) {
    attempts.set(key, recent);
    return true;
  }

  recent.push(now);
  attempts.set(key, recent);

  if (attempts.size > 1000) {
    for (const [ip, times] of attempts) {
      if (times.every((at) => now - at >= RATE_LIMIT_WINDOW_MS)) {
        attempts.delete(ip);
      }
    }
  }

  return false;
}

async function clientKey() {
  const headerList = await headers();
  const forwarded = headerList.get("x-forwarded-for");
  return (
    forwarded?.split(",")[0]?.trim() || headerList.get("x-real-ip") || "unknown"
  );
}

export async function sendContactMessage(
  _prevState: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const message = String(formData.get("message") ?? "").trim();
  const honeypot = String(formData.get("website") ?? "").trim();
  const startedAt = Number(formData.get("startedAt"));

  const errors: ContactState["errors"] = {};

  if (!email) {
    errors.email = "Enter your email so I can reply.";
  } else if (email.length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(email)) {
    errors.email = "That does not look like a valid email address.";
  }

  if (!message) {
    errors.message = "Write a short message.";
  } else if (message.length > MAX_MESSAGE_LENGTH) {
    errors.message = `Keep it under ${MAX_MESSAGE_LENGTH} characters.`;
  }

  if (errors.email || errors.message) {
    return {
      status: "error",
      message: "Check the fields marked below.",
      errors,
    };
  }

  // Honeypot: report success without sending, so the bot learns nothing.
  if (honeypot) {
    return { status: "success", message: "Thanks — your message is on its way." };
  }

  if (
    Number.isFinite(startedAt) &&
    startedAt > 0 &&
    Date.now() - startedAt < MIN_FILL_MS
  ) {
    return { status: "error", message: TOO_FAST };
  }

  if (isRateLimited(await clientKey())) {
    return { status: "error", message: TOO_MANY, fallback: true };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;

  if (!apiKey || !to) {
    console.error(
      "[contact] RESEND_API_KEY or CONTACT_TO_EMAIL is not set — message not sent",
      { hasApiKey: Boolean(apiKey), hasRecipient: Boolean(to) },
    );
    return { status: "error", message: SEND_FAILED, fallback: true };
  }

  // Without a verified sending domain Resend only accepts
  // `onboarding@resend.dev` as `from` and your own account address as `to`.
  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM ?? "Portfolio <onboarding@resend.dev>",
    to: [to],
    replyTo: email,
    subject: `Portfolio contact from ${email}`,
    text: message,
  });

  if (error) {
    console.error("[contact] Resend rejected the message", error);
    return { status: "error", message: SEND_FAILED, fallback: true };
  }

  return {
    status: "success",
    message: `Thanks — I will reply to ${email} soon.`,
  };
}
