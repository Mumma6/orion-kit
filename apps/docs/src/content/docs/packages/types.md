---
title: Types Package
description: Centralized API response types
---

Centralized type system that combines database entities, domain types, and API responses into a consistent, reusable structure.

## What It Does

This package is the **type hub** for Orion Kit:

- **Combines types** from multiple packages (database, payment) into API contracts
- **Exports Zod schemas** for validation
- **Provides generic response types** as building blocks
- **Ensures consistency** between API and frontend

## Architecture

```
┌─────────────────────────────────────────┐
│  @workspace/database  @workspace/payment│
│  (Task, UserPref)     (CheckoutSession) │
└──────────────┬──────────────────────────┘
               │ Import entities
               ▼
    ┌──────────────────────┐
    │  @workspace/types    │
    │  src/api.ts          │  Generic responses
    │  src/auth.ts         │  Auth domain (JWT)
    │  src/tasks.ts        │  Task domain
    │  src/preferences.ts  │  Preferences domain
    │  src/billing.ts      │  Billing domain
    └──────────┬───────────┘
               │ Export composed types
       ┌───────┴────────┐
       │                │
  API Routes      Frontend Hooks
```

## Typed Routes with NextResponse

All API routes use **typed return values** for complete type safety:

```typescript
// API route with typed response
export async function POST(
  req: NextRequest
): Promise<NextResponse<CreateTaskResponse | ApiErrorResponse>> {
  // Implementation...
  return NextResponse.json(response);
}
```

This ensures:

- ✅ **Compile-time safety** - TypeScript catches type mismatches
- ✅ **IDE autocomplete** - Full intellisense for response data
- ✅ **Runtime consistency** - Responses match their declared types

## Type Ownership

| Type Category                 | Owner                 | Example                                     |
| ----------------------------- | --------------------- | ------------------------------------------- |
| **Database entities**         | `@workspace/database` | `Task`, `UserPreference`                    |
| **Zod schemas**               | `@workspace/database` | `createTaskInputSchema`                     |
| **Payment domain**            | `@workspace/payment`  | `CheckoutSession`, `SubscriptionData`       |
| **Auth domain**               | `@workspace/types`    | `AuthUser`, `LoginInput`, `RegisterInput`   |
| **Generic API responses**     | `@workspace/types`    | `ApiResponse<T>`, `ListResponse<T>`         |
| **Domain-specific responses** | `@workspace/types`    | `CreateTaskResponse`, `LoginResponse`       |
| **Input types**               | `@workspace/types`    | `CreateTaskInput`, `UpdatePreferencesInput` |

## Generic API Responses

These are the **building blocks** used across all domains:

````typescript
// packages/types/src/api.ts

/** Standard API response with optional message */
export interface ApiResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

/** Error response with optional details */
export interface ApiErrorResponse {
  success: false;
  error: string;
  details?: unknown;
}

/** List response with total count */
export interface ListResponse<T> {
  success: true;
  data: T[];
  total: number;
}

**When to use:**

- `ApiResponse<T>` - For all responses (GET, POST, PUT, DELETE)
- `ListResponse<T>` - For list/collection endpoints with pagination metadata

**That's it!** Just two generic types that compose everything.

## Domain Pattern

Each domain file (`tasks.ts`, `preferences.ts`, `billing.ts`) follows the same structure:

### Example: Tasks Domain

