---
title: Stripe Payments
description: Complete guide to setting up Stripe subscriptions in Orion Kit
---

# Stripe Payments

Orion Kit includes a full Stripe subscription implementation with checkout, webhooks, billing portal, and multi-plan support. This guide walks you through setup, testing, and production deployment.

## What You'll Build

After setup, users can:

1. View plans on `/dashboard/billing`
2. Click "Upgrade to Pro" → redirect to Stripe Checkout
3. Complete payment → webhook updates database → redirect back with success message
4. Manage subscription in Stripe Customer Portal (cancel, update payment method)

## How It Works

**Flow:**

1. User clicks "Upgrade" → frontend calls `/api/checkout` with `priceId`
2. API creates Stripe Checkout Session → returns session URL
3. User completes payment on Stripe → Stripe sends webhook to `/api/webhooks/stripe`
4. Webhook updates `user_preferences` table with subscription data
5. User redirected back to `/dashboard/billing?success=true`

**Key Parts:**

- **`@workspace/payment`**: Stripe client, checkout, webhook handlers
- **API routes**: `/api/checkout`, `/api/billing-portal`, `/api/webhooks/stripe`
- **Database**: `user_preferences` stores `stripeCustomerId`, `stripeSubscriptionId`, `plan`, etc.
- **Frontend**: Billing page shows current plan, upgrade buttons

## Setup

### 1. Get API Keys

**Where:** [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)

**What to copy:**

- **Publishable key** (starts with `pk_test_`) - used in frontend
- **Secret key** (starts with `sk_test_`) - used in backend

**Add to `apps/api/.env.local`:**

```bash
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_APP_URL=http://localhost:3001  # Where to redirect after payment
```

**Add to `apps/app/.env.local`:**

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 2. Create Subscription Products

