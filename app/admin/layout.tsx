// ─── Admin Layout — /admin ────────────────────────────────────────────────────
// Server Component. Guards all admin routes — redirects to /login if the
// authenticated user does not have is_admin = true in their profile.

import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Package, ShoppingBag, LogOut } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase";

async function getAdminProfile() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const admin = createAdminClient();
  if (!admin) return null;
  const { data } = await admin
    .from("profiles")
    .select("full_name, is_admin")
    .eq("id", user.id)
    .single();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!data || !(data as any).is_admin) return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data as { full_name: string; is_admin: boolean };
}

const NAV = [
  { href: "/admin",          label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products",  icon: Package },
  { href: "/admin/orders",   label: "Orders",    icon: ShoppingBag },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getAdminProfile();
  if (!profile) redirect("/login");

  return (
    <div className="min-h-screen flex bg-gray-50">

      {/* ── Sidebar ── */}
      <aside className="w-56 shrink-0 bg-[#1C1C1C] flex flex-col">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/10">
          <p className="text-white font-bold text-sm">YKJ Admin</p>
          <p className="text-white/40 text-xs mt-0.5 truncate">{profile.full_name}</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 space-y-0.5">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-5 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-white/10 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-3 text-xs text-white/50 hover:text-white transition-colors"
          >
            ← Back to site
          </Link>
          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="flex items-center gap-2 text-xs text-white/50 hover:text-white transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
