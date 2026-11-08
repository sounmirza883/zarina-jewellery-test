import { BrandStory } from "@/components/home/BrandStory";
import { CategoryTiles } from "@/components/home/CategoryTiles";
import { Hero } from "@/components/home/Hero";
import { ProductSection } from "@/components/home/ProductSection";
import { TrustStrip } from "@/components/home/TrustStrip";
import { siteConfig } from "@/config/site";
import { getProducts } from "@/lib/api";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Elegant Artificial Jewellery in Pakistan",
  description: siteConfig.description,
  path: "/",
});

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteConfig.url}/#website`,
      url: siteConfig.url,
      name: siteConfig.name,
      description: siteConfig.description,
      inLanguage: "en-PK",
      potentialAction: {
        "@type": "SearchAction",
        target: `${siteConfig.url}/shop?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Organization",
      "@id": `${siteConfig.url}/#organization`,
      name: siteConfig.name,
      url: siteConfig.url,
      logo: `${siteConfig.url}/images/brand/logo.png`,
      email: siteConfig.contact.email,
      telephone: siteConfig.contact.phone,
      address: { "@type": "PostalAddress", addressCountry: "PK", addressLocality: "Lahore" },
      sameAs: Object.values(siteConfig.social),
    },
  ],
};

export default async function HomePage() {
  const [newArrivals, bestSellers] = await Promise.all([
    getProducts({ isNew: true, sort: "newest" }),
    getProducts({ isBestSeller: true }),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Hero />
      <CategoryTiles />
      <ProductSection
        id="new-arrivals"
        eyebrow="Just In"
        title="New Arrivals"
        subtitle="Fresh styles added to the collection"
        products={newArrivals.slice(0, 4)}
        viewAllHref="/new-arrivals"
        viewAllLabel="View all new arrivals"
        className="bg-ivory"
      />
      <ProductSection
        id="best-sellers"
        eyebrow="Loved by Many"
        title="Best Sellers"
        subtitle="Our most popular pieces"
        products={bestSellers.slice(0, 4)}
        viewAllHref="/best-sellers"
        viewAllLabel="View all jewellery"
        className="bg-ivory-deep/40"
      />
      <TrustStrip />
      <BrandStory />
    </>
  );
}
