"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { ProductImage } from "@/components/ui/ProductImage";
import { formatPrice } from "@/lib/format";
import { useCartStore } from "@/store/cart";
import { useToastStore } from "@/store/toast";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const push = useToastStore((s) => s.push);

  const onSale = typeof product.compareAtPrice === "number" && product.compareAtPrice > product.price;
  const needsOptions = product.sizes.length > 0 || product.colors.length > 1;
  const href = `/product/${product.slug}`;

  function quickAdd() {
    const color = product.colors[0]?.name ?? "Default";
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0] ?? "",
      price: product.price,
      color,
      size: product.sizes[0],
    });
    push(`${product.name} added to cart`);
  }

  return (
    <article className="group relative">
      <Link href={href} className="block" aria-label={product.name}>
        <ProductImage
          src={product.images[0] ?? ""}
          alt={`${product.name} in ${product.colors[0]?.name ?? "gold-tone"}`}
          zoom
          priority={priority}
        />
      </Link>

      <div className="pointer-events-none absolute left-2 top-2 flex flex-col gap-1">
        {product.isNew && <Badge kind="New" />}
        {product.isBestSeller && <Badge kind="Best Seller" />}
        {onSale && <Badge kind="Sale" />}
      </div>

      {!product.inStock && (
        <span className="absolute right-2 top-2 rounded-sm bg-white/90 px-2 py-1 text-[10px] font-semibold tracking-wider text-muted uppercase">
          Sold out
        </span>
      )}

      <div className="mt-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate font-heading text-lg leading-tight">
            <Link href={href} className="hover:text-gold">
              {product.name}
            </Link>
          </h3>
          <p className="mt-1 flex flex-wrap items-baseline gap-x-2 text-sm">
            <span className="font-semibold text-charcoal">{formatPrice(product.price)}</span>
            {onSale && product.compareAtPrice && (
              <span className="text-xs text-muted line-through">{formatPrice(product.compareAtPrice)}</span>
            )}
          </p>
        </div>

        {product.inStock &&
          (needsOptions ? (
            <Link
              href={href}
              aria-label={`Choose options for ${product.name}`}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/60 text-gold transition-colors hover:bg-gold hover:text-white"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
            </Link>
          ) : (
            <button
              type="button"
              onClick={quickAdd}
              aria-label={`Quick add ${product.name} to cart`}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/60 text-gold transition-colors hover:bg-gold hover:text-white"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
            </button>
          ))}
      </div>
    </article>
  );
}
