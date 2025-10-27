---
title: Architecture Overview
---

:::tip[TL;DR]
Orion Kit is a monorepo with 5 apps sharing packages. Database schema drives everything with end-to-end type safety. Built for production with authentication, payments, analytics, and monitoring.
:::

## Tech Stack

| Layer             | Technology            | Purpose                                 |
| ----------------- | --------------------- | --------------------------------------- |
| **Frontend**      | Next.js 15 App Router | React 19, SSR, RSC                      |
| **Auth**          | Custom JWT            | User management                         |
| **Database**      | Neon + Drizzle ORM    | Serverless Postgres + type-safe queries |
| **Payments**      | Stripe                | Subscriptions + checkout                |
| **Email**         | Resend                | Transactional emails                    |
| **Validation**    | Zod                   | Runtime validation                      |
| **Data Fetching** | TanStack Query        | Server state + caching                  |
| **Forms**         | React Hook Form       | Form management                         |
| **UI**            | shadcn/ui + Tailwind  | Components + styling                    |
| **Analytics**     | PostHog + Axiom       | Events + logging                        |
| **Jobs**          | Trigger.dev           | Background tasks                        |
| **Monorepo**      | Turborepo + pnpm      | Build + packages                        |

## Data Flow

**Creating a task:**

```
User fills form
  ↓
Zod validates (client)
  ↓
Submit to API
  ↓
Zod validates (server)
  ↓
Drizzle inserts
  ↓
TanStack Query updates cache
  ↓
UI updates
```

**Fetching tasks:**

```
Component calls useTasks()
  ↓
TanStack Query checks cache
  ↓
If stale, fetch from API
  ↓
JWT auth verification
  ↓
Drizzle queries Neon
  ↓
Cache result
  ↓
Render
```

## Type Flow

```
Drizzle Schema (source of truth)
    ↓
TypeScript Types + Zod Schemas (auto-generated with Drizzle-Zod)
    ↓
@workspace/database exports entities + schemas
    ↓
@workspace/types re-exports + composes API responses
    ↓
API + Frontend import ONLY from @workspace/types
```

**Example:**

```typescript
// 1. Define in Drizzle
export const tasks = pgTable("tasks", { id: integer(), title: varchar() });

// 2. Auto-generated with Drizzle Zod
export type Task = typeof tasks.$inferSelect;
export const insertTaskSchema = createInsertSchema(tasks);

// 3. Use everywhere
const validated = insertTaskSchema.parse(body); // API
const form = useForm({ resolver: zodResolver(insertTaskSchema) }); // Frontend
```

See [Type System](/architecture/type-system) and [Type Flow](/architecture/type-flow) for details.

## API Architecture

The API (`apps/api`) is a Next.js 15 App Router application that provides a RESTful interface for all frontend applications. It follows a consistent pattern with JWT authentication, Zod validation, and structured error handling.

### API Endpoints

| Endpoint           | Method    | Auth | Purpose                 |
| ------------------ | --------- | ---- | ----------------------- |
| `/auth/login`      | POST      | ❌   | User authentication     |
| `/auth/register`   | POST      | ❌   | User registration       |
| `/auth/logout`     | POST      | ❌   | User logout             |
| `/auth/me`         | GET       | ✅   | Get current user        |
| `/account/profile` | PUT       | ✅   | Update user profile     |
| `/account/delete`  | DELETE    | ✅   | Delete user account     |
| `/tasks`           | GET       | ✅   | List user tasks         |
| `/tasks`           | POST      | ✅   | Create new task         |
| `/tasks/[id]`      | PUT/PATCH | ✅   | Update task             |
| `/tasks/[id]`      | DELETE    | ✅   | Delete task             |
| `/preferences`     | GET       | ✅   | Get user preferences    |
| `/preferences`     | PUT       | ✅   | Update preferences      |
| `/subscription`    | GET       | ✅   | Get subscription status |
| `/subscription`    | DELETE    | ✅   | Cancel subscription     |
| `/checkout`        | POST      | ✅   | Create Stripe checkout  |
| `/billing-portal`  | POST      | ✅   | Create billing portal   |
| `/webhooks/stripe` | POST      | ❌   | Stripe webhook handler  |
| `/health`          | GET       | ❌   | Health check            |

