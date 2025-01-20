import products from '../../../mock/data/products.json' with { type: 'json' };
import ProductCard from './ProductCard';
import { useSearchStore, useCategoryStore } from '../../store';

function ProductDisplay() {
  const search = useSearchStore(state => state.search);
  const category = useCategoryStore(state => state.category);
  const filteredProducts = products.filter(product => {
    return product.name.toLowerCase().includes(search) && product.category.includes(category);
  });

  const display = filteredProducts.map((product) => {
    return <ProductCard key={product.id} product={product} />
  });

  return (
    <div>
      {display}
    </div>
  );
}

export default ProductDisplay;
