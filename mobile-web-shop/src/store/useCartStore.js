import { create } from "zustand";
import supabase from "@/utils/supabase";

const useCartStore = create((set) => ({
  // Create
  addToCart: async (userId, productId, quantity) => {
    const url = "http://localhost:3000/api/cart/add";

    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          user_id: userId,
          product_id: productId,
          quantity,
        }),
      });

      if (!response.ok) throw new Error(response.statusText);

      set({ hasFetched: false });
      return { status: 200 };
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  },

  // Read
  cartItems: [],
  setCartItems: (items) => set({ cartItems: items }),
  loading: false,
  hasFetched: false,

  fetchCartItems: async (userId) => {
    set({ loading: true });
    const url = `http://localhost:3000/api/cart?user_id=${userId}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        const data = await response.json();
        set({ loading: false, hasFetched: true });
        return { status: response.status, message: data.message };
      }

      const data = await response.json();
      const cartItems = data.body;

      set({
        cartItems,
        hasFetched: true,
        loading: false,
      });
    } catch (error) {
      console.error("Failed to fetch cart items:", error);
      set({ loading: false });
    }
  },

  // Update
  updateCartItem: async (userId, productId, newQuantity) => {
    const url = "http://localhost:3000/api/cart/update";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          product_id: productId,
          quantity: newQuantity,
        }),
      });
    } catch (error) {
      console.error("Failed to update cart item:", error);
    }
  },

  // Delete
  deleteCartItem: async (userId, productId) => {
    const url = "http://localhost:3000/api/cart/remove";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          product_id: productId,
        }),
      });

      const result = await response.json();
      return { status: result.status, message: result.message };
    } catch (error) {
      console.error("Failed to delete cart item:", error);
    }
  },
}));

export default useCartStore;
