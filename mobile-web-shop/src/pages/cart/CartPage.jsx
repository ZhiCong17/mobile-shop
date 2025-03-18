import ProductCard from "./ProductCard";
import Footer from "./Footer";
import ProductCardSkeleton from "./ProductCardSkeleton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/hooks/use-toast";
import { showToast, createToastAction } from "@/utils/toastUtils";

import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";

import useReturnPathStore from "@/store/useReturnPathStore";
import useUserStore from "@/store/useUserStore";
import useCartStore from "@/store/useCartStore";

function CartPage() {
  const { toast } = useToast();
  const [selectedAll, setSelectedAll] = useState(false);

  // Redirect user back to cart page after login
  const { setReturnPath } = useReturnPathStore();

  useEffect(() => {
    setReturnPath("/cart");
  }, [setReturnPath]);

  // Fetch user's cart items
  const { userId } = useUserStore();
  const {
    cartItems,
    setCartItems,
    loading,
    hasFetched,
    fetchCartItems,
    updateCartItem,
    deleteCartItem,
  } = useCartStore();

  useEffect(() => {
    if (userId && !hasFetched) {
      fetchCartItems(userId);
    }
  }, [userId, hasFetched]);

  // Handle clicking checkbox of individual cart items
  const [selectedItems, setSelectedItems] = useState(new Set());
  const selectedItemsCount = selectedItems.size;

  const handleItemSelectChange = (productId, checked) => {
    if (checked) {
      if (selectedItemsCount === cartItems.length - 1) {
        setSelectedAll(true);
      }

      setSelectedItems(new Set([...selectedItems, productId]));
    } else {
      selectedItems.delete(productId);
      setSelectedItems(new Set(selectedItems));
      setSelectedAll(false);
    }
  };

  // Handle adding or minus quantity of cart items
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
    }

    const updatedCartItems = cartItems.map((item) =>
      item.product_id === productId ? { ...item, quantity: newQuantity } : item
    );

    setCartItems(updatedCartItems);
    debouncedUpdateCartItem(userId, productId, newQuantity);
  };

  // Handle deleting selected cart items
  const handleDelete = async (userId, selectedItems) => {
    selectedItems.forEach((item) => {
      deleteCartItem(userId, item);
    });

    showToast({
      toast,
      variant: "destructive",
      description: `${
        selectedItems.size === 1 ? "Product" : "Products"
      } removed from cart.`,
    });

    const updatedCartItems = cartItems.filter(
      (item) => !selectedItems.has(item.product_id)
    );
    setCartItems(updatedCartItems);
    setSelectedItems(new Set());
    setSelectedAll(false);
  };

  const handleDeleteButtonClick = () => {
    const confirmAction = createToastAction({
      className: "bg-slate-400",
      altText: "Confirm",
      onClick: () => handleDelete(userId, selectedItems),
    });

    const cancelAction = createToastAction({
      className: "bg-slate-400",
      altText: "Cancel",
      onClick: () => {},
    });

    showToast({
      toast,
      variant: "destructive",
      timeout: 5000,
      description: "Are you sure you want to delete the selected items?",
      action: (
        <div className="flex flex-col gap-2">
          {confirmAction}
          {cancelAction}
        </div>
      ),
    });
  };

  let cartDisplay;

  if (!userId) {
    cartDisplay = (
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
  } else if (loading) {
    cartDisplay = (
      <>
        {[...Array(4)].map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </>
    );
  } else if (cartItems.length > 0) {
    cartDisplay = (
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
    );
  } else {
    cartDisplay = (
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
  }

  return (
    <>
      <div className="m-5 pb-20">
        <Link className="text-blue-500 block mt-5" to="/">
          Back to Home
        </Link>

        <div className="flex items-center relative p-7">
          <h1 className="m-3 text-lg flex-1 font-bold absolute left-1/2 transform -translate-x-1/2 -translate-x-1/2">
            Cart Page {userId ? `(${cartItems.length})` : ""}
          </h1>

          {cartItems.length > 0 && (
            <Button
              className="absolute right-0"
              variant="destructive"
              disabled={selectedItemsCount === 0}
              onClick={handleDeleteButtonClick}
            >
              Delete
            </Button>
          )}
        </div>

        <hr className="mb-5" />

        <div className="sm:grid sm:grid-cols-2 sm:gap-x-10">{cartDisplay}</div>
      </div>
      {userId && (
        <Footer
          selectedItems={selectedItems}
          selectedAll={selectedAll}
          setSelectedAll={setSelectedAll}
          setSelectedItems={setSelectedItems}
        />
      )}
    </>
  );
}

export default CartPage;
