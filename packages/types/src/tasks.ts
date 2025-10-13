/**
 * Tasks Domain
 * Combines: Database entity + Zod schemas + API responses
 */

import type { Task, InsertTask } from "@workspace/database/schema";
import type { ApiResponse, ListResponse } from "./api";

// ============================================
// ENTITY (from database)
// ============================================
export type { Task } from "@workspace/database/schema";

// ============================================
// INPUT SCHEMAS (Zod - for validation)
// ============================================
export {
  createTaskInputSchema,
  updateTaskInputSchema,
} from "@workspace/database/schema";

// ============================================
// INPUT TYPES (TypeScript - for API requests)
// ============================================
export type CreateTaskInput = Omit<
  InsertTask,
  "id" | "clerkUserId" | "createdAt" | "updatedAt"
>;

export type UpdateTaskInput = Partial<CreateTaskInput>;

// ============================================
// API RESPONSE TYPES (composed with generics)
// ============================================

/** Single task response */
export type TaskResponse = ApiResponse<Task>;

/** List response with task-specific metadata */
export interface TasksListResponse extends ListResponse<Task> {
  userId: string;
  userName: string;
  completed: number;
  inProgress: number;
  todo: number;
}

/** Create/Update/Delete responses */
export type CreateTaskResponse = ApiResponse<Task>;
export type UpdateTaskResponse = ApiResponse<Task>;

/** Delete response */
export type DeleteTaskResponse = ApiResponse<{ deleted: true }>;
