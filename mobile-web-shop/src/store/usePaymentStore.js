import { create } from "zustand";
import { loadStripe } from "@stripe/stripe-js";

const usePaymentStore = create((set) => ({
  stripe: null,
  hasInitiatedStripe: false,
  initStripe: async () => {
    const stripePromise = loadStripe(
      import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
    );
    const stripe = await stripePromise;

    if (!stripe) {
      throw new Error("Failed to load Stripe");
    }

    set({ stripe, hasInitiatedStripe: true });
  },
  // Create a Stripe checkout session
  createStripeSession: async (items, orderId, domain) => {
    const url = "https://saas-backend-api.vercel.app/api/stripe/create-session";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          items,
          domain,
        }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Failed to create Stripe checkout session:", error);
    }
  },
}));

export default usePaymentStore;
