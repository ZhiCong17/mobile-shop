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
}));

export default usePaymentStore;
