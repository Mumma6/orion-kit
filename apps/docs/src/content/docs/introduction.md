---
title: Introduction
description: Production-ready SaaS boilerplate for Next.js
---

**Orion Kit** is a production-ready SaaS boilerplate that gets you from zero to deployed faster. Built with Next.js 15, TypeScript, and modern tools.

## What You Get

- 🔐 **Authentication** - Clerk with protected routes
- 🗄️ **Database** - Neon Postgres + Drizzle ORM
- 💳 **Payments** - Stripe subscriptions & billing
- 🎨 **UI** - shadcn/ui + Tailwind CSS
- 📊 **Analytics** - PostHog + Axiom logging
- ⚡ **Jobs** - Trigger.dev background tasks
- 🧪 **Testing** - Vitest + Playwright E2E

## Architecture

```
┌─────────┐  ┌─────────┐  ┌─────────┐
│   Web   │  │   App   │  │   API   │
│ (3000)  │  │ (3001)  │  │ (3002)  │
└─────────┘  └─────────┘  └─────────┘
     │            │            │
     └────────────┼────────────┘
                  │
            ┌─────────┐
            │ Database│
            │ (Neon)  │
            └─────────┘
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
