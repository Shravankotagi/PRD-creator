import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-05-27.dahlia",
  typescript: true,
});

export const PLANS = {
  FREE: {
    name: "Free",
    price: 0,
    features: [
      "Executive Summary",
      "First 3 User Stories",
      "Limited PRD preview",
    ],
    limits: {
      userStories: 3,
      fullPRD: false,
      pdfExport: false,
      notionExport: false,
    },
  },
  PAID: {
    name: "Pro",
    price: 10,
    features: [
      "Full PRD with all sections",
      "Edge case detection",
      "PDF export",
      "Notion export",
      "Version history",
      "Unlimited regenerations",
    ],
    limits: {
      userStories: Infinity,
      fullPRD: true,
      pdfExport: true,
      notionExport: true,
    },
  },
};

export async function createCheckoutSession({
  userId,
  email,
  priceId,
  successUrl,
  cancelUrl,
}: {
  userId: string;
  email: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}): Promise<string> {
  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: email,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    metadata: { userId },
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  return checkoutSession.url!;
}

export async function constructWebhookEvent(
  payload: string,
  signature: string
) {
  return stripe.webhooks.constructEvent(
    payload,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  );
}