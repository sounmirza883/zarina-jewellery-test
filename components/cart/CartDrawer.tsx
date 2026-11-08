"use client";

import Link from "next/link";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { buttonClasses } from "@/components/ui/Button";
import { ProductImage } from "@/components/ui/ProductImage";
import { siteConfig } from "@/config/site";
import { formatPrice } from "@/lib/format";
import { MAX_QTY, computeTotals, useCartStore } from "@/store/cart";

const subscribeNoop = () => () => {};

export function CartDrawer() {
  const mounted = useSyncExternalStore(subscribeNoop, () => true, () => false);
  const open = useCartStore((s) => s.isDrawerOpen);
  const items = useCartStore((s) => s.items);
  const closeDrawer = useCartStore((s) => s.closeDrawer);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const isOpen = mounted && open;
  const totals = computeTotals(items);
  const threshold = siteConfig.shipping.freeShippingThreshold;

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        closeDrawer();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
      previous?.focus?.();
    };
  }, [isOpen, closeDrawer]);

  const progress =
    threshold !== null && threshold > 0 ? Math.min(100, Math.round((totals.subtotal / threshold) * 100)) : 0;

  return (
    <div className={`fixed inset-0 z-[60] ${isOpen ? "" : "pointer-events-none"}`} aria-hidden={!isOpen}>
      <div
        onClick={closeDrawer}
        className={`absolute inset-0 bg-navy/60 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        inert={!isOpen}
        className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-ivory shadow-xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-4">
          <h2 className="font-heading text-2xl text-charcoal">
            Your Cart{items.length > 0 ? ` (${totals.count})` : ""}
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={closeDrawer}
            aria-label="Close cart"
            className="-mr-2 inline-flex h-11 w-11 items-center justify-center text-charcoal hover:text-gold"
          >
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <ShoppingBag className="h-12 w-12 text-gold/70" aria-hidden="true" />
            <p className="font-heading text-2xl text-charcoal">Your cart is empty</p>
            <p className="text-sm text-muted">Discover earrings, necklaces, rings and bracelets you will love.</p>
            <Link href="/shop" onClick={closeDrawer} className={buttonClasses("primary")}>
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-line overflow-y-auto px-4">
              {items.map((item) => (
                <li key={item.key} className="flex gap-3 py-4">
                  <Link href={`/product/${item.slug}`} onClick={closeDrawer} className="block w-20 shrink-0">
                    <ProductImage src={item.image} alt={item.name} className="aspect-[4/5] w-20" sizes="80px" />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/product/${item.slug}`}
                        onClick={closeDrawer}
                        className="text-sm font-medium text-charcoal hover:text-gold"
                      >
                        {item.name}
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeItem(item.key)}
                        aria-label={`Remove ${item.name} from cart`}
                        className="-mt-2 -mr-2 inline-flex h-11 w-11 shrink-0 items-center justify-center text-muted hover:text-[#8c2f39]"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                    <p className="text-xs text-muted">
                      {item.color}
                      {item.size ? ` / Size ${item.size}` : ""}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="inline-flex items-center rounded-sm border border-line">
                        <button
                          type="button"
                          onClick={() => setQuantity(item.key, item.quantity - 1)}
                          aria-label={`Decrease quantity of ${item.name}`}
                          className="inline-flex h-11 w-11 items-center justify-center hover:text-gold"
                        >
                          <Minus className="h-4 w-4" aria-hidden="true" />
                        </button>
                        <span className="w-7 text-center text-sm" aria-live="polite">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQuantity(item.key, item.quantity + 1)}
                          disabled={item.quantity >= MAX_QTY}
                          aria-label={`Increase quantity of ${item.name}`}
                          className="inline-flex h-11 w-11 items-center justify-center hover:text-gold disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Plus className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                      <p className="text-sm font-semibold text-charcoal">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="shrink-0 border-t border-line bg-ivory px-4 py-4">
              {threshold !== null && (
                <div className="mb-4">
                  <p className="text-xs text-muted">
                    {totals.amountToFreeShipping !== null
                      ? `Add ${formatPrice(totals.amountToFreeShipping)} more for free shipping`
                      : "You have unlocked free shipping"}
                  </p>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-line" aria-hidden="true">
                    <div
                      className="h-full rounded-full bg-gold transition-[width] duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}
              <dl className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted">Subtotal</dt>
                  <dd className="font-semibold text-charcoal">{formatPrice(totals.subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Shipping</dt>
                  <dd className="text-charcoal">{totals.shipping === 0 ? "Free" : formatPrice(totals.shipping)}</dd>
                </div>
              </dl>
              <p className="mt-2 text-xs text-muted">Cash on Delivery. Taxes included.</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <Link href="/cart" onClick={closeDrawer} className={buttonClasses("secondary", "px-3")}>
                  View Cart
                </Link>
                <Link href="/checkout" onClick={closeDrawer} className={buttonClasses("primary", "px-3")}>
                  Checkout
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
