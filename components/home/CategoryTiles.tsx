import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ProductImage } from "@/components/ui/ProductImage";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getCategories } from "@/lib/api";

export async function CategoryTiles() {
  const categories = await getCategories();
  return (
    <section aria-label="Shop by category" className="py-14 sm:py-20">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Collections"
            title="Shop by Category"
            subtitle="Find the piece that completes your look"
          />
        </Reveal>
        <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {categories.map((cat, i) => (
            <li key={cat.slug}>
              <Reveal delayMs={i * 80}>
                <Link
                  href={`/category/${cat.slug}`}
                  className="group relative block overflow-hidden rounded-sm"
                  aria-label={`Shop ${cat.name}`}
                >
                  <ProductImage
                    src={cat.image}
                    alt={`${cat.name} collection`}
                    className="aspect-square"
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    zoom
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/10 to-transparent"
                  />
                  <span className="absolute inset-x-0 bottom-0 p-3 text-center font-heading text-xl text-ivory sm:p-5 sm:text-2xl">
                    {cat.name}
                  </span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
