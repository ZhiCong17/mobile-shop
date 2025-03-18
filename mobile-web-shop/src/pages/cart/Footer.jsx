import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

import useCartStore from "@/store/useCartStore";

function Footer(props) {
  const {
    selectedItems,
    selectedAll,
    onSelectAllChange,
    onCheckout,
    isSelectAllDisabled,
  } = props;

  const { cartItems } = useCartStore();
  const selectedItemsCount = selectedItems.size;

  // Calculate total amount of selected items
  const totalCheckOutAmount = [...selectedItems].reduce((total, productId) => {
    const item = cartItems.find((item) => item.product_id === productId);
    return total + item.product.price * item.quantity;
  }, 0);

  return (
    <footer className="fixed bottom-0 flex items-center h-[72px] mt-4 z-50 bg-white w-full py-2 shadow-[0_-4px_6px_0_rgba(0,0,0,0.05)]">
      <Checkbox
        checked={selectedAll}
        disabled={isSelectAllDisabled}
        onCheckedChange={onSelectAllChange}
        className="w-4 h-4 ml-5 mr-3"
      />
      <p>All</p>
      <p className="ml-auto">Total: ${totalCheckOutAmount.toFixed(2)}</p>
      <Button
        className="ml-3 mr-5 w-[112px]"
        onClick={onCheckout}
        disabled={selectedItemsCount === 0}
      >
        Checkout ({selectedItemsCount})
      </Button>
    </footer>
  );
}

export default Footer;
