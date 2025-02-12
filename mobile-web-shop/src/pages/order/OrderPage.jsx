import LogoutButton from './LogoutButton';
import OrderCard from './OrderCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

import { useUserStore } from '@/store';
import { usePathStore } from '@/store';

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function OrderPage() {
  const user = useUserStore(state => state.user);
  const setReturnPath = usePathStore(state => state.setReturnPath);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusActive, setStatusActive] = useState('success');
  const [loading, setLoading] = useState(true);

  const buttons = [
    { label: 'Success' },
    { label: 'Fail' },
  ]

  const filterOrders = (status) => {
    return orders.filter(order => order.status === status);
  }

  useEffect(() => {
    if (user) {
      fetchOrder();
    }

    setReturnPath('/orders');
  }, []);

  useEffect(() => {
    if (orders.length > 0) {
      setFilteredOrders(filterOrders(statusActive));
    }
  }, [statusActive, orders]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${user.id}`, {
        method: 'GET',
      });
      const result = await response.json();

      if (result.status === 200) {
        const orders = result.data.reverse();
        setOrders(orders);
      } else {
        console.error('Error fetching orders:', result.message);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleStatusButtonClick = (e) => {
    const status = e.target.innerText.toLowerCase();

    setStatusActive(status);
  }

  let orderDisplay;

  if (!user) {
    orderDisplay = <p className='min-h-[calc(100vh-240px)] flex items-center justify-center'>Please <Link className='text-blue-500 underline underline-offset-4 m-1' to='/login'>log in</Link> to view your orders.</p>;
  } else if (loading) {
    orderDisplay = (
      <>
        {[...Array(3)].map((_, index) => <Skeleton className='mb-5 h-40 rounded-lg' key={index} />)}
      </>
    )
  } else if (filteredOrders.length > 0) {
    orderDisplay = filteredOrders.map((order) => {
      return <OrderCard key={order.id} order={order} />;
    });
  } else {
    orderDisplay = (
      <div className='min-h-[calc(100vh-240px)] flex flex-col justify-center text-center'>
        <p>No order history found.</p>
      </div>
    );
  }

  return (
    <div className='m-5'>
      <Link className='text-blue-500 block mt-5' to='/'>Back to Home</Link>

      <div className='flex items-center relative p-7'>
        <h1 className='m-3 text-lg flex-1 font-bold absolute left-1/2 transform -translate-x-1/2 -translate-x-1/2'>Orders</h1>

        {user && <LogoutButton className='absolute right-0' />}
      </div>

      <hr/>

      {user && <div className='flex justify-center my-3 gap-3'>
        {buttons.map((button) => {
          return (
            <Button
              key={button.label}
              className={`w-full ${statusActive === button.label.toLowerCase() ? '!bg-blue-500' : 'bg-blue-200'}`}
              onClick={handleStatusButtonClick}
            >
              {button.label}
            </Button>
          )
        })}
      </div>}

      {orderDisplay}
    </div>
  );
}

export default OrderPage;
