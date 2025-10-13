---
title: Quick Start
description: Get started in 10 minutes
---

# Quick Start

Get Orion Kit running in 10 minutes.

## Prerequisites

- Node.js 20+ + pnpm (`npm install -g pnpm`)
- [Clerk](https://clerk.com) + [Neon](https://neon.tech) accounts (both free)

## Setup

```bash
# 1. Clone & install
git clone <repo-url>
cd orion
pnpm install

# 2. Get Clerk keys
# clerk.com → New Application → Copy API keys

# 3. Get Neon connection string
# neon.tech → New Project → Copy Pooled Connection

# 4. Create env files
cp apps/app/.env.example apps/app/.env.local
cp apps/api/.env.example apps/api/.env.local
cp packages/database/.env.example packages/database/.env

# 5. Add keys to .env files (see below)

# 6. Initialize DB
pnpm db:push

# 7. Start everything
pnpm dev
```

## Environment Variables

**`apps/app/.env.local`:**

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_API_URL=http://localhost:3002
```

**`apps/api/.env.local`:**

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
DATABASE_URL=postgresql://...
```

**`packages/database/.env`:**

```bash
DATABASE_URL=postgresql://...
```

## Running Apps

| App        | Port | URL                   |
| ---------- | ---- | --------------------- |
| **Web**    | 3000 | http://localhost:3000 |
| **App**    | 3001 | http://localhost:3001 |
| **API**    | 3002 | http://localhost:3002 |
| **Studio** | 3003 | http://localhost:3003 |
| **Docs**   | 3004 | http://localhost:3004 |

Visit http://localhost:3001 → Sign up → Create tasks!

## Commands

```bash
pnpm dev               # Start all apps
pnpm db:push           # Push schema
pnpm db:studio         # Open Studio GUI
pnpm test              # Run tests
pnpm build             # Build for production
```

## Troubleshooting

| Issue          | Fix                                           |
| -------------- | --------------------------------------------- |
| "Unauthorized" | Sign in at http://localhost:3001/sign-in      |
| CORS errors    | Check `NEXT_PUBLIC_API_URL` in app/.env.local |
| DB connection  | Verify `DATABASE_URL` uses pooled connection  |

## Next Steps

- [Architecture](/architecture) - Understand the system
- [Guides](/guide) - Learn best practices
- [Packages](/packages) - Explore packages

**You're ready!** Start building. 🚀
