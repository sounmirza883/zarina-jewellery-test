import Link from "next/link";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { siteConfig } from "@/config/site";
import { categories } from "@/data/categories";
import { whatsappLink } from "@/lib/whatsapp";

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.8v3h2.6V21h3.1z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      <path d="M16.6 3h-3.1v12.4a2.6 2.6 0 1 1-2.6-2.6c.3 0 .5 0 .8.1V9.7a5.8 5.8 0 1 0 4.9 5.7V9a6.9 6.9 0 0 0 4 1.3V7.2A4 4 0 0 1 16.6 3z" />
    </svg>
  );
}

const socials = [
  { label: "Instagram", href: siteConfig.social.instagram, Icon: InstagramIcon },
  { label: "Facebook", href: siteConfig.social.facebook, Icon: FacebookIcon },
  { label: "TikTok", href: siteConfig.social.tiktok, Icon: TikTokIcon },
];

const helpLinks = [
  { label: "Returns and Exchanges", href: "/policies/returns" },
  { label: "Delivery Information", href: "/policies/delivery" },
  { label: "Privacy Policy", href: "/policies/privacy" },
  { label: "Terms and Conditions", href: "/policies/terms" },
  { label: "Contact Us", href: "/contact" },
  { label: "About Us", href: "/about" },
];

const linkCls = "inline-flex min-h-11 items-center text-sm text-ivory/75 transition-colors duration-200 hover:text-gold-light md:min-h-9";
const headingCls = "mb-3 text-sm font-semibold tracking-[0.2em] text-gold-light uppercase";

export function Footer() {
  const year = new Date().getFullYear();
  const tel = siteConfig.contact.phone.replace(/\s/g, "");

  return (
    <footer className="bg-[#0B0D12] text-ivory">
      <div className="gold-line" aria-hidden="true" />
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-heading text-3xl font-semibold tracking-[0.12em] text-ivory uppercase">
              {siteConfig.name}
            </p>
            <span className="gold-line mt-3 block w-20" aria-hidden="true" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ivory/75">
              Elegant, stylish and affordable artificial jewellery for women and girls. Designed to
              make everyday moments and special occasions feel a little more beautiful.
            </p>
            <ul className="mt-5 flex items-center gap-1">
              {socials.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${siteConfig.name} on ${label}`}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 text-gold-light transition-colors duration-200 hover:bg-gold hover:text-white"
                  >
                    <Icon />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Shop links">
            <h2 className={headingCls}>Shop</h2>
            <ul>
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link href={`/category/${c.slug}`} className={linkCls}>
                    {c.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/new-arrivals" className={linkCls}>
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/best-sellers" className={linkCls}>
                  Best Sellers
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Help links">
            <h2 className={headingCls}>Help</h2>
            <ul>
              {helpLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkCls}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className={headingCls}>Contact</h2>
            <ul className="space-y-1">
              <li>
                <a href={`tel:${tel}`} className={linkCls}>
                  <Phone className="mr-2 h-4 w-4 text-gold-light" aria-hidden="true" />
                  {siteConfig.contact.phone}
                </a>
              </li>
              <li>
                <a
                  href={whatsappLink("Hello Zarina Jewels, I have a question.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkCls}
                >
                  <MessageCircle className="mr-2 h-4 w-4 text-gold-light" aria-hidden="true" />
                  WhatsApp us
                </a>
              </li>
              <li>
                <a href={`mailto:${siteConfig.contact.email}`} className={`${linkCls} break-all`}>
                  <Mail className="mr-2 h-4 w-4 shrink-0 text-gold-light" aria-hidden="true" />
                  {siteConfig.contact.email}
                </a>
              </li>
            </ul>
            <p className="mt-3 text-sm text-ivory/60">{siteConfig.contact.hours}</p>
            <p className="mt-4 inline-block rounded-sm border border-gold/40 px-3 py-2 text-xs tracking-wider text-gold-light uppercase">
              Cash on Delivery only
            </p>
          </div>
        </div>
      </div>
      <div className="gold-line" aria-hidden="true" />
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-1 px-4 py-5 text-xs text-ivory/60 sm:flex-row sm:px-6 lg:px-8">
        <p>
          &copy; {year} {siteConfig.name}. All rights reserved.
        </p>
        <p>Artificial jewellery made for everyday elegance.</p>
      </div>
    </footer>
  );
}
