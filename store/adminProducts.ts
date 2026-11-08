import { products as originalProducts } from "@/data/products";
import type { Product } from "@/types";

export const ADMIN_PRODUCTS_KEY = "zarina-admin-products-v1";

const listeners = new Set<() => void>();

function notify(): void {
  listeners.forEach((listener) => listener());
}

/** Subscribe for useSyncExternalStore. Also reacts to changes from other tabs. */
export function subscribeAdminProducts(onChange: () => void): () => void {
  listeners.add(onChange);
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

/** Raw string snapshot of the draft. Keeps useSyncExternalStore stable between renders. */
export function getAdminProductsRaw(): string | null {
  try {
    return localStorage.getItem(ADMIN_PRODUCTS_KEY);
  } catch {
    return null;
  }
}

function isProductLike(value: unknown): value is Product {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === "string" &&
    typeof v.slug === "string" &&
    typeof v.name === "string" &&
    typeof v.price === "number" &&
    Array.isArray(v.images) &&
    Array.isArray(v.colors)
  );
}

/** Parses a raw draft string. Falls back to the current catalogue when missing or broken. */
export function parseAdminProducts(raw: string | null): Product[] {
  if (!raw) return originalProducts;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.every(isProductLike)) return parsed;
  } catch {
    // Fall through to the original catalogue
  }
  return originalProducts;
}

export function loadAdminProducts(): Product[] {
  return parseAdminProducts(getAdminProductsRaw());
}

/** Returns true when the draft was stored. */
export function saveAdminProducts(list: Product[]): boolean {
  try {
    localStorage.setItem(ADMIN_PRODUCTS_KEY, JSON.stringify(list));
    notify();
    return true;
  } catch {
    return false;
  }
}

export function resetAdminProducts(): void {
  try {
    localStorage.removeItem(ADMIN_PRODUCTS_KEY);
  } catch {
    // Nothing to reset when storage is blocked
  }
  notify();
}

/** True when the draft differs from data/products.ts. */
export function isDraftChanged(list: Product[]): boolean {
  return JSON.stringify(list) !== JSON.stringify(originalProducts);
}

/** Next free id in the "pNN" style. */
export function nextProductId(list: Product[]): string {
  const used = new Set(list.map((p) => p.id));
  let max = 0;
  for (const p of list) {
    const match = /^p(\d+)$/.exec(p.id);
    if (match) max = Math.max(max, Number(match[1]));
  }
  let n = max + 1;
  while (used.has(`p${String(n).padStart(2, "0")}`)) n += 1;
  return `p${String(n).padStart(2, "0")}`;
}

/** Builds the full text of a ready-to-paste data/products.ts file. */
export function buildProductsFile(list: Product[]): string {
  return `import type { Product } from "@/types";\n\nexport const products: Product[] = ${JSON.stringify(list, null, 2)};\n`;
}
