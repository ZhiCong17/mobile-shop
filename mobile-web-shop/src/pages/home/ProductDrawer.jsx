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
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { CirclePlus } from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import { useUserStore } from '@/store';
import { usePathStore } from '@/store';

function ProductDrawer({ product }) {
  const [count, setCount] = useState(1);
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();
  const setReturnPath = usePathStore((state) => state.setReturnPath);
  const { toast } = useToast();

  function handlePlusClick() {
    setCount(count + 1);
  }

  function handleMinusClick() {
    if (count > 1) {
      setCount(count - 1);
    }
  }

  function handleClickWithoutLogin() {
    const toastId = toast({
      description: 'Please login to proceed.',
      action: <ToastAction className='bg-slate-400' altText='Login' onClick={() => navigate('/login')}>Login</ToastAction>,
    });

    setTimeout(() => toastId.dismiss(), 4000);
    setReturnPath('/');
  }

  async function handleAddToCartClick() {
    try {
      const response = await fetch('api/add-to-cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, productId: product.id, quantity: count }),
      })

      if (!response.ok) {
        const errorResult = await response.json();
        console.error('Failed to add to cart:', errorResult.message);
        const toastId = toast({
          variant: 'destructive',
          description: `There was an error adding ${product.name} to the cart. Please try again later.`
        })

        setTimeout(() => toastId.dismiss(), 3000);
        return;
      }

      const data = await response.json();

      if (data.status === 200) {
        setCount(1);
        const toastId = toast({
          description: `${product.name} added to cart.`,
        })

        setTimeout(() => toastId.dismiss(), 3000);
      } else if (data.status === 409) {
        const toastId = toast({
          variant: 'destructive',
          description: `${product.name} is already in cart.`,
        })

        setTimeout(() => toastId.dismiss(), 3000);
      }
    } catch (error) {
      console.error('Error:', error);
      const toastId = toast({
        variant: 'destructive',
        description: `There was an error adding ${product.name} to the cart.\nPlease try again later.`
      })

      setTimeout(() => toastId.dismiss(), 3000);
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
