import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-04-22.dahlia" as const,
});

export const CREDIT_PACKAGES = [
  { id: "credits_50", amount: 5000, credits: 5000, label: "$50", popular: false },
  { id: "credits_200", amount: 20000, credits: 22000, label: "$200", bonus: "+10% bonus", popular: true },
  { id: "credits_500", amount: 50000, credits: 60000, label: "$500", bonus: "+20% bonus", popular: false },
] as const;
