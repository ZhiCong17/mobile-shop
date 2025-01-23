import ProductCard from './ProductCard';
import { Link } from 'react-router-dom';
import { useUserStore } from '@/store';
import carts from '@/../mock/data/carts.json' with { type: 'json' };
import products from '@/../mock/data/products.json' with { type: 'json' };

function CartPage() {
  const user = useUserStore(state => state.user);
  let cartDisplay, cartItems;

  if (user) {
    const userId = user.id;
    const userCart = carts.find(cart => cart.userId === userId);
    cartItems = userCart.items;

    cartDisplay = cartItems.map(item => {
      const product = products.find(product => product.id === item.productId);

      return <ProductCard key={item.productId} product={product} quantity={item.quantity} />
    })
  } else {
    cartDisplay = <p className='text-center'>Please <Link className='text-blue-500 underline underline-offset-4' to='/login'>log in</Link> to view your cart.</p>;
  }

  return (
    <div className='m-5'>
      <Link className='text-blue-500 block mt-5' to='/'>Back to Home</Link>
      <h1 className='text-center m-3 text-lg font-bold'>Cart Page {user ? `(${cartItems.length})` : ''}</h1>
      <hr className='mb-5'/>
      {cartDisplay}
    </div>
  );
}

export default CartPage;
