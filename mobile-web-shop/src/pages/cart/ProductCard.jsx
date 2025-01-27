import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useState, useCallback } from 'react';
import { useUserStore } from '@/store';

function ProductCard({ product, quantity, isSelected, onSelectChange }) {
  const [quantityInCart, setQuantityInCart] = useState(quantity);
  const userId = useUserStore(state => state.user).id;

  const debouncedUpdateCart = useCallback(debounce((userId, productId, newQuantity) => {
    updateCart(userId, productId, newQuantity);
  }, 1000), []);

  function handlePlusMinusClick(e) {
    let newQuantity = quantityInCart;

    if (e.target.textContent === '+') {
      newQuantity = quantityInCart + 1;
    } else if (e.target.textContent === '-' && quantityInCart > 1) {
      newQuantity = quantityInCart - 1;
    }

    setQuantityInCart(newQuantity);
    debouncedUpdateCart(userId, product.id, newQuantity);
  }

  return (
    <div className='flex items-center gap-4 pb-4'>
      <Checkbox checked={isSelected} onCheckedChange={onSelectChange} />
      <img className='w-24 h-24 rounded object-cover' src={product.image} />
      <div className='relative h-24 flex-grow'>
        <p className='mt-2'>{product.name}</p>
        <div className='absolute bottom-2 left-0 flex justify-between w-full'>
          <p className='my-auto'>${product.price}</p>
          <div className='flex gap-3'>
            <Button className='w-7 h-7 p-0' onClick={handlePlusMinusClick} variant='outline'>-</Button>
            <span>{quantityInCart}</span>
            <Button className='w-7 h-7 p-0' onClick={handlePlusMinusClick} variant='outline'>+</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductCard;

function updateCart(userId, productId, quantity) {
  try {
    const response = fetch('/api/edit-cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        productId,
        quantity,
      }),
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

function debounce(fn, delay) {
  let timeoutId;

  return function (...args) {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  }
}
