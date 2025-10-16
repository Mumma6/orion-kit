---
title: Database Studio
description: Drizzle Studio for database management and development
---

The database studio (`apps/studio`) provides a web-based interface for managing the PostgreSQL database using Drizzle Studio. You could just as easily look at the database in the Neon dashboard.

**Purpose**: Database management and development interface  
**Tool**: Drizzle Studio  
**Port**: `3003` (development)  
**Database**: Neon PostgreSQL  
**Access**: Local development only

## Structure

```
apps/studio/
├── drizzle.config.ts              # Drizzle configuration
├── package.json                   # Dependencies and scripts
└── tsconfig.json                  # TypeScript configuration
```

## Configuration

### **Drizzle Configuration**

```typescript
// apps/studio/drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "../packages/database/src/schema.ts",
  out: "../packages/database/drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});
```

### **Package Configuration**

```json
{
  "name": "studio",
  "scripts": {
    "dev": "drizzle-kit studio",
    "studio": "drizzle-kit studio"
  },
  "dependencies": {
    "drizzle-kit": "^0.28.1"
  }
}
```

## Features

### **Database Browser**

- **Table Explorer** - View all tables and their structure
- **Data Viewer** - Browse and edit table data
- **Relationship Viewer** - Visualize table relationships
- **Query Editor** - Execute SQL queries directly

### **Schema Management**

- **Schema Visualization** - Visual representation of database schema
- **Column Details** - View column types, constraints, and indexes
- **Foreign Keys** - See relationships between tables
- **Indexes** - View database indexes and their usage

### **Data Operations**

- **CRUD Operations** - Create, read, update, delete records
- **Bulk Operations** - Import/export data
- **Data Validation** - Ensure data integrity
- **Search and Filter** - Find specific records

## Usage

### **Start Studio**

```bash
cd apps/studio
pnpm dev
```

Studio runs on `http://localhost:5555`

### **Alternative Start**

```bash
# From root directory
pnpm db:studio
```

### **Database Connection**

Studio connects to the database using `DATABASE_URL` from environment variables:

```bash
# apps/studio/.env.local
DATABASE_URL=postgresql://username:password@host:port/database
```

## Database Schema

### **Tables Overview**

| Table              | Purpose         | Key Fields                           |
| ------------------ | --------------- | ------------------------------------ |
| `tasks`            | Task management | `id`, `title`, `status`, `userId`    |
| `user_preferences` | User settings   | `userId`, `plan`, `stripeCustomerId` |

### **Tasks Table**

```sql
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'todo',
  clerk_user_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### **User Preferences Table**

```sql
CREATE TABLE user_preferences (
  id SERIAL PRIMARY KEY,
  clerk_user_id VARCHAR(255) UNIQUE NOT NULL,
  plan VARCHAR(50) DEFAULT 'free',
  default_status VARCHAR(50) DEFAULT 'todo',
  email_notifications BOOLEAN DEFAULT true,
  task_reminders BOOLEAN DEFAULT false,
  weekly_digest BOOLEAN DEFAULT true,
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  stripe_subscription_status VARCHAR(50),
  stripe_price_id VARCHAR(255),
  stripe_current_period_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Common Operations

### **View Data**

1. Open Drizzle Studio
2. Navigate to the `tasks` table
3. Browse existing records
4. Use filters to find specific data

### **Add Test Data**

```sql
-- Insert test tasks
INSERT INTO tasks (title, description, status, clerk_user_id) VALUES
('Complete documentation', 'Finish the Orion Kit docs', 'in-progress', 'user_123'),
('Setup production', 'Deploy to production environment', 'todo', 'user_123'),
('Review code', 'Code review for new features', 'completed', 'user_123');

-- Insert test user preferences
INSERT INTO user_preferences (clerk_user_id, plan, default_status) VALUES
('user_123', 'pro', 'todo');
```

### **Update Records**

```sql
-- Update task status
UPDATE tasks
SET status = 'completed', updated_at = NOW()
WHERE id = 1;

-- Update user plan
UPDATE user_preferences
SET plan = 'enterprise', updated_at = NOW()
WHERE clerk_user_id = 'user_123';
```

### **Delete Records**

```sql
-- Delete completed tasks
DELETE FROM tasks WHERE status = 'completed';

-- Delete user preferences
DELETE FROM user_preferences WHERE clerk_user_id = 'user_123';
```

## Development Workflow

### **Schema Changes**

1. **Modify Schema** - Update `packages/database/src/schema.ts`
2. **Generate Migration** - Run `pnpm db:generate`
3. **Apply Migration** - Run `pnpm db:migrate`
4. **View Changes** - Open Drizzle Studio to see updates

### **Data Seeding**

Create seed data for development:

```typescript
// packages/database/src/seed.ts
import { db, tasks, userPreferences } from "./schema";

export async function seedDatabase() {
  // Insert seed data
  await db.insert(tasks).values([
    {
      title: "Setup project",
      description: "Initialize Orion Kit project",
      status: "completed",
      userId: "user_123",
    },
    {
      title: "Add authentication",
      description: "Integrate Clerk authentication",
      status: "in-progress",
      userId: "user_123",
    },
  ]);

  await db.insert(userPreferences).values({
    userId: "user_123",
    plan: "free",
    defaultStatus: "todo",
  });
}
```

### **Testing Data**

Use Studio to verify test data:

```sql
-- Check task counts by status
SELECT status, COUNT(*) as count
FROM tasks
GROUP BY status;

-- Check user plans
SELECT plan, COUNT(*) as count
FROM user_preferences
GROUP BY plan;
```

## Security Considerations

### **Development Only**

Drizzle Studio should **only** be used in development:

- ❌ **Never deploy** to production
- ❌ **Never expose** to public networks
- ❌ **Never use** with production data
- ✅ **Local development** only
- ✅ **Test data** only

### **Environment Variables**

Ensure proper environment variable management:

```bash
# Development only
DATABASE_URL=postgresql://localhost:5432/orion_dev

# Never use production URL in studio
# DATABASE_URL=postgresql://prod-server:5432/orion_prod
```

## Troubleshooting

### **Connection Issues**

If Studio can't connect to database:

1. **Check DATABASE_URL** - Ensure correct connection string
2. **Verify Database** - Confirm database is running
3. **Check Network** - Ensure database is accessible
4. **Review Logs** - Check for connection errors

### **Schema Sync Issues**

If schema doesn't match:

1. **Regenerate Types** - Run `pnpm db:generate`
2. **Apply Migrations** - Run `pnpm db:migrate`
3. **Restart Studio** - Close and reopen Drizzle Studio
4. **Check Config** - Verify `drizzle.config.ts`

### **Performance Issues**

For large datasets:

1. **Use Filters** - Filter data to reduce load
2. **Limit Results** - Use pagination
3. **Optimize Queries** - Use indexes
4. **Close Unused Tabs** - Reduce memory usage

## Integration with Development

### **Database Migrations**

Studio works with Drizzle migrations:

```bash
# Generate migration after schema changes
pnpm db:generate

# Apply migration to database
pnpm db:migrate

# View changes in studio
pnpm db:studio
```

### **Type Generation**

Studio reflects generated types:

```bash
# Generate types from schema
pnpm db:generate

# Types are available in packages/database/src/
```

### **Testing**

Use Studio for manual testing:

1. **Create test data** in Studio
2. **Test API endpoints** with test data
3. **Verify changes** in Studio
4. **Clean up** test data when done

## Related

- [Database Package](/packages/database)
- [API Application](/apps/api)
- [Main Application](/apps/app)
- [Database Guide](/guide/database)
