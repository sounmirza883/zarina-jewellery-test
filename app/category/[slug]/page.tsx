import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ShopCatalog } from "@/components/product/ShopCatalog";
import { Container } from "@/components/ui/Container";
import { ProductGridSkeleton } from "@/components/ui/Skeleton";
import { siteConfig } from "@/config/site";
import { getCategories, getCategoryBySlug, getProductsByCategory } from "@/lib/api";
import { createMetadata } from "@/lib/seo";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Category not found" };
  return createMetadata({
    title: category.name,
    description: `${category.description} Shop ${category.name.toLowerCase()} from Zarina Jewels with cash on delivery across Pakistan.`,
    path: `/category/${category.slug}`,
    image: category.image,
  });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const products = await getProductsByCategory(category.slug);

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "Shop", item: `${siteConfig.url}/shop` },
      {
        "@type": "ListItem",
        position: 3,
        name: category.name,
        item: `${siteConfig.url}/category/${category.slug}`,
      },
    ],
  };

  return (
    <Container className="py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd).replace(/</g, "\\u003c") }}
      />
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted">
        <ol className="flex flex-wrap items-center gap-x-2">
          <li>
            <Link href="/" className="inline-flex min-h-11 items-center hover:text-gold">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/shop" className="inline-flex min-h-11 items-center hover:text-gold">
              Shop
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-charcoal">
            {category.name}
          </li>
        </ol>
      </nav>

      <header className="mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl">{category.name}</h1>
        <span className="gold-line mx-auto mt-4 block w-24" aria-hidden="true" />
        <p className="mx-auto mt-4 max-w-xl text-sm text-muted sm:text-base">{category.description}</p>
      </header>

      <Suspense fallback={<ProductGridSkeleton />}>
        <ShopCatalog products={products} category={category.slug} />
      </Suspense>
    </Container>
  );
}
