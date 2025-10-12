# 🚀 Orion Kit

A modern, production-ready SaaS starter kit built with Next.js, Clerk, Drizzle, and Neon.

## 📚 Documentation

**Full documentation is available at http://localhost:3004** (when running `pnpm dev`)

Konton på neon och clerk, posthog

https://console.neon.tech/
https://dashboard.clerk.com/
https://eu.posthog.com/project/94036/web
https://app.axiom.co/orion-kit-hpmc/query?did=orion-kit&qid=yPI8wn6jytv-t40s9r

fixa astro
https://starlight.astro.build/getting-started/

skapa ett nytt projekt typ docs2, sen flytta över saker

Or browse the docs directly in `apps/docs/content/`:

- Quick Start Guide
- Architecture Overview
- Package Documentation
- Complete Guides

Run `pnpm docs` to start just the docs app.

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

- **Framework:** Next.js 15 with App Router
- **Authentication:** Clerk
- **Database:** Neon (Serverless Postgres)
- **ORM:** Drizzle ORM
- **Validation:** Zod with drizzle-zod
- **Data Fetching:** TanStack Query
- **Forms:** React Hook Form
- **UI:** shadcn/ui + Tailwind CSS
- **Docs:** Starlight (Astro)
- **Monorepo:** Turborepo

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

| Package               | Description             |
| --------------------- | ----------------------- |
| `@workspace/auth`     | Clerk authentication    |
| `@workspace/database` | Drizzle + Neon + Zod    |
| `@workspace/types`    | Shared TypeScript types |
| `@workspace/ui`       | shadcn/ui components    |

## 🎯 Features

✅ **Full-stack type safety** - From database to UI  
✅ **Runtime validation** - Zod on frontend and backend  
✅ **Modern data fetching** - TanStack Query with caching  
✅ **Beautiful UI** - shadcn/ui components  
✅ **Authentication** - Clerk with protected routes  
✅ **Database** - Serverless Postgres with Drizzle  
✅ **Error handling** - Toast notifications + error boundaries  
✅ **Forms** - React Hook Form with Zod validation  
✅ **Documentation** - Starlight docs site

## 📖 Documentation

Visit **http://localhost:3004** for complete documentation including:

- 📘 Guides and tutorials
- 🏗️ Architecture overview
- 📦 Package API references
- 💡 Best practices
- 🎯 Examples

All documentation is also available in `apps/docs/content/`

## 📝 License

MIT

---

**Built with ❤️ for developers**
