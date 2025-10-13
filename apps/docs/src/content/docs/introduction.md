---
title: Introduction
description: Welcome to Orion Kit - a modern, production-ready SaaS starter kit
---

# Introduction

Welcome to **Orion Kit** - a modern, production-ready SaaS starter kit.

## What is Orion Kit?

Orion Kit is a comprehensive monorepo starter that provides everything you need to build a modern SaaS application:

- 🔐 **Authentication** - Clerk with protected routes and middleware
- 🗄️ **Database** - Neon Postgres with Drizzle ORM
- 💳 **Payments** - Stripe for subscriptions and billing
- ✅ **Validation** - Zod schemas on frontend and backend
- 🎨 **UI** - Shadcn/ui components with Tailwind CSS
- 📊 **Dashboard** - Full-featured admin panel with analytics
- 🌐 **Landing Page** - Modern marketing site with pricing
- 🔌 **API** - Type-safe backend with observability
- 📈 **Analytics** - PostHog for product insights
- 🔍 **Logging** - Axiom for structured logging
- ⚡ **Background Jobs** - Trigger.dev for async tasks
- 🧪 **Testing** - Vitest with comprehensive test suite

## Quick Start

New to Orion Kit? Check out the [Quick Start Guide](/quick-start) to get up and running in 5 minutes!

## Features

### 🚀 Modern Tech Stack

- **Next.js 15** - App Router with Server Components
- **TypeScript** - Full type safety
- **Tailwind CSS** - Utility-first styling
- **Turborepo** - Optimized monorepo builds

### 🔒 Security & Validation

- **Clerk** - Production-ready authentication
- **Zod** - Runtime validation on client and server
- **Type Safety** - End-to-end TypeScript coverage

### 📦 Developer Experience

- **TanStack Query** - Automatic caching and state management
- **React Hook Form** - Performant forms with validation
- **Drizzle Studio** - Visual database management
- **Error Handling** - Toast notifications and error boundaries
- **Testing** - Vitest for unit tests with full coverage
- **Hot Reload** - Fast development with Turbopack

## Apps & Packages

### Applications

| App        | Port | Description             |
| ---------- | ---- | ----------------------- |
| **web**    | 3000 | Marketing landing page  |
| **app**    | 3001 | Dashboard application   |
| **api**    | 3002 | API backend             |
| **studio** | 3003 | Database GUI            |
| **docs**   | 3004 | This documentation site |

### Shared Packages

- **[@workspace/auth](/packages/auth)** - Authentication utilities
- **[@workspace/database](/packages/database)** - Database ORM and entity types
- **[@workspace/types](/packages/types)** - Centralized API response types
- **[@workspace/ui](/packages/ui)** - UI component library
- **[@workspace/payment](/packages/payment)** - Stripe payments and billing
- **@workspace/analytics** - PostHog and Vercel Analytics
- **@workspace/observability** - Axiom logging
- **@workspace/jobs** - Trigger.dev background jobs

## Architecture Highlights

### Type Flow

```
Drizzle Schema (database)
        ↓
   Drizzle Schema → Types + Zod
        ↓
   ┌────────────────┬────────────────┐
   │ @workspace/    │ @workspace/    │
   │   database     │   payment      │
   └────┬───────────┴────┬───────────┘
        │ Domain Types   │
        └────────┬────────┘
                 │
          @workspace/types
        (API Response Types)
                 │
        ┌────────┴────────┐
        │                 │
   Backend App       Frontend App
   (Routes)          (Hooks/Query)
```

See [Architecture](/architecture) for complete details.

### Data Flow

```
User Input
    ↓
Form Validation (Zod)
    ↓
TanStack Query
    ↓
API Validation (Zod, same schema!)
    ↓
Drizzle ORM
    ↓
Neon Database
```

## Why Orion Kit?

✅ **Production-Ready** - Battle-tested tools and patterns  
✅ **Type-Safe** - Catch errors at compile-time  
✅ **Validated** - Runtime safety with Zod  
✅ **Fast DX** - Hot reload, great tooling  
✅ **Scalable** - Monorepo architecture  
✅ **Well-Documented** - Comprehensive guides  
✅ **Modern** - Latest best practices

## Next Steps

- **[Quick Start →](/quick-start)** - Get started in 5 minutes
- **[Architecture →](/architecture)** - Understand the system design
- **[Guides →](/guide)** - Learn best practices
- **[Packages →](/packages)** - Explore shared packages

## Community

- **GitHub:** [github.com/yourusername/orion-kit](https://github.com/yourusername/orion-kit)
- **Issues:** [Report bugs or request features](https://github.com/yourusername/orion-kit/issues)

---

Built with ❤️ for developers who want to ship fast.
