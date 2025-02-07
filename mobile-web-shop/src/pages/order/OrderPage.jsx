import LogoutButton from './LogoutButton';
import { useUserStore } from '@/store';
import { useEffect, useState } from 'react';
import OrderCard from './OrderCard';

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
      <h1>Order Page</h1>
      <LogoutButton />
      {user && orderDisplay}
    </div>
  );
}

export default OrderPage;
