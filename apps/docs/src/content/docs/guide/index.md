---
title: Guide
---

# Guide

Complete guides for working with Orion Kit.

## Available Guides

### Getting Started

- **[Accounts Setup](/guide/accounts-setup)** - Set up all required cloud services (Clerk, Neon, Stripe, Axiom, PostHog, Trigger.dev)
- **[Environment Variables](/guide/environment-variables)** - Complete reference for all environment variables
- **[Cloud Services](/guide/cloud-services)** - Overview of all integrated services and why we use them
- **[Deployment](/guide/deployment)** - Deploy to Vercel production

### Development

- **[TanStack Query](/guide/tanstack-query)** - Learn how to fetch and manage server state
- **[Forms](/guide/forms)** - Building forms with React Hook Form and Zod
- **[Zod Validation](/guide/zod)** - Runtime validation throughout the stack
- **[Error Handling](/guide/error-handling)** - Comprehensive error handling strategies
- **[Testing](/guide/testing)** - Unit testing with Vitest
- **[E2E Testing](/guide/e2e-testing)** - End-to-end testing with Playwright

### Payments

- **[Stripe Payments](/guide/stripe-payments)** - Complete Stripe integration guide

## Core Concepts

### Type Safety

Orion Kit provides end-to-end type safety from database to UI. See [Type System](/architecture/type-system) for details.

### Validation

All user input is validated with Zod on both frontend and backend using the same schemas. See [Zod Validation](/guide/zod).

### State Management

Server state is managed with TanStack Query, providing automatic caching, background refetching, and optimistic updates. See [TanStack Query](/guide/tanstack-query).

### Data Flow

```
User Input
    ↓
Form (Zod validates)
    ↓
TanStack Query
    ↓
API (Zod validates again)
    ↓
Drizzle ORM
    ↓
Neon Database
```

## Next Steps

- Read the [Architecture Overview](/architecture) to understand the system design
- Check out [Package Documentation](/packages) for detailed API references
- Follow the [Quick Start Guide](/quick-start) to set up your first project
