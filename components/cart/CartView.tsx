"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { ProductImage } from "@/components/ui/ProductImage";
import { Skeleton } from "@/components/ui/Skeleton";
import { siteConfig } from "@/config/site";
import { formatPrice } from "@/lib/format";
import { MAX_QTY, computeTotals, useCartStore } from "@/store/cart";

const noopSubscribe = () => () => {};

function useMounted(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

const stepBtn =
  "flex h-11 w-11 items-center justify-center text-charcoal transition-colors duration-200 hover:bg-ivory-deep disabled:cursor-not-allowed disabled:opacity-40";

export function CartView() {
  const mounted = useMounted();
  const items = useCartStore((s) => s.items);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  if (!mounted) {
    return (
      <div className="grid gap-8 lg:grid-cols-[1fr_380px]" role="status" aria-label="Loading your cart">
        <div className="space-y-4">
          {[0, 1].map((i) => (
            <div key={i} className="flex gap-4 border-b border-line pb-4">
              <Skeleton className="h-24 w-20 shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            </div>
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center py-16 text-center">
        <ShoppingBag className="h-12 w-12 text-gold" strokeWidth={1.2} aria-hidden="true" />
        <h2 className="mt-5 font-heading text-2xl">Your cart is empty</h2>
        <p className="mt-2 text-muted">Looks like you have not added any jewellery yet. Explore our latest pieces.</p>
        <ButtonLink href="/shop" className="mt-6">
          Start Shopping
        </ButtonLink>
      </div>
    );
  }

  const totals = computeTotals(items);
  const threshold = siteConfig.shipping.freeShippingThreshold;
  const progress = threshold ? Math.min(100, Math.round((totals.subtotal / threshold) * 100)) : 0;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:gap-12">
      <ul className="divide-y divide-line border-y border-line" aria-label="Cart items">
        {items.map((item) => {
          const variant = [item.color, item.size ? `Size ${item.size}` : null].filter(Boolean).join(" / ");
          return (
            <li key={item.key} className="flex gap-4 py-5">
              <Link href={`/product/${item.slug}`} className="shrink-0" aria-label={item.name}>
                <ProductImage
                  src={item.image}
                  alt={item.name}
                  className="aspect-[4/5] w-20 sm:w-24"
                  sizes="96px"
                />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link
                      href={`/product/${item.slug}`}
                      className="font-heading text-lg leading-snug transition-colors hover:text-gold"
                    >
                      {item.name}
                    </Link>
                    <p className="mt-0.5 text-sm text-muted">{variant}</p>
                    <p className="mt-0.5 text-sm text-muted">{formatPrice(item.price)} each</p>
                  </div>
                  <p className="shrink-0 font-medium">{formatPrice(item.price * item.quantity)}</p>
                </div>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3">
                  <div className="inline-flex items-center border border-line bg-white">
                    <button
                      type="button"
                      className={stepBtn}
                      aria-label={`Decrease quantity of ${item.name}`}
                      onClick={() => setQuantity(item.key, item.quantity - 1)}
                    >
                      <Minus className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium" aria-live="polite">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      className={stepBtn}
                      aria-label={`Increase quantity of ${item.name}`}
                      disabled={item.quantity >= MAX_QTY}
                      onClick={() => setQuantity(item.key, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.key)}
                    className="inline-flex min-h-11 items-center gap-1.5 px-2 text-sm text-muted transition-colors hover:text-gold"
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                    Remove
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <aside className="h-fit border border-line bg-white p-5 sm:p-6 lg:sticky lg:top-28" aria-label="Order summary">
        <h2 className="font-heading text-2xl">Order Summary</h2>

        {threshold !== null && (
          <div className="mt-4">
            <p className="text-sm text-muted">
              {totals.amountToFreeShipping !== null
                ? `Add ${formatPrice(totals.amountToFreeShipping)} more for free shipping`
                : "You have unlocked free shipping"}
            </p>
            <div
              className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-ivory-deep"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Progress towards free shipping"
            >
              <div
                className="h-full rounded-full bg-gold transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <dl className="mt-5 space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Subtotal ({totals.count} {totals.count === 1 ? "item" : "items"})</dt>
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
        <p className="mt-2 text-xs text-muted">Cash on Delivery available across Pakistan.</p>

        <div className="mt-6 flex flex-col gap-3">
          <ButtonLink href="/checkout" variant="dark" className="w-full">
            Proceed to Checkout
          </ButtonLink>
          <ButtonLink href="/shop" variant="secondary" className="w-full">
            Continue Shopping
          </ButtonLink>
        </div>
      </aside>
    </div>
  );
}
