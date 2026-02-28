// CartSummary — order summary panel
// Shows: subtotal, delivery estimate, total, promo code input

interface CartSummaryProps {
  subtotal: number;
  deliveryCost: number;
}

const FREE_DELIVERY_THRESHOLD = 60;

export default function CartSummary({ subtotal, deliveryCost }: CartSummaryProps) {
  const isFreeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD;
  const total = subtotal + (isFreeDelivery ? 0 : deliveryCost);

  return (
    <div className="bg-brand-50 rounded-xl p-4 space-y-3">
      <h3 className="font-heading font-semibold">Order Summary</h3>
      <div className="flex justify-between text-sm">
        <span>Subtotal</span>
        <span>£{subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span>Delivery</span>
        <span>{isFreeDelivery ? <span className="text-green-600 font-medium">FREE</span> : `£${deliveryCost.toFixed(2)}`}</span>
      </div>
      {!isFreeDelivery && (
        <p className="text-xs text-muted-foreground">
          Add £{(FREE_DELIVERY_THRESHOLD - subtotal).toFixed(2)} more for free delivery
        </p>
      )}
      <div className="border-t border-border pt-3 flex justify-between font-bold">
        <span>Total</span>
        <span>£{total.toFixed(2)}</span>
      </div>
    </div>
  );
}
