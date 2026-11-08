import { PolicyLayout } from "@/components/policies/PolicyLayout";
import { createMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";

export const metadata = createMetadata({
  title: "Privacy Policy",
  description: "How we handle your order and contact details.",
  path: "/policies/privacy",
});

export default function PrivacyPage() {
  return (
    <PolicyLayout title="Privacy Policy">
      <p>Your privacy matters to us. This page explains what information we collect and how we use it.</p>

      <h2>What we collect</h2>
      <ul>
        <li>Your name, phone number and delivery address when you place an order.</li>
        <li>Your email address and message when you contact us.</li>
      </ul>

      <h2>How we use it</h2>
      <p>
        We use your contact details only to confirm your order, arrange delivery and answer your questions. We do not
        sell your details.
      </p>

      <h2>Data on this demo storefront</h2>
      <p>
        On this demo storefront, your cart and order data are stored in your own browser. You can clear it at any time
        by clearing your browser data.
      </p>

      <h2>Sharing</h2>
      <p>We share your name, phone number and address with delivery partners only as needed to deliver your parcel.</p>

      <h2>Contact us</h2>
      <p>
        For any privacy question, write to <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>.
      </p>
    </PolicyLayout>
  );
}
