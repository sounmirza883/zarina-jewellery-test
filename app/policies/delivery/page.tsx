import { PolicyLayout } from "@/components/policies/PolicyLayout";
import { createMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";

export const metadata = createMetadata({
  title: "Delivery",
  description: "Nationwide delivery across Pakistan with cash on delivery. Shipping charges and timelines.",
  path: "/policies/delivery",
});

export default function DeliveryPage() {
  const { flatRate, freeShippingThreshold } = siteConfig.shipping;
  const { currencyLabel } = siteConfig;

  return (
    <PolicyLayout title="Delivery">
      <p>We deliver nationwide across Pakistan. All orders are paid by cash on delivery only.</p>

      <h2>Shipping charges</h2>
      <ul>
        <li>
          Flat shipping rate: {currencyLabel} {flatRate.toLocaleString("en-PK")} per order.
        </li>
        {freeShippingThreshold !== null && (
          <li>
            Free shipping on orders above {currencyLabel} {freeShippingThreshold.toLocaleString("en-PK")}.
          </li>
        )}
      </ul>

      <h2>Delivery time</h2>
      <p>
        Most orders arrive within 3 to 7 working days, depending on your city. Remote areas may take a little longer.
      </p>

      <h2>Cash on delivery</h2>
      <p>
        Please keep the exact amount ready when the courier arrives. You can check the parcel at the time of delivery
        before paying.
      </p>

      <h2>Order confirmation</h2>
      <p>
        After you place an order, we confirm it by phone or WhatsApp before dispatch. Please make sure your phone number
        and address are correct.
      </p>

      <h2>Need help with a delivery</h2>
      <p>
        Call {siteConfig.contact.phone} or write to <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>.
      </p>
    </PolicyLayout>
  );
}
