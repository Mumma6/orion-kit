---
title: Environment Variables
---

Quick reference for all required environment variables.

## Required Variables

| App          | Variables                                                                                                |
| ------------ | -------------------------------------------------------------------------------------------------------- |
| **web**      | PostHog (optional)                                                                                       |
| **app**      | `NEXT_PUBLIC_API_URL`, Stripe pub key (optional), PostHog (optional)                                     |
| **api**      | `AUTH_JWT_SECRET`, `DATABASE_URL`, App URLs, Stripe keys (optional), Resend (optional), Axiom (optional) |
| **database** | `DATABASE_URL`                                                                                           |
| **studio**   | `DATABASE_URL`                                                                                           |

## By App

### apps/web/.env.local

```bash
NEXT_PUBLIC_POSTHOG_KEY=phc_...  # Optional
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com  # Optional
```

### apps/app/.env.local

```bash
NEXT_PUBLIC_API_URL=http://localhost:3002
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...  # Optional
NEXT_PUBLIC_STRIPE_PRICE_ID_PRO=price_...  # Optional
NEXT_PUBLIC_STRIPE_PRICE_ID_ENTERPRISE=price_...  # Optional
NEXT_PUBLIC_POSTHOG_KEY=phc_...  # Optional
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com  # Optional
NEXT_PUBLIC_AXIOM_TOKEN=xaat-...  # Optional
NEXT_PUBLIC_AXIOM_DATASET=orion-kit  # Optional
```

### apps/api/.env.local

```bash
DATABASE_URL=postgresql://...
AUTH_JWT_SECRET=your-super-secret-key-min-32-chars
NEXT_PUBLIC_APP_URL=http://localhost:3001
NEXT_PUBLIC_API_URL=http://localhost:3002
STRIPE_SECRET_KEY=sk_test_...  # Optional
STRIPE_WEBHOOK_SECRET=whsec_...  # Optional
RESEND_API_KEY=re_...  # Optional
FROM_EMAIL=onboarding@resend.dev  # Optional
NEXT_PUBLIC_AXIOM_TOKEN=xaat-...  # Optional
NEXT_PUBLIC_AXIOM_DATASET=orion-kit  # Optional
```

### packages/database/.env + apps/studio/.env.local

```bash
DATABASE_URL=postgresql://...
```

## Key Formats

| Variable       | Format                               | Where to Get                                                  |
| -------------- | ------------------------------------ | ------------------------------------------------------------- |
| JWT Secret     | `your-super-secret-key-min-32-chars` | Generate your own secure random string (32+ characters)       |
| Database URL   | `postgresql://...?sslmode=require`   | [Neon Console](https://console.neon.tech) → Pooled Connection |
| Stripe keys    | `sk_test_*` / `pk_test_*`            | [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys) |
| Stripe webhook | `whsec_*`                            | `stripe listen` output                                        |
| Stripe prices  | `price_*`                            | Stripe Dashboard → Products → Pricing                         |
| Resend API     | `re_*`                               | [Resend](https://resend.com/api-keys) → API Keys              |
| Axiom          | `xaat_*`                             | [Axiom](https://axiom.co/settings/api-tokens) → API Tokens    |
| PostHog        | `phc_*`                              | [PostHog](https://posthog.com/settings/project) → API Keys    |

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
