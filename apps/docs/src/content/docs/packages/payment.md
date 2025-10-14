---
title: Payment Package
description: Stripe subscription payments and billing
---

Complete Stripe integration for subscription billing with checkout sessions, webhooks, billing portal, and plan management.

## What's Included

### 📦 Package Structure

```
packages/payment/src/
├── config.ts      # Pricing plans (Free, Pro, Enterprise)
├── server.ts      # Server-side Stripe functions
├── client.tsx     # React components (PricingCard, SubscriptionBadge)
├── webhooks.ts    # Webhook event handlers
├── types.ts       # TypeScript interfaces
├── billing.ts     # Zod schemas for validation
└── index.ts       # Main exports
```

### 🎯 Core Features

- **✅ Checkout Sessions** - Create Stripe Checkout URLs for subscriptions
- **✅ Webhook Handlers** - Auto-sync subscription data to database
- **✅ Billing Portal** - Let users manage subscriptions (cancel, update payment)
- **✅ Plan Configuration** - Define pricing tiers with features
- **✅ React Components** - Ready-to-use PricingCard and SubscriptionBadge
- **✅ Type Safety** - Full TypeScript support with Zod validation
- **✅ Utility Functions** - Plan lookup, upgrade logic, status helpers

### 📍 Where It's Used

- **`apps/api/app/checkout/route.ts`** - Creates Stripe Checkout sessions
- **`apps/api/app/billing-portal/route.ts`** - Opens Stripe Customer Portal
- **`apps/api/app/webhooks/stripe/route.ts`** - Receives Stripe events, updates DB
- **`apps/app/components/billing/`** - Displays pricing cards and subscription status
- **`packages/database/src/schema/user-preferences.ts`** - Stores subscription data

## How It Works

1. **User clicks "Upgrade to Pro"** → frontend calls `/api/checkout` with `priceId`
2. **API creates Stripe Checkout Session** → returns session URL
3. **User completes payment on Stripe** → redirects back to app
4. **Stripe sends webhook** to `/api/webhooks/stripe`
5. **Webhook handler updates database** → user's `plan` changes to `"pro"`
6. **User sees updated plan** on `/dashboard/billing`

## Setup

### 1. Stripe Configuration

