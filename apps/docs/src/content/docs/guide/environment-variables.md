---
title: Environment Variables
description: Complete guide to all environment variables in Orion Kit
---

# Environment Variables Guide

Complete reference for all environment variables needed across Orion Kit apps and packages.

## Overview

Orion Kit uses environment variables to configure cloud services and feature flags. This guide shows exactly what variables you need for each app.

## Quick Reference

| Variable                             | Apps                  | Required       | Service     |
| ------------------------------------ | --------------------- | -------------- | ----------- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`  | web, app, api         | ✅ Yes         | Clerk       |
| `CLERK_SECRET_KEY`                   | web, app, api         | ✅ Yes         | Clerk       |
| `DATABASE_URL`                       | api, database, studio | ✅ Yes         | Neon        |
| `NEXT_PUBLIC_API_URL`                | app                   | ✅ Yes         | Internal    |
| `STRIPE_SECRET_KEY`                  | api                   | ⚠️ Recommended | Stripe      |
| `STRIPE_WEBHOOK_SECRET`              | api                   | ⚠️ Recommended | Stripe      |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | app                   | ⚠️ Recommended | Stripe      |
| `AXIOM_TOKEN`                        | api                   | ⚠️ Recommended | Axiom       |
| `AXIOM_DATASET`                      | api                   | ⚠️ Recommended | Axiom       |
| `NEXT_PUBLIC_POSTHOG_KEY`            | web, app              | ⚠️ Recommended | PostHog     |
| `NEXT_PUBLIC_POSTHOG_HOST`           | web, app              | ⚠️ Recommended | PostHog     |
| `TRIGGER_API_KEY`                    | jobs                  | ⚠️ Optional    | Trigger.dev |

## App-by-App Configuration

### apps/web (Landing Page)

**File:** `apps/web/.env.local`

```bash
# Clerk Authentication (optional for landing)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# PostHog Analytics
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

**Required:** None (can work without external services)  
**Recommended:** PostHog for analytics

---

### apps/app (Dashboard)

**File:** `apps/app/.env.local`

```bash
# Clerk Authentication (required)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# API URL (required)
NEXT_PUBLIC_API_URL=http://localhost:3002

# Stripe (recommended)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# PostHog Analytics (recommended)
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

**Required:** Clerk keys, API URL  
**Recommended:** Stripe for payments, PostHog for analytics

---

### apps/api (Backend API)

**File:** `apps/api/.env.local`

```bash
# Clerk Authentication (required)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Neon Database (required)
DATABASE_URL=postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require

# Stripe (recommended)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PRICE_ID_PRO=price_...
NEXT_PUBLIC_STRIPE_PRICE_ID_ENTERPRISE=price_...
NEXT_PUBLIC_APP_URL=http://localhost:3001

