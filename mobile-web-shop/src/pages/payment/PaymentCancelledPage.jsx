import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { Link } from "react-router-dom";
import { useEffect } from "react";

import useOrderStore from "@/store/useOrderStore";

const PaymentCancelledPage = () => {
  const { orderData, loading, updateOrderStatus } = useOrderStore();

  useEffect(() => {
    updateOrderStatus();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="text-center">
            <XCircle className="mx-auto h-12 w-12 text-red-500" />
            <h1 className="mt-4 text-2xl font-semibold text-gray-900">
              Payment Cancelled
            </h1>
            <p className="mt-2 text-gray-600">
              Your payment was not completed. No charges have been made to your
              account.
            </p>

            {loading ? (
              <Skeleton className="mt-6 w-full h-[88px]" />
            ) : (
              <div className="mt-6 bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Order reference:</span>
                  <span className="text-gray-900 font-medium">
                    #{orderData.orderId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="text-red-500 font-medium">Cancelled</span>
                </div>
              </div>
            )}

            <div className="mt-6 space-y-3">
              <Button className="w-full bg-blue-500 hover:bg-blue-600">
                Try Again
              </Button>
              <Link to="/cart" className="block">
                <Button variant="outline" className="w-full">
                  Return to Cart
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default PaymentCancelledPage;
