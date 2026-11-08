"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { ChevronDown, Download, Mail, MessageCircle, Phone, Search, ShoppingBag, Trash2 } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { deleteOrder, loadOrders, updateOrderStatus } from "@/store/orders";
import { useToastStore } from "@/store/toast";
import { ORDER_STATUSES } from "@/types";
import type { Order, OrderStatus } from "@/types";
import { AdminPageHeader, StatusBadge, adminInputClass } from "./AdminUi";

const ORDERS_KEY = "zarina-orders-v1";
const SERVER_SNAPSHOT = "__server__";

/* Tiny external store. The raw localStorage string is the snapshot, so it stays
   stable between renders and changes only when orders really change. */
const listeners = new Set<() => void>();

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

function notify(): void {
  listeners.forEach((fn) => fn());
}

function getSnapshot(): string | null {
  try {
    return localStorage.getItem(ORDERS_KEY);
  } catch {
    return null;
  }
}

function getServerSnapshot(): string {
  return SERVER_SNAPSHOT;
}

/** Returns null until the component has mounted in the browser. */
function useOrders(): Order[] | null {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return useMemo(() => {
    if (raw === SERVER_SNAPSHOT) return null;
    const list = loadOrders();
    return [...list].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [raw]);
}

function statusOf(order: Order): OrderStatus {
  return order.status ?? "Pending";
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Unknown date";
  return d.toLocaleString("en-PK", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" });
}

/** Converts Pakistan numbers such as 03XXXXXXXXX to 923XXXXXXXXX for wa.me. */
function toWaNumber(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("00")) return digits.slice(2);
  if (digits.startsWith("0")) return `92${digits.slice(1)}`;
  return digits;
}

function orderWhatsappUrl(order: Order): string {
  const number = toWaNumber(order.customer.whatsapp || order.customer.phone);
  const message = `Hello ${order.customer.fullName}, this is Zarina Jewels confirming your order ${order.orderNumber}.`;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

function csvCell(value: string | number): string {
  let text = String(value);
  if (/^[=@\t\r]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

function ordersToCsv(orders: Order[]): string {
  const header = [
    "Order number",
    "Date",
    "Status",
    "Name",
    "Phone",
    "WhatsApp",
    "Email",
    "Province",
    "City",
    "Address",
    "Notes",
    "Items",
    "Subtotal",
    "Shipping",
    "Total",
    "Payment",
  ];
  const rows = orders.map((o) => [
    o.orderNumber,
    o.createdAt,
    statusOf(o),
    o.customer.fullName,
    o.customer.phone,
    o.customer.whatsapp ?? "",
    o.customer.email ?? "",
    o.customer.province,
    o.customer.city,
    o.customer.address,
    o.customer.notes ?? "",
    o.items
      .map((i) => `${i.name} (${[i.color, i.size].filter(Boolean).join(" / ")}) x ${i.quantity}`)
      .join(" | "),
    o.subtotal,
    o.shipping,
    o.total,
    o.paymentMethod,
  ]);
  return [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");
}

function downloadCsv(orders: Order[]): void {
  const blob = new Blob([`﻿${ordersToCsv(orders)}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `zarina-orders-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

const actionLinkClass =
  "inline-flex min-h-11 items-center gap-2 rounded-sm border border-line bg-white px-4 text-sm text-charcoal transition-colors hover:border-gold hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold";

function OrderDetails({ order, onDelete }: { order: Order; onDelete: () => void }) {
  const c = order.customer;
  return (
    <div id={`order-details-${order.orderNumber}`} className="border-t border-line bg-ivory/50 p-4 sm:p-5">
      <div className="grid gap-6 lg:grid-cols-2">
        <section aria-label="Items">
          <h3 className="font-body text-xs font-semibold tracking-wider text-muted uppercase">Items</h3>
          <ul className="mt-2 divide-y divide-line">
            {order.items.map((item) => (
              <li key={item.key} className="flex justify-between gap-3 py-2.5 text-sm">
                <div className="min-w-0">
                  <p className="font-medium break-words">{item.name}</p>
                  <p className="text-xs text-muted">
                    {[item.color, item.size ? `Size ${item.size}` : null].filter(Boolean).join(" / ")} x {item.quantity}
                  </p>
                  <p className="text-xs text-muted">{formatPrice(item.price)} each</p>
                </div>
                <p className="shrink-0">{formatPrice(item.price * item.quantity)}</p>
              </li>
            ))}
          </ul>
          <dl className="mt-2 space-y-1.5 border-t border-line pt-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd>{formatPrice(order.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Shipping</dt>
              <dd>{order.shipping === 0 ? "Free" : formatPrice(order.shipping)}</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-2 text-base font-semibold">
              <dt>Total</dt>
              <dd>{formatPrice(order.total)}</dd>
            </div>
          </dl>
        </section>

        <section aria-label="Customer">
          <h3 className="font-body text-xs font-semibold tracking-wider text-muted uppercase">Customer</h3>
          <dl className="mt-2 space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="shrink-0 text-muted">Name</dt>
              <dd className="text-right break-words">{c.fullName}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="shrink-0 text-muted">Phone</dt>
              <dd className="text-right">
                <a href={`tel:${c.phone.replace(/\s/g, "")}`} className="underline underline-offset-2 hover:text-gold">
                  {c.phone}
                </a>
              </dd>
            </div>
            {c.whatsapp && (
              <div className="flex justify-between gap-4">
                <dt className="shrink-0 text-muted">WhatsApp</dt>
                <dd className="text-right">{c.whatsapp}</dd>
              </div>
            )}
            {c.email && (
              <div className="flex justify-between gap-4">
                <dt className="shrink-0 text-muted">Email</dt>
                <dd className="text-right break-all">
                  <a href={`mailto:${c.email}`} className="underline underline-offset-2 hover:text-gold">
                    {c.email}
                  </a>
                </dd>
              </div>
            )}
            <div className="flex justify-between gap-4">
              <dt className="shrink-0 text-muted">Province</dt>
              <dd className="text-right">{c.province}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="shrink-0 text-muted">City</dt>
              <dd className="text-right">{c.city}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="shrink-0 text-muted">Address</dt>
              <dd className="text-right break-words">{c.address}</dd>
            </div>
            {c.notes && (
              <div className="flex justify-between gap-4">
                <dt className="shrink-0 text-muted">Notes</dt>
                <dd className="text-right break-words">{c.notes}</dd>
              </div>
            )}
            <div className="flex justify-between gap-4">
              <dt className="shrink-0 text-muted">Payment</dt>
              <dd className="text-right">{order.paymentMethod}</dd>
            </div>
          </dl>
        </section>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <a href={`tel:${c.phone.replace(/\s/g, "")}`} className={actionLinkClass}>
          <Phone className="h-4 w-4" aria-hidden="true" />
          Call
        </a>
        <a href={orderWhatsappUrl(order)} target="_blank" rel="noopener noreferrer" className={actionLinkClass}>
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          WhatsApp
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
        {c.email && (
          <a href={`mailto:${c.email}`} className={actionLinkClass}>
            <Mail className="h-4 w-4" aria-hidden="true" />
            Email
          </a>
        )}
        <button
          type="button"
          onClick={onDelete}
          className="inline-flex min-h-11 items-center gap-2 rounded-sm border border-rose-200 bg-white px-4 text-sm text-rose-700 transition-colors hover:bg-rose-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 sm:ml-auto"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          Delete order
        </button>
      </div>
    </div>
  );
}

export function OrdersView() {
  const orders = useOrders();
  const pushToast = useToastStore((s) => s.push);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<OrderStatus | "All">("All");
  const [openId, setOpenId] = useState<string | null>(null);

  const counts = useMemo(() => {
    const map: Record<OrderStatus | "All", number> = {
      All: orders?.length ?? 0,
      Pending: 0,
      Confirmed: 0,
      Shipped: 0,
      Delivered: 0,
      Cancelled: 0,
    };
    orders?.forEach((o) => {
      map[statusOf(o)] += 1;
    });
    return map;
  }, [orders]);

  const visible = useMemo(() => {
    if (!orders) return [];
    const q = query.trim().toLowerCase();
    return orders.filter((o) => {
      if (filter !== "All" && statusOf(o) !== filter) return false;
      if (!q) return true;
      const c = o.customer;
      return [o.orderNumber, c.fullName, c.phone, c.whatsapp ?? "", c.city].some((v) => v.toLowerCase().includes(q));
    });
  }, [orders, query, filter]);

  function handleStatusChange(order: Order, status: OrderStatus) {
    updateOrderStatus(order.orderNumber, status);
    notify();
    pushToast(`Order ${order.orderNumber} marked ${status}`);
  }

  function handleDelete(order: Order) {
    if (!window.confirm(`Delete order ${order.orderNumber}? This cannot be undone.`)) return;
    deleteOrder(order.orderNumber);
    notify();
    setOpenId(null);
    pushToast(`Order ${order.orderNumber} deleted`, "info");
  }

  const exportButton = (
    <button
      type="button"
      onClick={() => orders && downloadCsv(visible)}
      disabled={!orders || visible.length === 0}
      className="inline-flex min-h-11 items-center gap-2 rounded-sm border border-charcoal bg-white px-4 text-sm text-charcoal transition-colors hover:bg-charcoal hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-charcoal"
    >
      <Download className="h-4 w-4" aria-hidden="true" />
      Export CSV
    </button>
  );

  return (
    <div>
      <AdminPageHeader
        title="Orders"
        subtitle="Orders placed in this browser. Change a status or open an order to see the full details."
        action={exportButton}
      />

      {orders === null ? (
        <div className="space-y-3" role="status" aria-label="Loading orders">
          <div className="h-11 animate-pulse rounded-sm bg-line/60" />
          <div className="h-20 animate-pulse rounded-sm bg-line/60" />
          <div className="h-20 animate-pulse rounded-sm bg-line/60" />
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center rounded-sm border border-line bg-white px-6 py-16 text-center">
          <ShoppingBag className="h-12 w-12 text-gold" strokeWidth={1.2} aria-hidden="true" />
          <h2 className="mt-5 text-2xl">No orders yet</h2>
          <p className="mt-2 max-w-md text-sm text-muted">
            Orders appear here after a customer checks out in this same browser. This store has no backend, so orders
            are saved only on this device and are not shared with other browsers.
          </p>
        </div>
      ) : (
        <>
          <div className="relative">
            <label htmlFor="order-search" className="sr-only">
              Search orders by order number, name, phone or city
            </label>
            <Search
              className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted"
              aria-hidden="true"
            />
            <input
              id="order-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search order number, name, phone or city"
              className={`${adminInputClass} pl-9`}
            />
          </div>

          <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Filter by status">
            {(["All", ...ORDER_STATUSES] as const).map((s) => {
              const active = filter === s;
              return (
                <button
                  key={s}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(s)}
                  className={`inline-flex min-h-11 items-center gap-1.5 rounded-full border px-4 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${
                    active
                      ? "border-charcoal bg-charcoal text-white"
                      : "border-line bg-white text-charcoal hover:border-gold"
                  }`}
                >
                  {s}
                  <span className={`text-xs ${active ? "text-white/80" : "text-muted"}`}>{counts[s]}</span>
                </button>
              );
            })}
          </div>

          <p className="mt-4 text-sm text-muted" aria-live="polite">
            Showing {visible.length} of {orders.length} {orders.length === 1 ? "order" : "orders"}
          </p>

          {visible.length === 0 ? (
            <p className="mt-4 rounded-sm border border-line bg-white p-8 text-center text-sm text-muted">
              No orders match your search or filter.
            </p>
          ) : (
            <ul className="mt-3 space-y-3">
              {visible.map((order) => {
                const open = openId === order.orderNumber;
                const status = statusOf(order);
                return (
                  <li key={order.orderNumber} className="overflow-hidden rounded-sm border border-line bg-white">
                    <div className="flex flex-col sm:flex-row sm:items-stretch">
                      <button
                        type="button"
                        aria-expanded={open}
                        aria-controls={`order-details-${order.orderNumber}`}
                        onClick={() => setOpenId(open ? null : order.orderNumber)}
                        className="flex min-h-11 min-w-0 flex-1 items-start gap-3 p-4 text-left hover:bg-ivory/60 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-gold"
                      >
                        <ChevronDown
                          className={`mt-1 h-4 w-4 shrink-0 text-muted transition-transform ${open ? "rotate-180" : ""}`}
                          aria-hidden="true"
                        />
                        <span className="grid min-w-0 flex-1 gap-1 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-x-4">
                          <span className="min-w-0">
                            <span className="block text-sm font-semibold tracking-wide break-all">{order.orderNumber}</span>
                            <span className="block text-xs text-muted">{formatDate(order.createdAt)}</span>
                            <span className="mt-1 block text-sm break-words">
                              {order.customer.fullName}
                              <span className="text-muted"> / {order.customer.city}</span>
                            </span>
                          </span>
                          <span className="flex items-center justify-between gap-3 sm:flex-col sm:items-end sm:justify-center">
                            <span className="font-heading text-xl text-charcoal">{formatPrice(order.total)}</span>
                            <StatusBadge status={status} />
                          </span>
                        </span>
                      </button>
                      <div className="border-t border-line p-3 sm:w-48 sm:shrink-0 sm:border-t-0 sm:border-l sm:p-4">
                        <label htmlFor={`status-${order.orderNumber}`} className="sr-only">
                          Status for order {order.orderNumber}
                        </label>
                        <select
                          id={`status-${order.orderNumber}`}
                          value={status}
                          onChange={(e) => handleStatusChange(order, e.target.value as OrderStatus)}
                          className={`${adminInputClass} h-full`}
                        >
                          {ORDER_STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    {open && <OrderDetails order={order} onDelete={() => handleDelete(order)} />}
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
