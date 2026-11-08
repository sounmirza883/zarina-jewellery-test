import { Suspense } from "react";
import { ShopCatalog } from "@/components/product/ShopCatalog";
import { Container } from "@/components/ui/Container";
import { ProductGridSkeleton } from "@/components/ui/Skeleton";
import { getCategories, getProducts } from "@/lib/api";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Shop All Jewellery",
  description:
    "Browse all earrings, necklaces, rings and bracelets from Zarina Jewels. Elegant artificial jewellery at reasonable prices with cash on delivery across Pakistan.",
  path: "/shop",
});

export default async function ShopPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  return (
    <Container as="main" className="py-10 sm:py-14">
      <header className="mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl">Shop All Jewellery</h1>
        <span className="gold-line mx-auto mt-4 block w-24" aria-hidden="true" />
        <p className="mx-auto mt-4 max-w-xl text-sm text-muted sm:text-base">
          Earrings, necklaces, rings and bracelets for every day and every occasion.
        </p>
      </header>
      <Suspense fallback={<ProductGridSkeleton />}>
        <ShopCatalog products={products} categories={categories} />
      </Suspense>
    </Container>
  );
}
