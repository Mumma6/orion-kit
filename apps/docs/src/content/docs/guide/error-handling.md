---
title: Error Handling Strategy
---

# Error Handling Strategy

Complete guide to error handling in Orion Kit.

## Overview

Orion Kit uses multiple layers of error handling:

1. **React Error Boundaries** - Catch React component errors
2. **Toast Notifications** - User-friendly error messages (Sonner)
3. **Form Validation** - Zod validation with inline errors
4. **TanStack Query** - Automatic API error handling
5. **API Validation** - Server-side Zod validation

## Error Handling Layers

```
┌─────────────────────────────────────────┐
│      React Error Boundary               │
│  (Catches all React errors)             │
│  ┌───────────────────────────────────┐  │
│  │   TanStack Query                  │  │
│  │  (API errors, retries, caching)   │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │   Toast Notifications       │  │  │
│  │  │  (User-facing messages)     │  │  │
│  │  │  ┌───────────────────────┐  │  │  │
│  │  │  │  Form Validation      │  │  │  │
│  │  │  │  (Zod + inline msgs)  │  │  │  │
│  │  │  └───────────────────────┘  │  │  │
│  │  └─────────────────────────────┘  │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

## 1. Toast Notifications (Sonner)

### Setup

```typescript
// apps/app/app/layout.tsx
import { Toaster } from "sonner";

<Toaster richColors position="top-right" />
```

### Usage

```typescript
import { toast } from "sonner";
import { showSuccessToast, showErrorToast } from "@/lib/errors";

// Success
showSuccessToast("Task created", "Your task was created successfully");
toast.success("Task created");

// Error
showErrorToast(error, "Failed to create task");
toast.error("Failed to create task");

// Info
toast.info("Processing...");

// Loading
const toastId = toast.loading("Creating task...");
// Later
toast.success("Task created!", { id: toastId });
```

## 2. Form Validation Errors

### Inline Errors (FormMessage)

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
      <FormMessage />  {/* Shows Zod error automatically */}
    </FormItem>
  )}
/>
```

### Validation Happens:

- **On blur** - User leaves field
- **On change** - After first validation
- **On submit** - Before form submits

### Custom Error Messages

```typescript
const schema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title must be less than 255 characters"),
});
```

## 3. API Errors (TanStack Query)

### Automatic Error Handling

```typescript
export function useCreateTask() {
  return useMutation({
    mutationFn: createTask,
    onSuccess: (response) => {
      showSuccessToast("Task created", response.message);
    },
    onError: (error) => {
      showErrorToast(error, "Failed to create task");
    },
  });
}
```

### Manual Error Handling

```typescript
const createTask = useCreateTask();

try {
  await createTask.mutateAsync(data);
} catch (error) {
  // Handle specific errors
  if (error.message.includes("unauthorized")) {
    router.push("/sign-in");
  }
}
```

## Best Practices

### 1. Always Handle Errors in Mutations

```typescript
// ✅ Good
useMutation({
  mutationFn: createTask,
  onSuccess: () => showSuccessToast("Created!"),
  onError: (error) => showErrorToast(error),
});

// ❌ Bad (silent failures)
useMutation({
  mutationFn: createTask,
  // No error handling
});
```

### 2. Show User-Friendly Messages

```typescript
// ✅ Good
showErrorToast(error, "Failed to save your changes");

// ❌ Bad (technical jargon)
toast.error(`Error in POST /api/tasks: ${error.stack}`);
```

### 3. Log Errors for Debugging

```typescript
// ✅ Good
onError: (error) => {
  console.error("Create task failed:", error); // For devs
  showErrorToast(error, "Failed to create task"); // For users
};

// ❌ Bad (no logging)
onError: (error) => {
  showErrorToast(error);
  // Where did it fail? Unknown!
};
```

## Summary

✅ **Toast Notifications** - Sonner for user-facing messages  
✅ **Form Validation** - Zod with inline errors  
✅ **TanStack Query** - Automatic retry and error states  
✅ **Error Boundaries** - Catch React crashes  
✅ **Consistent formatting** - Error utilities  
✅ **User-friendly** - Clear, actionable messages  
✅ **Developer-friendly** - Console logging for debugging

Every error is handled gracefully! 🎯
