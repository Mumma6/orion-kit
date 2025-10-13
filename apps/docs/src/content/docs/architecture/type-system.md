---
title: Type System
---

# Type System

**Centralized API response types** in `@workspace/types`, **domain types** in their packages.

## Architecture

```
@workspace/database        @workspace/payment
(Task, UserPreference)     (CheckoutSession, PricingPlan)
           │                         │
           └──────────┬──────────────┘
                      │
           @workspace/types
        (Composes into API responses)
         CreateTaskResponse
         TasksListResponse
                      │
           ┌──────────┴──────────┐
           │                     │
      API Routes           Frontend Hooks
```

## Type Ownership

| Type Category     | Owner                 | Example                                   |
| ----------------- | --------------------- | ----------------------------------------- |
| Database entities | `@workspace/database` | `Task`, `UserPreference`                  |
| DB Zod schemas    | `@workspace/database` | `createTaskInputSchema`                   |
| Payment domain    | `@workspace/payment`  | `CheckoutSession`, `PricingPlan`          |
| API responses     | `@workspace/types`    | `CreateTaskResponse`, `TasksListResponse` |
| Input types       | `@workspace/types`    | `CreateTaskInput`                         |

## Example: Task Creation

**1. Database package defines entity:**

```typescript
// packages/database/src/schema.ts
export const tasks = pgTable("tasks", {
  id: integer().primaryKey(),
  title: varchar({ length: 255 }).notNull(),
});

export type Task = typeof tasks.$inferSelect;
export const createTaskInputSchema = z.object({ title: z.string() });
```

**2. Types package composes response:**

```typescript
// packages/types/src/tasks.ts
import type { Task } from "@workspace/database";

export type CreateTaskInput = Omit<InsertTask, "id" | "userId">;
export type CreateTaskResponse = CreateResponse<Task>;
```

**3. API uses it:**

```typescript
// apps/api/app/tasks/route.ts
import type { CreateTaskResponse } from "@workspace/types";

const response: CreateTaskResponse = {
  success: true,
  message: "Created",
  data: newTask,
};
```

**4. Frontend uses same type:**

```typescript
// apps/app/hooks/use-tasks.ts
import type { CreateTaskResponse } from "@workspace/types";

export function useCreateTask() {
  return useMutation({
    mutationFn: (input: CreateTaskInput) => createTask(input),
  });
}
```

## Benefits

✅ **Single source of truth** - Update once, affects everywhere  
✅ **No duplication** - API and frontend use identical types  
✅ **Compile-time safety** - TypeScript catches mismatches  
✅ **Clear ownership** - Domain packages own data, types package owns responses

## Import Guidelines

```typescript
// ✅ Domain types from domain packages
import { type Task } from "@workspace/database";
import { type PricingPlan } from "@workspace/payment";

// ✅ API responses from types package
import type { CreateTaskResponse } from "@workspace/types";

// ❌ Don't define response types in apps
// apps/api/lib/types.ts should NOT exist
```

See [Type Flow](/architecture/type-flow) for complete diagram.
