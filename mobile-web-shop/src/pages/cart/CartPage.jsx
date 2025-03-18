import Footer from "./Footer";
import CartItemsDisplay from "./CartItemsDisplay";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/hooks/use-toast";
import { showToast, createToastAction } from "@/utils/toastUtils";

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
  const {
    cartItems,
    setCartItems,
    hasFetched,
    fetchCartItems,
    deleteCartItem,
  } = useCartStore();

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

  // Handle deleting selected cart items
  const { toast } = useToast();

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

        <div className="sm:grid sm:grid-cols-2 sm:gap-x-10">
          <CartItemsDisplay
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
          />
        </div>
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
