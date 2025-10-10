/**
 * Database Types
 * Re-exports types from @workspace/database/schema for convenience
 * Uses /schema export to avoid importing database client in browser
 */

// Re-export all database types
export type {
  Task,
  InsertTask,
  UserPreference,
  InsertUserPreference,
} from "@workspace/database/schema";
