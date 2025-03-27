import { create } from "zustand";
import supabase from "@/utils/supabase";

const useOrderStore = create((set) => ({
  // Create a pending order and order items
  createOrder: async (userId, total, items) => {
    const url = "https://saas-backend-api.vercel.app/api/order/add";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          pay_type: "credit-card",
          total,
          items,
        }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Failed to create order or order items:", error);
    }
  },

  // Update order status
  orderData: {},
  loading: false,

  updateOrderStatus: async (userId) => {
    const sessionId = new URLSearchParams(window.location.search).get(
      "session_id"
    );
    set({ loading: true });

    const url = "https://saas-backend-api.vercel.app/api/stripe/verify-payment";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionId }),
      });

      const data = await response.json();
      const orderData = {
        orderId: data.orderId,
        totalAmount: data.totalAmount,
        sessionUrl: data.sessionUrl,
      };

      // Update order status if paid in database
      if (data.status === "success") {
        const updateUrl =
          "https://saas-backend-api.vercel.app/api/order/update";
        const updateResponse = await fetch(updateUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            order_id: data.orderId,
            status: "to-deliver",
            user_id: userId,
          }),
        });
      }

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
