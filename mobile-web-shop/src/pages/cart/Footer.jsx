import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

import { useEffect } from "react";

import useCartStore from "@/store/useCartStore";
import usePaymentStore from "@/store/usePaymentStore";

function Footer(props) {
  const { selectedItems, selectedAll, setSelectedAll, setSelectedItems } =
    props;
  const { cartItems } = useCartStore();
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
  const totalCheckOutAmount = [...selectedItems].reduce((total, productId) => {
    const item = cartItems.find((item) => item.product_id === productId);
    return total + item.product.price * item.quantity;
  }, 0);

  // Initalize Stripe
  const { stripe, hasInitiatedStripe, initStripe } = usePaymentStore();

  useEffect(() => {
    if (!hasInitiatedStripe) {
      initStripe();
    }
  }, []);

  // Create and redirect to Stripe checkout session
  const handleCheckout = async () => {
    try {
      const checkoutItems = cartItems.filter((item) =>
        selectedItems.has(item.product_id)
      );

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

  return (
    <footer className="fixed bottom-0 flex items-center h-[72px] mt-4 z-50 bg-white w-full py-2 shadow-[0_-4px_6px_0_rgba(0,0,0,0.05)]">
      <Checkbox
        checked={selectedAll}
        disabled={cartItems.length === 0}
        onCheckedChange={handleSelectAllChange}
        className="w-4 h-4 ml-5 mr-3"
      />
      <p>All</p>
      <p className="ml-auto">Total: ${totalCheckOutAmount.toFixed(2)}</p>
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
