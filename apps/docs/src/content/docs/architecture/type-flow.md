---
title: Type Flow Diagram
description: Complete visualization of type flow through the Orion Kit stack
---

# Type Flow Diagram

Complete visualization showing how types flow from database schema through the entire stack.

## Full Type Flow

```
┌──────────────────────────────────────────────────────────────┐
│                    DATABASE SCHEMA                            │
│             packages/database/src/schema.ts                   │
│                                                               │
│  export const tasks = pgTable("tasks", {                     │
│    id: integer().primaryKey(),                               │
│    title: varchar({ length: 255 }).notNull(),                │
│    status: taskStatusEnum().default("todo"),                 │
│  });                                                          │
└───────────────────────┬──────────────────────────────────────┘
                        │
                        ├─── Drizzle Inference
                        │
         ┌──────────────┴──────────────┐
         │                             │
         ▼                             ▼
┌────────────────┐            ┌────────────────┐
│  TypeScript    │            │  Zod Schemas   │
│     Types      │            │                │
│                │            │  (drizzle-zod) │
│  export type   │            │                │
│  Task =        │            │  export const  │
│  typeof tasks  │            │  insertTask    │
│  .$inferSelect │            │  Schema =      │
│                │            │  createInsert  │
│  export type   │            │  Schema(tasks) │
│  InsertTask =  │            │                │
│  typeof tasks  │            │  export const  │
│  .$inferInsert │            │  createTask    │
│                │            │  InputSchema = │
└────────┬───────┘            │  insertTask    │
         │                    │  Schema.omit() │
         │                    └────────┬───────┘
         │                             │
         └─────────────┬───────────────┘
                       │
         ┌─────────────▼─────────────┐
         │   @workspace/database     │
         │      (exported)           │
         │                           │
         │  export { Task,           │
         │           InsertTask,     │
         │           createTask      │
         │           InputSchema }   │
         └────────────┬──────────────┘
                      │
         ┌────────────┴────────────┐
         │                         │
         ▼                         ▼
┌────────────────┐        ┌────────────────┐
│ @workspace/    │        │ @workspace/    │
│   types        │        │   payment      │
│                │        │                │
│ Composes:      │        │ Domain types:  │
│                │        │                │
│ export type    │        │ export type    │
│ CreateTask     │        │ CheckoutSession│
│ Response =     │        │                │
│ CreateResponse │        │ export const   │
│ <Task>         │        │ createCheckout │
│                │        │ InputSchema    │
│ export type    │        │                │
│ TasksList      │        └────────┬───────┘
│ Response =     │                 │
│ ListResponse   │                 │
│ <Task> + stats │                 │
└────────┬───────┘                 │
         │                         │
         └──────────┬──────────────┘
                    │
         ┌──────────▼──────────────┐
         │   API Routes             │
         │   apps/api/app/          │
         │                          │
         │  import type {           │
         │    CreateTaskResponse    │
         │  } from "@workspace/     │
         │          types";         │
         │                          │
         │  const response:         │
         │    CreateTaskResponse =  │
         │    { success: true,      │
         │      data: newTask }     │
         └──────────┬───────────────┘
                    │
                    │ HTTP JSON
                    │
         ┌──────────▼───────────────┐
         │  API Client               │
         │  apps/app/lib/api/        │
         │                           │
         │  export async function    │
         │  createTask(              │
         │    input: CreateTaskInput │
         │  ): Promise<              │
         │    CreateTaskResponse     │
         │  > { ... }                │
         └──────────┬────────────────┘
                    │
         ┌──────────▼────────────────┐
         │  TanStack Query Hooks     │
         │  apps/app/hooks/          │
         │                           │
         │  export function          │
         │  useCreateTask() {        │
         │    return useMutation({   │
         │      mutationFn:          │
         │        createTask,        │
         │    });                    │
         │  }                        │
         └──────────┬────────────────┘
                    │
         ┌──────────▼────────────────┐
         │  React Components         │
         │  apps/app/components/     │
         │                           │
         │  const createTask =       │
         │    useCreateTask();       │
         │                           │
         │  await createTask         │
         │    .mutateAsync(data);    │
         │                           │
         │  // Fully typed!          │
         └───────────────────────────┘
```

## Type Safety at Each Layer

### Layer 1: Database Schema

```typescript
// packages/database/src/schema.ts
export const tasks = pgTable("tasks", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 255 }).notNull(),
  status: taskStatusEnum().default("todo").notNull(),
});
```

**Output:**

- TypeScript types via Drizzle inference
- Zod schemas via drizzle-zod

---

### Layer 2: Package Exports

```typescript
// packages/database/src/index.ts
export { tasks, type Task, type InsertTask } from "./schema";
export { createTaskInputSchema, insertTaskSchema } from "./schema";
```

**Available to:**

- `@workspace/types` (for composition)
- API routes (for validation)
- Frontend (for forms)

---

### Layer 3: Types Package

```typescript
// packages/types/src/tasks.ts
import type { Task } from "@workspace/database";

export type CreateTaskInput = Omit<
  import("@workspace/database").InsertTask,
  "id" | "clerkUserId" | "createdAt" | "updatedAt"
>;

export type CreateTaskResponse = CreateResponse<Task>;
export interface TasksListResponse extends ListResponse<Task> {
  userId: string;
  userName: string;
  completed: number;
  inProgress: number;
  todo: number;
}
```

**Output:**

- API response types
- Input types for requests
- Composed types with extra fields

---

### Layer 4: API Routes

