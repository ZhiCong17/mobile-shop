import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { loadStripe } from '@stripe/stripe-js';

function Footer(props) {
  const { totalAmount, checkoutItems, selectAll, onSelectAllChange } = props;
  const noOfProducts = checkoutItems.length;

  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
  const handleCheckout = async () => {
    try {
      if (!stripePromise) {
        throw new Error('Stripe has not been initialized');
      }
      const stripe = await stripePromise;

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: checkoutItems
        }),
      });

      const data = await response.json();

      if (data.status === 200) {
        const session = await stripe.redirectToCheckout({
          sessionId: data.sessionId,
        });

        if (session.error) {
          throw session.error;
        }
      }
    } catch(err) {
      console.error('Checkout error:', err);
    }
  }

  return (
    <footer className='fixed bottom-0 flex items-center h-[72px] mt-4 z-50 bg-white w-full py-2 shadow-[0_-4px_6px_0_rgba(0,0,0,0.05)]'>
      <Checkbox checked={selectAll} onCheckedChange={onSelectAllChange} className='w-4 h-4 ml-5 mr-3' />
      <p>All</p>
      <p className='ml-auto'>Total: ${totalAmount}</p>
      <Button
        className='ml-3 mr-5 w-[112px]'
        onClick={handleCheckout}
        disabled={noOfProducts === 0}
      >
        Checkout ({noOfProducts})
      </Button>
    </footer>
  );
}

export default Footer;
