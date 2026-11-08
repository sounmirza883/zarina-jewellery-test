import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

interface MetaInput {
  title: string;
  description: string;
  /** Path starting with a slash, for example "/shop" */
  path: string;
  image?: string;
  noIndex?: boolean;
}

/** Builds metadata with canonical URL and Open Graph tags for a page. */
export function createMetadata({ title, description, path, image, noIndex }: MetaInput): Metadata {
  const url = `${siteConfig.url}${path}`;
  const ogImage = image ?? "/images/brand/og-image.jpg";
  return {
    title,
    description,
    alternates: { canonical: path },
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "website",
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      title: `${title} | ${siteConfig.name}`,
      description,
      images: [{ url: ogImage, alt: title }],
    },
    twitter: { card: "summary_large_image", title: `${title} | ${siteConfig.name}`, description },
  };
}
