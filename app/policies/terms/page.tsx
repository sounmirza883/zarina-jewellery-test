import Link from "next/link";
import { PolicyLayout } from "@/components/policies/PolicyLayout";
import { createMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";

export const metadata = createMetadata({
  title: "Terms of Service",
  description: "The terms for ordering from our jewellery store.",
  path: "/policies/terms",
});

export default function TermsPage() {
  return (
    <PolicyLayout title="Terms of Service">
      <p>By placing an order with {siteConfig.name}, you agree to the terms below.</p>

      <h2>Orders</h2>
      <p>
        Orders are confirmed by phone or WhatsApp. We may cancel an order if we cannot reach you or if an item is out of
        stock.
      </p>

      <h2>Prices and payment</h2>
      <ul>
        <li>All prices are shown in Pakistani Rupees (PKR).</li>
        <li>Payment is by cash on delivery only.</li>
        <li>Shipping charges are shown at checkout.</li>
      </ul>

      <h2>Products</h2>
      <p>
        Our jewellery is artificial jewellery. Colours may look slightly different on your screen compared to the real
        item.
      </p>

      <h2>Returns and delivery</h2>
      <p>
        Please read our <Link href="/policies/returns">returns policy</Link> and our <Link href="/policies/delivery">delivery policy</Link>.
      </p>

      <h2>Changes to these terms</h2>
      <p>We may update these terms from time to time. The latest version will always be on this page.</p>
    </PolicyLayout>
  );
}
