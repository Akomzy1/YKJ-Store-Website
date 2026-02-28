// GET /auth/callback
// Handles the OAuth redirect from Supabase (Google sign-in, email magic link, etc.)
// Exchanges the one-time `code` query parameter for a persistent session.

import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/account";

  if (code) {
    const cookieStore = cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Redirect to the page that originally required authentication
      const redirectUrl = next.startsWith("/") ? `${origin}${next}` : origin;
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Code was missing or exchange failed — redirect to login with error
  return NextResponse.redirect(
    `${origin}/login?error=Authentication+failed.+Please+try+again.`
  );
}
