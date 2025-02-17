import { Skeleton } from '@/components/ui/skeleton';

import useProductStore from '@/store/useProductStore';

function CategoryFilterMenu() {
  const { products, loading, categoryFilter, setCategoryFilter } = useProductStore();

  const categories = products.map((product) => product.category);
  const uniqueCategories = [...new Set(categories)];
  const isLastCategory = (category) => category === uniqueCategories[uniqueCategories.length - 1];
  const isFirstCategory = (category) => category === uniqueCategories[0];

  const handleCategoryFilterClick = (e) => {
    if (e.target.innerText === categoryFilter) {
      setCategoryFilter('');
    } else {
      setCategoryFilter(e.target.innerText)
    }
  };

  const categoryListDisplay = uniqueCategories.map((category) => (
    <li
      key={category}
      className={`
        px-2 py-3 text-sm border-b break-words
        ${!isLastCategory(category) && 'border-b-neutral-500'}
        ${category === categoryFilter && 'text-white bg-zinc-400'}
        ${category === categoryFilter && isLastCategory(category) && 'rounded-br-lg'}
        ${category === categoryFilter && isFirstCategory(category) && 'rounded-tr-lg'}`}
      onClick={handleCategoryFilterClick}
    >
      {category}
    </li>
  ));

  if (loading) {
    return (
      <Skeleton className="h-lvh rounded-r-lg" />
    )
  }

  return (
    <ul className='bg-neutral-200 h-full min-h-[calc(100vh-160px)] rounded-r-lg'>
      {categoryListDisplay}
    </ul>
  )
}

export default CategoryFilterMenu;
