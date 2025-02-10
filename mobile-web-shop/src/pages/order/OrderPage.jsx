import LogoutButton from './LogoutButton';
import { useUserStore } from '@/store';
import { useEffect, useState } from 'react';
import OrderCard from './OrderCard';
import { Link } from 'react-router-dom';
import { usePathStore } from '@/store';

function OrderPage() {
  const user = useUserStore(state => state.user);
  const [orders, setOrders] = useState([]);
  const setReturnPath = usePathStore(state => state.setReturnPath);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${user.id}`, {
        method: 'GET',
      });
      const result = await response.json();

      if (result.status === 200) {
        const userOrders = result.data
        setOrders(userOrders);
      } else {
        console.error('Error fetching orders:', result.message);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  }

  useEffect(() => {
    if (user) {
      fetchOrder();
    }

    setReturnPath('/orders');
  }, []);

  const orderDisplay = user ?
    orders.length > 0 ?
      orders.map(order => {
        return <OrderCard key={order.id} order={order} />
      }) :
      <div className='min-h-[calc(100vh-240px)] flex flex-col justify-center text-center'>
        <p>Your order history is empty. </p>
        <p>
          Click <Link to='/cart' className='text-blue-500 underline underline-offset-4'>here</Link> to checkout from your cart.
        </p>
      </div> :
    <p className='min-h-[calc(100vh-240px)] flex items-center justify-center'>Please <Link className='text-blue-500 underline underline-offset-4 m-1' to='/login'>log in</Link> to view your orders.</p>

  return (
    <div className='m-5'>
      <Link className='text-blue-500 block mt-5' to='/'>Back to Home</Link>
      <div className='flex items-center relative p-7'>
        <h1 className='m-3 text-lg flex-1 font-bold absolute left-1/2 transform -translate-x-1/2 -translate-x-1/2'>Orders</h1>
        {user && <LogoutButton className='absolute right-0' />}
      </div>
      <hr className='mb-5'/>
      {orderDisplay}
    </div>
  );
}

export default OrderPage;
