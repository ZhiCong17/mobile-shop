import { useState } from 'react';
import { useUserStore } from '@/store';
import { usePathStore } from '@/store';
import { useNavigate } from 'react-router-dom';
import { CirclePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';

function ProductDrawer({ product }) {
  const [count, setCount] = useState(1);
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();
  const setReturnPath = usePathStore((state) => state.setReturnPath);

  function handlePlusClick() {
    setCount(count + 1);
  }

  function handleMinusClick() {
    if (count > 1) {
      setCount(count - 1);
    }
  }

  function handleClickWithoutLogin() {
    alert('Please login to proceed');
    setReturnPath('/');
    navigate('/login');
  }

  async function handleAddToCartClick() {
    try {
      const response = await fetch('api/add-to-cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, productId: product.id, quantity: count }),
      })
      if (response.ok) {
        const data = await response.json();

        setCount(1);
        alert(`${product.name} ${data.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert(`There was an error adding ${product.name} to the cart. Please try again later.`);
    }
  }

  return (
    <Drawer>
      {user ? <DrawerTrigger><CirclePlus /></DrawerTrigger> : <CirclePlus onClick={handleClickWithoutLogin} />}
      <DrawerContent>
        <DrawerHeader className='gap-4'>
          <img className='rounded-lg w-full aspect-[4/3] object-cover' src={product.image} alt={product.name} />
          <DrawerTitle>{product.name}</DrawerTitle>
          <DrawerDescription>${product.price}</DrawerDescription>
          <DrawerDescription>{product.description}</DrawerDescription>
          <div className='flex justify-center gap-4 items-center'>
            <Button onClick={handleMinusClick} variant='outline'>-</Button>
            <span className='px-4'>{count}</span>
            <Button onClick={handlePlusClick} variant='outline'>+</Button>
          </div>
        </DrawerHeader>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button onClick={handleAddToCartClick}>Add to Cart</Button>
          </DrawerClose>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default ProductDrawer
