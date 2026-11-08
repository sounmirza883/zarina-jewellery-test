/**
 * Data access layer. Every page and component reads products through these
 * functions only. To connect WooCommerce or another API later, replace the
 * bodies below and keep the signatures the same. See README for details.
 */
import { categories } from "@/data/categories";
import { products } from "@/data/products";
import type { Category, CategorySlug, Product, ProductQuery } from "@/types";

function applyQuery(list: Product[], query: ProductQuery): Product[] {
  let result = [...list];

  if (query.category) result = result.filter((p) => p.category === query.category);
  if (query.isNew) result = result.filter((p) => p.isNew);
  if (query.isBestSeller) result = result.filter((p) => p.isBestSeller);
  if (typeof query.minPrice === "number") {
    const min = query.minPrice;
    result = result.filter((p) => p.price >= min);
  }
  if (typeof query.maxPrice === "number") {
    const max = query.maxPrice;
    result = result.filter((p) => p.price <= max);
  }
  if (query.search) {
    const term = query.search.trim().toLowerCase();
    if (term) {
      result = result.filter((p) =>
        [p.name, p.category, p.description, ...p.tags].some((field) =>
          field.toLowerCase().includes(term),
        ),
      );
    }
  }

  switch (query.sort) {
    case "price-asc":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      result.sort((a, b) => b.price - a.price);
      break;
    case "newest":
    default:
      result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  return result;
}

export async function getProducts(query: ProductQuery = {}): Promise<Product[]> {
  return applyQuery(products, query);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return products.find((p) => p.slug === slug);
}

export async function getProductsByCategory(
  category: CategorySlug,
  query: Omit<ProductQuery, "category"> = {},
): Promise<Product[]> {
  return applyQuery(products, { ...query, category });
}

export async function searchProducts(term: string, query: Omit<ProductQuery, "search"> = {}): Promise<Product[]> {
  return applyQuery(products, { ...query, search: term });
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  return products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, limit);
}

export async function getCategories(): Promise<Category[]> {
  return categories;
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  return categories.find((c) => c.slug === slug);
}
