import { siteConfig } from "@/config/site";

const formatter = new Intl.NumberFormat("en-PK", { maximumFractionDigits: 0 });

/** Formats a number as PKR, for example "Rs. 1,490". */
export function formatPrice(amount: number): string {
  return `${siteConfig.currencyLabel} ${formatter.format(amount)}`;
}

export function discountPercent(price: number, compareAt?: number): number {
  if (!compareAt || compareAt <= price) return 0;
  return Math.round(((compareAt - price) / compareAt) * 100);
}
