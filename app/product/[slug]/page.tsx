import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfo } from "@/components/product/ProductInfo";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/config/site";
import { getCategoryBySlug, getProductBySlug, getProducts, getRelatedProducts } from "@/lib/api";
import { createMetadata } from "@/lib/seo";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return createMetadata({ title: "Product not found", description: siteConfig.description, path: `/product/${slug}`, noIndex: true });
  return createMetadata({
    title: product.name,
    description: product.description,
    path: `/product/${product.slug}`,
    image: product.images[0],
  });
}

function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [category, related] = await Promise.all([
    getCategoryBySlug(product.category),
    getRelatedProducts(product, 4),
  ]);

  const url = `${siteConfig.url}/product/${product.slug}`;
  const categoryName = category?.name ?? product.category;
  const categoryPath = `/category/${product.category}`;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images.map((src) => `${siteConfig.url}${src}`),
    description: product.description,
    sku: product.id,
    brand: { "@type": "Brand", name: siteConfig.name },
    offers: {
      "@type": "Offer",
      priceCurrency: siteConfig.currency,
      price: product.price,
      availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url,
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: categoryName, item: `${siteConfig.url}${categoryPath}` },
      { "@type": "ListItem", position: 3, name: product.name, item: url },
    ],
  };

  return (
    <Container className="py-6 sm:py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema) }} />

      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <li>
            <Link href="/" className="inline-flex min-h-6 items-center hover:text-gold">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href={categoryPath} className="inline-flex min-h-6 items-center hover:text-gold">
              {categoryName}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-charcoal">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
        <ProductGallery name={product.name} images={product.images} />
        <ProductInfo product={product} />
      </div>

      <RelatedProducts products={related} />
    </Container>
  );
}
