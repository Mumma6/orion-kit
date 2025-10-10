---
title: Type Flow
---

Complete guide to how types flow through the entire stack.

## The Golden Rule

**Zod schemas are the source of truth for INPUT types.**  
**Drizzle schemas are the source of truth for ENTITY types.**

## Type Flow Diagram

```
                    Drizzle Schema
                   (Database Definition)
                           │
              ┌────────────┴────────────┐
              │                         │
         Infer Types              Generate Zod
        (Task, User)           (insertTaskSchema)
              │                         │
              │                    Omit Fields
              │                (createTaskInputSchema)
              │                         │
              │                    z.infer Type
              │                 (CreateTaskInput)
              │                         │
              └────────────┬────────────┘
                           │
                  @workspace/types
                 (Central Export)
                           │
              ┌────────────┴────────────┐
              │                         │
          Backend                   Frontend
            API                         App
              │                         │
    ┌─────────┴─────────┐      ┌───────┴────────┐
    │                   │      │                 │
Validate Input    Return Data    Validate Form    Display Data
(Zod Schema)      (Task Type)   (Zod Schema)    (Task Type)
```

## Types by Purpose

### 1. Entity Types (FROM Database)

**Source:** Drizzle `$inferSelect`  
**Used for:** API responses, displaying data, database query results

```typescript
// Generated from Drizzle
export type Task = typeof tasks.$inferSelect;

// Used in
import type { Task } from "@workspace/types";

const tasks: Task[] = await db.select().from(tasks);
const response = { success: true, data: tasks };
```

### 2. Input Types (TO Database)

**Source:** Zod `z.infer`  
**Used for:** API requests, form validation, user input

```typescript
// Generated from Zod (which is generated from Drizzle)
export const createTaskInputSchema = insertTaskSchema.omit({
  id: true,
  clerkUserId: true,
  createdAt: true,
  updatedAt: true,
});

export type CreateTaskInput = z.infer<typeof createTaskInputSchema>;

// Used in
import { createTaskInputSchema } from "@workspace/types";
import type { CreateTaskInput } from "@workspace/types";

// Backend: Validate
const validated = createTaskInputSchema.parse(body);

// Frontend: Form
const form = useForm<CreateTaskInput>({
  resolver: zodResolver(createTaskInputSchema),
});
```

## Complete Example: Tasks

### Step 1: Database Schema (Drizzle)

```typescript
// packages/database/src/schema.ts
export const tasks = pgTable("tasks", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  clerkUserId: varchar("clerk_user_id", { length: 255 }).notNull(),
  title: varchar({ length: 255 }).notNull(),
  description: text(),
  status: taskStatusEnum().default("todo").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
```

### Step 2: Generate Types and Schemas

```typescript
// packages/database/src/schema.ts

// TypeScript type (for data FROM database)
export type Task = typeof tasks.$inferSelect;

// Zod schema (for data TO database)
export const insertTaskSchema = createInsertSchema(tasks, {
  title: (schema) => schema.min(1).max(255),
  description: (schema) => schema.max(1000),
});

// Zod schema for API input (omits auto-generated fields)
export const createTaskInputSchema = insertTaskSchema.omit({
  id: true,
  clerkUserId: true,
  createdAt: true,
  updatedAt: true,
});

// TypeScript type inferred from Zod
export type CreateTaskInput = z.infer<typeof createTaskInputSchema>;
```

### Step 3: Export from Types Package

```typescript
// packages/types/src/database.ts
export type { Task } from "@workspace/database";

// packages/types/src/tasks.ts
export { createTaskInputSchema } from "@workspace/database";
import { createTaskInputSchema } from "@workspace/database";
export type CreateTaskInput = z.infer<typeof createTaskInputSchema>;

// packages/types/src/index.ts
export * from "./database";
export * from "./tasks";
```

### Step 4: Use in Backend (API)