1. Get API keys from [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Create products in Stripe:
   - **Pro Plan**: $19/month → copy Price ID
   - **Enterprise Plan**: $49/month → copy Price ID
3. Add environment variables:

```bash
# apps/api/.env.local
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# apps/app/.env.local
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_STRIPE_PRICE_ID_PRO=price_...
NEXT_PUBLIC_STRIPE_PRICE_ID_ENTERPRISE=price_...
```

### 2. Webhook Setup

```bash
# Install Stripe CLI
npm install -g stripe-cli

# Login to Stripe
stripe login

# Forward webhooks to local API
stripe listen --forward-to localhost:3002/webhooks/stripe

# Copy webhook secret to .env.local
```

### 3. Database Schema

Subscription data is stored in `user_preferences` table:

```sql
-- Auto-created by Drizzle
CREATE TABLE user_preferences (
  plan VARCHAR(50) DEFAULT 'free',
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  stripe_subscription_status VARCHAR(50),
  stripe_price_id VARCHAR(255),
  stripe_current_period_end TIMESTAMP
);
```

## API Reference

### Server Functions (`@workspace/payment/server`)

**`createCheckoutSession(userId, email, priceId, options?)`**

Creates Stripe Checkout Session for subscription:

```typescript
import { createCheckoutSession } from "@workspace/payment/server";

const session = await createCheckoutSession(
  userId,
  "user@example.com",
  "price_1234567890",
  {
    successUrl: "https://app.com/success",
    cancelUrl: "https://app.com/cancel",
  }
);

// Returns: { id, url } - redirect user to session.url
```

**`createBillingPortalSession(customerId, returnUrl?)`**

Opens Stripe Customer Portal:

```typescript
import { createBillingPortalSession } from "@workspace/payment/server";

const session = await createBillingPortalSession(
  "cus_1234567890",
  "https://app.com/billing"
);

// Returns: { url } - redirect user to session.url
```

**`getSubscription(subscriptionId)`**

Retrieves subscription details:

```typescript
import { getSubscription } from "@workspace/payment/server";

const subscription = await getSubscription("sub_1234567890");

// Returns: StripeSubscription | null
```

### Plan Configuration (`@workspace/payment/config`)

**`PLANS`** - Array of pricing plans:

```typescript
import { PLANS, getPlanById, canUpgrade } from "@workspace/payment/config";

// Get all plans
console.log(PLANS); // [{ id: "free", name: "Free", price: 0, ... }, ...]

// Get specific plan
const proPlan = getPlanById("pro");

// Check if user can upgrade
const canUpgradeToPro = canUpgrade("free", "pro"); // true
```

**Available plans:**

- **Free**: $0/month, 10 tasks, 1 user
- **Pro**: $19/month, unlimited tasks, 5 users, popular
- **Enterprise**: $49/month, unlimited everything, SSO

### React Components (`@workspace/payment/client`)

**`PricingCard`** - Ready-to-use pricing card:

```typescript
import { PricingCard } from "@workspace/payment/client";
import { PLANS } from "@workspace/payment/config";

export function BillingPage() {
  return (
    <div className="grid grid-cols-3 gap-6">
      {PLANS.map((plan) => (
        <PricingCard
          key={plan.id}
          plan={plan}
          current={userPlan === plan.id}
          onSelect={handleUpgrade}
          loading={isLoading}
        />
      ))}
    </div>
  );
}
```

**`SubscriptionBadge`** - Status indicator:

```typescript
import { SubscriptionBadge } from "@workspace/payment/client";

<SubscriptionBadge status="active" />     // Green "Active"
<SubscriptionBadge status="past_due" />   // Yellow "Past Due"
<SubscriptionBadge status="canceled" />   // Red "Canceled"
```

### Webhook Handlers (`@workspace/payment/webhooks`)

**`handleWebhookEvent(event, dbAdapter)`**

Processes Stripe webhook events:

```typescript
import { handleWebhookEvent } from "@workspace/payment/webhooks";
import { db, userPreferences } from "@workspace/database";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const body = await request.text();

  const event = stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET
  );

  await handleWebhookEvent(event, {
    updateUserSubscription: async (data) => {
      await db
        .update(userPreferences)
        .set(data)
        .where(eq(userPreferences.clerkUserId, data.userId));
    },
    cancelUserSubscription: async (userId) => {
      await db
        .update(userPreferences)
        .set({ plan: "free" })
        .where(eq(userPreferences.clerkUserId, userId));
    },
  });

  return Response.json({ received: true });
}
```

**Handled events:**

- `checkout.session.completed` - New subscription
- `customer.subscription.updated` - Plan changes
- `customer.subscription.deleted` - Cancellation
- `invoice.payment_succeeded` - Successful payment
- `invoice.payment_failed` - Failed payment

## Types & Validation

### TypeScript Types (`@workspace/payment/types`)

```typescript
import type {
  StripeSubscription,
  CheckoutSession,
  SubscriptionData,
  PortalSession
} from "@workspace/payment/types";

// StripeSubscription - Full subscription object
interface StripeSubscription {
  id: string;
  customerId: string;
  status: "active" | "canceled" | "past_due" | ...;
  priceId: string;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  plan: "free" | "pro" | "enterprise";
}

// CheckoutSession - Checkout response
interface CheckoutSession {
  url: string;
  sessionId: string;
}
```

### Zod Schemas (`@workspace/payment/billing`)

```typescript
import { createCheckoutSessionInputSchema } from "@workspace/payment/billing";

// Validate checkout input
const validated = createCheckoutSessionInputSchema.parse({
  priceId: "price_1234567890",
  successUrl: "https://app.com/success",
  cancelUrl: "https://app.com/cancel",
});
```

## Testing

### Test Cards

Use these cards in Stripe test mode:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires 3D Secure**: `4000 0025 0000 3155`

Any future expiry date, any CVC, any ZIP.

### Test Flow

1. Start `stripe listen --forward-to localhost:3002/webhooks/stripe`
2. Visit `/dashboard/billing`
3. Click "Upgrade to Pro"
4. Use test card `4242 4242 4242 4242`
5. Complete checkout
6. Verify webhook received `[200]` in terminal
7. Check `pnpm db:studio` → `user_preferences` → `plan` should be `"pro"`

## Production Deployment

1. **Switch to Live Mode** in Stripe dashboard
2. **Use live keys:** `sk_live_*` and `pk_live_*`
3. **Create webhook endpoint** at your production API URL
4. **Update environment variables** in Vercel with live keys
5. **Test with real card** before going live

## Package Exports

```typescript
// Main exports
import { PLANS, getPlanById } from "@workspace/payment";

// Server functions
import { createCheckoutSession } from "@workspace/payment/server";

// React components
import { PricingCard } from "@workspace/payment/client";

// Webhook handlers
import { handleWebhookEvent } from "@workspace/payment/webhooks";

// Configuration
import { PLANS } from "@workspace/payment/config";
```

## Further Reading

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [Stripe Testing Cards](https://stripe.com/docs/testing#cards)
- [Customer Portal](https://stripe.com/docs/billing/subscriptions/integrating-customer-portal)
