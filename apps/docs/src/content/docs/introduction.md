---
title: Introduction
description: Welcome to Orion Kit - a modern, production-ready SaaS starter kit
---

# Introduction

Welcome to **Orion Kit** - a modern, production-ready SaaS starter kit.

## What is Orion Kit?

Orion Kit is a comprehensive monorepo starter that provides everything you need to build a modern SaaS application:

- 🔐 **Authentication** - Ready-to-use Clerk integration
- 🗄️ **Database** - Serverless Postgres with type-safe queries
- ✅ **Validation** - Runtime validation with Zod
- 🎨 **UI** - Beautiful shadcn/ui components
- 📊 **Dashboard** - Full-featured admin panel
- 🌐 **Landing Page** - Marketing site template
- 🔌 **API** - Type-safe backend with validation

## Quick Start

New to Orion Kit? Check out the [Quick Start Guide](/quick-start) to get up and running in 5 minutes!

## Features

### 🚀 Modern Tech Stack

- **Next.js 15** - App Router with Server Components
- **TypeScript** - Full type safety
- **Tailwind CSS** - Utility-first styling
- **Turborepo** - Optimized monorepo builds

### 🔒 Security & Validation

- **Clerk** - Production-ready authentication
- **Zod** - Runtime validation on client and server
- **Type Safety** - End-to-end TypeScript coverage

### 📦 Developer Experience

- **TanStack Query** - Automatic caching and state management
- **React Hook Form** - Performant forms with validation
- **Drizzle Studio** - Visual database management
- **Error Handling** - Toast notifications and error boundaries
- **Hot Reload** - Fast development with Turbopack

## Apps & Packages

### Applications

| App        | Port | Description             |
| ---------- | ---- | ----------------------- |
| **web**    | 3000 | Marketing landing page  |
| **app**    | 3001 | Dashboard application   |
| **api**    | 3002 | API backend             |
| **studio** | 3003 | Database GUI            |
| **docs**   | 3004 | This documentation site |

### Shared Packages

- **[@workspace/auth](/packages/auth)** - Authentication utilities
- **[@workspace/database](/packages/database)** - Database and ORM
- **[@workspace/types](/packages/types)** - Shared types
- **[@workspace/ui](/packages/ui)** - UI component library

## Architecture Highlights

### Type Flow

```
Drizzle Schema (database)
        ↓
   TypeScript Types + Zod Schemas
        ↓
    @workspace/types
        ↓
   ┌────┴────┐
   │         │
Backend    Frontend
(Validates) (Validates)
```

See [Architecture](/architecture) for complete details.

### Data Flow

```
User Input
    ↓
Form Validation (Zod)
    ↓
TanStack Query
    ↓
API Validation (Zod, same schema!)
    ↓
Drizzle ORM
    ↓
Neon Database
```

## Why Orion Kit?

✅ **Production-Ready** - Battle-tested tools and patterns  
✅ **Type-Safe** - Catch errors at compile-time  
✅ **Validated** - Runtime safety with Zod  
✅ **Fast DX** - Hot reload, great tooling  
✅ **Scalable** - Monorepo architecture  
✅ **Well-Documented** - Comprehensive guides  
✅ **Modern** - Latest best practices

## Next Steps

- **[Quick Start →](/quick-start)** - Get started in 5 minutes
- **[Architecture →](/architecture)** - Understand the system design
- **[Guides →](/guide)** - Learn best practices
- **[Packages →](/packages)** - Explore shared packages

## Community

- **GitHub:** [github.com/yourusername/orion-kit](https://github.com/yourusername/orion-kit)
- **Issues:** [Report bugs or request features](https://github.com/yourusername/orion-kit/issues)

---

Built with ❤️ for developers who want to ship fast.
