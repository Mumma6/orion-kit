import type Stripe from "stripe";
import { stripe } from "./server";
import { getPlanByPriceId } from "./config";

export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): Stripe.Event {
  return stripe.webhooks.constructEvent(payload, signature, secret);
}

export interface WebhookDatabaseAdapter {
  updateUserSubscription: (data: {
    userId: string;
    stripeCustomerId: string;
    stripeSubscriptionId: string;
    stripeSubscriptionStatus: string;
    stripePriceId: string;
    stripeCurrentPeriodEnd: Date;
    plan: string;
  }) => Promise<void>;

  cancelUserSubscription: (userId: string) => Promise<void>;
}

export async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session,
  db: WebhookDatabaseAdapter
): Promise<void> {
  const userId = session.metadata?.userId || session.client_reference_id;

  if (!userId) {
    throw new Error("No userId in session metadata");
  }

  const subscriptionId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription?.id;

  if (!subscriptionId) {
    throw new Error("No subscription ID in session");
  }

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const priceId = subscription.items.data[0]?.price.id;
  const plan = priceId ? getPlanByPriceId(priceId) : null;

  if (!priceId || !plan) {
    throw new Error("Invalid price ID or plan not found");
  }

  await db.updateUserSubscription({
    userId,
    stripeCustomerId: subscription.customer as string,
    stripeSubscriptionId: subscription.id,
    stripeSubscriptionStatus: subscription.status,
    stripePriceId: priceId,
    stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
    plan: plan.id,
  });
}

export async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription,
  db: WebhookDatabaseAdapter
): Promise<void> {
  const userId = subscription.metadata?.userId;

  if (!userId) {
    console.warn("No userId in subscription metadata");
    return;
  }

  const priceId = subscription.items.data[0]?.price.id;
  const plan = priceId ? getPlanByPriceId(priceId) : null;

  if (!priceId || !plan) {
    throw new Error("Invalid price ID or plan not found");
  }

  await db.updateUserSubscription({
    userId,
    stripeCustomerId: subscription.customer as string,
    stripeSubscriptionId: subscription.id,
    stripeSubscriptionStatus: subscription.status,
    stripePriceId: priceId,
    stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
    plan: plan.id,
  });
}

export async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription,
  db: WebhookDatabaseAdapter
): Promise<void> {
  const userId = subscription.metadata?.userId;

  if (!userId) {
    console.warn("No userId in subscription metadata");
    return;
  }

  await db.cancelUserSubscription(userId);
}

export async function handleWebhookEvent(
  event: Stripe.Event,
  db: WebhookDatabaseAdapter
): Promise<void> {
  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutCompleted(
        event.data.object as Stripe.Checkout.Session,
        db
      );
      break;

    case "customer.subscription.updated":
      await handleSubscriptionUpdated(
        event.data.object as Stripe.Subscription,
        db
      );
      break;

    case "customer.subscription.deleted":
      await handleSubscriptionDeleted(
        event.data.object as Stripe.Subscription,
        db
      );
      break;

    case "invoice.payment_succeeded":
      console.log("Payment succeeded:", event.data.object.id);
      break;

    case "invoice.payment_failed":
      console.log("Payment failed:", event.data.object.id);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
}
