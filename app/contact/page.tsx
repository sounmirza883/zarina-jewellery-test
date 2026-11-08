import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/contact/ContactForm";
import { createMetadata } from "@/lib/seo";
import { whatsappLink } from "@/lib/whatsapp";
import { siteConfig } from "@/config/site";

export const metadata = createMetadata({
  title: "Contact Us",
  description: "Get in touch with Zarina Jewels by phone, WhatsApp, email or the contact form.",
  path: "/contact",
});

const linkCls = "inline-flex min-h-11 items-center text-charcoal underline-offset-4 hover:text-gold hover:underline";

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.3H7.8v3h2.7V21h3z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      <path d="M16.6 3h-2.8v11.4a2.5 2.5 0 1 1-2.5-2.5c.3 0 .5 0 .8.1V9.1a5.3 5.3 0 1 0 4.5 5.3V8.9a6.6 6.6 0 0 0 3.8 1.2V7.4A3.9 3.9 0 0 1 16.6 3z" />
    </svg>
  );
}

const socials = [
  { label: "Instagram", href: siteConfig.social.instagram, Icon: InstagramIcon },
  { label: "Facebook", href: siteConfig.social.facebook, Icon: FacebookIcon },
  { label: "TikTok", href: siteConfig.social.tiktok, Icon: TikTokIcon },
] as const;

export default function ContactPage() {
  const { contact } = siteConfig;
  const telHref = `tel:${contact.phone.replace(/[^\d+]/g, "")}`;

  return (
    <Container className="py-12 sm:py-16">
      <SectionHeading
        as="h1"
        eyebrow="Get in touch"
        title="Contact Us"
        subtitle="Questions about an order or a piece of jewellery? We would love to help."
      />

      <div className="mx-auto mt-10 grid max-w-5xl gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-14">
        <section aria-labelledby="contact-form-heading">
          <h2 id="contact-form-heading" className="mb-5 text-2xl text-charcoal">
            Send us a message
          </h2>
          <ContactForm />
        </section>

        <section aria-labelledby="contact-details-heading" className="border border-line bg-white p-6 sm:p-8">
          <h2 id="contact-details-heading" className="mb-5 text-2xl text-charcoal">
            Our details
          </h2>
          <dl className="space-y-5 text-base">
            <div>
              <dt className="text-xs font-medium tracking-[0.2em] text-gold uppercase">Phone</dt>
              <dd>
                <a href={telHref} className={linkCls}>
                  {contact.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium tracking-[0.2em] text-gold uppercase">WhatsApp</dt>
              <dd>
                <a
                  href={whatsappLink("Hello, I have a question about your jewellery.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkCls}
                >
                  Chat with us on WhatsApp
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium tracking-[0.2em] text-gold uppercase">Email</dt>
              <dd>
                <a href={`mailto:${contact.email}`} className={linkCls}>
                  {contact.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium tracking-[0.2em] text-gold uppercase">Address</dt>
              <dd className="text-charcoal/90">{contact.address}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium tracking-[0.2em] text-gold uppercase">Hours</dt>
              <dd className="text-charcoal/90">{contact.hours}</dd>
            </div>
          </dl>

          <h3 className="mt-8 mb-2 text-lg text-charcoal">Follow us</h3>
          <ul className="flex gap-3">
            {socials.map(({ label, href, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line text-charcoal transition-colors hover:border-gold hover:text-gold"
                >
                  <Icon />
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </Container>
  );
}
