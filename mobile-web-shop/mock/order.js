import fs from 'fs';
import { getLatestId } from './user';

export default [
  {
    url: '/api/create-order',
    method: 'post',
    response: (req, res) => {
      try {
        const { items, status, userId } = req.body;
        const orders = JSON.parse(fs.readFileSync('./mock/data/orders.json', 'utf-8'));
        const latestOrderId = getLatestId(orders);
        const newOrderId = latestOrderId + 1;
        const newOrder = { id: newOrderId, items, status, userId };
        const updatedOrders = [...orders, newOrder];
        const totalAmount = items.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);

        fs.writeFileSync('./mock/data/orders.json', JSON.stringify(updatedOrders, null, 2));

        return {
          status: 200,
          data: {id: newOrderId, totalAmount},
        }
      } catch (err) {
        console.error('Error:', err);
      }
    }
  },
  {
    url: '/api/orders/:userId',
    method: 'get',
    response: ({ query }) => {
      const { userId } = query;

      try {
        const orders = JSON.parse(fs.readFileSync('./mock/data/orders.json', 'utf-8'));
        const userOrders = orders.filter(order => order.userId === parseInt(userId));

        return {
          status: 200,
          data: userOrders,
        }
      } catch (err) {
        console.error('Error:', err);
      }
    }
  },
]
