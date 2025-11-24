"use client";

import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/app/store/cart";

export function CartSummary() {
  const { items, itemCount, fetchCart } = useCartStore();

  // Fetch cart from API on mount
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Calculate total dynamically
  const total = items.reduce((sum, i) => sum + (i.price || 0) * i.quantity, 0);

  return (
    <Card className="p-4 bg-muted border-0">
      <h3 className="font-semibold text-foreground mb-4">Order Summary</h3>

      <div className="space-y-3 text-sm mb-4">
        <div className="flex justify-between text-muted-foreground">
          <span>
            Subtotal ({itemCount} item{itemCount !== 1 ? "s" : ""})
          </span>
          <span>${total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Shipping</span>
          <span className={total >= 50 ? "text-primary" : ""}>
            {total >= 50 ? "FREE" : "$9.99"}
          </span>
        </div>
      </div>

      <div className="border-t border-border pt-3 mb-4">
        <div className="flex justify-between font-bold text-foreground">
          <span>Total</span>
          <span className="text-lg">
            ${(total + (total >= 50 ? 0 : 9.99)).toFixed(2)}
          </span>
        </div>
      </div>

      <Link href="/cart" className="w-full block">
        <Button className="w-full" size="lg">
          <ShoppingCart className="w-5 h-5 mr-2" />
          View Cart
        </Button>
      </Link>
    </Card>
  );
}
