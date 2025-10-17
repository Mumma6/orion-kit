---
title: Introduction
description: Production-ready SaaS boilerplate for Next.js
---

**Orion Kit** is a production-ready SaaS boilerplate that gets you from zero to deployed faster. Built with Next.js 15, TypeScript, and modern tools.

## What You Get

- 🔐 **Authentication** - Custom JWT with protected routes
- 🗄️ **Database** - Neon Postgres + Drizzle ORM
- 💳 **Payments** - Stripe subscriptions & billing
- 📧 **Email** - Resend with React Email templates
- 🎨 **UI** - shadcn/ui + Tailwind CSS
- 📊 **Analytics** - PostHog + Axiom logging
- ⚡ **Jobs** - Trigger.dev background tasks
- 🧪 **Testing** - Vitest + Playwright E2E

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        ORION KIT MONOREPO                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐          │
│  │     WEB     │    │     APP     │    │     API     │          │
│  │  (Port 3000)│    │  (Port 3001)│    │  (Port 3002)│          │
│  │             │    │             │    │             │          │
│  │ • Landing   │    │ • Dashboard │    │ • Auth      │          │
│  │ • Marketing │    │ • Tasks     │    │ • Tasks     │          │
│  │ • Features  │    │ • Billing   │    │ • Billing   │          │
│  │ • Pricing   │    │ • Settings  │    │ • Webhooks  │          │
│  └─────────────┘    └─────────────┘    └─────────────┘          │
│         │                   │                   │               │
│         └───────────────────┼───────────────────┘               │
│                             │                                   │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                    SHARED PACKAGES                          ││
│  │                                                             ││
│  │  @workspace/auth    @workspace/database  @workspace/email   ││
│  │  @workspace/types   @workspace/ui       @workspace/payment  ││
│  │  @workspace/analytics @workspace/observability @workspace/jobs││
│  └─────────────────────────────────────────────────────────────┘ │
│                             │                                    │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    EXTERNAL SERVICES                        │ │
│  │                                                             │ │
│  │  🗄️ Neon DB    💳 Stripe    📧 Resend    📊 PostHog         │  │
│  │  📈 Axiom      ⚡ Trigger   🎨 Vercel    🧪 Playwright        ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

Data Flow:
User → Web/App → API → Database
     ↓
   Auth (JWT) → Protected Routes → TanStack Query → UI Updates
     ↓
   Email (Resend) → Welcome Emails → Database Tracking
     ↓
   Payments (Stripe) → Webhooks → Subscription Updates
```

## Type-Safe Stack

Database Schema → Auto-generated Types → Shared Packages → API + Frontend

Everything is type-safe from database to UI with zero duplication.

## Quick Start

```bash
git clone https://github.com/orion-kit/orion
cd orion
pnpm install
pnpm dev
```

**Next:** [Quick Start Guide →](/quick-start)  
**Learn:** [Architecture →](/architecture) · [Packages →](/packages)

**GitHub:** [github.com/orion-kit/orion](https://github.com/orion-kit/orion)
