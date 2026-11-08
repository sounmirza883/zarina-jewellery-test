import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Store Policies",
  description: "Read our returns, delivery, privacy and terms policies.",
  path: "/policies",
});

const policies = [
  { href: "/policies/returns", title: "Returns and Exchanges", text: "How to return or exchange an item." },
  { href: "/policies/delivery", title: "Delivery", text: "Shipping charges and delivery across Pakistan." },
  { href: "/policies/privacy", title: "Privacy", text: "How we handle your details." },
  { href: "/policies/terms", title: "Terms of Service", text: "The terms for ordering from us." },
] as const;

export default function PoliciesPage() {
  return (
    <Container as="main" className="py-12 sm:py-16">
      <SectionHeading as="h1" title="Store Policies" subtitle="Clear and simple information about shopping with us." />
      <ul className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-2">
        {policies.map((p) => (
          <li key={p.href}>
            <Link
              href={p.href}
              className="flex h-full min-h-11 flex-col gap-1 border border-line bg-white p-5 transition-colors hover:border-gold"
            >
              <span className="font-heading text-xl text-charcoal">{p.title}</span>
              <span className="text-sm text-muted">{p.text}</span>
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  );
}
