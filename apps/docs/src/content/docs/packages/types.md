---
title: types
---

Shared TypeScript types across all Orion Kit apps and packages.

## Purpose

This package provides:

1. **Generic API Types** - Standard request/response formats
2. **Database Types** - Re-exports from `@workspace/database`
3. **Type Guards** - Runtime type checking utilities

## Why This Package?

### ❌ Before (Type Duplication)

```typescript
// apps/api/types.ts
interface Task {
  id: number;
  title: string;
  // ... duplicated
}

// apps/app/types.ts
interface Task {
  id: number;
  title: string;
  // ... duplicated again!
}
```

**Problems:**

- Duplicated type definitions
- Types can drift out of sync
- Maintenance nightmare

### ✅ After (Single Source of Truth)

```typescript
// Everywhere
import { Task } from "@workspace/types";
```

**Benefits:**

- Single source of truth
- Types always in sync
- Less maintenance

## Installation

Add to your app's `package.json`:

```json
{
  "dependencies": {
    "@workspace/types": "workspace:*"
  }
}
```

## Usage

### Database Types (for SELECT queries)

```typescript
import type { Task, UserPreference } from "@workspace/types";

// Task type comes directly from Drizzle schema!
// Use for data FROM the database
const task: Task = {
  id: 1,
  clerkUserId: "user_123",
  title: "My task",
  status: "todo",
  createdAt: new Date(),
  updatedAt: new Date(),
  // ... fully typed
};
```

### Input Types (for CREATE/UPDATE - Zod-inferred!)

```typescript
import type { CreateTaskInput } from "@workspace/types";
import { createTaskInputSchema } from "@workspace/types";

// ✅ Type inferred from Zod schema
const input: CreateTaskInput = {
  title: "My task",
  description: "Description",
  status: "todo",
  // No id, clerkUserId, timestamps - correct!
};

// ✅ Validate at runtime
const validated = createTaskInputSchema.parse(userInput);
```

### Generic API Responses

```typescript
import type { ApiSuccessResponse, CreateResponse } from "@workspace/types/api";

// Consistent API response format
const response: CreateResponse<Task> = {
  success: true,
  message: "Task created successfully",
  data: newTask,
};
```

### List Responses

```typescript
import type { ListResponse, Task } from "@workspace/types";

const tasksResponse: ListResponse<Task> = {
  success: true,
  data: [task1, task2, task3],
  total: 3,
};
```

### Type Guards

```typescript
import { isSuccessResponse, isErrorResponse } from "@workspace/types/api";

const response = await fetchData();

if (isSuccessResponse(response)) {
  // TypeScript knows response.data exists
  console.log(response.data);
} else if (isErrorResponse(response)) {
  // TypeScript knows response.error exists
  console.error(response.error);
}
```

## API Types Reference

### Success Response

```typescript
interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
}
```

### Error Response

```typescript
interface ApiErrorResponse {
  success: false;
  error: string;
  message?: string;
  code?: string;
  statusCode?: number;
}
```

### Create Response

```typescript
interface CreateResponse<T> {
  success: true;
  message: string;
  data: T;
}
```

### Update Response

```typescript
interface UpdateResponse<T> {
  success: true;
  message: string;
  data: T;
}
```

### Delete Response

```typescript
interface DeleteResponse {
  success: true;
  message: string;
  deletedId?: string | number;
}
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

### Paginated Response

```typescript
interface PaginatedResponse<T> {
  success: true;
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}
```

## Database Types

All database types are re-exported from `@workspace/database`:

```typescript
import type {
  Task,
  InsertTask,
  UserPreference,
  InsertUserPreference,
} from "@workspace/types";
```

These types are **inferred directly from Drizzle schemas**, so they're always in sync with your database!

## Type Strategy

### Database Entity Types (from Drizzle)

For data **FROM** the database:

```typescript
import type { Task, UserPreference } from "@workspace/types";

// ✅ Use for:
// - API responses
// - Database query results
// - Displaying data
```

### Input Types (from Zod)

For data **TO** the database:

```typescript
import type { CreateTaskInput } from "@workspace/types";
import { createTaskInputSchema } from "@workspace/types";

// ✅ Use for:
// - API request validation
// - Form validation
// - User input
```

**Why Zod for inputs?**

- Runtime validation
- Correct fields (omits auto-generated)
- Custom validation rules
- Better error messages

See [WHY_ZOD.md](./WHY_ZOD.md) for detailed explanation.

## Best Practices

### 1. Import from @workspace/types

```typescript
// ✅ Good - entity type for SELECT
import type { Task } from "@workspace/types";

// ✅ Good - Zod-inferred type for input
import type { CreateTaskInput } from "@workspace/types";

// ❌ Bad (duplicating types)
interface Task {
  id: number;
  title: string;
}

// ❌ Bad (using InsertTask for API input)
import type { InsertTask } from "@workspace/database";
```

### 2. Use Generic API Types

```typescript
// ✅ Good
import type { CreateResponse, Task } from "@workspace/types";

async function createTask(data: InsertTask): Promise<CreateResponse<Task>> {
  // ...
}

// ❌ Bad (custom response format)
async function createTask(data: any): Promise<{ task: Task }> {
  // ...
}
```

### 3. Use Type Guards

```typescript
// ✅ Good
import { isSuccessResponse } from "@workspace/types/api";

if (isSuccessResponse(response)) {
  console.log(response.data); // Fully typed!
}

// ❌ Bad (manual type checking)
if (response.success === true) {
  console.log((response as any).data);
}
```

### 4. Extend Generic Types When Needed

```typescript
import type { ListResponse, Task } from "@workspace/types";

// Add app-specific metadata
interface TasksListResponse extends ListResponse<Task> {
  metadata: {
    completedCount: number;
    inProgressCount: number;
    todoCount: number;
  };
}
```

## Adding New Types

### For Database Models

Add to `packages/database/src/schema.ts`:

```typescript
export const newTable = pgTable("new_table", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  // ...
});

export type NewModel = typeof newTable.$inferSelect;
export type InsertNewModel = typeof newTable.$inferInsert;
```

Then export from `packages/database/src/index.ts`:

```typescript
export { newTable, type NewModel, type InsertNewModel } from "./schema";
```

The types will automatically be available via `@workspace/types`!

### For Generic API Types

Add to `packages/types/src/api.ts`:

```typescript
export interface YourCustomResponse<T> {
  success: true;
  data: T;
  customField: string;
}
```

## Learn More

- [Database Package](../database/README.md)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
