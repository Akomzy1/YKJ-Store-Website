// ─────────────────────────────────────────────────────────────────────────────
// YKJ Store — Server-side Supabase query helpers
// All functions use the admin client (service role) so they bypass RLS and
// are safe to call from Server Components, Route Handlers, and Server Actions.
// NEVER import this file in a Client Component.
// ─────────────────────────────────────────────────────────────────────────────

import { createAdminClient } from "./supabase";
import { Product, Category } from "@/types";

// ─── Type aliases ─────────────────────────────────────────────────────────────
// createAdminClient returns createClient<Database>. Our Database type lacks the
// Relationships arrays required by @supabase/supabase-js, which collapses query
// return types to `never`. We cast all results via `unknown` to avoid this.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRow = any;

// ─── Helper: cast raw Supabase row → Product ──────────────────────────────────

function rowToProduct(row: AnyRow): Product {
  return {
    id:           row.id,
    name:         row.name,
    slug:         row.slug,
    description:  row.description ?? "",
    price:        Number(row.price),
    sale_price:   row.sale_price !== null ? Number(row.sale_price) : null,
    category_id:  row.category_id,
    category:     row.category ?? "",
    origin:       row.origin ?? null,
    brand:        row.brand ?? null,
    images:       row.images ?? [],
    stock_qty:    Number(row.stock_qty),
    weight:       row.weight !== null ? Number(row.weight) : null,
    unit:         row.unit ?? null,
    is_featured:  Boolean(row.is_featured),
    is_deal:      Boolean(row.is_deal),
    deal_ends_at: row.deal_ends_at ?? null,
    is_halal:     Boolean(row.is_halal),
    is_vegan:     Boolean(row.is_vegan),
    created_at:   row.created_at,
  };
}

// ─── Products ─────────────────────────────────────────────────────────────────

/** Fetch all products, newest first. Returns [] on error. */
export async function getProducts(): Promise<Product[]> {
  const supabase = createAdminClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return (data as unknown as AnyRow[]).map(rowToProduct);
}

/** Fetch a single product by slug. Returns null if not found. */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = createAdminClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  return rowToProduct(data as unknown as AnyRow);
}

/** Fetch all products in a given category (by slug). */
export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  const supabase = createAdminClient();
  if (!supabase) return [];

  // First resolve category_id from slug
  const { data: catData } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", categorySlug)
    .single();

  const cat = catData as unknown as { id: string } | null;
  if (!cat) return [];

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category_id", cat.id)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return (data as unknown as AnyRow[]).map(rowToProduct);
}

/** Fetch featured products (is_featured = true). */
export async function getFeaturedProducts(): Promise<Product[]> {
  const supabase = createAdminClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_featured", true)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return (data as unknown as AnyRow[]).map(rowToProduct);
}

/** Fetch deal products (is_deal = true). */
export async function getDealProducts(): Promise<Product[]> {
  const supabase = createAdminClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_deal", true)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return (data as unknown as AnyRow[]).map(rowToProduct);
}

/** Fetch newest N products. */
export async function getNewArrivals(limit = 8): Promise<Product[]> {
  const supabase = createAdminClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return (data as unknown as AnyRow[]).map(rowToProduct);
}

// ─── Categories ───────────────────────────────────────────────────────────────

/** Fetch all categories with product counts. */
export async function getCategories(): Promise<Category[]> {
  const supabase = createAdminClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("categories")
    .select("*, products(count)")
    .order("name", { ascending: true });

  if (error || !data) return [];

  return (data as unknown as AnyRow[]).map((row) => ({
    id:            row.id,
    name:          row.name,
    slug:          row.slug,
    image_url:     row.image_url ?? null,
    parent_id:     row.parent_id ?? null,
    product_count: row.products?.[0]?.count ?? 0,
  }));
}

// ─── Admin stats ──────────────────────────────────────────────────────────────

export interface AdminStats {
  totalProducts: number;
  totalOrders:   number;
  ordersToday:   number;
  revenueToday:  number;
}

/** Aggregate stats for the admin dashboard. */
export async function getAdminStats(): Promise<AdminStats> {
  const supabase = createAdminClient();
  if (!supabase) return { totalProducts: 0, totalOrders: 0, ordersToday: 0, revenueToday: 0 };

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [productsRes, ordersRes, todayOrdersRes] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*",   { count: "exact", head: true }),
    supabase
      .from("orders")
      .select("total")
      .gte("created_at", todayStart.toISOString()),
  ]);

  const todayRows = (todayOrdersRes.data as unknown as AnyRow[]) ?? [];
  const revenueToday = todayRows.reduce(
    (sum: number, o: AnyRow) => sum + Number(o.total),
    0
  );

  return {
    totalProducts: productsRes.count ?? 0,
    totalOrders:   ordersRes.count   ?? 0,
    ordersToday:   todayRows.length,
    revenueToday,
  };
}

// ─── Related products ─────────────────────────────────────────────────────────

/** Fetch up to `limit` products from the same category, excluding one product. */
export async function getRelatedProducts(
  categoryId: string,
  excludeId: string,
  limit = 4
): Promise<Product[]> {
  const supabase = createAdminClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category_id", categoryId)
    .neq("id", excludeId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return (data as unknown as AnyRow[]).map(rowToProduct);
}

// ─── Admin orders ─────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AdminOrder = any; // raw Supabase order row + items

/** Fetch all orders for the admin panel, newest first. */
export async function getAdminOrders(): Promise<AdminOrder[]> {
  const supabase = createAdminClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data as unknown as AdminOrder[];
}
