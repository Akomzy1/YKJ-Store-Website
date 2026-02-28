"use client";

// ─── Admin Orders — /admin/orders ─────────────────────────────────────────────
// Client Component so we can update order status in-browser.

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { formatPrice } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

interface Order {
  id: string;
  status: OrderStatus;
  total: number;
  subtotal: number;
  delivery_cost: number;
  promo_code: string | null;
  delivery_method: string;
  delivery_address: {
    full_name?: string;
    line1?: string;
    city?: string;
    postcode?: string;
  };
  created_at: string;
  order_items: Array<{
    id: string;
    product_name: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
  }>;
}

const STATUS_COLOURS: Record<OrderStatus, string> = {
  pending:    "bg-yellow-50 text-yellow-700 border-yellow-200",
  processing: "bg-blue-50 text-blue-700 border-blue-200",
  shipped:    "bg-purple-50 text-purple-700 border-purple-200",
  delivered:  "bg-green-50 text-green-700 border-green-200",
  cancelled:  "bg-red-50 text-red-700 border-red-200",
  refunded:   "bg-gray-50 text-gray-700 border-gray-200",
};

const STATUS_OPTIONS: OrderStatus[] = [
  "pending", "processing", "shipped", "delivered", "cancelled", "refunded",
];

export default function AdminOrdersPage() {
  const [orders, setOrders]   = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState<string | null>(null); // order id being saved

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .order("created_at", { ascending: false });
      setOrders((data as Order[]) ?? []);
      setLoading(false);
    }
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function updateStatus(orderId: string, status: OrderStatus) {
    setSaving(orderId);
    await supabase.from("orders").update({ status }).eq("id", orderId);
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    setSaving(null);
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-bold text-2xl text-gray-900">Orders</h1>
        <p className="text-sm text-gray-500 mt-1">
          {loading ? "Loading…" : `${orders.length} orders total`}
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-32 text-gray-400">
          <Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading orders…
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-20 text-center">
          <p className="text-gray-400 text-sm">No orders yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <details
              key={order.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group"
            >
              {/* ── Summary row ── */}
              <summary className="px-6 py-4 flex items-center justify-between gap-4 cursor-pointer list-none select-none hover:bg-gray-50/50">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <p className="font-semibold text-gray-900 text-sm">
                      {order.delivery_address?.full_name ?? "—"}
                    </p>
                    <span className="text-xs text-gray-400">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(order.created_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {order.order_items.length} item{order.order_items.length !== 1 ? "s" : ""} ·{" "}
                    {order.delivery_method.replace("_", " ")}
                    {order.delivery_address?.line1
                      ? ` · ${order.delivery_address.line1}, ${order.delivery_address.postcode}`
                      : ""}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {/* Status badge */}
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border capitalize ${
                      STATUS_COLOURS[order.status]
                    }`}
                  >
                    {order.status}
                  </span>

                  {/* Total */}
                  <span className="text-sm font-bold text-gray-900">
                    {formatPrice(order.total)}
                  </span>

                  {/* Chevron */}
                  <svg
                    className="h-4 w-4 text-gray-400 group-open:rotate-180 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </summary>

              {/* ── Expanded details ── */}
              <div className="border-t border-gray-100 px-6 py-5 space-y-5">

                {/* Items */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    Items
                  </p>
                  <div className="space-y-2">
                    {order.order_items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center text-sm"
                      >
                        <span className="text-gray-700">
                          {item.product_name}{" "}
                          <span className="text-gray-400">× {item.quantity}</span>
                        </span>
                        <span className="font-medium text-gray-900">
                          {formatPrice(item.subtotal)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100 space-y-1 text-xs text-gray-500">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatPrice(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery ({order.delivery_method.replace("_", " ")})</span>
                      <span>{formatPrice(order.delivery_cost)}</span>
                    </div>
                    {order.promo_code && (
                      <div className="flex justify-between text-green-600">
                        <span>Promo ({order.promo_code})</span>
                        <span>–</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-sm text-gray-900 pt-1">
                      <span>Total</span>
                      <span>{formatPrice(order.total)}</span>
                    </div>
                  </div>
                </div>

                {/* Status update */}
                <div className="flex items-center gap-3">
                  <label
                    htmlFor={`status-${order.id}`}
                    className="text-sm font-medium text-gray-700 shrink-0"
                  >
                    Update status:
                  </label>
                  <select
                    id={`status-${order.id}`}
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
                    disabled={saving === order.id}
                    className="flex-1 rounded-lg border border-input bg-background px-3 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>
                  {saving === order.id && (
                    <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                  )}
                </div>
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}
