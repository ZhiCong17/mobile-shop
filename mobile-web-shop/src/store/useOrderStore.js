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
}));

export default useOrderStore;
