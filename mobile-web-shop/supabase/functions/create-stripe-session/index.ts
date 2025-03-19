import { serve } from "https://deno.land/std@0.170.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@12.8.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

const stripeClient = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2023-10-16",
  httpClient: Stripe.createFetchHttpClient(),
});

interface CreateSessionRequest {
  items: {
    product: {
      name: string;
      price: number;
      product_id: number;
    };
    quantity: number;
  }[];
  userId: number;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    const { items, userId } = await req.json() as CreateSessionRequest;

    const lineItemsData = items.map((item) => {
      const itemPriceInCents = +(item.product.price * 100).toFixed(2);
      return {
        price_data: {
          currency: "sgd",
          product_data: {
            name: item.product.name,
          },
          unit_amount: itemPriceInCents,
        },
        quantity: item.quantity,
      };
    });

    const session = await stripeClient.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItemsData,
      mode: "payment",
      success_url:
        `http://localhost:8080/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:
        `http://localhost:8080/payment/cancelled?session_id={CHECKOUT_SESSION_ID}`,
      metadata: {
        checkoutItems: JSON.stringify(items),
        userId: userId.toString(),
      },
    });

    return new Response(JSON.stringify({ sessionId: session.id }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error: unknown) {
    console.error("Error creating Stripe session:", error);

    if (error instanceof Error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    return new Response(
      JSON.stringify({ error: "An unknown error occurred" }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  }
});