### Authentication Flow

```typescript
// 1. Login/Register returns JWT token
const response = await fetch("/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});

const { token, user } = await response.json();

// 2. Store token in localStorage
localStorage.setItem("auth-token", token);

// 3. Include token in subsequent requests
const tasks = await fetch("/api/tasks", {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});
```

### Request/Response Pattern

All API endpoints follow a consistent structure:

**Success Response:**

```typescript
{
  success: true,
  data: T,           // Response data
  message?: string,  // Optional success message
  total?: number     // For list endpoints
}
```

**Error Response:**

```typescript
{
  success: false,
  error: string,     // Error message
  details?: any      // Validation errors or additional info
}
```

### Validation & Security

1. **Zod Validation** - All input validated with Zod schemas
2. **JWT Authentication** - Protected routes require valid JWT
3. **CORS Protection** - Configured for specific origins
4. **Rate Limiting** - Built into middleware
5. **Input Sanitization** - All user input validated and sanitized

### Error Handling

```typescript
// API route error handling pattern
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validated = schema.parse(body);

    // Business logic...

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

### Middleware & CORS

The API uses Next.js middleware for:

- **CORS handling** - Configured for specific origins
- **Authentication** - JWT verification for protected routes
- **Request logging** - All requests logged to Axiom
- **Rate limiting** - Built-in protection against abuse

### Database Integration

- **Drizzle ORM** - Type-safe database queries
- **Connection pooling** - Optimized for serverless
- **Transactions** - Multi-step operations wrapped in transactions
- **Migrations** - Version-controlled schema changes

### TanStack Query Integration

The frontend uses TanStack Query for all API communication, providing caching, background updates, and optimistic updates.

**Query Keys Pattern:**

```typescript
export const tasksKeys = {
  all: ["tasks"] as const,
  lists: () => [...tasksKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) =>
    [...tasksKeys.lists(), filters] as const,
  details: () => [...tasksKeys.all, "detail"] as const,
  detail: (id: number) => [...tasksKeys.details(), id] as const,
};
```

**Query Hooks:**

```typescript
// Fetch data with caching
export function useTasks() {
  return useQuery<TasksListResponse>({
    queryKey: tasksKeys.lists(),
    queryFn: getTasks,
  });
}

// Mutations with optimistic updates
export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,
    onSuccess: (response) => {
      // Optimistic update
      queryClient.setQueryData<TasksListResponse>(tasksKeys.lists(), (old) => {
        if (!old) return old;
        return {
          ...old,
          data: [response.data, ...old.data],
          total: old.total + 1,
        };
      });
    },
    onError: (error) => {
      showErrorToast(error, "Failed to create task");
    },
  });
}
```

**Key Features:**

- **Automatic Caching** - Responses cached by query key
- **Background Refetching** - Data stays fresh automatically
- **Optimistic Updates** - UI updates immediately, rolls back on error
- **Error Handling** - Centralized error management with toast notifications
- **Loading States** - Built-in loading, error, and success states
- **Cache Invalidation** - Smart cache updates after mutations

## Key Principles

1. **Database schema = source of truth** - Everything derives from it
2. **Validate twice** - Client (UX) + server (security)
3. **Type-safe everywhere** - @workspace/types ensures API/frontend alignment
4. **Cache by default** - TanStack Query handles it
5. **Monorepo** - Share code, isolate apps
6. **Consistent API** - All endpoints follow same patterns
7. **Security first** - Authentication, validation, and CORS

[Deployment Guide](/guide/deployment) · [Package Docs](/packages)
