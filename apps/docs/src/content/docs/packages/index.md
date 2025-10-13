---
title: Packages
---

# Packages

Shared packages in the Orion Kit monorepo.

## Core Packages

| Package                                       | Purpose                                                  |
| --------------------------------------------- | -------------------------------------------------------- |
| **[@workspace/auth](/packages/auth)**         | Clerk authentication (client components, server utils)   |
| **[@workspace/database](/packages/database)** | Drizzle ORM + Neon Postgres + auto-generated Zod schemas |
| **[@workspace/types](/packages/types)**       | Centralized API response types                           |
| **[@workspace/ui](/packages/ui)**             | shadcn/ui components (Radix UI + Tailwind)               |
| **[@workspace/payment](/packages/payment)**   | Stripe subscriptions and billing                         |
| **@workspace/analytics**                      | PostHog + Vercel Analytics                               |
| **@workspace/observability**                  | Axiom logging + Web Vitals                               |
| **@workspace/jobs**                           | Trigger.dev background jobs                              |

## Usage

```json
{
  "dependencies": {
    "@workspace/auth": "workspace:*",
    "@workspace/database": "workspace:*"
  }
}
```

**Click each package above for documentation.**
