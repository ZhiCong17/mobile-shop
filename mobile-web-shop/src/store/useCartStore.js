import { create } from 'zustand';
import supabase from '@/utils/supabase';

const useCartStore = create((set, get) => ({
  cartProductCount: 0,
  setCartProductCount: (count) => set({ cartProductCount: count }),
  addCountToCart: () => {
    const newCount = get().cartProductCount + 1;
    set({ cartProductCount: newCount });
  },

  addToCart: async (userId, productId, quantity) => {
    try {
      const { data, error } = await supabase
        .from('cart_item')
        .insert([
          { user_id: userId , product_id: productId, quantity },
        ]);

      if (error) throw error;

      return {status: 200};
    } catch (error) {
      console.error('Failed to add to cart:', error);
      return {status: 500, error};
    }
  },

  cartItems: [],
  loading: false,
  hasFetched: false,

  fetchCartItems: async (userId) => {
    set({ loading: true });

    try {
      const { data: cartItems, error } = await supabase
        .from('cart_item')
        .select('product_id, quantity, product(name, price, image_url)')
        .eq('user_id', userId);

      if (error) throw error;

      set({ cartItems, loading: false, hasFetched: true });
    } catch (error) {
      console.error('Failed to fetch cart items:', error);
      set({ loading: false });
    }
  },
}))

export default useCartStore;
