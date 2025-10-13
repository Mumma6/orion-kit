---
title: Cloud Services
description: Services used in Orion Kit
---

# Cloud Services

| Service         | Purpose   | Free Tier    | Why                                |
| --------------- | --------- | ------------ | ---------------------------------- |
| **Clerk**       | Auth      | 10k MAU      | Beautiful UI, zero config          |
| **Neon**        | Database  | 0.5GB        | Serverless Postgres, branching     |
| **Stripe**      | Payments  | No fees      | Industry standard, hosted checkout |
| **Axiom**       | Logging   | 500MB/mo     | Serverless-friendly, powerful APL  |
| **PostHog**     | Analytics | 1M events/mo | Product analytics + feature flags  |
| **Trigger.dev** | Jobs      | 100k runs/mo | TypeScript-first job processing    |
| **Vercel**      | Hosting   | Unlimited    | Made for Next.js                   |

## Why Not Build It Yourself?

**Auth alone costs:**

- 2-4 weeks dev time = $10k-20k
- Ongoing security maintenance
- Testing across platforms

**Using Clerk:**

- 10 min setup
- $0-25/month
- Battle-tested security

**Same logic applies to all services.** Focus on your product, not infrastructure.

## Free Tier Reality

Free tiers handle real traffic:

- **10k MAU** = ~50 signups/day
- **0.5GB DB** = ~50k rows
- **1M events** = ~1k DAU

Most projects stay free for 6-12 months.

## Alternatives & Migration

All services have alternatives and export options. No lock-in. See individual package docs for details.

**Setup:** [Accounts Guide](/guide/accounts-setup)
