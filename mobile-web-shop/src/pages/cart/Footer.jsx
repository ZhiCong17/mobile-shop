import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

import { useEffect } from "react";

import useCartStore from "@/store/useCartStore";
import usePaymentStore from "@/store/usePaymentStore";
import useUserStore from "@/store/useUserStore";
import useOrderStore from "@/store/useOrderStore";

function Footer(props) {
  const {
    selectedItems,
    selectedAll,
    setSelectedAll,
    setSelectedItems,
    setIsCheckingOut,
  } = props;
  const { userId } = useUserStore();
  const { cartItems, deleteCartItem } = useCartStore();
  const selectedItemsCount = selectedItems.size;

  // Check/uncheck all cart items
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
  let totalCheckOutAmountCents = 0;

  if (selectedItems.size > 0) {
    totalCheckOutAmountCents = [...selectedItems].reduce((total, productId) => {
      const item = cartItems.find((item) => item.product_id === productId);
      return total + Math.round(item.product.price * 100) * item.quantity;
    }, 0);
  }

  // Initalize Stripe
  const { stripe, hasInitiatedStripe, initStripe, createStripeSession } =
    usePaymentStore();

  useEffect(() => {
    if (!hasInitiatedStripe) {
      initStripe();
    }
  }, []);

  // Create and redirect to Stripe checkout session
  const { createOrder } = useOrderStore();

  const handleCheckout = async () => {
    setIsCheckingOut(true);

    try {
      const checkoutItems = cartItems.filter((item) =>
        selectedItems.has(item.product_id)
      );

      // Delete selected items from cart
      checkoutItems.forEach((item) => {
        deleteCartItem(userId, item.product_id);
      });

      selectedItems.clear();
      setSelectedAll(false);

      // Create order and order items in database
      const total = totalCheckOutAmountCents / 100;
      let items = checkoutItems.map((item) => ({
        product_id: item.product_id,
        product_name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        image: item.product.image,
      }));
      const data = await createOrder(userId, total, items);
      const orderId = data.body.order_id;

      // Redirect to Stripe checkout session
      items = checkoutItems.map((item) => ({
        product: {
          name: item.product.name,
          price: item.product.price,
          product_id: item.product_id,
        },
        quantity: item.quantity,
      }));
      const domain = window.location.protocol + "//" + window.location.host;
      const { sessionId } = await createStripeSession(items, orderId, domain);
      const session = await stripe.redirectToCheckout({
        sessionId,
      });
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

  return (
    <footer className="fixed bottom-0 flex items-center h-[72px] mt-4 z-50 bg-white w-full py-2 shadow-[0_-4px_6px_0_rgba(0,0,0,0.05)]">
      <Checkbox
        checked={selectedAll}
        disabled={cartItems.length === 0}
        onCheckedChange={handleSelectAllChange}
        className="w-4 h-4 ml-5 mr-3"
      />
      <p>All</p>
      <p className="ml-auto">Total: ${totalCheckOutAmountCents / 100}</p>
      <Button
        className="ml-3 mr-5 w-[112px]"
        onClick={handleCheckout}
        disabled={selectedItemsCount === 0}
      >
        Checkout ({selectedItemsCount})
      </Button>
    </footer>
  );
}

export default Footer;
