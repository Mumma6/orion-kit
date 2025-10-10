import {
  pgTable,
  varchar,
  text,
  timestamp,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

/**
 * Task Status Enum
 */
export const taskStatusEnum = pgEnum("task_status", [
  "todo",
  "in-progress",
  "completed",
  "cancelled",
]);

/**
 * Log Level Enum
 */
export const logLevelEnum = pgEnum("log_level", [
  "debug",
  "info",
  "warn",
  "error",
  "fatal",
]);

/**
 * User Preferences Table
 * Stores app-specific user settings and preferences
 * Links to Clerk user via clerkUserId
 */
export const userPreferences = pgTable("user_preferences", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  clerkUserId: varchar("clerk_user_id", { length: 255 }).notNull().unique(),

  // Preferences
  theme: varchar({ length: 50 }).default("system"),
  language: varchar({ length: 10 }).default("en"),
  timezone: varchar({ length: 100 }),

  // Notifications
  emailNotifications: varchar("email_notifications", { length: 50 }).default(
    "enabled"
  ),
  pushNotifications: varchar("push_notifications", { length: 50 }).default(
    "disabled"
  ),

  // Metadata
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Tasks Table
 * Stores user tasks and their details
 */
export const tasks = pgTable("tasks", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  clerkUserId: varchar("clerk_user_id", { length: 255 }).notNull(),

  // Task details
  title: varchar({ length: 255 }).notNull(),
  description: text(),
  status: taskStatusEnum().default("todo").notNull(),

  // Dates
  dueDate: timestamp("due_date"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Export types for use in app
export type UserPreference = typeof userPreferences.$inferSelect;
export type InsertUserPreference = typeof userPreferences.$inferInsert;

export type Task = typeof tasks.$inferSelect;
export type InsertTask = typeof tasks.$inferInsert;

// =============================================================================
// Zod Schemas (generated from Drizzle schemas)
// =============================================================================

/**
 * User Preferences Zod Schemas
 */
export const insertUserPreferenceSchema = createInsertSchema(userPreferences);
export const selectUserPreferenceSchema = createSelectSchema(userPreferences);

/**
 * Tasks Zod Schemas
 */
export const insertTaskSchema = createInsertSchema(tasks, {
  // Add custom validation rules using callbacks
  title: (schema) =>
    schema.min(1, "Title is required").max(255, "Title too long"),
  description: (schema) => schema.max(1000, "Description too long"),
});

export const selectTaskSchema = createSelectSchema(tasks);

/**
 * Create Task Input Schema
 * For API endpoints - picks only user-provided fields
 */
export const createTaskInputSchema = insertTaskSchema.pick({
  title: true,
  description: true,
  status: true,
  dueDate: true,
  completedAt: true,
});

/**
 * Update Task Input Schema
 * All fields optional except id
 */
export const updateTaskInputSchema = createTaskInputSchema.partial();

// =============================================================================
// Logs Table
// =============================================================================

/**
 * Logs Table
 * Stores application logs for monitoring and debugging
 */
export const logs = pgTable("logs", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),

  // Log details
  level: logLevelEnum().notNull(),
  message: text().notNull(),
  context: text(), // JSON string with additional context

  // Request details
  userId: varchar("user_id", { length: 255 }), // Clerk user ID if available
  requestId: varchar("request_id", { length: 255 }),
  method: varchar({ length: 10 }), // GET, POST, etc.
  path: varchar({ length: 500 }), // Request path
  statusCode: integer("status_code"),

  // Timing
  duration: integer(), // Request duration in ms

  // Error details
  errorMessage: text("error_message"),
  errorStack: text("error_stack"),

  // Metadata
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Export types
export type Log = typeof logs.$inferSelect;
export type InsertLog = typeof logs.$inferInsert;

// Zod schemas
export const insertLogSchema = createInsertSchema(logs);
export const selectLogSchema = createSelectSchema(logs);
