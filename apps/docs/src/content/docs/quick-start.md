---
title: Quick Start
description: Get up and running with Orion Kit
---

## Prerequisites

- Node.js 20+ + pnpm (`npm install -g pnpm`)
- Cloud accounts (all have free tiers):
  - [Neon](https://neon.tech) - PostgreSQL database
  - [Stripe](https://stripe.com) - Payments
  - [Resend](https://resend.com) - Email service
  - [PostHog](https://posthog.com) - Analytics
  - [Axiom](https://axiom.co) - Logging
  - [Trigger.dev](https://trigger.dev) - Background jobs
- [Stripe CLI](https://stripe.com/docs/stripe-cli) - For local webhook testing

## Setup

```bash
# 1. Clone & install
git clone <repo-url>
cd orion
pnpm install

# 2. Get API keys from all services
# See /accounts-setup for detailed instructions:
# - Neon (database)
# - Stripe (payments)
# - Resend (email)
# - PostHog (analytics)
# - Axiom (logging)
# - Trigger.dev (jobs)

# 3. Create env files
cp apps/app/.env.example apps/app/.env.local
cp apps/api/.env.example apps/api/.env.local
cp packages/database/.env.example packages/database/.env

# 4. Add keys to .env files (see below)

# 5. Initialize DB
pnpm db:push

# 6. Start Stripe CLI for webhooks (in new terminal)
stripe listen --forward-to localhost:3002/webhooks

# 7. Start everything
pnpm dev
```

## Environment Variables

**`apps/app/.env.local`:**

```bash
# API
NEXT_PUBLIC_API_URL=http://localhost:3002

# PostHog
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_STRIPE_PRICE_ID_PRO=price_...
NEXT_PUBLIC_STRIPE_PRICE_ID_ENTERPRISE=price_...
```

**`apps/api/.env.local`:**

```bash
# JWT Authentication
AUTH_JWT_SECRET=your-super-secret-key-min-32-chars

# Database
DATABASE_URL=postgresql://...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email (Resend)
RESEND_API_KEY=re_...
FROM_EMAIL=onboarding@resend.dev

# Axiom
AXIOM_TOKEN=xaat-...
AXIOM_DATASET=orion

# Trigger.dev
TRIGGER_SECRET_KEY=tr_dev_...
```

**`packages/database/.env`:**

```bash
DATABASE_URL=postgresql://...
```

> See [Accounts Setup](/accounts-setup) for detailed instructions on getting all API keys.

## Running Apps

| App        | Port | URL                   |
| ---------- | ---- | --------------------- |
| **Web**    | 3000 | http://localhost:3000 |
| **App**    | 3001 | http://localhost:3001 |
| **API**    | 3002 | http://localhost:3002 |
| **Studio** | 3003 | http://localhost:3003 |
| **Docs**   | 3004 | http://localhost:3004 |

Visit http://localhost:3001 → Sign up → Create tasks!

## Commands

```bash
pnpm dev               # Start all apps
pnpm db:push           # Push schema
pnpm db:studio         # Open Studio GUI
pnpm test              # Run tests
pnpm build             # Build for production
```

## Troubleshooting

| Issue            | Fix                                                     |
| ---------------- | ------------------------------------------------------- |
| "Unauthorized"   | Sign in at http://localhost:3001/sign-in                |
| CORS errors      | Check `NEXT_PUBLIC_API_URL` in app/.env.local           |
| DB connection    | Verify `DATABASE_URL` uses pooled connection            |
| Stripe webhooks  | Ensure Stripe CLI is running with `stripe listen`       |
| Missing env vars | Check all services are configured (see /accounts-setup) |

## Next Steps

- [Accounts Setup](/accounts-setup) - Detailed setup for all services
- [Architecture](/architecture) - Understand the system
- [Guides](/guide) - Learn best practices
- [Packages](/packages) - Explore packages

**You're ready!** Start building. 🚀
