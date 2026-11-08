import { PolicyLayout } from "@/components/policies/PolicyLayout";
import { createMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";

export const metadata = createMetadata({
  title: "Returns and Exchanges",
  description: "Our simple return and exchange policy for jewellery orders.",
  path: "/policies/returns",
});

export default function ReturnsPage() {
  return (
    <PolicyLayout title="Returns and Exchanges">
      <p>
        We want you to be happy with your order. If something is not right, you can ask for a return or an exchange
        within 7 days of receiving your parcel.
      </p>

      <h2>What can be returned</h2>
      <ul>
        <li>Items must be unused and unworn.</li>
        <li>Items must be in their original packaging.</li>
        <li>Please keep the order details handy when you contact us.</li>
      </ul>

      <h2>Damaged or wrong items</h2>
      <p>
        If your item arrives damaged or is not what you ordered, please tell us within 48 hours of delivery. Share a
        clear photo and we will arrange a replacement or exchange.
      </p>

      <h2>How to request a return or exchange</h2>
      <ul>
        <li>Call us on {siteConfig.contact.phone} or message us on WhatsApp.</li>
        <li>Tell us your name, order details and the reason.</li>
        <li>We will confirm the next steps and arrange pickup or return shipping.</li>
      </ul>

      <h2>Refunds</h2>
      <p>
        As all orders are cash on delivery, approved refunds are arranged with you directly after the returned item is
        received and checked.
      </p>

      <h2>Items we cannot take back</h2>
      <p>Items that are worn, damaged after delivery or missing their original packaging cannot be returned.</p>
    </PolicyLayout>
  );
}
