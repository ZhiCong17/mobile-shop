import products from '../../../mock/data/products.json' with { type: 'json' };
import ProductCard from './ProductCard';
import { useSearchStore } from '../../store';

function ProductDisplay() {
  const search = useSearchStore(state => state.search);
  const filteredProducts = products.filter(product => product.name.toLowerCase().includes(search));

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