**Where:** [Stripe Products Dashboard](https://dashboard.stripe.com/test/products)

**Create two products:**

**Pro Plan:**

- Click **"Add Product"**
- Name: `Pro`
- Description: `Pro plan with 100 tasks`
- Pricing model: **Recurring**
- Price: `$19.00` / month
- Click **Save** → copy the **Price ID** (starts with `price_`)

**Enterprise Plan:**

- Name: `Enterprise`
- Description: `Enterprise plan with unlimited tasks`
- Price: `$99.00` / month
- Copy **Price ID**

**Add to `apps/api/.env.local`:**

```bash
STRIPE_PRICE_ID_PRO=price_1234567890abcdef
STRIPE_PRICE_ID_ENTERPRISE=price_0987654321fedcba
```

**Add to `apps/app/.env.local`:**

```bash
STRIPE_PRICE_ID_PRO=price_1234567890abcdef
STRIPE_PRICE_ID_ENTERPRISE=price_0987654321fedcba
```

> **Why two files?** The API needs Price IDs to create checkout sessions. The frontend needs them to pass to the API when user clicks "Upgrade".

### 3. Setup Webhooks (Local Development)

**Why webhooks?** When a user completes payment on Stripe, Stripe needs to notify your API to update the database. Webhooks are POST requests Stripe sends to your server.

**For local development**, use Stripe CLI to forward webhook events to `localhost`:

**Install Stripe CLI:**

```bash
brew install stripe/stripe-cli/stripe
```

**Login to Stripe:**

```bash
stripe login
# Opens browser → login with your Stripe account
```

**Forward webhooks to local API:**

```bash
stripe listen --forward-to localhost:3002/webhooks/stripe
```

You'll see output like:

```
> Ready! Your webhook signing secret is whsec_1234567890abcdef
```

**Copy the `whsec_...` secret** and add to `apps/api/.env.local`:

```bash
STRIPE_WEBHOOK_SECRET=whsec_1234567890abcdef
```

**Restart the API:**

```bash
pnpm --filter api dev
```

> **Note:** The webhook secret stays the same as long as `stripe listen` is running. If you stop and restart it, you'll get a new secret.

### 4. Enable Customer Portal

**What it does:** Stripe Customer Portal lets users manage their subscription (cancel, update payment method) without you building that UI.

**Enable it:**

1. Go to [Portal Settings](https://dashboard.stripe.com/test/settings/billing/portal)
2. Click **"Activate test link"**
3. Enable features you want (cancel subscription, update payment method, etc.)

Done! Users can now click "Manage Billing" on `/dashboard/billing`.

---

## Testing the Payment Flow

### Test Card

Use Stripe's test card for all test payments:

- **Card number:** `4242 4242 4242 4242`
- **Expiry:** Any future date (e.g., `12/34`)
- **CVC:** Any 3 digits (e.g., `123`)
- **ZIP:** Any 5 digits (e.g., `12345`)

See [Stripe test cards](https://stripe.com/docs/testing#cards) for more scenarios (declined cards, 3D Secure, etc.).

### Complete Test Flow

**1. Start all services** (use 3 terminal windows):

```bash
# Terminal 1: Stripe webhook listener
stripe listen --forward-to localhost:3002/webhooks/stripe

# Terminal 2: API server
pnpm --filter api dev

# Terminal 3: App server
pnpm --filter app dev
```

**2. Test checkout:**

1. Visit http://localhost:3001/sign-up → create test account
2. Go to http://localhost:3001/dashboard/billing
3. Current plan should show "Free"
4. Click **"Upgrade to Pro"**
5. You'll be redirected to Stripe Checkout
6. Fill in test card: `4242 4242 4242 4242`, any expiry/CVC
7. Click **"Subscribe"**
8. Stripe redirects back to `/dashboard/billing?success=true`
9. Plan should now show **"Pro"**

**3. Verify webhook:**

In Terminal 1 (Stripe CLI), you should see:

```
[200] POST /webhooks/stripe [checkout.session.completed]
```

If you see `[400]` or `[500]`, check API logs for errors.

**4. Verify database:**

```bash
pnpm db:studio
# Open user_preferences table
# You should see:
# - plan: "pro"
# - stripeCustomerId: "cus_..."
# - stripeSubscriptionId: "sub_..."
# - stripeSubscriptionStatus: "active"
```

**5. Test Customer Portal:**

1. On `/dashboard/billing`, click **"Manage Billing"**
2. You'll be redirected to Stripe Customer Portal
3. Try canceling subscription → returns to app → plan shows "Free" again

## Troubleshooting

| Issue                                  | Cause                       | Fix                                                                                                                                  |
| -------------------------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| **"STRIPE_SECRET_KEY is not defined"** | Missing API key             | Add `STRIPE_SECRET_KEY` to `apps/api/.env.local` → restart API                                                                       |
| **"priceId is undefined"**             | Missing Price IDs in env    | Add `STRIPE_PRICE_ID_PRO` and `STRIPE_PRICE_ID_ENTERPRISE` to both `apps/api/.env.local` and `apps/app/.env.local` → restart servers |
| **Webhook returns `[400]`**            | Wrong webhook secret        | Copy new `whsec_...` from `stripe listen` output → update `STRIPE_WEBHOOK_SECRET` in `apps/api/.env.local` → restart API             |
| **Webhook returns `[500]`**            | API error (DB, validation)  | Check API terminal for error logs → common cause is missing `DATABASE_URL`                                                           |
| **Plan doesn't update after payment**  | Webhook not running         | Ensure `stripe listen` is running in Terminal 1                                                                                      |
| **Redirect fails after checkout**      | Wrong `NEXT_PUBLIC_APP_URL` | Set to `http://localhost:3001` for local dev                                                                                         |

## Production Deployment

### 1. Switch to Live Mode

In Stripe dashboard (top-right corner), toggle from **Test Mode** to **Live Mode**.

### 2. Get Live API Keys

**Developers** → **API Keys**:

- Copy **Live Publishable Key** (starts with `pk_live_`)
- Copy **Live Secret Key** (starts with `sk_live_`)

### 3. Create Live Products

Repeat product creation from **Setup Step 2**, but in **Live Mode**:

- Create **Pro** plan ($19/month) → copy Price ID
- Create **Enterprise** plan ($99/month) → copy Price ID

### 4. Setup Production Webhooks

**Important:** In production, Stripe sends webhooks directly to your public URL (not through CLI).

1. Go to **Developers** → **Webhooks** → **Add Endpoint**
2. **Endpoint URL:** `https://your-api-domain.com/webhooks/stripe` (e.g., `https://api.yourdomain.com/webhooks/stripe`)
3. **Events to send:** Select these events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Click **Add Endpoint**
5. Copy the **Signing Secret** (starts with `whsec_`)

### 5. Update Environment Variables in Vercel

For each app (`web`, `app`, `api`), go to **Vercel Dashboard** → **Settings** → **Environment Variables**:

**`apps/api` (Production):**

```bash
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_... # from webhook endpoint above
STRIPE_PRICE_ID_PRO=price_... # live Price ID
STRIPE_PRICE_ID_ENTERPRISE=price_... # live Price ID
NEXT_PUBLIC_APP_URL=https://app.yourdomain.com
```

**`apps/app` (Production):**

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_PRICE_ID_PRO=price_... # same live Price ID
STRIPE_PRICE_ID_ENTERPRISE=price_... # same live Price ID
```

### 6. Enable Live Customer Portal

Go to [Live Portal Settings](https://dashboard.stripe.com/settings/billing/portal) → **Activate live link**

### 7. Test with Real Card

Use a real card in test mode first (or your own card). Stripe doesn't charge you for your own subscriptions in test mode.

---

## Further Reading

- [Stripe Testing Guide](https://stripe.com/docs/testing)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Customer Portal](https://stripe.com/docs/billing/subscriptions/integrating-customer-portal)
- [Stripe Security](https://stripe.com/docs/security)
