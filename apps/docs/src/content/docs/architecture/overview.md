---
title: Architecture Overview
---

Complete architecture documentation for the Orion Kit monorepo.

## Tech Stack Summary

| Layer                  | Technology            | Purpose                    |
| ---------------------- | --------------------- | -------------------------- |
| **Frontend Framework** | Next.js 15 App Router | React 19 with SSR & RSC    |
| **Authentication**     | Clerk                 | User auth and management   |
| **Database**           | Neon (Postgres)       | Serverless database        |
| **ORM**                | Drizzle ORM           | Type-safe database queries |
| **Validation**         | Zod + drizzle-zod     | Runtime validation         |
| **Data Fetching**      | TanStack Query        | Server state management    |
| **Forms**              | React Hook Form       | Form state management      |
| **UI Components**      | shadcn/ui             | Accessible Radix UI        |
| **Styling**            | Tailwind CSS v4       | Utility-first CSS          |
| **Analytics**          | PostHog               | Product analytics          |
| **Logging**            | Axiom                 | Structured logging         |
| **Background Jobs**    | Trigger.dev           | Async task processing      |
| **Testing**            | Vitest                | Unit and integration tests |
| **Documentation**      | Astro Starlight       | Fast docs site             |
| **Monorepo**           | Turborepo             | Build orchestration        |
| **Package Manager**    | pnpm                  | Fast, efficient installs   |

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (App)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ React Hook   │  │  TanStack    │  │   Clerk      │ │
│  │    Form      │  │    Query     │  │  Provider    │ │
│  │  + Zod       │  │  (Caching)   │  │   (Auth)     │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│         │                  │                  │         │
│         └──────────┬───────┴──────────────────┘         │
│                    │                                     │
│              @workspace/types                            │
│         (API response types from packages)               │
└────────────────────┼───────────────────────────────────┘
                     │
                     │ HTTP + Cookies
                     │
┌────────────────────▼───────────────────────────────────┐
│                  API (Backend)                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │    Clerk     │  │     Zod      │  │   Drizzle    │ │
│  │  Middleware  │  │  Validation  │  │     ORM      │ │
│  │    (Auth)    │  │  (Security)  │  │  (Queries)   │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│                                              │          │
└──────────────────────────────────────────────┼─────────┘
                                               │
                                               │ SQL
                                               │
                                      ┌────────▼────────┐
                                      │      Neon       │
                                      │   (Postgres)    │
                                      └─────────────────┘
                                               ▲
                                               │
                                      ┌────────┴────────┐
                                      │  Drizzle Studio │
                                      │   (Port 3003)   │
                                      └─────────────────┘
```

## Data Flow

### Creating a Task (Full Stack)

```
1. User fills form
        ↓
2. React Hook Form validates with Zod (client-side)
        ↓
3. If valid → Submit to API
        ↓
4. API validates with Zod (server-side, same schema!)
        ↓
5. If valid → Drizzle ORM inserts to Neon
        ↓
6. Response returned to frontend
        ↓
7. TanStack Query updates cache
        ↓
8. UI updates automatically
```

### Fetching Tasks

```
1. Component uses useTasks() hook
        ↓
2. TanStack Query checks cache
        ↓
3. If stale → Fetch from API
        ↓
4. API authenticates with Clerk
        ↓
5. Drizzle queries Neon database
        ↓
6. Response with typed data
        ↓
7. TanStack Query caches result
        ↓
8. Component renders with data
```

## Type Safety Flow

```
Drizzle Schema (source of truth)
        ↓
   ┌────┴────┐
   │         │
TypeScript  Zod
  Types    Schemas
   │         │
   └────┬────┴────────────┬────┘
        │                 │
@workspace/database  @workspace/payment
   (DB types)        (Payment types)
        │                 │
   ┌────┴────┐       ┌────┴────┐
   │         │
  API      App
```

### Example

```typescript
// 1. Define in Drizzle
export const tasks = pgTable("tasks", {
  id: integer().primaryKey(),
  title: varchar({ length: 255 }).notNull(),
});

// 2. Generate types automatically
export type Task = typeof tasks.$inferSelect;

// 3. Generate Zod schema automatically
export const insertTaskSchema = createInsertSchema(tasks);

// 4. Use in API
const validated = insertTaskSchema.parse(body);

// 5. Use in Frontend
const form = useForm({
  resolver: zodResolver(insertTaskSchema),
});
```

## Package Dependencies

```
@workspace/auth
  └── @clerk/nextjs

@workspace/database
  ├── drizzle-orm
  ├── @neondatabase/serverless
  ├── drizzle-kit (dev)
  ├── zod
  └── drizzle-zod

@workspace/types
  ├── Generic API responses
  ├── Composed response types
  └── Input types

@workspace/ui
  └── React + Radix UI + Tailwind

@workspace/analytics
  ├── posthog-js
  ├── posthog-node
  └── @vercel/analytics

@workspace/observability
  ├── @axiomhq/nextjs
  └── Web Vitals

@workspace/jobs
  └── @trigger.dev/sdk

apps/web (Landing)
  ├── @workspace/ui
  └── @workspace/analytics

