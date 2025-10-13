---
title: Deployment Guide
description: Deploy Orion Kit to production on Vercel
---

# Deployment Guide

Complete guide to deploying Orion Kit to production on Vercel.

## Overview

Orion Kit consists of 3 separate Next.js applications that need to be deployed independently:

1. **Landing Page** (`apps/web`) - Marketing site
2. **Dashboard** (`apps/app`) - Main application
3. **API** (`apps/api`) - Backend API

**Important:** `apps/studio` (Drizzle Studio) is **development-only** and should NOT be deployed to production.

---

## Prerequisites

Before deploying, ensure you have:

- [ ] [Vercel account](https://vercel.com/signup)
- [ ] GitHub repository with your code
- [ ] Production accounts for all services (Clerk, Neon, Stripe, etc.)
- [ ] Production API keys ready

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────┐
│              Vercel Projects                    │
│                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌────────┐│
│  │   web        │  │    app       │  │  api   ││
│  │ (Landing)    │  │ (Dashboard)  │  │ (API)  ││
│  │              │  │              │  │        ││
│  │ *.vercel.app │  │ *.vercel.app │  │ *.app  ││
│  └──────────────┘  └──────────────┘  └────────┘│
│         │                  │              │     │
└─────────┼──────────────────┼──────────────┼─────┘
          │                  │              │
          └──────────────────┴──────────────┘
                             │
                   ┌─────────▼─────────┐
                   │   Neon Database   │
                   │   (Production)    │
                   └───────────────────┘
```

---

## Step 1: Prepare Production Services

### 1.1 Create Production Database

**Neon:**

1. Go to [Neon Console](https://console.neon.tech)
2. Create new project: `orion-production`
3. Copy **Pooled Connection** string
4. Save for later: `DATABASE_URL`

### 1.2 Create Production Auth

**Clerk:**

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Create new application: `Orion Production`
3. Configure allowed domains:
   - Add your production domains
   - Add Vercel preview domains: `*.vercel.app`
4. Copy API keys:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (starts with `pk_live_`)
   - `CLERK_SECRET_KEY` (starts with `sk_live_`)

### 1.3 Create Production Stripe

**Stripe:**

1. Switch to **Live Mode** in [Stripe Dashboard](https://dashboard.stripe.com)
2. Create products (same as test mode):
   - Pro Plan ($19/month)
   - Enterprise Plan ($99/month)
3. Copy **live** API keys:
   - `STRIPE_SECRET_KEY` (starts with `sk_live_`)
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (starts with `pk_live_`)
4. Copy Price IDs:
   - `NEXT_PUBLIC_STRIPE_PRICE_ID_PRO`
   - `NEXT_PUBLIC_STRIPE_PRICE_ID_ENTERPRISE`

### 1.4 Create Production Webhooks

**Stripe Webhooks:**

1. Go to [Webhooks](https://dashboard.stripe.com/webhooks) (Live Mode)
2. Click **Add endpoint**
3. URL: `https://YOUR-API-DOMAIN.vercel.app/webhooks/stripe` (update after API deployment)
4. Events to send:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy signing secret: `STRIPE_WEBHOOK_SECRET` (starts with `whsec_`)

### 1.5 Production Observability (Optional)

**Axiom:**

1. Create dataset: `orion-production`
2. Create API token with **Ingest** permission
3. Copy: `AXIOM_TOKEN`, `AXIOM_DATASET`

**PostHog:**

1. Create new project: `Orion Production`
2. Copy: `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`

---

## Step 2: Deploy to Vercel

### 2.1 Connect GitHub Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. **Don't deploy yet!** We need to configure each app separately.

### 2.2 Deploy Project 1: API (Backend)

**Why first?** Other apps need the API URL.

1. In Vercel, click **Import** again
2. Select your repository
3. Configure:
   - **Project Name**: `orion-api` (or similar)
   - **Framework**: Next.js
   - **Root Directory**: `apps/api`
   - **Build Command**: Leave default
   - **Install Command**: `pnpm install`

4. **Environment Variables** (click "Add"):

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...

# Database
DATABASE_URL=postgresql://...

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PRICE_ID_PRO=price_...
NEXT_PUBLIC_STRIPE_PRICE_ID_ENTERPRISE=price_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# App URL (will update after app deployment)
NEXT_PUBLIC_APP_URL=https://orion-app.vercel.app

# Observability (optional)
AXIOM_TOKEN=xaat-...
AXIOM_DATASET=orion-production
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

5. Select environments for each variable:
   - ✅ Production
   - ✅ Preview
   - ⬜ Development (optional)

6. Click **Deploy**
7. Wait for deployment to complete
8. **Copy the deployment URL**: `https://orion-api-xxx.vercel.app`

### 2.3 Update Stripe Webhook

Now that we have the API URL:

1. Go back to [Stripe Webhooks](https://dashboard.stripe.com/webhooks)
2. Edit your webhook endpoint
3. Update URL to: `https://YOUR-ACTUAL-API-URL.vercel.app/webhooks/stripe`
4. Save changes

### 2.4 Deploy Project 2: Dashboard App

1. In Vercel, click **Add New** → **Project**
2. Select your repository
3. Configure:
   - **Project Name**: `orion-app`
   - **Framework**: Next.js
   - **Root Directory**: `apps/app`

4. **Environment Variables**:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...

# Database (needed for middleware)
DATABASE_URL=postgresql://...

# API URL (use the URL from Step 2.2)
NEXT_PUBLIC_API_URL=https://orion-api-xxx.vercel.app

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_PRICE_ID_PRO=price_...
STRIPE_PRICE_ID_ENTERPRISE=price_...

# Observability (optional)
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

5. Click **Deploy**
6. **Copy the deployment URL**: `https://orion-app-xxx.vercel.app`

### 2.5 Update API Environment Variables

Now update the API with the actual app URL:

1. Go to API project in Vercel
2. **Settings** → **Environment Variables**
3. Find `NEXT_PUBLIC_APP_URL`
4. Update value to: `https://orion-app-xxx.vercel.app`
5. Click **Save**
6. Redeploy: **Deployments** → Latest → **...** → **Redeploy**

### 2.6 Deploy Project 3: Landing Page

1. In Vercel, click **Add New** → **Project**
2. Select your repository
3. Configure:
   - **Project Name**: `orion-web`
   - **Framework**: Next.js
   - **Root Directory**: `apps/web`

4. **Environment Variables**:

```bash
# Clerk (optional for landing)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...

# Analytics (optional)
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

5. Click **Deploy**

---

## Step 3: Configure Custom Domains (Optional)

### 3.1 Add Custom Domains

For each project:

1. Go to project in Vercel
2. **Settings** → **Domains**
3. Add your domain:
   - Web: `www.yourapp.com` or `yourapp.com`
   - App: `app.yourapp.com`
   - API: `api.yourapp.com`
4. Follow Vercel's DNS instructions

### 3.2 Update Environment Variables

After adding custom domains, update:

**API Project:**

```bash
NEXT_PUBLIC_APP_URL=https://app.yourapp.com
```

**App Project:**

```bash
NEXT_PUBLIC_API_URL=https://api.yourapp.com
```

**Redeploy all projects** after updating.

### 3.3 Update Clerk Domains

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. **Configure** → **Domains**
3. Add your custom domains
4. Update Allowed Origins

### 3.4 Update Stripe Webhook

1. Go to [Stripe Webhooks](https://dashboard.stripe.com/webhooks)
2. Update endpoint URL to: `https://api.yourapp.com/webhooks/stripe`

---

## Step 4: Database Migration

Push your schema to production database:

```bash
# Set production DATABASE_URL in terminal
export DATABASE_URL="postgresql://production-url..."

# Push schema
pnpm db:push

# Optional: Seed initial data
pnpm db:seed
```

**Tip:** Don't seed production with test data!

---

## Environment Variables Reference

### Required for ALL Apps

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
```

### API (`apps/api`)

```bash
# Required
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
DATABASE_URL=postgresql://...
NEXT_PUBLIC_APP_URL=https://app.yourapp.com

# Stripe (Required)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PRICE_ID_PRO=price_...
NEXT_PUBLIC_STRIPE_PRICE_ID_ENTERPRISE=price_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Observability (Optional)
AXIOM_TOKEN=xaat-...
AXIOM_DATASET=orion-production
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

### App (`apps/app`)

```bash
# Required
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
DATABASE_URL=postgresql://...
NEXT_PUBLIC_API_URL=https://api.yourapp.com

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_PRICE_ID_PRO=price_...
STRIPE_PRICE_ID_ENTERPRISE=price_...

# Analytics (Optional)
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

### Web (`apps/web`)

```bash
# Optional
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...

# Analytics (Optional)
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

---

## Troubleshooting

### "Unauthorized" errors

**Check:**

- Clerk keys are production keys (`pk_live_`, `sk_live_`)
- Domains are configured in Clerk dashboard
- Cookies are being set correctly

### Database connection errors

**Check:**

- Using **pooled connection** string from Neon
- Connection string ends with `?sslmode=require`
- Database exists and schema is pushed

### Stripe webhooks failing

**Check:**

- Webhook URL is correct (with your actual domain)
- Webhook secret is from the production endpoint
- All required events are selected

### CORS errors

**Check:**

- `NEXT_PUBLIC_APP_URL` is set correctly in API
- No trailing slashes in URLs
- Middleware CORS configuration allows your domains

### Build failures

**Check:**

- All required environment variables are set
- Root directory is correct (`apps/api`, `apps/app`, `apps/web`)
- Install command is `pnpm install`

---

## Step 5: Update CORS Configuration

**Important:** Update CORS settings to allow your production domains.

### Update API Middleware

Edit `apps/api/middleware.ts`:

```typescript
// Replace localhost with your production domain
"Access-Control-Allow-Origin": "https://app.yourapp.com"  // Not localhost!
```

### Update API Next Config

Edit `apps/api/next.config.mjs`:

```typescript
headers: [
  {
    key: "Access-Control-Allow-Origin",
    value: "https://app.yourapp.com", // Your production domain
  },
];
```

**Tip:** For multiple domains, use environment variables:

```typescript
"Access-Control-Allow-Origin": process.env.NEXT_PUBLIC_APP_URL
```

---

## Production Checklist

Before going live:

- [ ] All three apps deployed successfully
- [ ] Custom domains configured (optional)
- [ ] Database schema pushed to production
- [ ] CORS updated to production domains
- [ ] Clerk production app configured with correct domains
- [ ] Stripe webhook configured with production URL
- [ ] All environment variables set correctly
- [ ] Tested sign up flow
- [ ] Tested payment flow
- [ ] Tested webhook delivery
- [ ] Verified logs in Axiom (if enabled)
- [ ] Verified analytics in PostHog (if enabled)
- [ ] Set up monitoring alerts

---

## Monitoring & Maintenance

### Check Deployment Health

1. **API Health**: Visit `https://api.yourapp.com/health`
2. **Logs**: Check Vercel logs or Axiom
3. **Errors**: Monitor Vercel errors
4. **Analytics**: Check PostHog for user behavior

### Regular Maintenance

- Review Vercel bills monthly
- Check Neon database usage
- Rotate API keys quarterly
- Update dependencies monthly
- Review and clean logs

---

## Learn More

- [Vercel Documentation](https://vercel.com/docs)
- [Environment Variables Guide](/guide/environment-variables)
- [Cloud Services Setup](/guide/accounts-setup)
- [Stripe Webhooks](/guide/stripe-payments)

---

## Quick Deployment Summary

```bash
# 1. Create production services (Clerk, Neon, Stripe)
# 2. Deploy in order:
#    a. API first (get URL)
#    b. App second (needs API URL)
#    c. Web last
# 3. Update Stripe webhook URL
# 4. Push database schema
# 5. Test everything!
```

**Estimated deployment time:** 30-60 minutes for first-time setup
