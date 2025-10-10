/**
 * Zod Schemas
 * Re-exports Zod schemas from @workspace/database/schema
 *
 * IMPORTANT: Uses /schema export to avoid importing database client in browser
 */

// Re-export task schemas
export {
  createTaskInputSchema,
  updateTaskInputSchema,
  insertTaskSchema,
  selectTaskSchema,
} from "@workspace/database/schema";

// Re-export user preference schemas
export {
  insertUserPreferenceSchema,
  selectUserPreferenceSchema,
} from "@workspace/database/schema";
