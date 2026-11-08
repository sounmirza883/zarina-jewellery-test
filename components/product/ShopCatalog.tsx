"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/format";
import type { Category, CategorySlug, Product, SortOption } from "@/types";

interface ShopCatalogProps {
  /** Full product list for the page scope */
  products: Product[];
  /** When set, the category filter is hidden and the list is already scoped */
  category?: CategorySlug;
  /** Used to build the category filter chips */
  categories?: Category[];
}

const sortLabels: Record<SortOption, string> = {
  newest: "Newest",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
};

function isSort(value: string | null): value is SortOption {
  return value === "newest" || value === "price-asc" || value === "price-desc";
}

function parsePrice(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const n = Number(trimmed);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

const fieldCls =
  "min-h-11 w-full rounded-sm border border-line bg-white px-3 text-sm text-charcoal placeholder:text-muted focus-visible:border-gold";

export function ShopCatalog({ products, category, categories = [] }: ShopCatalogProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlQuery = searchParams.get("q") ?? "";
  const urlCategory = searchParams.get("category");
  const urlSort = searchParams.get("sort");

  const sort: SortOption = isSort(urlSort) ? urlSort : "newest";
  const activeCategory: CategorySlug | "" = category
    ? category
    : (categories.find((c) => c.slug === urlCategory)?.slug ?? "");

  // Local copy of the search text so typing stays instant while the URL updates later.
  const [searchText, setSearchText] = useState(urlQuery);
  const [syncedQuery, setSyncedQuery] = useState(urlQuery);
  if (urlQuery !== syncedQuery) {
    setSyncedQuery(urlQuery);
    setSearchText(urlQuery);
  }

  const [minInput, setMinInput] = useState("");
  const [maxInput, setMaxInput] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const bounds = useMemo(() => {
    if (products.length === 0) return { min: 0, max: 0 };
    const prices = products.map((p) => p.price);
    return { min: Math.floor(Math.min(...prices)), max: Math.ceil(Math.max(...prices)) };
  }, [products]);

  function updateParams(patch: Record<string, string | null>) {
    const next = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(patch)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  function onSearchChange(value: string) {
    setSearchText(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSyncedQuery(value.trim());
      updateParams({ q: value.trim() || null });
    }, 300);
  }

  function onCategoryChange(slug: CategorySlug | "") {
    updateParams({ category: slug || null });
  }

  function onSortChange(value: string) {
    updateParams({ sort: isSort(value) && value !== "newest" ? value : null });
  }

  function clearFilters() {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setSearchText("");
    setSyncedQuery("");
    setMinInput("");
    setMaxInput("");
    updateParams({ q: null, category: null, sort: null });
  }

  const minPrice = parsePrice(minInput);
  const maxPrice = parsePrice(maxInput);
  const term = searchText.trim().toLowerCase();

  const visible = useMemo(() => {
    let list = products.filter((p) => {
      if (activeCategory && p.category !== activeCategory) return false;
      if (minPrice !== null && p.price < minPrice) return false;
      if (maxPrice !== null && p.price > maxPrice) return false;
      if (term) {
        const haystack = [p.name, p.category, p.description, ...p.tags];
        if (!haystack.some((field) => field.toLowerCase().includes(term))) return false;
      }
      return true;
    });
    list = [...list];
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    else list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return list;
  }, [products, activeCategory, minPrice, maxPrice, term, sort]);

  const activeCount =
    (term ? 1 : 0) +
    (!category && activeCategory ? 1 : 0) +
    (minPrice !== null || maxPrice !== null ? 1 : 0) +
    (sort !== "newest" ? 1 : 0);

  const showCategories = !category && categories.length > 0;

  return (
    <div>
      <div className="flex items-center gap-3 md:hidden">
        <button
          type="button"
          onClick={() => setPanelOpen((o) => !o)}
          aria-expanded={panelOpen}
          aria-controls="shop-filters"
          className="flex min-h-11 flex-1 items-center justify-between gap-2 rounded-sm border border-gold px-4 text-sm font-medium tracking-wide text-gold uppercase transition-colors hover:bg-gold hover:text-white"
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            Filters{activeCount > 0 ? ` (${activeCount})` : ""}
          </span>
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-200 ${panelOpen ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
        </button>
      </div>

      <div
        id="shop-filters"
        className={`${panelOpen ? "block" : "hidden"} mt-4 space-y-5 border border-line bg-white p-4 md:mt-0 md:block md:border-0 md:bg-transparent md:p-0`}
      >
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:gap-6">
          <div>
            <label htmlFor="shop-search" className="mb-1 block text-xs font-medium tracking-wider text-muted uppercase">
              Search
            </label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                aria-hidden="true"
              />
              <input
                id="shop-search"
                type="search"
                value={searchText}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search rings, studs, pearls"
                autoComplete="off"
                className={`${fieldCls} pl-9`}
              />
            </div>
          </div>

          <div className="md:w-56">
            <label htmlFor="shop-sort" className="mb-1 block text-xs font-medium tracking-wider text-muted uppercase">
              Sort by
            </label>
            <select
              id="shop-sort"
              value={sort}
              onChange={(e) => onSortChange(e.target.value)}
              className={fieldCls}
            >
              {(Object.keys(sortLabels) as SortOption[]).map((key) => (
                <option key={key} value={key}>
                  {sortLabels[key]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 md:gap-6">
          {showCategories && (
            <fieldset>
              <legend className="mb-2 text-xs font-medium tracking-wider text-muted uppercase">Category</legend>
              <div className="flex flex-wrap gap-2">
                {[{ slug: "" as const, name: "All" }, ...categories].map((c) => {
                  const selected = activeCategory === c.slug;
                  return (
                    <button
                      key={c.slug || "all"}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => onCategoryChange(c.slug)}
                      className={`min-h-11 rounded-full border px-4 text-sm transition-colors duration-200 ${
                        selected
                          ? "border-navy bg-navy text-ivory"
                          : "border-line bg-white text-charcoal hover:border-gold hover:text-gold"
                      }`}
                    >
                      {c.name}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          )}

          <fieldset className={showCategories ? "" : "md:col-span-2"}>
            <legend className="mb-2 text-xs font-medium tracking-wider text-muted uppercase">
              Price (PKR){bounds.max > 0 ? `, ${formatPrice(bounds.min)} to ${formatPrice(bounds.max)}` : ""}
            </legend>
            <div className="flex items-center gap-3 md:max-w-sm">
              <div className="flex-1">
                <label htmlFor="shop-min-price" className="sr-only">
                  Minimum price in rupees
                </label>
                <input
                  id="shop-min-price"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  value={minInput}
                  onChange={(e) => setMinInput(e.target.value)}
                  placeholder={`Min ${bounds.min}`}
                  className={fieldCls}
                />
              </div>
              <span className="text-muted" aria-hidden="true">
                to
              </span>
              <div className="flex-1">
                <label htmlFor="shop-max-price" className="sr-only">
                  Maximum price in rupees
                </label>
                <input
                  id="shop-max-price"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  value={maxInput}
                  onChange={(e) => setMaxInput(e.target.value)}
                  placeholder={`Max ${bounds.max}`}
                  className={fieldCls}
                />
              </div>
            </div>
          </fieldset>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 border-b border-line pb-3">
        <p className="text-sm text-muted" role="status" aria-live="polite">
          {visible.length} {visible.length === 1 ? "product" : "products"}
        </p>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex min-h-11 items-center gap-1 px-2 text-sm text-gold underline-offset-4 hover:underline"
          >
            <X className="h-4 w-4" aria-hidden="true" />
            Clear filters
          </button>
        )}
      </div>

      <div className="mt-6">
        {visible.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-heading text-2xl">No pieces match your search</p>
            <p className="mt-2 text-sm text-muted">Try a different word or widen the price range.</p>
            <Button variant="secondary" className="mt-6" onClick={clearFilters}>
              Clear filters
            </Button>
          </div>
        ) : (
          <ProductGrid products={visible} priorityCount={4} />
        )}
      </div>
    </div>
  );
}
