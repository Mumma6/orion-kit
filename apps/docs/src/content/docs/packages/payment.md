---
title: Payment Package
description: Stripe integration for subscriptions and billing
---

# @workspace/payment

Stripe integration package for handling subscriptions, billing, and payments in Orion Kit.

## Features

- ✅ **Stripe Integration** - Complete subscription management
- ✅ **Checkout Sessions** - Hosted checkout pages
- ✅ **Webhooks** - Automatic subscription sync
- ✅ **Customer Portal** - Self-service billing management
- ✅ **Type-safe** - Full TypeScript support
- ✅ **Multiple Plans** - Free, Pro, Enterprise tiers

## Installation

This package is already included in the workspace. To use it in your app:

```json
{
  "dependencies": {
    "@workspace/payment": "workspace:*"
  }
}
```

## Environment Variables

### API (apps/api/.env.local)

```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

### Apps (apps/app/.env.local, apps/web/.env.local)

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

Get your keys from [Stripe Dashboard → Developers → API Keys](https://dashboard.stripe.com/test/apikeys).

## Setup Guide

### 1. Create Stripe Account

1. Go to [stripe.com](https://stripe.com)
2. Sign up with email or Google
3. Complete business verification (for production)

### 2. Create Products and Prices

1. Go to **Products** in Stripe Dashboard
2. Click **Add product**

**Product: Pro Plan**

- Name: `Pro`
- Description: `Professional plan with unlimited tasks`
- Pricing: `$19/month` recurring
- Copy the **Price ID** (starts with `price_`)

**Product: Enterprise Plan**

- Name: `Enterprise`
- Description: `Enterprise plan with unlimited everything`
- Pricing: `$99/month` recurring
- Copy the **Price ID**

### 3. Add Price IDs to Environment Variables

The price IDs are configured via environment variables in `packages/payment/src/config.ts`.

**Important:** Use `NEXT_PUBLIC_` prefix so they're available in client components!

Add to `apps/api/.env.local` and `apps/app/.env.local`:

```bash
NEXT_PUBLIC_STRIPE_PRICE_ID_PRO=price_1ABC123...
NEXT_PUBLIC_STRIPE_PRICE_ID_ENTERPRISE=price_1XYZ789...
```

These are automatically loaded into the `PLANS` configuration.

### 4. Set Up Webhooks

1. Go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Endpoint URL: `https://your-api.vercel.app/webhooks/stripe`
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the **Signing secret** (starts with `whsec_`)

### 5. Test Webhooks Locally

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local API
stripe listen --forward-to localhost:3002/webhooks/stripe

# Copy the webhook signing secret to .env.local
```

### 6. Update Database Schema

```bash
# Generate migration
pnpm --filter @workspace/database db:generate

# Push to database
pnpm db:push
```

## Usage

### Server-Side (API Routes)

```typescript
import {
  createCheckoutSession,
  createBillingPortalSession,
  getSubscription,
} from "@workspace/payment/server"; // Note: /server path

// Create checkout session
const session = await createCheckoutSession(userId, userEmail, priceId);

// Get subscription
const subscription = await getSubscription(subscriptionId);

// Create billing portal session
const portal = await createBillingPortalSession(customerId);
```

### Client-Side (React Components)

```typescript
import { PLANS } from "@workspace/payment"; // Config is exported from main
import { PricingCard } from "@workspace/payment/client"; // Note: /client path
import { useCheckout } from "@/hooks/use-billing";

export function MyPricingPage() {
  const checkout = useCheckout();

  const handleUpgrade = async (priceId: string) => {
    await checkout.mutateAsync(priceId);
    // User will be redirected to Stripe Checkout
  };

  return (
    <div>
      {PLANS.map((plan) => (
        <PricingCard
          key={plan.id}
          plan={plan}
          onSelect={handleUpgrade}
          loading={checkout.isPending}
        />
      ))}
    </div>
  );
}
```

## API Reference

### Server Functions (`@workspace/payment/server`)

#### `createCheckoutSession(userId, userEmail, priceId, options?)`

Creates a Stripe Checkout session for subscription.

**Parameters:**

- `userId: string` - User ID from Clerk
- `userEmail: string` - User's email
- `priceId: string` - Stripe Price ID
- `options?: { successUrl?, cancelUrl? }` - Optional redirect URLs

**Returns:** `Promise<Stripe.Checkout.Session>`

#### `createBillingPortalSession(customerId, returnUrl?)`

Creates a Stripe Customer Portal session.

**Parameters:**

- `customerId: string` - Stripe Customer ID
- `returnUrl?: string` - Optional return URL

**Returns:** `Promise<Stripe.BillingPortal.Session>`

#### `getSubscription(subscriptionId)`

Retrieves subscription details from Stripe.

**Parameters:**

- `subscriptionId: string` - Stripe Subscription ID

**Returns:** `Promise<StripeSubscription | null>`

#### `cancelSubscription(subscriptionId)`

Cancels subscription at period end.

**Parameters:**

- `subscriptionId: string` - Stripe Subscription ID

**Returns:** `Promise<Stripe.Subscription>`

### Configuration

All plans are defined in `packages/payment/src/config.ts`:

```typescript
export const PLANS: readonly PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    maxTasks: 10,
    maxUsers: 1,
    features: [...],
  },
  {
    id: "pro",
    name: "Pro",
    price: 19,
    priceId: process.env.STRIPE_PRICE_ID_PRO,
    maxTasks: -1, // Unlimited
    maxUsers: 5,
    features: [...],
  },
  // ...
];
```

### Webhooks

Webhook handling is in `packages/payment/src/webhooks.ts`:

```typescript
import { handleWebhookEvent } from "@workspace/payment/webhooks";

