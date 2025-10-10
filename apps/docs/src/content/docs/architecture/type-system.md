---
title: Type System
---

Orion Kit uses a centralized type system to ensure type safety and avoid duplication across the monorepo.

## Architecture Overview

```
┌─────────────────────────────────────────┐
│         @workspace/types                 │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │  Generic API Types                 │ │
│  │  - CreateResponse<T>               │ │
│  │  - ListResponse<T>                 │ │
│  │  - ApiSuccessResponse<T>           │ │
│  │  - ApiErrorResponse                │ │
│  └────────────────────────────────────┘ │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │  Database Types (Re-exports)       │ │
│  │  - Task (from Drizzle schema)      │ │
│  │  - InsertTask                      │ │
│  │  - UserPreference                  │ │
│  │  - InsertUserPreference            │ │
│  └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
              ▲                 ▲
              │                 │
    ┌─────────┴─────────┐      │
    │                   │      │
┌───▼────┐         ┌───▼────┐  │
│  API   │         │  App   │  │
│        │         │        │  │
│ Uses   │         │ Uses   │  │
│ shared │◄────────┤ shared │  │
│ types  │  Calls  │ types  │  │
└────────┘  API    └────────┘  │
                                │
              ┌─────────────────┘
              │
     ┌────────▼──────────┐
     │  @workspace/      │
     │   database        │
     │                   │
     │  Drizzle Schemas  │
     │  (Source of Truth)│
     └───────────────────┘
```

## Why Centralized Types?

### ❌ Problem: Type Duplication

Before centralization, types were duplicated across apps:

```typescript
// apps/api/types.ts
interface Task {
  id: number;
  title: string;
  status: "todo" | "in-progress" | "completed";
  // ...
}

// apps/app/types.ts
interface Task {
  // DUPLICATE!
  id: number;
  title: string;
  status: "todo" | "in-progress" | "completed";
  // ...
}
```

**Problems:**

- 🔴 Types can drift out of sync
- 🔴 Changes need to be made in multiple places
- 🔴 Maintenance nightmare
- 🔴 No single source of truth

### ✅ Solution: Single Source of Truth

```typescript
// Everywhere
import type { Task } from "@workspace/types";
```

**Benefits:**

- ✅ Types always in sync
- ✅ One place to update
- ✅ Drizzle schema is the source of truth
- ✅ Type safety across entire monorepo

## How It Works

### 1. Database Types (Drizzle Schema)

Types start from the database schema:

```typescript
// packages/database/src/schema.ts
export const tasks = pgTable("tasks", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  clerkUserId: varchar("clerk_user_id", { length: 255 }).notNull(),
  title: varchar({ length: 255 }).notNull(),
  status: taskStatusEnum().default("todo").notNull(),
  // ...
});

// Inferred types from schema
export type Task = typeof tasks.$inferSelect;
export type InsertTask = typeof tasks.$inferInsert;
```

### 2. Re-export from @workspace/types

```typescript
// packages/types/src/database.ts
export type {
  Task,
  InsertTask,
  UserPreference,
  InsertUserPreference,
} from "@workspace/database";
```

### 3. Use Everywhere

```typescript
// apps/api/app/tasks/route.ts
import type { Task } from "@workspace/types";

// apps/app/lib/api/tasks.ts
import type { Task } from "@workspace/types";

// apps/app/components/tasks-content.tsx
import type { Task } from "@workspace/types";
```

## Generic API Types

To ensure consistent API response formats, we provide generic types:

### Success Response

```typescript
interface CreateResponse<T> {
  success: true;
  message: string;
  data: T;
}
```

Usage:

```typescript
// API route
const response: CreateResponse<Task> = {
  success: true,
  message: "Task created successfully",
  data: newTask,
};
```

### List Response

```typescript
interface ListResponse<T> {
  success: true;
  data: T[];
  total: number;
  metadata?: Record<string, unknown>;
}
```

Usage:

```typescript
// API route
const response: ListResponse<Task> = {
  success: true,
  data: tasks,
  total: tasks.length,
  metadata: {
    completed: 5,
    inProgress: 3,
  },
};
```

### Error Response

```typescript
interface ApiErrorResponse {
  success: false;
  error: string;
  message?: string;
  code?: string;
}
```

Usage:

```typescript
// API route
return NextResponse.json(
  {
    success: false,
    error: "Task not found",
    code: "TASK_NOT_FOUND",
  },
  { status: 404 }
);
```

## Type Inference Flow

```
1. Database Schema (Drizzle)
   ↓
2. Infer Types (Task, InsertTask)
   ↓
3. Export from @workspace/database
   ↓
4. Re-export from @workspace/types
   ↓
5. Import in API routes
   ↓
6. Use in API responses with generic wrappers
   ↓
7. Import in app (API client)
   ↓
8. Use in TanStack Query hooks
   ↓
9. Use in React components
```

## Examples

### Creating a Task (Full Flow)

**1. API Route (apps/api/app/tasks/route.ts)**

