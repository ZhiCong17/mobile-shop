import { Button } from "@/components/ui/button";
import { useToast } from "@/components/hooks/use-toast";
import { showToast, createToastAction } from "@/utils/toastUtils";

import useCartStore from "@/store/useCartStore";

const DeleteButton = (props) => {
  const { className, selectedItems, setSelectedItems, setSelectedAll } = props;
  const { cartItems, setCartItems, deleteCartItem } = useCartStore();

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
      <Button
        className={`${className} w-fit`}
        variant="destructive"
        disabled={selectedItems.size === 0}
        onClick={handleDeleteButtonClick}
      >
        Delete
      </Button>
    </>
  );
};

export default DeleteButton;
