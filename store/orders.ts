"use client";

import type { Order, OrderStatus } from "@/types";

const LAST_KEY = "zarina-last-order-v1";
const ALL_KEY = "zarina-orders-v1";

export function generateOrderNumber(): string {
  const stamp = Date.now().toString(36).toUpperCase().slice(-5);
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `ZJ-${stamp}${rand}`;
}

export function saveOrder(order: Order): void {
  try {
    const all = loadOrders();
    all.push({ ...order, status: order.status ?? "Pending" });
    localStorage.setItem(ALL_KEY, JSON.stringify(all));
    localStorage.setItem(LAST_KEY, JSON.stringify(order));
  } catch {
    // Storage can be blocked. The order success page then shows a fallback.
  }
}

export function loadLastOrder(): Order | null {
  try {
    const raw = localStorage.getItem(LAST_KEY);
    return raw ? (JSON.parse(raw) as Order) : null;
  } catch {
    return null;
  }
}

/** All orders saved in this browser, oldest first. */
export function loadOrders(): Order[] {
  try {
    const raw = localStorage.getItem(ALL_KEY);
    return raw ? (JSON.parse(raw) as Order[]) : [];
  } catch {
    return [];
  }
}

function writeOrders(orders: Order[]): void {
  try {
    localStorage.setItem(ALL_KEY, JSON.stringify(orders));
  } catch {
    // Ignore blocked storage.
  }
}

export function updateOrderStatus(orderNumber: string, status: OrderStatus): Order[] {
  const orders = loadOrders().map((o) => (o.orderNumber === orderNumber ? { ...o, status } : o));
  writeOrders(orders);
  return orders;
}

export function deleteOrder(orderNumber: string): Order[] {
  const orders = loadOrders().filter((o) => o.orderNumber !== orderNumber);
  writeOrders(orders);
  return orders;
}
