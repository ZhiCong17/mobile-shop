import { create } from "zustand";

const useProductStore = create((set, get) => ({
  // Fetch Products
  products: [],
  loadingProducts: false,
  hasFetchedProducts: false,
  fetchProducts: async () => {
    const url = "http://localhost:3000/api/products";
    set({ loadingProducts: true });

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Response status", response.status);
      }

      const products = await response.json();
      set({ products, hasFetchedProducts: true, loadingProducts: false });
    } catch (error) {
      console.error("Error fetching products:", error);
      set({ loadingProducts: false });
    }
  },

  categoryFilter: "",
  setCategoryFilter: (categoryFilter) => set({ categoryFilter }),
  clearCategoryFilter: () => set({ categoryFilter: "" }),

  searchInput: "",
  setSearchInput: (searchInput) => set({ searchInput }),

  // Fetch Product Categories
  categories: [],
  loadingCategories: false,
  hasFetchedCategories: false,
  fetchCategories: async () => {
    const url = "http://localhost:3000/api/category";
    set({ loadingCategories: true });

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Response status", response.status);
      }

      const data = await response.json();
      const categories = data.categories;
      set({ categories, hasFetchedCategories: true, loadingCategories: false });
    } catch (error) {
      console.error("Error fetching product categories:", error);
      set({ loadingCategories: false });
    }
  },

  // Overall loading state
  loading: () => {
    return get().loadingProducts || get().loadingCategories;
  },
}));

export default useProductStore;
