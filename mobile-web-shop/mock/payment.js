import dotenv from 'dotenv';
import Stripe from 'stripe';

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default [
  {
    url: '/api/create-checkout-session',
    method: 'POST',
    response: async () => {
      try {
        // Create a new Checkout Session
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: [
            {
              price_data: {
                currency: 'usd',
                product_data: {
                  name: 'T-shirt', // Product name
                },
                unit_amount: 2000, // Price in cents (e.g., $20.00)
              },
              quantity: 1,
            },
          ],
          mode: 'payment',
          success_url: 'http://localhost:5173/', // Redirect URL after successful payment
          cancel_url: 'http://localhost:5173/',
        });
        console.log(session);

        // Respond with the session ID
        return {
          status: 200,
          message: 'success',
          sessionId: session.id,
        }
      } catch (error) {
        console.error('Error creating checkout session:', error);

        return {
          status: 500,
          message: error.message,
        }
      }
    }
  },
]
