"use client";

import { useSyncExternalStore } from "react";
import { CheckCircle2, ShoppingBag } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatPrice } from "@/lib/format";
import { loadLastOrder } from "@/store/orders";
import type { Order } from "@/types";

const KEY = "zarina-last-order-v1";

function subscribe(onChange: () => void): () => void {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

/** Raw string snapshot keeps useSyncExternalStore stable between renders. */
function getRawSnapshot(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

function useLastOrder(): { mounted: boolean; order: Order | null } {
  const raw = useSyncExternalStore(subscribe, getRawSnapshot, () => "__server__");
  if (raw === "__server__") return { mounted: false, order: null };
  return { mounted: true, order: raw ? loadLastOrder() : null };
}

export function OrderSuccess() {
  const { mounted, order } = useLastOrder();

  if (!mounted) {
    return (
      <div className="mx-auto max-w-2xl space-y-4" role="status" aria-label="Loading your order">
        <Skeleton className="mx-auto h-12 w-12 rounded-full" />
        <Skeleton className="mx-auto h-8 w-2/3" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center py-16 text-center">
        <ShoppingBag className="h-12 w-12 text-gold" strokeWidth={1.2} aria-hidden="true" />
        <h1 className="mt-5 text-3xl">No recent order found</h1>
        <p className="mt-2 text-muted">
          We could not find an order on this device. Browse our collection to find something you will love.
        </p>
        <ButtonLink href="/shop" className="mt-6">
          Go to Shop
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="text-center">
        <CheckCircle2 className="mx-auto h-14 w-14 text-gold" strokeWidth={1.2} aria-hidden="true" />
        <h1 className="mt-4 text-3xl sm:text-4xl">Thank you, {order.customer.fullName.split(" ")[0]}</h1>
        <p className="mt-2 text-muted">Your order has been placed successfully.</p>
        <p className="mt-4 inline-block border border-gold px-4 py-2 text-sm">
          Order number <span className="ml-1 font-semibold tracking-wide">{order.orderNumber}</span>
        </p>
      </div>

      <p className="mt-6 bg-ivory-deep p-4 text-center text-sm">
        Our team will confirm your order by phone or WhatsApp shortly. Please keep your phone nearby.
      </p>

      <section className="mt-8 border border-line bg-white p-5 sm:p-6" aria-label="Order details">
        <ul className="divide-y divide-line">
          {order.items.map((item) => (
            <li key={item.key} className="flex justify-between gap-3 py-3 text-sm">
              <div className="min-w-0">
                <p className="font-medium">{item.name}</p>
                <p className="text-xs text-muted">
                  {[item.color, item.size ? `Size ${item.size}` : null].filter(Boolean).join(" / ")} x {item.quantity}
                </p>
              </div>
              <p className="shrink-0">{formatPrice(item.price * item.quantity)}</p>
            </li>
          ))}
        </ul>
        <dl className="mt-3 space-y-2 border-t border-line pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Subtotal</dt>
            <dd>{formatPrice(order.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Shipping</dt>
            <dd>{order.shipping === 0 ? "Free" : formatPrice(order.shipping)}</dd>
          </div>
          <div className="flex justify-between border-t border-line pt-3 text-base font-semibold">
            <dt>Total</dt>
            <dd>{formatPrice(order.total)}</dd>
          </div>
        </dl>
        <dl className="mt-5 space-y-2 border-t border-line pt-4 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Name</dt>
            <dd className="text-right">{order.customer.fullName}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">City</dt>
            <dd className="text-right">{order.customer.city}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Payment</dt>
            <dd className="text-right">{order.paymentMethod}</dd>
          </div>
        </dl>
      </section>

      <div className="mt-8 text-center">
        <ButtonLink href="/shop">Continue Shopping</ButtonLink>
      </div>
    </div>
  );
}
