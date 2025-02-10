import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import handleAfterPayment from './handleAfterPayment';

const PaymentSuccessPage = () => {
  const [orderId, setOrderId] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const processPayment = async () => {
      await handleAfterPayment();

      const orderData = JSON.parse(sessionStorage.getItem('orderData'));

      if (orderData?.id) {
        setOrderId(orderData.id);
        setTotalAmount(orderData.totalAmount);
        sessionStorage.removeItem('orderData');
      }
    }

    processPayment();
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

            <p className="mt-2 text-gray-600">
              Thank you for your purchase.
            </p>

            {orderId && (
              <div className="mt-6 bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Order number:</span>
                  <span className="text-gray-900 font-medium">#{orderId}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Amount paid:</span>
                  <span className="text-gray-900 font-medium">${totalAmount}</span>
                </div>
              </div>
            )}


            <div className="mt-6 space-y-3">
              <Link to='/orders' className='block'>
                <Button className="w-full bg-green-500 hover:bg-green-600">
                  View Order History
                </Button>
              </Link>

              <Link to="/" className='block'>
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
}

export default PaymentSuccessPage;
