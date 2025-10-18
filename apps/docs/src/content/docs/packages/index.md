---
title: Packages
---

:::tip[TL;DR]
8 shared packages provide common functionality across all apps. Each package has a specific purpose and can be used independently. All packages are type-safe and follow the same patterns.
:::

Shared packages in the Orion Kit monorepo.

## Core Packages

| Package                                      | Purpose                                                     |
| -------------------------------------------- | ----------------------------------------------------------- |
| **[Analytics](/packages/analytics)**         | PostHog + Vercel Analytics                                  |
| **[Auth](/packages/auth)**                   | Custom JWT authentication (client components, server utils) |
| **[Database](/packages/database)**           | Drizzle ORM + Neon Postgres + auto-generated Zod schemas    |
| **[Jobs](/packages/jobs)**                   | Trigger.dev background jobs                                 |
| **[Observability](/packages/observability)** | Axiom logging + Web Vitals                                  |
| **[Payment](/packages/payment)**             | Stripe subscriptions and billing                            |
| **[Types](/packages/types)**                 | Centralized API response types                              |
| **[UI](/packages/ui)**                       | shadcn/ui components (Radix UI + Tailwind)                  |

## Usage

```json
{
  "dependencies": {
    "@workspace/database": "workspace:*"
  }
}
```

**Click each package above for documentation.**
