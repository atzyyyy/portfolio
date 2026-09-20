"use client";

import { useActionState, useEffect, useRef } from "react";

import {
  sendContactMessage,
  type ContactState,
} from "@/app/actions/contact";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { site } from "@/lib/data";

const initialState: ContactState = { status: "idle" };

export function ContactForm() {
  const [state, formAction, pending] = useActionState(
    sendContactMessage,
    initialState,
  );
  const startedAtRef = useRef<HTMLInputElement>(null);

  // Stamped into the DOM after mount: the server-rendered and hydrated markup
  // then agree, and a submission faster than 2s reads as a bot server-side.
  useEffect(() => {
    if (startedAtRef.current) {
      startedAtRef.current.value = String(Date.now());
    }
  }, [startedAtRef]);

  const errors = state.errors;

  return (
    <form action={formAction} className="mt-8 max-w-md">
      <FieldGroup>
        <Field data-invalid={Boolean(errors?.email)}>
          <FieldLabel htmlFor="contact-email">Email</FieldLabel>
          <Input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
            aria-invalid={Boolean(errors?.email)}
            aria-describedby={errors?.email ? "contact-email-error" : undefined}
            className="h-11"
          />
          {errors?.email ? (
            <FieldError id="contact-email-error">{errors.email}</FieldError>
          ) : null}
        </Field>

        <Field data-invalid={Boolean(errors?.message)}>
          <FieldLabel htmlFor="contact-message">Message</FieldLabel>
          <Textarea
            id="contact-message"
            name="message"
            rows={5}
            required
            placeholder="What are you building, and what do you need?"
            aria-invalid={Boolean(errors?.message)}
            aria-describedby={
              errors?.message ? "contact-message-error" : undefined
            }
            className="min-h-32"
          />
          {errors?.message ? (
            <FieldError id="contact-message-error">{errors.message}</FieldError>
          ) : null}
        </Field>
      </FieldGroup>

      {/*
        Spam guards. The honeypot sits in the DOM but a person never sees or
        fills it; `startedAt` is stamped in the browser above and a submission
        faster than 2s is treated as a bot.
      */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <input
          id="contact-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <input ref={startedAtRef} type="hidden" name="startedAt" defaultValue="" />

      <div className="mt-6">
        <Button type="submit" size="lg" className="h-11 px-5" disabled={pending}>
          {pending ? "Sending…" : "Send message"}
        </Button>
      </div>

      {state.status === "success" ? (
        <p role="status" className="mt-4 text-sm text-foreground/80">
          {state.message}
        </p>
      ) : null}

      {/*
        Field-level errors are already announced by their own role="alert"; this
        block covers the failures that belong to no single field.
      */}
      {state.status === "error" && !errors ? (
        <div role="alert" className="mt-4 text-sm text-destructive">
          <p>{state.message}</p>
          {state.fallback ? (
            <p className="mt-1 text-foreground/80">
              <a
                href={`mailto:${site.email}`}
                className="underline underline-offset-4"
              >
                {site.email}
              </a>
            </p>
          ) : null}
        </div>
      ) : null}
    </form>
  );
}
