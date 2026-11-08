"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Copy, Download, Pencil, Plus, RotateCcw, Search, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ProductImage } from "@/components/ui/ProductImage";
import { Skeleton } from "@/components/ui/Skeleton";
import { categories } from "@/data/categories";
import { formatPrice } from "@/lib/format";
import {
  emptyProductForm,
  formValuesToProduct,
  productFormSchema,
  productToFormValues,
  slugify,
  type ProductFormValues,
} from "@/lib/product-schema";
import {
  buildProductsFile,
  getAdminProductsRaw,
  isDraftChanged,
  nextProductId,
  parseAdminProducts,
  resetAdminProducts,
  saveAdminProducts,
  subscribeAdminProducts,
} from "@/store/adminProducts";
import { useToastStore } from "@/store/toast";
import type { CategorySlug, Product } from "@/types";
import { AdminPageHeader, adminInputClass } from "./AdminUi";

const SERVER_SNAPSHOT = "__server__";
const categoryNames: Record<CategorySlug, string> = Object.fromEntries(
  categories.map((c) => [c.slug, c.name]),
) as Record<CategorySlug, string>;

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}

function Field({ id, label, error, hint, children }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      <div className="mt-1">{children}</div>
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1 text-xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1 text-sm text-rose-700">
          {error}
        </p>
      )}
    </div>
  );
}

function describedBy(id: string, error?: string, hint?: string): string | undefined {
  if (error) return `${id}-error`;
  if (hint) return `${id}-hint`;
  return undefined;
}

const textareaClass = `${adminInputClass} py-2 leading-relaxed`;
const checkboxLabelClass = "flex min-h-11 cursor-pointer items-center gap-3 text-sm";
const checkboxClass = "h-5 w-5 accent-gold";

interface EditorProps {
  existing: Product | null;
  products: Product[];
  onSave: (product: Product) => void;
  onClose: () => void;
}

