import { Banknote, MessageCircle, RotateCcw, Truck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

interface TrustItem {
  icon: LucideIcon;
  title: string;
  text: string;
}

const items: TrustItem[] = [
  { icon: Banknote, title: "Cash on Delivery", text: "Pay when your order arrives" },
  { icon: RotateCcw, title: "Easy Returns", text: "Simple return process" },
  { icon: Truck, title: "Nationwide Delivery", text: "Shipping across Pakistan" },
  { icon: MessageCircle, title: "WhatsApp Support", text: "Chat with us anytime" },
];

export function TrustStrip() {
  return (
    <section aria-label="Why shop with us" className="border-y border-line bg-ivory-deep/60 py-10 sm:py-12">
      <Container>
        <Reveal>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4">
            {items.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex flex-col items-center gap-2 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 text-gold">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="font-heading text-lg text-charcoal sm:text-xl">{title}</h3>
                <p className="text-xs text-muted sm:text-sm">{text}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
