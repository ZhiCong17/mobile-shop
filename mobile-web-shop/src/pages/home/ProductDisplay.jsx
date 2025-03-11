import ProductCard from "./ProductCard";
import PaginationSection from "./PaginationSection";
import { Skeleton } from "@/components/ui/skeleton";

import { useEffect, useState } from "react";

import useProductStore from "@/store/useProductStore";

function ProductDisplay() {
  const { loading, products, categoryFilter, searchInput } = useProductStore();

  const filteredProducts = products.filter((product) => {
    const isIncluded =
      product.name.toLowerCase().includes(searchInput) &&
      product.category.includes(categoryFilter);
    return isIncluded;
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = window.innerWidth >= 640 ? 20 : 10;
  const lastItemIndex = currentPage * productsPerPage;
  const firstItemIndex = lastItemIndex - productsPerPage;
  const currentItems = filteredProducts.slice(firstItemIndex, lastItemIndex);

  // Reset pagination when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [categoryFilter]);

  // Display products after filtering and pagination
  const display = currentItems?.length ? (
    currentItems.map((product) => (
      <ProductCard key={product.id} product={product} />
    ))
  ) : (
    <div className="mt-8 text-center col-span-2">No product found</div>
  );

  // Display skeleton loading while fetching products
  const ProductCardSkeleton = () => {
    return (
      <div className="flex flex-1 mx-4 mb-4 gap-2 rounded-lg shadow-md">
        <Skeleton className="h-24 w-24 rounded flex-shrink-0" />
        <div className="relative w-full">
          <Skeleton className="h-6 w-20 mt-1" />
          <div className="absolute bottom-1 left-0 flex justify-between w-full">
            <Skeleton className="h-6 w-12 my-auto" />
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <>
        {[...Array(window.innerWidth >= 640 ? 8 : 4)].map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </>
    );
  }

  return (
    <>
      {display}
      {filteredProducts.length > productsPerPage && (
        <div className="sm:col-span-2">
          <PaginationSection
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            productsPerPage={productsPerPage}
            totalProducts={filteredProducts.length}
          />
        </div>
      )}
    </>
  );
}

export default ProductDisplay;
