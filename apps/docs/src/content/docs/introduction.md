---
title: Introduction
description: Production-ready SaaS boilerplate for Next.js
---

:::tip[What is Orion Kit?]
A production-ready SaaS boilerplate that gets you from zero to deployed faster. Built with Next.js 15, TypeScript, and modern tools. Everything you need to launch a SaaS business.
:::

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

## What's Included

### 🎨 **Frontend Applications**

- **Web** - Marketing landing page with SEO optimization
- **App** - Complete user dashboard with tasks, billing, analytics, settings
- **Docs** - Comprehensive documentation site

### 🔧 **Backend & Infrastructure**

- **API** - REST API with authentication, payments, webhooks
- **Database** - Neon Postgres with Drizzle ORM
- **Studio** - Database management interface

### 📦 **Shared Packages**

- **@workspace/ui** - shadcn/ui components with Tailwind CSS
- **@workspace/types** - End-to-end TypeScript definitions
- **@workspace/auth** - Custom JWT authentication system
- **@workspace/database** - Type-safe database operations
- **@workspace/payment** - Stripe subscriptions & billing
- **@workspace/email** - Resend email templates
- **@workspace/analytics** - PostHog integration
- **@workspace/observability** - Axiom logging

### 🚀 **Production Features**

- **Authentication** - Custom JWT with protected routes
- **Payments** - Stripe subscriptions with billing portal
- **Email** - Welcome emails and notifications
- **Analytics** - User behavior tracking and insights
- **Monitoring** - Error tracking and performance metrics
- **Testing** - Unit tests and E2E testing with Playwright

### 🎯 **Key Benefits**

- **Complete SaaS** - Everything you need to launch
- **Type-safe** - End-to-end TypeScript from database to UI
- **Production-ready** - Includes payments, analytics, monitoring
- **No vendor lock-in** - You own all the code
- **Easy to customize** - Modify any part to fit your needs

## Type-Safe Stack

Database Schema → Auto-generated Types → Shared Packages → API + Frontend

Everything is type-safe from database to UI with zero duplication. Change a database column and TypeScript will catch all the places that need updating.

## Quick Start

```bash
# Click "Use this template" on GitHub, then:
git clone https://github.com/YOUR-USERNAME/your-project-name
cd your-project-name
pnpm install
pnpm dev
```

**Next:** [Getting Started →](/getting-started)  
**Learn:** [Architecture →](/architecture) · [Packages →](/packages)

**GitHub:** [github.com/Mumma6/orion-kit](https://github.com/Mumma6/orion-kit)
