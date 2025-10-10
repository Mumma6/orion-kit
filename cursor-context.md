https://github.com/vercel/next-forge

# 🌌 Orion Kit — Project Overview

**Orion Kit** is a long-term open-source project and a complete, production-grade SaaS boilerplate.
It’s not a quick starter or MVP — it’s a cohesive foundation that demonstrates how a serious, type-safe, cloud-native product can be built from day one.

The project blends a **modern developer experience** with a **calm, cosmic design language**, inspired by the Orion constellation — representing exploration, precision, and confidence.

---

## ✨ Vision

To provide the **definitive TypeScript-first SaaS template** — both a learning resource and a real, ready-to-deploy system.
It should feel like the intersection of **Vercel**, **Supabase**, and **Linear**: clean, modern, type-safe, and delightful to build with.
The stack should remain stable and relevant for many years, not just follow trends.

---

## 🧩 Monorepo Structure

Orion Kit is organized as a **Turborepo** workspace.
Each app and package has a clear domain and responsibility.

```
apps/
  web/        → public landing page (marketing, docs links, GitHub CTA)
  app/        → main dashboard (demo app: Teams + Tasks)
  api/        → serverless API endpoints for internal/external calls
  docs/       → documentation portal (developer guide, setup, philosophy)

packages/
  ui/         → shared design system (Tailwind + Shadcn components)
  db/         → Drizzle schema, migrations, and database utilities
  auth/       → authentication wrappers & user helpers (Clerk)
  email/      → transactional email templates & resend integration
  jobs/       → background jobs, cron tasks (Trigger.dev)
  ai/         → optional AI utilities using Vercel AI SDK / OpenAI
  analytics/  → PostHog + telemetry helpers
  config/     → shared ESLint, Prettier, TS configs
```

---

## ⚙️ Core Technologies and Integrations

| Area                | Technology / Service                            |
| ------------------- | ----------------------------------------------- |
| **Framework**       | Next.js 15 (App Router, React 19 RSC)           |
| **Language**        | TypeScript 5 – strict mode only                 |
| **Styling & UI**    | Tailwind CSS v4 + Shadcn/UI components          |
| **Database**        | Drizzle ORM + PostgreSQL via Neon Cloud         |
| **Authentication**  | Clerk for auth + orgs / teams                   |
| **Payments**        | Stripe Checkout & Webhooks                      |
| **Jobs / Cron**     | Trigger.dev (serverless workers)                |
| **Emails**          | Resend (templated transactional mail)           |
| **Analytics**       | PostHog (product metrics)                       |
| **Error Tracking**  | Sentry                                          |
| **Hosting / Infra** | Vercel (Serverless Functions + Edge Middleware) |
| **AI Utilities**    | Vercel AI SDK / OpenAI integration              |
| **Versioning / CI** | GitHub Actions + Turbo Remote Caching           |
| **Env Management**  | Vercel Env / Dotenv for local dev               |

Each integration exists to make the template feel complete — _ready for production but easy to understand_.

---

## 🪐 Demo Scope (Functional Showcase)

Although Orion Kit is primarily a **technical boilerplate**, it includes small but functional demo features to illustrate real-world flows.

| Module              | Description                                           |
| ------------------- | ----------------------------------------------------- |
| **Auth / Accounts** | Sign-in/out, orgs, team invites via Clerk             |
| **Teams & Tasks**   | Basic CRUD to showcase Drizzle relations + API routes |
| **Billing**         | Stripe integration for subscriptions & usage tiers    |
| **Settings**        | Profile & org preferences (theme, notifications)      |
| **Background Jobs** | Trigger.dev example (job queue, email reminders)      |
| **Emails**          | Resend transactional templates for welcome / invite   |
| **Analytics**       | PostHog event tracking in dashboard                   |

The demo modules exist to make the system believable — not to turn it into a full SaaS.

---

## 🎨 Design Philosophy

- **Theme:** Dark mode first; soft gradients, faint starlight, calm cosmic tone.
- **Typography:** Inter / Geist Sans — clean, confident, modern.
- **Color Palette:** slate-950 backgrounds, neutral surfaces, violet→cyan accents.
- **Motion:** subtle fades / glows; no heavy animation.
- **Tone:** developer-focused, understated, trustworthy.
- **Landing page:** concise hero, short feature list, single demo image, clear CTAs.

Visual language communicates craftsmanship, not marketing.

---

## 🌍 Identity and Intent

**Orion Kit** represents a quiet kind of ambition — a launchpad for builders who value precision, quality, and long-term thinking.
It’s meant to _live_ as a reference for years, evolving slowly as the ecosystem matures.

Core values:

- **Calm clarity** — everything intentional, nothing noisy.
- **Type-safe foundation** — correctness > hacks.
- **Sustainable architecture** — modular, minimal, future-proof.
- **Educational value** — code that teaches by example.

---

## 🧭 Summary

> Orion Kit is a complete open-source SaaS boilerplate built with the modern web stack —
> combining Next.js, TypeScript, Drizzle, Clerk, Stripe, Trigger.dev, and Tailwind UI
> into a unified developer experience.
>
> It showcases real features (teams, tasks, billing) while remaining minimal and elegant.
>
> A project built for longevity — to inspire developers, demonstrate best practices,
> and serve as a calm, cosmic starting point for serious web products.

---
