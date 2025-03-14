import { create } from "zustand";
import supabase from "@/utils/supabase";

const useCartStore = create((set, get) => ({
  // Create
  addToCart: async (userId, productId, quantity) => {
    try {
      const { data, error } = await supabase
        .from("cart_item")
        .insert([{ user_id: userId, product_id: productId, quantity }]);

      if (error) throw error;

      set({ hasFetched: false });
      return { status: 200 };
    } catch (error) {
      console.error("Failed to add to cart:", error);
      return { status: 500, error };
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

    try {
      const { data: cartItems, error } = await supabase
        .from("cart_item")
        .select("product_id, quantity, product(name, price, image_url)")
        .eq("user_id", userId);

      if (error) throw error;

      set({
        cartItems,
        cartProductCount: cartItems.length,
        loading: false,
        hasFetched: true,
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
