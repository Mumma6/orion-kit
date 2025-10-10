---
title: Quick Start Guide
description: Get up and running with Orion Kit in 5 minutes
---

# 🚀 Orion Kit - Quick Start Guide

Get up and running in 5 minutes!

## Prerequisites

- Node.js 20+
- pnpm installed (`npm install -g pnpm`)
- [Clerk account](https://dashboard.clerk.com/)
- [Neon database](https://console.neon.tech/)

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

**`apps/web/.env.local`**

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

**`apps/app/.env.local`**

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_API_URL=http://localhost:3002
```

**`apps/api/.env.local`**

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
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

This starts **all 4 apps**:

| App           | Port | URL                   | Description  |
| ------------- | ---- | --------------------- | ------------ |
| 🌐 **Web**    | 3000 | http://localhost:3000 | Landing page |
| 📊 **App**    | 3001 | http://localhost:3001 | Dashboard    |
| 🔌 **API**    | 3002 | http://localhost:3002 | API backend  |
| 🎨 **Studio** | 3003 | http://localhost:3003 | Database GUI |

## 6️⃣ Test It Out

1. Open http://localhost:3000 - See the landing page
2. Click "Dashboard" or go to http://localhost:3001
3. Sign up with Clerk
4. Explore the dashboard
5. Click "Fetch Tasks" to test the API
6. Visit http://localhost:3003 to see Studio

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

- Read [README.md](./README.md) for full documentation
- Check [packages/auth/README.md](./packages/auth/README.md) for auth details
- Review [packages/database/README.md](./packages/database/README.md) for database info
- Explore [apps/studio/README.md](./apps/studio/README.md) for Studio features

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