```typescript
// apps/api/app/tasks/route.ts
import { db, tasks, createTaskInputSchema } from "@workspace/database";
import type { CreateTaskResponse } from "@workspace/types";

export async function POST(req: Request) {
  const body = await req.json();

  // Validation with Zod
  const validated = createTaskInputSchema.parse(body);

  // Database insert
  const [newTask] = await db
    .insert(tasks)
    .values({ ...validated, clerkUserId: userId })
    .returning();

  // Typed response
  const response: CreateTaskResponse = {
    success: true,
    message: "Task created",
    data: newTask, // newTask is type Task
  };

  return NextResponse.json(response);
}
```

**Type safety:**

- `validated` is typed from Zod
- `newTask` is typed as `Task`
- `response` matches `CreateTaskResponse`

---

### Layer 5: API Client

```typescript
// apps/app/lib/api/tasks.ts
import type { CreateTaskResponse, CreateTaskInput } from "@workspace/types";

export async function createTask(
  input: CreateTaskInput
): Promise<CreateTaskResponse> {
  return api.post<CreateTaskResponse>("/tasks", input);
}
```

**Type safety:**

- Parameter `input` is typed
- Return type is guaranteed
- Generic `<CreateTaskResponse>` ensures response matches

---

### Layer 6: TanStack Query Hooks

```typescript
// apps/app/hooks/use-tasks.ts
import type { CreateTaskResponse, CreateTaskInput } from "@workspace/types";
import { createTask } from "@/lib/api/tasks";

export function useCreateTask() {
  return useMutation({
    mutationFn: (input: CreateTaskInput) => createTask(input),
    onSuccess: (response: CreateTaskResponse) => {
      // response.data is fully typed as Task!
      console.log(response.data.title); // ✅ TypeScript knows this exists
    },
  });
}
```

**Type safety:**

- `mutationFn` parameter is typed
- `onSuccess` receives typed response
- Autocomplete works everywhere

---

### Layer 7: React Components

```typescript
// apps/app/components/tasks/create-task-form.tsx
import { useCreateTask } from "@/hooks/use-tasks";
import { createTaskInputSchema } from "@workspace/database";
import type { CreateTaskInput } from "@workspace/types";

export function CreateTaskForm() {
  const createTask = useCreateTask();

  const form = useForm<CreateTaskInput>({
    resolver: zodResolver(createTaskInputSchema),
  });

  const onSubmit = async (data: CreateTaskInput) => {
    const response = await createTask.mutateAsync(data);
    // response is typed as CreateTaskResponse
    console.log(response.data.id); // ✅ Fully typed!
  };

  return <form onSubmit={form.handleSubmit(onSubmit)}>{/* ... */}</form>;
}
```

**Type safety:**

- Form data is typed
- Submission is type-checked
- Response is fully typed

---

## Validation Flow

```
User fills form
      ↓
Client-side Zod validation (createTaskInputSchema)
      ↓
If valid → Send to API
      ↓
Server-side Zod validation (same createTaskInputSchema!)
      ↓
If valid → Insert to database
      ↓
Database returns Task type
      ↓
Wrap in CreateTaskResponse
      ↓
Return to frontend (typed)
      ↓
TanStack Query caches (typed)
      ↓
Component updates (typed)
```

**Same Zod schema on both sides = guaranteed consistency!**

## Benefits

### 1. End-to-End Type Safety

```typescript
// Change database schema
export const tasks = pgTable("tasks", {
  // Add new field
  priority: varchar({ length: 50 }),
});

// TypeScript immediately shows errors in:
// ❌ API routes (missing priority in insert)
// ❌ Frontend forms (missing priority field)
// ❌ Components (can't access task.priority)

// Fix everywhere:
// ✅ Update Zod schema
// ✅ Update form fields
// ✅ TypeScript errors gone!
```

### 2. Single Source of Truth

```
Database Schema → Everything else derives from it
```

No manual type synchronization needed!

### 3. Compile-Time Errors

```typescript
// ❌ This won't compile
const response: CreateTaskResponse = {
  success: true,
  data: newTask,
  // Missing 'message' field → TypeScript error!
};

// ✅ Fixed
const response: CreateTaskResponse = {
  success: true,
  message: "Created",
  data: newTask,
};
```

### 4. Autocomplete Everywhere

TypeScript provides autocomplete for:

- Database fields
- API response properties
- Form field names
- Validation rules

## Example: Adding a New Field

### Step 1: Update Database Schema

```typescript
// packages/database/src/schema.ts
export const tasks = pgTable("tasks", {
  // ... existing fields
  priority: varchar({ length: 50 }).notNull().default("medium"),
});
```

### Step 2: Generate Migration

```bash
pnpm db:generate
pnpm db:push
```

### Step 3: Update Zod Schema (Optional)

```typescript
// packages/database/src/schema.ts
export const createTaskInputSchema = insertTaskSchema
  .omit({
    id: true,
    clerkUserId: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    priority: z.enum(["low", "medium", "high"]).optional(),
  });
```

### Step 4: TypeScript Tells You What to Fix

API route:

```typescript
// ❌ TypeScript error: priority is missing
await db.insert(tasks).values({
  title: validated.title,
  // Missing priority!
});

// ✅ Fixed
await db.insert(tasks).values({
  ...validated,
  priority: validated.priority ?? "medium",
});
```

Form:

```typescript
// Add field to form
<FormField name="priority" ... />
```

**That's it!** Types flow automatically.

## Summary

1. **Define in Drizzle** - Single source of truth
2. **Generate types** - Automatic from schema
3. **Use everywhere** - Import from packages
4. **TypeScript enforces** - Catches mismatches
5. **Update once** - Changes propagate automatically

**No manual type definitions needed!** 🎉

## Learn More

- [Type System Architecture](/architecture/type-system)
- [Architecture Overview](/architecture/overview)
- [Database Package](/packages/database)
- [Types Package](/packages/types)
