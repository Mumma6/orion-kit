# 🚀 Orion Kit

A modern, production-ready SaaS starter kit built with Next.js 15, TypeScript, and best-in-class cloud services.

## ✨ What's Included

- 🔐 **Authentication** - Clerk with protected routes
- 🗄️ **Database** - Neon Postgres + Drizzle ORM
- 💳 **Payments** - Stripe subscriptions + webhooks
- ✅ **Validation** - Zod schemas everywhere
- 🎨 **UI** - Shadcn/ui + Tailwind CSS v4
- 📊 **Analytics** - PostHog + Vercel Analytics
- 🔍 **Logging** - Axiom structured logging
- ⚡ **Jobs** - Trigger.dev background tasks
- 🧪 **Testing** - Vitest with 16+ tests
- 📚 **Docs** - Astro Starlight documentation

## 📚 Documentation

**→ Start here: http://localhost:3004** (when running `pnpm dev`)

Complete documentation includes:

- 🚀 Quick Start Guide
- 🔧 Accounts Setup (Clerk, Neon, Axiom, PostHog, Trigger.dev)
- 🏗️ Architecture Overview
- 📦 Package API References
- 💡 Best Practices & Examples

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Set up environment variables (see apps/docs/content/quick-start.mdx)

# Push database schema
pnpm db:push

# Start all apps (including docs!)
pnpm dev
```

All apps will start:

- 🌐 **Landing:** http://localhost:3000
- 📊 **Dashboard:** http://localhost:3001
- 🔌 **API:** http://localhost:3002
- 🎨 **Studio:** http://localhost:3003
- 📚 **Docs:** http://localhost:3004 ⭐ **Start here!**

## 🛠️ Tech Stack

**Frontend & Framework:**

- Next.js 15 (App Router + React 19)
- TypeScript (strict mode)
- Tailwind CSS v4
- Shadcn/ui + Radix UI

**Backend & Database:**

- Neon (Serverless Postgres)
- Drizzle ORM (type-safe queries)
- Zod (runtime validation)

**Data & State:**

- TanStack Query (data fetching + caching)
- React Hook Form (forms + validation)

**Authentication & Security:**

- Clerk (complete auth solution)
- Zod schemas (frontend + backend)

**Observability:**

- Axiom (structured logging)
- PostHog (product analytics)
- Vercel Analytics (performance)

**DevOps:**

- Trigger.dev (background jobs)
- Turborepo (monorepo)
- Vitest (testing)
- pnpm (package manager)

## 📦 What's Inside?

### Apps

| App      | Port | Description                   |
| -------- | ---- | ----------------------------- |
| `web`    | 3000 | Marketing landing page        |
| `app`    | 3001 | Dashboard application         |
| `api`    | 3002 | API backend                   |
| `studio` | 3003 | Database GUI (Drizzle Studio) |
| `docs`   | 3004 | Documentation (Starlight)     |

### Packages

| Package                    | Description                      |
| -------------------------- | -------------------------------- |
| `@workspace/auth`          | Clerk authentication             |
| `@workspace/database`      | Drizzle ORM + Neon + Zod schemas |
| `@workspace/types`         | Shared TypeScript types          |
| `@workspace/ui`            | Shadcn/ui + Radix UI components  |
| `@workspace/payment`       | Stripe payments + subscriptions  |
| `@workspace/analytics`     | PostHog + Vercel Analytics       |
| `@workspace/observability` | Axiom logging + Web Vitals       |
| `@workspace/jobs`          | Trigger.dev background jobs      |

### whats not insde (expand this)

ai sdk
resend
i18n

lägg till dokumentation och förklaring till varför dessa inte finns med samt hur man fixar domgit

## 🎯 Key Features

### Type Safety & Validation

- ✅ **End-to-end TypeScript** - Strict mode across entire stack
- ✅ **Zod validation** - Runtime validation on client and server
- ✅ **Drizzle ORM** - Type-safe database queries with inference
- ✅ **Shared types** - Single source of truth via @workspace/types

### Authentication & Security

- ✅ **Clerk integration** - Complete auth with beautiful UI
- ✅ **Protected routes** - Middleware-based route protection
- ✅ **Session management** - Secure cookie-based sessions
- ✅ **User management** - Profile, sign in/up, password reset

### Data & State Management

- ✅ **TanStack Query** - Smart caching and data fetching
- ✅ **React Hook Form** - Performant forms with Zod resolvers
- ✅ **Optimistic updates** - Instant UI feedback
- ✅ **Error boundaries** - Graceful error handling

### Observability & Analytics

- ✅ **Axiom logging** - Structured logs with powerful queries
- ✅ **PostHog analytics** - Product insights and funnels
- ✅ **Vercel Analytics** - Performance and web vitals
- ✅ **Error tracking** - Automatic error capture

### Developer Experience

- ✅ **Monorepo** - Turborepo with shared packages
- ✅ **Hot reload** - Turbopack for fast development
- ✅ **Documentation** - Comprehensive Starlight docs
- ✅ **Testing** - Vitest with 16+ passing tests
- ✅ **Type generation** - Automatic from database schema

## ☁️ Cloud Services

Orion Kit integrates with best-in-class services (all have generous free tiers):

| Service                            | Purpose           | Free Tier | Setup                                      |
| ---------------------------------- | ----------------- | --------- | ------------------------------------------ |
| [Clerk](https://clerk.com)         | Authentication    | 10k MAU   | [Guide](/guide/accounts-setup/#clerk)      |
| [Neon](https://neon.tech)          | Postgres Database | 0.5GB     | [Guide](/guide/accounts-setup/#neon)       |
| [Stripe](https://stripe.com)       | Payments          | No fees   | [Guide](/guide/accounts-setup/#stripe)     |
| [Axiom](https://axiom.co)          | Logging           | 500MB/mo  | [Guide](/guide/accounts-setup/#axiom)      |
| [PostHog](https://posthog.com)     | Analytics         | 1M events | [Guide](/guide/accounts-setup/#posthog)    |
| [Trigger.dev](https://trigger.dev) | Background Jobs   | 100k runs | [Guide](/guide/accounts-setup/#triggerdev) |

**→ Complete setup guide: http://localhost:3004/guide/accounts-setup/**

## 💳 Stripe Quick Start

```bash
# 1. Start webhook listener
pnpm stripe:listen-dev

# 2. Copy the whsec_... secret to apps/api/.env.local
# 3. Restart API server
# 4. Test with card: 4242 4242 4242 4242
```

**→ Complete Stripe guide: http://localhost:3004/guide/stripe-payments/**

## 📖 Documentation

Visit **http://localhost:3004** for complete documentation including:

- 📘 Quick Start Guide
- ☁️ Cloud Accounts Setup
- 🔧 Environment Variables Reference
- 🏗️ Architecture Overview
- 📦 Package API References
- 💡 Best Practices & Examples

All documentation is also available in `apps/docs/src/content/docs/`

## 📝 License

MIT

---

**Built with ❤️ for developers**
