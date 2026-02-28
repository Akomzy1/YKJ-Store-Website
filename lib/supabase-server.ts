// ─────────────────────────────────────────────────────────────────────────────
// Supabase Server Client — YKJ Store
//
// Uses @supabase/ssr to create a cookie-based client that works in:
//   • Server Components
//   • Route Handlers
//   • Server Actions
//   • Middleware (via createMiddlewareClient helper below)
//
// NEVER import this file in Client Components — use createBrowserClient instead.
// ─────────────────────────────────────────────────────────────────────────────

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { UserProfile } from "@/types";

// ─── Server Component client ──────────────────────────────────────────────────
// Call once per request inside a Server Component or Route Handler.
// Reads/writes the session from HTTP cookies automatically.
// Note: we omit the <Database> generic because our custom Database type does
// not include the `Relationships` arrays required by @supabase/supabase-js,
// which would collapse query return types to `never`.

export function createSupabaseServerClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Suppress error when called from a Server Component.
            // Middleware is responsible for refreshing the session token.
          }
        },
      },
    }
  );
}

// ─── Convenience helpers ──────────────────────────────────────────────────────

/**
 * Returns the currently authenticated user, or null.
 * Always prefer getUser() over getSession() for security
 * (getUser() validates the token server-side on every call).
 */
export async function getServerUser() {
  try {
    const supabase = createSupabaseServerClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error || !user) return null;
    return user;
  } catch {
    return null;
  }
}

/**
 * Returns the user's profile row from the `profiles` table, or null.
 */
export async function getServerProfile(): Promise<UserProfile | null> {
  try {
    const supabase = createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) return null;
    return data as UserProfile | null;
  } catch {
    return null;
  }
}
