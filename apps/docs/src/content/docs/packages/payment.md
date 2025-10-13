---
title: "@workspace/payment"
description: Stripe subscription payments and billing
---

# @workspace/payment

This package handles all Stripe subscription logic: checkout sessions, webhooks, billing portal access, and plan management.

## What It Does

**Payment package provides:**

- **Checkout sessions**: Create Stripe Checkout URLs for subscription purchases
- **Webhooks**: Sync subscription data from Stripe to your database automatically
- **Billing portal**: Let users manage subscriptions (cancel, update payment method)
- **Plan configuration**: Define pricing tiers (Free, Pro, Enterprise)

**Where it's used:**

- **`apps/api/app/checkout/route.ts`**: Creates Stripe Checkout sessions
- **`apps/api/app/billing-portal/route.ts`**: Opens Stripe Customer Portal
- **`apps/api/app/webhooks/stripe/route.ts`**: Receives Stripe events, updates DB
- **`apps/app/components/billing/`**: Displays pricing cards and subscription status
- **`packages/database/src/schema/user-preferences.ts`**: Stores subscription data

## How It Works

1. **User clicks "Upgrade to Pro"** → frontend calls `/api/checkout` with `priceId`
2. **API creates Stripe Checkout Session** → returns session URL
3. **User completes payment on Stripe** → redirects back to app
4. **Stripe sends webhook** to `/api/webhooks/stripe`
5. **Webhook handler updates database** → user's `plan` changes to `"pro"`
6. **User sees updated plan** on `/dashboard/billing`

## Setup

See [Stripe Payments Guide](/guide/stripe-payments) for complete setup instructions.

**Quick setup:**

