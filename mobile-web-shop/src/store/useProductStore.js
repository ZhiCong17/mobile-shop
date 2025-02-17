import { create } from 'zustand';
import supabase from '@/utils/supabase';

const useProductStore = create((set) => ({
  products: [],
  loading: false,
  hasFetched: false,

  fetchProducts: async () => {
    set({ loading: true });

    try {
      const { data: products, error } = await supabase
        .from('product')
        .select('*');

      if (error) throw error;

      set({ products, loading: false, hasFetched: true });
    } catch (error) {
      console.error('Error fetching products:', error);
      set({ loading: false });
    }
  },

  categoryFilter: '',
  setCategoryFilter: (categoryFilter) => set({ categoryFilter }),
  clearCategoryFilter: () => set({ categoryFilter: '' }),
}))

export default useProductStore;
