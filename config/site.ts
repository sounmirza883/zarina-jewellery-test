/**
 * Single source of truth for brand and store settings.
 * Change the brand name, contact details, shipping and announcement here.
 */
export const siteConfig = {
  name: "Zarina Jewels",
  shortName: "Zarina",
  tagline: "Elegant, stylish and affordable jewellery",
  description:
    "Zarina Jewels offers elegant artificial jewellery for women and girls in Pakistan. Beautiful earrings, necklaces, rings and bracelets at reasonable prices. Cash on delivery nationwide.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.zarinajewels.pk",
  locale: "en_PK",
  currency: "PKR",
  currencyLabel: "Rs.",

  contact: {
    phone: "+92 300 0000000",
    /** Digits only with country code, used for wa.me links */
    whatsapp: "923000000000",
    email: "hello@zarinajewels.pk",
    address: "Lahore, Pakistan",
    hours: "Mon to Sat, 10:00 am to 8:00 pm",
  },

  social: {
    instagram: "https://www.instagram.com/zarinajewels",
    facebook: "https://www.facebook.com/zarinajewels",
    tiktok: "https://www.tiktok.com/@zarinajewels",
  },

  shipping: {
    /** Flat shipping rate in PKR */
    flatRate: 250,
    /** Set to a number to enable free shipping above that subtotal. Set to null to turn it off. */
    freeShippingThreshold: 5000 as number | null,
  },

  /** Text shown in the announcement bar. Set to an empty string to hide the bar. */
  announcement: "Cash on Delivery available across Pakistan",

  /**
   * Admin panel login. This is a demo gate only, because the site has no backend.
   * Anyone can read this value in the browser bundle. Do not reuse a real password.
   */
  admin: {
    password: process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? "zarina-admin",
  },

  ceo: {
    name: "Zarina Khan",
    title: "Founder and CEO",
  },
} as const;

export type SiteConfig = typeof siteConfig;