```typescript
// packages/types/src/tasks.ts
/**
 * Tasks Domain
 * Combines: Database entity + Zod schemas + API responses
 */

import type { Task, InsertTask } from "@workspace/database/schema";
import type { ApiResponse, ListResponse } from "./api";

// ============================================
// ENTITY (from database)
// ============================================
export type { Task } from "@workspace/database/schema";

// ============================================
// INPUT SCHEMAS (Zod - for validation)
// ============================================
export {
  createTaskInputSchema,
  updateTaskInputSchema,
} from "@workspace/database/schema";

// ============================================
// INPUT TYPES (TypeScript - for API requests)
// ============================================
export type CreateTaskInput = Omit<
  InsertTask,
  "id" | "userId" | "createdAt" | "updatedAt"
>;

export type UpdateTaskInput = Partial<CreateTaskInput>;

// ============================================
// API RESPONSE TYPES (composed with generics)
// ============================================

/** Single task response */
export type TaskResponse = ApiResponse<Task>;

/** List response with task-specific metadata */
export interface TasksListResponse extends ListResponse<Task> {
  userId: string;
  userName: string;
  completed: number;
  inProgress: number;
  todo: number;
}

/** Create/Update responses */
export type CreateTaskResponse = ApiResponse<Task>;
export type UpdateTaskResponse = ApiResponse<Task>;

/** Delete response */
export type DeleteTaskResponse = ApiResponse<{ deleted: true }>;
````

### Why This Pattern?

1. **Clear sections** - Easy to find what you need
2. **Combines sources** - Database entities + domain logic + API contracts
3. **Reusable generics** - Just `ApiResponse<T>` and `ListResponse<T>`
4. **Consistent** - Same pattern for every domain

## Usage in Orion Kit

### Database → Types → API → Frontend Flow

**1. Database defines entity:**

```typescript
// packages/database/src/schema.ts
export const tasks = pgTable("tasks", {
  id: integer().primaryKey(),
  userId: varchar("clerk_user_id").notNull(),
  title: varchar({ length: 255 }).notNull(),
  status: taskStatusEnum().default("todo"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Auto-generated by Drizzle
export type Task = typeof tasks.$inferSelect;
export type InsertTask = typeof tasks.$inferInsert;

// Zod schema for validation
export const createTaskInputSchema = createInsertSchema(tasks, {
  title: (schema) => schema.min(1).max(255),
}).pick({ title: true, description: true, status: true });
```

**2. Types package composes:**

```typescript
// packages/types/src/tasks.ts
import type { Task, InsertTask } from "@workspace/database/schema";
import type { ApiResponse } from "./api";

// Export entity
export type { Task };

// Export Zod schema
export { createTaskInputSchema };

// Create input type (omit auto-generated fields)
export type CreateTaskInput = Omit<
  InsertTask,
  "id" | "userId" | "createdAt" | "updatedAt"
>;

// Compose response using generic
export type CreateTaskResponse = ApiResponse<Task>;
```

**3. API route uses types with typed returns:**

```typescript
// apps/api/app/tasks/route.ts
import { createTaskInputSchema } from "@workspace/types";
import type { CreateTaskResponse, ApiErrorResponse } from "@workspace/types";
import { db, tasks } from "@workspace/database";
import { getCurrentUser } from "@workspace/auth/server";

export async function POST(
  req: NextRequest
): Promise<NextResponse<CreateTaskResponse | ApiErrorResponse>> {
  const user = await getCurrentUser(req);

  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await req.json();

  // Validate with Zod
  const validated = createTaskInputSchema.parse(body);

  // Insert to database
  const [newTask] = await db
    .insert(tasks)
    .values({ ...validated, userId: user.id })
    .returning();

  // Return typed response
  const response: CreateTaskResponse = {
    success: true,
    message: "Task created successfully",
    data: newTask,
  };

  return NextResponse.json(response);
}
```

**4. Frontend uses same types:**

```typescript
// apps/app/lib/api/tasks.ts
import type { CreateTaskInput, CreateTaskResponse } from "@workspace/types";

export async function createTask(
  input: CreateTaskInput
): Promise<CreateTaskResponse> {
  return api.post<CreateTaskResponse>("/tasks", input);
}
```

```typescript
// apps/app/hooks/use-tasks.ts
import type { CreateTaskInput, CreateTaskResponse } from "@workspace/types";
import { showSuccessToast } from "@/lib/errors";

export function useCreateTask() {
  return useMutation({
    mutationFn: (input: CreateTaskInput) => createTask(input),
    onSuccess: (response: CreateTaskResponse) => {
      showSuccessToast(response.message); // "Task created successfully"
    },
  });
}
```

```typescript
// apps/app/components/tasks/create-task-dialog.tsx
import { createTaskInputSchema } from "@workspace/types";
import type { CreateTaskInput } from "@workspace/types";

export function CreateTaskDialog() {
  const form = useForm<CreateTaskInput>({
    resolver: zodResolver(createTaskInputSchema), // Same Zod schema!
  });

  const createTask = useCreateTask();

  const handleSubmit = async (data: CreateTaskInput) => {
    await createTask.mutateAsync(data);
  };

  return <form onSubmit={form.handleSubmit(handleSubmit)}>...</form>;
}
```

## Domain Examples

### Auth (Custom JWT System)

Combines JWT authentication types with API responses:

```typescript
// packages/types/src/auth.ts

// Zod schemas for validation
export const LoginInputSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const RegisterInputSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name too long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Input types (from Zod schemas)
export type LoginInput = z.infer<typeof LoginInputSchema>;
export type RegisterInput = z.infer<typeof RegisterInputSchema>;

// Auth user type
export type AuthUser = {
  id: string;
  email: string;
  name?: string;
  image?: string;
  emailVerified?: boolean;
};

// Special response types (include token)
export interface LoginResponse {
  success: true;
  message: string;
  token: string;
  user: AuthUser;
}

export interface RegisterResponse {
  success: true;
  message: string;
  token: string;
  user: AuthUser;
}

// Standard ApiResponse types
export type AuthResponse = ApiResponse<AuthUser | null>;
export type LogoutResponse = ApiResponse<{ loggedOut: true }>;
```

### Tasks (Database Entity)

Combines database types with custom list metadata:

```typescript
// packages/types/src/tasks.ts

// Import from database
import type { Task, InsertTask } from "@workspace/database/schema";

// Input type (omits auto-generated fields)
export type CreateTaskInput = Omit<
  InsertTask,
  "id" | "userId" | "createdAt" | "updatedAt"
>;

// List response with extra metadata
export interface TasksListResponse extends ListResponse<Task> {
  userId: string;
  userName: string;
  completed: number;
  inProgress: number;
  todo: number;
}

// Standard responses
export type CreateTaskResponse = ApiResponse<Task>;
```

### Billing (External Domain)

Combines types from `@workspace/payment` package:

```typescript
// packages/types/src/billing.ts

// Import from payment package (not database!)
import type { CheckoutSession, SubscriptionData } from "@workspace/payment";
import type { ApiResponse } from "./api";

// Export domain types
export type { CheckoutSession, SubscriptionData };

// Compose with generic response
export type CreateCheckoutSessionResponse = ApiResponse<CheckoutSession>;
export type SubscriptionResponse = ApiResponse<SubscriptionData>;
```

## Adding a New Domain

To add a new domain (e.g., "Products"):

**1. Define in database:**

```typescript
// packages/database/src/schema.ts
export const products = pgTable("products", {
  id: integer().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  price: integer().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;
export const createProductInputSchema = createInsertSchema(products);
```

**2. Create domain file:**

```typescript
// packages/types/src/products.ts
/**
 * Products Domain
 * Combines: Database entity + Zod schemas + API responses
 */

import type { Product, InsertProduct } from "@workspace/database/schema";
import type { ApiResponse, ListResponse } from "./api";

// ENTITY
export type { Product } from "@workspace/database/schema";

// INPUT SCHEMAS
export { createProductInputSchema } from "@workspace/database/schema";

// INPUT TYPES
export type CreateProductInput = Omit<
  InsertProduct,
  "id" | "createdAt" | "updatedAt"
>;

export type UpdateProductInput = Partial<CreateProductInput>;

// API RESPONSE TYPES
export type ProductsListResponse = ListResponse<Product>;
export type CreateProductResponse = ApiResponse<Product>;
export type UpdateProductResponse = ApiResponse<Product>;
```

**3. Export from index:**

```typescript
// packages/types/src/index.ts
export * from "./products";
```

**Done!** Now use `CreateProductInput`, `CreateProductResponse`, etc. in API and frontend.

## Benefits

✅ **Single source of truth** - Database schema drives all types  
✅ **No duplication** - API and frontend use identical types  
✅ **Type safety** - TypeScript catches mismatches at compile time  
✅ **Consistent pattern** - Same structure for every domain  
✅ **Easy to extend** - Add new domain in ~20 lines of code  
✅ **Zod everywhere** - Same validation schema on client and server  
✅ **Clear separation** - Database entities vs. API contracts vs. domain types

## Best Practices

**DO:**

- ✅ Import entities from `@workspace/database` or domain packages
- ✅ Use generics (`ApiResponse<T>`, `ListResponse<T>`) as building blocks
- ✅ Export Zod schemas for validation
- ✅ Follow the 4-section pattern (entity, schemas, input types, responses)
- ✅ Include `message` in mutation responses for user feedback

**DON'T:**

- ❌ Define entity types in `@workspace/types` (they belong in database/domain packages)
- ❌ Create inline response types in API routes (use composed types)
- ❌ Duplicate Zod schemas (export from database package)

## Further Reading

- [Type System Architecture](/architecture/type-system)
- [Complete Type Flow](/architecture/type-flow)
- [Database Package](/packages/database)
