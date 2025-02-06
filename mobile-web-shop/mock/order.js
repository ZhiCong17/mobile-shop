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
        const newOrder = { id: latestOrderId + 1, items, status, userId };
        const updatedOrders = [...orders, newOrder];

        fs.writeFileSync('./mock/data/orders.json', JSON.stringify(updatedOrders, null, 2));
      } catch (err) {
        console.error('Error:', err);
      }
    }
  },
]
