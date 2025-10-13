---
title: Cloud Accounts Setup
description: Complete setup guide for all cloud services used in Orion Kit
---

# Cloud Accounts Setup

Orion Kit uses cloud services for authentication, database, payments, and monitoring. This guide walks you through creating accounts and configuring each service.

## Overview

| Service     | What It Does           | Used Where            | Free Tier    | Required?      |
| ----------- | ---------------------- | --------------------- | ------------ | -------------- |
| **Clerk**   | User auth & management | All Next.js apps      | 10k MAU      | ✅ Yes         |
| **Neon**    | Postgres database      | API + Database schema | 0.5GB        | ✅ Yes         |
| **Stripe**  | Subscription payments  | Billing page          | No fees      | ⚠️ For billing |
| **Axiom**   | Structured logging     | API error tracking    | 500MB/month  | Optional       |
| **PostHog** | Product analytics      | User behavior         | 1M events/mo | Optional       |
| **Vercel**  | Hosting                | Production deploy     | Unlimited    | For prod       |

---

## 🔐 Clerk (Required)

### What It Does

Clerk handles all user authentication, session management, and user profiles. It provides pre-built UI components for sign-in, sign-up, and user settings.

### How It's Used in Orion Kit

- **`@workspace/auth`**: Exports Clerk components and middleware
- **Sign-in/Sign-up pages**: Pre-built auth flows at `/sign-in` and `/sign-up`
- **Protected routes**: Middleware checks authentication for `/dashboard/*`
- **User data**: Access `userId` and `user` object in Server Components and API routes

### Setup

**1. Create Clerk Account**

