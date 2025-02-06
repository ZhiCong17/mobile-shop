import ProductCard from './ProductCard';
import Footer from './Footer';
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useUserStore } from '@/store';
import { Button } from '@/components/ui/button';
import { loadStripe } from '@stripe/stripe-js';

function CartPage() {
  const user = useUserStore(state => state.user);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const selectedItemsCount = selectedItems.size;
  const [cartItems, setCartItems] = useState([]);
  const [totalCheckOutAmount, setTotalCheckOutAmount] = useState(0);
  const [stripePromise, setStripePromise] = useState(null);

  const handleCheckout = async () => {
    try {
      const stripe = await stripePromise;
      const checkoutItems = cartItems.filter(item => selectedItems.has(item.productId));

      if (!stripe) {
        throw new Error('Stripe has not been initialized');
      }
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: checkoutItems
        }),
      });

      const data = await response.json();

      if (data.status === 200) {
        localStorage.setItem('stripeSessionId', data.sessionId);

        const session = await stripe.redirectToCheckout({
          sessionId: data.sessionId,
        });

        if (session.error) {
          throw session.error;
        }
      }
    } catch(err) {
      console.error('Checkout error:', err);
    }
  }

  const handleSelectAllChange = (checked) => {
    setSelectAll(checked);
    if (checked) {
      const allProductIds = cartItems.map(item => item.productId);
      setSelectedItems(new Set(allProductIds));
    } else {
      setSelectedItems(new Set());
    }
  }

  const handleItemSelectChange = (productId, checked) => {
    if (checked) {
      setSelectedItems(new Set([...selectedItems, productId]));
    } else {
      selectedItems.delete(productId);
      setSelectedItems(new Set(selectedItems));
      setSelectAll(false);
    }
  }

  const handleDeleteSelectedItems = async (userId, selectedItems) => {
    try {
      const response = await fetch('/api/remove-from-cart', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          selectedItems: [...selectedItems],
        }),
      });

      const data = await response.json();

      if (data.status === 200) {
        const updatedCartItems = cartItems.filter(item => !selectedItems.has(item.productId));
        setCartItems(updatedCartItems);
        setSelectedItems(new Set());
        setSelectAll(false);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const debouncedUpdateCart = useCallback(debounce((userId, productId, newQuantity) => {
    updateCart(userId, productId, newQuantity);
  }, 1000), []);

  function handlePlusMinusClick(productId, e) {
    const itemIndex = cartItems.findIndex(item => item.productId === productId);
    if (itemIndex === -1) return;

    const updatedCartItems = [...cartItems];
    let newQuantity = updatedCartItems[itemIndex].quantity;

    if (e.target.textContent === '+') {
      newQuantity = newQuantity + 1;
    } else if (e.target.textContent === '-' && newQuantity > 1) {
      newQuantity = newQuantity - 1;
    }

    updatedCartItems[itemIndex].quantity = newQuantity

    setCartItems(updatedCartItems);
    debouncedUpdateCart(user.id, productId, newQuantity);
  }

  const fetchUserCartItems = async (userId) => {
    try {
      const response = await fetch(`/api/carts/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      const data = await response.json();

      if (data.status === 404) {
        console.error(data.message);
        setCartItems([]);
      } else {
        setCartItems(data.cartItems);
      }
    } catch (err) {
      console.error('Error fetching user cart:', err);
      setCartItems([]);
    }
  }

  let cartDisplay;

  if (user) {
    useEffect(() => {
      fetchUserCartItems(user.id);

      const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
      setStripePromise(stripePromise);

      return () => {
        setStripePromise(null)
      }
    }, []);

    useEffect(() => {
      let totalAmount = 0;
      if (selectedItems.size > 0) {
        totalAmount = [...selectedItems].reduce((total, productId) => {
          const item = cartItems.find(item => item.productId === productId);

          return total + item.price * item.quantity;
        }, 0);
      }

      setTotalCheckOutAmount(totalAmount);
    }, [selectedItems, cartItems]);

    cartDisplay = cartItems.map(item => {
      return (
        <ProductCard
          key={item.productId}
          item={item}
          handlePlusMinusClick={e => handlePlusMinusClick(item.productId, e)}
          isSelected={selectedItems.has(item.productId)}
          onSelectChange={checked => handleItemSelectChange(item.productId, checked)}
        />
      )
    })
  } else {
    cartDisplay = <p className='text-center'>Please <Link className='text-blue-500 underline underline-offset-4' to='/login'>log in</Link> to view your cart.</p>;
  }

  return (
    <>
      <div className='m-5 pb-20'>
        <Link className='text-blue-500 block mt-5' to='/'>Back to Home</Link>
        <div className='flex items-center relative p-7'>
          <h1 className='m-3 text-lg flex-1 font-bold absolute left-1/2 transform -translate-x-1/2 -translate-x-1/2'>Cart Page {user ? `(${cartItems.length})` : ''}</h1>
          {cartItems.length > 0 && <Button
            className='absolute right-0'
            variant='destructive'
            onClick={() => handleDeleteSelectedItems(user.id, selectedItems)}
          >
            Delete
          </Button>}
        </div>
        <hr className='mb-5'/>
        {cartDisplay}
      </div>
      {user ? (
        <Footer
          totalAmount={totalCheckOutAmount.toFixed(2)}
          selectedItemsCount={selectedItemsCount}
          selectAll={selectAll}
          onSelectAllChange={handleSelectAllChange}
          onCheckout={handleCheckout}
        />
      ) : null}
    </>
  );
}

export default CartPage;

function updateCart(userId, productId, quantity) {
  try {
    fetch('/api/edit-cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        productId,
        quantity,
      }),
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

function debounce(fn, delay) {
  let timeoutId;

  return function (...args) {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  }
}
