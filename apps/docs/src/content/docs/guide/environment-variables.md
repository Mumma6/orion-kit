---
title: Environment Variables
description: Environment variables reference
---

# Environment Variables

Quick reference for all required environment variables.

## Required Variables

| App          | Variables                                                            |
| ------------ | -------------------------------------------------------------------- |
| **web**      | Clerk keys (optional), PostHog (optional)                            |
| **app**      | Clerk keys, `NEXT_PUBLIC_API_URL`, Stripe pub key (optional)         |
| **api**      | Clerk keys, `DATABASE_URL`, Stripe keys (optional), Axiom (optional) |
| **database** | `DATABASE_URL`                                                       |
| **studio**   | `DATABASE_URL`                                                       |

## By App

### apps/web/.env.local

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_POSTHOG_KEY=phc_...  # Optional
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com  # Optional
```

### apps/app/.env.local

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_API_URL=http://localhost:3002
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...  # Optional
NEXT_PUBLIC_POSTHOG_KEY=phc_...  # Optional
```

### apps/api/.env.local

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
DATABASE_URL=postgresql://...
STRIPE_SECRET_KEY=sk_test_...  # Optional
STRIPE_WEBHOOK_SECRET=whsec_...  # Optional
NEXT_PUBLIC_STRIPE_PRICE_ID_PRO=price_...  # Optional
NEXT_PUBLIC_STRIPE_PRICE_ID_ENTERPRISE=price_...  # Optional
NEXT_PUBLIC_APP_URL=http://localhost:3001
AXIOM_TOKEN=xaat-...  # Optional
AXIOM_DATASET=orion-logs  # Optional
```

### packages/database/.env + apps/studio/.env.local

```bash
DATABASE_URL=postgresql://...
```

## Key Formats

| Variable       | Format                             | Where to Get                                                  |
| -------------- | ---------------------------------- | ------------------------------------------------------------- |
| Clerk keys     | `pk_test_*` / `sk_test_*`          | [Clerk Dashboard](https://dashboard.clerk.com) → API Keys     |
| Database URL   | `postgresql://...?sslmode=require` | [Neon Console](https://console.neon.tech) → Pooled Connection |
| Stripe keys    | `sk_test_*` / `pk_test_*`          | [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys) |
| Stripe webhook | `whsec_*`                          | `stripe listen` output                                        |
| Stripe prices  | `price_*`                          | Stripe Dashboard → Products → Pricing                         |
| Axiom          | `xaat_*`                           | [Axiom](https://axiom.co/settings/api-tokens) → API Tokens    |
| PostHog        | `phc_*`                            | [PostHog](https://posthog.com/settings/project) → API Keys    |

⚠️ **Important:**

- Use `NEXT_PUBLIC_` prefix for client-accessible variables
- Never commit `.env` files to git
- Use test keys for dev, live keys for production

## Setup

```bash
# Copy env examples
cp apps/web/.env.example apps/web/.env.local
cp apps/app/.env.example apps/app/.env.local
cp apps/api/.env.example apps/api/.env.local
cp packages/database/.env.example packages/database/.env

# Fill in values → restart servers
pnpm dev
```

See [Accounts Setup](/guide/accounts-setup) for detailed instructions.
