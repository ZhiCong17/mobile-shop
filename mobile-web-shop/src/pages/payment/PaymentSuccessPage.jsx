import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { Link } from "react-router-dom";
import { useEffect } from "react";

import useOrderStore from "@/store/useOrderStore";
import useUserStore from "@/store/useUserStore";

const PaymentSuccessPage = () => {
  const { orderData, loading, updateOrderStatus } = useOrderStore();
  const { userId } = useUserStore();

  useEffect(() => {
    updateOrderStatus(userId);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-5">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
            <h1 className="mt-4 text-2xl font-semibold text-gray-900">
              Payment Successful!
            </h1>
            <p className="mt-2 text-gray-600">Thank you for your purchase.</p>

            {loading ? (
              <div className="mt-6 w-full h-[96px] flex items-center justify-center">
                <svg
                  width="24"
                  height="24"
                  stroke="#000"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g className="spinner">
                    <circle
                      cx="12"
                      cy="12"
                      r="9.5"
                      fill="none"
                      strokeWidth="2"
                    ></circle>
                  </g>
                </svg>
              </div>
            ) : (
              <div className="mt-6 bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Order number:</span>
                  <span className="text-gray-900 font-medium">
                    #{orderData.orderId}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Amount paid:</span>
                  <span className="text-gray-900 font-medium">
                    ${orderData.totalAmount / 100}
                  </span>
                </div>
              </div>
            )}

            <div className="mt-6 space-y-3">
              <Link to="/orders" className="block">
                <Button className="w-full bg-green-500 hover:bg-green-600">
                  View Order History
                </Button>
              </Link>
              <Link to="/" className="block">
                <Button variant="outline" className="w-full">
                  Back to Homepage
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default PaymentSuccessPage;
