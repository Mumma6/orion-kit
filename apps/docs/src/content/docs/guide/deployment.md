---
title: Deployment Guide
description: Complete guide to deploying Orion Kit to production on Vercel
---

Deploy Orion Kit's three Next.js apps (`web`, `app`, `api`) to Vercel.

**Deploy:** `apps/web` (marketing), `apps/app` (dashboard), `apps/api` (backend)  
**Skip:** `apps/studio` (local only), `apps/docs` (optional)  
**Order:** API → App → Web (app needs API URL)

## Prerequisites

1. **GitHub repository** with your Orion Kit code
2. **Vercel account** (free plan is fine)
3. **Production API keys**: Neon, Stripe, Resend, Axiom, PostHog

## Step-by-Step Deployment

### Step 1: Setup Production Services

**1. Neon (Database)**

- Create new project in [Neon](https://neon.tech)
- Copy **Pooled Connection** URL
- Run: `export DATABASE_URL="postgresql://..." && pnpm db:push`

**2. Resend (Email)**

- Copy API key from [Resend](https://resend.com)
- Update `FROM_EMAIL` to your domain: `hello@yourdomain.com`

**3. Stripe (Payments)**

- Toggle to **Live Mode** in [Stripe](https://dashboard.stripe.com)
- Create products → copy Price IDs
- Get live API keys
- Setup webhook AFTER deploying API

**4. Axiom & PostHog**

- Create production dataset/project
- Copy API tokens

---

### Step 2: Deploy API

**1. Create Vercel Project**

- Go to [Vercel Dashboard](https://vercel.com/dashboard)
- Import GitHub repository
- **Root Directory:** `apps/api` ← **IMPORTANT**

**2. Add Environment Variables**

```bash
AUTH_JWT_SECRET=your-super-secret-key-min-32-chars
DATABASE_URL=postgresql://your-production-neon-url...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...  # Update after webhook setup
STRIPE_PRICE_ID_PRO=price_...
STRIPE_PRICE_ID_ENTERPRISE=price_...
RESEND_API_KEY=re_...
FROM_EMAIL=hello@yourdomain.com
NEXT_PUBLIC_APP_URL=https://placeholder.vercel.app  # Update after app deploy
AXIOM_TOKEN=xaat-...
AXIOM_DATASET=orion-production
```

**3. Deploy & Setup Webhook**

- Click **Deploy** → copy URL (e.g., `https://orion-api-abc123.vercel.app`)
- In Stripe → **Webhooks** → **Add Endpoint**
- URL: `https://orion-api-abc123.vercel.app/webhooks/stripe`
- Events: `checkout.session.completed`, `customer.subscription.*`
- Copy **Signing Secret** → update `STRIPE_WEBHOOK_SECRET` in Vercel → **Redeploy**

---

### Step 3: Deploy App

**1. Create Vercel Project**

- Import same GitHub repo
- **Root Directory:** `apps/app`

**2. Add Environment Variables**

```bash
DATABASE_URL=postgresql://your-production-neon-url...
NEXT_PUBLIC_API_URL=https://orion-api-abc123.vercel.app
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_PRICE_ID_PRO=price_...
STRIPE_PRICE_ID_ENTERPRISE=price_...
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

**3. Deploy & Update API**

- Click **Deploy** → copy URL (e.g., `https://orion-app-xyz789.vercel.app`)
- In API project → **Environment Variables** → update `NEXT_PUBLIC_APP_URL`
- **Redeploy** the API

---

### Step 4: Deploy Web

**1. Create Vercel Project**

- Import same GitHub repo
- **Root Directory:** `apps/web`

**2. Add Environment Variables**

```bash
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

**3. Deploy**

- Click **Deploy** → copy URL (e.g., `https://orion-web-def456.vercel.app`)

---

### Step 5: Test Production Deployment

**1. Test signup flow:**

- Visit `https://orion-app-xyz789.vercel.app`
- Sign up → should redirect to `/dashboard`

**2. Test billing flow:**

- Go to `/dashboard/billing` → **Upgrade to Pro**
- Use test card: `4242 4242 4242 4242`
- Complete checkout → verify subscription in Stripe

**3. Check services:**

- **Axiom**: Should see API logs
- **PostHog**: Should see page views and events
- **Resend**: Welcome emails sent on registration

---

## Custom Domains (Optional)

**1. Buy domain** (e.g., `yourdomain.com`)

**2. Add domains in Vercel:**

- **Web:** `yourdomain.com`, `www.yourdomain.com`
- **App:** `app.yourdomain.com`
- **API:** `api.yourdomain.com`

**3. Update environment variables:**

- API: `NEXT_PUBLIC_APP_URL=https://app.yourdomain.com`
- App: `NEXT_PUBLIC_API_URL=https://api.yourdomain.com`

**4. Update Stripe webhook** to `https://api.yourdomain.com/webhooks/stripe`

**5. Redeploy all apps**

---

## CORS Configuration

API only accepts requests from your app domain for security.

- `apps/api/middleware.ts` sets `Access-Control-Allow-Origin` to `NEXT_PUBLIC_APP_URL`
- Prevents other websites from calling your API

**Test:** Try calling API from different domain → should get CORS error

---

## Troubleshooting

| Issue                             | Cause                       | Fix                                                                 |
| --------------------------------- | --------------------------- | ------------------------------------------------------------------- |
| **Build fails**                   | Wrong root directory        | Set **Root Directory** to `apps/api`, `apps/app`, or `apps/web`     |
| **"DATABASE_URL not defined"**    | Missing env var             | Add `DATABASE_URL` in Vercel → **Environment Variables** → redeploy |
| **"AUTH_JWT_SECRET not defined"** | Missing JWT secret          | Add `AUTH_JWT_SECRET` with 32+ chars → redeploy                     |
| **API 500 on webhook**            | Wrong Stripe webhook secret | Update `STRIPE_WEBHOOK_SECRET` → redeploy                           |
| **CORS error**                    | Wrong `NEXT_PUBLIC_APP_URL` | Update to match actual app URL → redeploy                           |
| **Email not sending**             | Missing Resend config       | Add `RESEND_API_KEY` and `FROM_EMAIL` → redeploy                    |

**Common mistakes:**

- Wrong **Root Directory** in Vercel (defaults to repo root)
- Using test keys instead of production keys
- Not redeploying after updating environment variables

---

## Production Checklist

- [ ] All 3 apps deployed (`api`, `app`, `web`)
- [ ] Database schema pushed: `pnpm db:push`
- [ ] Stripe webhook endpoint created
- [ ] Resend API key configured
- [ ] All environment variables set with **production** keys
- [ ] Tested signup flow (create account → redirect to dashboard)
- [ ] Tested billing flow (upgrade to Pro → payment → subscription active)
- [ ] Logs appearing in Axiom
- [ ] Analytics appearing in PostHog
- [ ] CORS working (API only accepts requests from app domain)
- [ ] Welcome emails sent on registration

**Estimated time:** ~45-60 minutes for first deployment
