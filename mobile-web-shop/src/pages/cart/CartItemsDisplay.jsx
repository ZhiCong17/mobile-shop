import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";

import { Link } from "react-router-dom";
import { useCallback } from "react";

import useUserStore from "@/store/useUserStore";
import useCartStore from "@/store/useCartStore";

const CartItemsDisplay = (props) => {
  const { selectedItems, setSelectedItems } = props;
  const { userId } = useUserStore();
  const { loading, cartItems, setCartItems, updateCartItem } = useCartStore();

  // Check/uncheck cart item checkbox
  const handleItemSelectChange = (productId, checked) => {
    if (checked) {
      setSelectedItems(new Set([...selectedItems, productId]));
    } else {
      selectedItems.delete(productId);
      setSelectedItems(new Set(selectedItems));
    }
  };

  // Increase or decrease cart item quantity
  // ** To fix issue of cart items sequence changing when quantity is updated
  const debounce = (fn, delay) => {
    let timeoutId;

    return function (...args) {
      clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        fn.apply(this, args);
      }, delay);
    };
  };

  const debouncedUpdateCartItem = useCallback(
    debounce((userId, productId, newQuantity) => {
      updateCartItem(userId, productId, newQuantity);
    }, 1000),
    []
  );

  const handlePlusMinusClick = (productId, e) => {
    const item = cartItems.find((item) => item.product_id === productId);

    if (!item) return;

    let newQuantity;

    if (e.target.textContent === "+") {
      newQuantity = item.quantity + 1;
    } else if (e.target.textContent === "-" && item.quantity > 1) {
      newQuantity = item.quantity - 1;
    } else {
      return;
    }

    const updatedCartItems = cartItems.map((item) =>
      item.product_id === productId ? { ...item, quantity: newQuantity } : item
    );

    setCartItems(updatedCartItems);
    debouncedUpdateCartItem(userId, productId, newQuantity);
  };

  // Display user is not logged in message
  if (!userId) {
    return (
      <div className="min-h-[calc(100vh-240px)] flex flex-col items-center justify-center">
        <div className="w-[200px] h-[200px] rounded-full overflow-hidden mb-6">
          <img
            className="w-full h-full object-cover"
            src="/empty-profile.png"
            alt="empty profile"
          />
        </div>

        <p>
          Please{" "}
          <Link
            className="text-blue-500 underline underline-offset-4"
            to="/login"
          >
            log in
          </Link>{" "}
          to view your cart.
        </p>
      </div>
    );
  }

  // Display loading skeleton
  if (loading) {
    return (
      <>
        {[...Array(4)].map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </>
    );
  }

  return cartItems.length > 0 ? (
    <>
      {cartItems.map(({ product, product_id: productId, quantity }) => (
        <ProductCard
          key={productId}
          product={{ ...product, quantity }}
          handlePlusMinusClick={(e) => handlePlusMinusClick(productId, e)}
          isSelected={selectedItems.has(productId)}
          onSelectChange={(checked) =>
            handleItemSelectChange(productId, checked)
          }
        />
      ))}
    </>
  ) : (
    <div className="min-h-[calc(100vh-240px)] flex flex-col justify-center items-center">
      <img
        className="mb-6"
        width={200}
        src="/empty-cart.avif"
        alt="empty cart"
      />
      <p>Your cart is empty. </p>
      <p>
        Click{" "}
        <Link to="/" className="text-blue-500 underline underline-offset-4">
          here
        </Link>{" "}
        to browse our products.
      </p>
    </div>
  );
};

export default CartItemsDisplay;
