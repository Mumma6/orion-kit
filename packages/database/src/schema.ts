import {
  pgTable,
  varchar,
  text,
  timestamp,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const taskStatusEnum = pgEnum("task_status", [
  "todo",
  "in-progress",
  "completed",
  "cancelled",
]);

export const userPreferences = pgTable("user_preferences", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar("user_id", { length: 255 }).notNull().unique(),

  theme: varchar({ length: 50 }).default("system"),
  language: varchar({ length: 10 }).default("en"),
  timezone: varchar({ length: 100 }),

  defaultTaskStatus: varchar("default_task_status", { length: 50 }).default(
    "todo"
  ),

  emailNotifications: varchar("email_notifications", { length: 50 }).default(
    "enabled"
  ),
  taskReminders: varchar("task_reminders", { length: 50 }).default("enabled"),
  weeklyDigest: varchar("weekly_digest", { length: 50 }).default("disabled"),
  pushNotifications: varchar("push_notifications", { length: 50 }).default(
    "disabled"
  ),

  plan: varchar({ length: 50 }).default("free"),
  stripeCustomerId: varchar("stripe_customer_id", { length: 255 }),
  stripeSubscriptionId: varchar("stripe_subscription_id", { length: 255 }),
  stripeSubscriptionStatus: varchar("stripe_subscription_status", {
    length: 50,
  }),
  stripePriceId: varchar("stripe_price_id", { length: 255 }),
  stripeCurrentPeriodEnd: timestamp("stripe_current_period_end"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const tasks = pgTable("tasks", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar("user_id", { length: 255 }).notNull(),

  title: varchar({ length: 255 }).notNull(),
  description: text(),
  status: taskStatusEnum().default("todo").notNull(),

  dueDate: timestamp("due_date"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type UserPreference = typeof userPreferences.$inferSelect;
export type InsertUserPreference = typeof userPreferences.$inferInsert;

export type Task = typeof tasks.$inferSelect;
export type InsertTask = typeof tasks.$inferInsert;

export const insertUserPreferenceSchema = createInsertSchema(userPreferences);
export const selectUserPreferenceSchema = createSelectSchema(userPreferences);

export const insertTaskSchema = createInsertSchema(tasks, {
  title: (schema) =>
    schema.min(1, "Title is required").max(255, "Title too long"),
  description: (schema) => schema.max(1000, "Description too long"),
});

export const selectTaskSchema = createSelectSchema(tasks);

export const createTaskInputSchema = insertTaskSchema.pick({
  title: true,
  description: true,
  status: true,
  dueDate: true,
  completedAt: true,
});

export const updateTaskInputSchema = createTaskInputSchema.partial();

export const updateUserPreferencesSchema = selectUserPreferenceSchema
  .omit({
    id: true,
    userId: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial();

export const users = pgTable("users", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: varchar("image", { length: 255 }),
  password: varchar("password", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const accounts = pgTable("accounts", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  type: varchar("type", { length: 255 }).notNull(),
  provider: varchar("provider", { length: 255 }).notNull(),
  providerAccountId: varchar("provider_account_id", { length: 255 }).notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: varchar("token_type", { length: 255 }),
  scope: varchar("scope", { length: 255 }),
  id_token: text("id_token"),
  session_state: varchar("session_state", { length: 255 }),
});

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable("verification_tokens", {
  identifier: varchar("identifier", { length: 255 }).notNull(),
  token: varchar("token", { length: 255 }).notNull(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});
