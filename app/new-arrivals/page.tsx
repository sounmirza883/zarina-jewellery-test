import { Suspense } from "react";
import { ShopCatalog } from "@/components/product/ShopCatalog";
import { Container } from "@/components/ui/Container";
import { ProductGridSkeleton } from "@/components/ui/Skeleton";
import { getCategories, getProducts } from "@/lib/api";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "New Arrivals",
  description: "Discover the newest earrings, necklaces, rings and bracelets at Zarina Jewels. Fresh designs with cash on delivery across Pakistan.",
  path: "/new-arrivals",
});

export default async function Page() {
  const [products, categories] = await Promise.all([getProducts({ isNew: true }), getCategories()]);

  return (
    <Container className="py-10 sm:py-14">
      <header className="mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl">New Arrivals</h1>
        <span className="gold-line mx-auto mt-4 block w-24" aria-hidden="true" />
        <p className="mx-auto mt-4 max-w-xl text-sm text-muted sm:text-base">Fresh designs, just landed. Be the first to wear our latest pieces.</p>
      </header>
      <Suspense fallback={<ProductGridSkeleton />}>
        <ShopCatalog products={products} categories={categories} />
      </Suspense>
    </Container>
  );
}