```typescript
import type { Task } from "@workspace/types";
import type { CreateResponse } from "@workspace/types/api";

export async function POST(request: Request) {
  // ... validation ...

  const [newTask] = await db.insert(tasks).values(data).returning();

  const response: CreateResponse<Task> = {
    success: true,
    message: "Task created successfully",
    data: newTask, // newTask is typed as Task automatically!
  };

  return NextResponse.json(response);
}
```

**2. API Client (apps/app/lib/api/tasks.ts)**

```typescript
import type { Task, InsertTask } from "@workspace/types";
import type { CreateResponse } from "@workspace/types/api";

export type CreateTaskInput = Omit<
  InsertTask,
  "id" | "clerkUserId" | "createdAt" | "updatedAt"
>;

export async function createTask(
  input: CreateTaskInput
): Promise<CreateResponse<Task>> {
  return api.post<CreateResponse<Task>>("/tasks", input);
}
```

**3. TanStack Query Hook (apps/app/hooks/use-tasks.ts)**

```typescript
import type { CreateTaskInput, CreateTaskResponse } from "@/lib/api/tasks";

export function useCreateTask() {
  return useMutation({
    mutationFn: createTask,
    onSuccess: (response: CreateTaskResponse) => {
      const newTask = response.data; // Fully typed!
      // ...
    },
  });
}
```

**4. React Component (apps/app/components/tasks-content.tsx)**

```typescript
import type { Task } from "@workspace/types";

function TasksContent() {
  const { data } = useTasks();  // data.data is Task[]

  return (
    <>
      {data.data.map((task: Task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </>
  );
}
```

## Adding New Resources

### 1. Add Database Schema

```typescript
// packages/database/src/schema.ts
export const comments = pgTable("comments", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  taskId: integer("task_id").notNull(),
  content: text().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Comment = typeof comments.$inferSelect;
export type InsertComment = typeof comments.$inferInsert;
```

### 2. Export from Database Package

```typescript
// packages/database/src/index.ts
export { comments, type Comment, type InsertComment } from "./schema";
```

### 3. Re-export from Types Package

```typescript
// packages/types/src/database.ts
export type {
  Task,
  InsertTask,
  Comment, // Add new type
  InsertComment, // Add new type
  // ...
} from "@workspace/database";
```

### 4. Use in API

```typescript
// apps/api/app/comments/route.ts
import type { Comment } from "@workspace/types";
import type { CreateResponse } from "@workspace/types/api";

export async function POST(request: Request) {
  const [newComment] = await db.insert(comments).values(data).returning();

  const response: CreateResponse<Comment> = {
    success: true,
    message: "Comment created",
    data: newComment,
  };

  return NextResponse.json(response);
}
```

### 5. Use in App

```typescript
// apps/app/lib/api/comments.ts
import type { Comment } from "@workspace/types";

export async function getComments(): Promise<Comment[]> {
  return api.get<Comment[]>("/comments");
}
```

## Type Guards

Use type guards for runtime type checking:

```typescript
import { isSuccessResponse, isErrorResponse } from "@workspace/types/api";

const response = await createTask(data);

if (isSuccessResponse(response)) {
  console.log(response.data); // TypeScript knows data exists
} else if (isErrorResponse(response)) {
  console.error(response.error); // TypeScript knows error exists
}
```

## Best Practices

### 1. Always Import from @workspace/types

```typescript
// ✅ Good
import type { Task } from "@workspace/types";

// ❌ Bad (don't import from database directly in apps)
import type { Task } from "@workspace/database";
```

### 2. Use Generic API Types

```typescript
// ✅ Good
const response: CreateResponse<Task> = {
  success: true,
  message: "Created",
  data: task,
};

// ❌ Bad (custom response format)
const response = {
  task: task,
  created: true,
};
```

### 3. Extend Generic Types When Needed

```typescript
// ✅ Good (extending for app-specific needs)
interface TasksListResponse extends ListResponse<Task> {
  metadata: {
    completed: number;
    inProgress: number;
  };
}

// ❌ Bad (creating from scratch)
interface TasksListResponse {
  success: true;
  tasks: Task[];
  // ...
}
```

### 4. Use Omit/Pick for Input Types

```typescript
// ✅ Good (derive from database type)
export type CreateTaskInput = Omit<
  InsertTask,
  "id" | "clerkUserId" | "createdAt" | "updatedAt"
>;

// ❌ Bad (duplicate definition)
export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: string;
}
```

## Benefits Summary

✅ **Single Source of Truth** - Database schema is the only place to define structure  
✅ **Type Safety** - Full type safety from database to UI  
✅ **Automatic Sync** - Schema changes propagate automatically  
✅ **No Duplication** - Types defined once, used everywhere  
✅ **Consistency** - Generic API types ensure consistent responses  
✅ **Maintainability** - Easy to understand and maintain  
✅ **Refactoring** - Rename once, update everywhere

## Learn More

- [Types Package README](./packages/types/README.md)
- [Database Package README](./packages/database/README.md)
- [Drizzle ORM Docs](https://orm.drizzle.team/)
