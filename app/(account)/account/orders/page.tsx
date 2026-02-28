// ─── Order History — /account/orders ─────────────────────────────────────────
// Server Component: fetches all orders for the authenticated user.
// Renders a full table with colour-coded status badges and expandable item rows.

import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerUser, createSupabaseServerClient } from "@/lib/supabase-server";
import { formatPrice } from "@/lib/utils";
import { Package, ChevronDown } from "lucide-react";
import type { Order, OrderStatus, OrderItem } from "@/types";

// ─── Status badge ─────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending:    "bg-yellow-100 text-yellow-800 border-yellow-200",
  processing: "bg-blue-100   text-blue-800   border-blue-200",
  shipped:    "bg-purple-100 text-purple-800 border-purple-200",
  delivered:  "bg-green-100  text-green-800  border-green-200",
  cancelled:  "bg-gray-100   text-gray-600   border-gray-200",
  refunded:   "bg-red-100    text-red-700    border-red-200",
};

const STATUS_DOT: Record<OrderStatus, string> = {
  pending:    "bg-yellow-400",
  processing: "bg-blue-400",
  shipped:    "bg-purple-400",
  delivered:  "bg-green-500",
  cancelled:  "bg-gray-400",
  refunded:   "bg-red-400",
};

function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_STYLES[status]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[status]}`} />
      {status}
    </span>
  );
}

// ─── Order with items ─────────────────────────────────────────────────────────

type OrderWithItems = Order & { order_items?: OrderItem[] };

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function OrdersPage() {
  const user = await getServerUser();
  if (!user) redirect("/login");

  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const orders = (data ?? []) as OrderWithItems[];

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-20 text-center">
        <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h2 className="font-heading text-xl font-bold text-gray-900 mb-2">
          No orders yet
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          Your order history will appear here once you&apos;ve placed your
          first order.
        </p>
        <Link
          href="/shop"
          className="inline-block bg-[#A0522D] hover:bg-[#7B3F1A] text-white font-semibold text-sm px-6 py-2.5 rounded-lg transition-colors"
        >
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-xl font-bold text-gray-900">
          Order history
        </h1>
        <span className="text-sm text-gray-500">
          {orders.length} order{orders.length !== 1 ? "s" : ""}
        </span>
      </div>

      {orders.map((order) => {
        const items = order.order_items ?? [];
        const date = new Date(order.created_at).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });

        return (
          <details
            key={order.id}
            className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden group"
          >
            {/* ── Summary row (always visible) ── */}
            <summary className="flex items-center justify-between px-6 py-4 cursor-pointer list-none select-none hover:bg-gray-50/60 transition-colors">
              <div className="flex items-center gap-4 min-w-0">
                {/* Order ref */}
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{date}</p>
                </div>
                <StatusBadge status={order.status} />
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <span className="font-bold text-gray-900 text-sm">
                  {formatPrice(order.total)}
                </span>
                <ChevronDown className="h-4 w-4 text-gray-400 transition-transform group-open:rotate-180" />
              </div>
            </summary>

            {/* ── Expanded detail ── */}
            <div className="border-t border-gray-100">
              {/* Delivery info */}
              <div className="px-6 py-4 bg-gray-50/50 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <p className="text-gray-400 uppercase tracking-wide font-medium mb-1">
                    Delivery
                  </p>
                  <p className="text-gray-700 capitalize">
                    {order.delivery_method.replace("_", " ")}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 uppercase tracking-wide font-medium mb-1">
                    Subtotal
                  </p>
                  <p className="text-gray-700">{formatPrice(order.subtotal)}</p>
                </div>
                {order.discount > 0 && (
                  <div>
                    <p className="text-gray-400 uppercase tracking-wide font-medium mb-1">
                      Discount
                    </p>
                    <p className="text-green-600">
                      −{formatPrice(order.discount)}
                      {order.promo_code && (
                        <span className="ml-1 text-gray-500">
                          ({order.promo_code})
                        </span>
                      )}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-gray-400 uppercase tracking-wide font-medium mb-1">
                    Delivery cost
                  </p>
                  <p className="text-gray-700">
                    {order.delivery_cost === 0
                      ? "Free"
                      : formatPrice(order.delivery_cost)}
                  </p>
                </div>
              </div>

              {/* Items */}
              {items.length > 0 && (
                <div className="divide-y divide-gray-50">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 px-6 py-3"
                    >
                      <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                        {item.product_image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.product_image}
                            alt={item.product_name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Package className="h-5 w-5 text-gray-300" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.product_name}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Qty: {item.quantity} × {formatPrice(item.unit_price)}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-gray-900 shrink-0">
                        {formatPrice(item.subtotal)}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Delivery address */}
              {order.delivery_address && (
                <div className="px-6 py-4 border-t border-gray-50 text-xs text-gray-500">
                  <span className="font-medium text-gray-600">Delivered to: </span>
                  {[
                    order.delivery_address.full_name,
                    order.delivery_address.line1,
                    order.delivery_address.line2,
                    order.delivery_address.city,
                    order.delivery_address.postcode,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </div>
              )}
            </div>
          </details>
        );
      })}
    </div>
  );
}
