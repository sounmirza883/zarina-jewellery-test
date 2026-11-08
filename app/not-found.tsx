import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Page not found",
  description: "The page you are looking for could not be found.",
  path: "/404",
  noIndex: true,
});

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center gap-5 py-20 text-center">
      <p className="text-xs font-medium tracking-[0.25em] text-gold uppercase">Error 404</p>
      <h1 className="text-4xl text-charcoal sm:text-5xl">Page not found</h1>
      <span className="gold-line block w-24" aria-hidden="true" />
      <p className="max-w-md text-sm text-muted sm:text-base">
        Sorry, we could not find the page you were looking for. It may have moved, or the link may be
        incorrect. Let us help you find something beautiful instead.
      </p>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/shop">Continue Shopping</ButtonLink>
        <ButtonLink href="/" variant="secondary">
          Back to Home
        </ButtonLink>
      </div>
    </Container>
  );
}
