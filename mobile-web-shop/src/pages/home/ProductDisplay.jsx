import products from '../../../mock/data/products.json' with { type: 'json' };
import ProductCard from './ProductCard';

function ProductDisplay() {
  const display = products.map((product) => <ProductCard key={product.id} product={product} />);

  return (
    <div>
      {display}
    </div>
  );
}

export default ProductDisplay;
