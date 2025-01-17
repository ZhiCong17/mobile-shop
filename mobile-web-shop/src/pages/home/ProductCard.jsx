import products from '../../../mock/data/products.json' with { type: 'json' };
import { CirclePlus } from 'lucide-react';

const product = products[0];

function ProductCard() {
  return (
    <div className='flex p-4 gap-2 w-9/12'>
      <img src={product.image} alt={product.name} className='w-24 h-24 rounded' />
      <div className='relative w-full'>
        <p className='mt-2'>{product.name}</p>
        <div className='absolute bottom-2 left-0 flex justify-between w-full'>
          <p className='my-auto'>${product.price}</p>
          <button><CirclePlus /></button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
