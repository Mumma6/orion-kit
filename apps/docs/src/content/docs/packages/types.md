---
title: Types Package
description: Centralized API response types for the monorepo
---

# @workspace/types

Centralized API response types package that composes domain types from other packages into consistent API contracts.

## Purpose

The `@workspace/types` package provides:

1. **Generic API Response Interfaces** - Reusable response wrappers
2. **Composed Response Types** - Domain types wrapped in API responses
3. **Single Source of Truth** - Eliminates duplicate response type definitions

## Architecture

```
┌──────────────────────────────────────────────┐
│         @workspace/types                     │
│                                              │
│  ┌────────────────────────────────────────┐ │
│  │  Generic API Responses                 │ │
│  │  - ApiSuccessResponse<T>               │ │
│  │  - CreateResponse<T>                   │ │
│  │  - ListResponse<T>                     │ │
│  │  - UpdateResponse<T>                   │ │
│  └────────────────────────────────────────┘ │
│              ▲                               │
│              │ Composes with                 │
│              ▼                               │
│  ┌────────────────────────────────────────┐ │
│  │  Domain Types (imported)               │ │
│  │  - Task (from @workspace/database)     │ │
│  │  - CheckoutSession (from payment)      │ │
│  └────────────────────────────────────────┘ │
│              │                               │
│              ▼                               │
│  ┌────────────────────────────────────────┐ │
│  │  Composed Response Types               │ │
│  │  - CreateTaskResponse                  │ │
│  │  - TasksListResponse                   │ │
│  │  - SubscriptionResponse                │ │
│  └────────────────────────────────────────┘ │
└──────────────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
   ┌────▼────┐            ┌─────▼────┐
   │ API App │            │ Frontend │
   │         │            │   App    │
   │ Routes  │            │  Hooks   │
   └─────────┘            └──────────┘
```

## Installation

```json
{
  "dependencies": {
    "@workspace/types": "workspace:*"
  }
}
```

## What Lives Where

### ❌ NOT in @workspace/types

- Database entities (→ `@workspace/database`)
- Zod schemas (→ `@workspace/database` or `@workspace/payment`)
- Payment domain types (→ `@workspace/payment`)

### ✅ IN @workspace/types

- Generic API response interfaces
- Composed response types using domain types
- Input types for API requests (derived from domain types)

## Generic API Responses

These are the building blocks for all API responses:

```typescript
// Generic success wrapper
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

// Generic error wrapper
export interface ApiErrorResponse {
  success: false;
  error: string;
  message?: string;
  code?: string;
}

// CRUD response types
export interface CreateResponse<T> {
  success: true;
  message: string;
  data: T;
}

export interface UpdateResponse<T> {
  success: true;
  message: string;
  data: T;
}

export interface ListResponse<T> {
  success: true;
  data: T[];
  total: number;
}

export interface DeleteResponse {
  success: true;
  message: string;
  deletedId?: string | number;
}
```

## Composed Response Types

These combine generic responses with domain types:

### Task Responses (`src/tasks.ts`)

```typescript
import type { Task } from "@workspace/database";
import type { CreateResponse, ListResponse } from "./api";

// Input type (for API requests)
export type CreateTaskInput = Omit<
  import("@workspace/database").InsertTask,
  "id" | "clerkUserId" | "createdAt" | "updatedAt"
>;

// Response types (for API responses)
export type CreateTaskResponse = CreateResponse<Task>;

export interface TasksListResponse extends ListResponse<Task> {
  userId: string;
  userName: string;
  completed: number;
  inProgress: number;
  todo: number;
}
```

### Billing Responses (`src/billing.ts`)

```typescript
import type {
  CheckoutSession,
  SubscriptionData,
  PortalSession,
} from "@workspace/payment";
import type { ApiSuccessResponse } from "./api";

export type CreateCheckoutSessionResponse = ApiSuccessResponse<CheckoutSession>;
export type SubscriptionResponse = ApiSuccessResponse<SubscriptionData>;
export type CreatePortalSessionResponse = ApiSuccessResponse<PortalSession>;
```

### Preferences Responses (`src/preferences.ts`)

```typescript
import type { UserPreference } from "@workspace/database";
import type { ApiSuccessResponse, UpdateResponse } from "./api";

export type PreferencesResponse = ApiSuccessResponse<UserPreference>;
export type UpdatePreferencesResponse = UpdateResponse<UserPreference>;
```

## Usage

### In API Routes

```typescript
import { db, tasks, createTaskInputSchema } from "@workspace/database";
import type { CreateTaskResponse, TasksListResponse } from "@workspace/types";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const validated = createTaskInputSchema.parse(body);

  const [newTask] = await db
    .insert(tasks)
    .values({ ...validated, clerkUserId: userId })
    .returning();

  // Use composed response type
  const response: CreateTaskResponse = {
    success: true,
    message: "Task created",
    data: newTask,
  };

  return NextResponse.json(response);
}
```

### In Frontend API Clients

```typescript
import type {
  TasksListResponse,
  CreateTaskResponse,
  CreateTaskInput,
} from "@workspace/types";
import { api } from "./client";

export async function getTasks(): Promise<TasksListResponse> {
  return api.get<TasksListResponse>("/tasks");
}

export async function createTask(
  input: CreateTaskInput
): Promise<CreateTaskResponse> {
  return api.post<CreateTaskResponse>("/tasks", input);
}
```

