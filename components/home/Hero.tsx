import { ButtonLink } from "@/components/ui/Button";
import { ProductImage } from "@/components/ui/ProductImage";
import { siteConfig } from "@/config/site";
import { verse } from "@/constants/verse";

interface Corner {
  src: string;
  alt: string;
  position: string;
  size: string;
  priority?: boolean;
}

const corners: Corner[] = [
  {
    src: "/images/hero/corner-tl.jpg",
    alt: "Gold-tone zircon earrings",
    position: "left-0 top-0",
    size: "h-24 w-24 sm:h-40 sm:w-40 lg:h-64 lg:w-64",
    priority: true,
  },
  {
    src: "/images/hero/corner-tr.jpg",
    alt: "Layered gold-tone necklace",
    position: "right-0 top-0",
    size: "h-24 w-24 sm:h-40 sm:w-40 lg:h-64 lg:w-64",
  },
  {
    src: "/images/hero/corner-bl.jpg",
    alt: "Zircon ring on a dark surface",
    position: "bottom-0 left-0 hidden sm:block",
    size: "sm:h-40 sm:w-40 lg:h-64 lg:w-64",
  },
  {
    src: "/images/hero/corner-br.jpg",
    alt: "Gold-tone bracelet",
    position: "bottom-0 right-0 hidden sm:block",
    size: "sm:h-40 sm:w-40 lg:h-64 lg:w-64",
  },
];

export function Hero() {
  return (
    <section
      aria-label={`${siteConfig.name} welcome`}
      className="relative isolate flex min-h-[80svh] items-center justify-center overflow-hidden bg-navy text-ivory"
    >
      {/* Gold glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_55%_at_50%_42%,rgba(217,182,106,0.20),transparent_70%)]"
      />
      {/* Soft geometric pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[url('/images/hero/pattern.svg')] bg-[length:80px_80px] opacity-[0.07] [mask-image:radial-gradient(ellipse_80%_70%_at_50%_50%,black,transparent)]"
      />

      {/* Decorative corner jewellery. Subtle and dark-toned so missing photos stay quiet. */}
      {corners.map((c) => (
        <div
          key={c.src}
          className={`pointer-events-none absolute -z-10 overflow-hidden ${c.position} ${c.size} opacity-50 sm:opacity-60`}
        >
          <ProductImage
            src={c.src}
            alt={c.alt}
            className="h-full w-full"
            sizes="(min-width: 1024px) 256px, (min-width: 640px) 160px, 96px"
            priority={c.priority}
          />
          <div className="absolute inset-0 bg-navy/60" aria-hidden="true" />
          <div
            className="absolute inset-0 bg-gradient-to-br from-transparent via-navy/30 to-navy"
            aria-hidden="true"
            style={{ transform: c.position.includes("right") ? "scaleX(-1)" : undefined }}
          />
        </div>
      ))}

      <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-6 py-16 text-center sm:py-20">
        <h1 className="text-sm font-medium tracking-[0.35em] text-gold-light uppercase sm:text-base">
          {siteConfig.name}
        </h1>

        <figure className="mt-8 flex w-full flex-col items-center sm:mt-10">
          <blockquote className="flex w-full flex-col items-center">
            <p
              dir="rtl"
              lang="ar"
              className="font-arabic text-3xl leading-[1.9] text-gold-light sm:text-4xl lg:text-5xl"
            >
              {verse.arabic}
            </p>

            <span className="my-4 flex w-full max-w-xs items-center gap-3" aria-hidden="true">
              <span className="gold-line block flex-1" />
              <svg viewBox="0 0 12 12" className="h-3 w-3 shrink-0 text-gold" fill="currentColor">
                <path d="M6 0l1.6 4.4L12 6 7.6 7.6 6 12 4.4 7.6 0 6l4.4-1.6z" />
              </svg>
              <span className="gold-line block flex-1" />
            </span>

            <p dir="rtl" lang="ur" className="font-urdu text-lg leading-loose text-ivory/90 sm:text-xl sm:leading-[2.2]">
              {verse.urdu}
            </p>
          </blockquote>

          <figcaption className="mt-4 flex flex-col items-center gap-1 text-xs tracking-wider text-ivory/70 sm:flex-row sm:gap-3">
            <span>{verse.referenceEn}</span>
            <span aria-hidden="true" className="hidden h-1 w-1 rounded-full bg-gold sm:block" />
            <span lang="ar" dir="rtl" className="font-arabic text-sm">
              {verse.referenceAr}
            </span>
          </figcaption>
        </figure>

        <p className="mt-8 max-w-md font-heading text-xl text-ivory sm:text-2xl">{siteConfig.tagline}</p>

        <div className="mt-8 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
          <ButtonLink href="/shop">Shop Now</ButtonLink>
          <ButtonLink
            href="/new-arrivals"
            variant="secondary"
            className="border-gold-light text-gold-light hover:border-gold-light hover:bg-gold-light hover:text-navy"
          >
            Explore New Arrivals
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
