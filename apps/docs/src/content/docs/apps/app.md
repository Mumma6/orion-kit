---
title: Main Application
description: User dashboard with tasks, billing, analytics, and settings
---

The main application (`apps/app`) is the user-facing dashboard for task management, analytics, billing, and settings.

**Framework**: Next.js 15 with App Router  
**Port**: `3001` (development)  
**Authentication**: Custom JWT with localStorage + Authorization headers  
**Styling**: Tailwind CSS with shadcn/ui components

## Structure

```
apps/app/
├── app/
│   ├── dashboard/
│   │   ├── analytics/page.tsx     # Analytics dashboard
│   │   ├── billing/page.tsx       # Billing and subscriptions
│   │   ├── settings/page.tsx      # User settings
│   │   ├── tasks/page.tsx         # Task management
│   │   ├── layout.tsx             # Dashboard layout
│   │   └── page.tsx               # Dashboard home
│   ├── login/page.tsx             # Login page
│   ├── signup/page.tsx            # Sign-up page
│   ├── error.tsx                  # Error boundary
│   ├── global-error.tsx           # Global error handler
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Landing/redirect page
│   └── providers.tsx              # React providers
├── components/
│   ├── analytics/                 # Analytics components
│   ├── billing/                   # Billing components
│   ├── dashboard/                 # Dashboard layout components
│   ├── settings/                  # Settings components
│   ├── tasks/                     # Task management components
│   ├── error-fallback.tsx         # Error fallback component
│   └── mode-toggle.tsx            # Dark/light mode toggle
├── hooks/
│   ├── use-billing.ts             # Billing hooks
│   ├── use-settings.ts            # Settings hooks
│   └── use-tasks.ts               # Task management hooks
├── lib/
│   ├── api/                       # API client functions
│   └── errors.ts                  # Error handling utilities
└── package.json                   # Dependencies and scripts
```

## Pages

### **Dashboard Home** (`/dashboard`)

- Welcome message with user's first name
- Task statistics (total, completed, in progress, todo)
- Recent tasks preview with status indicators
- Quick actions to create new tasks

### **Tasks** (`/dashboard/tasks`)

- Task list with filtering and search
- Status management (todo, in-progress, completed)
- Create task dialog with form validation
- Edit task sheet with inline editing
- Delete tasks with confirmation
- Task statistics and progress tracking

### **Analytics** (`/dashboard/analytics`)

- Task completion rate over time
- Weekly/monthly statistics
- Status breakdown with visual charts
- Recent activity timeline
- Productivity insights and trends

### **Billing** (`/dashboard/billing`)

- Current plan display with features
- Pricing cards for plan upgrades
- Stripe Checkout integration
- Billing portal for subscription management
- Webhook status indicator
- Payment history and invoices

### **Settings** (`/dashboard/settings`)

- Profile management (name, email, avatar)
- Task preferences (default status, notifications)
- Notification settings (email, reminders, digest)
- Account settings and preferences

## Components

### **Dashboard Layout**

```typescript
export function DashboardContent() {
  const { data: authData, isPending: userLoading } = useAuth();
  const user = authData?.data || null;
  const { data: tasks, isLoading: tasksLoading, error, refetch } = useTasks();

  const isLoading = userLoading || tasksLoading;

  if (isLoading) {
    return <DashboardLoading />;
  }

  if (!user) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please log in</h2>
          <p className="text-muted-foreground">
            You need to be logged in to access the dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <DashboardWelcome name={user?.name || ""} />

      {error && <DashboardError error={error} onRetry={refetch} />}

      {!error && tasks && (
        <>
          <DashboardStats
            total={tasks.total}
            completed={tasks.completed}
            inProgress={tasks.inProgress}
            todo={tasks.todo}
          />
          <DashboardTasksPreview tasks={tasks.data} />
        </>
      )}
    </div>
  );
}
```

### **Task Management**

```typescript
export function TasksContent() {
  const { data: tasks, isLoading, error } = useTasks();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  return (
    <div className="space-y-6">
      <TasksStats data={tasks} />
      <TasksFilters {...filterProps} />
      <TasksTable
        tasks={tasks}
        onEditTask={handleEditTask}
        onStatusChange={handleStatusChange}
        onDeleteTask={handleDeleteTask}
      />
    </div>
  );
}
```

### **Billing Interface**