### In TanStack Query Hooks

```typescript
import { useQuery, useMutation } from "@tanstack/react-query";
import type { TasksListResponse, CreateTaskInput } from "@workspace/types";
import { getTasks, createTask } from "@/lib/api/tasks";

export function useTasks() {
  return useQuery<TasksListResponse>({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });
}

export function useCreateTask() {
  return useMutation({
    mutationFn: (input: CreateTaskInput) => createTask(input),
  });
}
```

## Benefits

### ✅ Single Source of Truth

API and Frontend use **identical** response types from one package.

```typescript
// ✅ Both use the same type
// apps/api/app/tasks/route.ts
import type { TasksListResponse } from "@workspace/types";

// apps/app/hooks/use-tasks.ts
import type { TasksListResponse } from "@workspace/types";
```

### ✅ No Duplication

Before:

```typescript
// ❌ Duplicated in API
// apps/api/lib/types.ts
export interface TasksListResponse { ... }

// ❌ Duplicated in App
// apps/app/lib/types.ts
export interface TasksListResponse { ... }
```

After:

```typescript
// ✅ Defined once
// packages/types/src/tasks.ts
export interface TasksListResponse { ... }
```

### ✅ Type Safety Across Apps

TypeScript catches API contract mismatches at compile time:

```typescript
// If API changes response shape
const response: TasksListResponse = {
  success: true,
  data: tasks,
  // Missing 'total' field → TypeScript error!
};
```

## Package Structure

```
packages/types/
├── src/
│   ├── api.ts          # Generic API response interfaces
│   ├── tasks.ts        # Task-specific composed types
│   ├── preferences.ts  # Preferences composed types
│   ├── billing.ts      # Billing composed types
│   └── index.ts        # Exports everything
├── package.json
└── tsconfig.json
```

## Import Pattern

### Generic Responses

```typescript
import type {
  ApiSuccessResponse,
  ApiErrorResponse,
  CreateResponse,
  ListResponse,
} from "@workspace/types";
```

### Domain-Specific Responses

```typescript
import type {
  TasksListResponse,
  CreateTaskResponse,
  CreateTaskInput,
} from "@workspace/types";
```

### Domain Types (still from their packages)

```typescript
// ✅ Import entities from domain packages
import type { Task } from "@workspace/database";
import type { PricingPlan } from "@workspace/payment";

// ❌ Don't import from @workspace/types
// Types package re-uses them, doesn't re-export them
```

## Best Practices

### 1. Use Composed Types for API Responses

```typescript
// ✅ Good - use composed type
const response: CreateTaskResponse = {
  success: true,
  message: "Created",
  data: task,
};

// ❌ Bad - inline response type
const response: { success: true; data: Task } = { ... };
```

### 2. Import Domain Types from Their Packages

```typescript
// ✅ Good - import from domain package
import type { Task } from "@workspace/database";
import type { CreateTaskResponse } from "@workspace/types";

// ❌ Bad - expecting types to export Task
import type { Task } from "@workspace/types"; // Won't work!
```

### 3. Extend Generic Types When Needed

```typescript
// ✅ Good - extend generic type
export interface TasksListResponse extends ListResponse<Task> {
  userId: string;
  userName: string;
  completed: number;
  inProgress: number;
  todo: number;
}
```

## Type Guards

Use type guards for runtime type checking:

```typescript
import { isSuccessResponse, isErrorResponse } from "@workspace/types";

const response = await fetchData();

if (isSuccessResponse(response)) {
  console.log(response.data); // TypeScript knows data exists
} else if (isErrorResponse(response)) {
  console.error(response.error); // TypeScript knows error exists
}
```

## Adding New Types

### 1. Add Generic Response (if needed)

```typescript
// packages/types/src/api.ts
export interface BatchResponse<T> {
  success: true;
  data: T[];
  total: number;
  processed: number;
  failed: number;
}
```

### 2. Create Domain-Specific File

```typescript
// packages/types/src/comments.ts
import type { Comment } from "@workspace/database";
import type { CreateResponse, ListResponse } from "./api";

export type CreateCommentInput = Omit<
  import("@workspace/database").InsertComment,
  "id" | "userId" | "createdAt"
>;

export type CreateCommentResponse = CreateResponse<Comment>;
export type CommentsListResponse = ListResponse<Comment>;
```

### 3. Export from Index

```typescript
// packages/types/src/index.ts
export * from "./api";
export * from "./tasks";
export * from "./preferences";
export * from "./billing";
export * from "./comments"; // Add new export
```

## Summary

| Type Category         | Lives In              | Example                          |
| --------------------- | --------------------- | -------------------------------- |
| Database Entities     | `@workspace/database` | `Task`, `UserPreference`         |
| Zod Schemas           | `@workspace/database` | `createTaskInputSchema`          |
| Payment Domain        | `@workspace/payment`  | `CheckoutSession`, `PricingPlan` |
| Generic API Responses | `@workspace/types`    | `CreateResponse<T>`              |
| Composed Responses    | `@workspace/types`    | `CreateTaskResponse`             |
| Input Types           | `@workspace/types`    | `CreateTaskInput`                |

**Key Principle:** Domain packages own data types, `@workspace/types` owns API response types.

## Learn More

- [Type System Architecture](/architecture/type-system)
- [Database Package](/packages/database)
- [Payment Package](/packages/payment)
