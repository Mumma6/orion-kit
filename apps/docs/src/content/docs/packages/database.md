---
title: Database Package
description: Drizzle ORM + Neon Postgres
---

# @workspace/database

Type-safe database with **Drizzle ORM** + **Neon** serverless Postgres. Auto-generated types and Zod schemas.

## Setup

```bash
# Get connection string from neon.tech (use Pooled Connection)
# Add to packages/database/.env
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require

# Push schema
pnpm db:push

# Open Studio GUI
pnpm db:studio
```

## Tables

- **`user_preferences`** - User settings, theme, Stripe data
- **`tasks`** - User tasks with status, due dates

## Usage

```typescript
import { db, tasks, userPreferences, eq } from "@workspace/database";

// Query
const userTasks = await db
  .select()
  .from(tasks)
  .where(eq(tasks.clerkUserId, userId));

// Insert
await db.insert(tasks).values({
  clerkUserId: userId,
  title: "Deploy",
  status: "todo",
});

// Update
await db
  .update(userPreferences)
  .set({ theme: "dark" })
  .where(eq(userPreferences.clerkUserId, userId));
```

## Validation

Auto-generated Zod schemas:

```typescript
import { createTaskInputSchema } from "@workspace/database";

const validated = createTaskInputSchema.parse(userInput);
await db.insert(tasks).values({ ...validated, clerkUserId: userId });
```

## Commands

```bash
pnpm db:push      # Push schema to DB
pnpm db:generate  # Generate migrations
pnpm db:studio    # Open Studio GUI (https://local.drizzle.studio)
```

[Drizzle docs](https://orm.drizzle.team) · [Neon docs](https://neon.tech/docs)
