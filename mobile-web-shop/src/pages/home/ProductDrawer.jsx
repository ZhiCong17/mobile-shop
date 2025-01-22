import { useState } from 'react';
import { useUserStore } from '@/store';
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
    navigate('/login');
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
          <Button>Add to Cart</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default ProductDrawer
