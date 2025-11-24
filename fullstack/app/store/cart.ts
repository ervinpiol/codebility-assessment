import { create } from "zustand";
import type { CartItem } from "@/lib/cart";

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  add: (id: string, qty: number) => Promise<void>;
  updateQuantity: (id: string, qty: number) => Promise<void>;
  remove: (id: string) => Promise<void>;
  itemCount: number;
  total: number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isLoading: false,

  fetchCart: async () => {
    set({ isLoading: true });
    const res = await fetch("/api/cart");
    const cart = await res.json();
    set({ items: cart, isLoading: false });
  },

  add: async (id, qty) => {
    await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, quantity: qty }),
    });
    get().fetchCart(); // refresh cart after adding
  },

  remove: async (id) => {
    await fetch("/api/cart", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    get().fetchCart(); // refresh cart after removal
  },

  updateQuantity: async (id: string, qty: number) => {
    if (qty <= 0) {
      await get().remove(id);
      return;
    }

    await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, quantity: qty, replace: true }), // ← important
    });

    get().fetchCart();
  },

  get itemCount() {
    return get().items.reduce((sum, i) => sum + i.quantity, 0);
  },

  get total() {
    return get().items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  },
}));
