---
title: Introduction
description: Orion Kit - Production-ready SaaS starter
---

# Introduction

**Orion Kit** - Production-ready SaaS starter with Next.js, TypeScript, Drizzle ORM, Clerk, and TanStack Query.

## What's Included

- 🔐 **Auth** - Clerk with protected routes
- 🗄️ **Database** - Neon Postgres + Drizzle ORM
- 💳 **Payments** - Stripe subscriptions
- ✅ **Validation** - Zod on frontend + backend
- 🎨 **UI** - shadcn/ui + Tailwind CSS
- 📊 **Dashboard** - Full-featured with analytics
- 🌐 **Landing** - Modern marketing site
- 🔌 **API** - Type-safe with observability
- 🧪 **Testing** - Vitest + Playwright

## Apps

| App        | Port | Description   |
| ---------- | ---- | ------------- |
| **web**    | 3000 | Landing page  |
| **app**    | 3001 | Dashboard     |
| **api**    | 3002 | API backend   |
| **studio** | 3003 | Database GUI  |
| **docs**   | 3004 | Documentation |

## Packages

**[@workspace/auth](/packages/auth)** · **[@workspace/database](/packages/database)** · **[@workspace/types](/packages/types)** · **[@workspace/ui](/packages/ui)** · **[@workspace/payment](/packages/payment)** · **@workspace/analytics** · **@workspace/observability** · **@workspace/jobs**

## Type Flow

```
Database Schema → Auto-generate Types + Zod → Export from packages → Compose in @workspace/types → Use in API + Frontend
```

## Why Orion Kit?

✅ Production-ready · ✅ Type-safe · ✅ Fast DX · ✅ Scalable · ✅ Well-documented

**Get started:** [Quick Start →](/quick-start)  
**Learn more:** [Architecture →](/architecture) · [Guides →](/guide) · [Packages →](/packages)

**GitHub:** [github.com/orion-kit/orion](https://github.com/orion-kit/orion)
