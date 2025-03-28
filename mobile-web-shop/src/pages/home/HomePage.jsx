import ProductDisplay from "./ProductDisplay";
import SearchBar from "./SearchBar";
import CategoryFilterMenu from "./CategoryFilterMenu";
import NavBar from "@/components/NavBar";

import { useEffect } from "react";

import useProductStore from "@/store/useProductStore";
import useCartStore from "@/store/useCartStore";
import useUserStore from "@/store/useUserStore";

function HomePage() {
  const { fetchProducts, hasFetchedProducts, clearCategoryFilter } =
    useProductStore();
  const { fetchCartItems, hasFetchedCartItems } = useCartStore();
  const { userId } = useUserStore();

  // Fetch products and categories on mount
  useEffect(() => {
    if (!hasFetchedProducts) {
      fetchProducts();
    }

    if (!hasFetchedCartItems && userId) {
      fetchCartItems(userId);
    }
  }, []);

  useEffect(() => {
    return () => {
      clearCategoryFilter();
    };
  }, [clearCategoryFilter]);

  return (
    <div className="pb-20">
      <SearchBar className="m-5" />

      <div className="grid grid-cols-4 sm:flex">
        <div className="col-span-1">
          <CategoryFilterMenu />
        </div>

        <div className="col-span-3 sm:grid sm:grid-cols-2 w-full h-fit">
          <ProductDisplay />
        </div>
      </div>

      <NavBar />
    </div>
  );
}

export default HomePage;
