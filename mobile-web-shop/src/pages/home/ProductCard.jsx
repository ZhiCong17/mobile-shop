import ProductDrawer from './ProductDrawer';

function ProductCard({ product }) {
  return (
    <div className='flex pl-4 pb-4 pr-0 gap-2'>
      <div className='w-24 h-24 flex-shrink-0'>
        <img src={product.image} alt={product.name} className='w-full h-full rounded object-cover' />
      </div>
      <div className='relative w-full'>
        <p className='mt-2'>{product.name}</p>
        <div className='absolute bottom-2 left-0 flex justify-between w-full'>
          <p className='my-auto'>${product.price}</p>
          <ProductDrawer product={product} />
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
