---
title: Type System
description: How types flow from database to API to frontend
---

**Centralized type system** where `@workspace/types` combines domain entities with API response interfaces.

## Architecture

```
@workspace/database              @workspace/payment
┌─────────────────────┐         ┌──────────────────┐
│ - Task entity       │         │ - CheckoutSession│
│ - Zod schemas       │         │ - PricingPlan    │
│ - Insert types      │         │ - PortalSession  │
└──────────┬──────────┘         └────────┬─────────┘
           │                             │
           └──────────┬──────────────────┘
                      ↓
           @workspace/types
        ┌──────────────────────────┐
        │ Generic API interfaces:  │
        │ - ApiResponse<T>         │
        │ - ListResponse<T>        │
        │                          │
        │ Domain-specific files:   │
        │ - tasks.ts               │
        │ - billing.ts             │
        │ - preferences.ts         │
        └─────────┬────────────────┘
                  │
                  │ Re-exports everything
                  ↓
        ┌─────────┴──────────┐
        │                    │
    API Routes         Frontend Hooks
  (Validate & Return)   (Query & Mutate)
```

## Type Ownership

| Type Category          | Owner                 | Example                                           |
| ---------------------- | --------------------- | ------------------------------------------------- |
| **Database entities**  | `@workspace/database` | `Task`, `UserPreference`, `InsertTask`            |
| **Zod schemas**        | `@workspace/database` | `createTaskInputSchema`, `updateTaskInputSchema`  |
| **Payment domain**     | `@workspace/payment`  | `CheckoutSession`, `PricingPlan`, `PortalSession` |
| **Generic responses**  | `@workspace/types`    | `ApiResponse<T>`, `ListResponse<T>`               |
| **Input types**        | `@workspace/types`    | `CreateTaskInput`, `UpdateTaskInput`              |
| **API response types** | `@workspace/types`    | `TaskResponse`, `TasksListResponse`               |

### Key Principle

- **Domain packages** (database, payment) own the data models and validation schemas
- **Types package** re-exports domain types and composes them into API response types
- **Apps** (api, app) import everything from `@workspace/types` for consistency

## Complete Example: Task Creation Flow

### 1. Database Package (`@workspace/database`)

Defines the entity and validation:

```typescript
// packages/database/src/schema.ts
export const tasks = pgTable("tasks", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 255 }).notNull(),
  status: varchar({ length: 50 }).notNull().default("todo"),
  clerkUserId: varchar({ length: 255 }).notNull(),
  createdAt: timestamp().notNull().defaultNow(),
});

// Auto-generated types
export type Task = typeof tasks.$inferSelect;
export type InsertTask = typeof tasks.$inferInsert;

// Zod schemas for validation
export const createTaskInputSchema = createInsertSchema(tasks, {
  title: z.string().min(1).max(255),
  status: z.enum(["todo", "in-progress", "completed"]).optional(),
}).omit({
  id: true,
  clerkUserId: true,
  createdAt: true,
  updatedAt: true,
});
```

### 2. Types Package (`@workspace/types`)

Re-exports and composes:

```typescript
// packages/types/src/tasks.ts
import type { Task, InsertTask } from "@workspace/database/schema";
import type { ApiResponse, ListResponse } from "./api";

// ============================================
// RE-EXPORT ENTITY
// ============================================
export type { Task } from "@workspace/database/schema";

// ============================================
// RE-EXPORT ZOD SCHEMAS
// ============================================
export { createTaskInputSchema } from "@workspace/database/schema";

// ============================================
// INPUT TYPES (TypeScript)
// ============================================
export type CreateTaskInput = Omit<
  InsertTask,
  "id" | "clerkUserId" | "createdAt" | "updatedAt"
>;

// ============================================
// API RESPONSE TYPES (composed with generics)
// ============================================
export type TaskResponse = ApiResponse<Task>;

export interface TasksListResponse extends ListResponse<Task> {
  userId: string;
  userName: string;
  completed: number;
  inProgress: number;
  todo: number;
}

export type CreateTaskResponse = ApiResponse<Task>;
```

### 3. API Route (`apps/api`)

Validates and returns typed response:

```typescript
// apps/api/app/tasks/route.ts
import { db, tasks } from "@workspace/database";
import { createTaskInputSchema } from "@workspace/types";
import type { CreateTaskResponse } from "@workspace/types";

export async function POST(req: Request) {
  const body = await req.json();

  // 1. Validate with Zod
  const validation = createTaskInputSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  // 2. Insert to database
  const [newTask] = await db
    .insert(tasks)
    .values({
      clerkUserId: userId,
      ...validation.data,
    })
    .returning();

  // 3. Return typed response
  const response: CreateTaskResponse = {
    success: true,
    message: "Task created successfully",
    data: newTask,
  };

  return NextResponse.json(response);
}
```

### 4. Frontend Hook (`apps/app`)

