---
title: Packages
---

Orion Kit is organized as a monorepo with shared packages.

## Available Packages

### [@workspace/auth](/packages/auth)

Authentication package powered by Clerk. Provides:

- Client components (`SignInButton`, `UserButton`, etc.)
- Server utilities (`auth()`, `currentUser()`)
- Middleware helpers
- Full TypeScript support

### [@workspace/database](/packages/database)

Database layer with Drizzle ORM and Neon. Includes:

- Type-safe queries with Drizzle
- Automatic Zod validation schemas
- Serverless Postgres client
- Migration management
- Drizzle Studio integration

### [@workspace/types](/packages/types)

Centralized API response types package:

- Generic API responses (`ApiSuccessResponse<T>`, `CreateResponse<T>`)
- Composed response types (`CreateTaskResponse`, `TasksListResponse`)
- Input types (`CreateTaskInput`, `UpdatePreferencesInput`)
- Type guards and utilities

### [@workspace/ui](/packages/ui)

Shared UI components based on shadcn/ui. Contains:

- Accessible Radix UI components
- Tailwind CSS styling
- Dark mode support
- Reusable across all apps

### @workspace/analytics

Product analytics integration:

- PostHog for event tracking
- Vercel Analytics for performance
- React provider components
- Type-safe analytics events

### @workspace/observability

Structured logging and monitoring:

- Axiom integration for logs
- Request/response logging
- Error tracking
- Performance monitoring
- Web Vitals tracking

### @workspace/jobs

Background job processing:

- Trigger.dev integration
- Scheduled tasks
- Example job implementations
- TypeScript-first job definitions

### [@workspace/payment](/packages/payment)

Stripe payments and subscriptions:

- Checkout session creation
- Webhook event handling
- Subscription management
- Customer portal integration
- Multiple pricing tiers

## Using Packages

All packages are consumed via workspace dependencies:

```json
{
  "dependencies": {
    "@workspace/auth": "workspace:*",
    "@workspace/database": "workspace:*",
    "@workspace/payment": "workspace:*",
    "@workspace/ui": "workspace:*"
  }
}
```

## Package Development

### Adding New Packages

1. Create directory in `packages/`
2. Add `package.json` with `name: "@workspace/package-name"`
3. Update `pnpm-workspace.yaml` (if needed)
4. Install in consuming apps

### Publishing

Packages are private and workspace-only. They are not published to npm.

## Learn More

Click on each package above to see detailed documentation.
