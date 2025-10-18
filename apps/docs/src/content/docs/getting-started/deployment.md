---
title: Deployment Guide
description: Deploy Orion Kit to production
---

# Deployment Guide

Deploy your Orion Kit application to production in **15 minutes**.

## 🚀 **Quick Deploy (Vercel)**

### Prerequisites

- [Vercel account](https://vercel.com) (free)
- [GitHub repository](https://github.com) with your code
- Production API keys (see [Setup Services](#setup-services) below)

### Step 1: Setup Production Services

:::tip[TL;DR]
You need: Neon (database), Stripe (payments), Resend (email), PostHog (analytics), Axiom (logging)
:::

**Neon Database:**

1. Go to [neon.tech](https://neon.tech) → Create project
2. Copy **Pooled Connection** URL
3. Run: `export DATABASE_URL="postgresql://..." && pnpm db:push`

**Stripe Payments:**

1. Go to [stripe.com](https://stripe.com) → Toggle to **Live Mode**
2. Create products → Copy Price IDs
3. Get live API keys

**Other Services:**

- [Resend](https://resend.com) → Copy API key
- [PostHog](https://posthog.com) → Copy project key
- [Axiom](https://axiom.co) → Copy API token

### Step 2: Deploy API

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. **Import** your GitHub repository
3. **Root Directory:** `apps/api` ← **IMPORTANT**
4. **Add Environment Variables:**

```bash
AUTH_JWT_SECRET=your-super-secret-key-min-32-chars
DATABASE_URL=postgresql://your-production-neon-url...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PRICE_ID_PRO=price_...
STRIPE_PRICE_ID_ENTERPRISE=price_...
RESEND_API_KEY=re_...
FROM_EMAIL=hello@yourdomain.com
NEXT_PUBLIC_APP_URL=https://placeholder.vercel.app
AXIOM_TOKEN=xaat-...
AXIOM_DATASET=your-app-production
```

5. **Deploy** → Copy URL (e.g., `https://your-api-abc123.vercel.app`)

### Step 3: Setup Stripe Webhook

1. In Stripe → **Webhooks** → **Add Endpoint**
2. **URL:** `https://your-api-abc123.vercel.app/webhooks/stripe`
3. **Events:** `checkout.session.completed`, `customer.subscription.*`
4. **Copy Signing Secret** → Update `STRIPE_WEBHOOK_SECRET` in Vercel → **Redeploy**

### Step 4: Deploy App

1. **Import** same GitHub repo
2. **Root Directory:** `apps/app`
3. **Add Environment Variables:**

```bash
DATABASE_URL=postgresql://your-production-neon-url...
NEXT_PUBLIC_API_URL=https://your-api-abc123.vercel.app
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_PRICE_ID_PRO=price_...
STRIPE_PRICE_ID_ENTERPRISE=price_...
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

4. **Deploy** → Copy URL (e.g., `https://your-app-xyz789.vercel.app`)
5. **Update API:** Set `NEXT_PUBLIC_APP_URL` to your app URL → **Redeploy API**

### Step 5: Deploy Web (Optional)

1. **Import** same GitHub repo
2. **Root Directory:** `apps/web`
3. **Add Environment Variables:**

```bash
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

4. **Deploy** → Copy URL (e.g., `https://your-web-def456.vercel.app`)

## ✅ **Test Production**

1. **Visit your app:** `https://your-app-xyz789.vercel.app`
2. **Sign up** → Should redirect to dashboard
3. **Test billing:** Go to `/dashboard/billing` → Upgrade to Pro
4. **Use test card:** `4242 4242 4242 4242`

## 🌐 **Custom Domain (Optional)**

1. **Buy domain** (e.g., `yourdomain.com`)
2. **Add domains in Vercel:**
   - **App:** `app.yourdomain.com`
   - **API:** `api.yourdomain.com`
   - **Web:** `yourdomain.com`
3. **Update environment variables:**
   - API: `NEXT_PUBLIC_APP_URL=https://app.yourdomain.com`
   - App: `NEXT_PUBLIC_API_URL=https://api.yourdomain.com`
4. **Update Stripe webhook** to `https://api.yourdomain.com/webhooks/stripe`
5. **Redeploy all apps**

## 🆘 **Troubleshooting**

| Issue                             | Fix                                                             |
| --------------------------------- | --------------------------------------------------------------- |
| **Build fails**                   | Set **Root Directory** to `apps/api`, `apps/app`, or `apps/web` |
| **"DATABASE_URL not defined"**    | Add `DATABASE_URL` in Vercel → **Environment Variables**        |
| **"AUTH_JWT_SECRET not defined"** | Add `AUTH_JWT_SECRET` with 32+ chars                            |
| **API 500 on webhook**            | Update `STRIPE_WEBHOOK_SECRET` → redeploy                       |
| **CORS error**                    | Update `NEXT_PUBLIC_APP_URL` to match actual app URL            |

## 📋 **Production Checklist**

- [ ] All apps deployed (`api`, `app`, `web`)
- [ ] Database schema pushed: `pnpm db:push`
- [ ] Stripe webhook endpoint created
- [ ] All environment variables set with **production** keys
- [ ] Tested signup flow
- [ ] Tested billing flow
- [ ] Logs appearing in Axiom
- [ ] Analytics appearing in PostHog

**Estimated time:** ~15 minutes for first deployment

---

**Need help?** Check our [Complete Deployment Guide](/guide/deployment) or [open an issue](https://github.com/Mumma6/orion-kit/issues).