apps/app (Dashboard)
  ├── @workspace/auth
  ├── @workspace/database
  ├── @workspace/payment
  ├── @workspace/types
  ├── @workspace/ui
  ├── @workspace/analytics
  ├── @workspace/observability
  ├── @tanstack/react-query
  ├── react-hook-form
  ├── @hookform/resolvers
  └── sonner (toasts)

apps/api (Backend)
  ├── @workspace/auth
  ├── @workspace/database
  ├── @workspace/payment
  ├── @workspace/types
  ├── @workspace/observability
  └── zod

apps/studio (Database GUI)
  ├── @workspace/database
  └── drizzle-kit

apps/docs (Documentation)
  └── @astrojs/starlight
```

## Security Layers

### 1. Authentication (Clerk)

- Middleware protects routes
- Session cookies (HTTP-only)
- User context available server-side

### 2. Validation (Zod)

- Client-side (UX + early catch)
- Server-side (security + data integrity)
- Same schema both places

### 3. Type Safety (TypeScript)

- Compile-time checks
- Auto-generated from database
- Shared across monorepo

### 4. CORS (Cross-Origin)

- Specific origin allowlist
- Credentials enabled
- Secure cookie sharing

## Performance Optimizations

### TanStack Query

- Request deduplication
- Automatic caching
- Background refetching
- Optimistic updates

### React Hook Form

- Uncontrolled inputs (minimal re-renders)
- Built-in validation
- Async validation support
- Form state management

### Drizzle ORM

- Lightweight (no runtime overhead)
- SQL-like syntax
- Prepared statements
- Connection pooling with Neon

### Next.js

- App Router (React Server Components)
- Automatic code splitting
- Image optimization
- Turbopack (fast bundler)

## Development Workflow

### 1. Schema Changes

```bash
# Edit schema
vim packages/database/src/schema.ts

# Generate migration
pnpm db:generate

# Push to database
pnpm db:push

# Zod schemas auto-update (drizzle-zod)
# TypeScript types auto-update (Drizzle inference)
# No manual type updates needed! ✅
```

### 2. Adding API Endpoints

```bash
# 1. Create route
apps/api/app/resource/route.ts

# 2. Use database types and schemas
import { type Resource, resourceSchema } from "@workspace/database";

# 3. Validate with Zod
const validated = resourceSchema.parse(body);

# 4. Query with Drizzle
await db.insert(resource).values(validated);
```

### 3. Adding Forms

```bash
# 1. Import schema
import { resourceSchema } from "@workspace/database";

# 2. Create form
const form = useForm({
  resolver: zodResolver(resourceSchema),
});

# 3. Render with FormField
<FormField control={form.control} name="field" ... />
```

## Deployment

### Environment Variables

Each app needs its environment variables:

**Production Checklist:**

- ✅ Set Clerk keys (production values)
- ✅ Set DATABASE_URL (Neon production)
- ✅ Set NEXT_PUBLIC_API_URL (production API URL)
- ✅ Configure CORS for production origin
- ✅ Run migrations (`pnpm db:migrate`)

### Build Commands

```bash
# Build all apps
pnpm build

# Build specific app
pnpm --filter web build
pnpm --filter app build
pnpm --filter api build
```

### Recommended Hosting

- **Frontend (web, app):** Vercel
- **API:** Vercel (or Railway, Render)
- **Database:** Neon (already configured)
- **Studio:** Dev-only, don't deploy

## Scalability

### Horizontal Scaling

- ✅ Stateless API (scales with load)
- ✅ Neon autoscaling
- ✅ Next.js edge functions ready

### Code Organization

- ✅ Monorepo (shared code, isolated apps)
- ✅ Package-based architecture
- ✅ Clear boundaries between layers

### Performance

- ✅ Server Components (less client JS)
- ✅ TanStack Query caching
- ✅ Drizzle prepared statements
- ✅ Neon connection pooling

## Best Practices Enforced

1. **Type Safety** - TypeScript everywhere
2. **Single Source of Truth** - Database schema drives everything
3. **Validation** - Zod on client and server
4. **Caching** - TanStack Query handles it
5. **Security** - Clerk + Zod + TypeScript
6. **DX** - Fast feedback loops, great tooling

## Learn More

### Core Concepts

- [Type System](/architecture/type-system) - How types flow through the stack
- [Type Flow](/architecture/type-flow) - Complete type flow diagram

### Guides

- [TanStack Query](/guide/tanstack-query) - Data fetching and caching
- [Forms](/guide/forms) - React Hook Form with Zod
- [Error Handling](/guide/error-handling) - Error handling strategies
- [Testing](/guide/testing) - Unit testing with Vitest

### Package Docs

- [Auth Package](/packages/auth)
- [Database Package](/packages/database)
- [Types Package](/packages/types)
- [UI Package](/packages/ui)

## Summary

Orion Kit provides a **production-ready foundation** with:

🎯 **Type Safety** - From database to UI  
🔒 **Security** - Auth + validation  
⚡ **Performance** - Caching + optimization  
🎨 **Great DX** - Modern tooling  
📦 **Scalable** - Monorepo architecture

Everything is connected and works together seamlessly! 🚀
