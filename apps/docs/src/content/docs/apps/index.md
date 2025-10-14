---
title: Applications Overview
description: Orion Kit applications and their purposes
---

Orion Kit is organized as a monorepo with multiple applications, each serving a specific purpose in the SaaS ecosystem.

## Applications

| Application                | Purpose          | Port | Description                                      |
| -------------------------- | ---------------- | ---- | ------------------------------------------------ |
| **[API](/apps/api)**       | Backend API      | 3002 | REST API with authentication, database, payments |
| **[App](/apps/app)**       | Main Application | 3001 | User dashboard, tasks, billing, settings         |
| **[Web](/apps/web)**       | Landing Page     | 3000 | Marketing site, documentation links              |
| **[Docs](/apps/docs)**     | Documentation    | 3004 | This documentation site                          |
| **[Studio](/apps/studio)** | Database Studio  | 3003 | Drizzle Studio for database management           |

## Architecture

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│     Web     │    │     App     │    │     API     │
│  (Landing)  │    │ (Dashboard) │    │  (Backend)  │
│   :3000     │    │   :3001     │    │   :3002     │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       └───────────────────┼───────────────────┘
                           │
                   ┌─────────────┐
                   │   Database  │
                   │   (Neon)    │
                   └─────────────┘
```

## Development Workflow

### 1. **Start All Services**

```bash
# Start all applications
pnpm dev

# Or start individually
pnpm --filter web dev      # Landing page
pnpm --filter app dev      # Main app
pnpm --filter api dev      # API server
pnpm --filter docs dev     # Documentation
```

### 2. **Database Management**

```bash
# Open Drizzle Studio
pnpm db:studio

# Run migrations
pnpm db:migrate

# Generate types
pnpm db:generate
```

### 3. **Build & Deploy**

```bash
# Build all applications
pnpm build

# Deploy to Vercel
vercel --prod
```

## Application Details

Each application has its own:

- **Package.json** - Dependencies and scripts
- **Next.js config** - Framework configuration
- **TypeScript config** - Type checking
- **Environment variables** - Service configuration
- **Deployment config** - Vercel/production setup

## Shared Resources

All applications share:

- **Packages** - `@workspace/*` packages for common functionality
- **Types** - Shared TypeScript definitions
- **Database** - Same Drizzle schema and migrations
- **Authentication** - Clerk integration across apps
- **Styling** - Tailwind CSS and shadcn/ui components

## Port Configuration

| App        | Development                               | Production           |
| ---------- | ----------------------------------------- | -------------------- |
| **Web**    | `localhost:3000`                          | `orion-kit.dev`      |
| **App**    | `localhost:3001`                          | `app.orion-kit.dev`  |
| **API**    | `localhost:3002`                          | `api.orion-kit.dev`  |
| **Docs**   | `localhost:3004`                          | `docs.orion-kit.dev` |
| **Studio** | `https://local.drizzle.studio/?port=3003` | Local only           |

## Environment Variables

Each application has its own `.env.local`:

```bash
# apps/web/.env.local - Landing page
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...

# apps/app/.env.local - Main app
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_API_URL=http://localhost:3002
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# apps/api/.env.local - API server
CLERK_SECRET_KEY=sk_test_...
DATABASE_URL=postgresql://...
STRIPE_SECRET_KEY=sk_test_...
```

## Development Tips

### **Cross-App Communication**

```typescript
// apps/app calls apps/api
const response = await fetch("http://localhost:3002/api/tasks");

// Use environment variables for URLs
const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";
```

### **Shared Components**

Import UI components from `@workspace/ui`:

```typescript
import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
```

### **Type Safety**

Import types from `@workspace/types`:

```typescript
import type { Task, CreateTaskInput } from "@workspace/types";
```

## Troubleshooting

### **Port Conflicts**

If ports are already in use:

```bash
# Kill processes on specific ports
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
lsof -ti:3002 | xargs kill -9
```

### **Environment Variables**

Ensure all required env vars are set:

```bash
# Check if env vars are loaded
console.log(process.env.NEXT_PUBLIC_API_URL);
```

### **Database Connection**

Verify database connection:

```bash
# Test connection
pnpm db:studio
```

## Related

- [Architecture Overview](/architecture/overview)
- [Packages Overview](/packages)
- [Deployment Guide](/guide/deployment)
- [Environment Variables](/guide/environment-variables)
