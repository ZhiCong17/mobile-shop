import ProductCard from './ProductCard';
import Footer from './Footer';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUserStore } from '@/store';

function CartPage() {
  const user = useUserStore(state => state.user);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [cartItems, setCartItems] = useState([]);
  const [totalCheckOutAmount, setTotalCheckOutAmount] = useState(0);
  const noOfCheckOut = selectedItems.size;
  let cartDisplay;

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
    }
  }

  useEffect(() => {
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

    if (user) {
      fetchUserCartItems(user.id);
    }
  }, [user]);

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

  if (user) {
    cartDisplay = cartItems.map(item => {
      return (
        <ProductCard
          key={item.productId}
          productId={item.productId}
          name={item.name}
          price={item.price}
          image={item.image}
          quantity={item.quantity}
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
        <h1 className='text-center m-3 text-lg font-bold'>Cart Page {user ? `(${cartItems.length})` : ''}</h1>
        <hr className='mb-5'/>
        {cartDisplay}
      </div>
      {user ? (
        <Footer
          totalAmount={totalCheckOutAmount.toFixed(2)}
          noOfProducts={noOfCheckOut}
          selectAll={selectAll}
          onSelectAllChange={handleSelectAllChange}
        />
      ) : null}
    </>
  );
}

export default CartPage;
