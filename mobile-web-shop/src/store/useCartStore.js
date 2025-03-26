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
  cartProductCount: 0,
  setCartItems: (items) => set({ cartItems: items }),
  loading: false,
  hasFetched: false,

  fetchCartItems: async (userId) => {
    set({ loading: true });
    const url = `http://localhost:3000/api/cart?user_id=${userId}`;

    try {
      const response = await fetch(url);

      if (!response.ok) throw new Error("Error status:", response.status);

      const data = await response.json();
      const cartItems = data.body;

      set({
        cartItems,
        cartProductCount: cartItems.length,
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
    try {
      const { data, error } = await supabase
        .from("cart_item")
        .update({ quantity: newQuantity })
        .eq("user_id", userId)
        .eq("product_id", productId);

      if (error) throw error;

      return { status: 200 };
    } catch (error) {
      console.error("Failed to update cart:", error);
      return { status: 500, error };
    }
  },

  // Delete
  deleteCartItem: async (userId, productId) => {
    try {
      const { data, error } = await supabase
        .from("cart_item")
        .delete()
        .eq("user_id", userId)
        .eq("product_id", productId);

      if (error) throw error;

      set({ hasFetched: false });
      return { status: 200 };
    } catch (error) {
      console.error("Failed to delete cart item:", error);
      return { status: 500, error };
    }
  },
}));

export default useCartStore;
