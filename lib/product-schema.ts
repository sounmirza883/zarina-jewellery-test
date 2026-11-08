import { z } from "zod";
import type { CategorySlug, Product, ProductColor } from "@/types";

export const CATEGORY_SLUGS = ["earrings", "necklaces", "rings", "bracelets"] as const satisfies readonly CategorySlug[];

const KEBAB = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const HEX = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

/** Splits a textarea into trimmed, non-empty lines. */
export function splitLines(value: string): string[] {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

/** Splits a comma separated field into trimmed, non-empty items. */
export function splitList(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

/** Parses one "Name:#hex" line. Returns null when the line is not valid. */
export function parseColorLine(line: string): ProductColor | null {
  const index = line.lastIndexOf(":");
  if (index <= 0) return null;
  const name = line.slice(0, index).trim();
  const hex = line.slice(index + 1).trim();
  if (!name || !HEX.test(hex)) return null;
  return { name, hex };
}

/** Turns a product name into a kebab-case slug. */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isWholeNumber(value: string): boolean {
  return /^\d+$/.test(value.trim());
}

export const productFormSchema = z
  .object({
    name: z.string().trim().min(3, "Name must be at least 3 characters"),
    slug: z
      .string()
      .trim()
      .refine((v) => v === "" || KEBAB.test(v), "Use lowercase letters, numbers and hyphens only"),
    category: z.enum(CATEGORY_SLUGS, { error: "Please choose a category" }),
    price: z
      .string()
      .trim()
      .refine((v) => isWholeNumber(v) && Number(v) > 0, "Enter a whole number greater than 0"),
    compareAtPrice: z
      .string()
      .trim()
      .refine((v) => v === "" || (isWholeNumber(v) && Number(v) > 0), "Enter a whole number greater than 0"),
    images: z
      .string()
      .refine((v) => splitLines(v).length >= 1, "Add at least one image path")
      .refine((v) => splitLines(v).every((line) => line.startsWith("/")), "Each image path must start with /"),
    colors: z
      .string()
      .refine((v) => splitLines(v).length >= 1, "Add at least one color")
      .refine(
        (v) => splitLines(v).every((line) => parseColorLine(line) !== null),
        "Use one color per line like Gold:#D4AF37",
      ),
    sizes: z.string(),
    description: z.string().trim().min(10, "Description must be at least 10 characters"),
    details: z.string(),
    tags: z.string(),
    isNew: z.boolean(),
    isBestSeller: z.boolean(),
    inStock: z.boolean(),
  })
  .superRefine((values, ctx) => {
    if (
      values.compareAtPrice !== "" &&
      isWholeNumber(values.compareAtPrice) &&
      isWholeNumber(values.price) &&
      Number(values.compareAtPrice) <= Number(values.price)
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["compareAtPrice"],
        message: "Compare at price must be greater than the price",
      });
    }
  });

export type ProductFormValues = z.infer<typeof productFormSchema>;

export const emptyProductForm: ProductFormValues = {
  name: "",
  slug: "",
  category: "earrings",
  price: "",
  compareAtPrice: "",
  images: "",
  colors: "",
  sizes: "",
  description: "",
  details: "",
  tags: "",
  isNew: false,
  isBestSeller: false,
  inStock: true,
};

export function productToFormValues(product: Product): ProductFormValues {
  return {
    name: product.name,
    slug: product.slug,
    category: product.category,
    price: String(product.price),
    compareAtPrice: product.compareAtPrice !== undefined ? String(product.compareAtPrice) : "",
    images: product.images.join("\n"),
    colors: product.colors.map((c) => `${c.name}:${c.hex}`).join("\n"),
    sizes: product.sizes.join(", "),
    description: product.description,
    details: product.details.join("\n"),
    tags: product.tags.join(", "),
    isNew: product.isNew,
    isBestSeller: product.isBestSeller,
    inStock: product.inStock,
  };
}

/** Converts validated form values to a product. The slug falls back to one made from the name. */
export function formValuesToProduct(
  values: ProductFormValues,
  meta: { id: string; createdAt: string },
): Product {
  const compareAt = values.compareAtPrice.trim() === "" ? undefined : Number(values.compareAtPrice);
  const colors = splitLines(values.colors)
    .map(parseColorLine)
    .filter((c): c is ProductColor => c !== null);
  const product: Product = {
    id: meta.id,
    slug: values.slug.trim() || slugify(values.name),
    name: values.name.trim(),
    category: values.category,
    price: Number(values.price),
    images: splitLines(values.images),
    colors,
    sizes: values.category === "rings" ? splitList(values.sizes) : [],
    description: values.description.trim(),
    details: splitLines(values.details),
    tags: splitList(values.tags),
    isNew: values.isNew,
    isBestSeller: values.isBestSeller,
    inStock: values.inStock,
    createdAt: meta.createdAt,
  };
  if (compareAt !== undefined) product.compareAtPrice = compareAt;
  return product;
}
