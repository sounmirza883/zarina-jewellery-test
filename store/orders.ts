"use client";

import type { Order } from "@/types";

const KEY = "zarina-last-order-v1";

export function generateOrderNumber(): string {
  const stamp = Date.now().toString(36).toUpperCase().slice(-5);
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `ZJ-${stamp}${rand}`;
}

export function saveOrder(order: Order): void {
  try {
    const raw = localStorage.getItem("zarina-orders-v1");
    const all: Order[] = raw ? (JSON.parse(raw) as Order[]) : [];
    all.push(order);
    localStorage.setItem("zarina-orders-v1", JSON.stringify(all));
    localStorage.setItem(KEY, JSON.stringify(order));
  } catch {
    // Storage can be blocked. The order success page then shows a fallback.
  }
}

export function loadLastOrder(): Order | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Order) : null;
  } catch {
    return null;
  }
}
