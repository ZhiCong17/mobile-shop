import { Link } from 'react-router-dom';
import { ShoppingCart, LayoutGrid, ScrollText } from 'lucide-react';

function NavBar() {
  return (
    <nav className='fixed bottom-0 mt-4 z-50 bg-white w-full py-2 shadow-[0_-4px_6px_0_rgba(0,0,0,0.05)]'>
      <ul className='flex'>
        <li className='w-1/3' >
          <Link className='flex flex-col items-center' to="/"><LayoutGrid size={32}/>Home</Link>
        </li>
        <li className='w-1/3' >
          <Link className='flex flex-col items-center' to="/cart" ><ShoppingCart size={32}/>Cart</Link>
        </li>
        <li className='w-1/3' >
          <Link className='flex flex-col items-center' to="/orders" ><ScrollText size={32}/>Orders</Link>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
