---
title: Cloud Accounts Setup
---

Orion Kit uses cloud services for database, payments, and monitoring. Authentication is handled by our custom JWT system (no external dependencies!).

| Service     | What It Does          | Used Where            | Free Tier    |
| ----------- | --------------------- | --------------------- | ------------ |
| **Neon**    | Postgres database     | API + Database schema | 0.5GB        |
| **Stripe**  | Subscription payments | Billing page          | No fees      |
| **Resend**  | Transactional emails  | Welcome emails        | 3k emails    |
| **Axiom**   | Structured logging    | API error tracking    | 500MB/month  |
| **PostHog** | Product analytics     | User behavior         | 1M events/mo |
| **Vercel**  | Hosting               | Production deploy     | Unlimited    |

## 🔐 Authentication (Custom JWT)

Orion Kit uses a **custom JWT-based authentication system** - no external auth provider needed!

### Setup

Add to your API app (`.env.local`):

```bash
AUTH_JWT_SECRET=your-super-secret-key-min-32-characters-long
NEXT_PUBLIC_APP_URL=http://localhost:3001
NEXT_PUBLIC_API_URL=http://localhost:3002
DATABASE_URL=postgresql://...
```

That's it! No external accounts needed.

---

## 🗄️ Neon

Serverless Postgres database with autoscaling and generous free tier.

### Setup

**1. Create Account**

- Go to [neon.tech](https://neon.tech)
- Sign up with GitHub (free tier = 0.5GB storage)
- Create new project

**2. Get Connection String**

- In dashboard → **Connection Details**
- **IMPORTANT**: Select **"Pooled connection"** (required for serverless)
- Copy connection string (starts with `postgresql://`)

**3. Configure Environment Variables**

Add to these files:

- `packages/database/.env`
- `apps/api/.env.local`
- `apps/studio/.env.local`

```bash
DATABASE_URL=postgresql://user:password@host.neon.tech/neondb?sslmode=require
```

**4. Initialize Database**

```bash
pnpm db:push
```

**5. Verify Database**

```bash
pnpm db:studio
# Opens https://local.drizzle.studio
```

---

## 💳 Stripe

Handles subscription payments, billing, and customer management.

### Setup

**1. Create Account**

- Go to [stripe.com](https://stripe.com)
- Sign up (test mode = no fees)
- Enable **Test Mode** (toggle in top-right)

**2. Create Products**

- **Products** → **Add Product**
- **Pro Plan**: Name: `Pro`, Price: `$19/month` (recurring)
- **Enterprise Plan**: Name: `Enterprise`, Price: `$49/month` (recurring)
- Copy **Price IDs** (start with `price_`)

**3. Get API Keys**

- **Developers** → **API Keys**
- Copy **Publishable key** (starts with `pk_test_`)
- Copy **Secret key** (starts with `sk_test_`)

**4. Configure Environment Variables**

Add to `apps/api/.env.local`:

```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PRICE_ID_PRO=price_...
STRIPE_PRICE_ID_ENTERPRISE=price_...
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

Add to `apps/app/.env.local`:

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

**5. Setup Webhooks (Local Development)**

```bash
brew install stripe/stripe-cli/stripe
stripe login
stripe listen --forward-to localhost:3002/webhooks/stripe
```

Copy **webhook signing secret** (starts with `whsec_`) and add to `apps/api/.env.local`:

```bash
STRIPE_WEBHOOK_SECRET=whsec_...
```

**6. Test Payment Flow**

```bash
pnpm dev
# Visit http://localhost:3001/dashboard/billing
# Click "Upgrade to Pro"
# Use test card: 4242 4242 4242 4242
```

---

## 📧 Resend

Transactional emails with beautiful React Email templates.

### Setup

**1. Create Account**

- Go to [resend.com](https://resend.com)
- Sign up (free tier = 3,000 emails/month)

**2. Get API Key**

- Dashboard → **API Keys** → **Create API Key**
- Copy key (starts with `re_`)

**3. Configure Environment Variables**

Add to `apps/api/.env.local`:

```bash
RESEND_API_KEY=re_...
FROM_EMAIL=onboarding@resend.dev  # or your domain
```

**4. Test Email**

```bash
pnpm dev
# Register a new user
# Check your email for welcome message
```

---

## 📈 Axiom

Serverless logging platform for structured logs, errors, and performance metrics.

### Setup

**1. Create Account**

- Go to [axiom.co](https://axiom.co)
- Sign up (free tier = 500MB/month)

**2. Create Dataset**

- Dashboard → **Datasets** → **Create Dataset**
- Name: `orion-logs`

**3. Create API Token**

- **Settings** → **API Tokens** → **Create Token**
- Select **Ingest Only** permission
- Copy token (starts with `xaat-`)

**4. Configure Environment Variables**

Add to `apps/api/.env.local`:

```bash
AXIOM_TOKEN=xaat-...
AXIOM_DATASET=orion-logs
```

**5. Test Logging**

```bash
pnpm dev
# Make any API request
# Visit axiom.co → your dataset
```

---

## 📊 PostHog

Open-source product analytics platform for tracking user events and page views.

### Setup

**1. Create Account**

- Go to [posthog.com](https://posthog.com)
- Sign up (free tier = 1M events/month)

**2. Get API Keys**

- Dashboard → **Project Settings**
- Copy **Project API Key** (starts with `phc_`)
- Copy **Host URL** (usually `https://us.i.posthog.com`)

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
# Navigate pages, create a task
# Visit posthog.com → Web Analytics
```

---

## ⚡ Trigger.dev

Background jobs and scheduled tasks without managing infrastructure.

### Setup

**1. Create Account**

- Go to [trigger.dev](https://trigger.dev)
- Sign up (free tier included)
- Create project

**2. Get API Key**

- Project dashboard → **Environments**
- Copy **Development API Key** (starts with `tr_dev_`)

**3. Configure Environment Variables**

Add to `packages/jobs/.env`:

```bash
TRIGGER_API_KEY=tr_dev_...
TRIGGER_API_URL=https://api.trigger.dev
```

**4. Test Jobs** (optional, demo-only)

```bash
cd packages/jobs
pnpm trigger:dev
# Jobs appear in trigger.dev dashboard
```

---

## ▲ Vercel

Deployment platform for Next.js apps with serverless hosting and automatic deployments.

### How It's Used

- **Three apps deployed**: `web` (marketing), `app` (dashboard), `api` (backend)
- **Automatic deployments**: Push to `main` branch = production deploy
- **Environment variables**: Set in Vercel dashboard for each app

See the [Deployment Guide](/guide/deployment) for complete instructions.

**Troubleshooting?** Check service docs: [Neon](https://neon.tech/docs) · [Stripe](https://stripe.com/docs) · [Resend](https://resend.com/docs)
