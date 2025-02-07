import LogoutButton from './LogoutButton';
import { useUserStore } from '@/store';
import { useEffect, useState } from 'react';
import OrderCard from './OrderCard';
import { Link } from 'react-router-dom';

function OrderPage() {
  const user = useUserStore(state => state.user);
  const [orders, setOrders] = useState([]);

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
  }, []);

  const orderDisplay = orders.map(order => {
    return <OrderCard key={order.id} order={order} />
  });

  return (
    <div className='m-5'>
      <Link className='text-blue-500 block mt-5' to='/'>Back to Home</Link>
      <div className='flex items-center relative p-7'>
        <h1 className='m-3 text-lg flex-1 font-bold absolute left-1/2 transform -translate-x-1/2 -translate-x-1/2'>Orders</h1>
        <LogoutButton className='absolute right-0' />
      </div>
      <hr className='mb-5'/>
      {user && orderDisplay}
    </div>
  );
}

export default OrderPage;
