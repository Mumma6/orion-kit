---
title: Guide
---

# Guides

## Getting Started

- **[Accounts Setup](/guide/accounts-setup)** - Cloud services setup (Clerk, Neon, Stripe)
- **[Environment Variables](/guide/environment-variables)** - All env vars reference
- **[Cloud Services](/guide/cloud-services)** - Service overview
- **[Deployment](/guide/deployment)** - Deploy to Vercel

## Development

- **[TanStack Query](/guide/tanstack-query)** - Data fetching + caching
- **[Forms](/guide/forms)** - React Hook Form + Zod
- **[Zod Validation](/guide/zod)** - Runtime validation
- **[Error Handling](/guide/error-handling)** - Error strategies
- **[Testing](/guide/testing)** - Vitest unit tests
- **[E2E Testing](/guide/e2e-testing)** - Playwright smoke tests

## Payments

- **[Stripe Payments](/guide/stripe-payments)** - Stripe integration

## Core Concepts

**Type Safety:** Database → auto-generated types → used everywhere  
**Validation:** Same Zod schema on client + server  
**State:** TanStack Query handles caching + refetching

**Data flow:** `User input → Form validates → API validates → DB → Cache → UI`

See [Architecture](/architecture) for system design.
