# 🚀 Orion Kit

**Production-ready SaaS boilerplate** with authentication, payments, analytics, and everything a modern project needs. Perfect for learning modern full-stack development or starting your next project.

## 🎯 What's Included

**Apps:**

- 🌐 **Landing Page** (`web`) - Marketing site
- 📊 **Dashboard** (`app`) - Admin app with tasks, billing, analytics & TanStack Query
- 🔌 **Serverless API** (`api`) - Next.js 15 API routes with Zod validation
- 📚 **Documentation** (`docs`) - Astro-powered docs with Starlight

**Features:**

- ⚡ **Monorepo** - Turborepo for blazing fast builds and caching
- 🔐 **Authentication** - Custom JWT with protected routes & bcrypt
- 🗄️ **Database** - Neon Postgres + Drizzle ORM with drizzle-zod
- 🔄 **Data Fetching** - TanStack Query with optimistic updates
- 💳 **Payments** - Stripe subscriptions + webhooks
- 📧 **Email** - Resend with React Email templates
- 🎨 **UI** - Shadcn/ui + Tailwind CSS v4 + Radix UI primitives
- 📊 **Analytics** - PostHog tracking + Axiom logging
- ⚡ **Jobs** - Trigger.dev background tasks
- 🧪 **Testing** - Vitest unit tests + Playwright E2E
- 📝 **Forms** - React Hook Form + Zod validation
- 🎨 **Theming** - Dark mode with next-themes

**Type-safe stack:** Database Schema → Auto-generated Types → Shared Packages → API + Frontend

## ⚡ Quick Start

```bash
# 1. Use this template
# Click "Use this template" on GitHub, then:
git clone https://github.com/YOUR-USERNAME/your-project-name
cd your-project-name
pnpm install

# 2. Set up environment variables (see below)

# 3. Rename the project
Change "orion-kit" to your own project name in:
- `package.json` files
- Documentation
- Environment variables
- GitHub repository name

# 4. Initialize database
pnpm db:push

# 5. Start everything
pnpm dev
```

**Apps running:**

- 🌐 **Landing:** http://localhost:3000
- 📊 **Dashboard:** http://localhost:3001
- 🔌 **API:** http://localhost:3002
- 🎨 **Studio:** https://local.drizzle.studio?port=3003
- 📚 **Docs:** http://localhost:3004

## 🔧 What You Need

**Required accounts** (all have generous free tiers):

| Service                        | Purpose   | Free Tier |
| ------------------------------ | --------- | --------- |
| [Neon](https://neon.tech)      | Database  | 0.5GB     |
| [Stripe](https://stripe.com)   | Payments  | No fees   |
| [Resend](https://resend.com)   | Email     | 3k emails |
| [PostHog](https://posthog.com) | Analytics | 1M events |
| [Axiom](https://axiom.co)      | Logging   | 500MB/mo  |

## 🛠️ Environment Setup

**1. Create `.env.local` files:**

```bash
cp apps/app/.env.example apps/app/.env.local
cp apps/api/.env.example apps/api/.env.local
cp packages/database/.env.example packages/database/.env
```

**2. Add your API keys** (get them from the services above):

**`apps/app/.env.local`:**

```bash
# API
NEXT_PUBLIC_API_URL=http://localhost:3002

# PostHog
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

**`apps/api/.env.local`:**

```bash
# Database
DATABASE_URL=postgresql://...

# JWT Authentication
AUTH_JWT_SECRET=your-jwt-secret-key-here

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email (Resend)
RESEND_API_KEY=re_...
FROM_EMAIL=onboarding@resend.dev

# Axiom
AXIOM_TOKEN=xaat-...
AXIOM_DATASET=orion
```

**`packages/database/.env`:**

```bash
DATABASE_URL=postgresql://...
```

## 📦 Monorepo Structure

| App    | Port | Description            |
| ------ | ---- | ---------------------- |
| `web`  | 3000 | Marketing landing page |
| `app`  | 3001 | Dashboard application  |
| `api`  | 3002 | API backend            |
| `docs` | 3004 | Documentation          |

| Package                    | Description                          |
| -------------------------- | ------------------------------------ |
| `@workspace/auth`          | JWT authentication + user management |
| `@workspace/database`      | Drizzle ORM + Neon + Zod schemas     |
| `@workspace/email`         | Resend + React Email templates       |
| `@workspace/types`         | Shared TypeScript types              |
| `@workspace/ui`            | Shadcn/ui + Radix UI components      |
| `@workspace/payment`       | Stripe payments + subscriptions      |
| `@workspace/analytics`     | PostHog tracking + Vercel Analytics  |
| `@workspace/observability` | Axiom logging + Web Vitals           |
| `@workspace/jobs`          | Trigger.dev background jobs          |

## 🏗️ Architecture

**Type-safe monorepo** with end-to-end type safety. Database schema generates Zod schemas, which flow through shared types to both API and frontend.

- **Flow:** Database → Zod Validation → Types → API Routes → TanStack Query hooks
- **Same source of truth:** Zod schemas validate on server and provide types on client
- **Monorepo flexibility:** Swap API framework, ORM, or UI library without breaking changes
- **Benefit:** Modify database schema and get compile-time errors across the entire stack

## 🚀 Commands

```bash
pnpm dev               # Start all apps
pnpm db:push           # Push database schema
pnpm db:studio         # Open database GUI
pnpm test              # Run tests
pnpm build             # Build for production
```

## 📚 Documentation

For more in depth documentation and explanations, please look at the official documentation side: https://orion-kit-docs.vercel.app/

## 📝 License

MIT

---

**Built with ❤️ for developers**
