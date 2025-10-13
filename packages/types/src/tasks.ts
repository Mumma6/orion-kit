/**
 * Task-specific Response Types
 * Composed from generic API responses and domain types
 */

import type { Task } from "@workspace/database";
import type { ListResponse, CreateResponse, UpdateResponse } from "./api";

// Task input types (for API requests)
export type CreateTaskInput = Omit<
  import("@workspace/database").InsertTask,
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
