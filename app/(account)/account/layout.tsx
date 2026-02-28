// ─── Account Layout — /account/* ──────────────────────────────────────────────
// Server Component: fetches the authenticated user + profile server-side.
// Renders a two-column layout: sidebar nav (desktop) + main content area.
// Middleware already blocks unauthenticated users, but we keep a fallback redirect.

import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getServerUser, getServerProfile } from "@/lib/supabase-server";
import AccountSidebarClient from "./AccountSidebarClient";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getServerUser();
  if (!user) redirect("/login");

  const profile = await getServerProfile();
  const displayName = profile?.full_name ?? user.email ?? "Account";
  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── Sidebar ── */}
          <aside className="lg:w-64 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* User header */}
              <div className="p-5 border-b border-gray-100 flex items-center gap-3">
                <div className="h-11 w-11 rounded-full bg-[#A0522D] flex items-center justify-center text-white font-bold text-lg shrink-0">
                  {avatarLetter}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 truncate text-sm">
                    {displayName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
              </div>
              {/* Nav links — client component handles active state + sign-out */}
              <AccountSidebarClient />
            </div>

            {/* YKJ logo link */}
            <Link href="/" className="mt-4 flex items-center gap-2 px-1">
              <Image
                src="/assets/ykj-logo.jpg"
                alt="YKJ"
                width={28}
                height={28}
                className="rounded-full object-cover"
              />
              <span className="text-xs text-gray-500 hover:text-gray-700">
                ← Back to shop
              </span>
            </Link>
          </aside>

          {/* ── Main content ── */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
