---
title: Quick Start Guide
description: Get up and running with Orion Kit in 5 minutes
---

# 🚀 Orion Kit - Quick Start Guide

Get up and running in 5 minutes!

## Prerequisites

### Required Software

- Node.js 20+
- pnpm installed (`npm install -g pnpm`)

### Required Cloud Accounts

- [Clerk](https://clerk.com) - Authentication (free: 10k MAU)
- [Neon](https://neon.tech) - Database (free: 0.5GB)
- [Axiom](https://axiom.co) - Logging (free: 500MB/month)
- [PostHog](https://posthog.com) - Analytics (free: 1M events/month)
- [Trigger.dev](https://trigger.dev) - Background jobs (free: 100k runs/month)

> **Note**: See the [Accounts Setup Guide](/guide/accounts-setup/) for detailed setup instructions for each service.

## 1️⃣ Clone & Install

```bash
# Clone the repo
git clone <your-repo-url>
cd orion

# Install dependencies
pnpm install
```

## 2️⃣ Set Up Clerk

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Create a new application
3. Copy your API keys

Create these files:

**`apps/app/.env.local`** (Dashboard - Required)

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# API URL
NEXT_PUBLIC_API_URL=http://localhost:3002

# Analytics (Optional)
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

**`apps/api/.env.local`** (API - Required)

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Database (will add in next step)
DATABASE_URL=postgresql://...

# Logging (Optional)
AXIOM_TOKEN=xaat-...
AXIOM_DATASET=orion-logs
```

**`apps/web/.env.local`** (Landing - Optional)

```bash
# Clerk (optional for landing page)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Analytics (Optional)
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

## 3️⃣ Set Up Database

1. Go to [Neon Console](https://console.neon.tech/)
2. Create a new project
3. Copy your connection string

Add to these files:

**`packages/database/.env`**

```bash
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
```

**`apps/api/.env.local`** (append)

```bash
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
```

**`apps/studio/.env.local`**

```bash
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
```

## 4️⃣ Initialize Database

```bash
# Push schema to Neon
pnpm db:push

# Seed with example data (optional)
# First, update userId in packages/database/src/seed.ts to match your Clerk user ID
pnpm db:seed
```

## 5️⃣ Start Development

```bash
pnpm dev
```

This starts **all 5 apps**:

| App           | Port | URL                   | Description   |
| ------------- | ---- | --------------------- | ------------- |
| 🌐 **Web**    | 3000 | http://localhost:3000 | Landing page  |
| 📊 **App**    | 3001 | http://localhost:3001 | Dashboard     |
| 🔌 **API**    | 3002 | http://localhost:3002 | API backend   |
| 🎨 **Studio** | 3003 | http://localhost:3003 | Database GUI  |
| 📚 **Docs**   | 3004 | http://localhost:3004 | Documentation |

## 6️⃣ Test It Out

1. Open http://localhost:3000 - See the landing page
2. Open http://localhost:3004 - Browse this documentation locally!
3. Go to http://localhost:3001 - Dashboard
4. Sign up with Clerk
5. Explore the dashboard and create tasks
6. Visit http://localhost:3003 - Database GUI (Drizzle Studio)

## 🎯 Common Commands

```bash
# Development
pnpm dev                 # Start all apps
pnpm --filter web dev    # Start only landing page
pnpm --filter app dev    # Start only dashboard

# Database
pnpm db:push             # Push schema to database
pnpm db:seed             # Seed with example data
pnpm db:studio           # Open Studio (or visit :3003)
pnpm db:generate         # Generate migrations

# Testing
pnpm test                # Run all unit tests
pnpm test:ui             # Run tests in UI mode
pnpm test:coverage       # Generate coverage report

# Code Quality
pnpm lint                # Lint all apps
pnpm format              # Format code with Prettier

# Build
pnpm build               # Build all apps for production
```

## 🎯 Key Features

### ✅ Authentication (Clerk)

- Sign up, sign in, user management
- Protected routes with middleware
- User sessions with cookies

### ✅ Database (Drizzle + Neon)

- Type-safe queries
- Auto-generated types from schemas
- Migrations and schema management
- Visual database GUI (Studio)

### ✅ Validation (Zod)

- Runtime validation on backend
- Client-side validation in forms
- Same schema on frontend and backend
- Type-safe validation rules

### ✅ Data Fetching (TanStack Query)

- Automatic caching
- Background refetching
- Loading and error states
- Optimistic updates

### ✅ Forms (React Hook Form)

- Minimal re-renders
- Built-in validation with Zod
- Type-safe form data
- Excellent UX

## 🆘 Troubleshooting

### "Unauthorized" Error in Dashboard

1. Make sure you're signed in (check http://localhost:3001/sign-in)
2. Verify Clerk keys are in `.env.local` files
3. Restart dev servers

### CORS Errors

1. Make sure `NEXT_PUBLIC_API_URL=http://localhost:3002` in `apps/app/.env.local`
2. Check that API is running on port 3002
3. Restart all servers

### Database Connection Errors

1. Verify `DATABASE_URL` in all `.env` files
2. Check that Neon database is active
3. Run `pnpm db:push` to ensure schema is up-to-date

### Studio Not Loading

1. Check that Studio has `DATABASE_URL` in `apps/studio/.env.local`
2. Restart Studio: `pnpm --filter studio dev`
3. Try accessing directly at http://localhost:3003

## 📚 Next Steps

- Read the [Architecture Overview](/architecture/overview) to understand the system
- Check the [Auth Package](/packages/auth) documentation
- Review the [Database Package](/packages/database) documentation
- Explore the [Guide](/guide) section for best practices

## 🎉 You're Ready!

Start building your SaaS product! All the foundation is set up:

- ✅ **Authentication** - Clerk with protected routes
- ✅ **Database** - Drizzle ORM + Neon Postgres
- ✅ **Validation** - Zod on frontend and backend
- ✅ **Data Fetching** - TanStack Query with caching
- ✅ **Forms** - React Hook Form with type safety
- ✅ **API** - Type-safe endpoints with shared types
- ✅ **Dashboard** - Full-featured with navigation
- ✅ **Landing Page** - Beautiful and responsive
- ✅ **Studio** - Visual database management
- ✅ **Testing** - Vitest with 16+ passing tests

Happy coding! 🚀
