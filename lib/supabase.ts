// ─────────────────────────────────────────────────────────────────────────────
// Supabase client — YKJ Store
// ─────────────────────────────────────────────────────────────────────────────
// Client-side:  use `supabase` (browser, anon key, respects RLS)
// Server-side:  use `createAdminClient()` (service role — never ship to browser)
// ─────────────────────────────────────────────────────────────────────────────

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local"
  );
}

// ─── Browser / client-side client ────────────────────────────────────────────
// Singleton — safe to import in Client Components and lib functions.
// Respects Supabase Row Level Security policies.

export const supabase: SupabaseClient<Database> = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

// ─── Server-side admin client ─────────────────────────────────────────────────
// Uses the service role key — bypasses RLS.
// ONLY call this in Server Components, Route Handlers, or Server Actions.
// NEVER import or expose this to the browser.

export function createAdminClient(): SupabaseClient<Database> {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY. This client must only be used server-side."
    );
  }
  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

// ─── Typed table helpers ──────────────────────────────────────────────────────
// Convenience re-exports for common table queries.

export type ProductRow = Database["public"]["Tables"]["products"]["Row"];
export type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];
export type OrderRow = Database["public"]["Tables"]["orders"]["Row"];
export type OrderItemRow = Database["public"]["Tables"]["order_items"]["Row"];
export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
export type ReviewRow = Database["public"]["Tables"]["reviews"]["Row"];
