import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductGrid } from "@/components/product/ProductGrid";
import type { Product } from "@/types";

interface ProductSectionProps {
  id?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllHref: string;
  viewAllLabel?: string;
  /** Number of leading cards loaded with priority */
  priorityCount?: number;
  className?: string;
}

/** Reusable home page section: heading, product grid and a "View all" link. */
export function ProductSection({
  id,
  eyebrow,
  title,
  subtitle,
  products,
  viewAllHref,
  viewAllLabel = "View all",
  priorityCount = 0,
  className = "",
}: ProductSectionProps) {
  return (
    <section id={id} aria-label={title} className={`py-14 sm:py-20 ${className}`}>
      <Container>
        <Reveal>
          <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} />
        </Reveal>
        <Reveal className="mt-10" delayMs={100}>
          <ProductGrid products={products} priorityCount={priorityCount} />
        </Reveal>
        <div className="mt-10 flex justify-center">
          <Link
            href={viewAllHref}
            className="inline-flex min-h-11 items-center gap-2 text-sm font-medium tracking-wide text-charcoal uppercase underline-offset-4 transition-colors hover:text-gold hover:underline"
          >
            {viewAllLabel}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
