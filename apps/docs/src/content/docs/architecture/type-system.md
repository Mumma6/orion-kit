---
title: Type System
---

Orion Kit uses a **centralized API response types** system where generic API responses live in `@workspace/types`, while domain types live in their respective packages.

## Architecture Overview

```
┌──────────────────┐      ┌──────────────────┐
│ @workspace/      │      │ @workspace/      │
│   database       │      │   payment        │
│                  │      │                  │
│ - Task           │      │ - CheckoutSession│
│ - UserPreference │      │ - SubscriptionData│
│ - Zod Schemas    │      │ - PricingPlan    │
└────────┬─────────┘      └────────┬─────────┘
         │                         │
         │    Domain Types         │
         └──────────┬──────────────┘
                    │
         ┌──────────▼──────────────┐
         │   @workspace/types      │
         │                         │
         │ - Generic Responses     │
         │ - Composed Types        │
         │ - Input Types           │
         │                         │
         │ CreateTaskResponse      │
         │ TasksListResponse       │
         │ SubscriptionResponse    │
         └──────────┬──────────────┘
                    │
         ┌──────────┴──────────┐
         │                     │
    ┌────▼────┐          ┌─────▼────┐
    │ API App │          │ Frontend │
    │         │          │   App    │
    │ Routes  │          │  Hooks   │
    └─────────┘          └──────────┘
```

## Type Ownership

### 1. Database Package (`@workspace/database`)

Owns **all database entity types and Zod schemas**:

- Entity Types: `Task`, `UserPreference`
- Insert Types: `InsertTask`, `InsertUserPreference`
- Zod Schemas: `createTaskInputSchema`, `updateUserPreferencesSchema`

```typescript
import { type Task, createTaskInputSchema } from "@workspace/database";
```

### 2. Payment Package (`@workspace/payment`)

Owns **all payment domain types**:

- Domain Data Types: `CheckoutSession`, `SubscriptionData`, `PortalSession`
- Stripe Types: `StripeCustomer`, `StripeSubscription`
- Config Types: `PricingPlan`
- Zod Schemas: `createCheckoutSessionInputSchema`

```typescript
import {
  type CheckoutSession,
  type PricingPlan,
  createCheckoutSessionInputSchema,
} from "@workspace/payment";
```

### 3. Types Package (`@workspace/types`)

Owns **all API response types** (composes domain types):

- Generic API Responses: `ApiSuccessResponse<T>`, `CreateResponse<T>`, `ListResponse<T>`
- Task Responses: `CreateTaskResponse`, `TasksListResponse`
- Billing Responses: `CreateCheckoutSessionResponse`, `SubscriptionResponse`
- Preferences Responses: `PreferencesResponse`, `UpdatePreferencesResponse`
- Input Types: `CreateTaskInput`, `UpdatePreferencesInput`

```typescript
import type {
  TasksListResponse,
  CreateTaskResponse,
  CreateTaskInput,
} from "@workspace/types";
```

### 4. Apps (API & Frontend)

**No local type files!** Import everything from packages:

```typescript
// ✅ API routes
import type { TasksListResponse } from "@workspace/types";

// ✅ Frontend hooks
import type { TasksListResponse } from "@workspace/types";
```

## Why Centralized API Responses?

### ❌ Problem: Duplicated Response Types

Before centralization:

```typescript
// ❌ Duplicated in API
// apps/api/lib/types.ts
export interface CreateTaskResponse {
  success: true;
  message: string;
  data: Task;
}

// ❌ Duplicated in App
// apps/app/lib/types.ts
export interface CreateTaskResponse {
  success: true;
  message: string;
  data: Task;
}
```

Issues:

- 🔴 Duplicate definitions
- 🔴 Can drift out of sync
- 🔴 Maintenance burden
- 🔴 No single source of truth

### ✅ Solution: Single Types Package

```typescript
// ✅ Defined once
// packages/types/src/tasks.ts
export type CreateTaskResponse = CreateResponse<Task>;

// Used everywhere
import type { CreateTaskResponse } from "@workspace/types";
```

Benefits:

- ✅ Single source of truth
- ✅ Guaranteed consistency
- ✅ Update once, affects both API & App
- ✅ TypeScript catches mismatches
- ✅ Clear separation: domain types vs API responses

## Type Flow

### Creating a Task (Full Example)

**1. Database Package (Source of Truth)**

```typescript
// packages/database/src/schema.ts
export const tasks = pgTable("tasks", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 255 }).notNull(),
  status: taskStatusEnum().default("todo").notNull(),
  // ...
});

export type Task = typeof tasks.$inferSelect;
export type InsertTask = typeof tasks.$inferInsert;

export const createTaskInputSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  status: z.enum(["todo", "in-progress", "completed"]).optional(),
});
```

**2. API Route (imports from @workspace/types)**

```typescript
// apps/api/app/tasks/route.ts
import { db, tasks, createTaskInputSchema } from "@workspace/database";
import type { CreateTaskResponse } from "@workspace/types";

export async function POST(req: Request) {
  const body = await req.json();
  const validated = createTaskInputSchema.parse(body);

  const [newTask] = await db
    .insert(tasks)
    .values({
      ...validated,
      clerkUserId: userId,
    })
    .returning();

  const response: CreateTaskResponse = {
    success: true,
    message: "Task created",
    data: newTask,
  };

  return NextResponse.json(response);
}
```

**3. Frontend API Client (imports from @workspace/types)**

