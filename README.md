# 🚀 Orion Kit

**Production-ready SaaS boilerplate** built with Next.js 15, TypeScript, and modern tools. Get from zero to deployed in minutes.

## 🎯 What's Included

- 🔐 **Authentication** - Custom JWT with protected routes
- 🗄️ **Database** - Neon Postgres + Drizzle ORM
- 💳 **Payments** - Stripe subscriptions + webhooks
- 📧 **Email** - Resend with React Email templates
- 🎨 **UI** - Shadcn/ui + Tailwind CSS v4
- 📊 **Analytics** - PostHog + Axiom logging
- ⚡ **Jobs** - Trigger.dev background tasks
- 🧪 **Testing** - Vitest + Playwright E2E
- 📚 **Documentation** - Complete guides & API docs

**Type-safe stack:** Database Schema → Auto-generated Types → Shared Packages → API + Frontend

## ⚡ Quick Start

```bash
# 1. Clone & install
git clone <your-repo>
cd orion
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
| `@workspace/analytics`     | PostHog + Vercel Analytics           |
| `@workspace/observability` | Axiom logging + Web Vitals           |
| `@workspace/jobs`          | Trigger.dev background jobs          |

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

- **[Auth Providers](/reference/integrations/auth/)** - Clerk, Auth0, Better Auth
- **[AI Features](/reference/integrations/ai/)** - OpenAI, streaming, chat
- **[Email](/reference/integrations/email/)** - Resend, already included!
- **[File Uploads](/reference/integrations/file-uploads/)** - UploadThing, S3
- **[i18n](/reference/integrations/i18n/)** - next-intl, translations
- **[CMS](/reference/integrations/cms/)** - Sanity, Contentful
- **[Real-time](/reference/integrations/realtime/)** - Pusher, WebSockets
- **[Rate Limiting](/reference/integrations/rate-limiting/)** - Upstash Redis, API protection

**[View All Integration Guides →](/reference/integrations/)**

## 🚨 Troubleshooting

| Issue            | Fix                                           |
| ---------------- | --------------------------------------------- |
| "Unauthorized"   | Sign in at http://localhost:3001/login        |
| CORS errors      | Check `NEXT_PUBLIC_API_URL` in app/.env.local |
| DB connection    | Verify `DATABASE_URL` uses pooled connection  |
| Email not sent   | Check `RESEND_API_KEY` and `FROM_EMAIL`       |
| Missing env vars | Check all services are configured             |

## 📚 Documentation

**Complete docs:** http://localhost:3004 (when running `pnpm dev`)

- 🚀 **[Quick Start](/quick-start)** - Get started in 5 minutes
- ☁️ **[Accounts Setup](/guide/accounts-setup)** - Configure all services
- 🏗️ **[Architecture](/architecture/overview)** - System design
- 📦 **[Packages](/packages)** - API documentation
- 🔌 **[Integrations](/reference/integrations)** - Add features

## 📝 License

MIT

---

**Built with ❤️ for developers**
