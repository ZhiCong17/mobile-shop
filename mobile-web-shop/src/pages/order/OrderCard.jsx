import { Card, CardContent } from "@/components/ui/card";

const OrderCard = ({ order }) => {
  let totalAmountCents = 0;

  const itemsDisplay = order.order_item.map((item) => {
    const {
      product: { name, price },
      quantity,
    } = item;

    totalAmountCents += Math.round(price * 100) * quantity;

    return (
      <div key={name} className="flex justify-between mb-3">
        <div>
          <h3 className="font-bold">{name}</h3>
          <p>Quantity: {quantity}</p>
        </div>
        <div>
          <p className="font-bold">
            ${Math.round(price * 100 * quantity) / 100}
          </p>
        </div>
      </div>
    );
  });

  let statusColor;

  switch (order.status) {
    case "success":
      statusColor = "text-green-500";
      break;
    case "fail":
      statusColor = "text-red-500";
      break;
    default:
      statusColor = "text-neutral-500";
  }

  return (
    <Card className="mb-5">
      <CardContent className="p-5">
        <div className="flex justify-between">
          <h2 className="font-bold">Order ID: #{order.id}</h2>
          <p className="text-right">
            Order Status:{" "}
            <span className={statusColor}>{order.status.toUpperCase()}</span>
          </p>
        </div>
        <hr className="my-1" />
        {itemsDisplay}
        <hr className="my-1" />
        <div className="flex justify-between font-bold">
          <p>Total</p>
          <p>${totalAmountCents / 100}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderCard;
