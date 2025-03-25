import LogoutButton from "./LogoutButton";
import OrderDisplay from "./OrderDisplay";
import OrderStatusFilter from "./OrderStatusFilter";

import useUserStore from "@/store/useUserStore";
import useReturnPathStore from "@/store/useReturnPathStore";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function OrderPage() {
  const { userId } = useUserStore();
  const { setReturnPath } = useReturnPathStore();
  const [statusActive, setStatusActive] = useState("success");

  useEffect(() => {
    setReturnPath("/orders");
  }, []);

  return (
    <div className="m-5">
      <Link className="text-blue-500 block mt-5" to="/">
        Back to Home
      </Link>

      <div className="flex items-center relative p-7">
        <h1 className="m-3 text-lg flex-1 font-bold absolute left-1/2 transform -translate-x-1/2">
          Orders
        </h1>

        {userId && <LogoutButton className="absolute right-0" />}
      </div>

      <hr />

      {userId && (
        <OrderStatusFilter
          statusActive={statusActive}
          setStatusActive={setStatusActive}
        />
      )}

      <OrderDisplay statusActive={statusActive} />
    </div>
  );
}

export default OrderPage;