- Go to [clerk.com](https://clerk.com)
- Sign up (free plan = 10k monthly active users)
- Create a new application (choose "Next.js")

**2. Get API Keys**

- In Clerk dashboard → **API Keys**
- Copy `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (starts with `pk_test_`)
- Copy `CLERK_SECRET_KEY` (starts with `sk_test_`)

**3. Configure Environment Variables**

Add to **all three apps** (`.env.local`):

- `apps/web/.env.local`
- `apps/app/.env.local`
- `apps/api/.env.local`

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

**4. Test Authentication**

```bash
pnpm dev
# Visit http://localhost:3001/sign-up
# Create test account
# You should be redirected to /dashboard
```

---

## 🗄️ Neon (Required)

### What It Does

Neon is a serverless Postgres database with autoscaling, branching, and a generous free tier. It stores all application data (tasks, user preferences, subscriptions).

### How It's Used in Orion Kit

- **`@workspace/database`**: Drizzle ORM schema and connection
- **Database tables**: `tasks`, `user_preferences` (stores subscription data)
- **Accessed from**: API routes in `apps/api/app/*`
- **Type-safe queries**: Drizzle generates TypeScript types from schema

### Setup

**1. Create Neon Account**

- Go to [neon.tech](https://neon.tech)
- Sign up with GitHub (free tier = 0.5GB storage)
- Create a new project (choose region closest to you)

**2. Get Connection String**

- In project dashboard → **Connection Details**
- **IMPORTANT**: Select **"Pooled connection"** (required for serverless)
- Copy the connection string (starts with `postgresql://`)

**3. Configure Environment Variables**

Add to these files:

- `packages/database/.env`
- `apps/api/.env.local`
- `apps/studio/.env.local`

```bash
DATABASE_URL=postgresql://user:password@host.neon.tech/neondb?sslmode=require
```

**4. Initialize Database Schema**

Push the Drizzle schema to Neon:

```bash
pnpm db:push
```

This creates the `tasks` and `user_preferences` tables.

**5. Verify Database**

Open Drizzle Studio to view your database:

```bash
pnpm db:studio
# Opens https://local.drizzle.studio
# You should see empty 'tasks' and 'user_preferences' tables
```

---

## 💳 Stripe (Required for Billing)

### What It Does

Stripe handles subscription payments, billing, and customer management. It processes payments for Pro and Enterprise plans.

### How It's Used in Orion Kit

- **`@workspace/payment`**: Stripe SDK wrapper and webhook handlers
- **Billing page**: `/dashboard/billing` shows plans and subscription status
- **API routes**: `/checkout` creates payment sessions, `/webhooks/stripe` handles events
- **Database sync**: Webhooks update `user_preferences` with subscription data

### Setup

**1. Create Stripe Account**

- Go to [stripe.com](https://stripe.com)
- Sign up (test mode = no fees, live mode = standard fees)
- Enable **Test Mode** (toggle in top-right)

**2. Create Products**

In Stripe dashboard → **Products** → **Add Product**:

**Pro Plan:**

- Name: `Pro`
- Price: `$19/month` (recurring)
- Copy the **Price ID** (starts with `price_`)

**Enterprise Plan:**

- Name: `Enterprise`
- Price: `$99/month` (recurring)
- Copy the **Price ID**

**3. Get API Keys**

In **Developers** → **API Keys**:

- Copy **Publishable key** (starts with `pk_test_`)
- Copy **Secret key** (starts with `sk_test_`)

**4. Configure Environment Variables**

Add to `apps/api/.env.local`:

```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PRICE_ID_PRO=price_... # from Pro product
STRIPE_PRICE_ID_ENTERPRISE=price_... # from Enterprise product
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

Add to `apps/app/.env.local`:

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

**5. Setup Webhooks (Local Development)**

Install Stripe CLI:

```bash
brew install stripe/stripe-cli/stripe
```

Login and forward webhooks:

```bash
stripe login
stripe listen --forward-to localhost:3002/webhooks/stripe
```

Copy the **webhook signing secret** (starts with `whsec_`) and add to `apps/api/.env.local`:

```bash
STRIPE_WEBHOOK_SECRET=whsec_...
```

**6. Test Payment Flow**

```bash
pnpm dev
# Visit http://localhost:3001/dashboard/billing
# Click "Upgrade to Pro"
# Use test card: 4242 4242 4242 4242
# Any future date, any CVC
# Complete checkout
# You should be redirected back with success message
```

See [Stripe Payments Guide](/guide/stripe-payments) for production setup and webhook configuration.

---

## 📈 Axiom (Optional)

### What It Does

Axiom is a serverless logging platform for structured logs, errors, and performance metrics. It provides queryable logs without the cost of traditional logging services.

### How It's Used in Orion Kit

- **`@workspace/observability`**: Axiom client and logger utilities
- **API logging**: All API routes log requests, errors, and performance
- **Structured data**: Logs are JSON-formatted with context (userId, route, status)
- **View logs**: Visit [axiom.co](https://axiom.co) → your dataset to query logs

### Setup

**1. Create Axiom Account**

- Go to [axiom.co](https://axiom.co)
- Sign up (free tier = 500MB/month)

**2. Create Dataset**

- In dashboard → **Datasets** → **Create Dataset**
- Name: `orion-logs` (or any name you prefer)

**3. Create API Token**

- **Settings** → **API Tokens** → **Create Token**
- Select **Ingest Only** permission
- Copy the token (starts with `xaat-`)

**4. Configure Environment Variables**

Add to `apps/api/.env.local`:

```bash
AXIOM_TOKEN=xaat-...
AXIOM_DATASET=orion-logs
```

**5. Test Logging**

```bash
pnpm dev
# Make any API request (e.g., create a task)
# Visit axiom.co → your dataset
# You should see log entries with request details
```

---

## 📊 PostHog (Optional)

### What It Does

PostHog is an open-source product analytics platform. It tracks user events, page views, and feature usage without sending data to third parties.

### How It's Used in Orion Kit

- **`@workspace/analytics`**: PostHog provider and tracking utilities
- **Auto-tracking**: Page views, clicks, and sessions
- **Custom events**: Track task creation, subscription upgrades, etc.
- **View analytics**: Visit [posthog.com](https://posthog.com) → your project dashboard

### Setup

**1. Create PostHog Account**

- Go to [posthog.com](https://posthog.com)
- Sign up (cloud or self-hosted, free tier = 1M events/month)

**2. Get API Keys**

- In dashboard → **Project Settings**
- Copy **Project API Key** (starts with `phc_`)
- Copy **Host URL** (usually `https://us.i.posthog.com` or `https://eu.i.posthog.com`)

**3. Configure Environment Variables**

Add to `apps/web/.env.local` and `apps/app/.env.local`:

```bash
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

**4. Test Analytics**

```bash
pnpm dev
# Visit http://localhost:3001
# Navigate a few pages, create a task
# Visit posthog.com → Activity
# You should see events appearing in real-time
```

---

## ⚡ Trigger.dev (Optional)

### What It Does

Trigger.dev runs background jobs and scheduled tasks without managing infrastructure. It handles retries, logging, and monitoring.

### How It's Used in Orion Kit

- **`@workspace/jobs`**: Job definitions and scheduled tasks
- **Example jobs**:
  - `example-job.ts`: One-time job triggered via API
  - `schedule.ts`: Daily cleanup job (demo of scheduled tasks)
- **View jobs**: Visit [trigger.dev](https://trigger.dev) → Runs to see job execution history

### Setup

**1. Create Trigger.dev Account**

- Go to [trigger.dev](https://trigger.dev)
- Sign up (free tier included)
- Create a project

**2. Get API Key**

- In project dashboard → **Environments**
- Copy **Development API Key** (starts with `tr_dev_`)

**3. Configure Environment Variables**

Add to `packages/jobs/.env`:

```bash
TRIGGER_API_KEY=tr_dev_...
TRIGGER_API_URL=https://api.trigger.dev # (usually default)
```

**4. Test Jobs** (optional, jobs are demo-only in Orion Kit)

```bash
# Start Trigger.dev dev server
cd packages/jobs
pnpm trigger:dev

# In another terminal, trigger a job via API
# Jobs appear in trigger.dev dashboard
```

---

## ▲ Vercel (For Production)

### What It Does

Vercel is the deployment platform for Next.js apps. It provides serverless hosting, automatic deployments, and edge functions.

### How It's Used in Orion Kit

- **Three apps deployed**: `web` (marketing), `app` (dashboard), `api` (backend)
- **Automatic deployments**: Push to `main` branch = production deploy
- **Environment variables**: Set in Vercel dashboard for each app

See the [Deployment Guide](/guide/deployment) for complete deployment instructions.

## Quick Setup

```bash
# 1. Create accounts (15 min total)
# 2. Copy env files
cp apps/web/.env.example apps/web/.env.local
cp apps/app/.env.example apps/app/.env.local
cp apps/api/.env.example apps/api/.env.local
cp packages/database/.env.example packages/database/.env

# 3. Fill in API keys
# 4. Initialize
pnpm db:push
pnpm dev
```

## Verification

```bash
pnpm dev
# Visit http://localhost:3001/sign-up
# Create task in dashboard
# Check Drizzle Studio: pnpm db:studio
```

**Troubleshooting?** Check service docs: [Clerk](https://clerk.com/docs) · [Neon](https://neon.tech/docs) · [Stripe](https://stripe.com/docs)
