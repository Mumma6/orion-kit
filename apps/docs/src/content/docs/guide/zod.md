---
title: Zod Integration - Quick Reference
---

# Zod Integration - Quick Reference

Orion Kit uses **Zod** for runtime validation, integrated seamlessly with Drizzle schemas.

## 📋 Quick Start

### In API Routes

```typescript
import { createTaskInputSchema } from "@workspace/database";
import { validationErrorResponse } from "@/lib/validation";
import { ZodError } from "zod";

export async function POST(request: Request) {
  const body = await request.json();

  // Validate with Zod
  try {
    const validatedData = createTaskInputSchema.parse(body);

    // Use validated data
    const [newTask] = await db
      .insert(tasks)
      .values({
        clerkUserId: userId,
        ...validatedData,
      })
      .returning();

    return NextResponse.json({ success: true, data: newTask });
  } catch (error) {
    if (error instanceof ZodError) {
      return validationErrorResponse(error);
    }
    throw error;
  }
}
```

## 📚 Available Schemas

### Tasks

```typescript
import {
  createTaskInputSchema, // For POST requests (omits auto-generated fields)
  updateTaskInputSchema, // For PATCH requests (all fields optional)
  insertTaskSchema, // Full insert schema
  selectTaskSchema, // Select schema (from DB)
} from "@workspace/database";
```

### User Preferences

```typescript
import {
  insertUserPreferenceSchema,
  selectUserPreferenceSchema,
} from "@workspace/database";
```

## 🎯 Validation Rules

### Built-in Rules

```typescript
// Auto-generated from Drizzle schema with custom rules
createTaskInputSchema.parse({
  title: "Task title", // Required, 1-255 chars
  description: "Description", // Optional, max 1000 chars
  status: "todo", // Enum: todo | in-progress | completed | cancelled
  dueDate: "2024-02-01", // Optional ISO date
});
```

### Custom Validation

```typescript
// Extend schemas for custom rules
const customSchema = createTaskInputSchema.extend({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .regex(/^[A-Z]/, "Title must start with capital letter"),
});
```

## ⚠️ Error Handling

### Error Response Format

```json
{
  "success": false,
  "error": "Validation failed",
  "issues": [
    {
      "path": "title",
      "message": "Title is required"
    }
  ]
}
```

### Using Helper

```typescript
import { validationErrorResponse } from "@/lib/validation";

try {
  const data = schema.parse(input);
} catch (error) {
  if (error instanceof ZodError) {
    return validationErrorResponse(error); // Auto-formatted response
  }
  throw error;
}
```

## ✅ Best Practices

### DO ✅

```typescript
// ✅ Validate user input from requests
const body = await request.json();
const validated = createTaskInputSchema.parse(body);

// ✅ Use appropriate schemas
createTaskInputSchema  // For API input (omits id, timestamps)
updateTaskInputSchema  // For updates (all optional)

// ✅ Handle Zod errors specifically
catch (error) {
  if (error instanceof ZodError) {
    return validationErrorResponse(error);
  }
  throw error;
}
```

### DON'T ❌

```typescript
// ❌ Don't validate data from your own database
const tasks = await db.select().from(tasks);
const validated = selectTaskSchema.parse(tasks[0]); // Unnecessary!

// ❌ Don't use insertTaskSchema for API input
insertTaskSchema.parse(body); // Fails - missing id, createdAt, etc.

// ❌ Don't catch all errors generically
catch (error) {
  return NextResponse.json({ error: "Invalid" }); // Not helpful!
}
```

## 🔧 Common Patterns

### Safe Parse (No Throw)

```typescript
const result = createTaskInputSchema.safeParse(body);

if (!result.success) {
  return validationErrorResponse(result.error);
}

const validatedData = result.data;
```

### Partial Validation

```typescript
// Make all fields optional
const partialSchema = createTaskInputSchema.partial();

// Make specific fields optional
const schema = createTaskInputSchema.partial({
  description: true,
  dueDate: true,
});
```

### Transform Data

```typescript
const schema = createTaskInputSchema.transform((data) => ({
  ...data,
  title: data.title.trim().toLowerCase(),
}));
```

## 📖 Learn More

- [Zod Docs](https://zod.dev/)
- [drizzle-zod](https://orm.drizzle.team/docs/zod)
