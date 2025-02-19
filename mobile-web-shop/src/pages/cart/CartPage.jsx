import ProductCard from './ProductCard';
import Footer from './Footer';
import ProductCardSkeleton from './ProductCardSkeleton';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/hooks/use-toast';
import { showToast, createToastAction } from '@/utils/toastUtils';
import { ToastAction } from '@/components/ui/toast';

import { loadStripe } from '@stripe/stripe-js';
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

import useReturnPathStore from '@/store/useReturnPathStore';
import useUserStore from '@/store/useUserStore';
import useCartStore from '@/store/useCartStore';

function CartPage() {
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const selectedItemsCount = selectedItems.size;
  const [totalCheckOutAmount, setTotalCheckOutAmount] = useState(0);
  const { toast } = useToast();

  const { setReturnPath } = useReturnPathStore();

  // Redirect user back to cart page after login
  useEffect(() => {
    setReturnPath('/cart');
  }, [setReturnPath]);

  // Fetch user's cart items and initiate a Stripe promise
  const { userId } = useUserStore();
  const { cartItems, loading, hasFetched, fetchCartItems } = useCartStore();
  const [stripePromise, setStripePromise] = useState(null);

  useEffect(() => {
    if (userId && !hasFetched) {
      fetchCartItems(userId);

      const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
      setStripePromise(stripePromise);
    }

    return () => {
      setStripePromise(null);
    }
  }, [userId, hasFetched]);

  useEffect(() => {
    const totalAmount = [...selectedItems].reduce((total, productId) => {
      const item = cartItems.find(item => item.productId === productId);

      return total + item.price * item.quantity;
    }, 0);

    setTotalCheckOutAmount(totalAmount);
  }, [selectedItems]);

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
        localStorage.setItem('checkoutItems', JSON.stringify(checkoutItems));
        localStorage.setItem('orderUpdated', 'false');

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

  const handleDeleteButtonClick = () => {
    toast({
      variant: 'destructive',
      description: 'Are you sure you want to delete the selected items?',
      action: (
        <div className='flex flex-col gap-2'>
          <ToastAction className='bg-slate-400' altText='Confirm' onClick={() => handleDelete(user.id, selectedItems)}>Confirm</ToastAction>
          <ToastAction className='bg-slate-400' altText='Cancel'>Cancel</ToastAction>
        </div>
      )
    })
  }

  const handleDelete = async (userId, selectedItems) => {
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

        const toastId = toast({
          variant: 'destructive',
          description: 'Product(s) removed from cart.',
        })

        setTimeout(() => toastId.dismiss(), 3000);
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

  let cartDisplay;

  if (!userId) {
    cartDisplay = (
      <p className='min-h-[calc(100vh-240px)] flex items-center justify-center'>
        Please <Link className='text-blue-500 underline underline-offset-4 m-1' to='/login'>log in</Link> to view your cart.
      </p>
    );
  } else if (loading) {
    cartDisplay = (
      <>
          {[...Array(3)].map((_, index) => <ProductCardSkeleton key={index} />)}
      </>
    )
  } else if (cartItems.length > 0) {
    cartDisplay = (
      <>
        {cartItems.map(({product, product_id: productId, quantity}) => (
          <ProductCard
            key={productId}
            product={{...product, quantity}}
            handlePlusMinusClick={e => handlePlusMinusClick(productId, e)}
            isSelected={selectedItems.has(productId)}
            onSelectChange={checked => handleItemSelectChange(productId, checked)}
          />
        ))}
      </>
    )
  } else {
    cartDisplay = (
      <div className='min-h-[calc(100vh-240px)] flex flex-col justify-center text-center'>
        <p>Your cart is empty. </p>
        <p>
          Click <Link to='/' className='text-blue-500 underline underline-offset-4'>here</Link> to browse our products.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className='m-5 pb-20'>
        <Link className='text-blue-500 block mt-5' to='/'>Back to Home</Link>

        <div className='flex items-center relative p-7'>
          <h1 className='m-3 text-lg flex-1 font-bold absolute left-1/2 transform -translate-x-1/2 -translate-x-1/2'>Cart Page {userId ? `(${cartItems.length})` : ''}</h1>

          {cartItems.length > 0 && (
            <Button
              className='absolute right-0'
              variant='destructive'
              disabled={selectedItemsCount === 0}
              onClick={handleDeleteButtonClick}
            >
              Delete
            </Button>
          )}
        </div>

        <hr className='mb-5'/>

        {cartDisplay}
      </div>

      {userId && (
        <Footer
          totalAmount={totalCheckOutAmount.toFixed(2)}
          selectedItemsCount={selectedItemsCount}
          selectAll={selectAll}
          onSelectAllChange={handleSelectAllChange}
          onCheckout={handleCheckout}
          isSelectAllDisabled={cartItems.length === 0}
        />
      )}
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
