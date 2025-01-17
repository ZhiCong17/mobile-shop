import products from '../../../mock/data/products.json' with { type: 'json' };
import { CirclePlus } from 'lucide-react';

const product = products[0];

function ProductCard() {
  return (
    <div className='flex pl-4 pb-4 pr-0 gap-2'>
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
