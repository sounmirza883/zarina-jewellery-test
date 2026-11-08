import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { Container } from "@/components/ui/Container";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Checkout",
  description: "Enter your delivery details and place your Cash on Delivery order.",
  path: "/checkout",
  noIndex: true,
});

export default function CheckoutPage() {
  return (
    <Container as="main" className="py-10 sm:py-14">
      <h1 className="mb-8 text-3xl sm:text-4xl">Checkout</h1>
      <CheckoutForm />
    </Container>
  );
}
