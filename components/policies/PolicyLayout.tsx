import { Container } from "@/components/ui/Container";

interface PolicyLayoutProps {
  title: string;
  lastUpdated?: string;
  children: React.ReactNode;
}

const prose =
  "text-base leading-relaxed text-charcoal/90 [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:text-charcoal [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_li]:pl-1 [&_a]:text-gold [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-charcoal [&_strong]:font-semibold";

export function PolicyLayout({ title, lastUpdated = "November 2026", children }: PolicyLayoutProps) {
  return (
    <Container as="main" className="py-12 sm:py-16">
      <article className="mx-auto max-w-3xl">
        <h1 className="text-4xl text-charcoal sm:text-5xl">{title}</h1>
        <p className="mt-3 text-sm text-muted">Last updated: {lastUpdated}</p>
        <span className="gold-line mt-6 block w-24" aria-hidden="true" />
        <div className={`mt-8 ${prose}`}>{children}</div>
        <aside className="mt-12 border-t border-line pt-4">
          <p className="text-xs text-muted">
            Note: this is placeholder text and should be reviewed before launch.
          </p>
        </aside>
      </article>
    </Container>
  );
}
