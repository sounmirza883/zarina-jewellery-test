"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactValues } from "@/lib/contact-schema";
import { Button } from "@/components/ui/Button";

const fieldBase =
  "min-h-11 w-full rounded-sm border bg-white px-3 py-2.5 text-base text-charcoal placeholder:text-muted/60 focus-visible:outline-gold";

function fieldClass(hasError: boolean): string {
  return `${fieldBase} ${hasError ? "border-red-700" : "border-line"}`;
}

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", phone: "", message: "" },
  });

  // This form only validates. Nothing is sent anywhere.
  const onSubmit = (): void => {
    setSent(true);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5" aria-label="Contact form">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-name" className="text-sm font-medium text-charcoal">
          Name
        </label>
        <input
          id="contact-name"
          type="text"
          autoComplete="name"
          aria-invalid={errors.name ? "true" : "false"}
          aria-describedby={errors.name ? "contact-name-error" : undefined}
          className={fieldClass(Boolean(errors.name))}
          {...register("name", { onChange: () => setSent(false) })}
        />
        {errors.name && (
          <p id="contact-name-error" className="text-sm text-red-700">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-email" className="text-sm font-medium text-charcoal">
          Email
        </label>
        <input
          id="contact-email"
          type="email"
          autoComplete="email"
          inputMode="email"
          aria-invalid={errors.email ? "true" : "false"}
          aria-describedby={errors.email ? "contact-email-error" : undefined}
          className={fieldClass(Boolean(errors.email))}
          {...register("email", { onChange: () => setSent(false) })}
        />
        {errors.email && (
          <p id="contact-email-error" className="text-sm text-red-700">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-phone" className="text-sm font-medium text-charcoal">
          Phone <span className="font-normal text-muted">(optional)</span>
        </label>
        <input
          id="contact-phone"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          placeholder="0300 1234567"
          aria-invalid={errors.phone ? "true" : "false"}
          aria-describedby={errors.phone ? "contact-phone-error" : undefined}
          className={fieldClass(Boolean(errors.phone))}
          {...register("phone", { onChange: () => setSent(false) })}
        />
        {errors.phone && (
          <p id="contact-phone-error" className="text-sm text-red-700">
            {errors.phone.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-message" className="text-sm font-medium text-charcoal">
          Message
        </label>
        <textarea
          id="contact-message"
          rows={5}
          aria-invalid={errors.message ? "true" : "false"}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
          className={`${fieldClass(Boolean(errors.message))} resize-y`}
          {...register("message", { onChange: () => setSent(false) })}
        />
        {errors.message && (
          <p id="contact-message-error" className="text-sm text-red-700">
            {errors.message.message}
          </p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
        Send message
      </Button>

      <div aria-live="polite" role="status">
        {sent && (
          <p className="rounded-sm border border-gold/40 bg-ivory-deep px-4 py-3 text-sm text-charcoal">
            Thank you. Your message looks good. For a quick reply, please call or message us on WhatsApp.
          </p>
        )}
      </div>
    </form>
  );
}
