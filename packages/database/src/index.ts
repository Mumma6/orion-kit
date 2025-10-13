export { db } from "./client";

export { userPreferences, tasks, taskStatusEnum } from "./schema";

export type {
  UserPreference,
  InsertUserPreference,
  Task,
  InsertTask,
} from "./schema";

export {
  insertUserPreferenceSchema,
  selectUserPreferenceSchema,
  updateUserPreferencesSchema,
  insertTaskSchema,
  selectTaskSchema,
  createTaskInputSchema,
  updateTaskInputSchema,
} from "./schema";

export { eq, and, or, not, isNull, isNotNull, desc, asc } from "drizzle-orm";
