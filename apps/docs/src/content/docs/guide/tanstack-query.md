---
title: TanStack Query
---

# TanStack Query

Automatic caching, background refetching, and request deduplication for server state.

## Why?

**Without TanStack Query:**

- Manual loading/error state
- No caching (refetch on every mount)
- Race conditions
- Lots of boilerplate

**With TanStack Query:**

```typescript
const { data, isLoading } = useTasks(); // Done.
```

Automatic caching, refetching, deduplication, and loading states.

## Architecture

```
app/providers.tsx       # QueryClient setup
lib/api/tasks.ts        # API functions
hooks/use-tasks.ts      # TanStack Query hooks
components/tasks.tsx    # Use hooks
```

## Usage Pattern

**1. API Function** (`lib/api/tasks.ts`):

```typescript
export async function getTasks(): Promise<TasksListResponse> {
  return api.get<TasksListResponse>("/tasks");
}
```

**2. Hook** (`hooks/use-tasks.ts`):

```typescript
export const tasksKeys = { all: ["tasks"] };

export function useTasks() {
  return useQuery({
    queryKey: tasksKeys.all,
    queryFn: getTasks,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tasksKeys.all });
    },
  });
}
```

**3. Component**:

```typescript
function TasksList() {
  const { data, isLoading } = useTasks();
  const createTask = useCreateTask();

  if (isLoading) return <Spinner />;
  return <div>{data.tasks.map(task => <TaskItem {...task} />)}</div>;
}
```

## Key Features

- **Automatic caching** - Multiple components share same data
- **Background refetch** - Updates on window focus/network reconnect
- **Request deduplication** - One request for multiple consumers
- **Optimistic updates** - Instant UI feedback

See [TanStack Query docs](https://tanstack.com/query) for more.
