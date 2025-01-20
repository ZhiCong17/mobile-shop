import products from '../../../mock/data/products.json' with { type: 'json' };

function CategoryFilterMenu() {
  const categories = products.map((product) => product.category);
  const uniqueCategories = [...new Set(categories)];
  const isLastCategory = (category) => category === uniqueCategories[uniqueCategories.length - 1];
  const categoryListDisplay = uniqueCategories.map((category) => (
    <li key={category} className={`px-2 py-3 text-sm border-b break-words ${isLastCategory(category) ? '' : 'border-b-neutral-500'}`}>
      {category}
    </li>
  ));

  return (
    <ul className='bg-neutral-200 h-full rounded-r-lg'>
      {categoryListDisplay}
    </ul>
  )
}

export default CategoryFilterMenu;
