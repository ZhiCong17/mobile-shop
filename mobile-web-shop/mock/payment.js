import dotenv from 'dotenv';
import Stripe from 'stripe';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default [
  {
    url: '/api/create-checkout-session',
    method: 'post',
    rawResponse: async (req, res) => {
      let body = '';

      req.on('data', (chunk) => {
        body += chunk.toString();
      })

      req.on('end', async () => {
        try {
          const items = JSON.parse(body).items;

          const lineItemsData = items.map((item) => {
            const itemPriceInCents = +(item.price * 100).toFixed(2);
            return {
              price_data: {
                currency: 'sgd',
                product_data: {
                  name: item.name,
                },
                unit_amount: itemPriceInCents,
              },
              quantity: item.quantity,
            }
          });

          const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItemsData,
            mode: 'payment',
            success_url: 'http://localhost:5173/payment/success',
            cancel_url: 'http://localhost:5173/payment/cancelled',
          });

          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 200;
          res.end(JSON.stringify({
            status: 200,
            message: 'success',
            sessionId: session.id,
          }));
        } catch (error) {
          console.error('Detailed error:', error);

          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 500;
          res.end(JSON.stringify({
            status: 500,
            message: error.message,
            error: error.toString(),
          }));
        }
      })
    }
  },
  {
    url: '/api/checkout-session-status/:sessionId',
    method: 'get',
    rawResponse: async (req, res) => {
      const sessionId = req.url.split('/').pop();;

      try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        const paymentStatus = session.payment_status === 'paid' ? 'success' : 'pending';

        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 200;
        res.end(JSON.stringify({
          status: 200,
          paymentStatus: paymentStatus,
        }));
      } catch (error) {
        console.error('Detailed error:', error);

        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 500;
        res.end(JSON.stringify({
          status: 500,
          message: error.message,
          error: error.toString(),
        }));
      }
    }
  },
];
