import { CartView } from "@/components/cart/CartView";
import { Container } from "@/components/ui/Container";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Your Cart",
  description: "Review the items in your cart before checkout.",
  path: "/cart",
  noIndex: true,
});

export default function CartPage() {
  return (
    <Container className="py-10 sm:py-14">
      <h1 className="mb-8 text-3xl sm:text-4xl">Your Cart</h1>
      <CartView />
    </Container>
  );
}
