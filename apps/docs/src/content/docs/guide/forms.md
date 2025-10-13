---
title: Forms with React Hook Form + Zod
---

# Forms with React Hook Form + Zod

Orion Kit uses **React Hook Form** with **Zod** validation for type-safe, performant forms.

## Why This Stack?

### React Hook Form

- ✅ Minimal re-renders (uncontrolled inputs)
- ✅ Built-in validation
- ✅ Great TypeScript support
- ✅ Easy error handling
- ✅ Industry standard

### Zod Integration

- ✅ Same validation rules on frontend and backend
- ✅ Instant client-side feedback
- ✅ Type-safe form data
- ✅ Single source of truth

## Architecture

```
Drizzle Schema
      ↓
  Zod Schema (generated)
      ↓
┌─────────────┬─────────────┐
│   Backend   │   Frontend  │
│  Validate   │  Validate   │
│  API input  │  Form input │
└─────────────┴─────────────┘
      Same Schema!
```

## Basic Usage

### 1. Import Form Components and Schema

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTaskInputSchema } from "@workspace/database";

type CreateTaskInput = Omit<
  import("@workspace/database").InsertTask,
  "id" | "clerkUserId" | "createdAt" | "updatedAt"
>;

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
```

### 2. Create Form Instance

```typescript
const form = useForm<CreateTaskInput>({
  resolver: zodResolver(createTaskInputSchema),
  defaultValues: {
    title: "",
    description: "",
    status: "todo",
  },
});
```

### 3. Handle Submit

```typescript
const createTask = useCreateTask();

const handleSubmit = async (data: CreateTaskInput) => {
  try {
    await createTask.mutateAsync(data);
    form.reset();
  } catch (error) {
    console.error(error);
  }
};
```

### 4. Render Form

```typescript
<Form {...form}>
  <form onSubmit={form.handleSubmit(handleSubmit)}>
    <FormField
      control={form.control}
      name="title"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Title</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />

    <Button type="submit" disabled={form.formState.isSubmitting}>
      Create
    </Button>
  </form>
</Form>
```

## Complete Example

```typescript
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import { useCreateTask } from "@/hooks/use-tasks";
import { createTaskInputSchema } from "@workspace/database";

type CreateTaskInput = Omit<
  import("@workspace/database").InsertTask,
  "id" | "clerkUserId" | "createdAt" | "updatedAt"
>;

export function CreateTaskForm() {
  const createTask = useCreateTask();

  const form = useForm<CreateTaskInput>({
    resolver: zodResolver(createTaskInputSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "todo",
      dueDate: null,
      completedAt: null,
    },
  });

  const onSubmit = async (data: CreateTaskInput) => {
    try {
      await createTask.mutateAsync(data);
      form.reset();
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Title Field */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter task title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description Field */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter description (optional)"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormDescription>
                Provide additional details about this task
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={createTask.isPending || form.formState.isSubmitting}
        >
          {createTask.isPending ? "Creating..." : "Create Task"}
        </Button>

        {/* Error Display */}
        {createTask.isError && (
          <p className="text-sm text-destructive">
            Failed to create task. Please try again.
          </p>
        )}
      </form>
    </Form>
  );
}
```

## Validation Flow

### Client-Side (Instant Feedback)

```
User types in form
       ↓
Zod validates on blur/change
       ↓
Show error immediately
       ↓
User fixes → Submit enabled
```

### Server-Side (Security)

```
Form submits
       ↓
API receives data
       ↓
Zod validates again (same schema!)
       ↓
Return 400 if invalid
       ↓
Save to database if valid
```

## Learn More

- [React Hook Form Docs](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)
- [shadcn/ui Form Component](https://ui.shadcn.com/docs/components/form)
- [Zod Validation Guide](/guide/zod)
