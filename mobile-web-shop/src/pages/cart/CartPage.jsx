import ProductCard from "./ProductCard";
import Footer from "./Footer";
import ProductCardSkeleton from "./ProductCardSkeleton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/hooks/use-toast";
import { showToast, createToastAction } from "@/utils/toastUtils";

import { loadStripe } from "@stripe/stripe-js";
import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";

import useReturnPathStore from "@/store/useReturnPathStore";
import useUserStore from "@/store/useUserStore";
import useCartStore from "@/store/useCartStore";

function CartPage() {
  const { toast } = useToast();

  // Redirect user back to cart page after login
  const { setReturnPath } = useReturnPathStore();

  useEffect(() => {
    setReturnPath("/cart");
  }, [setReturnPath]);

  // Fetch user's cart items and initiate a Stripe promise
  const [stripePromise, setStripePromise] = useState(null);
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
      const stripePromise = loadStripe(
        import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
      );
      setStripePromise(stripePromise);
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

  // Handle clicking select all checkbox
  const [selectedAll, setSelectedAll] = useState(false);

  const handleSelectAllChange = (checked) => {
    setSelectedAll(checked);
    if (checked) {
      const allProductIds = cartItems.map((item) => item.product_id);
      setSelectedItems(new Set(allProductIds));
    } else {
      setSelectedItems(new Set());
    }
  };

  // Calculate total amount of selected items
  const [totalCheckOutAmount, setTotalCheckOutAmount] = useState(0);

  useEffect(() => {
    const totalAmount = [...selectedItems].reduce((total, productId) => {
      const item = cartItems.find((item) => item.product_id === productId);
      return total + item.product.price * item.quantity;
    }, 0);

    setTotalCheckOutAmount(totalAmount);
  }, [selectedItems, handlePlusMinusClick]);

  // Handle checkout
  const handleCheckout = async () => {
    try {
      const stripe = await stripePromise;
      const checkoutItems = cartItems.filter((item) =>
        selectedItems.has(item.product_id)
      );

      if (!stripe) {
        throw new Error("Stripe has not been initialized");
      }

      const response = await fetch(
        "https://ckrgxzagzopquyxawsdi.supabase.co/functions/v1/create-stripe-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            items: checkoutItems,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();

        throw new Error(
          errorData.error || "Failed to create Stripe checkout session"
        );
      }

      if (response.ok) {
        const data = await response.json();

        const session = await stripe.redirectToCheckout({
          sessionId: data.sessionId,
        });

        if (session.error) {
          throw session.error;
        }
      }
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

  let cartDisplay;

  if (!userId) {
    cartDisplay = (
      <p className="min-h-[calc(100vh-240px)] flex items-center justify-center">
        Please{" "}
        <Link
          className="text-blue-500 underline underline-offset-4 m-1"
          to="/login"
        >
          log in
        </Link>{" "}
        to view your cart.
      </p>
    );
  } else if (loading) {
    cartDisplay = (
      <>
        {[...Array(3)].map((_, index) => (
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
      <div className="min-h-[calc(100vh-240px)] flex flex-col justify-center text-center">
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

        {cartDisplay}
      </div>
      {userId && (
        <Footer
          totalAmount={totalCheckOutAmount.toFixed(2)}
          selectedItemsCount={selectedItemsCount}
          selectedAll={selectedAll}
          onSelectAllChange={handleSelectAllChange}
          onCheckout={handleCheckout}
          isSelectAllDisabled={cartItems.length === 0}
        />
      )}
    </>
  );
}

export default CartPage;