# Axiom Logging (recommended)
AXIOM_TOKEN=xaat-...
AXIOM_DATASET=orion-logs
```

**Required:** Clerk keys, Database URL  
**Recommended:** Stripe for payments, Axiom for logging

---

### packages/database

**File:** `packages/database/.env`

```bash
# Neon Database (required)
DATABASE_URL=postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
```

**Required:** Database URL

---

### apps/studio (Drizzle Studio)

**File:** `apps/studio/.env.local`

```bash
# Neon Database (required)
DATABASE_URL=postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
```

**Required:** Database URL

---

### packages/jobs (Trigger.dev)

**File:** `packages/jobs/.env`

```bash
# Trigger.dev (optional for development)
TRIGGER_API_KEY=tr_dev_...
TRIGGER_API_URL=https://api.trigger.dev
```

**Required:** Only if using background jobs  
**Optional:** Can skip if not using Trigger.dev

---

## Variable Descriptions

### Clerk Variables

**`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`**

- **Format:** `pk_test_...` (test) or `pk_live_...` (production)
- **Public:** Yes (safe to expose in client-side code)
- **Where:** [Clerk Dashboard → API Keys](https://dashboard.clerk.com/last-active?path=api-keys)
- **Purpose:** Client-side authentication initialization

**`CLERK_SECRET_KEY`**

- **Format:** `sk_test_...` (test) or `sk_live_...` (production)
- **Public:** No (keep secret!)
- **Where:** [Clerk Dashboard → API Keys](https://dashboard.clerk.com/last-active?path=api-keys)
- **Purpose:** Server-side authentication and user management

---

### Database Variables

**`DATABASE_URL`**

- **Format:** `postgresql://user:pass@host/db?sslmode=require`
- **Public:** No (contains credentials!)
- **Where:** [Neon Console → Connection Details](https://console.neon.tech)
- **Purpose:** Connect to Postgres database
- **Tip:** Use "Pooled connection" for serverless environments

---

### Stripe Variables

> 📘 **See [Stripe Payments Guide](/guide/stripe-payments/) for complete setup instructions**

**`STRIPE_SECRET_KEY`**

- **Format:** `sk_test_...` (test) or `sk_live_...` (production)
- **Public:** No (keep secret!)
- **Where:** [Stripe Dashboard → Developers → API Keys](https://dashboard.stripe.com/test/apikeys)
- **Purpose:** Server-side Stripe API access
- **Note:** Never expose in client-side code

**`STRIPE_WEBHOOK_SECRET`**

- **Format:** `whsec_...`
- **Public:** No (keep secret!)
- **Where:** Run `pnpm stripe:listen-dev` to get local secret
- **Purpose:** Verify webhook signatures
- **Local:** The secret stays the same as long as `stripe listen` is running
- **Production:** Get from Stripe Dashboard → Webhooks after creating endpoint

**`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`**

- **Format:** `pk_test_...` (test) or `pk_live_...` (production)
- **Public:** Yes (safe to expose)
- **Where:** [Stripe Dashboard → Developers → API Keys](https://dashboard.stripe.com/test/apikeys)
- **Purpose:** Client-side Stripe.js initialization (if needed)

**`NEXT_PUBLIC_STRIPE_PRICE_ID_PRO`**

- **Format:** `price_...`
- **Public:** Yes (Price IDs are not sensitive)
- **Where:** Stripe Dashboard → Products → [Your Product] → Pricing
- **Purpose:** Stripe Price ID for Pro plan
- **Important:** Must have `NEXT_PUBLIC_` prefix to work in client components!

**`NEXT_PUBLIC_STRIPE_PRICE_ID_ENTERPRISE`**

- **Format:** `price_...`
- **Public:** Yes (Price IDs are not sensitive)
- **Where:** Stripe Dashboard → Products → [Your Product] → Pricing
- **Purpose:** Stripe Price ID for Enterprise plan
- **Important:** Must have `NEXT_PUBLIC_` prefix to work in client components!

---

### Axiom Variables

**`AXIOM_TOKEN`**

- **Format:** `xaat-...`
- **Public:** No (keep secret!)
- **Where:** [Axiom Dashboard → Settings → API Tokens](https://axiom.co/settings/api-tokens)
- **Purpose:** Send logs to Axiom
- **Permission:** Ingest Only

**`AXIOM_DATASET`**

- **Format:** `orion-logs` (or your dataset name)
- **Public:** No
- **Where:** Create in Axiom Dashboard
- **Purpose:** Specify which dataset to send logs to

---

### PostHog Variables

**`NEXT_PUBLIC_POSTHOG_KEY`**

- **Format:** `phc_...`
- **Public:** Yes (safe to expose)
- **Where:** [PostHog → Project Settings → API Keys](https://posthog.com/settings/project)
- **Purpose:** Initialize PostHog analytics

**`NEXT_PUBLIC_POSTHOG_HOST`**

- **Format:** `https://us.i.posthog.com` or `https://eu.i.posthog.com`
- **Public:** Yes
- **Where:** PostHog Dashboard (region-specific)
- **Purpose:** PostHog API endpoint

---

### Trigger.dev Variables

**`TRIGGER_API_KEY`**

- **Format:** `tr_dev_...` (dev) or `tr_prod_...` (production)
- **Public:** No (keep secret!)
- **Where:** [Trigger.dev Dashboard](https://trigger.dev)
- **Purpose:** Authenticate background job triggers

**`TRIGGER_API_URL`**

- **Format:** `https://api.trigger.dev`
- **Public:** Yes
- **Default:** `https://api.trigger.dev`
- **Purpose:** Trigger.dev API endpoint

---

### Internal Variables

**`NEXT_PUBLIC_API_URL`**

- **Format:** `http://localhost:3002` (dev) or `https://api.yourapp.com` (production)
- **Public:** Yes
- **Purpose:** Tell dashboard app where API is located
- **Development:** `http://localhost:3002`
- **Production:** Your deployed API URL

---

## Getting API Keys

### Step 1: Create Accounts

See [Accounts Setup Guide](/guide/accounts-setup/) for detailed instructions.

### Step 2: Copy Keys

All services provide API keys in their dashboards:

1. **Clerk**: Dashboard → API Keys
2. **Neon**: Console → Connection Details
3. **Axiom**: Settings → API Tokens
4. **PostHog**: Project Settings → API Keys
5. **Trigger.dev**: Project Dashboard

### Step 3: Add to .env Files

Create `.env.local` files (never commit these!):

```bash
cp apps/web/.env.example apps/web/.env.local
cp apps/app/.env.example apps/app/.env.local
cp apps/api/.env.example apps/api/.env.local
```

Then fill in your actual keys.

---

## Environment-Specific Keys

### Development

Use test/development keys:

- Clerk: `pk_test_...` and `sk_test_...`
- Trigger.dev: `tr_dev_...`
- Separate Neon branch or database

### Production

Use production keys:

- Clerk: `pk_live_...` and `sk_live_...`
- Trigger.dev: `tr_prod_...`
- Production Neon database
- Separate Axiom dataset
- Separate PostHog project (recommended)

---

## Security Best Practices

### ✅ DO

- Use `.env.local` for local development
- Use Vercel environment variables for production
- Rotate keys regularly
- Use separate keys for each environment
- Use minimum required permissions (e.g., "Ingest Only" for Axiom)

### ❌ DON'T

- Commit `.env` files to git
- Share keys in public channels
- Use production keys in development
- Hard-code keys in source code
- Give keys unnecessary permissions

---

## Vercel Deployment

### Add Variables in Vercel

1. Go to project **Settings** → **Environment Variables**
2. Add each variable
3. Select environments:
   - ✅ **Production** - for main branch
   - ✅ **Preview** - for PRs/branches
   - ⬜ **Development** - usually not needed

### Example: Adding Clerk Keys

1. Name: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
2. Value: `pk_live_...` (use production key!)
3. Environments: Production, Preview

Repeat for all required variables.

---

## Troubleshooting

### "Missing environment variable"

**Check:**

1. Variable is defined in `.env.local`
2. Variable name is spelled correctly (case-sensitive)
3. File is in correct directory
4. Dev server was restarted after adding variable

### "Invalid API key"

**Check:**

1. Key is for correct environment (test vs production)
2. No extra spaces or quotes around key
3. Key hasn't been revoked in service dashboard
4. Service account is active

### "Cannot read environment variable"

**Client-side variables must start with `NEXT_PUBLIC_`:**

```typescript
// ✅ Good - accessible in browser
const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;

// ❌ Bad - only available on server
const secret = process.env.CLERK_SECRET_KEY; // undefined in browser
```

---

## Validation

Add runtime validation for critical variables:

```typescript
// lib/env.ts
import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
  CLERK_SECRET_KEY: z.string().min(1),
  DATABASE_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);
```

---

## Complete Setup Checklist

### Minimal Setup (Required)

- [ ] Create Clerk account and get keys
- [ ] Create Neon database and get connection string
- [ ] Add Clerk keys to all 3 apps
- [ ] Add Database URL to api, database, studio
- [ ] Add `NEXT_PUBLIC_API_URL` to app
- [ ] Restart all dev servers

### Full Setup (Recommended)

- [ ] Create Stripe account and products
- [ ] Add Stripe keys and price IDs to api
- [ ] Add Stripe publishable key to app
- [ ] Set up webhook forwarding with Stripe CLI
- [ ] Create Axiom account and dataset
- [ ] Add Axiom token and dataset to api
- [ ] Create PostHog project
- [ ] Add PostHog keys to web and app
- [ ] Create Trigger.dev project (optional)
- [ ] Add Trigger.dev key to jobs (optional)

---

## Learn More

- [Accounts Setup Guide](/guide/accounts-setup/) - Detailed setup for each service
- [Quick Start](/quick-start/) - Get started in 5 minutes
- [Deployment Guide](/guide/deployment/) - Deploy to production
