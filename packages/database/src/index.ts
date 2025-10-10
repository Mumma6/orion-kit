/**
 * Main entry point for @workspace/database
 * Exports database client, schema, types, and Zod schemas
 */

// Export database client
export { db } from "./client";

// Export schema tables and enums
export {
  userPreferences,
  tasks,
  taskStatusEnum,
  logs,
  logLevelEnum,
} from "./schema";

// Export types (these are inferred from Drizzle schemas)
export type {
  UserPreference,
  InsertUserPreference,
  Task,
  InsertTask,
  Log,
  InsertLog,
} from "./schema";

// Export Zod schemas for runtime validation (types inferred where used)
export {
  insertUserPreferenceSchema,
  selectUserPreferenceSchema,
  insertTaskSchema,
  selectTaskSchema,
  createTaskInputSchema,
  updateTaskInputSchema,
  insertLogSchema,
  selectLogSchema,
} from "./schema";

// Re-export useful Drizzle operators
export { eq, and, or, not, isNull, isNotNull, desc, asc } from "drizzle-orm";

// Re-export Zod types for consistent type resolution across the monorepo
export { type ZodError, type ZodIssue } from "zod";