function ProductEditor({ existing, products, onSave, onClose }: EditorProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: existing ? productToFormValues(existing) : emptyProductForm,
  });
  const category = useWatch({ control, name: "category" });
  const isRing = category === "rings";

  // Focus the dialog, restore focus on close, lock page scroll, close on Escape and trap Tab
  useEffect(() => {
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const dialog = dialogRef.current;
    dialog?.querySelector<HTMLElement>("input, select, textarea")?.focus();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !dialog) return;
      const items = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE));
      const first = items[0];
      const last = items[items.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, [onClose]);

  const submit = handleSubmit((values) => {
    const slug = values.slug.trim() || slugify(values.name);
    if (!slug) {
      setError("slug", { message: "Could not make a slug from the name. Enter one manually" });
      return;
    }
    const clash = products.some((p) => p.slug === slug && p.id !== existing?.id);
    if (clash) {
      setError("slug", { message: "Another product already uses this slug" });
      return;
    }
    onSave(
      formValuesToProduct(
        { ...values, slug },
        { id: existing?.id ?? nextProductId(products), createdAt: existing?.createdAt ?? todayIso() },
      ),
    );
  });

  const title = existing ? "Edit product" : "Add product";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-charcoal/60 sm:items-center sm:p-4">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-editor-title"
        className="flex max-h-[94svh] w-full max-w-3xl flex-col rounded-t-md bg-ivory sm:max-h-[90svh] sm:rounded-sm"
      >
        <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3 sm:px-6">
          <h2 id="product-editor-title" className="text-2xl">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close editor"
            className="inline-flex h-11 w-11 items-center justify-center rounded-sm hover:bg-white focus-visible:outline-2 focus-visible:outline-gold"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={submit} noValidate className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-4 py-5 sm:px-6">
            <Field id="pf-name" label="Name" error={errors.name?.message}>
              <input
                id="pf-name"
                type="text"
                placeholder="Noor Zircon Drop Earrings"
                aria-invalid={!!errors.name}
                aria-describedby={describedBy("pf-name", errors.name?.message)}
                className={adminInputClass}
                {...register("name")}
              />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                id="pf-slug"
                label="Slug"
                error={errors.slug?.message}
                hint="Leave empty to make it from the name"
              >
                <input
                  id="pf-slug"
                  type="text"
                  placeholder="noor-zircon-drop-earrings"
                  aria-invalid={!!errors.slug}
                  aria-describedby={describedBy("pf-slug", errors.slug?.message, "hint")}
                  className={adminInputClass}
                  {...register("slug")}
                />
              </Field>
              <Field id="pf-category" label="Category" error={errors.category?.message}>
                <select
                  id="pf-category"
                  aria-invalid={!!errors.category}
                  aria-describedby={describedBy("pf-category", errors.category?.message)}
                  className={adminInputClass}
                  {...register("category")}
                >
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="pf-price" label="Price (PKR)" error={errors.price?.message}>
                <input
                  id="pf-price"
                  type="text"
                  inputMode="numeric"
                  placeholder="1490"
                  aria-invalid={!!errors.price}
                  aria-describedby={describedBy("pf-price", errors.price?.message)}
                  className={adminInputClass}
                  {...register("price")}
                />
              </Field>
              <Field
                id="pf-compare"
                label="Compare at price (PKR, optional)"
                error={errors.compareAtPrice?.message}
                hint="Set only when the product is on sale"
              >
                <input
                  id="pf-compare"
                  type="text"
                  inputMode="numeric"
                  placeholder="1990"
                  aria-invalid={!!errors.compareAtPrice}
                  aria-describedby={describedBy("pf-compare", errors.compareAtPrice?.message, "hint")}
                  className={adminInputClass}
                  {...register("compareAtPrice")}
                />
              </Field>
            </div>

            <Field
              id="pf-images"
              label="Images"
              error={errors.images?.message}
              hint="One path per line. The first image is the main image"
            >
              <textarea
                id="pf-images"
                rows={3}
                placeholder={"/images/products/noor-zircon-drop-earrings-1.jpg\n/images/products/noor-zircon-drop-earrings-2.jpg"}
                aria-invalid={!!errors.images}
                aria-describedby={describedBy("pf-images", errors.images?.message, "hint")}
                className={textareaClass}
                {...register("images")}
              />
            </Field>

            <Field
              id="pf-colors"
              label="Colors"
              error={errors.colors?.message}
              hint="One per line like Name:#hex"
            >
              <textarea
                id="pf-colors"
                rows={3}
                placeholder={"Gold:#D4AF37\nSilver:#C9CCD1"}
                aria-invalid={!!errors.colors}
                aria-describedby={describedBy("pf-colors", errors.colors?.message, "hint")}
                className={textareaClass}
                {...register("colors")}
              />
            </Field>

            <Field
              id="pf-sizes"
              label="Ring sizes"
              error={errors.sizes?.message}
              hint={isRing ? "Comma separated, for example 6, 7, 8, 9" : "Only used for rings"}
            >
              <input
                id="pf-sizes"
                type="text"
                disabled={!isRing}
                placeholder="6, 7, 8, 9"
                aria-describedby={describedBy("pf-sizes", errors.sizes?.message, "hint")}
                className={`${adminInputClass} disabled:cursor-not-allowed disabled:bg-ivory-deep disabled:opacity-60`}
                {...register("sizes")}
              />
            </Field>

            <Field id="pf-description" label="Description" error={errors.description?.message}>
              <textarea
                id="pf-description"
                rows={4}
                placeholder="Graceful drop earrings with sparkling zircon stones."
                aria-invalid={!!errors.description}
                aria-describedby={describedBy("pf-description", errors.description?.message)}
                className={textareaClass}
                {...register("description")}
              />
            </Field>

            <Field id="pf-details" label="Details" error={errors.details?.message} hint="One per line">
              <textarea
                id="pf-details"
                rows={4}
                placeholder={"Gold-tone plating\nZircon stones\nPush back closure"}
                aria-describedby={describedBy("pf-details", errors.details?.message, "hint")}
                className={textareaClass}
                {...register("details")}
              />
            </Field>

            <Field id="pf-tags" label="Tags" error={errors.tags?.message} hint="Comma separated">
              <input
                id="pf-tags"
                type="text"
                placeholder="party, drop, sparkle"
                aria-describedby={describedBy("pf-tags", errors.tags?.message, "hint")}
                className={adminInputClass}
                {...register("tags")}
              />
            </Field>

            <fieldset>
              <legend className="text-sm font-medium">Flags</legend>
              <div className="mt-1 grid gap-x-6 sm:grid-cols-3">
                <label className={checkboxLabelClass}>
                  <input type="checkbox" className={checkboxClass} {...register("isNew")} />
                  New
                </label>
                <label className={checkboxLabelClass}>
                  <input type="checkbox" className={checkboxClass} {...register("isBestSeller")} />
                  Best Seller
                </label>
                <label className={checkboxLabelClass}>
                  <input type="checkbox" className={checkboxClass} {...register("inStock")} />
                  In stock
                </label>
              </div>
            </fieldset>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-line px-4 py-3 sm:flex-row sm:justify-end sm:px-6">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="dark">
              {existing ? "Save changes" : "Add product"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

type EditorState = { mode: "new" } | { mode: "edit"; id: string } | null;

export function ProductsView() {
  const push = useToastStore((s) => s.push);
  const raw = useSyncExternalStore(subscribeAdminProducts, getAdminProductsRaw, () => SERVER_SNAPSHOT);
  const mounted = raw !== SERVER_SNAPSHOT;
  const products = useMemo(() => parseAdminProducts(mounted ? raw : null), [raw, mounted]);
  const changed = useMemo(() => isDraftChanged(products), [products]);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<CategorySlug | "all">("all");
  const [editor, setEditor] = useState<EditorState>(null);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return products.filter((p) => {
      if (categoryFilter !== "all" && p.category !== categoryFilter) return false;
      if (!term) return true;
      return p.name.toLowerCase().includes(term) || p.slug.includes(term) || p.id.toLowerCase() === term;
    });
  }, [products, search, categoryFilter]);

  const editing = editor?.mode === "edit" ? (products.find((p) => p.id === editor.id) ?? null) : null;
  const closeEditor = useCallback(() => setEditor(null), []);

  function persist(next: Product[], message: string) {
    if (saveAdminProducts(next)) {
      push(message);
    } else {
      push("Could not save the draft in this browser", "error");
    }
  }

  function handleSave(product: Product) {
    const exists = products.some((p) => p.id === product.id);
    const next = exists ? products.map((p) => (p.id === product.id ? product : p)) : [...products, product];
    persist(next, exists ? "Product updated" : "Product added");
    setEditor(null);
  }

  function toggleStock(product: Product) {
    persist(
      products.map((p) => (p.id === product.id ? { ...p, inStock: !p.inStock } : p)),
      product.inStock ? "Marked out of stock" : "Marked in stock",
    );
  }

  function handleDelete(product: Product) {
    if (!window.confirm(`Delete "${product.name}" from the draft?`)) return;
    persist(
      products.filter((p) => p.id !== product.id),
      "Product deleted",
    );
  }

  function handleReset() {
    if (!window.confirm("Discard the draft and go back to the current catalogue?")) return;
    resetAdminProducts();
    push("Draft discarded", "info");
  }

  function handleDownload() {
    const blob = new Blob([buildProductsFile(products)], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "products.ts";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    push("products.ts downloaded");
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(buildProductsFile(products));
      push("products.ts copied to the clipboard");
    } catch {
      push("Could not copy. Use the download button instead", "error");
    }
  }

  return (
    <div>
      <AdminPageHeader
        title="Products"
        subtitle={mounted ? `${products.length} products in the catalogue` : undefined}
        action={
          <Button variant="dark" onClick={() => setEditor({ mode: "new" })} disabled={!mounted}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add product
          </Button>
        }
      />

      <div className="mb-5 rounded-sm border border-line bg-white p-4 text-sm">
        <p>
          Changes are saved in this browser as a draft. To publish them, export the file and replace
          data/products.ts, then redeploy.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Button variant="primary" onClick={handleDownload} disabled={!mounted} className="px-4">
            <Download className="h-4 w-4" aria-hidden="true" />
            Export products.ts
          </Button>
          <Button variant="secondary" onClick={handleCopy} disabled={!mounted} className="px-4">
            <Copy className="h-4 w-4" aria-hidden="true" />
            Copy
          </Button>
          <Button variant="ghost" onClick={handleReset} disabled={!mounted} className="px-3">
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Reset to current catalogue
          </Button>
          {mounted && changed && (
            <span
              role="status"
              className="inline-flex min-h-11 items-center gap-2 text-xs font-medium text-amber-800"
            >
              <span className="h-2 w-2 rounded-full bg-amber-500" aria-hidden="true" />
              Draft saved in this browser
            </span>
          )}
        </div>
      </div>

      <div className="mb-5 grid gap-3 sm:grid-cols-[1fr_200px]">
        <div>
          <label htmlFor="product-search" className="sr-only">
            Search products
          </label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted"
              aria-hidden="true"
            />
            <input
              id="product-search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, slug or id"
              className={`${adminInputClass} pl-9`}
            />
          </div>
        </div>
        <div>
          <label htmlFor="product-category" className="sr-only">
            Filter by category
          </label>
          <select
            id="product-category"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as CategorySlug | "all")}
            className={adminInputClass}
          >
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!mounted ? (
        <div className="space-y-3" role="status" aria-label="Loading products">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : visible.length === 0 ? (
        <p className="rounded-sm border border-line bg-white p-8 text-center text-sm text-muted">
          No products match your search.
        </p>
      ) : (
        <ul className="space-y-3">
          {visible.map((product) => (
            <li
              key={product.id}
              className="flex flex-col gap-3 rounded-sm border border-line bg-white p-3 sm:flex-row sm:items-center sm:gap-4"
            >
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <ProductImage
                  src={product.images[0] ?? ""}
                  alt={product.name}
                  className="h-16 w-16 shrink-0 rounded-sm"
                  sizes="64px"
                />
                <div className="min-w-0">
                  <p className="truncate font-medium">{product.name}</p>
                  <p className="text-xs text-muted">
                    {categoryNames[product.category]} / {product.id}
                  </p>
                  <p className="mt-0.5 text-sm">
                    {formatPrice(product.price)}
                    {product.compareAtPrice !== undefined && (
                      <span className="ml-2 text-xs text-muted line-through">
                        {formatPrice(product.compareAtPrice)}
                      </span>
                    )}
                  </p>
                  {(product.isNew || product.isBestSeller) && (
                    <p className="mt-1 flex flex-wrap gap-1.5">
                      {product.isNew && (
                        <span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-800">
                          New
                        </span>
                      )}
                      {product.isBestSeller && (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                          Best Seller
                        </span>
                      )}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  role="switch"
                  aria-checked={product.inStock}
                  aria-label={`${product.name} in stock`}
                  onClick={() => toggleStock(product)}
                  className="inline-flex min-h-11 items-center gap-2 rounded-sm px-2 text-xs focus-visible:outline-2 focus-visible:outline-gold"
                >
                  <span
                    className={`relative h-6 w-11 rounded-full transition-colors ${product.inStock ? "bg-emerald-600" : "bg-line"}`}
                    aria-hidden="true"
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${product.inStock ? "left-[22px]" : "left-0.5"}`}
                    />
                  </span>
                  {product.inStock ? "In stock" : "Out of stock"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditor({ mode: "edit", id: product.id })}
                  className="inline-flex min-h-11 items-center gap-1.5 rounded-sm border border-line px-3 text-sm hover:border-gold hover:text-gold focus-visible:outline-2 focus-visible:outline-gold"
                >
                  <Pencil className="h-4 w-4" aria-hidden="true" />
                  Edit
                  <span className="sr-only"> {product.name}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(product)}
                  className="inline-flex min-h-11 items-center gap-1.5 rounded-sm border border-line px-3 text-sm text-rose-700 hover:border-rose-700 focus-visible:outline-2 focus-visible:outline-gold"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                  Delete
                  <span className="sr-only"> {product.name}</span>
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {editor && (editor.mode === "new" || editing) && (
        <ProductEditor
          key={editor.mode === "edit" ? editor.id : "new"}
          existing={editing}
          products={products}
          onSave={handleSave}
          onClose={closeEditor}
        />
      )}
    </div>
  );
}
