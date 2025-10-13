---
title: Zod Validation
---

# Zod Validation

Runtime validation with **Zod**, auto-generated from Drizzle schemas.

## Available Schemas

```typescript
import {
  createTaskInputSchema, // POST (omits id, timestamps)
  updateTaskInputSchema, // PATCH (all optional)
  insertTaskSchema, // Full insert
  selectTaskSchema, // From DB
} from "@workspace/database";
```

## API Usage

```typescript
import { createTaskInputSchema } from "@workspace/database";
import { validationErrorResponse } from "@/lib/validation";
import { ZodError } from "zod";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = createTaskInputSchema.parse(body);

    const [task] = await db
      .insert(tasks)
      .values({ ...validated, clerkUserId: userId })
      .returning();

    return NextResponse.json({ success: true, data: task });
  } catch (error) {
    if (error instanceof ZodError) {
      return validationErrorResponse(error);
    }
    throw error;
  }
}
```

## Best Practices

**DO:**

- ✅ Validate all user input
- ✅ Use `createTaskInputSchema` for API input
- ✅ Use `updateTaskInputSchema` for updates

**DON'T:**

- ❌ Validate data from your own DB (unnecessary)
- ❌ Use `insertTaskSchema` for API input (missing required fields)

See [Zod docs](https://zod.dev) for more.
