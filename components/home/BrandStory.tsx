import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { ProductImage } from "@/components/ui/ProductImage";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteConfig } from "@/config/site";

export function BrandStory() {
  return (
    <section aria-label={`About ${siteConfig.name}`} className="py-14 sm:py-20">
      <Container className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <ProductImage
            src="/images/brand/story.jpg"
            alt="Gold-tone and zircon jewellery from Zarina Jewels arranged on a soft surface"
            className="aspect-[4/5] rounded-sm"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </Reveal>
        <Reveal delayMs={100} className="flex flex-col items-center gap-5 text-center lg:items-start lg:text-left">
          <SectionHeading eyebrow="Our Story" title={`The ${siteConfig.name} Way`} align="center" />
          <p className="max-w-prose text-sm leading-relaxed text-muted sm:text-base">
            {siteConfig.name} brings you elegant, stylish and affordable artificial jewellery for every day and every
            occasion. Each piece is crafted in gold-tone finishes with sparkling zircon stones, chosen for quality and
            priced reasonably so you can add a little shine to your wardrobe without worry.
          </p>
          <p className="max-w-prose text-sm leading-relaxed text-muted sm:text-base">
            From delicate earrings to statement necklaces, rings and bracelets, we hope every piece makes you feel
            beautiful.
          </p>
          <ButtonLink href="/about" variant="dark">
            Read Our Story
          </ButtonLink>
        </Reveal>
      </Container>
    </section>
  );
}
