import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/hooks/use-toast";
import { showToast, createToastAction } from "@/utils/toastUtils";

import { useNavigate } from "react-router-dom";
import { useState } from "react";

import useUserStore from "@/store/useUserStore";
import useReturnPathStore from "@/store/useReturnPathStore";
import useCartStore from "@/store/useCartStore";

function ProductDrawer({ product, children }) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setReturnPath } = useReturnPathStore();

  const handleClickWithoutLogin = () => {
    const action = createToastAction({
      className: "bg-slate-400",
      altText: "Login",
      onClick: () => navigate("/login"),
    });

    showToast({
      toast,
      description: "Please login to proceed.",
      timeout: 4000,
      action,
    });

    setReturnPath("/");
  };

  const [count, setCount] = useState(1);

  function handlePlusClick() {
    setCount(count + 1);
  }

  function handleMinusClick() {
    if (count > 1) {
      setCount(count - 1);
    }
  }

  const {
    id: productId,
    name,
    price,
    description,
    image_url: imageUrl,
  } = product;
  const { userId } = useUserStore();
  const { addCountToCart, addToCart } = useCartStore();

  const addProductToCart = async () =>
    await addToCart(userId, productId, count);

  async function handleAddToCartClick() {
    const result = await addProductToCart();

    if (result.status === 200) {
      setCount(1);
      addCountToCart();

      showToast({
        toast,
        description: `${name} added to cart.`,
      });
    } else if (result.status === 500 && result.error.code === "23505") {
      showToast({
        toast,
        variant: "destructive",
        description: `${name} is already in cart.`,
      });
    } else {
      showToast({
        toast,
        variant: "destructive",
        description: `There was an error adding ${name} to the cart.`,
      });
    }
  }

  return (
    <Drawer>
      {userId ? (
        <DrawerTrigger className="w-full">{children}</DrawerTrigger>
      ) : (
        <div onClick={handleClickWithoutLogin}>{children}</div>
      )}
      <DrawerContent>
        <DrawerHeader className="gap-4">
          <img
            className="rounded-lg w-full aspect-[4/3] object-cover"
            src={imageUrl}
            alt={name}
          />
          <DrawerTitle>{name}</DrawerTitle>
          <DrawerDescription>${price}</DrawerDescription>
          <DrawerDescription>{description}</DrawerDescription>
          <div className="flex justify-center gap-4 items-center">
            <Button onClick={handleMinusClick} variant="outline">
              -
            </Button>
            <span className="px-4">{count}</span>
            <Button onClick={handlePlusClick} variant="outline">
              +
            </Button>
          </div>
        </DrawerHeader>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button onClick={handleAddToCartClick}>Add to Cart</Button>
          </DrawerClose>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default ProductDrawer;
