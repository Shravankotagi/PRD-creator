export type StripeWebhookEventType =
  | "checkout.session.completed"
  | "checkout.session.expired"
  | "customer.subscription.created"
  | "customer.subscription.updated"
  | "customer.subscription.deleted"
  | "invoice.paid"
  | "invoice.payment_failed"
  | "payment_intent.succeeded"
  | "payment_intent.payment_failed";

export interface StripeCustomer {
  id: string;
  email: string;
  name?: string;
}

export interface StripeCheckoutSession {
  id: string;
  customer: string;
  customerEmail?: string;
  paymentStatus: "paid" | "unpaid" | "no_payment_required";
  status: "open" | "complete" | "expired";
  amountTotal: number;
  currency: string;
  metadata: Record<string, string>;
  subscriptionId?: string;
  successUrl: string;
  cancelUrl: string;
  createdAt: number;
  expiresAt: number;
}

export interface StripeSubscription {
  id: string;
  customerId: string;
  status:
    | "active"
    | "canceled"
    | "incomplete"
    | "incomplete_expired"
    | "past_due"
    | "trialing"
    | "unpaid";
  currentPeriodStart: number;
  currentPeriodEnd: number;
  cancelAtPeriodEnd: boolean;
  priceId: string;
  planId: string;
}

export interface StripeInvoice {
  id: string;
  customerId: string;
  subscriptionId?: string;
  amountDue: number;
  amountPaid: number;
  currency: string;
  status: "draft" | "open" | "paid" | "uncollectible" | "void";
  hostedInvoiceUrl?: string;
  pdfUrl?: string;
  createdAt: number;
}

export interface StripePaymentIntent {
  id: string;
  customerId?: string;
  amount: number;
  currency: string;
  status:
    | "requires_payment_method"
    | "requires_confirmation"
    | "requires_action"
    | "processing"
    | "requires_capture"
    | "canceled"
    | "succeeded";
  metadata: Record<string, string>;
}

export interface StripeWebhookEvent<T = unknown> {
  id: string;
  type: StripeWebhookEventType;
  data: {
    object: T;
  };
  created: number;
  livemode: boolean;
  apiVersion: string;
}

export type CheckoutSessionCompletedEvent =
  StripeWebhookEvent<StripeCheckoutSession>;
export type SubscriptionCreatedEvent = StripeWebhookEvent<StripeSubscription>;
export type SubscriptionUpdatedEvent = StripeWebhookEvent<StripeSubscription>;
export type SubscriptionDeletedEvent = StripeWebhookEvent<StripeSubscription>;
export type InvoicePaidEvent = StripeWebhookEvent<StripeInvoice>;
export type InvoicePaymentFailedEvent = StripeWebhookEvent<StripeInvoice>;
export type PaymentIntentSucceededEvent =
  StripeWebhookEvent<StripePaymentIntent>;