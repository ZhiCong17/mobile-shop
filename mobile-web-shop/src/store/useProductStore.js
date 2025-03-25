import { create } from "zustand";
import supabase from "@/utils/supabase";

const useProductStore = create((set) => ({
  products: [],
  loading: false,
  hasFetched: false,

  fetchProducts: async () => {
    set({ loading: true });

    try {
      const { data: products, error } = await supabase
        .from("product")
        .select("*");

      if (error) throw error;

      set({ products, loading: false, hasFetched: true });
    } catch (error) {
      console.error("Error fetching products:", error);
      set({ loading: false });
    }
  },

  categoryFilter: "",
  setCategoryFilter: (categoryFilter) => set({ categoryFilter }),
  clearCategoryFilter: () => set({ categoryFilter: "" }),

  searchInput: "",
  setSearchInput: (searchInput) => set({ searchInput }),

  // Fetching Product Categories
  categories: [],
  hasFetchedCategories: false,
  fetchCategories: async () => {
    const url = "http://localhost:3000/api/category";
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Response status", response.status);
      }

      const data = await response.json();
      const categories = data.categories;
      set({ categories, hasFetchedCategories: true });
    } catch (error) {
      console.error("Error fetching product categories:", error);
    }
  },
}));

export default useProductStore;
