import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";
import {
  StripeWebhookEvent,
  StripeCheckoutSession,
  StripeSubscription,
  InvoicePaymentFailedEvent,
} from "@/types/stripe";



export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("[Stripe Webhook] Signature verification failed:", err);
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = (event.data.object as unknown) as StripeWebhookEvent<StripeCheckoutSession>["data"]["object"];
        const userId = session.metadata?.userId;

        if (!userId) {
          console.warn("[Stripe Webhook] No userId in checkout session metadata");
          break;
        }

        await prisma.user.update({
          where: { id: userId },
          data: {
            plan: "PAID",
            stripeCustomerId: session.customer ?? null,
            stripeSubscriptionId: session.subscriptionId ?? null,
          },
        });

        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = (event.data.object as unknown) as StripeWebhookEvent<StripeSubscription>["data"]["object"];

        const isActive =
          subscription.status === "active" || subscription.status === "trialing";

        if (subscription.customerId) {
          await prisma.user.updateMany({
            where: { stripeCustomerId: subscription.customerId },
            data: {
              plan: isActive ? "PAID" : "FREE",
              stripeSubscriptionId: subscription.id,
            },
          });
        }

        break;
      }

      case "customer.subscription.deleted": {
        const subscription = (event.data.object as unknown) as StripeWebhookEvent<StripeSubscription>["data"]["object"];

        if (subscription.customerId) {
          await prisma.user.updateMany({
            where: { stripeCustomerId: subscription.customerId },
            data: {
              plan: "FREE",
              stripeSubscriptionId: null,
            },
          });
        }

        break;
      }

      case "invoice.payment_failed": {
        const invoice = ((event as unknown) as InvoicePaymentFailedEvent).data.object;

        if (invoice.customerId) {
          await prisma.user.updateMany({
            where: { stripeCustomerId: invoice.customerId },
            data: { plan: "FREE" },
          });
        }

        break;
      }

      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("[POST /api/stripe/webhook]", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}