---
title: Forms
---

# Forms with React Hook Form + Zod

Type-safe forms with **React Hook Form** + **Zod**. Same validation schema on frontend and backend.

## Quick Example

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTaskInputSchema } from "@workspace/database";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@workspace/ui/components/form";

type CreateTaskInput = Omit<
  import("@workspace/database").InsertTask,
  "id" | "clerkUserId" | "createdAt" | "updatedAt"
>;

export function CreateTaskForm() {
  const createTask = useCreateTask();

  const form = useForm<CreateTaskInput>({
    resolver: zodResolver(createTaskInputSchema),
    defaultValues: { title: "", status: "todo" },
  });

  const onSubmit = async (data: CreateTaskInput) => {
    await createTask.mutateAsync(data);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
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
        <Button type="submit" disabled={createTask.isPending}>
          Create
        </Button>
      </form>
    </Form>
  );
}
```

## Validation Flow

```
User types → Zod validates on blur → Show error → Submit to API → Zod validates again → Save to DB
```

**Same schema both places = guaranteed consistency.**

See [React Hook Form docs](https://react-hook-form.com) and [Zod guide](/guide/zod) for more.
