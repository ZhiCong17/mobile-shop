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
  const productsPerPage = 10;
  const lastItemIndex = currentPage * productsPerPage;
  const firstItemIndex = lastItemIndex - productsPerPage;
  const currentItems = filteredProducts.slice(firstItemIndex, lastItemIndex);

  // Reset pagination when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [categoryFilter]);

  // Display products after filtering and pagination
  const display = currentItems?.length ? (
    currentItems.map((product) => {
      return <ProductCard key={product.id} product={product} />;
    })
  ) : (
    <div className="mt-8 text-center">No product found</div>
  );

  // Display skeleton loading while fetching products
  const ProductCardSkeleton = () => {
    return (
      <div className="flex pl-4 pb-4 pr-0 gap-2">
        <Skeleton className="h-24 w-24 rounded flex-shrink-0" />
        <div className="relative w-full">
          <Skeleton className="h-6 w-32 mt-2" />
          <div className="absolute bottom-2 left-0 flex justify-between w-full">
            <Skeleton className="h-6 w-12 my-auto" />
            <Skeleton className="h-6 w-6 rounded-full" />
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <>
        {[...Array(5)].map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </>
    );
  }

  return (
    <>
      {display}
      {filteredProducts.length > productsPerPage && (
        <PaginationSection
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          productsPerPage={productsPerPage}
          totalProducts={filteredProducts.length}
        />
      )}
    </>
  );
}

export default ProductDisplay;
