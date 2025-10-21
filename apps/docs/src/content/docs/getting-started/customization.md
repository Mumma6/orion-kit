---
title: Customization Guide
description: Customize Orion Kit for your needs
---

Learn how to customize Orion Kit for your specific use case.

## 🎨 **UI & Branding**

### Update Colors & Theme

```typescript
// apps/app/tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#your-brand-color",
          foreground: "#ffffff",
        },
      },
    },
  },
};
```

### Replace Logo & Branding

```typescript
// apps/app/components/header.tsx
export function Header() {
  return (
    <header>
      <div className="flex items-center gap-2">
        <YourLogo className="h-8 w-8" />
        <span className="font-bold">Your Company</span>
      </div>
    </header>
  );
}
```

## 🗄️ **Database Schema**

### Add New Tables

```typescript
// packages/database/src/schema.ts
export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  userId: varchar("user_id", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Generate types
pnpm db:generate
```

### Update Existing Tables

```typescript
// Add new column to tasks
export const tasks = pgTable("tasks", {
  // ... existing columns
  priority: varchar("priority", { length: 20 }).default("medium"), // NEW
});

// Push changes
pnpm db:push
```

## 🔐 **Authentication**

### Custom User Fields

```typescript
// packages/database/src/schema.ts
export const users = pgTable("users", {
  // ... existing fields
  company: varchar("company", { length: 255 }), // NEW
  role: varchar("role", { length: 50 }).default("user"), // NEW
});
```

### Add Role-Based Access

```typescript
// packages/auth/src/server/user.ts
export async function requireRole(role: string) {
  const user = await getCurrentUser();
  if (user?.role !== role) {
    throw new Error("Insufficient permissions");
  }
  return user;
}
```

## 💳 **Payments & Billing**

### Custom Pricing Plans

```typescript
// apps/app/lib/pricing.ts
export const PRICING_PLANS = {
  starter: {
    name: "Starter",
    price: 9,
    features: ["Up to 5 projects", "Basic support"],
  },
  pro: {
    name: "Pro",
    price: 29,
    features: ["Unlimited projects", "Priority support", "Analytics"],
  },
};
```

### Add Usage Limits

```typescript
// packages/database/src/schema.ts
export const userLimits = pgTable("user_limits", {
  userId: varchar("user_id").primaryKey(),
  maxProjects: integer("max_projects").default(3),
  maxStorage: integer("max_storage").default(1000), // MB
});
```

## 📧 **Email Templates**

### Custom Welcome Email

```typescript
// packages/email/src/templates/welcome.tsx
export function WelcomeEmail({ name }: { name: string }) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to YourApp!</Preview>
      <Body>
        <Container>
          <Heading>Welcome to YourApp, {name}!</Heading>
          <Text>Thanks for signing up. Here's what you can do next:</Text>
          <ul>
            <li>Create your first project</li>
            <li>Invite team members</li>
            <li>Explore our features</li>
          </ul>
        </Container>
      </Body>
    </Html>
  );
}
```

## 🎯 **Business Logic**

### Add Custom Features

```typescript
// apps/api/app/projects/route.ts
export async function POST(req: Request) {
  const { userId } = await auth();
  const body = await req.json();

  // Your custom business logic
  const project = await db.insert(projects).values({
    ...body,
    userId,
    status: "active",
  });

  // Send notification
  await sendEmail({
    to: user.email,
    template: "project-created",
    data: { projectName: project.name },
  });

  return NextResponse.json({ success: true, data: project });
}
```

## 🧪 **Testing Your Changes**

```bash
# Run tests
pnpm test

# Test specific feature
pnpm test -- --grep "projects"

# E2E testing
pnpm test:e2e
```

## 📚 **Next Steps**

- [Deploy your changes](/getting-started/deployment)
- [Add integrations](/getting-started/integrations)
- [Learn architecture](/architecture/overview)

---

**Need help with customization?** [Open an issue](https://github.com/Mumma6/orion-kit/issues) or check our [Complete Documentation](/guide).
