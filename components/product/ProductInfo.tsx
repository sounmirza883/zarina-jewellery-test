"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, MessageCircle, Truck } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/config/site";
import { discountPercent, formatPrice } from "@/lib/format";
import { whatsappLink } from "@/lib/whatsapp";
import { MAX_QTY, useCartStore } from "@/store/cart";
import { useToastStore } from "@/store/toast";
import type { Product } from "@/types";

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const push = useToastStore((s) => s.push);

  const [colorIndex, setColorIndex] = useState(0);
  const [size, setSize] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const color = product.colors[colorIndex];
  const needsSize = product.sizes.length > 0;
  const onSale = typeof product.compareAtPrice === "number" && product.compareAtPrice > product.price;
  const percentOff = discountPercent(product.price, product.compareAtPrice);

  const pageUrl = `${siteConfig.url}/product/${product.slug}`;
  const inquiry = whatsappLink(
    `Hello, I would like to ask about ${product.name}. ${pageUrl}`,
  );

  function selectColor(i: number) {
    setColorIndex(i);
  }

  function addToCart(openDrawer: boolean): boolean {
    if (!product.inStock) return false;
    if (needsSize && !size) {
      setSizeError(true);
      return false;
    }
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        image: product.images[0] ?? "",
        price: product.price,
        color: color?.name ?? "Default",
        size: size ?? undefined,
        quantity,
      },
      openDrawer,
    );
    push(`${product.name} added to cart`);
    return true;
  }

  function buyNow() {
    if (addToCart(false)) router.push("/checkout");
  }

  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        {product.isNew && <Badge kind="New" />}
        {product.isBestSeller && <Badge kind="Best Seller" />}
        {onSale && <Badge kind="Sale" />}
      </div>

      <h1 className="mt-3 font-heading text-4xl leading-tight sm:text-5xl">{product.name}</h1>

      <p className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="text-2xl font-semibold text-charcoal">{formatPrice(product.price)}</span>
        {onSale && product.compareAtPrice && (
          <>
            <span className="text-base text-muted line-through">
              <span className="sr-only">Original price </span>
              {formatPrice(product.compareAtPrice)}
            </span>
            {percentOff > 0 && (
              <span className="text-sm font-semibold text-gold">{percentOff}% off</span>
            )}
          </>
        )}
      </p>

      <p className="mt-5 leading-relaxed text-muted">{product.description}</p>

      {product.colors.length > 0 && (
        <fieldset className="mt-6">
          <legend className="text-sm font-medium">
            Color: <span className="font-normal text-muted">{color?.name}</span>
          </legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {product.colors.map((c, i) => {
              const selected = i === colorIndex;
              return (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => selectColor(i)}
                  aria-label={c.name}
                  aria-pressed={selected}
                  className="flex h-11 w-11 items-center justify-center rounded-full"
                >
                  <span
                    className={`block h-8 w-8 rounded-full border border-black/10 transition-shadow ${
                      selected ? "ring-2 ring-gold ring-offset-2 ring-offset-ivory" : "hover:ring-1 hover:ring-line"
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      {needsSize && (
        <fieldset className="mt-6">
          <legend className="text-sm font-medium">
            Ring size: <span className="font-normal text-muted">{size ?? "Select a size"}</span>
          </legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {product.sizes.map((s) => {
              const selected = s === size;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    setSize(s);
                    setSizeError(false);
                  }}
                  aria-pressed={selected}
                  className={`min-h-11 min-w-11 rounded-sm border px-3 text-sm transition-colors ${
                    selected
                      ? "border-gold bg-gold text-white"
                      : "border-line bg-white hover:border-gold"
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
          {sizeError && (
            <p role="alert" className="mt-2 text-sm text-gold">
              Please choose a ring size to continue
            </p>
          )}
        </fieldset>
      )}

      <div className="mt-6">
        <p id="qty-label" className="text-sm font-medium">
          Quantity
        </p>
        <div
          role="group"
          aria-labelledby="qty-label"
          className="mt-2 inline-flex items-center rounded-sm border border-line bg-white"
        >
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
            className="flex h-11 w-11 items-center justify-center hover:text-gold disabled:opacity-40"
          >
            <Minus className="h-4 w-4" aria-hidden="true" />
          </button>
          <span className="w-10 text-center text-sm font-medium" aria-live="polite">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(MAX_QTY, q + 1))}
            disabled={quantity >= MAX_QTY}
            aria-label="Increase quantity"
            className="flex h-11 w-11 items-center justify-center hover:text-gold disabled:opacity-40"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {!product.inStock && (
        <p className="mt-6 text-sm font-medium text-muted" role="status">
          This piece is currently sold out. Message us on WhatsApp to ask about restocks.
        </p>
      )}

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Button variant="secondary" disabled={!product.inStock} onClick={() => addToCart(true)}>
          {product.inStock ? "Add to Cart" : "Sold Out"}
        </Button>
        <Button variant="primary" disabled={!product.inStock} onClick={buyNow}>
          Buy Now
        </Button>
      </div>

      <p className="mt-4 flex items-center gap-2 text-sm text-muted">
        <Truck className="h-4 w-4 text-gold" aria-hidden="true" />
        Cash on Delivery available
      </p>

      <a
        href={inquiry}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm text-charcoal underline-offset-4 hover:text-gold hover:underline"
      >
        <MessageCircle className="h-4 w-4 text-gold" aria-hidden="true" />
        Ask about this piece on WhatsApp
      </a>

      {product.details.length > 0 && (
        <section className="mt-8 border-t border-line pt-6" aria-labelledby="details-heading">
          <h2 id="details-heading" className="font-heading text-2xl">
            Details
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            {product.details.map((d) => (
              <li key={d} className="flex gap-2">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold" aria-hidden="true" />
                {d}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
