"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { siteConfig } from "@/config/site";
import type { CartItem } from "@/types";

interface AddPayload extends Omit<CartItem, "key" | "quantity"> {
  quantity?: number;
}

interface CartState {
  items: CartItem[];
  isDrawerOpen: boolean;
  addItem: (payload: AddPayload, openDrawer?: boolean) => void;
  removeItem: (key: string) => void;
  setQuantity: (key: string, quantity: number) => void;
  clear: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
}

export const MAX_QTY = 10;

export function makeCartKey(productId: string, color: string, size?: string): string {
  return [productId, color, size ?? ""].join("|");
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isDrawerOpen: false,
      addItem: (payload, openDrawer = true) =>
        set((state) => {
          const key = makeCartKey(payload.productId, payload.color, payload.size);
          const qty = payload.quantity ?? 1;
          const existing = state.items.find((i) => i.key === key);
          const items = existing
            ? state.items.map((i) =>
                i.key === key ? { ...i, quantity: Math.min(MAX_QTY, i.quantity + qty) } : i,
              )
            : [...state.items, { ...payload, key, quantity: Math.min(MAX_QTY, qty) }];
          return { items, isDrawerOpen: openDrawer ? true : state.isDrawerOpen };
        }),
      removeItem: (key) => set((state) => ({ items: state.items.filter((i) => i.key !== key) })),
      setQuantity: (key, quantity) =>
        set((state) => ({
          items:
            quantity < 1
              ? state.items.filter((i) => i.key !== key)
              : state.items.map((i) =>
                  i.key === key ? { ...i, quantity: Math.min(MAX_QTY, quantity) } : i,
                ),
        })),
      clear: () => set({ items: [] }),
      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
    }),
    {
      name: "zarina-cart-v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

export interface CartTotals {
  count: number;
  subtotal: number;
  shipping: number;
  total: number;
  amountToFreeShipping: number | null;
}

export function computeTotals(items: CartItem[]): CartTotals {
  const count = items.reduce((n, i) => n + i.quantity, 0);
  const subtotal = items.reduce((n, i) => n + i.price * i.quantity, 0);
  const threshold = siteConfig.shipping.freeShippingThreshold;
  const freeShipping = threshold !== null && subtotal >= threshold;
  const shipping = items.length === 0 || freeShipping ? 0 : siteConfig.shipping.flatRate;
  const amountToFreeShipping =
    threshold !== null && items.length > 0 && !freeShipping ? threshold - subtotal : null;
  return { count, subtotal, shipping, total: subtotal + shipping, amountToFreeShipping };
}
