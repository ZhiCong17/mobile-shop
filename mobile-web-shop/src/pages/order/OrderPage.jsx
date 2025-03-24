import LogoutButton from "./LogoutButton";
import OrderDisplay from "./OrderDisplay";
import { Button } from "@/components/ui/button";

import useUserStore from "@/store/useUserStore";
import useReturnPathStore from "@/store/useReturnPathStore";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function OrderPage() {
  const { userId } = useUserStore();
  const { setReturnPath } = useReturnPathStore();
  const [statusActive, setStatusActive] = useState("success");

  const buttons = [{ label: "Success" }, { label: "Fail" }];

  useEffect(() => {
    setReturnPath("/orders");
  }, []);

  const handleStatusButtonClick = (e) => {
    const status = e.target.innerText.toLowerCase();

    setStatusActive(status);
  };

  return (
    <div className="m-5">
      <Link className="text-blue-500 block mt-5" to="/">
        Back to Home
      </Link>

      <div className="flex items-center relative p-7">
        <h1 className="m-3 text-lg flex-1 font-bold absolute left-1/2 transform -translate-x-1/2 -translate-x-1/2">
          Orders
        </h1>

        {userId && <LogoutButton className="absolute right-0" />}
      </div>

      <hr />

      {userId && (
        <div className="flex justify-center my-3 gap-3">
          {buttons.map((button) => {
            return (
              <Button
                key={button.label}
                className={`w-full ${
                  statusActive === button.label.toLowerCase()
                    ? "!bg-blue-500"
                    : "bg-blue-200"
                }`}
                onClick={handleStatusButtonClick}
              >
                {button.label}
              </Button>
            );
          })}
        </div>
      )}

      <OrderDisplay statusActive={statusActive} />
    </div>
  );
}

export default OrderPage;
