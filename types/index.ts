export type CategorySlug = "earrings" | "necklaces" | "rings" | "bracelets";

export interface Category {
  slug: CategorySlug;
  name: string;
  description: string;
  image: string;
}

export interface ProductColor {
  name: string;
  /** CSS color used for the swatch */
  hex: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: CategorySlug;
  /** Price in PKR */
  price: number;
  /** Original price in PKR. Only set when the product is on sale. */
  compareAtPrice?: number;
  /** Paths under /public. The first image is the main image. */
  images: string[];
  colors: ProductColor[];
  /** Ring sizes. Empty for products that do not need a size. */
  sizes: string[];
  description: string;
  details: string[];
  tags: string[];
  isNew: boolean;
  isBestSeller: boolean;
  inStock: boolean;
  /** ISO date used for the newest sort */
  createdAt: string;
}

export type SortOption = "newest" | "price-asc" | "price-desc";

export interface ProductQuery {
  category?: CategorySlug;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: SortOption;
  isNew?: boolean;
  isBestSeller?: boolean;
}

export interface CartItem {
  /** Unique per product, color and size */
  key: string;
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  color: string;
  size?: string;
  quantity: number;
}

export interface OrderCustomer {
  fullName: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  province: string;
  city: string;
  address: string;
  notes?: string;
}

export type OrderStatus = "Pending" | "Confirmed" | "Shipped" | "Delivered" | "Cancelled";

export const ORDER_STATUSES: OrderStatus[] = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];

export interface Order {
  orderNumber: string;
  createdAt: string;
  customer: OrderCustomer;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: "Cash on Delivery";
  /** Set by the admin panel. Missing means Pending. */
  status?: OrderStatus;
}