```typescript
export function BillingContent() {
  const { data: subscription } = useSubscription();
  const checkout = useCheckout();
  const billingPortal = useBillingPortal();

  const handleUpgrade = async (priceId: string) => {
    await checkout.mutateAsync(priceId);
  };

  return (
    <div className="space-y-6">
      <CurrentPlanCard
        currentPlan={userPlan}
        subscription={subscription}
        onManageBilling={handleManageBilling}
      />
      <PricingCards onUpgrade={handleUpgrade} />
    </div>
  );
}
```

## Data Fetching

Uses TanStack Query for server state management:

```typescript
export function useTasks() {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      showSuccessToast("Task created successfully");
    },
    onError: (error) => {
      showErrorToast(error, "Failed to create task");
    },
  });
}
```

## Form Handling

Uses React Hook Form with Zod validation:

```typescript
export function CreateTaskDialog({ open, onOpenChange }: CreateTaskDialogProps) {
  const form = useForm<CreateTaskInput>({
    resolver: zodResolver(createTaskInputSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'todo',
    },
  });

  const createTask = useCreateTask();

  const onSubmit = async (data: CreateTaskInput) => {
    await createTask.mutateAsync(data);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
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
            {/* More form fields... */}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
```

## Error Handling

Comprehensive error handling with fallbacks:

```typescript
export function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <AlertTriangle className="h-12 w-12 text-destructive" />
      <div className="text-center space-y-2">
        <h2 className="text-lg font-semibold">Something went wrong</h2>
        <p className="text-muted-foreground">
          {getErrorMessage(error)}
        </p>
      </div>
      <Button onClick={resetErrorBoundary} variant="outline">
        Try again
      </Button>
    </div>
  );
}
```

## Authentication

Custom JWT authentication with automatic login after registration:

```typescript
export function useRegister() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (input: RegisterInput) => {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
        credentials: "include",
      });
      return response.json();
    },
    onSuccess: (data) => {
      // Store token in localStorage for cross-origin compatibility
      localStorage.setItem("auth_token", data.token);

      queryClient.invalidateQueries({ queryKey: authKeys.user() });
      router.push("/dashboard");
    },
  });
}
```

## Environment Variables

```bash
NEXT_PUBLIC_API_URL=http://localhost:3002
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_STRIPE_PRICE_ID_PRO=price_...
NEXT_PUBLIC_STRIPE_PRICE_ID_ENTERPRISE=price_...
NEXT_PUBLIC_POSTHOG_KEY=ph_...
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

## Development

### **Start Development Server**

```bash
cd apps/app
pnpm dev
```

Application runs on `http://localhost:3001`

### **Authentication Flow**

1. Visit `http://localhost:3001`
2. Redirected to `/login` if not authenticated
3. Sign in with email/password or register new account
4. Automatically redirected to `/dashboard` after authentication

### **API Integration**

```typescript
const api = {
  get: <T>(endpoint: string) => {
    const token = localStorage.getItem("auth_token");
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      credentials: "include",
    }).then((res) => res.json()) as Promise<T>;
  },

  post: <T>(endpoint: string, data: unknown) => {
    const token = localStorage.getItem("auth_token");
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      credentials: "include",
      body: JSON.stringify(data),
    }).then((res) => res.json()) as Promise<T>;
  },
};
```

## Production Deployment

### **Vercel Deployment**

```bash
cd apps/app
vercel --prod
```

### **Environment Variables**

Set production environment variables in Vercel:

- `NEXT_PUBLIC_API_URL` - Production API URL
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `NEXT_PUBLIC_STRIPE_PRICE_ID_PRO` - Pro plan price ID
- `NEXT_PUBLIC_STRIPE_PRICE_ID_ENTERPRISE` - Enterprise plan price ID
- `NEXT_PUBLIC_POSTHOG_KEY` - PostHog analytics key

### **Custom Domain**

Configure custom domain in Vercel: `app.orion-kit.dev`

## Performance

### **Code Splitting**

Automatic code splitting with Next.js App Router:

```typescript
const AnalyticsChart = lazy(() => import('./analytics-chart'));

export function AnalyticsPage() {
  return (
    <Suspense fallback={<AnalyticsLoading />}>
      <AnalyticsChart />
    </Suspense>
  );
}
```

### **Caching**

TanStack Query provides intelligent caching:

```typescript
export function useTasks() {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
}
```

## Related

- [API Application](/apps/api)
- [UI Package](/packages/ui)
- [Types Package](/packages/types)
- [Auth Package](/packages/auth)
- [Payment Package](/packages/payment)
