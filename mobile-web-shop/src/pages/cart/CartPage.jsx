import ProductCard from './ProductCard';
import Footer from './Footer';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUserStore } from '@/store';
import carts from '@/../mock/data/carts.json' with { type: 'json' };
import products from '@/../mock/data/products.json' with { type: 'json' };

function CartPage() {
  const user = useUserStore(state => state.user);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const noOfCheckOut = selectedItems.size;
  let totalCheckOutAmount = 0;
  let cartDisplay, cartItems = [];

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

  if (user) {
    const userId = user.id;
    const userCart = carts.find(cart => cart.userId === userId);
    cartItems = userCart.items;

    cartDisplay = cartItems.map(item => {
      const product = products.find(product => product.id === item.productId);
      if (selectedItems.has(item.productId)) {
        totalCheckOutAmount += product.price * item.quantity;
      }

      return (
        <ProductCard
          key={item.productId}
          product={product}
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
