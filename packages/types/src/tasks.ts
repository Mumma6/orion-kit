import type { Task, InsertTask } from "@workspace/database/schema";
import type { ApiResponse, ListResponse } from "./api";

export type { Task } from "@workspace/database/schema";

export {
  createTaskInputSchema,
  updateTaskInputSchema,
} from "@workspace/database/schema";

export type CreateTaskInput = Omit<
  InsertTask,
  "id" | "clerkUserId" | "createdAt" | "updatedAt"
>;

export type UpdateTaskInput = Partial<CreateTaskInput>;

export type TaskResponse = ApiResponse<Task>;

export interface TasksListResponse extends ListResponse<Task> {
  userId: string;
  userName: string;
  completed: number;
  inProgress: number;
  todo: number;
}

export type CreateTaskResponse = ApiResponse<Task>;
export type UpdateTaskResponse = ApiResponse<Task>;

export type DeleteTaskResponse = ApiResponse<{ deleted: true }>;
