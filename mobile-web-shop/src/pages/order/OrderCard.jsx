import { Card, CardContent } from '@/components/ui/card';

const OrderCard = ({ order }) => {
  const totalAmount = order.items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  const itemsDisplay = order.items.map((item) => {
    const { productId, quantity, name, price } = item

    return (
      <div key={productId} className="flex justify-between mb-3">
        <div>
          <h3 className='font-bold'>{name}</h3>
          <p>Quantity: {quantity}</p>
        </div>
        <div>
          <p className='font-bold'>${price * quantity}</p>
        </div>
      </div>
    )
  })

  return (
    <Card className='mb-5'>
      <CardContent className='p-5'>
        <div className='flex justify-between'>
          <h2 className='font-bold'>Order ID: #{order.id}</h2>
          <p>Order Status: {order.status}</p>
        </div>
        <hr className='my-1'/>
        { itemsDisplay }
        <hr className='my-1'/>
        <div className='flex justify-between font-bold'>
          <p>Total</p>
          <p>${totalAmount}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default OrderCard;
