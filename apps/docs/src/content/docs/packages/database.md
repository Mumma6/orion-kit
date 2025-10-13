---
title: Database Package
description: Type-safe database with Drizzle ORM and Neon
---

# @workspace/database

Database package powered by [Drizzle ORM](https://orm.drizzle.team) and [Neon](https://neon.tech) for type-safe, serverless Postgres.

## Features

- ✅ Type-safe database queries with Drizzle ORM
- ✅ Runtime validation with Zod (via drizzle-zod)
- ✅ Serverless Postgres with Neon
- ✅ HTTP-based connections (fast for serverless)
- ✅ Schema management with migrations
- ✅ Drizzle Studio for database GUI

## Installation

This package is already included in the workspace. To use it in your app:

```json
{
  "dependencies": {
    "@workspace/database": "workspace:*"
  }
}
```

## Environment Variables

Add to your `.env.local` file:

```bash
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
```

Get your connection string from [Neon Console](https://console.neon.tech).

## Database Schema

### Tables

**`user_preferences`** - App-specific user settings

- Links to Clerk users via `clerkUserId`
- Stores theme, language, notifications, etc.

**`tasks`** - User tasks

- Task management with status, due dates
- Linked to Clerk users

## Usage

### 1. Set up your `.env`

```bash
# In packages/database/.env
DATABASE_URL=your_neon_connection_string
```

### 2. Validation with Zod

This package includes Zod schemas generated from Drizzle schemas for runtime validation:

```typescript
import {
  db,
  tasks,
  createTaskInputSchema, // Zod schema
} from "@workspace/database";

// Validate user input
const validatedData = createTaskInputSchema.parse(userInput);

// Now safe to insert
await db.insert(tasks).values({
  clerkUserId: userId,
  ...validatedData,
});
```

See [ZOD_VALIDATION.md](./ZOD_VALIDATION.md) for complete documentation.

### 2. Generate and run migrations

```bash
# Generate migration files from schema
pnpm --filter @workspace/database db:generate

# Push changes to database
pnpm --filter @workspace/database db:push

# Or run migrations
pnpm --filter @workspace/database db:migrate
```

### 3. Use in your app

```typescript
import { db, tasks, userPreferences, eq } from "@workspace/database";

// Get all tasks for a user
const userTasks = await db
  .select()
  .from(tasks)
  .where(eq(tasks.clerkUserId, userId));

// Create a new task
await db.insert(tasks).values({
  clerkUserId: userId,
  title: "My new task",
  description: "Task description",
  status: "todo",
});

// Update user preferences
await db
  .update(userPreferences)
  .set({ theme: "dark" })
  .where(eq(userPreferences.clerkUserId, userId));
```

## Available Scripts

```bash
# Generate migrations from schema changes
pnpm db:generate

# Push schema directly to database (good for dev)
pnpm db:push

# Run migrations
pnpm db:migrate

# Pull schema from database
pnpm db:pull

# Open Drizzle Studio (database GUI)
pnpm db:studio

# Check migrations
pnpm db:check
```

## Schema Structure

### User Preferences

```typescript
{
  id: number;
  clerkUserId: string;
  theme: string | null;
  language: string | null;
  timezone: string | null;
  emailNotifications: string | null;
  pushNotifications: string | null;
  createdAt: Date;
  updatedAt: Date;
}
```

### Tasks

```typescript
{
  id: number;
  clerkUserId: string;
  title: string;
  description: string | null;
  status: "todo" | "in-progress" | "completed" | "cancelled";
  dueDate: Date | null;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
```

## Query Examples

### Get User's Tasks

```typescript
import { db, tasks, eq, desc } from "@workspace/database";

const userTasks = await db
  .select()
  .from(tasks)
  .where(eq(tasks.clerkUserId, userId))
  .orderBy(desc(tasks.createdAt));
```

### Create Task

```typescript
const newTask = await db
  .insert(tasks)
  .values({
    clerkUserId: userId,
    title: "Deploy to production",
    description: "Deploy Orion Kit to Vercel",
    status: "todo",
    dueDate: new Date("2024-02-01"),
  })
  .returning();
```

### Update Task Status

```typescript
await db
  .update(tasks)
  .set({
    status: "completed",
    completedAt: new Date(),
    updatedAt: new Date(),
  })
  .where(eq(tasks.id, taskId));
```

### Get or Create User Preferences

```typescript
import { db, userPreferences, eq } from "@workspace/database";

async function getUserPreferences(clerkUserId: string) {
  const prefs = await db
    .select()
    .from(userPreferences)
    .where(eq(userPreferences.clerkUserId, clerkUserId))
    .limit(1);

  if (prefs.length === 0) {
    // Create default preferences
    const [newPrefs] = await db
      .insert(userPreferences)
      .values({ clerkUserId })
      .returning();
    return newPrefs;
  }

  return prefs[0];
}
```

## Drizzle Studio

Open the database GUI:

```bash
pnpm --filter @workspace/database db:studio
```

Then visit: `https://local.drizzle.studio`

## Learn More

- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview)
- [Neon Documentation](https://neon.tech/docs/introduction)
- [Drizzle + Neon Guide](https://orm.drizzle.team/docs/get-started/neon-new)
