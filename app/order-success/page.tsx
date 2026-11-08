import { OrderSuccess } from "@/components/checkout/OrderSuccess";
import { Container } from "@/components/ui/Container";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Order Confirmed",
  description: "Thank you for your order.",
  path: "/order-success",
  noIndex: true,
});

export default function OrderSuccessPage() {
  return (
    <Container as="main" className="py-10 sm:py-14">
      <OrderSuccess />
    </Container>
  );
}