// In your webhook route
const event = stripe.webhooks.constructEvent(body, sig, secret);
await handleWebhookEvent(event, dbAdapter);
```

The webhook handler automatically:

- ✅ Updates user subscription in database
- ✅ Updates plan tier
- ✅ Handles cancellations
- ✅ Logs all events

## Database Schema

Stripe fields in `user_preferences` table:

```typescript
{
  plan: "free" | "pro" | "enterprise",
  stripeCustomerId: string | null,
  stripeSubscriptionId: string | null,
  stripeSubscriptionStatus: string | null,
  stripePriceId: string | null,
  stripeCurrentPeriodEnd: Date | null,
}
```

## Testing

### Test Mode

Use Stripe test keys (start with `sk_test_` and `pk_test_`).

**Test Cards:**

```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
3D Secure: 4000 0025 0000 3155
```

Use any future expiry date and any CVC.

### Test Webhooks Locally

```bash
# Terminal 1: Start API
pnpm --filter api dev

# Terminal 2: Forward webhooks
stripe listen --forward-to localhost:3002/webhooks/stripe

# Terminal 3: Trigger test events
stripe trigger checkout.session.completed
```

## Subscription Flow

### 1. User Clicks "Upgrade"

```typescript
// Dashboard billing page
const checkout = useCheckout();
await checkout.mutateAsync(priceId);
```

### 2. Redirect to Stripe Checkout

User is redirected to Stripe-hosted checkout page.

### 3. User Completes Payment

Stripe processes payment and subscription.

### 4. Webhook Event Fired

`checkout.session.completed` event sent to your API.

### 5. Database Updated

Webhook handler updates `user_preferences`:

```typescript
await db.update(userPreferences).set({
  plan: "pro",
  stripeCustomerId: "cus_...",
  stripeSubscriptionId: "sub_...",
  stripeSubscriptionStatus: "active",
  // ...
});
```

### 6. User Redirected Back

User returns to `/dashboard/billing?success=true`.

## Customer Portal

Users can manage their subscription via Stripe Customer Portal:

```typescript
const billingPortal = useBillingPortal();
await billingPortal.mutateAsync();
// Redirects to Stripe portal where users can:
// - Update payment method
// - View invoices
// - Cancel subscription
// - Update billing details
```

## Best Practices

### 1. Always Use Webhooks

```typescript
// ❌ Bad - don't trust client-side updates
await checkout.mutateAsync(priceId);
await updateUserPlan("pro"); // Race condition!

// ✅ Good - wait for webhook
await checkout.mutateAsync(priceId);
// Webhook updates plan automatically
```

### 2. Handle All Webhook Events

```typescript
// Always handle these events:
-checkout.session.completed - // New subscription
  customer.subscription.updated - // Plan changes
  customer.subscription.deleted - // Cancellations
  invoice.payment_failed; // Payment issues
```

### 3. Use Metadata

```typescript
// Always add userId to metadata
metadata: {
  userId: "user_123",
},
// This helps identify which user in webhooks
```

### 4. Test in Test Mode

Always test thoroughly in Stripe test mode before going live.

## Security

### Webhook Signature Verification

Always verify webhook signatures:

```typescript
const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
// This prevents fake webhooks!
```

### API Key Security

- ✅ Never expose `STRIPE_SECRET_KEY` in client code
- ✅ Use environment variables
- ✅ Rotate keys if compromised
- ✅ Use separate keys for test/production

## Going to Production

### 1. Switch to Live Mode

In Stripe Dashboard:

- Toggle to **Live mode** (not Test mode)
- Create products and prices again in live mode
- Copy live API keys (`sk_live_...` and `pk_live_...`)

### 2. Update Environment Variables

```bash
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

### 3. Update Webhook Endpoint

Point webhook to production API:

```
https://api.yourapp.com/webhooks/stripe
```

### 4. Test Everything

- Test checkout flow
- Test successful payment
- Test failed payment
- Test subscription cancellation
- Test billing portal

## Monitoring

### Stripe Dashboard

Monitor:

- Recent payments
- Active subscriptions
- Failed payments
- Webhook delivery status

### Axiom Logs

All Stripe operations are logged:

```typescript
logger.info("Checkout session created", {
  userId,
  priceId,
  sessionId,
});
```

## Troubleshooting

### "Invalid API key"

- Check key starts with `sk_test_` or `sk_live_`
- Verify key is in correct `.env.local` file
- Restart dev server after adding key

### "No signature found"

- Webhook secret is incorrect
- Check `STRIPE_WEBHOOK_SECRET` in `.env.local`
- Use `stripe listen` secret for local development

### "Price ID not found"

- Verify price ID in Stripe Dashboard
- Check you're using correct mode (test vs live)
- Ensure price is active

### Webhooks Not Firing

- Check webhook endpoint is correct
- Verify webhook is enabled in Stripe
- Check webhook logs in Stripe Dashboard
- Use `stripe listen` for local testing

## Learn More

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Checkout](https://stripe.com/docs/payments/checkout)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Stripe Customer Portal](https://stripe.com/docs/billing/subscriptions/integrating-customer-portal)
- [Stripe Testing](https://stripe.com/docs/testing)
