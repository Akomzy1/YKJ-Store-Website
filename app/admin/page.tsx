// ─── Admin Dashboard — /admin ─────────────────────────────────────────────────
// Server Component. Shows key stats at a glance.

import Link from "next/link";
import { Package, ShoppingBag, TrendingUp, Clock } from "lucide-react";
import { getAdminStats, getAdminOrders } from "@/lib/supabase-queries";
import { formatPrice } from "@/lib/utils";

export const metadata = { title: "Admin Dashboard | YKJ Store" };

// Revalidate stats every 60 seconds
export const revalidate = 60;

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  colour,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  colour: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className={`h-10 w-10 rounded-xl ${colour} flex items-center justify-center mb-4`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm font-medium text-gray-700 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

const STATUS_COLOURS: Record<string, string> = {
  pending:    "bg-yellow-50 text-yellow-700 border-yellow-200",
  processing: "bg-blue-50 text-blue-700 border-blue-200",
  shipped:    "bg-purple-50 text-purple-700 border-purple-200",
  delivered:  "bg-green-50 text-green-700 border-green-200",
  cancelled:  "bg-red-50 text-red-700 border-red-200",
  refunded:   "bg-gray-50 text-gray-700 border-gray-200",
};

export default async function AdminDashboard() {
  const [stats, recentOrders] = await Promise.all([
    getAdminStats(),
    getAdminOrders(),
  ]);

  const latest5 = recentOrders.slice(0, 5);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-bold text-2xl text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Welcome back — here&apos;s what&apos;s happening today.</p>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard
          icon={Package}
          label="Total Products"
          value={stats.totalProducts.toString()}
          colour="bg-[#A0522D]/10 text-[#A0522D]"
        />
        <StatCard
          icon={ShoppingBag}
          label="Total Orders"
          value={stats.totalOrders.toString()}
          colour="bg-blue-50 text-blue-600"
        />
        <StatCard
          icon={Clock}
          label="Orders Today"
          value={stats.ordersToday.toString()}
          colour="bg-purple-50 text-purple-600"
        />
        <StatCard
          icon={TrendingUp}
          label="Revenue Today"
          value={formatPrice(stats.revenueToday)}
          colour="bg-green-50 text-green-600"
        />
      </div>

      {/* ── Quick links ── */}
      <div className="grid grid-cols-2 gap-4 mb-10">
        <Link
          href="/admin/products/new"
          className="flex items-center gap-3 bg-[#A0522D] hover:bg-[#7B3F1A] text-white rounded-2xl p-5 transition-colors"
        >
          <Package className="h-6 w-6" />
          <div>
            <p className="font-bold text-sm">Add Product</p>
            <p className="text-xs text-white/70">Create a new product listing</p>
          </div>
        </Link>
        <Link
          href="/admin/orders"
          className="flex items-center gap-3 bg-white border border-gray-100 shadow-sm hover:shadow text-gray-900 rounded-2xl p-5 transition-shadow"
        >
          <ShoppingBag className="h-6 w-6 text-[#A0522D]" />
          <div>
            <p className="font-bold text-sm">View Orders</p>
            <p className="text-xs text-gray-400">Manage and update order status</p>
          </div>
        </Link>
      </div>

      {/* ── Recent orders ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-900">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm text-[#A0522D] hover:underline font-medium">
            View all →
          </Link>
        </div>

        {latest5.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-400 text-sm">
            No orders yet.
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {latest5.map((order: { id: string; status: string; total: number; created_at: string; delivery_address: { full_name?: string } }) => (
              <div
                key={order.id}
                className="px-6 py-4 flex items-center justify-between gap-4"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {order.delivery_address?.full_name ?? "—"}
                  </p>
                  <p className="text-xs text-gray-400">
                    #{order.id.slice(0, 8).toUpperCase()} ·{" "}
                    {new Date(order.created_at).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border capitalize ${
                      STATUS_COLOURS[order.status] ?? STATUS_COLOURS.pending
                    }`}
                  >
                    {order.status}
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
