// ─────────────────────────────────────────────────────────────────────────────
// Next.js Middleware — YKJ Store
//
// Runs on every matched request BEFORE the page renders.
// Responsibilities:
//   1. Refresh the Supabase session token (keeps users logged in)
//   2. Protect /account/* routes — redirect unauthenticated users to /login
//   3. Redirect already-authenticated users away from /login and /register
// ─────────────────────────────────────────────────────────────────────────────

import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  try {
    // Start with a passthrough response; may be replaced below.
    let supabaseResponse = NextResponse.next({ request });

    // ── Create a Supabase client scoped to this request ─────────────────────────
    // The cookie helpers below sync the session between request and response,
    // ensuring that token refreshes are propagated back to the browser.
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            // Write updated cookies to the request object first
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            // Then create a fresh response with the mutated request
            supabaseResponse = NextResponse.next({ request });
            // And set the updated cookies on the response (sent to the browser)
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // ── Get the current user ─────────────────────────────────────────────────────
    // getUser() makes a server-side request to validate the token.
    // Do NOT use getSession() here — it trusts the unvalidated cookie value.
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { pathname } = request.nextUrl;

    // ── Route rules ──────────────────────────────────────────────────────────────

    // 1. Protected: /account/* — requires authentication
    if (pathname.startsWith("/account") && !user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // 2. Auth pages: redirect away if already signed in
    if (
      (pathname === "/login" ||
        pathname === "/register" ||
        pathname === "/forgot-password") &&
      user
    ) {
      return NextResponse.redirect(new URL("/account", request.url));
    }

    // Return the (potentially cookie-refreshed) response
    return supabaseResponse;
  } catch (error) {
    console.error("[middleware] Error:", error);
    return NextResponse.next();
  }
}

// ── Matcher ───────────────────────────────────────────────────────────────────
// Run middleware on all routes except static assets and image optimisation.
// Excludes /api/webhook so raw bodies are not consumed by the middleware.

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/webhook|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
