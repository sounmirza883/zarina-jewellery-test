# Zarina Jewels storefront

A frontend-only e-commerce storefront for an artificial jewellery brand in Pakistan.
It uses mock data and browser localStorage only. There is no backend, database or admin panel.

Stack: Next.js (App Router), TypeScript (strict), Tailwind CSS v4, Zustand, react-hook-form with zod, lucide-react.

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:3000.

Other commands:

```bash
npm run lint
npm run build
npm start
```

Optional: create `.env.local` with `NEXT_PUBLIC_SITE_URL=https://your-domain.pk` so canonical links, the sitemap and structured data use your real domain.

## Folder structure

```
app/                    Routes (home, shop, category, product, cart, checkout, policies, about, contact)
  sitemap.ts            sitemap.xml
  robots.ts             robots.txt
components/
  layout/               Header, footer, announcement bar, mobile menu, WhatsApp button
  home/                 Hero, category tiles, trust strip, brand story
  product/              Product card, grid, gallery, info, shop catalog
  cart/                 Cart drawer and cart page view
  checkout/             Checkout form and order success view
  contact/, policies/   Contact form and policy page layout
  ui/                   Buttons, badges, image with placeholder, reveal, skeletons, toasts
config/site.ts          Brand name, contacts, social links, shipping, announcement
constants/verse.ts      Arabic and Urdu verse text for the hero
data/                   Mock products and categories
lib/                    API layer, formatting, validation schemas, SEO helpers
store/                  Cart, toast and order stores
types/                  Shared TypeScript types
public/images/          products, hero and brand images
```

## Editing the brand and settings

Open `config/site.ts`. Change the brand name, phone, WhatsApp number (digits only with country code), email, social links, flat shipping rate, free shipping threshold and the announcement message there.
Set `freeShippingThreshold` to `null` to turn free shipping off. Set `announcement` to an empty string to hide the bar.

## Editing products

Open `data/products.ts`. Each product has `id`, `slug`, `name`, `category`, `price`, `compareAtPrice`, `images`, `colors`, `sizes`, `description`, `details`, `tags`, `isNew`, `isBestSeller`, `inStock` and `createdAt`.

- Set `compareAtPrice` higher than `price` to show a Sale badge.
- Fill `sizes` only for rings.
- Describe materials as gold-tone, zircon or cubic zirconia. Do not claim real gold, real diamonds, certifications or warranties.

## Images

Put photos in `public/images`. Missing images show a neutral beige placeholder. See `public/images/README.md` for names and sizes:

- Product images 1000 x 1250
- Hero images 1600 x 900
- Category tiles 800 x 800

## The hero verse

The Arabic and Urdu text lives in `constants/verse.ts` and is rendered as live text.
Verify the Arabic against Quran.com before launch (https://quran.com/7/31).

## Replacing the mock data with a real API

Every page reads data through `lib/api.ts` only. To connect WooCommerce or another API:

1. Open `lib/api.ts`.
2. Replace the body of `getProducts`, `getProductBySlug`, `getProductsByCategory`, `searchProducts`, `getRelatedProducts`, `getCategories` and `getCategoryBySlug` with `fetch` calls.
3. Map the API response to the `Product` and `Category` types in `types/index.ts`.
4. Keep the function names and return types the same. The pages do not need changes.
5. Add the image host to `images.remotePatterns` in `next.config.ts`.

Checkout currently saves the order to localStorage only (`store/orders.ts`). To send real orders, post the order to your API inside `components/checkout/CheckoutForm.tsx`.

## Notes

- Payment is cash on delivery only and is fixed in the checkout form.
- Policy pages contain placeholder text. Review them before launch.
- The CEO message on the About page is sample text. Replace it with the real message.
