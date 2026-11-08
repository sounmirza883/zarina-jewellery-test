"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { useForm, useWatch, type FieldError } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Banknote, ShoppingBag } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { ProductImage } from "@/components/ui/ProductImage";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatPrice } from "@/lib/format";
import { PROVINCES, checkoutSchema, normalizePhone, type CheckoutValues } from "@/lib/schemas";
import { computeTotals, useCartStore } from "@/store/cart";
import { generateOrderNumber, saveOrder } from "@/store/orders";
import type { Order } from "@/types";

const noopSubscribe = () => () => {};

function useMounted(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

const inputCls =
  "block min-h-11 w-full rounded-sm border border-line bg-white px-3 py-2.5 text-base text-charcoal placeholder:text-muted/60 transition-colors duration-200 focus:border-gold aria-[invalid=true]:border-red-700";

interface FieldProps {
  id: string;
  label: string;
  optional?: boolean;
  error?: FieldError;
  hint?: string;
  children: (describedBy: string | undefined) => React.ReactNode;
}

function Field({ id, label, optional, error, hint, children }: FieldProps) {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ") || undefined;
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
        {optional && <span className="ml-1 font-normal text-muted">(optional)</span>}
      </label>
      {children(describedBy)}
      {hint && !error && (
        <p id={hintId} className="mt-1 text-xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="mt-1 text-sm text-red-700">
          {error.message}
        </p>
      )}
    </div>
  );
}

