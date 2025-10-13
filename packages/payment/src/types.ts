import type Stripe from "stripe";

export interface StripeSubscription {
  readonly id: string;
  readonly customerId: string;
  readonly status: Stripe.Subscription.Status;
  readonly priceId: string;
  readonly currentPeriodEnd: Date;
  readonly cancelAtPeriodEnd: boolean;
  readonly plan: "free" | "pro" | "enterprise";
}

export interface CheckoutSession {
  readonly url: string;
  readonly sessionId: string;
}

export interface SubscriptionData {
  readonly subscription: StripeSubscription | null;
  readonly plan: string;
}

export interface PortalSession {
  readonly url: string;
}

export type SubscriptionStatus =
  | "active"
  | "canceled"
  | "incomplete"
  | "incomplete_expired"
  | "past_due"
  | "trialing"
  | "unpaid";
