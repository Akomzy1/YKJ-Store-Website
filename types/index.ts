// ─────────────────────────────────────────────────────────────────────────────
// YKJ African & Caribbean Food Store — TypeScript Types
// Mirrors the Supabase schema in CLAUDE.md
// ─────────────────────────────────────────────────────────────────────────────

// ─── Product ─────────────────────────────────────────────────────────────────

export type WeightUnit = "g" | "kg" | "ml" | "L" | "each" | "pack";

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;           // GBP — stored as decimal e.g. 3.99
  sale_price: number | null;
  category_id: string;
  category: string;        // denormalised category name for display
  origin: string | null;   // e.g. "nigerian", "jamaican", "ghanaian"
  brand: string | null;
  images: string[];        // ordered array of URLs (Supabase Storage / Cloudinary)
  stock_qty: number;
  weight: number | null;   // numeric value e.g. 500
  unit: WeightUnit | null; // "g" | "kg" | "ml" | "L" | "each" | "pack"
  is_featured: boolean;
  is_deal: boolean;
  deal_ends_at: string | null; // ISO datetime — when deal expires
  is_halal: boolean;
  is_vegan: boolean;
  created_at: string;      // ISO datetime
}

// Convenience: product with computed display fields
export interface ProductWithMeta extends Product {
  discountPercent: number | null;
  isOnSale: boolean;
  isInStock: boolean;
  displayWeight: string | null; // e.g. "500g", "1kg"
  effectivePrice: number;       // sale_price if active, else price
}

// ─── Category ─────────────────────────────────────────────────────────────────

export interface Category {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  parent_id: string | null;
  product_count: number;
}

// ─── Origin / Nationality ─────────────────────────────────────────────────────

export interface Origin {
  id: string;
  name: string;          // e.g. "Nigerian"
  slug: string;          // e.g. "nigerian"
  flag_emoji: string;    // e.g. "🇳🇬"
  country_code: string;  // ISO 3166-1 alpha-2 e.g. "NG"
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;      // sum of (effectivePrice × qty) for all items
  delivery_cost: number; // 0 if free delivery threshold met, else 4.99
  total: number;         // subtotal + delivery_cost - discount
  promo_code: string | null;
  discount: number;      // absolute GBP discount amount e.g. 5.00
}

// ─── Order ───────────────────────────────────────────────────────────────────

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type DeliveryMethod = "standard" | "express" | "click_and_collect";

export interface Order {
  id: string;
  user_id: string;
  status: OrderStatus;
  delivery_method: DeliveryMethod;
  subtotal: number;
  delivery_cost: number;
  discount: number;
  total: number;
  delivery_address: Address;
  payment_intent_id: string;
  promo_code: string | null;
  notes: string | null;
  created_at: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;   // snapshot at time of purchase
  product_image: string;  // snapshot at time of purchase
  quantity: number;
  unit_price: number;     // price paid per unit
  subtotal: number;       // unit_price × quantity
}

// ─── Address ─────────────────────────────────────────────────────────────────

export interface Address {
  full_name: string;
  line1: string;
  line2: string | null;
  city: string;
  county: string | null;
  postcode: string;
  country: string;       // default "GB"
  phone: string | null;
}

// ─── User / Profile ───────────────────────────────────────────────────────────

export interface UserProfile {
  id: string;                    // matches Supabase auth.users.id (UUID)
  full_name: string;
  email: string;
  phone: string | null;
  default_address: Address | null;
  marketing_opt_in: boolean;
  is_admin: boolean;
  created_at: string;
}

// ─── Review ──────────────────────────────────────────────────────────────────

export type StarRating = 1 | 2 | 3 | 4 | 5;

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  user_name: string;       // display name snapshot
  rating: StarRating;
  comment: string;
  is_verified_purchase: boolean;
  created_at: string;
}

// ─── Promo Code ───────────────────────────────────────────────────────────────

export type PromoType = "percentage" | "fixed";

export interface PromoCode {
  id: string;
  code: string;
  type: PromoType;
  value: number;           // e.g. 10 = 10% off OR £10 off
  min_order_value: number; // minimum subtotal to activate
  max_uses: number | null;
  uses: number;
  expires_at: string | null;
  is_active: boolean;
}

// ─── Supabase Database Schema ─────────────────────────────────────────────────
// Used for typing the Supabase client: createClient<Database>()

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string;
          price: number;
          sale_price: number | null;
          category_id: string;
          category: string;           // denormalized category name
          origin: string | null;
          brand: string | null;
          images: string[];
          stock_qty: number;
          weight: number | null;
          unit: WeightUnit | null;
          is_featured: boolean;
          is_deal: boolean;
          deal_ends_at: string | null;
          is_halal: boolean;
          is_vegan: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["products"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["products"]["Insert"]>;
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          image_url: string | null;
          parent_id: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["categories"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["categories"]["Insert"]>;
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          status: OrderStatus;
          delivery_method: DeliveryMethod;
          subtotal: number;
          delivery_cost: number;
          discount: number;
          total: number;
          delivery_address: Address;
          payment_intent_id: string;
          promo_code: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["orders"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["orders"]["Insert"]>;
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          product_name: string;
          product_image: string;
          quantity: number;
          unit_price: number;
          subtotal: number;
        };
        Insert: Omit<Database["public"]["Tables"]["order_items"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["order_items"]["Insert"]>;
      };
      profiles: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          phone: string | null;
          default_address: Address | null;
          marketing_opt_in: boolean;
          is_admin: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["profiles"]["Row"], "created_at">;
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      reviews: {
        Row: {
          id: string;
          product_id: string;
          user_id: string;
          user_name: string;
          rating: StarRating;
          comment: string;
          is_verified_purchase: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["reviews"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["reviews"]["Insert"]>;
      };
      wishlist_items: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["wishlist_items"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["wishlist_items"]["Insert"]>;
      };
      promo_codes: {
        Row: {
          id: string;
          code: string;
          type: PromoType;
          value: number;
          min_order_value: number;
          max_uses: number | null;
          uses: number;
          expires_at: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["promo_codes"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["promo_codes"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
