// ─── Account Dashboard — /account ────────────────────────────────────────────
// Server Component: fetches user profile + recent orders from Supabase.
// Shows welcome banner, stats cards, and a recent-orders table.

import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerUser, getServerProfile, createSupabaseServerClient } from "@/lib/supabase-server";
import { formatPrice } from "@/lib/utils";
import { ShoppingBag, TrendingUp, Heart, ChevronRight, Package } from "lucide-react";
import type { Order, OrderStatus } from "@/types";

// ─── Status badge ─────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending:    "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped:    "bg-purple-100 text-purple-800",
  delivered:  "bg-green-100 text-green-800",
  cancelled:  "bg-gray-100 text-gray-600",
  refunded:   "bg-red-100 text-red-700",
};

function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function AccountPage() {
  const user = await getServerUser();
  if (!user) redirect("/login");

  const profile = await getServerProfile();
  const firstName = profile?.full_name?.split(" ")[0] ?? "there";

  // Fetch recent orders (latest 5)
  const supabase = createSupabaseServerClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  const recentOrders = (orders ?? []) as Order[];

  // Compute stats
  const totalOrders = recentOrders.length;
  const totalSpent = recentOrders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="space-y-6">
      {/* ── Welcome banner ── */}
      <div className="bg-gradient-to-br from-[#A0522D] to-[#7B3F1A] rounded-2xl p-6 text-white">
        <h1 className="font-heading text-2xl font-bold mb-1">
          Hello, {firstName}!
        </h1>
        <p className="text-white/80 text-sm">
          Welcome to your YKJ account. Manage your orders, wishlist, and
          settings here.
        </p>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
          <div className="h-11 w-11 rounded-full bg-[#A0522D]/10 flex items-center justify-center">
            <ShoppingBag className="h-5 w-5 text-[#A0522D]" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
            <p className="text-xs text-gray-500 mt-0.5">Orders placed</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
          <div className="h-11 w-11 rounded-full bg-green-50 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {formatPrice(totalSpent)}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">Total spent</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
          <div className="h-11 w-11 rounded-full bg-red-50 flex items-center justify-center">
            <Heart className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">0</p>
            <p className="text-xs text-gray-500 mt-0.5">Wishlist items</p>
          </div>
        </div>
      </div>

      {/* ── Recent orders ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900 text-base">
            Recent orders
          </h2>
          <Link
            href="/account/orders"
            className="text-sm text-[#A0522D] hover:text-[#7B3F1A] font-medium flex items-center gap-1"
          >
            View all <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="py-14 text-center">
            <Package className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm font-medium">No orders yet</p>
            <p className="text-gray-400 text-xs mt-1">
              When you place your first order it will appear here.
            </p>
            <Link
              href="/shop"
              className="mt-4 inline-block text-sm font-semibold text-[#A0522D] hover:underline"
            >
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-6 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">
                    Order
                  </th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">
                    Date
                  </th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">
                    Status
                  </th>
                  <th className="text-right px-6 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(order.created_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-gray-900">
                      {formatPrice(order.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Quick links ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/account/settings"
          className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center justify-between hover:border-[#A0522D]/30 transition-colors group"
        >
          <div>
            <p className="font-semibold text-gray-900 text-sm">
              Account settings
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              Update name, phone, and password
            </p>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-[#A0522D] transition-colors" />
        </Link>

        <Link
          href="/shop"
          className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center justify-between hover:border-[#A0522D]/30 transition-colors group"
        >
          <div>
            <p className="font-semibold text-gray-900 text-sm">Browse shop</p>
            <p className="text-xs text-gray-500 mt-0.5">
              Explore our full range of products
            </p>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-[#A0522D] transition-colors" />
        </Link>
      </div>
    </div>
  );
}
