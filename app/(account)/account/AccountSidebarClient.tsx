"use client";

// ─── Account Sidebar — Client Component ───────────────────────────────────────
// Handles: active route highlight, sign-out action.
// Separated from the Server Component layout so we can use usePathname + router.

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { createBrowserClient } from "@supabase/ssr";
import {
  LayoutDashboard,
  ShoppingBag,
  Heart,
  Settings,
  LogOut,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/account",          label: "Dashboard",  icon: LayoutDashboard },
  { href: "/account/orders",   label: "My Orders",  icon: ShoppingBag },
  { href: "/account/wishlist", label: "Wishlist",   icon: Heart },
  { href: "/account/settings", label: "Settings",   icon: Settings },
];

export default function AccountSidebarClient() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <nav className="py-2">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const isActive =
          href === "/account"
            ? pathname === "/account"
            : pathname.startsWith(href);

        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-5 py-3 text-sm font-medium transition-colors ${
              isActive
                ? "bg-[#A0522D]/10 text-[#A0522D] border-r-2 border-[#A0522D]"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        );
      })}

      {/* Divider */}
      <div className="my-2 mx-5 border-t border-gray-100" />

      {/* Sign out */}
      <button
        onClick={handleSignOut}
        className="w-full flex items-center gap-3 px-5 py-3 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
      >
        <LogOut className="h-4 w-4 shrink-0" />
        Sign out
      </button>
    </nav>
  );
}
