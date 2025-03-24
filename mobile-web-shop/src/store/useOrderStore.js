import { create } from "zustand";
import supabase from "@/utils/supabase";

const useOrderStore = create((set) => ({
  // Create a pending order and order items
  createOrder: async (userId, items) => {
    try {
      const { data, error } = await supabase
        .from("order")
        .insert([{ user_id: userId, status: "pending" }])
        .select("id");

      if (error) throw error;

      const orderId = data[0].id;

      // Create order items
      items.forEach(async (item) => {
        const { error } = await supabase.from("order_item").insert([
          {
            order_id: orderId,
            product_id: item.product_id,
            quantity: item.quantity,
          },
        ]);

        if (error) throw error;
      });

      return { status: 200, orderId };
    } catch (error) {
      console.error("Failed to create order or order items:", error);
      return { status: 500, error };
    }
  },

  // Update order status
  orderData: {},
  loading: false,

  updateOrderStatus: async () => {
    const sessionId = new URLSearchParams(window.location.search).get(
      "session_id"
    );
    set({ loading: true });

    try {
      const response = await fetch(
        "https://ckrgxzagzopquyxawsdi.supabase.co/functions/v1/verify-payment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            sessionId,
          }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to verify payment");
      }

      const orderData = await response.json();
      set({ orderData, loading: false });
    } catch (error) {
      console.error("Payment verification error:", error);
    }
  },

  // Fetch order by user ID
  orders: [],
  loadingOrders: false,
  hasFetched: false,
  fetchOrders: async (userId) => {
    try {
      set({ loadingOrders: true });

      const { data, error } = await supabase
        .from("order")
        .select("id, status, order_item(quantity, product(name, price))")
        .eq("user_id", userId);

      if (error) throw error;

      set({ orders: data, hasFetched: true, loadingOrders: false });
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  },
}));

export default useOrderStore;
