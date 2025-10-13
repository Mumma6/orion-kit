---
title: Types Package
description: Centralized API response types
---

# @workspace/types

Centralized API response types. Composes domain types into consistent API contracts.

## Purpose

**Single source of truth for API responses** - Used by both API and frontend.

**What lives here:**

- ✅ Generic responses: `CreateResponse<T>`, `ListResponse<T>`, `UpdateResponse<T>`
- ✅ Composed responses: `CreateTaskResponse`, `TasksListResponse`, `SubscriptionResponse`
- ✅ Input types: `CreateTaskInput`, `UpdatePreferencesInput`

**What doesn't:**

- ❌ Database entities → `@workspace/database`
- ❌ Payment types → `@workspace/payment`
- ❌ Zod schemas → domain packages

## Generic Responses

```typescript
export interface CreateResponse<T> {
  success: true;
  message: string;
  data: T;
}

export interface ListResponse<T> {
  success: true;
  data: T[];
  total: number;
}
```

## Composed Types

```typescript
import type { Task } from "@workspace/database";

export type CreateTaskInput = Omit<
  import("@workspace/database").InsertTask,
  "id" | "clerkUserId" | "createdAt" | "updatedAt"
>;

export type CreateTaskResponse = CreateResponse<Task>;

export interface TasksListResponse extends ListResponse<Task> {
  userId: string;
  completed: number;
  inProgress: number;
  todo: number;
}
```

## Usage

**API route:**

```typescript
import type { CreateTaskResponse } from "@workspace/types";

const response: CreateTaskResponse = {
  success: true,
  message: "Created",
  data: newTask,
};
```

**Frontend hook:**

```typescript
import type { TasksListResponse, CreateTaskInput } from "@workspace/types";

export function useTasks() {
  return useQuery<TasksListResponse>({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });
}
```

## Benefits

- ✅ API and frontend use identical types
- ✅ No duplication
- ✅ TypeScript catches contract mismatches
- ✅ Update once, affects everywhere

See [Type System](/architecture/type-system) for architecture details.