```typescript
// apps/api/app/tasks/route.ts
import { createTaskInputSchema } from "@workspace/database";
import type { CreateTaskInput, Task } from "@workspace/types";

export async function POST(request: Request) {
  const body = await request.json();

  // ✅ Zod validates at runtime
  const validated: CreateTaskInput = createTaskInputSchema.parse(body);

  // ✅ Safe to insert
  const [newTask]: Task = await db
    .insert(tasks)
    .values({
      clerkUserId: userId,
      ...validated,
    })
    .returning();

  return NextResponse.json({
    success: true,
    data: newTask, // newTask is Task type
  });
}
```

### Step 5: Use in Frontend (Forms)

```typescript
// apps/app/components/create-task-form.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTaskInputSchema } from "@workspace/types";
import type { CreateTaskInput } from "@workspace/types";

function CreateTaskForm() {
  // ✅ Same Zod schema as backend
  const form = useForm<CreateTaskInput>({
    resolver: zodResolver(createTaskInputSchema),
  });

  const onSubmit = async (data: CreateTaskInput) => {
    // data is already validated by Zod!
    await createTask.mutateAsync(data);
  };

  return <Form {...form}>...</Form>;
}
```

### Step 6: Display Data

```typescript
// apps/app/components/task-list.tsx
import type { Task } from "@workspace/types";

function TaskList({ tasks }: { tasks: Task[] }) {
  return (
    <>
      {tasks.map((task: Task) => (
        <div key={task.id}>
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          <span>{task.status}</span>
        </div>
      ))}
    </>
  );
}
```

## Type Cheat Sheet

### For Data FROM Database (Responses)

```typescript
import type { Task, UserPreference } from "@workspace/types";

// Use Drizzle-inferred types
const task: Task = await db.select().from(tasks).where(...);
```

### For Data TO Database (Requests)

```typescript
import { createTaskInputSchema } from "@workspace/types";
import type { CreateTaskInput } from "@workspace/types";

// Use Zod schema for validation
const validated: CreateTaskInput = createTaskInputSchema.parse(input);

// Use Zod-inferred type for typing
const formData: CreateTaskInput = { title: "...", description: "..." };
```

### For API Responses

```typescript
import type { CreateResponse, ListResponse } from "@workspace/types/api";
import type { Task } from "@workspace/types";

// Generic response wrapper
const response: CreateResponse<Task> = {
  success: true,
  message: "Created",
  data: task,
};
```

## Why This Architecture?

### ✅ Advantages

1. **Single Source of Truth**
   - Drizzle schema defines database structure
   - Zod schema generated from Drizzle
   - Types inferred from schemas

2. **Runtime Safety**
   - Zod validates all user input
   - Same validation on frontend and backend
   - Prevents invalid data reaching database

3. **Type Safety**
   - Full TypeScript coverage
   - Types inferred, not manual
   - Compile-time errors

4. **No Duplication**
   - Define schema once
   - Types and validation auto-generated
   - Used everywhere

5. **Maintainability**
   - Change schema in one place
   - Types update automatically
   - Validation updates automatically

### Common Patterns

**❌ Don't:**

```typescript
// Don't use InsertTask directly for API input
import type { InsertTask } from "@workspace/database";
const input: InsertTask = body; // Includes id, timestamps!

// Don't create manual types
type CreateTaskInput = { title: string; description: string };

// Don't skip validation
await db.insert(tasks).values(body); // No validation!
```

**✅ Do:**

```typescript
// Use Zod schema for validation
import { createTaskInputSchema } from "@workspace/types";
const validated = createTaskInputSchema.parse(body);

// Use Zod-inferred type for typing
import type { CreateTaskInput } from "@workspace/types";
const input: CreateTaskInput = validated;

// Use entity type for responses
import type { Task } from "@workspace/types";
const task: Task = await db.select()...;
```

## Summary

```
Input Data → Zod Schema → Validate → Zod-Inferred Type → Database
Output Data ← Drizzle Type ← Query ← Database
```

**Two sources of truth:**

1. **Drizzle** for entity structure (Task, UserPreference)
2. **Zod** for validation rules and input types (CreateTaskInput)

Both are generated from the same Drizzle schema, keeping everything in sync! 🎯
