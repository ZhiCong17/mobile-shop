import OrderCard from "./OrderCard";
import { Skeleton } from "@/components/ui/skeleton";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import useOrderStore from "@/store/useOrderStore";
import useUserStore from "@/store/useUserStore";

const OrderDisplay = ({ statusActive }) => {
  // Fetch user orders history
  const { userId } = useUserStore();
  const { orders, loadingOrders, hasFetchedOrders, fetchOrders } =
    useOrderStore();

  useEffect(() => {
    if (userId && !hasFetchedOrders) {
      fetchOrders(userId);
    }
  }, [userId]);

  // Filter orders by status
  const [filteredOrders, setFilteredOrders] = useState([]);

  useEffect(() => {
    setFilteredOrders(orders.filter((order) => order.status === statusActive));
  }, [orders, statusActive]);

  // When user is not logged in
  if (!userId) {
    return (
      <div className="min-h-[calc(100vh-240px)] flex flex-col items-center justify-center">
        <div className="w-[200px] h-[200px] rounded-full overflow-hidden mb-6">
          <img
            className="w-full h-full object-cover"
            src="/empty-profile.png"
            alt="empty profile"
          />
        </div>

        <p>
          Please{" "}
          <Link
            className="text-blue-500 underline underline-offset-4"
            to="/login"
          >
            log in
          </Link>{" "}
          to view your orders.
        </p>
      </div>
    );
  }

  // Skeleton loading
  if (loadingOrders) {
    return (
      <>
        {[...Array(3)].map((_, index) => (
          <Skeleton className="mb-5 h-40 rounded-lg" key={index} />
        ))}
      </>
    );
  }

  return (
    <div>
      {filteredOrders.length < 1 ? (
        <div className="min-h-[calc(100vh-240px)] flex flex-col justify-center text-center">
          <p>No order history found.</p>
        </div>
      ) : (
        filteredOrders.map((order) => (
          <OrderCard key={order.order_id} order={order} />
        ))
      )}
    </div>
  );
};

export default OrderDisplay;
