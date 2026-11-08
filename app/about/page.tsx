import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductImage } from "@/components/ui/ProductImage";
import { Reveal } from "@/components/ui/Reveal";
import { createMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";

export const metadata = createMetadata({
  title: "About Us",
  description:
    "The story of Zarina Jewels. Elegant, stylish and affordable artificial jewellery made for women and girls in Pakistan.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <Container className="py-12 sm:py-16">
        <SectionHeading
          as="h1"
          eyebrow="Our story"
          title={`About ${siteConfig.name}`}
          subtitle="Jewellery that makes every day feel a little more special."
        />
        <Reveal className="mx-auto mt-10 max-w-2xl space-y-4 text-center text-base leading-relaxed text-charcoal/90">
          <p>
            {siteConfig.name} began with a simple idea. Every woman and girl in Pakistan should be able to wear
            something beautiful without worrying about the price.
          </p>
          <p>
            Our earrings, necklaces, rings and bracelets are artificial jewellery in warm gold-tone finishes, often set
            with sparkling zircon or cubic zirconia. We choose each piece for its elegance, its everyday comfort and its
            fair price.
          </p>
          <p>
            From a quiet gift for a friend to the finishing touch for a wedding outfit, we are here to help you shine.
          </p>
        </Reveal>
      </Container>

      <section className="bg-ivory-deep py-12 sm:py-16" aria-labelledby="vision-mission">
        <Container>
          <h2 id="vision-mission" className="sr-only">
            Our vision and mission
          </h2>
          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
            <Reveal className="border border-line bg-white p-6 sm:p-8">
              <h3 className="text-2xl text-charcoal">Our vision</h3>
              <span className="gold-line my-4 block w-16" aria-hidden="true" />
              <p className="text-base leading-relaxed text-muted">
                To be the most loved name for elegant and affordable jewellery among women and girls across Pakistan.
              </p>
            </Reveal>
            <Reveal delayMs={100} className="border border-line bg-white p-6 sm:p-8">
              <h3 className="text-2xl text-charcoal">Our mission</h3>
              <span className="gold-line my-4 block w-16" aria-hidden="true" />
              <p className="text-base leading-relaxed text-muted">
                To offer stylish, good quality pieces at reasonable prices, with friendly service and cash on delivery
                to your doorstep.
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      <Container as="section" className="py-12 sm:py-16">
        <h2 className="sr-only">A message from our founder</h2>
        {/* NOTE: The CEO message below is sample text and should be replaced with the real message before launch. */}
        <div className="mx-auto grid max-w-4xl items-center gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] md:gap-12">
          <ProductImage
            src="/images/brand/ceo.jpg"
            alt={`Portrait of ${siteConfig.ceo.name}, ${siteConfig.ceo.title}`}
            className="mx-auto aspect-[4/5] w-full max-w-xs"
            sizes="(min-width: 768px) 320px, 80vw"
          />
          <Reveal>
            <p className="text-xs font-medium tracking-[0.25em] text-gold uppercase">A message from our founder</p>
            <blockquote className="mt-4 space-y-4 text-base leading-relaxed text-charcoal/90">
              <p>
                When I started {siteConfig.name}, I wanted to make jewellery that feels special but stays within reach.
                Every design we pick is one I would be happy to gift to my own family.
              </p>
              <p>
                Thank you for welcoming us into your celebrations, big and small. We will keep working to bring you
                graceful pieces, honest prices and warm service.
              </p>
            </blockquote>
            <p className="mt-6 font-heading text-xl text-charcoal">{siteConfig.ceo.name}</p>
            <p className="text-sm text-muted">{siteConfig.ceo.title}</p>
          </Reveal>
        </div>
      </Container>
    </>
  );
}
