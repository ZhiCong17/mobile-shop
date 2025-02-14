import { ShoppingCart, LayoutGrid, ScrollText } from 'lucide-react';

import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { useCartStore } from '@/store';
import { useUserStore } from '@/store';

function NavBar() {
  const user = useUserStore(state => state.user);
  const productCount = useCartStore(state => state.productCountInCart);
  const setProductCountInCart = useCartStore(state => state.setProductCountInCart);
  const [loading, setLoading] = useState(true);

  const fetchProductCountInCart = async (userId) => {
    try {
      const response = await fetch(`/api/cart-product-count/${userId}`);
      const data = await response.json();

      if (data.status === 200) {
        setProductCountInCart(data.productCountInCart);
        setLoading(false);
      } else {
        console.error('Error fetching product count in cart:', data.message);
      }
    } catch (err) {
      console.error('Error fetching product count in cart:', err);
    }
  }

  useEffect(() => {
    if (user) {
      fetchProductCountInCart(user.id);
    }
  }, [user, fetchProductCountInCart]);

  return (
    <nav className='fixed bottom-0 mt-4 z-50 bg-white w-full py-2 shadow-[0_-4px_6px_0_rgba(0,0,0,0.05)]'>
      <ul className='flex'>
        <li className='w-1/3' >
          <Link className='flex flex-col items-center' to="/"><LayoutGrid size={32}/>Home</Link>
        </li>
        <li className='w-1/3 relative'>
          <Link className='flex flex-col items-center' to="/cart" ><ShoppingCart size={32}/>Cart</Link>
          {!loading && <p className='absolute top-0 right-1/2 translate-x-7 -translate-y-1 bg-red-400 w-5 h-5 p-3 flex justify-center items-center rounded-full'>{productCount}</p>}
        </li>
        <li className='w-1/3' >
          <Link className='flex flex-col items-center' to="/orders" ><ScrollText size={32}/>Orders</Link>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
