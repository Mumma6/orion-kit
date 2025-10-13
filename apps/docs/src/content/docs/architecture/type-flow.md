---
title: Type Flow Diagram
description: How types flow through the stack
---

# Type Flow Diagram

How types flow from database schema through the entire stack.

## Complete Flow

```
┌──────────────────────────────────┐
│      DATABASE SCHEMA             │
│  packages/database/src/schema.ts │
│                                  │
│  export const tasks = pgTable({  │
│    id: integer(),                │
│    title: varchar(),             │
│  });                             │
└──────────────┬───────────────────┘
               │ Drizzle Inference
       ┌───────┴────────┐
       │                │
   TypeScript        Zod
     Types         Schemas
       │                │
       └───────┬────────┘
               │
    @workspace/database
    (exported)
               │
       ┌───────┴────────┐
       │                │
  @workspace/      @workspace/
    types            payment
  (composes)      (domain types)
       │                │
       └───────┬────────┘
               │
      ┌────────┴─────────┐
      │                  │
  API Routes      Frontend Hooks
```

## Layer by Layer

### 1. Database Schema

```typescript
// packages/database/src/schema.ts
export const tasks = pgTable("tasks", {
  id: integer().primaryKey(),
  title: varchar({ length: 255 }).notNull(),
});

// Auto-generated
export type Task = typeof tasks.$inferSelect;
export const insertTaskSchema = createInsertSchema(tasks);
```

### 2. Types Package

```typescript
// packages/types/src/tasks.ts
import type { Task } from "@workspace/database";

export type CreateTaskInput = Omit<InsertTask, "id" | "userId">;
export type CreateTaskResponse = CreateResponse<Task>;
```

### 3. API

```typescript
// apps/api/app/tasks/route.ts
import type { CreateTaskResponse } from "@workspace/types";

const validated = createTaskInputSchema.parse(body);
const [task] = await db.insert(tasks).values(validated).returning();

const response: CreateTaskResponse = { success: true, data: task };
```

### 4. Frontend

```typescript
// apps/app/hooks/use-tasks.ts
import type { CreateTaskResponse } from "@workspace/types";

export function useCreateTask() {
  return useMutation({
    mutationFn: (input: CreateTaskInput) => createTask(input),
  });
}
```

## Adding New Field

**1. Update schema:**

```typescript
export const tasks = pgTable("tasks", {
  // ... existing
  priority: varchar({ length: 50 }).default("medium"),
});
```

**2. Generate migration:**

```bash
pnpm db:push
```

**3. TypeScript errors show what to fix:**

- ❌ API: Missing priority in insert
- ❌ Frontend: Form missing priority field

**4. Fix everywhere:**

- Add priority to Zod schema (optional)
- Add priority field to form
- TypeScript errors gone! ✅

## Benefits

✅ **Single source of truth** - Database drives everything  
✅ **Auto-generated types** - No manual sync  
✅ **Compile-time errors** - Catches mismatches  
✅ **Autocomplete everywhere** - Great DX

See [Type System](/architecture/type-system) for ownership details.
