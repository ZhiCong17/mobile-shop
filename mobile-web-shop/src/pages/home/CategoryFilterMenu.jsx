import { Skeleton } from "@/components/ui/skeleton";

import { useEffect } from "react";

import useProductStore from "@/store/useProductStore";

function CategoryFilterMenu() {
  const {
    loading,
    categoryFilter,
    setCategoryFilter,
    categories,
    hasFetchedCategories,
    fetchCategories,
  } = useProductStore();

  // Fetch product categories on component mount if not already fetched
  useEffect(() => {
    if (!hasFetchedCategories) {
      fetchCategories();
    }
  }, []);

  // Determine if a category is the last or first
  const isLastCategory = (index) => index === categories.length - 1;
  const isFirstCategory = (index) => index === 0;

  // Set or reset category filter state on clicking a category
  const handleCategoryFilterClick = (e) => {
    if (e.target.innerText === categoryFilter) {
      setCategoryFilter("");
    } else {
      setCategoryFilter(e.target.innerText);
    }
  };

  // Display categories
  const categoryListDisplay = categories.map((category, index) => {
    const { id, name } = category;

    return (
      <li
        key={id}
        className={`
        px-2 py-3 text-sm border-b break-words
        ${!isLastCategory(index) && "border-b-neutral-500"}
        ${name === categoryFilter && "text-white bg-zinc-400"}
        ${name === categoryFilter && isLastCategory(index) && "rounded-br-lg"}
        ${
          name === categoryFilter && isFirstCategory(index) && "rounded-tr-lg"
        }`}
        onClick={handleCategoryFilterClick}
      >
        {name}
      </li>
    );
  });

  // Display loading skeleton
  if (loading) {
    return <Skeleton className="h-lvh rounded-r-lg sm:w-[160px]" />;
  }

  return (
    <ul className="bg-neutral-200 h-full min-h-[calc(100vh-160px)] rounded-r-lg sm:w-[160px]">
      {categoryListDisplay}
    </ul>
  );
}

export default CategoryFilterMenu;
