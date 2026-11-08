"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";
import { Inbox } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { loadOrders } from "@/store/orders";
import { ORDER_STATUSES, type Order, type OrderStatus } from "@/types";
import { AdminPageHeader, StatCard, StatusBadge } from "./AdminUi";

export interface CatalogueStats {
  total: number;
  inStock: number;
  outOfStock: number;
  categories: { slug: string; name: string; count: number }[];
}

const ORDERS_KEY = "zarina-orders-v1";
const SERVER = "__server__";

function subscribe(onChange: () => void): () => void {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

/** Raw string snapshot keeps useSyncExternalStore stable between renders. */
function getRawSnapshot(): string | null {
  try {
    return localStorage.getItem(ORDERS_KEY);
  } catch {
    return null;
  }
}

function useOrders(): { mounted: boolean; orders: Order[] } {
  const raw = useSyncExternalStore(subscribe, getRawSnapshot, () => SERVER);
  // raw is only used as the cache key, loadOrders() does the safe parse.
  const orders = useMemo(() => (raw === SERVER ? [] : loadOrders()), [raw]);
  return { mounted: raw !== SERVER, orders };
}

function statusOf(order: Order): OrderStatus {
  return order.status ?? "Pending";
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

const barColors: Record<OrderStatus, string> = {
  Pending: "bg-amber-400",
  Confirmed: "bg-sky-400",
  Shipped: "bg-indigo-400",
  Delivered: "bg-emerald-500",
  Cancelled: "bg-rose-400",
};

function Bar({ value, max, className }: { value: number; max: number; className: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-ivory-deep" aria-hidden="true">
      <div className={`h-full rounded-full ${className}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export function DashboardView({ catalogue }: { catalogue: CatalogueStats }) {
  const { mounted, orders } = useOrders();

  const stats = useMemo(() => {
    const counts = Object.fromEntries(ORDER_STATUSES.map((s) => [s, 0])) as Record<OrderStatus, number>;
    let revenue = 0;
    for (const o of orders) {
      const s = statusOf(o);
      counts[s] += 1;
      if (s !== "Cancelled") revenue += o.total;
    }
    const counted = orders.length - counts.Cancelled;
    const recent = [...orders]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 5);
    return {
      counts,
      revenue,
      average: counted > 0 ? Math.round(revenue / counted) : 0,
      recent,
    };
  }, [orders]);

  const maxStatus = Math.max(1, ...ORDER_STATUSES.map((s) => stats.counts[s]));
  const maxCategory = Math.max(1, ...catalogue.categories.map((c) => c.count));
  const loading = !mounted;
  const dash = "...";

  return (
    <div>
      <AdminPageHeader title="Dashboard" subtitle="A quick look at your orders and catalogue." />

      <section aria-label="Order summary" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Total orders" value={loading ? dash : String(orders.length)} />
        <StatCard label="Pending orders" value={loading ? dash : String(stats.counts.Pending)} hint="Waiting for confirmation" />
        <StatCard label="Revenue" value={loading ? dash : formatPrice(stats.revenue)} hint="Excludes cancelled orders" />
        <StatCard label="Average order" value={loading ? dash : formatPrice(stats.average)} hint="Excludes cancelled orders" />
      </section>

      {mounted && orders.length === 0 ? (
        <section className="mt-6 flex flex-col items-center rounded-sm border border-line bg-white px-5 py-12 text-center">
          <Inbox className="h-10 w-10 text-gold" strokeWidth={1.2} aria-hidden="true" />
          <h2 className="mt-4 text-2xl">No orders yet</h2>
          <p className="mt-2 max-w-md text-sm text-muted">
            Orders appear here after a customer checks out in this same browser. This store has no backend, so
            orders are saved only on the device that placed them.
          </p>
          <Link
            href="/shop"
            className="mt-5 inline-flex min-h-11 items-center justify-center rounded-sm border border-charcoal px-5 text-sm font-medium text-charcoal transition-colors hover:bg-charcoal hover:text-white"
          >
            Open the shop
          </Link>
        </section>
      ) : (
        <div className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-3">
          <section aria-labelledby="status-heading" className="rounded-sm border border-line bg-white p-4 lg:col-span-1">
            <h2 id="status-heading" className="text-xl">
              Orders by status
            </h2>
            <ul className="mt-4 space-y-4">
              {ORDER_STATUSES.map((s) => (
                <li key={s}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <StatusBadge status={s} />
                    <span className="font-medium">{loading ? dash : stats.counts[s]}</span>
                  </div>
                  <Bar value={loading ? 0 : stats.counts[s]} max={maxStatus} className={barColors[s]} />
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="recent-heading" className="rounded-sm border border-line bg-white p-4 lg:col-span-2">
            <div className="flex items-center justify-between gap-3">
              <h2 id="recent-heading" className="text-xl">
                Recent orders
              </h2>
              <Link
                href="/admin/orders"
                className="inline-flex min-h-11 items-center px-2 text-sm font-medium text-gold underline-offset-4 hover:underline"
              >
                View all
              </Link>
            </div>
            <div className="mt-2 overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead>
                  <tr className="border-b border-line text-xs tracking-wider text-muted uppercase">
                    <th scope="col" className="py-2 pr-3 font-medium">Order</th>
                    <th scope="col" className="py-2 pr-3 font-medium">Customer</th>
                    <th scope="col" className="py-2 pr-3 font-medium">City</th>
                    <th scope="col" className="py-2 pr-3 text-right font-medium">Total</th>
                    <th scope="col" className="py-2 pr-3 font-medium">Status</th>
                    <th scope="col" className="py-2 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-muted">
                        Loading orders
                      </td>
                    </tr>
                  ) : (
                    stats.recent.map((o) => (
                      <tr key={o.orderNumber}>
                        <td className="py-3 pr-3 font-medium whitespace-nowrap">{o.orderNumber}</td>
                        <td className="py-3 pr-3">{o.customer.fullName}</td>
                        <td className="py-3 pr-3">{o.customer.city}</td>
                        <td className="py-3 pr-3 text-right whitespace-nowrap">{formatPrice(o.total)}</td>
                        <td className="py-3 pr-3 whitespace-nowrap">
                          <StatusBadge status={statusOf(o)} />
                        </td>
                        <td className="py-3 whitespace-nowrap text-muted">{formatDate(o.createdAt)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      <section aria-labelledby="catalogue-heading" className="mt-6 rounded-sm border border-line bg-white p-4">
        <div className="flex items-center justify-between gap-3">
          <h2 id="catalogue-heading" className="text-xl">
            Catalogue
          </h2>
          <Link
            href="/admin/products"
            className="inline-flex min-h-11 items-center px-2 text-sm font-medium text-gold underline-offset-4 hover:underline"
          >
            Manage products
          </Link>
        </div>
        <div className="mt-2 grid grid-cols-3 gap-3">
          <StatCard label="Products" value={String(catalogue.total)} />
          <StatCard label="In stock" value={String(catalogue.inStock)} />
          <StatCard label="Out of stock" value={String(catalogue.outOfStock)} />
        </div>
        <ul className="mt-5 space-y-4">
          {catalogue.categories.map((c) => (
            <li key={c.slug}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span>{c.name}</span>
                <span className="font-medium">{c.count}</span>
              </div>
              <Bar value={c.count} max={maxCategory} className="bg-gold" />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
