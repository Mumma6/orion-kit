---
title: Error Handling
---

Multi-layer error handling: **Sonner toasts**, **Zod validation**, **TanStack Query**, **Error Boundaries**.

## Toast Notifications

```typescript
import { toast } from "sonner";
import { showSuccessToast, showErrorToast } from "@/lib/errors";

showSuccessToast("Task created");
showErrorToast(error, "Failed to create task");
```

Setup: `<Toaster />` in `app/layout.tsx`

## Form Validation

```typescript
<FormField
  control={form.control}
  name="title"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Title</FormLabel>
      <FormControl>
        <Input {...field} />
      </FormControl>
      <FormMessage />  {/* Auto-shows Zod errors */}
    </FormItem>
  )}
/>
```

## API Error Handling

```typescript
export function useCreateTask() {
  return useMutation({
    mutationFn: createTask,
    onSuccess: () => showSuccessToast("Created!"),
    onError: (error) => showErrorToast(error, "Failed to create task"),
  });
}
```

## Best Practices

**DO:**

- ✅ Handle errors in mutations (`onError`)
- ✅ Show user-friendly messages
- ✅ Log errors to console for debugging

**DON'T:**

- ❌ Silent failures (no error handling)
- ❌ Technical jargon in user messages
- ❌ Skip logging (hard to debug)
