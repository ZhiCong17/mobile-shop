import { ShoppingCart, LayoutGrid, ScrollText } from "lucide-react";

import { Link } from "react-router-dom";
import { useEffect } from "react";

import useCartStore from "@/store/useCartStore";
import useUserStore from "@/store/useUserStore";

function NavBar() {
  const { userId } = useUserStore();
  const { cartProductCount, fetchCartItems, hasFetched } = useCartStore();

  useEffect(() => {
    if (userId && !hasFetched) {
      fetchCartItems(userId);
    }
  }, [userId, hasFetched]);

  return (
    <nav className="fixed bottom-0 mt-4 z-50 bg-white w-full py-2 shadow-[0_-4px_6px_0_rgba(0,0,0,0.05)]">
      <ul className="flex">
        <li className="w-1/3">
          <Link className="flex flex-col items-center" to="/">
            <LayoutGrid size={32} />
            Home
          </Link>
        </li>
        <li className="w-1/3 relative">
          <Link className="flex flex-col items-center" to="/cart">
            <ShoppingCart size={32} />
            Cart
          </Link>
          {userId && (
            <p className="absolute top-0 right-1/2 translate-x-7 -translate-y-1 bg-red-400 w-5 h-5 p-3 flex justify-center items-center rounded-full">
              {cartProductCount}
            </p>
          )}
        </li>
        <li className="w-1/3">
          <Link className="flex flex-col items-center" to="/orders">
            <ScrollText size={32} />
            Orders
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
