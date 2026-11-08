import { ProductGrid } from "@/components/product/ProductGrid";
import type { Product } from "@/types";

interface RelatedProductsProps {
  products: Product[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  const list = products.slice(0, 4);
  if (list.length === 0) return null;
  return (
    <section aria-labelledby="related-heading" className="mt-16 border-t border-line pt-12 sm:mt-20">
      <h2 id="related-heading" className="mb-6 text-center font-heading text-3xl sm:text-4xl">
        You may also like
      </h2>
      <ProductGrid products={list} />
    </section>
  );
}