1. Get Stripe API keys from [dashboard](https://dashboard.stripe.com/test/apikeys)
2. Create products (Pro $19/mo, Enterprise $99/mo) → copy Price IDs
3. Add env vars (see guide)
4. Set up webhooks: `stripe listen --forward-to localhost:3002/webhooks/stripe`

## Usage in Orion Kit

### Create Checkout Session (API Route)

**`apps/api/app/checkout/route.ts`:**

```typescript
import { auth } from "@workspace/auth/server";
import { createCheckoutSession } from "@workspace/payment/server";

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { priceId } = await request.json();

  // Get user email from Clerk
  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress;

  // Create Stripe Checkout Session
  const session = await createCheckoutSession(userId, email, priceId);

  return NextResponse.json({ url: session.url });
}
```

### Frontend (Billing Page)

**`apps/app/components/billing/index.tsx`:**

```typescript
import { PLANS } from "@workspace/payment/config";
import { useCheckout, useBillingPortal } from "@/hooks/use-billing";

export const BillingContent = () => {
  const checkout = useCheckout();
  const billingPortal = useBillingPortal();

  const handleUpgrade = async (priceId: string) => {
    // Calls /api/checkout → gets Stripe URL → redirects
    await checkout.mutateAsync(priceId);
  };

  const handleManageBilling = async () => {
    // Calls /api/billing-portal → opens Customer Portal
    await billingPortal.mutateAsync();
  };

  return (
    <div>
      {PLANS.map((plan) => (
        <PricingCard
          key={plan.id}
          plan={plan}
          onUpgrade={() => handleUpgrade(plan.priceId)}
        />
      ))}
      <button onClick={handleManageBilling}>Manage Billing</button>
    </div>
  );
};
```

### Webhook Handler (Syncs DB)

**`apps/api/app/webhooks/stripe/route.ts`:**

```typescript
import { handleWebhookEvent } from "@workspace/payment/webhooks";
import { db, userPreferences } from "@workspace/database";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const body = await request.text();

  // Verify webhook signature
  const event = stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET
  );

  // Handle event → updates user_preferences table
  await handleWebhookEvent(event, {
    updateSubscription: async (userId, data) => {
      await db
        .update(userPreferences)
        .set(data)
        .where(eq(userPreferences.userId, userId));
    },
  });

  return NextResponse.json({ received: true });
}
```

## API Reference

### Server (`@workspace/payment/server`)

**`createCheckoutSession(userId, email, priceId, options?)`**

- Creates a Stripe Checkout Session
- Returns: `{ id, url }` - redirect user to `url`
- Options: `{ successUrl?, cancelUrl? }`

**`createBillingPortalSession(customerId, returnUrl?)`**

- Opens Stripe Customer Portal for subscription management
- Returns: `{ url }` - redirect user to `url`

**`getSubscription(subscriptionId)`**

- Retrieves subscription details from Stripe
- Returns: `StripeSubscription` object with status, plan, period end

**`cancelSubscription(subscriptionId)`**

- Cancels subscription at period end (not immediately)
- User keeps access until current period ends

### Config (`@workspace/payment/config`)

**`PLANS`** - Array of pricing plans:

```typescript
export const PLANS = [
  { id: "free", name: "Free", price: 0, maxTasks: 10 },
  {
    id: "pro",
    name: "Pro",
    price: 19,
    priceId: env.STRIPE_PRICE_ID_PRO,
    maxTasks: 100,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 99,
    priceId: env.STRIPE_PRICE_ID_ENTERPRISE,
    maxTasks: -1,
  },
];
```

**`getPlanByPriceId(priceId)`** - Get plan config from Stripe Price ID

### Webhooks (`@workspace/payment/webhooks`)

**`handleWebhookEvent(event, dbAdapter)`**

- Handles Stripe webhook events
- Auto-syncs subscription data to database
- Events handled: `checkout.session.completed`, `customer.subscription.*`

## Database Schema

Subscription data is stored in `user_preferences` table:

| Field                      | Type     | Description                                          |
| -------------------------- | -------- | ---------------------------------------------------- |
| `plan`                     | `string` | Current plan: `"free"`, `"pro"`, or `"enterprise"`   |
| `stripeCustomerId`         | `string` | Stripe customer ID (starts with `cus_`)              |
| `stripeSubscriptionId`     | `string` | Stripe subscription ID (starts with `sub_`)          |
| `stripeSubscriptionStatus` | `string` | Status: `"active"`, `"canceled"`, `"past_due"`, etc. |
| `stripePriceId`            | `string` | Stripe price ID (starts with `price_`)               |
| `stripeCurrentPeriodEnd`   | `Date`   | When current billing period ends                     |

**Example:**

```typescript
{
  userId: "user_123",
  plan: "pro",
  stripeCustomerId: "cus_abc123",
  stripeSubscriptionId: "sub_xyz789",
  stripeSubscriptionStatus: "active",
  stripePriceId: "price_1234567890",
  stripeCurrentPeriodEnd: new Date("2025-11-13"),
}
```

## Testing

**Test card:** `4242 4242 4242 4242`

- Expiry: any future date
- CVC: any 3 digits
- ZIP: any 5 digits

**Test flow:**

1. Start `stripe listen` in terminal
2. Visit `/dashboard/billing`
3. Click "Upgrade to Pro"
4. Use test card
5. Complete checkout
6. Verify webhook received `[200]` in terminal
7. Check `pnpm db:studio` → `user_preferences` → `plan` should be `"pro"`

See [Stripe Payments Guide](/guide/stripe-payments) for complete testing instructions.

## Production Deployment

1. **Switch to Live Mode** in Stripe dashboard
2. **Use live keys:** `sk_live_*` and `pk_live_*`
3. **Create webhook endpoint** at your production API URL
4. **Update environment variables** in Vercel with live keys
5. **Test with real card** before going live

See [Deployment Guide](/guide/deployment) for full production setup.

## Further Reading

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [Stripe Testing Cards](https://stripe.com/docs/testing#cards)
- [Customer Portal](https://stripe.com/docs/billing/subscriptions/integrating-customer-portal)
