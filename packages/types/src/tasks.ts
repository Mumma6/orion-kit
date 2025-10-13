/**
 * Task-specific Response Types
 * Composed from generic API responses and domain types
 */

import type { Task } from "@workspace/database/schema";
import { InsertTask } from "@workspace/database/schema";
import type { ListResponse, CreateResponse, UpdateResponse } from "./api";

// Re-export schemas and types from database/schema (avoids importing client)
export {
  createTaskInputSchema,
  updateTaskInputSchema,
} from "@workspace/database/schema";
export type { Task } from "@workspace/database/schema";

// Task input types (for API requests)
export type CreateTaskInput = Omit<
  InsertTask,
  "id" | "clerkUserId" | "createdAt" | "updatedAt"
>;

export type UpdateTaskInput = Partial<CreateTaskInput>;

// Task response types (for API responses)
export interface TasksListResponse extends ListResponse<Task> {
  userId: string;
  userName: string;
  completed: number;
  inProgress: number;
  todo: number;
}

export type CreateTaskResponse = CreateResponse<Task>;
export type UpdateTaskResponse = UpdateResponse<Task>;
