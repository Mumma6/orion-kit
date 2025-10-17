---
title: Architecture Overview
---

## Tech Stack

| Layer             | Technology            | Purpose                                 |
| ----------------- | --------------------- | --------------------------------------- |
| **Frontend**      | Next.js 15 App Router | React 19, SSR, RSC                      |
| **Auth**          | Custom JWT            | User management                         |
| **Database**      | Neon + Drizzle ORM    | Serverless Postgres + type-safe queries |
| **Payments**      | Stripe                | Subscriptions + checkout                |
| **Email**         | Resend                | Transactional emails                    |
| **Validation**    | Zod                   | Runtime validation                      |
| **Data Fetching** | TanStack Query        | Server state + caching                  |
| **Forms**         | React Hook Form       | Form management                         |
| **UI**            | shadcn/ui + Tailwind  | Components + styling                    |
| **Analytics**     | PostHog + Axiom       | Events + logging                        |
| **Jobs**          | Trigger.dev           | Background tasks                        |
| **Monorepo**      | Turborepo + pnpm      | Build + packages                        |

## Data Flow

**Creating a task:**

```
User fills form
  ↓
Zod validates (client)
  ↓
Submit to API
  ↓
Zod validates (server)
  ↓
Drizzle inserts
  ↓
TanStack Query updates cache
  ↓
UI updates
```

**Fetching tasks:**

```
Component calls useTasks()
  ↓
TanStack Query checks cache
  ↓
If stale, fetch from API
  ↓
JWT auth verification
  ↓
Drizzle queries Neon
  ↓
Cache result
  ↓
Render
```

## Type Flow

```
Drizzle Schema (source of truth)
    ↓
TypeScript Types + Zod Schemas (auto-generated with Drizzle-Zod)
    ↓
@workspace/database exports entities + schemas
    ↓
@workspace/types re-exports + composes API responses
    ↓
API + Frontend import ONLY from @workspace/types
```

**Example:**

```typescript
// 1. Define in Drizzle
export const tasks = pgTable("tasks", { id: integer(), title: varchar() });

// 2. Auto-generated with Drizzle Zod
export type Task = typeof tasks.$inferSelect;
export const insertTaskSchema = createInsertSchema(tasks);

// 3. Use everywhere
const validated = insertTaskSchema.parse(body); // API
const form = useForm({ resolver: zodResolver(insertTaskSchema) }); // Frontend
```

See [Type System](/architecture/type-system) and [Type Flow](/architecture/type-flow) for details.

## Key Principles

1. **Database schema = source of truth** - Everything derives from it
2. **Validate twice** - Client (UX) + server (security)
3. **Type-safe everywhere** - @workspace/types ensures API/frontend alignment
4. **Cache by default** - TanStack Query handles it
5. **Monorepo** - Share code, isolate apps

[Deployment Guide](/guide/deployment) · [Package Docs](/packages)
