# 🚀 Orion Kit

**Production-ready SaaS boilerplate** built with Next.js 15, TypeScript, and modern tools. Get from zero to deployed in minutes.

## ⚡ Quick Start

```bash
# 1. Clone & install
git clone <your-repo>
cd orion
pnpm install

# 2. Set up environment variables (see below)

# 3. Initialize database
pnpm db:push

# 4. Start everything
pnpm dev
```

**Apps running:**

- 🌐 **Landing:** https://orion-kit-web.vercel.app
- 📊 **Dashboard:** https://orion-kit-app.vercel.app
- 🔌 **API:** https://orion-kit-api.vercel.app
- 📚 **Docs:** https://orion-kit-docs.vercel.app

## 🔧 What You Need

**Required accounts** (all have generous free tiers):

| Service                        | Purpose        | Free Tier |
| ------------------------------ | -------------- | --------- |
| [Clerk](https://clerk.com)     | Authentication | 10k users |
| [Neon](https://neon.tech)      | Database       | 0.5GB     |
| [Stripe](https://stripe.com)   | Payments       | No fees   |
| [PostHog](https://posthog.com) | Analytics      | 1M events |
| [Axiom](https://axiom.co)      | Logging        | 500MB/mo  |

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
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

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
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Database
DATABASE_URL=postgresql://...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Axiom
AXIOM_TOKEN=xaat-...
AXIOM_DATASET=orion
```

**`packages/database/.env`:**

```bash
DATABASE_URL=postgresql://...
```

## 🎯 What's Included

- 🔐 **Authentication** - Clerk with protected routes
- 🗄️ **Database** - Neon Postgres + Drizzle ORM
- 💳 **Payments** - Stripe subscriptions + webhooks
- 🎨 **UI** - Shadcn/ui + Tailwind CSS v4
- 📊 **Analytics** - PostHog + Axiom logging
- ⚡ **Jobs** - Trigger.dev background tasks
- 🧪 **Testing** - Vitest + Playwright E2E
- 📚 **Documentation** - Complete guides & API docs

**Type-safe stack:** Database Schema → Auto-generated Types → Shared Packages → API + Frontend

## 📦 Monorepo Structure

| App    | Port | Description            |
| ------ | ---- | ---------------------- |
| `web`  | 3000 | Marketing landing page |
| `app`  | 3001 | Dashboard application  |
| `api`  | 3002 | API backend            |
| `docs` | 3004 | Documentation          |

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

## 🚀 Commands

```bash
pnpm dev               # Start all apps
pnpm db:push           # Push database schema
pnpm db:studio         # Open database GUI
pnpm test              # Run tests
pnpm build             # Build for production
```

## 🔌 Adding Features

Need more? We've got guides for popular integrations:

- **[AI Features](http://localhost:3004/reference/integrations/ai/)** - OpenAI, streaming, chat
- **[Email](http://localhost:3004/reference/integrations/email/)** - Resend, transactional emails
- **[File Uploads](http://localhost:3004/reference/integrations/file-uploads/)** - UploadThing, S3
- **[i18n](http://localhost:3004/reference/integrations/i18n/)** - next-intl, translations
- **[CMS](http://localhost:3004/reference/integrations/cms/)** - Sanity, Contentful
- **[Real-time](http://localhost:3004/reference/integrations/realtime/)** - Pusher, WebSockets

**[View All Integration Guides →](http://localhost:3004/reference/integrations/)**

## 🚨 Troubleshooting

| Issue            | Fix                                           |
| ---------------- | --------------------------------------------- |
| "Unauthorized"   | Sign in at http://localhost:3001/sign-in      |
| CORS errors      | Check `NEXT_PUBLIC_API_URL` in app/.env.local |
| DB connection    | Verify `DATABASE_URL` uses pooled connection  |
| Missing env vars | Check all services are configured             |

## 📚 Documentation

**Complete docs:** http://localhost:3004 (when running `pnpm dev`)

- 🚀 **[Quick Start](http://localhost:3004/quick-start)** - Get started in 5 minutes
- ☁️ **[Accounts Setup](http://localhost:3004/guide/accounts-setup)** - Configure all services
- 🏗️ **[Architecture](http://localhost:3004/architecture/overview)** - System design
- 📦 **[Packages](http://localhost:3004/packages)** - API documentation
- 🔌 **[Integrations](http://localhost:3004/reference/integrations)** - Add features

## 📝 License

MIT

---

**Built with ❤️ for developers**