Uses same types for queries and mutations:

```typescript
// apps/app/hooks/use-tasks.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask } from "@/lib/api/tasks";
import type {
  CreateTaskInput,
  CreateTaskResponse,
  TasksListResponse,
} from "@workspace/types";

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTaskInput) => createTask(input),
    onSuccess: (response: CreateTaskResponse) => {
      // TypeScript knows the exact shape of response.data
      const newTask = response.data;

      // Update cache with type-safe operations
      queryClient.setQueryData<TasksListResponse>(["tasks"], (old) => {
        if (!old) return old;
        return {
          ...old,
          data: [newTask, ...old.data],
          total: old.total + 1,
          todo: old.todo + 1,
        };
      });
    },
  });
}
```

### 5. API Client (`apps/app/lib/api`)

Typed request and response:

```typescript
// apps/app/lib/api/tasks.ts
import type { CreateTaskInput, CreateTaskResponse } from "@workspace/types";

export const createTask = async (
  input: CreateTaskInput
): Promise<CreateTaskResponse> => {
  const res = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) throw new Error("Failed to create task");

  return res.json();
};
```

## Benefits of This Architecture

### ✅ Single Source of Truth

Database schema changes automatically propagate:

```typescript
// Add field to database
export const tasks = pgTable("tasks", {
  priority: varchar({ length: 20 }), // NEW
});

// ✅ TypeScript immediately catches this everywhere
const task: Task = response.data;
task.priority; // Type-safe access
```

### ✅ No Type Duplication

API and frontend share identical types:

```typescript
// API knows the response shape
const response: CreateTaskResponse = { success: true, data: newTask };

// Frontend receives exact same shape
const { data } = await createTask(input); // Type: CreateTaskResponse
```

### ✅ Compile-Time Safety

TypeScript catches mismatches before runtime:

```typescript
// ❌ TypeScript error if API returns wrong shape
const response: CreateTaskResponse = {
  success: true,
  // Missing 'data' field - TypeScript error
};

// ❌ TypeScript error if frontend expects wrong type
queryClient.setQueryData<TasksListResponse>(["tasks"], {
  data: [], // Missing required fields: total, userId, etc.
});
```

### ✅ Clear Ownership & Organization

Each package has a specific responsibility:

- **`@workspace/database`** - Owns entities and validation schemas
- **`@workspace/payment`** - Owns payment domain types
- **`@workspace/types`** - Composes everything into API contracts
- **Apps** - Import only from `@workspace/types`

## Import Guidelines

### ✅ Always import from `@workspace/types`

```typescript
// ✅ CORRECT - All apps import from types package
import type {
  Task,
  CreateTaskInput,
  CreateTaskResponse,
  TasksListResponse,
} from "@workspace/types";

import { createTaskInputSchema } from "@workspace/types";
```

### ❌ Never import directly from domain packages in apps

```typescript
// ❌ WRONG - Don't import from database in apps
import type { Task } from "@workspace/database";

// ❌ WRONG - Don't import from payment in apps
import type { PricingPlan } from "@workspace/payment";
```

### ❌ Never define response types in apps

```typescript
// ❌ WRONG - apps/api/lib/types.ts should NOT exist
export interface CreateTaskResponse {
  success: boolean;
  data: Task;
}

// ✅ CORRECT - Define in packages/types/src/tasks.ts
export type CreateTaskResponse = ApiResponse<Task>;
```

## File Structure Reference

```
packages/types/src/
├── api.ts                 # Generic interfaces (ApiResponse, ListResponse)
├── tasks.ts               # Task domain (re-exports + responses)
├── billing.ts             # Billing domain (re-exports + responses)
├── preferences.ts         # Preferences domain (re-exports + responses)
└── index.ts               # Re-exports everything
```

Each domain file follows this pattern:

```typescript
// 1. Re-export entities from domain package
export type { Entity } from "@workspace/database";

// 2. Re-export Zod schemas for validation
export { createEntitySchema } from "@workspace/database";

// 3. Define Input types (TypeScript only)
export type CreateEntityInput = Omit<InsertEntity, "id" | "userId">;

// 4. Define API Response types (composed with generics)
export type CreateEntityResponse = ApiResponse<Entity>;
export type EntityListResponse = ListResponse<Entity>;
```

## Summary

The type system ensures end-to-end type safety by:

1. **Database** defines entities with Drizzle ORM
2. **Types package** re-exports entities and composes API responses
3. **Both API and frontend** import from `@workspace/types`
4. **TypeScript** catches any mismatches at compile-time

This creates a single source of truth where schema changes automatically propagate through the entire stack.

## Related

- [Architecture Overview](/architecture/overview) - Complete system architecture
- [Database Package](/packages/database) - Schema and validation
- [Types Package](/packages/types) - API response types
- [Zod Guide](/guide/zod) - Validation patterns
