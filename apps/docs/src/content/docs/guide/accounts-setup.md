---
title: Cloud Accounts Setup
description: Complete guide to setting up all required cloud services
---

# Cloud Accounts Setup

Orion Kit integrates with several cloud services to provide a complete production-ready stack. Here's how to set up each service.

## Overview

Required services for full functionality:

| Service         | Purpose                          | Required       | Free Tier          |
| --------------- | -------------------------------- | -------------- | ------------------ |
| **Clerk**       | Authentication & user management | ✅ Yes         | ✅ 10,000 MAU      |
| **Neon**        | Serverless Postgres database     | ✅ Yes         | ✅ 0.5GB storage   |
| **Stripe**      | Payments & subscriptions         | ⚠️ Recommended | ✅ No monthly fees |
| **Axiom**       | Logging & observability          | ⚠️ Recommended | ✅ 500MB/month     |
| **PostHog**     | Product analytics                | ⚠️ Recommended | ✅ 1M events/month |
| **Trigger.dev** | Background jobs                  | ⚠️ Optional    | ✅ 100k task runs  |
| **Vercel**      | Deployment & hosting             | ⚠️ Optional    | ✅ Unlimited hobby |

## 🔐 Clerk (Authentication)

### 1. Create Account

1. Go to [clerk.com](https://clerk.com)
2. Sign up with GitHub or email
3. Create a new application

### 2. Configure Application

1. In Clerk Dashboard → **Configure** → **Setup**
2. Select authentication methods (Email, Google, GitHub, etc.)
3. Configure sign-in/sign-up flows
4. Customize appearance (optional)

### 3. Get API Keys

1. Go to **API Keys** in sidebar
2. Copy your keys:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (starts with `pk_test_` or `pk_live_`)
   - `CLERK_SECRET_KEY` (starts with `sk_test_` or `sk_live_`)

### 4. Add to Environment Variables

Add to `apps/web/.env.local`:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

Add to `apps/app/.env.local`:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

Add to `apps/api/.env.local`:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### 5. Test Authentication

```bash
pnpm dev
```

Visit http://localhost:3001/sign-in and create a test account.

---

## 🗄️ Neon (Database)

### 1. Create Account

1. Go to [neon.tech](https://neon.tech)
2. Sign up with GitHub (recommended)
3. Create a new project

### 2. Create Database

1. Choose region (select closest to your users)
2. Name your database (e.g., `orion-dev`)
3. Wait for provisioning (~30 seconds)

### 3. Get Connection String

1. Click **Connection Details**
2. Select **Pooled connection** (recommended for serverless)
3. Copy the connection string

Example:

```
postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
```

### 4. Add to Environment Variables

Add to `packages/database/.env`:

```bash
DATABASE_URL=postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
```

Add to `apps/api/.env.local`:

```bash
DATABASE_URL=postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
```

Add to `apps/studio/.env.local`:

```bash
DATABASE_URL=postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
```

### 5. Initialize Database

```bash
# Push schema to Neon
pnpm db:push

# Seed with example data (optional)
pnpm db:seed
```

### 6. Test Connection

```bash
pnpm db:studio
```

Visit https://local.drizzle.studio to view your database.

---

## 💳 Stripe (Payments)

### 1. Create Account

1. Go to [stripe.com](https://stripe.com)
2. Sign up with email or Google
3. Skip business verification for now (test mode only)

### 2. Create Products

1. Go to **Products** in Stripe Dashboard
2. Click **Add product**

**Pro Plan:**

- Name: `Pro`
- Description: `Professional plan with unlimited tasks`
- Price: `$19/month` recurring
- Copy the **Price ID** (e.g., `price_1ABC123...`)

**Enterprise Plan:**

- Name: `Enterprise`
- Description: `Enterprise plan for large teams`
- Price: `$99/month` recurring
- Copy the **Price ID**

### 3. Get API Keys

1. Go to **Developers** → **API Keys**
2. Copy:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`)

### 4. Add to Environment Variables

Add to `apps/api/.env.local`:

```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PRICE_ID_PRO=price_1ABC123...
STRIPE_PRICE_ID_ENTERPRISE=price_1XYZ789...
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

Add to `apps/app/.env.local`:

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 5. Set Up Webhooks (Local Development)

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to local API
stripe listen --forward-to localhost:3002/webhooks/stripe

# Copy the webhook signing secret (whsec_...)
# Add to apps/api/.env.local:
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 6. Test Subscription

1. Start all services: `pnpm dev`
2. Go to http://localhost:3001/dashboard/billing
3. Click "Upgrade to Pro"
4. Use test card: `4242 4242 4242 4242`
5. Check webhook logs for successful event

---

## 📈 Axiom (Logging)

### 1. Create Account

1. Go to [axiom.co](https://axiom.co)
2. Sign up (free tier: 500MB/month)
3. Create a new dataset (e.g., `orion-logs`)

### 2. Get API Token

1. Go to **Settings** → **API Tokens**
2. Click **Create API Token**
3. Name it (e.g., `Orion API`)
4. Select **Ingest Only** permission
5. Copy the token

### 3. Add to Environment Variables

Add to `apps/api/.env.local`:

```bash
AXIOM_TOKEN=xaat-...
AXIOM_DATASET=orion-logs
```

### 4. Test Logging

Start the API:

```bash
pnpm --filter api dev
```

Make a request and check Axiom dashboard for logs:

```bash
curl http://localhost:3002/health
```

---

## 📊 PostHog (Analytics)

### 1. Create Account

1. Go to [posthog.com](https://posthog.com)
2. Sign up (free tier: 1M events/month)
3. Choose **PostHog Cloud** (recommended)

### 2. Create Project

1. Name your project (e.g., `Orion Kit`)
2. Select your industry/use case
3. Complete onboarding

### 3. Get API Keys

1. Go to **Project Settings** → **API Keys**
2. Copy:
   - **Project API Key** (starts with `phc_`)
   - **Host** (usually `https://us.i.posthog.com` or `https://eu.i.posthog.com`)

### 4. Add to Environment Variables

Add to `apps/web/.env.local`:

```bash
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

Add to `apps/app/.env.local`:

```bash
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

### 5. Test Analytics

Start your apps and visit them. Events should appear in PostHog within a few seconds.

---

## ⚡ Trigger.dev (Background Jobs)

### 1. Create Account

1. Go to [trigger.dev](https://trigger.dev)
2. Sign up with GitHub
3. Create a new project

### 2. Get API Keys

1. Go to your project dashboard
2. Copy:
   - **API Key** (for server-side)
   - **Public API Key** (for client-side, if needed)

### 3. Add to Environment Variables

Add to `apps/api/.env.local` or create `packages/jobs/.env`:

```bash
TRIGGER_API_KEY=tr_dev_...
TRIGGER_API_URL=https://api.trigger.dev
```

### 4. Test Jobs

```bash
# In development mode
pnpm --filter jobs dev
```

Trigger.dev will connect and show available jobs in the dashboard.

---

## ▲ Vercel (Deployment)

### 1. Create Account

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub (recommended)
3. Import your repository

### 2. Configure Projects

You'll need to deploy **3 separate projects**:

#### Project 1: Web (Landing Page)

- **Root Directory**: `apps/web`
- **Framework**: Next.js
- **Environment Variables**: Clerk keys, PostHog keys

#### Project 2: App (Dashboard)

- **Root Directory**: `apps/app`
- **Framework**: Next.js
- **Environment Variables**: Clerk keys, PostHog keys, API URL

#### Project 3: API (Backend)

- **Root Directory**: `apps/api`
- **Framework**: Next.js
- **Environment Variables**: Clerk keys, Database URL, Axiom token

### 3. Add Environment Variables

For each project:

1. Go to **Settings** → **Environment Variables**
2. Add all required variables (see `.env.example` in each app)
3. Select **Production**, **Preview**, and **Development** environments

### 4. Deploy

```bash
# Install Vercel CLI
pnpm install -g vercel

# Deploy
vercel --prod
```

Or push to GitHub (if connected) to auto-deploy.

---

## 📊 Vercel Analytics

Vercel Analytics is automatically enabled if you deploy to Vercel. No additional setup needed!

To enable Speed Insights:

1. Go to your Vercel project
2. Click **Analytics** tab
3. Enable **Web Analytics**
4. Enable **Speed Insights**

---

## 🎯 Environment Variables Checklist

Use this checklist to ensure all variables are set:

### Apps

**`apps/web/.env.local`**

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

**`apps/app/.env.local`**

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_API_URL=http://localhost:3002
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

**`apps/api/.env.local`**

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
DATABASE_URL=postgresql://...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID_PRO=price_...
STRIPE_PRICE_ID_ENTERPRISE=price_...
AXIOM_TOKEN=xaat-...
AXIOM_DATASET=orion-logs
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

### Packages

**`packages/database/.env`**

```bash
DATABASE_URL=postgresql://...
```

**`apps/studio/.env.local`**

```bash
DATABASE_URL=postgresql://...
```

---

## 🚀 Quick Setup Script

For development, you can use this order:

```bash
# 1. Create all accounts (10 minutes)
# - Clerk, Neon, Axiom, PostHog, Trigger.dev

# 2. Copy environment files
cp apps/web/.env.example apps/web/.env.local
cp apps/app/.env.example apps/app/.env.local
cp apps/api/.env.example apps/api/.env.local
cp packages/database/.env.example packages/database/.env

# 3. Fill in all API keys in .env files

# 4. Initialize database
pnpm db:push
pnpm db:seed

# 5. Start development
pnpm dev
```

---

## 🔒 Security Best Practices

### Environment Variables

- ✅ **Never** commit `.env` files to git
- ✅ Use `.env.local` for local development
- ✅ Use separate keys for development and production
- ✅ Rotate keys regularly in production
- ✅ Use Vercel's encrypted environment variables for production

### API Keys

- ✅ Use test/development keys in `.env.local`
- ✅ Use production keys only in Vercel environment variables
- ✅ Restrict API key permissions (use "Ingest Only" for Axiom, etc.)
- ✅ Never expose secret keys in client-side code

---

## 🆘 Troubleshooting

### Clerk Issues

**"Invalid publishable key"**

- Ensure key starts with `pk_test_` or `pk_live_`
- Check that key is in all app `.env.local` files
- Restart dev servers after adding keys

**"User not authenticated"**

- Sign in at http://localhost:3001/sign-in
- Check browser cookies are enabled
- Verify middleware is configured

### Neon Issues

**"Connection refused"**

- Ensure you copied the **pooled connection** string
- Check that `?sslmode=require` is at the end
- Verify database is active in Neon dashboard

**"Schema out of sync"**

- Run `pnpm db:push` to sync schema
- Check `packages/database/drizzle/` for migrations

### Axiom Issues

**"Unauthorized"**

- Verify token starts with `xaat-`
- Check dataset name matches Axiom dashboard
- Ensure token has "Ingest" permission

**"No logs appearing"**

- Wait 10-30 seconds for logs to appear
- Check dataset name is correct
- Verify API is making requests

### PostHog Issues

**"Events not tracked"**

- Check browser console for errors
- Verify keys are in `.env.local`
- Wait 5-10 seconds for events to appear
- Check ad blockers aren't blocking PostHog

### Trigger.dev Issues

**"Failed to connect"**

- Verify API key is correct
- Check `TRIGGER_API_URL` is set
- Ensure project is created in Trigger.dev dashboard

---

## 💰 Cost Estimation

### Free Tier Limits

All services offer generous free tiers suitable for development and small production apps:

**Clerk**

- 10,000 monthly active users (MAU)
- Unlimited sign-ins
- All authentication methods

**Neon**

- 0.5GB storage
- 10 branches
- Unlimited queries (with compute limits)

**Axiom**

- 500MB/month ingestion
- 30-day retention
- Unlimited queries

**PostHog**

- 1M events/month
- Unlimited tracked users
- All features included

**Trigger.dev**

- 100k task runs/month
- All features included

**Vercel**

- Unlimited deployments
- 100GB bandwidth
- Automatic HTTPS

### When You'll Need Paid Plans

**Clerk**: >10k monthly active users (~$25/month for 10k-20k MAU)

**Neon**: >0.5GB storage or need autoscaling (~$19/month)

**Axiom**: >500MB logs/month (~$25/month for 10GB)

**PostHog**: >1M events/month (~$0 for next 1M, then usage-based)

**Trigger.dev**: >100k runs/month (~$29/month for 1M runs)

**Vercel**: Need team features or >100GB bandwidth (~$20/month)

---

## 🎯 Recommended Setup Order

For first-time setup, follow this order:

1. **Clerk** (required to sign in)
2. **Neon** (required for database)
3. **Stripe** (recommended, for subscriptions)
4. **Axiom** (helpful for debugging)
5. **PostHog** (optional, for analytics)
6. **Trigger.dev** (optional, for background jobs)
7. **Vercel** (when ready to deploy)

---

## 🔄 Switching Between Environments

### Development → Staging

1. Create new Clerk application (e.g., "Orion Staging")
2. Create new Neon branch: `pnpm db:branch staging`
3. Create new Axiom dataset: `orion-staging`
4. Update environment variables in Vercel preview environments

### Staging → Production

1. Create production Clerk application
2. Use Neon main branch (or create `production` branch)
3. Create production Axiom dataset: `orion-production`
4. Update Vercel production environment variables
5. Update allowed domains in all services

---

## ✅ Verification Steps

After setup, verify everything works:

```bash
# 1. Start all services
pnpm dev

# 2. Check each service
curl http://localhost:3002/health        # API is running
curl http://localhost:3002/tasks         # Clerk auth works
```

**Manual checks:**

- [ ] Sign up at http://localhost:3001/sign-up
- [ ] View user in Clerk dashboard
- [ ] Create a task in dashboard
- [ ] Verify task in Drizzle Studio (port 3003)
- [ ] Visit billing page at http://localhost:3001/dashboard/billing
- [ ] View pricing plans on landing page
- [ ] Check logs in Axiom dashboard
- [ ] Check events in PostHog dashboard
- [ ] Test Stripe checkout (optional, requires Stripe setup)

---

## 🌍 Production Checklist

Before deploying to production:

- [ ] Create production accounts for all services
- [ ] Use production API keys (not test keys)
- [ ] Update CORS settings in `apps/api/middleware.ts`
- [ ] Set `NEXT_PUBLIC_API_URL` to production API URL
- [ ] Enable SSL/HTTPS everywhere
- [ ] Configure custom domains in Clerk
- [ ] Set up monitoring alerts in Axiom
- [ ] Configure data retention policies
- [ ] Review and accept terms of service for all platforms
- [ ] Add payment methods for services you'll exceed free tier

---

## 📚 Service Documentation

- [Clerk Docs](https://clerk.com/docs)
- [Neon Docs](https://neon.tech/docs)
- [Axiom Docs](https://axiom.co/docs)
- [PostHog Docs](https://posthog.com/docs)
- [Trigger.dev Docs](https://trigger.dev/docs)
- [Vercel Docs](https://vercel.com/docs)

---

## 🆘 Getting Help

If you encounter issues:

1. Check service status pages
2. Review documentation links above
3. Check Orion Kit GitHub issues
4. Contact service support (all have responsive teams)
5. Join service community Slack/Discord channels
