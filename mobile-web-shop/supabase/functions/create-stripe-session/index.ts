import { serve } from "https://deno.land/std@0.170.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@11.1.0?target=deno';
import { corsHeaders } from '../_shared/cors.ts'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  httpClient: Stripe.createFetchHttpClient()
});

interface CreateSessionRequest {
  items: {
    product: {
      name: string;
    };
    price: number;
    quantity: number;
  }[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { items } = await req.json() as CreateSessionRequest;

    const lineItemsData = items.map((item) => {
      const itemPriceInCents = +(item.price * 100).toFixed(2);
      return {
        price_data: {
          currency: 'sgd',
          product_data: {
            name: item.product.name,
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

    return new Response(JSON.stringify({ sessionId: session.id }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error('Error creating Stripe session:', error);

    if (error instanceof Error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        },
      });
    }

    return new Response(JSON.stringify({ error: 'An unknown error occurred' }), {
      status: 400,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      },
    });
  }
})
