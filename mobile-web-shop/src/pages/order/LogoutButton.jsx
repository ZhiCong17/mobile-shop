import { Button } from "@/components/ui/button";
import { useToast } from "@/components/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

import { useNavigate } from "react-router-dom";

import useUserStore from "@/store/useUserStore";
import useOrderStore from "@/store/useOrderStore";
import useCartStore from "@/store/useCartStore";

function LogoutButton({ className }) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { logout } = useUserStore();
  const { clearOrders, hasFetchedOrders } = useOrderStore();
  const { clearCart, hasFetchedCartItems } = useCartStore();

  const handleLogoutButtonClick = () => {
    toast({
      variant: "destructive",
      description: "Are you sure you want to log out?",
      action: (
        <div className="flex flex-col gap-2">
          <ToastAction
            className="bg-slate-400 w-auto"
            altText="Confirm"
            onClick={handleLogOut}
          >
            Confirm
          </ToastAction>
          <ToastAction className="bg-slate-400" altText="Cancel">
            Cancel
          </ToastAction>
        </div>
      ),
    });
  };

  const handleLogOut = () => {
    logout();
    navigate("/");
    clearOrders();
    clearCart();
    hasFetchedOrders(false);
    hasFetchedCartItems(false);

    const toastId = toast({
      description: "You have logged out successfully.",
    });

    setTimeout(() => {
      toastId.dismiss();
    }, 2000);
  };

  return (
    <Button className={className} onClick={handleLogoutButtonClick}>
      Logout
    </Button>
  );
}

export default LogoutButton;
