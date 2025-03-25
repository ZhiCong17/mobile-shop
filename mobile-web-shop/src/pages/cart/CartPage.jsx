import Footer from "./Footer";
import CartItemsDisplay from "./CartItemsDisplay";
import DeleteButton from "./DeleteButton";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import useReturnPathStore from "@/store/useReturnPathStore";
import useUserStore from "@/store/useUserStore";
import useCartStore from "@/store/useCartStore";

function CartPage() {
  // Redirect user back to cart page after login
  const { setReturnPath } = useReturnPathStore();

  useEffect(() => {
    setReturnPath("/cart");
  }, [setReturnPath]);

  // Fetch user's cart items
  const { userId } = useUserStore();
  const { cartItems, hasFetched, fetchCartItems } = useCartStore();

  useEffect(() => {
    if (userId && !hasFetched) {
      fetchCartItems(userId);
    }
  }, [userId, hasFetched]);

  // Check if all cart items are selected
  const [selectedAll, setSelectedAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const selectedItemsCount = selectedItems.size;

  useEffect(() => {
    if (selectedItemsCount === cartItems.length) {
      setSelectedAll(true);
    } else {
      setSelectedAll(false);
    }
  }, [selectedItemsCount, cartItems]);

  // Loading when checking out
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  if (isCheckingOut) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-5">
        <svg
          width="48"
          height="48"
          stroke="#000"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g className="spinner">
            <circle
              cx="12"
              cy="12"
              r="9.5"
              fill="none"
              strokeWidth="3"
            ></circle>
          </g>
        </svg>
        <p>Redirecting to Payment...</p>
      </div>
    );
  }

  return (
    <>
      <div className="m-5 pb-20">
        <Link className="text-blue-500 block mt-5" to="/">
          Back to Home
        </Link>

        <div className="flex items-center relative p-7">
          <h1 className="m-3 text-lg flex-1 font-bold absolute left-1/2 transform -translate-x-1/2">
            Cart Page {userId ? `(${cartItems.length})` : ""}
          </h1>

          {cartItems.length > 0 && userId && (
            <DeleteButton
              className="absolute right-0"
              selectedItems={selectedItems}
              setSelectedItems={setSelectedItems}
              setSelectedAll={setSelectedAll}
            />
          )}
        </div>

        <hr className="mb-5" />

        <CartItemsDisplay
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
        />
      </div>
      {userId && (
        <Footer
          selectedItems={selectedItems}
          selectedAll={selectedAll}
          setSelectedAll={setSelectedAll}
          setSelectedItems={setSelectedItems}
          setIsCheckingOut={setIsCheckingOut}
        />
      )}
    </>
  );
}

export default CartPage;
