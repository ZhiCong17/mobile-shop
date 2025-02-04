import LogoutButton from './LogoutButton';
import { loadStripe } from '@stripe/stripe-js';

function OrderPage() {
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

  const handleCheckout = async () => {
    // Initialize Stripe
    try {
      if (!stripePromise) {
        throw new Error('Stripe has not been initialized');
      }
      const stripe = await stripePromise;

      // Make request to create checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      console.log(await response.json());

      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(errorData.error?.message || 'Failed to create checkout session');
      // }

      // const session = await response.json();

      // // Redirect to Stripe checkout
      // const { error } = await stripe.redirectToCheckout({
      //   sessionId: session.id,
      // });

      // if (error) {
      //   throw error;
      // }
    } catch (err) {
      console.error('Checkout error:', err);
    }
  }

  return (
    <div>
      <h1>Order Page</h1>
      <LogoutButton />
      <button onClick={handleCheckout}>Checkout</button>
    </div>
  );
}

export default OrderPage;
