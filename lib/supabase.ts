// ─────────────────────────────────────────────────────────────────────────────
// Supabase client — YKJ Store
// ─────────────────────────────────────────────────────────────────────────────
// Client-side:  use `supabase` (browser, anon key, respects RLS)
// Server-side:  use `createAdminClient()` (service role — never ship to browser)
// ─────────────────────────────────────────────────────────────────────────────

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types";

const supabaseUrl     = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// ─── Browser / client-side client ────────────────────────────────────────────
// Singleton — safe to import in Client Components and lib functions.
// Respects Supabase Row Level Security policies.
// Returns null if env vars are missing (build-time safe).

let _supabase: SupabaseClient<Database> | null = null;

export function getSupabaseClient(): SupabaseClient<Database> | null {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
      "[supabase] NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is not set — Supabase client unavailable."
    );
    return null;
  }
  if (!_supabase) {
    _supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession:    true,
        autoRefreshToken:  true,
        detectSessionInUrl: true,
      },
    });
  }
  return _supabase;
}

// Keep a named export for code that already uses `supabase` directly.
// Falls back to a dummy-safe null — callers that need a live client
// should switch to getSupabaseClient() and handle the null case.
export const supabase = getSupabaseClient();

// ─── Server-side admin client ─────────────────────────────────────────────────
// Uses the service role key — bypasses RLS.
// ONLY call this in Server Components, Route Handlers, or Server Actions.
// NEVER import or expose this to the browser.

export function createAdminClient(): SupabaseClient<Database> | null {
  const url            = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    console.warn(
      "[supabase] NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set — admin client unavailable."
    );
    return null;
  }
  return createClient<Database>(url, serviceRoleKey, {
    auth: {
      persistSession:   false,
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
