---
title: Stripe Payments
description: Complete guide to setting up and testing Stripe payments in Orion Kit
---

# Stripe Payments Guide

This guide covers everything you need to know about integrating Stripe payments in Orion Kit, from setup to testing.

## Overview

Orion Kit includes a complete Stripe integration for subscription-based payments:

- ✅ Checkout sessions
- ✅ Customer portal for managing subscriptions
- ✅ Webhook handling for real-time updates
- ✅ Multiple pricing plans (Free, Pro, Enterprise)
- ✅ Automatic database sync

---

## Prerequisites

Before you start, make sure you have:

1. A [Stripe account](https://dashboard.stripe.com/register) (test mode is fine)
2. Stripe CLI installed: `brew install stripe/stripe-cli/stripe`
3. Your Stripe API keys

---

## Step 1: Get Your Stripe API Keys

### 1. Login to Stripe Dashboard

Go to [https://dashboard.stripe.com/test/apikeys](https://dashboard.stripe.com/test/apikeys)

### 2. Copy Your Keys

You'll see two keys:

- **Publishable key** - Starts with `pk_test_...` (safe to expose in frontend)
- **Secret key** - Starts with `sk_test_...` (keep secret!)

### 3. Add to Environment Variables

**`apps/api/.env.local`:**

```bash
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

**`apps/app/.env.local`:**

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

## Step 2: Create Products and Prices

### 1. Go to Products

Visit [https://dashboard.stripe.com/test/products](https://dashboard.stripe.com/test/products)

### 2. Create Pro Plan

1. Click **"+ Add product"**
2. Name: `Pro`
3. Description: `For professionals and small teams`
4. Pricing model: `Standard pricing`
5. Price: `$19.00`
6. Billing period: `Monthly`
7. Click **"Save product"**
8. Copy the **Price ID** (starts with `price_...`)

### 3. Create Enterprise Plan

Repeat the above steps with:

- Name: `Enterprise`
- Price: `$99.00`
- Copy the **Price ID**

### 4. Add Price IDs to Environment Variables

**`apps/api/.env.local`:**

```bash
NEXT_PUBLIC_STRIPE_PRICE_ID_PRO=price_...
NEXT_PUBLIC_STRIPE_PRICE_ID_ENTERPRISE=price_...
```

**`apps/app/.env.local`:**

```bash
STRIPE_PRICE_ID_PRO=price_...
STRIPE_PRICE_ID_ENTERPRISE=price_...
```

⚠️ **Important:** Price IDs must have `NEXT_PUBLIC_` prefix to work in client components!

---

## Step 3: Set Up Webhooks (Local Development)

Webhooks allow Stripe to notify your app when payments succeed.

### 1. Install Stripe CLI

```bash
brew install stripe/stripe-cli/stripe
```

### 2. Login to Stripe

```bash
stripe login
```

This opens your browser for authentication.

### 3. Start Webhook Listener

**Option A: Using npm script (recommended)**

```bash
pnpm stripe:listen-dev
```

**Option B: Direct command**

```bash
stripe listen --forward-to localhost:3002/webhooks/stripe
```

You'll see output like:

```
> Ready! Your webhook signing secret is whsec_abc123xyz... (^C to quit)
```

**Copy the `whsec_...` secret!**

### 4. Add Webhook Secret to Environment

**`apps/api/.env.local`:**

```bash
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 5. Restart API Server

Environment variables are only loaded at startup:

```bash
# Stop API server (Ctrl+C) and restart:
pnpm --filter api dev
```

---

## Do I Need a New Webhook Secret Every Time?

**No!** The webhook secret (`whsec_...`) stays the same **as long as `stripe listen` is running**.

### When you NEED a new secret:

- ❌ You stopped `stripe listen` and restarted it → **Same secret**
- ❌ You restart your API server → **Same secret**
- ✅ You close terminal and start a completely new `stripe listen` session → **New secret**

### Best Practice:

Keep `stripe listen` running in a dedicated terminal tab during development. You only need to update `STRIPE_WEBHOOK_SECRET` once per development session.

---

## Step 4: Enable Stripe Customer Portal

The Customer Portal allows users to manage their subscriptions.

### 1. Go to Customer Portal Settings

[https://dashboard.stripe.com/test/settings/billing/portal](https://dashboard.stripe.com/test/settings/billing/portal)

### 2. Click "Activate test link"

### 3. Configure Features (Optional)

Choose what users can do:

- ✅ Update payment method
- ✅ Cancel subscription
- ✅ View invoices
- ⬜ Update subscription (switch plans)

Click **"Save"**

---

## Step 5: Complete Environment Setup

Here's what your **complete** `.env.local` files should look like:

### `apps/api/.env.local`

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Database
DATABASE_URL=postgresql://...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PRICE_ID_PRO=price_...
NEXT_PUBLIC_STRIPE_PRICE_ID_ENTERPRISE=price_...
NEXT_PUBLIC_APP_URL=http://localhost:3001
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Observability (optional)
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com
NEXT_PUBLIC_AXIOM_TOKEN=xaat-...
NEXT_PUBLIC_AXIOM_DATASET=orion-kit
NEXT_PUBLIC_API_URL=http://localhost:3002
```

### `apps/app/.env.local`

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Database
DATABASE_URL=postgresql://...

# API URL
NEXT_PUBLIC_API_URL=http://localhost:3002

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PRICE_ID_PRO=price_...
STRIPE_PRICE_ID_ENTERPRISE=price_...

# Observability (optional)
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com
NEXT_PUBLIC_AXIOM_TOKEN=xaat-...
NEXT_PUBLIC_AXIOM_DATASET=orion-kit
```

---

## Testing Payments

### Test Card Numbers

Stripe provides test cards for different scenarios:

| Card Number           | Scenario                               |
| --------------------- | -------------------------------------- |
| `4242 4242 4242 4242` | ✅ Successful payment                  |
| `4000 0025 0000 3155` | ✅ Requires authentication (3D Secure) |
| `4000 0000 0000 9995` | ❌ Declined (insufficient funds)       |
| `4000 0000 0000 0002` | ❌ Declined (card declined)            |

**For any test card:**

- **Expiry:** Any future date (e.g., `12/34`)
- **CVC:** Any 3 digits (e.g., `123`)
- **ZIP:** Any 5 digits (e.g., `12345`)

### Testing the Complete Flow

#### 1. Start All Services

You need **3 terminal windows**:

**Terminal 1 - Webhook Listener:**

```bash
pnpm stripe:listen
```

**Terminal 2 - API Server:**

```bash
pnpm --filter api dev
```

**Terminal 3 - App Server:**

```bash
pnpm --filter app dev
```

#### 2. Navigate to Billing

Open `http://localhost:3001/dashboard/billing`

#### 3. Click "Upgrade to Pro"

You'll be redirected to Stripe Checkout

#### 4. Fill in Payment Details

```
Email: test@example.com
Card number: 4242 4242 4242 4242
MM/YY: 12/34
CVC: 123
Name: Test User
```

#### 5. Complete Payment

Click **"Pay"**

#### 6. Verify Webhook

In Terminal 1 (webhook listener), you should see:

```
--> checkout.session.completed [evt_abc123]
<-- [200] POST http://localhost:3002/webhooks/stripe [evt_abc123]
--> customer.subscription.created [evt_def456]
<-- [200] POST http://localhost:3002/webhooks/stripe [evt_def456]
```

✅ Green `[200]` means webhook succeeded!

#### 7. Check Database

Your user should now have:

- ✅ `plan: "pro"`
- ✅ `stripeCustomerId: "cus_..."`
- ✅ `stripeSubscriptionId: "sub_..."`
- ✅ `stripeSubscriptionStatus: "active"`

You can verify in Drizzle Studio:

```bash
pnpm db:studio
# Open http://localhost:4983
```

#### 8. Test Customer Portal

Back in `/dashboard/billing`, click **"Manage Billing"**

You should be redirected to Stripe Customer Portal where you can:

- View invoices
- Update payment method
- Cancel subscription

---

## Troubleshooting

### "priceId is undefined"

**Problem:** Price IDs not showing in frontend

**Solution:** Make sure price IDs have `NEXT_PUBLIC_` prefix:

```bash
# ❌ Wrong
STRIPE_PRICE_ID_PRO=price_...

# ✅ Correct
NEXT_PUBLIC_STRIPE_PRICE_ID_PRO=price_...
```

Restart servers after changing env vars!

---

### "STRIPE_WEBHOOK_SECRET is not defined"

**Problem:** Webhook secret missing or not loaded

**Solution:**

1. Make sure `stripe listen` is running
2. Copy the `whsec_...` secret it prints
3. Add to `apps/api/.env.local`:
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```
4. Restart API server

---

### "Invalid price ID" or "Product ID not found"

**Problem:** Using Product ID (`prod_...`) instead of Price ID (`price_...`)

**Solution:**

1. Go to [Stripe Products](https://dashboard.stripe.com/test/products)
2. Click on your product
3. Under "Pricing", copy the **Price ID** (starts with `price_...`)
4. Update `.env.local` files

---

### Webhook shows `[400]` or `[500]`

**Problem:** Webhook failed to process

**Check Terminal 2 (API logs)** for error messages.

**Common causes:**

- Missing `userPreferences` in database (should auto-create now)
- Invalid price ID
- Database connection issues

**Fix:** Check API logs and database connection

---

### "No Stripe customer found"

**Problem:** User hasn't subscribed yet

**Solution:** Subscribe to a plan first, then use Customer Portal

**Note:** This is expected behavior! Users need an active subscription to access the billing portal.

---

## Production Setup

### 1. Switch to Live Mode

In Stripe Dashboard, toggle from **"Test mode"** to **"Live mode"**

### 2. Get Live API Keys

Same process as test keys, but they'll start with:

- `pk_live_...` (publishable)
- `sk_live_...` (secret)

### 3. Create Production Webhook

1. Go to [Webhooks](https://dashboard.stripe.com/webhooks)
2. Click **"+ Add endpoint"**
3. URL: `https://your-api-domain.com/webhooks/stripe`
4. Events to send:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Click **"Add endpoint"**
6. Copy the **Signing secret** (starts with `whsec_...`)

### 4. Update Production Environment Variables

In Vercel (or your hosting platform):

```bash
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_... (from webhook endpoint)
NEXT_PUBLIC_STRIPE_PRICE_ID_PRO=price_... (live price)
NEXT_PUBLIC_STRIPE_PRICE_ID_ENTERPRISE=price_... (live price)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
NEXT_PUBLIC_APP_URL=https://your-app-domain.com
```

---

## Testing Checklist

Before deploying to production, verify:

- [ ] Test checkout flow with `4242 4242 4242 4242`
- [ ] Verify webhook receives `checkout.session.completed`
- [ ] Confirm database updates with subscription data
- [ ] Test customer portal access
- [ ] Try canceling and reactivating subscription
- [ ] Test failed payment with `4000 0000 0000 9995`
- [ ] Verify error handling and user feedback

---

## Learn More

- [Stripe Testing Documentation](https://stripe.com/docs/testing)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [Stripe Test Cards](https://stripe.com/docs/testing#cards)
- [Orion Kit Environment Variables](/guide/environment-variables/)

---

## Quick Reference

### Development Commands

```bash
# Start webhook listener
pnpm stripe:listen-dev

# Run API server
pnpm --filter api dev

# Run app server
pnpm --filter app dev

# Open Drizzle Studio
pnpm db:studio
```

### Test Card

```
Card: 4242 4242 4242 4242
Expiry: 12/34
CVC: 123
ZIP: 12345
```

### Webhook Events

| Event                           | When                       |
| ------------------------------- | -------------------------- |
| `checkout.session.completed`    | User completes checkout    |
| `customer.subscription.created` | New subscription created   |
| `customer.subscription.updated` | Subscription modified      |
| `customer.subscription.deleted` | Subscription canceled      |
| `invoice.payment_succeeded`     | Recurring payment succeeds |
| `invoice.payment_failed`        | Payment fails              |

---

**Need help?** Check the [troubleshooting section](#troubleshooting) or open an issue on GitHub.