export function CheckoutForm() {
  const router = useRouter();
  const mounted = useMounted();
  const items = useCartStore((s) => s.items);
  const clear = useCartStore((s) => s.clear);
  const [submitError, setSubmitError] = useState(false);
  const [placed, setPlaced] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      whatsapp: "",
      email: "",
      province: undefined,
      city: "",
      address: "",
      notes: "",
    },
  });

  const notesLength = (useWatch({ control, name: "notes" }) ?? "").length;

  if (!mounted || placed) {
    return (
      <div className="grid gap-8 lg:grid-cols-[1fr_400px]" role="status" aria-label="Loading checkout">
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-72 w-full" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center py-16 text-center">
        <ShoppingBag className="h-12 w-12 text-gold" strokeWidth={1.2} aria-hidden="true" />
        <h2 className="mt-5 font-heading text-2xl">Your cart is empty</h2>
        <p className="mt-2 text-muted">Add a few pieces to your cart before checking out.</p>
        <ButtonLink href="/shop" className="mt-6">
          Browse the Shop
        </ButtonLink>
      </div>
    );
  }

  const totals = computeTotals(items);

  async function onSubmit(values: CheckoutValues) {
    setSubmitError(false);
    try {
      const whatsapp = values.whatsapp ? normalizePhone(values.whatsapp) : undefined;
      const order: Order = {
        orderNumber: generateOrderNumber(),
        createdAt: new Date().toISOString(),
        customer: {
          fullName: values.fullName,
          phone: normalizePhone(values.phone),
          whatsapp,
          email: values.email || undefined,
          province: values.province,
          city: values.city,
          address: values.address,
          notes: values.notes || undefined,
        },
        items,
        subtotal: totals.subtotal,
        shipping: totals.shipping,
        total: totals.total,
        paymentMethod: "Cash on Delivery",
      };
      saveOrder(order);
      setPlaced(true);
      clear();
      router.push("/order-success");
    } catch {
      setSubmitError(true);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="grid gap-8 lg:grid-cols-[1fr_400px] lg:gap-12"
    >
      <div className="space-y-10">
        <section aria-labelledby="delivery-heading">
          <h2 id="delivery-heading" className="font-heading text-2xl">
            Delivery Details
          </h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field id="fullName" label="Full name" error={errors.fullName}>
                {(d) => (
                  <input
                    id="fullName"
                    type="text"
                    autoComplete="name"
                    className={inputCls}
                    aria-invalid={errors.fullName ? true : undefined}
                    aria-describedby={d}
                    {...register("fullName")}
                  />
                )}
              </Field>
            </div>

            <Field id="phone" label="Phone number" error={errors.phone} hint="For example 0300 1234567">
              {(d) => (
                <input
                  id="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  className={inputCls}
                  aria-invalid={errors.phone ? true : undefined}
                  aria-describedby={d}
                  {...register("phone")}
                />
              )}
            </Field>

            <Field id="whatsapp" label="WhatsApp number" optional error={errors.whatsapp}>
              {(d) => (
                <input
                  id="whatsapp"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  className={inputCls}
                  aria-invalid={errors.whatsapp ? true : undefined}
                  aria-describedby={d}
                  {...register("whatsapp")}
                />
              )}
            </Field>

            <div className="sm:col-span-2">
              <Field id="email" label="Email" optional error={errors.email}>
                {(d) => (
                  <input
                    id="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    className={inputCls}
                    aria-invalid={errors.email ? true : undefined}
                    aria-describedby={d}
                    {...register("email")}
                  />
                )}
              </Field>
            </div>

            <Field id="province" label="Province" error={errors.province}>
              {(d) => (
                <select
                  id="province"
                  autoComplete="address-level1"
                  className={inputCls}
                  aria-invalid={errors.province ? true : undefined}
                  aria-describedby={d}
                  defaultValue=""
                  {...register("province")}
                >
                  <option value="" disabled>
                    Select province
                  </option>
                  {PROVINCES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              )}
            </Field>

            <Field id="city" label="City" error={errors.city}>
              {(d) => (
                <input
                  id="city"
                  type="text"
                  autoComplete="address-level2"
                  className={inputCls}
                  aria-invalid={errors.city ? true : undefined}
                  aria-describedby={d}
                  {...register("city")}
                />
              )}
            </Field>

            <div className="sm:col-span-2">
              <Field id="address" label="Complete address" error={errors.address} hint="House, street, area and nearby landmark">
                {(d) => (
                  <textarea
                    id="address"
                    rows={3}
                    autoComplete="street-address"
                    className={inputCls}
                    aria-invalid={errors.address ? true : undefined}
                    aria-describedby={d}
                    {...register("address")}
                  />
                )}
              </Field>
            </div>

            <div className="sm:col-span-2">
              <Field id="notes" label="Order notes" optional error={errors.notes}>
                {(d) => (
                  <>
                    <textarea
                      id="notes"
                      rows={2}
                      maxLength={300}
                      className={inputCls}
                      aria-invalid={errors.notes ? true : undefined}
                      aria-describedby={d}
                      {...register("notes")}
                    />
                    <p className="mt-1 text-right text-xs text-muted" aria-hidden="true">
                      {notesLength}/300
                    </p>
                  </>
                )}
              </Field>
            </div>
          </div>
        </section>

        <section aria-labelledby="payment-heading">
          <h2 id="payment-heading" className="font-heading text-2xl">
            Payment
          </h2>
          <label className="mt-5 flex cursor-not-allowed items-start gap-3 border border-gold bg-white p-4">
            <input type="radio" name="payment" value="cod" checked disabled readOnly className="mt-1 h-4 w-4 accent-[#b8893b]" />
            <span className="flex-1">
              <span className="flex items-center gap-2 font-medium">
                <Banknote className="h-5 w-5 text-gold" aria-hidden="true" />
                Cash on Delivery
              </span>
              <span className="mt-1 block text-sm text-muted">Pay in cash when your order arrives</span>
            </span>
          </label>
        </section>
      </div>

      <aside className="h-fit border border-line bg-white p-5 sm:p-6 lg:sticky lg:top-28" aria-label="Order summary">
        <h2 className="font-heading text-2xl">Order Summary</h2>
        <ul className="mt-4 divide-y divide-line">
          {items.map((item) => (
            <li key={item.key} className="flex gap-3 py-3">
              <div className="relative shrink-0">
                <ProductImage src={item.image} alt={item.name} className="aspect-[4/5] w-14" sizes="56px" />
                <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-navy px-1 text-xs text-ivory">
                  {item.quantity}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium leading-snug">{item.name}</p>
                <p className="text-xs text-muted">
                  {[item.color, item.size ? `Size ${item.size}` : null].filter(Boolean).join(" / ")}
                </p>
              </div>
              <p className="shrink-0 text-sm">{formatPrice(item.price * item.quantity)}</p>
            </li>
          ))}
        </ul>

        <dl className="mt-4 space-y-3 border-t border-line pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Subtotal</dt>
            <dd>{formatPrice(totals.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Shipping</dt>
            <dd>{totals.shipping === 0 ? "Free" : formatPrice(totals.shipping)}</dd>
          </div>
          <div className="flex justify-between border-t border-line pt-3 text-base font-semibold">
            <dt>Total</dt>
            <dd>{formatPrice(totals.total)}</dd>
          </div>
        </dl>

        {submitError && (
          <p role="alert" className="mt-4 text-sm text-red-700">
            Something went wrong while placing your order. Please try again.
          </p>
        )}

        <Button type="submit" variant="dark" className="mt-6 w-full" disabled={isSubmitting}>
          {isSubmitting ? "Placing Order..." : "Place Order"}
        </Button>
        <p className="mt-3 text-center text-xs text-muted">
          <Link href="/cart" className="underline underline-offset-4 hover:text-gold">
            Back to cart
          </Link>
        </p>
      </aside>
    </form>
  );
}
