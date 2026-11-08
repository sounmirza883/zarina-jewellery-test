import { ProductCard } from "@/components/product/ProductCard";
import type { Product } from "@/types";

interface ProductGridProps {
  products: Product[];
  /** Number of leading cards loaded with priority */
  priorityCount?: number;
  emptyMessage?: string;
}

export function ProductGrid({ products, priorityCount = 0, emptyMessage = "No products found." }: ProductGridProps) {
  if (products.length === 0) {
    return <p className="py-16 text-center text-muted">{emptyMessage}</p>;
  }
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-4">
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} priority={i < priorityCount} />
      ))}
    </div>
  );
}
