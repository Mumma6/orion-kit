---
title: Deployment Guide
description: Complete guide to deploying Orion Kit to production on Vercel
---

# Deployment Guide

This guide walks you through deploying Orion Kit's three Next.js apps (`web`, `app`, `api`) to Vercel. You'll set up production services, configure environment variables, and verify the deployment.

## Overview

**What You'll Deploy:**

- **`apps/web`**: Marketing/landing page (public)
- **`apps/app`**: Dashboard app with tasks and billing (authenticated)
- **`apps/api`**: Backend API for tasks, subscriptions, webhooks

**What NOT to deploy:**

- **`apps/studio`**: Drizzle Studio (local development only)
- **`apps/docs`**: Documentation site (optional, deploy separately if needed)

**Deployment order:** API first → App second → Web third (app needs API URL, web is independent)

## Prerequisites

Before deploying, you need:

1. **GitHub repository** with your Orion Kit code (push your local repo)
2. **Vercel account** (free plan is fine, sign up at [vercel.com](https://vercel.com))
3. **Production API keys** from cloud services:
   - Clerk (live keys, not test)
   - Neon (production database)
   - Stripe (live mode, products created)
   - Axiom, PostHog (optional, but recommended for production monitoring)

## Step-by-Step Deployment

### Step 1: Setup Production Cloud Services

You'll need **production** (live) API keys, not test/development keys.

**1. Neon (Production Database)**

- Create a **new project** in [Neon](https://neon.tech) (separate from your dev database)
- Name it `orion-production` or similar
- Copy the **Pooled Connection** URL (starts with `postgresql://`)
- **Run migration:**
  ```bash
  export DATABASE_URL="postgresql://your-production-url..."
  pnpm db:push
  ```
  This creates `tasks` and `user_preferences` tables in production DB.

**2. Clerk (Production Auth)**

- In [Clerk dashboard](https://clerk.com), create a **new application** (or switch existing app to production)
- **Add production domains** (after deployment, you'll update this):
  - Go to **Domains** → add your Vercel domains (e.g., `app.vercel.app`, `api.vercel.app`)
- Copy **Live API Keys**:
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (starts with `pk_live_`)
  - `CLERK_SECRET_KEY` (starts with `sk_live_`)

**3. Stripe (Live Mode)**

- In [Stripe dashboard](https://dashboard.stripe.com), toggle to **Live Mode** (top-right)
- **Create products** (Pro and Enterprise plans) → copy Price IDs
- **Get live API keys** (**Developers** → **API Keys**):
  - Publishable key (starts with `pk_live_`)
  - Secret key (starts with `sk_live_`)
- **Webhook setup** (important, do this AFTER deploying API):
  - **Developers** → **Webhooks** → **Add Endpoint**
  - URL: `https://YOUR-API-DOMAIN.vercel.app/webhooks/stripe` (you'll get this URL after deploying API)
  - Events: `checkout.session.completed`, `customer.subscription.*`
  - Copy **Signing Secret** (starts with `whsec_`)

**4. Axiom (Optional, but Recommended)**

- Create a **production dataset** in [Axiom](https://axiom.co) (e.g., `orion-production`)
- Create API token → copy `AXIOM_TOKEN`

**5. PostHog (Optional)**

- Create a **production project** in [PostHog](https://posthog.com)
- Copy API key and host URL

---

### Step 2: Deploy API to Vercel

Deploy the API first because the app needs to know the API URL.

**1. Create New Project in Vercel**

- Go to [Vercel Dashboard](https://vercel.com/dashboard)
- Click **Add New** → **Project**
- Import your GitHub repository
- Vercel will detect a monorepo

**2. Configure API Project**

- **Project Name:** `orion-api` (or your preferred name)
- **Framework Preset:** Next.js
- **Root Directory:** `apps/api` ← **IMPORTANT: Select this from dropdown**
- **Build Command:** Leave default (`next build`)
- **Output Directory:** Leave default (`.next`)

**3. Add Environment Variables**

Click **Environment Variables** and add these (from Step 1):

```bash
# Clerk (required)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...

# Database (required)
DATABASE_URL=postgresql://your-production-neon-url...

# Stripe (required)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...  # You'll update this after setting up webhook
STRIPE_PRICE_ID_PRO=price_...
STRIPE_PRICE_ID_ENTERPRISE=price_...

# App URL (required, temporarily use placeholder)
NEXT_PUBLIC_APP_URL=https://placeholder.vercel.app  # Update after deploying app

# Logging (optional but recommended)
AXIOM_TOKEN=xaat-...
AXIOM_DATASET=orion-production
```

**4. Deploy**

- Click **Deploy**
- Wait ~2 minutes for build to complete
- **Copy the deployment URL** (e.g., `https://orion-api-abc123.vercel.app`)

**5. Update Stripe Webhook**

- Go to Stripe dashboard → **Developers** → **Webhooks** → **Add Endpoint**
- **Endpoint URL:** `https://orion-api-abc123.vercel.app/webhooks/stripe` (your actual API URL)
- Select events: `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`
- Copy the **Signing Secret** (starts with `whsec_`)
- Back in Vercel → **Settings** → **Environment Variables** → update `STRIPE_WEBHOOK_SECRET`
- **Redeploy** the API (Vercel → **Deployments** → three dots → **Redeploy**)

---

### Step 3: Deploy App to Vercel

**1. Create New Project**

- Vercel Dashboard → **Add New** → **Project**
- Import same GitHub repo

**2. Configure App Project**

- **Project Name:** `orion-app`
- **Root Directory:** `apps/app` ← **IMPORTANT**

**3. Add Environment Variables**

```bash
# Clerk (required)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...

# Database (required)
DATABASE_URL=postgresql://your-production-neon-url...

# API URL (required, use URL from Step 2)
NEXT_PUBLIC_API_URL=https://orion-api-abc123.vercel.app

# Stripe (required)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_PRICE_ID_PRO=price_...
STRIPE_PRICE_ID_ENTERPRISE=price_...

# Analytics (optional)
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

**4. Deploy**

- Click **Deploy**
- **Copy the deployment URL** (e.g., `https://orion-app-xyz789.vercel.app`)

**5. Update API's App URL**

- Go to API project in Vercel → **Settings** → **Environment Variables**
- Update `NEXT_PUBLIC_APP_URL` to your actual app URL: `https://orion-app-xyz789.vercel.app`
- **Redeploy** the API

---

### Step 4: Deploy Web (Marketing Site)

**1. Create New Project**

- Vercel Dashboard → **Add New** → **Project**
- Import same GitHub repo

**2. Configure Web Project**

- **Project Name:** `orion-web`
- **Root Directory:** `apps/web` ← **IMPORTANT**

**3. Add Environment Variables** (minimal, web is mostly static)

```bash
# Analytics (optional)
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com

# Clerk (optional, if you have auth on marketing site)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
```

**4. Deploy**

- Click **Deploy**
- **Copy the deployment URL** (e.g., `https://orion-web-def456.vercel.app`)

---

### Step 5: Update Clerk Domains

**1. Add Production Domains to Clerk**

- Go to Clerk dashboard → your production app → **Domains**
- Add these domains:
  - `orion-app-xyz789.vercel.app` (your app URL)
  - `orion-api-abc123.vercel.app` (your API URL)
  - `orion-web-def456.vercel.app` (your web URL, if using Clerk there)

---

### Step 6: Test Production Deployment

**1. Visit your app:** `https://orion-app-xyz789.vercel.app`

**2. Test signup flow:**

- Click **Sign Up** → create account
- Should redirect to `/dashboard`

**3. Test billing flow:**

- Go to `/dashboard/billing`
- Click **Upgrade to Pro**
- Use a real credit card or Stripe test card: `4242 4242 4242 4242`
- Complete checkout → should redirect back with success message
- Verify subscription is active in Stripe dashboard

**4. Check logs:**

- Visit Axiom → your production dataset
- Should see API logs from your test requests

**5. Check analytics:**

- Visit PostHog → your production project
- Should see page views and events from your test session

---

## Custom Domains (Optional)

If you want to use your own domains instead of Vercel's default URLs:

**1. Buy a domain** (e.g., `yourdomain.com` from Namecheap, Google Domains, etc.)

**2. Add custom domains in Vercel:**

For each project, go to **Settings** → **Domains**:

- **Web:** `yourdomain.com` and `www.yourdomain.com`
- **App:** `app.yourdomain.com`
- **API:** `api.yourdomain.com`

**3. Update DNS records** (Vercel provides instructions)

**4. Update environment variables** with custom domains:

In API project:

```bash
NEXT_PUBLIC_APP_URL=https://app.yourdomain.com
```

In App project:

```bash
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

**5. Update Clerk allowed domains:**

- Clerk dashboard → **Domains** → add `app.yourdomain.com`, `api.yourdomain.com`

**6. Update Stripe webhook URL:**

- Stripe dashboard → **Webhooks** → update endpoint to `https://api.yourdomain.com/webhooks/stripe`

**7. Redeploy all three apps** to apply changes

---

## CORS Configuration

Orion Kit's API is configured to accept requests only from your app domain for security.

**How it works:**

- `apps/api/middleware.ts` sets `Access-Control-Allow-Origin` header to `process.env.NEXT_PUBLIC_APP_URL`
- This prevents other websites from calling your API

**Verification:**

- After deployment, try calling your API from the browser console on a different domain
- You should get a CORS error
- Calling from your app domain should work fine

If you need to allow multiple domains, update `apps/api/middleware.ts`:

```typescript
const allowedOrigins = [
  process.env.NEXT_PUBLIC_APP_URL,
  "https://yourdomain.com",
];
```

---

## Troubleshooting

| Issue                                   | Cause                        | Fix                                                                                                         |
| --------------------------------------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------- |
| **Build fails with "MODULE_NOT_FOUND"** | Wrong root directory         | Ensure **Root Directory** is set to `apps/api`, `apps/app`, or `apps/web` in Vercel project settings        |
| **"DATABASE_URL is not defined"**       | Missing env var              | Add `DATABASE_URL` in Vercel → **Settings** → **Environment Variables** → redeploy                          |
| **"Clerk: Missing publishable key"**    | Missing Clerk env var        | Add both `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` → redeploy                              |
| **API returns 500 on webhook**          | Wrong Stripe webhook secret  | Copy new `whsec_*` from Stripe webhook endpoint → update `STRIPE_WEBHOOK_SECRET` in API env vars → redeploy |
| **CORS error when calling API**         | Wrong `NEXT_PUBLIC_APP_URL`  | Update to match your actual app URL in API env vars → redeploy                                              |
| **Redirect loop after sign-in**         | Clerk domains not configured | Add production domains in Clerk dashboard → **Domains**                                                     |

**Common mistakes:**

- Forgetting to select the correct **Root Directory** in Vercel (it defaults to repo root, not the app)
- Using test/dev API keys instead of production keys
- Not redeploying after updating environment variables

---

## Production Checklist

Before going live, verify:

- [ ] All 3 apps deployed (`api`, `app`, `web`)
- [ ] Database schema pushed to production Neon: `pnpm db:push`
- [ ] Stripe webhook endpoint created and pointing to production API URL
- [ ] Clerk production domains added (app and API URLs)
- [ ] All environment variables set with **production** (not test) keys
- [ ] Tested signup flow (create account → redirect to dashboard)
- [ ] Tested billing flow (upgrade to Pro → payment → subscription active in Stripe)
- [ ] Logs appearing in Axiom (if configured)
- [ ] Analytics appearing in PostHog (if configured)
- [ ] CORS working (API only accepts requests from app domain)

**Estimated time:** ~45-60 minutes for first deployment (including service setup)

---

## Further Reading

- [Vercel Deployment Docs](https://vercel.com/docs/deployments)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Environment Variables in Vercel](https://vercel.com/docs/concepts/projects/environment-variables)
- [Monorepo Deployment on Vercel](https://vercel.com/docs/monorepos)
