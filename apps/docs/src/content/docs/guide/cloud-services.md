---
title: Cloud Services Overview
description: Overview of all integrated cloud services
---

# Cloud Services Overview

Orion Kit integrates with modern cloud services to provide a production-ready foundation. Here's what each service provides and why we use it.

## Service Comparison

| Service         | Category  | Free Tier | Why We Use It                            |
| --------------- | --------- | --------- | ---------------------------------------- |
| **Clerk**       | Auth      | 10k MAU   | Best-in-class auth with beautiful UI     |
| **Neon**        | Database  | 0.5GB     | Serverless Postgres with instant scaling |
| **Stripe**      | Payments  | No fees   | Industry standard for subscriptions      |
| **Axiom**       | Logging   | 500MB/mo  | Structured logging with powerful queries |
| **PostHog**     | Analytics | 1M events | Product analytics with feature flags     |
| **Trigger.dev** | Jobs      | 100k runs | Reliable background job processing       |
| **Vercel**      | Hosting   | Unlimited | Zero-config deployment for Next.js       |

## Service Details

### 🔐 Clerk - Authentication

**What it does:**

- User sign up/sign in
- Session management
- Password reset
- OAuth providers (Google, GitHub, etc.)
- Multi-factor authentication
- Organization management

**Why Clerk?**

- Beautiful pre-built UI components
- Zero configuration needed
- Handles all edge cases
- Production-ready security
- Better UX than building auth yourself

**Alternatives:**

- Auth0, Supabase Auth, NextAuth.js, Firebase Auth

**Cost:** Free up to 10k monthly active users, then $25/month

[Setup Guide →](/guide/accounts-setup/#clerk-authentication)

---

### 🗄️ Neon - Database

**What it does:**

- Serverless Postgres database
- Automatic scaling
- Database branching (like Git for your database)
- Connection pooling
- Point-in-time recovery

**Why Neon?**

- True serverless (pay for what you use)
- Instant database branches for preview deploys
- Compatible with all Postgres tools
- Fast cold starts
- Perfect for Next.js apps

**Alternatives:**

- Supabase, PlanetScale, AWS RDS, Railway

**Cost:** Free up to 0.5GB, then $19/month for autoscaling

[Setup Guide →](/guide/accounts-setup/#neon-database)

---

### 💳 Stripe - Payments

**What it does:**

- Subscription billing
- One-time payments
- Payment method management
- Customer portal
- Invoice generation
- Automatic billing retries

**Why Stripe?**

- Industry standard (used by millions)
- Excellent documentation and SDKs
- Strong fraud prevention
- Global payment methods
- Hosted checkout pages
- Self-service customer portal

**Alternatives:**

- Paddle, Lemon Squeezy, PayPal, Square

**Cost:** No monthly fees, 2.9% + $0.30 per transaction

[Setup Guide →](/guide/accounts-setup/#stripe-payments)

---

### 📈 Axiom - Logging

**What it does:**

- Structured log ingestion
- Powerful query language (APL)
- Real-time log streaming
- Alerts and monitors
- Error tracking
- Performance metrics

**Why Axiom?**

- Designed for serverless/edge environments
- Fast queries on massive datasets
- Generous free tier
- Better than traditional logging (Datadog, Splunk)
- Affordable pricing

**Alternatives:**

- Datadog, New Relic, Logtail, Betterstack

**Cost:** Free up to 500MB/month, then $25/month for 10GB

[Setup Guide →](/guide/accounts-setup/#axiom-logging)

---

### 📊 PostHog - Analytics

**What it does:**

- Event tracking (page views, clicks, etc.)
- User behavior analytics
- Funnels and conversion tracking
- Feature flags
- A/B testing
- Session recordings
- User cohorts

**Why PostHog?**

- All-in-one analytics platform
- Privacy-friendly (can self-host)
- Feature flags included
- Better than Google Analytics for products
- Developer-friendly

**Alternatives:**

- Mixpanel, Amplitude, Google Analytics, Plausible

**Cost:** Free up to 1M events/month, then usage-based pricing

[Setup Guide →](/guide/accounts-setup/#posthog-analytics)

---

### ⚡ Trigger.dev - Background Jobs

**What it does:**

- Reliable background job execution
- Scheduled tasks (cron jobs)
- Retry logic
- Job monitoring
- Webhook processing
- Long-running tasks

**Why Trigger.dev?**

- TypeScript-first
- Built for Next.js/Vercel
- Automatic retries
- Easy local development
- Better than building queue system yourself

**Alternatives:**

- Inngest, QStash, AWS SQS, Bull/BullMQ

**Cost:** Free up to 100k runs/month, then $29/month

[Setup Guide →](/guide/accounts-setup/#triggerdev-background-jobs)

---

### ▲ Vercel - Hosting

**What it does:**

- Deploy Next.js apps
- Automatic HTTPS
- Edge runtime
- Preview deployments for PRs
- Analytics
- Speed Insights

**Why Vercel?**

- Made by Next.js creators
- Zero configuration
- Best Next.js performance
- Free hobby tier
- Git integration

**Alternatives:**

- Netlify, Railway, Fly.io, AWS, Cloudflare Pages

**Cost:** Free for hobby projects, $20/month for pro

[Setup Guide →](/guide/accounts-setup/#vercel-deployment)

---

## Integration Benefits

### Why Use These Services?

**Instead of building yourself:**

- 🚀 **Faster time to market** - Focus on your product
- 🔒 **Better security** - Battle-tested by thousands of apps
- 💰 **Lower cost** - Cheaper than engineering time
- 📈 **Better features** - More features than you'd build
- 🛠️ **Less maintenance** - No infrastructure to manage

**Production-ready:**

- ✅ SOC 2 compliance (most services)
- ✅ 99.9%+ uptime
- ✅ Automatic backups
- ✅ DDoS protection
- ✅ Global CDN

### Cost vs. Build Yourself

Building authentication alone would take:

- 2-4 weeks of development
- Security audits
- Ongoing maintenance
- Testing across devices/browsers
- **Total cost:** $10k-20k+

Using Clerk:

- 10 minutes to integrate
- $0-25/month
- **Total cost:** $25/month

## Free Tier Limits

All services can handle significant traffic on free tiers:

**Clerk:** 10,000 MAU = ~50-100 new signups/day  
**Neon:** 0.5GB = ~50,000 rows  
**Axiom:** 500MB = ~5M log entries  
**PostHog:** 1M events = ~1,000 DAU with good tracking  
**Trigger.dev:** 100k runs = ~3,000 jobs/day

For most new projects, free tiers last 6-12 months.

## Migrating Later

All services support data export:

- **Clerk** → Export users via API
- **Neon** → Standard Postgres dump
- **Axiom** → Export logs as JSON
- **PostHog** → Export events via API
- **Trigger.dev** → Self-host option available

No vendor lock-in.

## Self-Hosting Options

Some services can be self-hosted if needed:

- **Auth:** NextAuth.js (open source)
- **Database:** Self-hosted Postgres
- **Logging:** Self-hosted Loki or OpenObserve
- **Analytics:** Self-hosted PostHog
- **Jobs:** Self-hosted Trigger.dev

But we recommend cloud services for:

- Less maintenance
- Better reliability
- Automatic updates
- Professional support

## Learn More

- [Accounts Setup Guide](/guide/accounts-setup/) - Step-by-step setup
- [Environment Variables](/guide/environment-variables/) - All required variables
- [Quick Start](/quick-start/) - Get started in 5 minutes
