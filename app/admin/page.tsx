import type { Metadata } from "next";
import { DashboardView, type CatalogueStats } from "@/components/admin/DashboardView";
import { getCategories, getProducts } from "@/lib/api";

export const metadata: Metadata = { title: "Dashboard" };

export default async function AdminDashboardPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  const catalogue: CatalogueStats = {
    total: products.length,
    inStock: products.filter((p) => p.inStock).length,
    outOfStock: products.filter((p) => !p.inStock).length,
    categories: categories.map((c) => ({
      slug: c.slug,
      name: c.name,
      count: products.filter((p) => p.category === c.slug).length,
    })),
  };

  return <DashboardView catalogue={catalogue} />;
}
