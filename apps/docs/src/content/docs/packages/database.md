---
title: Database Package
description: Drizzle ORM + Neon Postgres
---

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

## Validation with Drizzle-Zod

**Drizzle-Zod** automatically generates Zod schemas from your Drizzle tables, ensuring validation stays in sync with your database schema.

### How It Works

```typescript
import { pgTable, integer, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

// 1. Define Drizzle table
export const tasks = pgTable("tasks", {
  id: integer().primaryKey(),
  clerkUserId: varchar({ length: 255 }).notNull(),
  title: varchar({ length: 255 }).notNull(),
  status: varchar({ length: 50 }).notNull().default("todo"),
});

// 2. Auto-generate Zod schemas
export const insertTaskSchema = createInsertSchema(tasks);
export const selectTaskSchema = createSelectSchema(tasks);

// 3. Customize validation (optional)
export const createTaskInputSchema = createInsertSchema(tasks, {
  title: (schema) => schema.min(1).max(255),
  status: (schema) => schema.regex(/^(todo|in-progress|completed)$/),
}).omit({
  id: true,
  clerkUserId: true,
});
```

### Benefits

- ✅ **Single source of truth** - Schema changes automatically update validation
- ✅ **Type-safe** - TypeScript + runtime validation from same definition
- ✅ **Less code** - No manual Zod schema duplication
- ✅ **Customizable** - Refine validation rules per field

### Usage

```typescript
import { createTaskInputSchema } from "@workspace/database";

// Validate user input
const validated = createTaskInputSchema.parse(userInput);

// Insert validated data
await db.insert(tasks).values({
  ...validated,
  clerkUserId: userId,
});
```

## Commands

```bash
pnpm db:push      # Push schema to DB
pnpm db:generate  # Generate migrations
pnpm db:studio    # Open Studio GUI (https://local.drizzle.studio)
```

[Drizzle docs](https://orm.drizzle.team) · [Neon docs](https://neon.tech/docs)
