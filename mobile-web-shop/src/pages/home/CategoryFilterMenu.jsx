import products from '../../../mock/data/products.json' with { type: 'json' };
import { useCategoryStore } from '../../store';

function CategoryFilterMenu() {
  const categories = products.map((product) => product.category);
  const uniqueCategories = [...new Set(categories)];
  const isLastCategory = (category) => category === uniqueCategories[uniqueCategories.length - 1];
  const isFirstCategory = (category) => category === uniqueCategories[0];

  // Global category state
  const categoryInStore = useCategoryStore(state => state.category);
  const setCategory = useCategoryStore(state => state.setCategory);
  const handleCategoryClick = e => {
    if (e.target.innerText === categoryInStore) {
      setCategory('');
      return;
    }

    setCategory(e.target.innerText)
  };

  const categoryListDisplay = uniqueCategories.map((category) => (
    <li
      key={category}
      className={`
        px-2 py-3 text-sm border-b break-words
        ${isLastCategory(category) ? '' : 'border-b-neutral-500'}
        ${category === categoryInStore ? 'text-white bg-zinc-400' : ''}
        ${category === categoryInStore && isLastCategory(category) ? 'rounded-br-lg' : ''}
        ${category === categoryInStore && isFirstCategory(category) ? 'rounded-tr-lg' : ''}`}
      onClick={handleCategoryClick}
    >
      {category}
    </li>
  ));

  return (
    <ul className='bg-neutral-200 h-full min-h-[calc(100vh-160px)] rounded-r-lg'>
      {categoryListDisplay}
    </ul>
  )
}

export default CategoryFilterMenu;