```typescript
// apps/app/lib/api/tasks.ts
import type { CreateTaskResponse, CreateTaskInput } from "@workspace/types";

export async function createTask(
  input: CreateTaskInput
): Promise<CreateTaskResponse> {
  return api.post<CreateTaskResponse>("/tasks", input);
}
```

**4. React Hook (imports from @workspace/types)**

```typescript
// apps/app/hooks/use-tasks.ts
import type { CreateTaskResponse, CreateTaskInput } from "@workspace/types";
import { createTask } from "@/lib/api/tasks";

export function useCreateTask() {
  return useMutation({
    mutationFn: (input: CreateTaskInput) => createTask(input),
    onSuccess: (response: CreateTaskResponse) => {
      // response.data is fully typed!
    },
  });
}
```

**5. React Component**

```typescript
// apps/app/components/tasks/index.tsx
import type { Task } from "@workspace/database";
import { useCreateTask } from "@/hooks/use-tasks";

export function TasksList() {
  const createTask = useCreateTask();

  // Fully typed!
  return (
    <CreateTaskForm onSubmit={createTask.mutate} />
  );
}
```

## Import Guidelines

### From `@workspace/database`

```typescript
// ✅ Import database entities and Zod schemas
import { type Task, createTaskInputSchema } from "@workspace/database";
```

### From `@workspace/payment`

```typescript
// ✅ Import payment domain types and schemas
import {
  type CheckoutSession,
  type PricingPlan,
  createCheckoutSessionInputSchema,
} from "@workspace/payment";
```

### From `@workspace/types`

```typescript
// ✅ Import API response types (everywhere!)
import type {
  CreateTaskResponse,
  TasksListResponse,
  CreateTaskInput,
} from "@workspace/types";
```

### In Components

```typescript
// ✅ Import domain types for props
import type { Task } from "@workspace/database";
import type { PricingPlan } from "@workspace/payment";

// ✅ Import Zod schemas for forms
import { createTaskInputSchema } from "@workspace/database";
```

## Adding New Types

### Database Entity

Add to `packages/database/src/schema.ts`:

```typescript
export const comments = pgTable("comments", {
  id: integer().primaryKey(),
  content: text().notNull(),
  // ...
});

export type Comment = typeof comments.$inferSelect;
export type InsertComment = typeof comments.$inferInsert;
```

Export from `packages/database/src/index.ts`:

```typescript
export { comments, type Comment, type InsertComment } from "./schema";
```

Use everywhere:

```typescript
import { type Comment } from "@workspace/database";
```

### Payment Type

Add to `packages/payment/src/types.ts`:

```typescript
export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  // ...
}
```

Export from `packages/payment/src/index.ts`:

```typescript
export type { SubscriptionPlan } from "./types";
```

### API Response Type

Add to `packages/types/src/` (create new file if needed):

```typescript
// packages/types/src/comments.ts
import type { Comment } from "@workspace/database";
import type { ListResponse, CreateResponse } from "./api";

export interface CommentsListResponse extends ListResponse<Comment> {
  totalComments: number;
}

export type CreateCommentResponse = CreateResponse<Comment>;

export type CreateCommentInput = Omit<
  import("@workspace/database").InsertComment,
  "id" | "userId" | "createdAt"
>;
```

Export from index:

```typescript
// packages/types/src/index.ts
export * from "./comments";
```

Use everywhere:

```typescript
// In API routes
import type { CommentsListResponse } from "@workspace/types";

// In frontend hooks
import type { CommentsListResponse } from "@workspace/types";
```

## Best Practices

### 1. Import from Package, Not Paths

```typescript
// ✅ Good
import { type Task } from "@workspace/database";

// ❌ Bad
import { type Task } from "../../../packages/database/src/schema";
```

### 2. Use Types from @workspace/types

```typescript
// ✅ Good - from types package
import type { TasksListResponse } from "@workspace/types";

// ❌ Bad - creating inline types
const response: { success: true; data: Task[] } = {
  /* ... */
};

// ❌ Bad - local type files
// apps/api/lib/types.ts should NOT exist
// apps/app/lib/types.ts should NOT exist
```

### 3. Derive Input Types

```typescript
// ✅ Good
type CreateTaskInput = Omit<InsertTask, "id" | "clerkUserId">;

// ❌ Bad - duplicate definition
type CreateTaskInput = {
  title: string;
  description?: string;
};
```

### 4. Validation with Zod

```typescript
// ✅ Good - import schema from package
import { createTaskInputSchema } from "@workspace/database";
const validated = createTaskInputSchema.parse(input);

// ❌ Bad - define schema locally
const schema = z.object({ title: z.string() });
```

## Summary

| Type Category       | Owner                 | Import From           |
| ------------------- | --------------------- | --------------------- |
| Database Entities   | `@workspace/database` | `@workspace/database` |
| Zod DB Schemas      | `@workspace/database` | `@workspace/database` |
| Payment Domain      | `@workspace/payment`  | `@workspace/payment`  |
| Zod Payment Schemas | `@workspace/payment`  | `@workspace/payment`  |
| API Responses       | `@workspace/types`    | `@workspace/types`    |
| Input Types         | `@workspace/types`    | `@workspace/types`    |
| Composed Types      | `@workspace/types`    | `@workspace/types`    |

**Key Principle:**

- **Domain packages** (`database`, `payment`) own data types and Zod schemas
- **Types package** owns API response types and composes them with domain types
- **Apps** import from packages, never define their own response types
