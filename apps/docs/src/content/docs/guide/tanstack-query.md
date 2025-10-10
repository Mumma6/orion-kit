---
title: TanStack Query Integration
---

# TanStack Query Integration

Orion Kit uses [TanStack Query](https://tanstack.com/query) (formerly React Query) for server state management. This provides a powerful, declarative API for fetching, caching, and updating data.

## Why TanStack Query?

### Problems with Manual Fetching

```typescript
// ❌ Manual approach - lots of boilerplate
const [data, setData] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/tasks");
      const data = await response.json();
      setData(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);
```

**Issues:**

- 🔴 No caching - refetch on every mount
- 🔴 No automatic refetching
- 🔴 Race conditions with concurrent requests
- 🔴 No request deduplication
- 🔴 Complex invalidation logic
- 🔴 Lots of boilerplate

### TanStack Query Solution

```typescript
// ✅ TanStack Query - clean and powerful
const { data, isLoading, error } = useTasks();
```

**Benefits:**

- ✅ Automatic caching and cache invalidation
- ✅ Background refetching
- ✅ Request deduplication
- ✅ Optimistic updates
- ✅ Loading and error states
- ✅ Minimal boilerplate

## Architecture

```
apps/app/
├── components/
│   └── providers.tsx          # QueryClientProvider setup
├── lib/
│   └── api/
│       ├── client.ts          # Generic fetch wrapper
│       ├── tasks.ts           # Task API functions
│       └── README.md
└── hooks/
    ├── use-tasks.ts           # TanStack Query hooks
    └── README.md
```

### 1. Provider Setup

`components/providers.tsx` sets up the QueryClient:

```typescript
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Data fresh for 5 min
      gcTime: 1000 * 60 * 10, // Keep in cache for 10 min
      retry: 1, // Retry failed requests once
      refetchOnWindowFocus: true, // Refetch on window focus
    },
  },
});
```

### 2. API Client

`lib/api/client.ts` provides a generic fetch wrapper:

```typescript
export const api = {
  get: <T>(endpoint: string) => fetcher<T>(endpoint, { method: "GET" }),
  post: <T>(endpoint: string, data: unknown) =>
    fetcher<T>(endpoint, { method: "POST", body: JSON.stringify(data) }),
  // ... put, patch, delete
};
```

Features:

- Automatic `credentials: include` for auth cookies
- JSON content type headers
- Error handling
- TypeScript generics for type safety

### 3. API Functions

`lib/api/tasks.ts` defines API functions with TypeScript types:

```typescript
export interface Task {
  id: number;
  title: string;
  status: "todo" | "in-progress" | "completed" | "cancelled";
  // ...
}

export async function getTasks(): Promise<TasksResponse> {
  return api.get<TasksResponse>("/tasks");
}

export async function createTask(
  input: CreateTaskInput
): Promise<CreateTaskResponse> {
  return api.post<CreateTaskResponse>("/tasks", input);
}
```

### 4. TanStack Query Hooks

`hooks/use-tasks.ts` wraps API functions with TanStack Query:

```typescript
// Query keys for cache management
export const tasksKeys = {
  all: ["tasks"],
  lists: () => [...tasksKeys.all, "list"],
};

// Fetch tasks
export function useTasks() {
  return useQuery({
    queryKey: tasksKeys.lists(),
    queryFn: getTasks,
  });
}

// Create task mutation
export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: tasksKeys.lists() });
    },
  });
}
```

### 5. Usage in Components

Components use the hooks:

```typescript
function TasksList() {
  // Automatic caching, loading, error handling
  const { data, isLoading, error, refetch } = useTasks();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      {data.tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
      <button onClick={() => refetch()}>Refresh</button>
    </div>
  );
}
```

## Features in Detail

### Automatic Caching

Data is cached automatically. Multiple components using `useTasks()` share the same cache:

```typescript
// Component A
const { data } = useTasks(); // Fetches from API

// Component B (mounted later)
const { data } = useTasks(); // Uses cached data, no API call!
```

### Background Refetching

Data refetches automatically:

- When the browser window regains focus
- When the network reconnects
- At configured intervals (if enabled)

```typescript
const { data } = useTasks();
// Switch tabs, come back → data automatically refetches
```

### Request Deduplication

Multiple components requesting the same data trigger only one network request:

```typescript
// Both components mount at the same time
function ComponentA() {
  const { data } = useTasks(); // Triggers fetch
}

function ComponentB() {
  const { data } = useTasks(); // Waits for the same fetch
}
// Only ONE network request is made!
```

## Best Practices

### 1. Always Use Hooks, Not API Functions Directly

```typescript
// ✅ Good
function MyComponent() {
  const { data } = useTasks();
  return <div>{data.total} tasks</div>;
}

// ❌ Bad
function MyComponent() {
  const [data, setData] = useState(null);
  useEffect(() => {
    getTasks().then(setData);
  }, []);
  return <div>{data?.total} tasks</div>;
}
```

### 2. Define TypeScript Types

```typescript
// ✅ Good
export interface Task {
  id: number;
  title: string;
  status: "todo" | "in-progress" | "completed";
}

export async function getTasks(): Promise<Task[]> {
  return api.get<Task[]>("/tasks");
}

// ❌ Bad (no types)
export async function getTasks() {
  return api.get("/tasks");
}
```

### 3. Use Query Keys Consistently

```typescript
// ✅ Good
export const tasksKeys = {
  all: ["tasks"],
  lists: () => [...tasksKeys.all, "list"],
};

export function useTasks() {
  return useQuery({
    queryKey: tasksKeys.lists(),
    queryFn: getTasks,
  });
}

// When invalidating
queryClient.invalidateQueries({ queryKey: tasksKeys.lists() });

// ❌ Bad (hardcoded keys)
useQuery({ queryKey: ["tasks"], queryFn: getTasks });
queryClient.invalidateQueries({ queryKey: ["tasks"] });
```

## Learn More

- [TanStack Query Docs](https://tanstack.com/query/latest/docs/react/overview)
- [Query Keys Guide](https://tanstack.com/query/latest/docs/react/guides/query-keys)
- [Mutations Guide](https://tanstack.com/query/latest/docs/react/guides/mutations)
- [Optimistic Updates](https://tanstack.com/query/latest/docs/react/guides/optimistic-updates)

## Summary

TanStack Query provides:

✅ **Automatic caching** - Share data across components  
✅ **Background refetching** - Keep data fresh automatically  
✅ **Request deduplication** - One request for multiple consumers  
✅ **Loading & error states** - Built-in state management  
✅ **Optimistic updates** - Instant UI updates  
✅ **Type safety** - Full TypeScript support  
✅ **Minimal boilerplate** - Clean, declarative code

It's the industry standard for data fetching in React, and it's production-ready! 🚀
