/**
 * Tasks API Types
 * Pure TypeScript types for tasks
 *
 * For Zod schemas, import from this package:
 * import { createTaskInputSchema, updateTaskInputSchema } from "@workspace/types"
 */

import type { Task, InsertTask } from "./database";
import type { ListResponse, CreateResponse } from "./api";

/**
 * Input for creating a task
 * Derived from Drizzle InsertTask, omitting auto-generated fields
 *
 * Use with createTaskInputSchema for validation
 */
export type CreateTaskInput = Omit<
  InsertTask,
  "id" | "clerkUserId" | "createdAt" | "updatedAt"
>;

/**
 * Input for updating a task
 * All fields from CreateTaskInput but optional
 *
 * Use with updateTaskInputSchema for validation
 */
export type UpdateTaskInput = Partial<CreateTaskInput>;

/**
 * Response for fetching tasks list
 * Extends generic ListResponse with task-specific statistics
 */
export interface TasksListResponse extends ListResponse<Task> {
  userId: string;
  userName: string;
  completed: number;
  inProgress: number;
  todo: number;
}

/**
 * Response for creating a task
 */
export type CreateTaskResponse = CreateResponse<Task>;

/**
 * Response for updating a task
 */
export type UpdateTaskResponse = CreateResponse<Task>;
